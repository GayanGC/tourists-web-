import React, { useState } from 'react';
import { Star, Upload, User, MapPin, Camera, Sparkles } from 'lucide-react';

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Sarah & David Jenkins",
    country: "United Kingdom",
    rating: 5,
    date: "May 2026",
    comment: "Amazing 10-day trip with Lanka Horizon! The KDH van was spotlessly clean and the dual AC worked wonders in the heat. Our driver was incredibly polite, spoke great English, and recommended the best curry spots in Ella.",
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "Kenji Tanaka",
    country: "Japan",
    rating: 5,
    date: "April 2026",
    comment: "Excellent transfer from BIA Airport to Kandy. The driver was waiting at the arrivals terminal with a clean placard, helped us pack our heavy bags, and navigated the highways safely. Fully recommended for families!",
    image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Matthias & Clara",
    country: "Germany",
    rating: 5,
    date: "March 2026",
    comment: "Superb custom service. We designed our own route around Sigiriya, Nuwara Eliya, and Mirissa. Having 0% upfront deposit gave us immense confidence, and the fixed prices meant zero negotiating stress.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"
  }
];

export default function ReviewPortal({ triggerToast }) {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    rating: 5,
    comment: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (ratingVal) => {
    setFormData(prev => ({ ...prev, rating: ratingVal }));
  };

  // Convert image upload to Base64
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      triggerToast('warning', 'Please enter your name.');
      return;
    }
    if (!formData.country.trim()) {
      triggerToast('warning', 'Please enter your country.');
      return;
    }
    if (!formData.comment.trim()) {
      triggerToast('warning', 'Please write a review comment.');
      return;
    }

    const newReview = {
      id: Date.now(),
      name: formData.name,
      country: formData.country,
      rating: formData.rating,
      date: "Just Now",
      comment: formData.comment,
      image: formData.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80" // Default travel photo
    };

    setReviews([newReview, ...reviews]);
    triggerToast('success', 'Thank you! Your travel review has been posted successfully.');

    // Reset Form
    setFormData({
      name: '',
      country: '',
      rating: 5,
      comment: '',
      image: ''
    });
    setImagePreview(null);
  };

  return (
    <section id="reviews" className="py-24 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
            Traveler Diaries
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-slate-900 mt-2 mb-6">
            Loved by Travelers Worldwide
          </h2>
          <div className="h-1 w-20 bg-emerald-600 mx-auto rounded-full"></div>
          <p className="text-slate-600 mt-6 text-lg leading-relaxed">
            Read real feedback from international tourists who explored the wonders of Sri Lanka in our luxury vans. Feel free to leave your own experience!
          </p>
        </div>

        {/* Reviews Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row gap-6 hover:shadow-2xl hover:border-slate-200 transition-all duration-300"
              >
                {/* Reviewer Trip Image */}
                <div className="w-full sm:w-44 h-44 shrink-0 rounded-2xl overflow-hidden border border-slate-100">
                  <img
                    src={rev.image}
                    alt={`${rev.name}'s trip`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content Side */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-2.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic mb-4">
                      "{rev.comment}"
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

          {/* Leave a Review Form */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-3xl border border-slate-800 text-white shadow-2xl sticky top-28">
            <h3 className="text-xl font-bold font-display mb-2 flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Share Your Experience</span>
            </h3>
            <p className="text-slate-400 text-xs mb-6">
              Your feedback helps us improve and guides fellow travelers plan their trip.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
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
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-slate-900 text-sm font-medium transition-all"
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
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-slate-900 text-sm font-medium transition-all"
                />
              </div>

              {/* Star Rating Select */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => handleRatingChange(starVal)}
                      className="p-1 rounded hover:bg-slate-800/50 transition-colors focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          starVal <= formData.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Review Details
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Tell us about the vehicle condition, driving safety, and overall tour experience..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-slate-900 text-sm font-medium transition-all resize-none"
                ></textarea>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Upload Trip Photo
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed border-slate-850 hover:border-emerald-500 bg-slate-900/60 rounded-xl cursor-pointer hover:bg-slate-900 transition-all group">
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 mb-1.5" />
                    <span className="text-[10px] font-semibold text-slate-400">
                      {imagePreview ? 'Change Photo' : 'Select JPEG / PNG'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  
                  {/* Base64 Preview */}
                  {imagePreview && (
                    <div className="w-16 h-16 rounded-xl border border-slate-800 overflow-hidden shrink-0 relative group">
                      <img
                        src={imagePreview}
                        alt="Upload preview"
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
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl tracking-wider shadow-lg shadow-emerald-950/40 hover:-translate-y-0.5 transition-all text-xs uppercase"
              >
                Post Review
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
