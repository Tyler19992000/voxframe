import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, ImagePlus, Mic, Download, Check, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

const steps = [
  {
    icon: ImagePlus,
    step: '1',
    title: 'Upload your images',
    desc: 'Drag in the visuals for your video — reorder them however you like.',
  },
  {
    icon: Mic,
    step: '2',
    title: 'Upload your voiceover',
    desc: 'Add your narration. Drop in a timestamp file for exact sync, or let VoxFrame divide it evenly.',
  },
  {
    icon: Download,
    step: '3',
    title: 'Get your finished video',
    desc: 'VoxFrame renders a 1080p MP4, synced and ready to upload — no timeline editing required.',
  },
];

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    features: ['2 exports per month', 'Watermark on exports', 'Unlimited projects'],
    cta: 'Get started free',
    highlight: false,
  },
  {
    name: 'Starter',
    price: { monthly: 6.99, annual: 59 },
    features: ['10 exports per month', 'No watermark'],
    cta: 'Start Starter',
    highlight: true,
  },
  {
    name: 'Pro',
    price: { monthly: 9.99, annual: 84 },
    features: ['Unlimited exports', 'No watermark'],
    cta: 'Go Pro',
    highlight: false,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Nav */}
      <header className="border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Scissors size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">VoxFrame</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/pricing" className="btn-ghost text-sm">Pricing</Link>
          <Link to="/login" className="btn-secondary text-sm">Sign in</Link>
          <Link to="/signup" className="btn-primary text-sm">Get started free</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-8 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 badge bg-accent/10 text-accent border border-accent/20 mb-6 px-3 py-1">
          <Scissors size={13} />
          <span>Built for faceless YouTube automation</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-5 max-w-3xl leading-tight">
          Turn your images and voiceover into a finished YouTube video.
        </h1>
        <p className="text-muted text-xl max-w-xl mb-10 leading-relaxed">
          VoxFrame is built for faceless YouTube creators — upload your images and narration, and get a
          synced, export-ready MP4 in minutes. No timeline editing, no fuss.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/signup" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
            Get started free <ArrowRight size={18} />
          </Link>
          <Link to="/pricing" className="btn-secondary text-base px-8 py-3">See pricing</Link>
        </div>
        <p className="text-muted text-sm mt-5">No credit card required · 2 free exports every month</p>
      </section>

      {/* 3-step workflow */}
      <section className="border-t border-border px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">From assets to upload-ready video in 3 steps</h2>
            <p className="text-muted text-lg">No editing skills needed — VoxFrame does the assembly for you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {steps.map(({ icon: Icon, step, title, desc }, i) => (
              <div key={step} className="card relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <span className="text-3xl font-bold text-border">{step}</span>
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
                {i < steps.length - 1 && (
                  <ArrowRight
                    size={20}
                    className="hidden md:block text-border absolute top-1/2 -right-3 -translate-y-1/2 z-10"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Simple, honest pricing</h2>
            <p className="text-muted text-lg">Start free. Upgrade when you're exporting more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card flex flex-col ${plan.highlight ? 'border-accent ring-1 ring-accent' : ''}`}
              >
                {plan.highlight && (
                  <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">Most popular</div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="mb-5">
                  {plan.price.monthly === 0 ? (
                    <span className="text-3xl font-bold">Free</span>
                  ) : (
                    <span className="text-3xl font-bold">
                      ${plan.price.monthly}
                      <span className="text-muted text-sm font-normal">/mo</span>
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

                <Link
                  to="/signup"
                  className={`text-center ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-muted text-sm mt-6">
            Annual billing available at a discount. See <Link to="/pricing" className="text-accent hover:underline">full pricing details</Link>.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to automate your video assembly?</h2>
          <p className="text-muted text-lg mb-8">Join VoxFrame and export your first video in minutes.</p>
          <Link to="/signup" className="btn-primary text-base px-8 py-3 inline-flex items-center gap-2">
            Get started free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
