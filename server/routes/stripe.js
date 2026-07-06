const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const supabase = require('../services/supabase');
const authMiddleware = require('../middleware/auth');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_TO_PLAN = {
  [process.env.STRIPE_STARTER_MONTHLY_PRICE_ID]: 'starter',
  [process.env.STRIPE_STARTER_ANNUAL_PRICE_ID]: 'starter',
  [process.env.STRIPE_PRO_MONTHLY_PRICE_ID]: 'pro',
  [process.env.STRIPE_PRO_ANNUAL_PRICE_ID]: 'pro',
};

// POST /api/stripe/create-checkout — create a Stripe Checkout session
router.post('/create-checkout', authMiddleware, async (req, res) => {
  const { priceId } = req.body;
  if (!priceId) return res.status(400).json({ error: 'priceId required' });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/account?checkout=success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/pricing`,
      metadata: { userId: req.user.id },
      subscription_data: { metadata: { userId: req.user.id } },
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stripe/portal — create a Stripe billing portal session
router.post('/portal', authMiddleware, async (req, res) => {
  try {
    const { data: userRow } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', req.user.id)
      .single();

    if (!userRow?.stripe_customer_id) {
      return res.status(400).json({ error: 'No Stripe customer found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: userRow.stripe_customer_id,
      return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/account`,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stripe/webhook — Stripe lifecycle events
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        if (!userId) break;

        // Store Stripe customer ID
        await supabase
          .from('users')
          .update({ stripe_customer_id: session.customer })
          .eq('id', userId);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        const priceId = sub.items.data[0]?.price.id;
        const plan = PRICE_TO_PLAN[priceId] || 'free';
        const status = sub.status;

        await supabase.from('users').update({
          plan: status === 'active' || status === 'trialing' ? plan : 'free',
          stripe_subscription_id: sub.id,
          subscription_status: status,
        }).eq('id', userId);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await supabase.from('users').update({
          plan: 'free',
          subscription_status: 'canceled',
        }).eq('id', userId);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        // Could notify user here
        console.warn('Payment failed for customer:', invoice.customer);
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err.message);
  }

  res.json({ received: true });
});

module.exports = router;
