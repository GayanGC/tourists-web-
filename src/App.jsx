import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import TrustBadges from './components/TrustBadges';
import RatesCalculator from './components/RatesCalculator';
import TourPlanner from './components/TourPlanner';
import ReviewPortal from './components/ReviewPortal';
import BookingModal from './components/BookingModal';
import Toast from './components/Toast';
import { Phone, Mail, MapPin, ArrowUp, Heart } from 'lucide-react';
import { DRIVER_CONTACT, DRIVER_CONTACT_DISPLAY, DRIVER_EMAIL, DRIVER_LOCATION } from './utils/pricing';

export default function App() {
  const [toasts, setToasts] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Helper: Trigger toast notifications
  const triggerToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Handlers for starting checkout flow
  const handleStartCheckout = (details) => {
    setBookingDetails(details);
    setIsBookingOpen(true);
    triggerToast('info', 'Opening booking checkout summary...');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col font-sans select-none overflow-x-hidden antialiased">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section Slider */}
      <HeroSlider />

      {/* Direct Booking Advantage Badges & Van Showcase */}
      <TrustBadges />

      {/* Point-to-Point Flat Transfers Rate Calculator */}
      <RatesCalculator
        onBookTransfer={handleStartCheckout}
        triggerToast={triggerToast}
      />

      {/* Multi-Day Preset Loops & Custom Route Builder with Live SVG Map */}
      <TourPlanner
        onBookTour={handleStartCheckout}
        triggerToast={triggerToast}
      />

      {/* Traveler Reviews with Client Base64 Image Upload */}
      <ReviewPortal triggerToast={triggerToast} />

      {/* Premium Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 relative overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            
            {/* About Premier Lanka Tours */}
            <div className="md:col-span-5 text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-base">
                  PLT
                </div>
                <span className="text-white font-bold font-display text-lg tracking-wider">
                  PREMIER LANKA TOURS
                </span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                Discover Sri Lanka in Style with Premier Lanka Tours — your trusted independent private vehicle operator since 2015. Direct 0% commission bookings, a fleet of 4 vehicles, and a dedicated English-speaking driver-guide.
              </p>
              
              <div className="flex gap-4 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                <span>Safe</span>
                <span>•</span>
                <span>Flexible</span>
                <span>•</span>
                <span>Zero Commission</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 text-left">
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
                Explore Website
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a href="#home" className="hover:text-emerald-400 transition-colors">Home Page</a>
                </li>
                <li>
                  <a href="#fleet" className="hover:text-emerald-400 transition-colors">Our Fleet & Features</a>
                </li>
                <li>
                  <a href="#rates" className="hover:text-emerald-400 transition-colors">Airport Flat Rates</a>
                </li>
                <li>
                  <a href="#planner" className="hover:text-emerald-400 transition-colors">Multi-Day Tour Planner</a>
                </li>
                <li>
                  <a href="#reviews" className="hover:text-emerald-400 transition-colors">Traveler Reviews</a>
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="md:col-span-4 text-left">
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
                Direct Contact
              </h4>
              <ul className="space-y-3.5 text-xs sm:text-sm">
                <li className="flex items-start gap-2.5">
                  <Phone className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-500 text-[10px] uppercase font-bold leading-none mb-1">
                      Call / WhatsApp
                    </span>
                    <a
                      href={`https://wa.me/${DRIVER_CONTACT}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-semibold hover:text-emerald-400 transition-colors"
                    >
                      {DRIVER_CONTACT_DISPLAY} (Direct Line)
                    </a>
                  </div>
                </li>
                
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-500 text-[10px] uppercase font-bold leading-none mb-1">
                      Email Bookings
                    </span>
                    <a
                      href={`mailto:${DRIVER_EMAIL}`}
                      className="text-white font-semibold hover:text-emerald-400 transition-colors"
                    >
                      {DRIVER_EMAIL}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-500 text-[10px] uppercase font-bold leading-none mb-1">
                      Base Location
                    </span>
                    <span className="text-slate-300">
                      {DRIVER_LOCATION}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Row */}
          <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>
              &copy; {new Date().getFullYear()} Premier Lanka Tours. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1">
                Made with <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" /> for Sri Lankan Tourism
              </span>
              <span>•</span>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1 hover:text-emerald-400 transition-colors font-semibold"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Checkout Booking Popup Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        bookingDetails={bookingDetails}
        triggerToast={triggerToast}
      />

      {/* Floating Notifications Toasts */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
