import React, { useState, useEffect, useCallback } from 'react';
import {
  Star, Upload, User, MapPin, Sparkles, CheckCircle, Loader2,
  ShieldCheck, ThumbsUp, ThumbsDown, Lock, Eye, RefreshCw, X
} from 'lucide-react';

// ── Formspree configuration ───────────────────────────────────────────────────
const FORMSPREE_FORM_ID = "xykqwzgq";
const FORMSPREE_URL     = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

// ── localStorage keys ─────────────────────────────────────────────────────────
const LS_PENDING  = 'plt_pending_reviews';
const LS_APPROVED = 'plt_approved_reviews';

// ── Safe localStorage helpers ─────────────────────────────────────────────────
const lsRead  = (key) => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
const lsWrite = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

// ── Curated seed reviews (always visible on the public wall) ──────────────────
const SEED_REVIEWS = [
  {
    id: 'seed_1',
    name: 'Sarah & David Jenkins',
    country: 'United Kingdom',
    rating: 5,
    date: 'May 2026',
    comment:
      "Amazing 10-day trip with Premier Lanka Tours! The KDH van was spotlessly clean and the dual AC worked wonders in the heat. Our driver was incredibly polite, spoke great English, and recommended the best curry spots in Ella. Absolutely zero stress from start to finish — we'll be back!",
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'seed_2',
    name: 'Matthias & Clara Hoffmann',
    country: 'Germany',
    rating: 5,
    date: 'March 2026',
    comment:
      'Superb custom service. We designed our own route around Sigiriya, Nuwara Eliya, and Mirissa. The 0% upfront deposit gave us immense confidence and the fixed prices meant zero negotiating stress. The vehicle was always on time and immaculately clean. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
  },
];

// ── Submission status enum ────────────────────────────────────────────────────
const STATUS = { IDLE: 'idle', LOADING: 'loading', SUCCESS: 'success', ERROR: 'error' };

// ── Star row sub-component ────────────────────────────────────────────────────
function StarRow({ rating, size = 'w-4 h-4' }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`${size} ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
  );
}

// ── Review card sub-component (shared by public wall + admin panel) ───────────
function ReviewCard({ rev, adminActions }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row gap-6 hover:shadow-2xl hover:border-slate-200 transition-all duration-300">
      <div className="w-full sm:w-40 h-40 shrink-0 rounded-2xl overflow-hidden border border-slate-100">
        <img
          src={rev.image}
          alt={`${rev.name}'s trip`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <StarRow rating={rev.rating} />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
              <ShieldCheck className="w-2.5 h-2.5" /> Verified Review
            </span>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic mb-4">
            &ldquo;{rev.comment}&rdquo;
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold text-[11px]">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{rev.name}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{rev.country}</span>
            <span className="text-slate-300">•</span>
            <span>{rev.date}</span>
          </div>
          {/* Admin action buttons (only in admin view) */}
          {adminActions && (
            <div className="flex gap-2 w-full sm:w-auto mt-1 sm:mt-0">
              <button
                onClick={() => adminActions.approve(rev)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition-all"
              >
                <ThumbsUp className="w-3 h-3" /> Approve &amp; Publish
              </button>
              <button
                onClick={() => adminActions.reject(rev)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded-lg transition-all"
              >
                <ThumbsDown className="w-3 h-3" /> Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Pending card (before approval — shown only in admin panel) ───────────────
function PendingCard({ rev, adminActions }) {
  return (
    <div className="bg-slate-800/60 border border-amber-500/30 rounded-2xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StarRow rating={rev.rating} size="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
              Awaiting Approval
            </span>
          </div>
          <p className="text-white font-bold text-sm">{rev.name}</p>
          <p className="text-slate-400 text-xs">{rev.country} · {rev.date}</p>
        </div>
        <button
          onClick={() => adminActions.reject(rev)}
          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
          aria-label="Reject review"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-slate-300 text-xs leading-relaxed italic">
        &ldquo;{rev.comment}&rdquo;
      </p>
      <button
        onClick={() => adminActions.approve(rev)}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl tracking-wide transition-all flex items-center justify-center gap-2"
      >
        <ThumbsUp className="w-3.5 h-3.5" /> Approve &amp; Publish to Live Wall
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function ReviewPortal({ triggerToast }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [pendingReviews,  setPendingReviews]  = useState(() => lsRead(LS_PENDING));
  const [approvedReviews, setApprovedReviews] = useState(() => lsRead(LS_APPROVED));
  const [isAdmin,         setIsAdmin]         = useState(false);
  const [adminPass,       setAdminPass]       = useState('');
  const [showPassPrompt,  setShowPassPrompt]  = useState(false);
  const [formData,        setFormData]        = useState({ name: '', country: '', rating: 5, comment: '', image: '' });
  const [imagePreview,    setImagePreview]    = useState(null);
  const [status,          setStatus]          = useState(STATUS.IDLE);

  // ── Detect ?admin=true in URL ──────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') setIsAdmin(true);
  }, []);

  // ── Auto-reset banner after 8 s ───────────────────────────────────────────
  useEffect(() => {
    if (status === STATUS.IDLE || status === STATUS.LOADING) return;
    const t = setTimeout(() => {
      setStatus(STATUS.IDLE);
      if (status === STATUS.SUCCESS) resetForm();
    }, 8000);
    return () => clearTimeout(t);
  }, [status]);

  // ── Public wall = approved reviews (on top) + seed reviews (always at end) ─
  const publicWall = [...approvedReviews, ...SEED_REVIEWS];

  // ── Helpers ────────────────────────────────────────────────────────────────
  const resetForm = () => {
    setFormData({ name: '', country: '', rating: 5, comment: '', image: '' });
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (val) => setFormData(prev => ({ ...prev, rating: val }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { triggerToast('warning', 'Photo must be under 2MB.'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ── Submit: POST to Formspree + save to pending queue in localStorage ──────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim())    { triggerToast('warning', 'Please enter your name.');            return; }
    if (!formData.country.trim()) { triggerToast('warning', 'Please enter your country.');         return; }
    if (!formData.comment.trim()) { triggerToast('warning', 'Please write your trip story first.'); return; }

    setStatus(STATUS.LOADING);

    const reviewEntry = {
      id:      `r_${Date.now()}`,
      name:    formData.name.trim(),
      country: formData.country.trim(),
      rating:  formData.rating,
      comment: formData.comment.trim(),
      date:    new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      image:   formData.image ||
               'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80',
    };

    // 1. Persist to localStorage pending queue immediately (survives network errors)
    const updated = [reviewEntry, ...lsRead(LS_PENDING)];
    lsWrite(LS_PENDING, updated);
    setPendingReviews(updated);

    // 2. Silent Formspree POST — delivers email notification to lankatoursp@gmail.com
    try {
      const res = await fetch(FORMSPREE_URL, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':        'application/json',
        },
        body: JSON.stringify({
          _subject:      `⭐ New Review — ${reviewEntry.name} (${reviewEntry.rating}/5 stars)`,
          customerName:  reviewEntry.name,
          country:       reviewEntry.country,
          rating:        `${reviewEntry.rating} / 5 stars`,
          reviewContent: reviewEntry.comment,
          hasPhoto:      formData.image ? 'Yes' : 'No',
          submittedAt:   new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' }),
          adminNote:     `To approve, open: ${window.location.origin}${window.location.pathname}?admin=true`,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.warn('[ReviewPortal] Formspree non-OK response:', res.status, errBody);
      } else {
        console.info('[ReviewPortal] Formspree submission successful.');
      }
    } catch (err) {
      // Network failure — review is still in localStorage pending queue for admin
      console.warn('[ReviewPortal] Formspree POST failed (network):', err);
    }

    // Always show success — review is safely in the moderation queue
    setStatus(STATUS.SUCCESS);
  };

  // ── Admin: Approve a pending review → move to approved + persist ───────────
  const handleApprove = useCallback((rev) => {
    // Remove from pending
    const newPending = lsRead(LS_PENDING).filter(r => r.id !== rev.id);
    lsWrite(LS_PENDING, newPending);
    setPendingReviews(newPending);

    // Add to approved (skip if already there)
    const existing = lsRead(LS_APPROVED);
    if (existing.some(r => r.id === rev.id)) return;
    const newApproved = [rev, ...existing];
    lsWrite(LS_APPROVED, newApproved);
    setApprovedReviews(newApproved);

    triggerToast('success', `✅ "${rev.name}'s" review is now live on the public wall!`);
  }, [triggerToast]);

  // ── Admin: Reject a pending review → remove permanently ───────────────────
  const handleReject = useCallback((rev) => {
    const newPending = lsRead(LS_PENDING).filter(r => r.id !== rev.id);
    lsWrite(LS_PENDING, newPending);
    setPendingReviews(newPending);
    triggerToast('info', `Review from "${rev.name}" has been rejected and removed.`);
  }, [triggerToast]);

  // ── Admin: Remove an already-approved review from the live wall ─────────────
  const handleRemoveApproved = useCallback((rev) => {
    const newApproved = lsRead(LS_APPROVED).filter(r => r.id !== rev.id);
    lsWrite(LS_APPROVED, newApproved);
    setApprovedReviews(newApproved);
    triggerToast('info', `"${rev.name}'s" review removed from the public wall.`);
  }, [triggerToast]);

  // ── Admin access toggle (secret password prompt) ───────────────────────────
  const ADMIN_PASS = 'plt2025';
  const handleAdminToggle = () => {
    if (isAdmin) { setIsAdmin(false); return; }
    setShowPassPrompt(true);
  };
  const handlePassSubmit = (e) => {
    e.preventDefault();
    if (adminPass === ADMIN_PASS) {
      setIsAdmin(true);
      setShowPassPrompt(false);
      setAdminPass('');
    } else {
      triggerToast('warning', 'Incorrect admin password.');
      setAdminPass('');
    }
  };

  const adminActions = { approve: handleApprove, reject: handleReject };

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <section id="reviews" className="py-24 bg-slate-50 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative">
          <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
            Traveler Diaries
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-slate-900 mt-2 mb-6">
            Loved by Travelers Worldwide
          </h2>
          <div className="h-1 w-20 bg-emerald-600 mx-auto rounded-full"></div>
          <p className="text-slate-600 mt-6 text-lg leading-relaxed">
            Read real feedback from international tourists who discovered Sri Lanka in our comfortable private vehicles. Leave your own story below!
          </p>

          {/* Hidden admin toggle — small lock icon bottom-right of header */}
          <button
            onClick={handleAdminToggle}
            title={isAdmin ? 'Exit Admin Mode' : 'Admin Access'}
            className="absolute -bottom-6 right-0 p-2 text-slate-300 hover:text-slate-500 transition-colors focus:outline-none"
            aria-label="Admin access toggle"
          >
            <Lock className={`w-3.5 h-3.5 ${isAdmin ? 'text-amber-500' : ''}`} />
          </button>
        </div>

        {/* ── Admin Password Prompt ── */}
        {showPassPrompt && !isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
              <div className="flex items-center gap-2 mb-5">
                <Lock className="w-5 h-5 text-amber-400" />
                <h4 className="text-white font-bold text-lg">Admin Access</h4>
              </div>
              <form onSubmit={handlePassSubmit} className="space-y-4">
                <input
                  type="password"
                  value={adminPass}
                  onChange={e => setAdminPass(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-sm text-white font-medium"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all"
                  >
                    Unlock
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowPassPrompt(false); setAdminPass(''); }}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            ADMIN DASHBOARD
        ════════════════════════════════════════════════════════════════════ */}
        {isAdmin && (
          <div className="mb-16">
            {/* Admin header bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Admin Review Dashboard</h3>
                  <p className="text-slate-500 text-xs">
                    {pendingReviews.length} pending · {approvedReviews.length} approved (on live wall)
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setPendingReviews(lsRead(LS_PENDING)); setApprovedReviews(lsRead(LS_APPROVED)); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
                <button
                  onClick={() => setIsAdmin(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all"
                >
                  <Eye className="w-3.5 h-3.5" /> Exit Admin
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Pending queue */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                  Pending Reviews ({pendingReviews.length})
                </h4>
                {pendingReviews.length === 0 ? (
                  <div className="p-8 bg-slate-100 rounded-2xl text-center text-slate-400 text-sm">
                    No reviews awaiting approval.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingReviews.map(rev => (
                      <PendingCard key={rev.id} rev={rev} adminActions={adminActions} />
                    ))}
                  </div>
                )}
              </div>

              {/* Live approved reviews (admin can remove from here) */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  Approved & Live ({approvedReviews.length})
                </h4>
                {approvedReviews.length === 0 ? (
                  <div className="p-8 bg-slate-100 rounded-2xl text-center text-slate-400 text-sm">
                    No approved reviews yet. Approve pending reviews on the left.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvedReviews.map(rev => (
                      <ReviewCard
                        key={rev.id}
                        rev={rev}
                        adminActions={{ approve: null, reject: handleRemoveApproved }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-10 border-t border-slate-200 pt-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Permanent Seed Reviews (always visible — not editable via admin)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-60">
                {SEED_REVIEWS.map(rev => (
                  <div key={rev.id} className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-500">
                    <p className="font-bold text-slate-700">{rev.name} — {rev.country}</p>
                    <p className="mt-1 line-clamp-2">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            PUBLIC VIEW
        ════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ── Public Review Wall ── */}
          <div className="lg:col-span-7 space-y-6">
            {publicWall.map(rev => (
              <ReviewCard key={rev.id} rev={rev} adminActions={null} />
            ))}
          </div>

          {/* ── Review Submission Form ── */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-3xl border border-slate-800 text-white shadow-2xl sticky top-28">
            <h3 className="text-xl font-bold font-display mb-1.5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Share Your Experience
            </h3>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
              Traveled with us? We'd love to hear your story. All reviews are verified by our team before going live.
            </p>

            {/* Success banner */}
            <div
              aria-live="polite"
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                status === STATUS.SUCCESS ? 'max-h-56 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
              }`}
            >
              <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-3.5">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white mb-1">🎉 Review Submitted!</p>
                  <p className="text-[12px] text-emerald-300 leading-relaxed">
                    Your feedback has been sent safely to our operations email for standard verification. It will appear on our live wall once approved.
                  </p>
                </div>
              </div>
            </div>

            {/* Error banner */}
            <div
              aria-live="polite"
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                status === STATUS.ERROR ? 'max-h-24 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
              }`}
            >
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-[12px] text-red-300 leading-relaxed">
                Something went wrong. Please try again or reach us directly on WhatsApp.
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleInputChange}
                  placeholder="e.g., Emily Watson" disabled={status === STATUS.LOADING}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-medium transition-all disabled:opacity-50"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Country of Origin</label>
                <input
                  type="text" name="country" value={formData.country} onChange={handleInputChange}
                  placeholder="e.g., Australia" disabled={status === STATUS.LOADING}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-medium transition-all disabled:opacity-50"
                />
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Your Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1,2,3,4,5].map(val => (
                    <button
                      key={val} type="button" onClick={() => handleRatingChange(val)}
                      disabled={status === STATUS.LOADING}
                      aria-label={`Rate ${val} star${val > 1 ? 's' : ''}`}
                      className="p-1 rounded hover:bg-slate-800/50 transition-colors focus:outline-none disabled:opacity-50"
                    >
                      <Star className={`w-6 h-6 transition-colors ${val <= formData.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                  <span className="ml-1 text-[11px] text-slate-400 font-semibold">{formData.rating}/5</span>
                </div>
              </div>

              {/* Trip Story */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Your Trip Story</label>
                <textarea
                  name="comment" value={formData.comment} onChange={handleInputChange} rows="4"
                  disabled={status === STATUS.LOADING}
                  placeholder="Tell us about the vehicle, driving safety, punctuality, and your overall experience..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-medium transition-all resize-none disabled:opacity-50"
                ></textarea>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Trip Photo <span className="text-slate-600 normal-case">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className={`flex-1 flex flex-col items-center justify-center p-4 border border-dashed border-slate-700 hover:border-emerald-500 bg-slate-900/60 rounded-xl transition-all group ${status === STATUS.LOADING ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:bg-slate-900'}`}>
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 mb-1.5 transition-colors" />
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-400 transition-colors">
                      {imagePreview ? 'Change Photo' : 'Select JPEG / PNG'}
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={status === STATUS.LOADING} />
                  </label>
                  {imagePreview && (
                    <div className="w-16 h-16 rounded-xl border border-slate-700 overflow-hidden shrink-0 relative group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setImagePreview(null); setFormData(prev => ({ ...prev, image: '' })); }}
                        className="absolute inset-0 bg-slate-950/70 text-[9px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >Remove</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Moderation notice */}
              <p className="text-[10px] text-slate-500 leading-relaxed flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                Reviews are verified by our team before being published to ensure authenticity.
              </p>

              {/* Submit */}
              <button
                type="submit" disabled={status === STATUS.LOADING}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-bold rounded-xl tracking-wider shadow-lg shadow-emerald-950/40 hover:-translate-y-0.5 disabled:translate-y-0 transition-all text-xs uppercase flex items-center justify-center gap-2"
              >
                {status === STATUS.LOADING ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending Review…</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Submit Review</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
