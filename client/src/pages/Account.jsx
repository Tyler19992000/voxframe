import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import { CreditCard, User, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const PLAN_LABELS = { free: 'Free', starter: 'Starter', pro: 'Pro' };
const PLAN_COLORS = { free: 'text-muted', starter: 'text-blue-400', pro: 'text-accent' };
// Monthly export caps per plan — must match server/routes/render.js EXPORT_LIMITS.
// 'pro' is intentionally absent = unlimited.
const EXPORT_LIMITS = { free: 2, starter: 10 };

export default function Account() {
  const { user } = useAuth();
  const toast = useToast();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    loadUser();
    // Check for successful checkout return
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      toast('Subscription activated! Welcome to the upgraded plan.', 'success', 6000);
      window.history.replaceState({}, '', '/account');
    }
  }, []);

  async function loadUser() {
    const { data } = await supabase
      .from('users')
      .select('plan, subscription_status, exports_this_month, stripe_customer_id')
      .eq('id', user.id)
      .single();
    setUserData(data);
    setLoading(false);
  }

  async function openPortal() {
    setPortalLoading(true);
    try {
      const { url } = await api.createPortal();
      window.location.href = url;
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setPortalLoading(false);
    }
  }

  const plan = userData?.plan || 'free';
  const exportsUsed = userData?.exports_this_month || 0;
  const exportLimit = EXPORT_LIMITS[plan]; // undefined for pro = unlimited

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="text-muted text-sm mt-1">Manage your profile and billing</p>
      </div>

      {/* Profile */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3 mb-1">
          <User size={18} className="text-accent" />
          <h2 className="font-semibold">Profile</h2>
        </div>
        <div>
          <label className="label">Email</label>
          <p className="text-sm">{user?.email}</p>
        </div>
        <div>
          <label className="label">User ID</label>
          <p className="text-xs text-muted font-mono">{user?.id}</p>
        </div>
      </div>

      {/* Billing */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3 mb-1">
          <CreditCard size={18} className="text-accent" />
          <h2 className="font-semibold">Billing & Plan</h2>
        </div>

        {loading ? (
          <div className="text-muted text-sm">Loading…</div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-muted mb-0.5">Current plan</p>
                <p className={`font-bold text-lg ${PLAN_COLORS[plan]}`}>
                  {PLAN_LABELS[plan]}
                </p>
              </div>
              {userData?.subscription_status === 'active' && (
                <div className="flex items-center gap-1 badge bg-green-500/10 text-green-400 border border-green-500/20 ml-auto">
                  <CheckCircle size={12} />
                  Active
                </div>
              )}
              {userData?.subscription_status === 'canceled' && (
                <div className="flex items-center gap-1 badge bg-accent/10 text-accent border border-accent/20 ml-auto">
                  <AlertCircle size={12} />
                  Canceled
                </div>
              )}
            </div>

            {exportLimit !== undefined && (
              <div className="bg-bg rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Exports this month</span>
                  <span className={exportsUsed >= exportLimit ? 'text-accent' : 'text-white'}>
                    {exportsUsed} / {exportLimit}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${exportsUsed >= exportLimit ? 'bg-accent' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(100, (exportsUsed / exportLimit) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {plan === 'free' && (
                <a href="/pricing" className="btn-primary text-sm">
                  Upgrade plan
                </a>
              )}
              <button onClick={openPortal} disabled={portalLoading} className="btn-secondary text-sm flex items-center gap-2">
                <ExternalLink size={14} />
                {portalLoading ? 'Opening…' : 'Manage billing'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
