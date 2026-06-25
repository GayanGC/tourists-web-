import React, { useState } from 'react';
import { X, Calendar, User, Phone, FileText, Send, Sparkles } from 'lucide-react';
import { DRIVER_CONTACT, DESTINATIONS, START_COORDS, EXCHANGE_RATE } from '../utils/pricing';

export default function BookingModal({ isOpen, onClose, bookingDetails, triggerToast }) {
  if (!isOpen || !bookingDetails) return null;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    startDate: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      triggerToast('warning', 'Please enter your name.');
      return;
    }
    if (!formData.phone.trim()) {
      triggerToast('warning', 'Please enter your WhatsApp phone number.');
      return;
    }
    if (!formData.startDate) {
      triggerToast('warning', 'Please select your travel start date.');
      return;
    }

    // Format WhatsApp Message
    let text = `🌴 *Premier Lanka Tours - Booking Request* 🌴\n\n`;
    text += `👤 *Client Name:* ${formData.name}\n`;
    text += `📱 *WhatsApp:* ${formData.phone}\n`;
    text += `📅 *Start Date:* ${formData.startDate}\n\n`;

    if (bookingDetails.type === 'transfer') {
      const start = START_COORDS[bookingDetails.startPoint]?.name || bookingDetails.startPoint;
      const dest = DESTINATIONS[bookingDetails.destination]?.name || bookingDetails.destination;
      const veh = bookingDetails.vehicle;
      
      text += `🚍 *Service Type:* Flat Airport Transfer\n`;
      text += `🚗 *Selected Vehicle:* ${veh ? `${veh.emoji} ${veh.name} (${veh.type})` : 'Toyota KDH Van'}\n`;
      text += `📍 *From:* ${start}\n`;
      text += `📍 *To:* ${dest}\n`;
      text += `⏱️ *Est. Duration:* ${bookingDetails.time}\n`;
      text += `🛣️ *Est. Distance:* ${bookingDetails.distance}\n\n`;
    } else {
      const start = START_COORDS[bookingDetails.startPoint]?.name || bookingDetails.startPoint;
      const stopsNames = bookingDetails.stops.map(s => DESTINATIONS[s]?.name || s).join(' ➔ ');
      const veh = bookingDetails.vehicle;
      
      text += `🚍 *Service Type:* Multi-Day Private Tour (${bookingDetails.plannerType === 'preset' ? 'Curated Loop' : 'Custom Route'})\n`;
      text += `🚗 *Selected Vehicle:* ${veh ? `${veh.emoji} ${veh.name} (${veh.type})` : 'Toyota KDH Van'}\n`;
      text += `🛫 *Start Point:* ${start}\n`;
      text += `📍 *Stops:* ${stopsNames}\n`;
      text += `⏳ *Duration:* ${bookingDetails.days} Days\n\n`;
    }

    text += `💰 *Private Vehicle — All-Inclusive Flat Quote:*\n`;
    text += `• *USD Rate:* $${bookingDetails.priceUSD} USD\n`;
    text += `• *LKR Rate:* LKR ${(bookingDetails.priceUSD * EXCHANGE_RATE).toLocaleString()} LKR\n`;
    const vehName = bookingDetails.vehicle?.name || 'Toyota KDH van';
    text += `_(Includes ${vehName}, driver, fuel, expressway tolls, airport parking & driver accommodation)_\n\n`;

    if (formData.notes.trim()) {
      text += `💬 *Special Requests:* ${formData.notes}\n`;
    }

    text += `⚡ _Sent from Premier Lanka Tours Web App_`;

    const encodedText = encodeURIComponent(text);
    const whatsappURL = `https://wa.me/${DRIVER_CONTACT}?text=${encodedText}`;

    triggerToast('success', 'Redirecting to WhatsApp to complete your booking...');
    
    // Smooth delay before redirecting
    setTimeout(() => {
      window.open(whatsappURL, '_blank');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 text-white rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold font-display text-white">
              Confirm Your Booking
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Invoice Summary Box */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              Booking Quote Summary
            </h4>

            {bookingDetails.type === 'transfer' ? (
              <div className="space-y-1.5 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400">Route:</span>{' '}
                  <span className="font-bold">
                    {START_COORDS[bookingDetails.startPoint]?.name} to{' '}
                    {DESTINATIONS[bookingDetails.destination]?.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Vehicle:</span>{' '}
                  <span className="font-semibold text-white">
                    {bookingDetails.vehicle
                      ? `${bookingDetails.vehicle.emoji} ${bookingDetails.vehicle.name} (${bookingDetails.vehicle.type})`
                      : 'Toyota KDH Van'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Distance / Time:</span>{' '}
                  <span className="font-semibold text-white">
                    {bookingDetails.distance} ({bookingDetails.time})
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400">Tour Route:</span>{' '}
                  <span className="font-bold">
                    {bookingDetails.stops.map(s => DESTINATIONS[s]?.name || s).join(' ➔ ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Vehicle:</span>{' '}
                  <span className="font-semibold text-white">
                    {bookingDetails.vehicle
                      ? `${bookingDetails.vehicle.emoji} ${bookingDetails.vehicle.name} (${bookingDetails.vehicle.type})`
                      : 'Toyota KDH Van'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Duration:</span>{' '}
                  <span className="font-semibold text-white">
                    {bookingDetails.days} Days
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Rate:</span>{' '}
                  <span className="font-semibold text-white">
                    ${bookingDetails.vehicleRatePerDay}/day (vehicle & driver)
                  </span>
                </div>
              </div>
            )}

            {/* Price tag */}
            <div className="mt-4 pt-3.5 border-t border-slate-900/50 flex justify-between items-baseline">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Fixed Van Rate (Tolls & Parking Included):
              </span>
              <div className="text-right">
                <span className="text-xl font-bold font-display text-emerald-400">
                  ${bookingDetails.priceUSD} USD
                </span>
                <span className="block text-[10px] text-amber-400 font-bold font-display">
                  LKR {(bookingDetails.priceUSD * EXCHANGE_RATE).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Your Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Sarah Jenkins"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-slate-950 text-sm font-medium transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                WhatsApp Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +44 7911 123456"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-slate-950 text-sm font-medium transition-all"
                  required
                />
              </div>
            </div>

            {/* Travel Date */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Travel Start Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-slate-950 text-sm font-medium transition-all cursor-pointer text-slate-300"
                  required
                />
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Special Requests / Notes (Optional)
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3.5 pointer-events-none text-slate-500">
                  <FileText className="w-4 h-4" />
                </div>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Child seats, wheelchair access, pickup hotel name, specific pickup time..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-slate-950 text-sm font-medium transition-all resize-none"
                ></textarea>
              </div>
            </div>

            {/* Note about direct contact */}
            <p className="text-[10px] text-slate-500 text-center leading-relaxed mt-2">
              By clicking "Send Request", you will be redirected to chat directly with Premier Lanka Tours on WhatsApp. We will confirm pickup time, route details, and complete your booking.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 hover:-translate-y-0.5 transition-all text-xs uppercase"
            >
              <Send className="w-4 h-4" />
              <span>Send Booking to WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
