import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../lib/api';
import { Check, Scissors } from 'lucide-react';

const PRICES = {
  starter: {
    monthly: import.meta.env.VITE_STRIPE_STARTER_MONTHLY_PRICE_ID,
    annual: import.meta.env.VITE_STRIPE_STARTER_ANNUAL_PRICE_ID,
  },
  pro: {
    monthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID,
    annual: import.meta.env.VITE_STRIPE_PRO_ANNUAL_PRICE_ID,
  },
};

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    priceId: { monthly: null, annual: null },
    features: ['2 exports per month', 'Watermark on exports', 'Unlimited projects'],
    cta: 'Get started',
    highlight: false,
  },
  {
    name: 'Starter',
    price: { monthly: 6.99, annual: 59 },
    priceId: PRICES.starter,
    features: ['10 exports per month', 'No watermark'],
    cta: 'Start Starter',
    highlight: true,
  },
  {
    name: 'Pro',
    price: { monthly: 9.99, annual: 84 },
    priceId: PRICES.pro,
    features: ['Unlimited exports', 'No watermark'],
    cta: 'Go Pro',
    highlight: false,
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState('monthly');
  const [loading, setLoading] = useState(null);
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  async function handleSubscribe(plan) {
    if (!user) {
      navigate('/signup');
      return;
    }
    const priceId = plan.priceId[billing];
    if (!priceId) {
      navigate('/dashboard');
      return;
    }
    setLoading(plan.name);
    try {
      const { url } = await api.createCheckout(priceId);
      window.location.href = url;
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <header className="border-b border-border px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Scissors size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">VoxFrame</span>
        </Link>
        {user ? (
          <Link to="/dashboard" className="btn-secondary text-sm">Dashboard</Link>
        ) : (
          <Link to="/login" className="btn-secondary text-sm">Sign in</Link>
        )}
      </header>

      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Simple, honest pricing</h1>
          <p className="text-muted text-lg">Start free, upgrade when you need more</p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={billing === 'monthly' ? 'text-white text-sm font-medium' : 'text-muted text-sm'}>Monthly</span>
            <button
              onClick={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-12 h-6 rounded-full transition-colors ${billing === 'annual' ? 'bg-accent' : 'bg-border'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${billing === 'annual' ? 'left-7' : 'left-1'}`} />
            </button>
            <span className={billing === 'annual' ? 'text-white text-sm font-medium' : 'text-muted text-sm'}>
              Annual <span className="text-green-400 text-xs ml-1">Save ~30%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card flex flex-col ${plan.highlight ? 'border-accent ring-1 ring-accent' : ''}`}
            >
              {plan.highlight && (
                <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">Most popular</div>
              )}
              <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
              <div className="mb-5">
                {plan.price[billing] === 0 ? (
                  <span className="text-3xl font-bold">Free</span>
                ) : (
                  <span className="text-3xl font-bold">
                    ${plan.price[billing]}
                    <span className="text-muted text-sm font-normal">/{billing === 'monthly' ? 'mo' : 'yr'}</span>
                  </span>
                )}
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={15} className="text-green-400 shrink-0 mt-0.5" />
                    <span className="text-muted">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.name}
                className={plan.highlight ? 'btn-primary' : 'btn-secondary'}
              >
                {loading === plan.name ? 'Redirecting…' : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
