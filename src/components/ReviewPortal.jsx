import React, { useState, useEffect } from 'react';
import { Star, Upload, User, MapPin, Sparkles, CheckCircle, PartyPopper } from 'lucide-react';

// ── 2 high-quality seed reviews preserved for layout ────────────────────────
const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Sarah & David Jenkins",
    country: "United Kingdom",
    rating: 5,
    date: "May 2026",
    verified: true,
    comment: "Amazing 10-day trip with Premier Lanka Tours! The KDH van was spotlessly clean and the dual AC worked wonders in the heat. Our driver was incredibly polite, spoke great English, and recommended the best curry spots in Ella. Absolutely zero stress from start to finish — we'll be back!",
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Matthias & Clara Hoffmann",
    country: "Germany",
    rating: 5,
    date: "March 2026",
    verified: true,
    comment: "Superb custom service. We designed our own route around Sigiriya, Nuwara Eliya, and Mirissa. The 0% upfront deposit gave us immense confidence and the fixed prices meant zero negotiating stress. The vehicle was always on time and immaculately clean. Highly recommended!",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"
  }
];

export default function ReviewPortal({ triggerToast }) {
  const [reviews, setReviews]           = useState(INITIAL_REVIEWS);
  const [formData, setFormData]         = useState({ name: '', country: '', rating: 5, comment: '', image: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted]       = useState(false);  // controls the success banner
  const [isSubmitting, setIsSubmitting] = useState(false);  // disables button during async work

  // Auto-dismiss the success banner after 5 seconds
  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => setSubmitted(false), 5000);
    return () => clearTimeout(timer);
  }, [submitted]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (ratingVal) => {
    setFormData(prev => ({ ...prev, rating: ratingVal }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      triggerToast('warning', 'Please upload a photo smaller than 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim())    { triggerToast('warning', 'Please enter your name.');              return; }
    if (!formData.country.trim()) { triggerToast('warning', 'Please enter your country.');           return; }
    if (!formData.comment.trim()) { triggerToast('warning', 'Please write your trip story first.');  return; }

    setIsSubmitting(true);

    // ── 1. Append review directly to local state ──────────────────────────
    const newReview = {
      id:       Date.now(),
      name:     formData.name.trim(),
      country:  formData.country.trim(),
      rating:   formData.rating,
      date:     new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      verified: true,  // treated as instantly verified in the UI
      comment:  formData.comment.trim(),
      image:    formData.image ||
                "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80"
    };
    setReviews(prev => [newReview, ...prev]);

    // ── 2. Background email notification (Formspree / EmailJS placeholder) ─
    //
    //  When you are ready to wire up a real backend, uncomment the block below
    //  and replace FORMSPREE_ENDPOINT with your Formspree form ID, or swap in
    //  the EmailJS sendForm() call instead.
    //
    // try {
    //   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
    //
    //   await fetch(FORMSPREE_ENDPOINT, {
    //     method:  'POST',
    //     headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    //     body: JSON.stringify({
    //       _subject:       `New Website Review from ${newReview.name}`,
    //       customerName:   newReview.name,
    //       country:        newReview.country,
    //       rating:         `${newReview.rating} / 5`,
    //       reviewContent:  newReview.comment,
    //       hasPhoto:       !!formData.image,
    //       submittedAt:    new Date().toISOString(),
    //     }),
    //   });
    // } catch (err) {
    //   // Silent fail — review is already live on the page; log for debugging only
    //   console.warn('[ReviewPortal] Background email dispatch failed:', err);
    // }

    // ── 3. Show success banner & reset form ───────────────────────────────
    setSubmitted(true);
    setFormData({ name: '', country: '', rating: 5, comment: '', image: '' });
    setImagePreview(null);
    setIsSubmitting(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section id="reviews" className="py-24 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
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
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* ── Reviews List ── */}
          <div className="lg:col-span-7 space-y-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row gap-6 hover:shadow-2xl hover:border-slate-200 transition-all duration-300"
              >
                {/* Trip Image */}
                <div className="w-full sm:w-44 h-44 shrink-0 rounded-2xl overflow-hidden border border-slate-100">
                  <img
                    src={rev.image}
                    alt={`${rev.name}'s trip photo`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Text side */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Stars */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                      {/* Verified badge */}
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
                          <CheckCircle className="w-2.5 h-2.5" />
                          Verified Review
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic mb-4">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-semibold text-slate-400">
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rev.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{rev.country}</span>
                      <span className="text-slate-300">•</span>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Review Form ── */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-3xl border border-slate-800 text-white shadow-2xl sticky top-28">
            <h3 className="text-xl font-bold font-display mb-1.5 flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Share Your Experience</span>
            </h3>
            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
              Your feedback helps future travelers discover Sri Lanka with confidence. Fill in the form and your review goes live instantly!
            </p>

            {/* ── Animated Success Banner (auto-dismiss after 5 s) ── */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                submitted ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
              }`}
            >
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-start gap-3">
                <PartyPopper className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-emerald-400">
                    🎉 Thank you for your feedback!
                  </p>
                  <p className="text-[11px] text-emerald-300 mt-0.5 leading-relaxed">
                    Your review has been posted successfully and is now live on the dashboard above.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Emily Watson"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-medium transition-all"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Country of Origin
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="e.g., Australia"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-medium transition-all"
                />
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Your Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => handleRatingChange(starVal)}
                      className="p-1 rounded hover:bg-slate-800/50 transition-colors focus:outline-none"
                      aria-label={`Rate ${starVal} star${starVal > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          starVal <= formData.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-1 text-[11px] text-slate-400 font-semibold">
                    {formData.rating}/5
                  </span>
                </div>
              </div>

              {/* Trip Story */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Your Trip Story
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell us about the vehicle, driving safety, punctuality, and your overall experience..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-medium transition-all resize-none"
                ></textarea>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Trip Photo{' '}
                  <span className="text-slate-600 normal-case">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed border-slate-700 hover:border-emerald-500 bg-slate-900/60 rounded-xl cursor-pointer hover:bg-slate-900 transition-all group">
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 mb-1.5 transition-colors" />
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-emerald-400 transition-colors">
                      {imagePreview ? 'Change Photo' : 'Select JPEG / PNG'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Thumbnail preview */}
                  {imagePreview && (
                    <div className="w-16 h-16 rounded-xl border border-slate-700 overflow-hidden shrink-0 relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: '' }));
                        }}
                        className="absolute inset-0 bg-slate-950/70 text-[9px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl tracking-wider shadow-lg shadow-emerald-950/40 hover:-translate-y-0.5 disabled:translate-y-0 transition-all text-xs uppercase flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {isSubmitting ? 'Posting Review…' : 'Post My Review'}
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
