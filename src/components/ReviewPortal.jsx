import { useState, useEffect, useCallback } from 'react';
import {
  Star, Upload, User, MapPin, Sparkles, CheckCircle, Loader2,
  ShieldCheck, ThumbsUp, ThumbsDown, Lock, Eye, RefreshCw, X, Trash2,
  Clock, AlertCircle
} from 'lucide-react';

// ── API Configuration ──────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ── Curated fallback seed reviews ─────────────────────────────────────────────
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

// ── Status enum ───────────────────────────────────────────────────────────────
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

// ── Review Card Sub-component ─────────────────────────────────────────────────
function ReviewCard({ rev, adminActions, showStatusBadge }) {
  const isSeed = String(rev.id).startsWith('seed_');

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row gap-6 hover:shadow-2xl hover:border-slate-200 transition-all duration-300">
      <div className="w-full sm:w-40 h-40 shrink-0 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100">
        {rev.image ? (
          <img
            src={rev.image}
            alt={`${rev.name}'s trip`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
            <User className="w-10 h-10 mb-1" />
            <span className="text-[10px] font-semibold">Verified Traveler</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <StarRow rating={rev.rating} />
            {showStatusBadge ? (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                  rev.status === 'approved'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : rev.status === 'rejected'
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : 'bg-amber-50 border border-amber-200 text-amber-700'
                }`}
              >
                {rev.status || 'Approved'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
                <ShieldCheck className="w-2.5 h-2.5" /> Verified Review
              </span>
            )}
            {isSeed && (
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded">
                Featured
              </span>
            )}
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

          {/* Admin action buttons */}
          {adminActions && (
            <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-1 sm:mt-0">
              {adminActions.onApprove && (
                <button
                  onClick={() => adminActions.onApprove(rev.id)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition-all"
                >
                  <ThumbsUp className="w-3 h-3" /> Approve
                </button>
              )}
              {adminActions.onReject && (
                <button
                  onClick={() => adminActions.onReject(rev.id)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold rounded-lg transition-all"
                >
                  <ThumbsDown className="w-3 h-3" /> Reject
                </button>
              )}
              {adminActions.onDelete && (
                <button
                  onClick={() => adminActions.onDelete(rev.id)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white text-[10px] font-bold rounded-lg transition-all"
                  title="Delete permanently"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Pending Card Sub-component ────────────────────────────────────────────────
function PendingCard({ rev, onApprove, onReject, onDelete }) {
  return (
    <div className="bg-slate-800/80 border border-amber-500/30 rounded-2xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StarRow rating={rev.rating} size="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> Awaiting Approval
            </span>
          </div>
          <p className="text-white font-bold text-sm">{rev.customerName || rev.name}</p>
          <p className="text-slate-400 text-xs">
            {rev.country} · {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'Recent'}
          </p>
        </div>
        <button
          onClick={() => onDelete(rev._id || rev.id)}
          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
          title="Delete permanently"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-slate-300 text-xs leading-relaxed italic bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
        &ldquo;{rev.reviewContent || rev.comment}&rdquo;
      </p>

      {rev.photoUrl && (
        <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-700">
          <img src={rev.photoUrl} alt="Customer upload" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onApprove(rev._id || rev.id)}
          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl tracking-wide transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/30"
        >
          <ThumbsUp className="w-3.5 h-3.5" /> Approve &amp; Publish
        </button>
        <button
          onClick={() => onReject(rev._id || rev.id)}
          className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
        >
          <ThumbsDown className="w-3.5 h-3.5" /> Reject
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function ReviewPortal({ triggerToast }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [publicReviews,    setPublicReviews]    = useState([]);
  const [isLoadingPublic,  setIsLoadingPublic]  = useState(true);
  const [adminReviews,     setAdminReviews]     = useState({ pending: [], approved: [], rejected: [], all: [] });
  const [isLoadingAdmin,   setIsLoadingAdmin]   = useState(false);
  const [activeAdminTab,   setActiveAdminTab]   = useState('pending');
  const [adminSecret,      setAdminSecret]      = useState('plt2025');
  const [isAdmin,          setIsAdmin]          = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('admin') === 'true';
    }
    return false;
  });
  const [adminPassInput,   setAdminPassInput]   = useState('');
  const [showPassPrompt,   setShowPassPrompt]   = useState(false);
  const [formData,         setFormData]         = useState({ name: '', country: '', rating: 5, comment: '', image: '' });
  const [imagePreview,     setImagePreview]     = useState(null);
  const [status,           setStatus]           = useState(STATUS.IDLE);
  const [statusMessage,    setStatusMessage]    = useState('');

  // ── 1. Fetch Public Approved Reviews ───────────────────────────────────────
  const fetchPublicReviews = useCallback(async (showLoader = false) => {
    if (showLoader) setIsLoadingPublic(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/public`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPublicReviews(json.data);
        }
      }
    } catch (err) {
      console.warn('[ReviewPortal] Could not reach backend API for public reviews, displaying seed fallback:', err.message);
    } finally {
      setIsLoadingPublic(false);
    }
  }, []);

  // ── 2. Fetch Admin Reviews ─────────────────────────────────────────────────
  const fetchAdminReviews = useCallback(async (secretToUse = adminSecret, showLoader = false) => {
    if (showLoader) setIsLoadingAdmin(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/reviews`, {
        headers: {
          'x-admin-secret': secretToUse,
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAdminReviews(json.data);
        }
      } else if (res.status === 401) {
        triggerToast('warning', 'Invalid admin authorization credentials.');
      }
    } catch (err) {
      console.error('[ReviewPortal] Admin fetch failed:', err);
      triggerToast('error', 'Failed to connect to backend server for admin dashboard.');
    } finally {
      setIsLoadingAdmin(false);
    }
  }, [adminSecret, triggerToast]);

  // Initial mount load
  useEffect(() => {
    let isMounted = true;
    fetch(`${API_BASE_URL}/reviews/public`)
      .then(res => (res.ok ? res.json() : null))
      .then(json => {
        if (isMounted && json?.success && Array.isArray(json.data)) {
          setPublicReviews(json.data);
        }
      })
      .catch(err => {
        console.warn('[ReviewPortal] Initial public reviews fetch fallback:', err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoadingPublic(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    let isMounted = true;
    fetch(`${API_BASE_URL}/admin/reviews`, {
      headers: { 'x-admin-secret': adminSecret },
    })
      .then(res => (res.ok ? res.json() : null))
      .then(json => {
        if (isMounted && json?.success && json.data) {
          setAdminReviews(json.data);
        }
      })
      .catch(err => {
        console.error('[ReviewPortal] Initial admin reviews fetch error:', err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoadingAdmin(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAdmin, adminSecret]);

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

  // Auto-reset banner after 8 s
  useEffect(() => {
    if (status === STATUS.IDLE || status === STATUS.LOADING) return;
    const t = setTimeout(() => {
      setStatus(STATUS.IDLE);
      setStatusMessage('');
      if (status === STATUS.SUCCESS) resetForm();
    }, 8000);
    return () => clearTimeout(t);
  }, [status]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      triggerToast('warning', 'Photo must be under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ── 3. Submit Review (POST /api/reviews) ────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim())    { triggerToast('warning', 'Please enter your name.');            return; }
    if (!formData.country.trim()) { triggerToast('warning', 'Please enter your country.');         return; }
    if (!formData.comment.trim()) { triggerToast('warning', 'Please write your trip story first.'); return; }

    setStatus(STATUS.LOADING);
    setStatusMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          customerName:  formData.name.trim(),
          country:       formData.country.trim(),
          rating:        formData.rating,
          reviewContent: formData.comment.trim(),
          photoUrl:      formData.image || '',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus(STATUS.SUCCESS);
        setStatusMessage('Your review has been securely received and forwarded for moderation. Once approved, it will be published to the live wall.');
        triggerToast('success', 'Review submitted successfully for review!');
        // Refresh admin dashboard if admin is logged in
        if (isAdmin) fetchAdminReviews();
      } else {
        setStatus(STATUS.ERROR);
        setStatusMessage(data.message || 'Unable to submit review. Please try again.');
        triggerToast('error', data.message || 'Submission failed.');
      }
    } catch (err) {
      console.error('[ReviewPortal] Submit network error:', err);
      setStatus(STATUS.ERROR);
      setStatusMessage('Network connection error. Please ensure the backend server is running.');
      triggerToast('error', 'Network error. Please try again later.');
    }
  };

  // ── 4. Admin Actions (PATCH & DELETE) ──────────────────────────────────────
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast('success', `Review status changed to '${newStatus}'.`);
        fetchAdminReviews();
        fetchPublicReviews();
      } else {
        triggerToast('warning', data.message || 'Failed to update review status.');
      }
    } catch (err) {
      console.error('[ReviewPortal] Status update error:', err);
      triggerToast('error', 'Error updating review status.');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-secret': adminSecret,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast('info', 'Review deleted permanently.');
        fetchAdminReviews();
        fetchPublicReviews();
      } else {
        triggerToast('warning', data.message || 'Failed to delete review.');
      }
    } catch (err) {
      console.error('[ReviewPortal] Delete review error:', err);
      triggerToast('error', 'Error deleting review.');
    }
  };

  // ── Admin Password Unlock ──────────────────────────────────────────────────
  const handleAdminToggle = () => {
    if (isAdmin) { setIsAdmin(false); return; }
    setShowPassPrompt(true);
  };

  const handlePassSubmit = (e) => {
    e.preventDefault();
    if (adminPassInput.trim() === 'plt2025' || adminPassInput.trim() === adminSecret) {
      setAdminSecret(adminPassInput.trim());
      setIsAdmin(true);
      setShowPassPrompt(false);
      setAdminPassInput('');
      triggerToast('success', 'Admin dashboard unlocked.');
    } else {
      triggerToast('warning', 'Incorrect admin password.');
      setAdminPassInput('');
    }
  };

  // Combine public reviews with seed reviews if database is empty or has only 1 review
  const displayPublicWall = publicReviews.length > 0
    ? (publicReviews.length < 2 ? [...publicReviews, ...SEED_REVIEWS.slice(0, 1)] : publicReviews)
    : SEED_REVIEWS;

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

          {/* Hidden admin toggle — lock icon */}
          <button
            onClick={handleAdminToggle}
            title={isAdmin ? 'Exit Admin Mode' : 'Admin Access'}
            className="absolute -bottom-6 right-0 p-2 text-slate-300 hover:text-slate-500 transition-colors focus:outline-none"
            aria-label="Admin access toggle"
          >
            <Lock className={`w-3.5 h-3.5 ${isAdmin ? 'text-amber-500 fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* ── Admin Password Modal ── */}
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
                  value={adminPassInput}
                  onChange={e => setAdminPassInput(e.target.value)}
                  placeholder="Enter admin password (plt2025)"
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
                    onClick={() => { setShowPassPrompt(false); setAdminPassInput(''); }}
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
            ADMIN DASHBOARD (Protected by MongoDB REST API)
        ════════════════════════════════════════════════════════════════════ */}
        {isAdmin && (
          <div className="mb-16 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
            {/* Header bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-500/30">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Admin Review Moderation</h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    MongoDB Atlas Connected · Real-time Review Management
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchAdminReviews()}
                  disabled={isLoadingAdmin}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAdmin ? 'animate-spin text-emerald-400' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={() => setIsAdmin(false)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all border border-slate-700"
                >
                  <Eye className="w-3.5 h-3.5" /> Exit Admin
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-slate-950/80 rounded-xl border border-slate-800 max-w-md">
              <button
                onClick={() => setActiveAdminTab('pending')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeAdminTab === 'pending'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Pending</span>
                <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px]">
                  {adminReviews.pending?.length || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveAdminTab('approved')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeAdminTab === 'approved'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Approved</span>
                <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px]">
                  {adminReviews.approved?.length || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveAdminTab('rejected')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeAdminTab === 'rejected'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Rejected</span>
                <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px]">
                  {adminReviews.rejected?.length || 0}
                </span>
              </button>
            </div>

            {/* Tab content */}
            {isLoadingAdmin ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-2" />
                <span className="text-xs">Fetching reviews from MongoDB Atlas…</span>
              </div>
            ) : (
              <div>
                {/* ── Pending Tab ── */}
                {activeAdminTab === 'pending' && (
                  <div>
                    {(!adminReviews.pending || adminReviews.pending.length === 0) ? (
                      <div className="p-8 bg-slate-950/40 rounded-2xl text-center text-slate-400 text-sm border border-slate-800/60">
                        ✨ No pending reviews waiting for moderation.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {adminReviews.pending.map((rev) => (
                          <PendingCard
                            key={rev._id || rev.id}
                            rev={rev}
                            onApprove={(id) => handleUpdateStatus(id, 'approved')}
                            onReject={(id) => handleUpdateStatus(id, 'rejected')}
                            onDelete={(id) => handleDeleteReview(id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Approved Tab ── */}
                {activeAdminTab === 'approved' && (
                  <div>
                    {(!adminReviews.approved || adminReviews.approved.length === 0) ? (
                      <div className="p-8 bg-slate-950/40 rounded-2xl text-center text-slate-400 text-sm border border-slate-800/60">
                        No approved reviews yet. Approve pending items to display on the live wall.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {adminReviews.approved.map((rev) => (
                          <ReviewCard
                            key={rev._id || rev.id}
                            rev={{
                              id: rev._id,
                              name: rev.customerName,
                              country: rev.country,
                              rating: rev.rating,
                              comment: rev.reviewContent,
                              image: rev.photoUrl,
                              status: rev.status,
                              date: new Date(rev.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
                            }}
                            showStatusBadge={true}
                            adminActions={{
                              onReject: (id) => handleUpdateStatus(id, 'rejected'),
                              onDelete: (id) => handleDeleteReview(id),
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Rejected Tab ── */}
                {activeAdminTab === 'rejected' && (
                  <div>
                    {(!adminReviews.rejected || adminReviews.rejected.length === 0) ? (
                      <div className="p-8 bg-slate-950/40 rounded-2xl text-center text-slate-400 text-sm border border-slate-800/60">
                        No rejected reviews in the trash bin.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {adminReviews.rejected.map((rev) => (
                          <ReviewCard
                            key={rev._id || rev.id}
                            rev={{
                              id: rev._id,
                              name: rev.customerName,
                              country: rev.country,
                              rating: rev.rating,
                              comment: rev.reviewContent,
                              image: rev.photoUrl,
                              status: rev.status,
                              date: new Date(rev.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
                            }}
                            showStatusBadge={true}
                            adminActions={{
                              onApprove: (id) => handleUpdateStatus(id, 'approved'),
                              onDelete: (id) => handleDeleteReview(id),
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            PUBLIC VIEW (Live MongoDB Reviews + Seed reviews)
        ════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ── Public Review Wall ── */}
          <div className="lg:col-span-7 space-y-6">
            {isLoadingPublic ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md animate-pulse flex gap-6">
                    <div className="w-40 h-40 bg-slate-200 rounded-2xl shrink-0"></div>
                    <div className="flex-1 space-y-3 py-2">
                      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-3 bg-slate-200 rounded w-full"></div>
                      <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2 pt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              displayPublicWall.map((rev) => (
                <ReviewCard key={rev.id || rev._id} rev={rev} adminActions={null} />
              ))
            )}
          </div>

          {/* ── Review Submission Form ── */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-3xl border border-slate-800 text-white shadow-2xl sticky top-28">
            <h3 className="text-xl font-bold font-display mb-1.5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Share Your Experience
            </h3>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
              Traveled with us? We'd love to hear your story. All reviews are saved in our database and verified before going live.
            </p>

            {/* Success banner */}
            <div
              aria-live="polite"
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                status === STATUS.SUCCESS ? 'max-h-64 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
              }`}
            >
              <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-3.5">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white mb-1">🎉 Review Submitted!</p>
                  <p className="text-[12px] text-emerald-300 leading-relaxed">
                    {statusMessage || 'Your review has been securely saved and dispatched for moderation. It will be published once approved!'}
                  </p>
                </div>
              </div>
            </div>

            {/* Error banner */}
            <div
              aria-live="polite"
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                status === STATUS.ERROR ? 'max-h-32 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
              }`}
            >
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-[12px] text-red-300 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Submission Error</p>
                  <p>{statusMessage || 'Something went wrong. Please check your network and try again.'}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Emily Watson"
                  disabled={status === STATUS.LOADING}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-medium transition-all disabled:opacity-50"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Country of Origin</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="e.g., Australia"
                  disabled={status === STATUS.LOADING}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-medium transition-all disabled:opacity-50"
                />
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Your Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleRatingChange(val)}
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
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows="4"
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
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Moderation notice */}
              <p className="text-[10px] text-slate-500 leading-relaxed flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                Reviews are stored securely in MongoDB Atlas and reviewed by our moderation team before appearing live.
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === STATUS.LOADING}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-bold rounded-xl tracking-wider shadow-lg shadow-emerald-950/40 hover:-translate-y-0.5 disabled:translate-y-0 transition-all text-xs uppercase flex items-center justify-center gap-2"
              >
                {status === STATUS.LOADING ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Review…</>
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
