import React, { useState } from 'react';
import { Plane, MapPin, Navigation, Clock, ShieldCheck, DollarSign, ArrowRight } from 'lucide-react';
import { DESTINATIONS, START_COORDS, EXCHANGE_RATE } from '../utils/pricing';

export default function RatesCalculator({ onBookTransfer, triggerToast }) {
  const [startPoint, setStartPoint] = useState('bia');
  const [destination, setDestination] = useState('kandy');

  const startName = START_COORDS[startPoint]?.name || 'Airport';
  const destData = DESTINATIONS[destination];
  const rateData = destData?.rates[startPoint];

  const handleBookClick = () => {
    if (!rateData) {
      triggerToast('info', 'Pricing for this route is currently calculated manually. Let\'s discuss over WhatsApp!');
      return;
    }
    onBookTransfer({
      type: 'transfer',
      startPoint,
      destination,
      priceUSD: rateData.priceUSD,
      distance: rateData.distance,
      time: rateData.time
    });
  };

  return (
    <section id="rates" className="py-24 bg-slate-50 text-slate-900 relative overflow-hidden">
      {/* Decorative BG element */}
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase">
            No Hidden Fees
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-slate-900 mt-2 mb-6">
            Fixed-Rate Airport & City Transfers
          </h2>
          <div className="h-1 w-20 bg-emerald-600 mx-auto rounded-full"></div>
          <p className="text-slate-600 mt-6 text-lg leading-relaxed">
            Choose your pickup and destination. Our flat transfer rates include all expressway tolls, airport parking charges, fuel, and driver accommodation.
          </p>
        </div>

        {/* Form & Card Wrapper */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Form Side */}
          <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/80 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-emerald-600" />
                <span>Estimate Transfer Rate</span>
              </h3>

              {/* Start Point */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Pickup Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Plane className="w-5 h-5" />
                  </div>
                  <select
                    value={startPoint}
                    onChange={(e) => setStartPoint(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all text-sm font-medium appearance-none cursor-pointer"
                  >
                    <option value="bia">Bandaranaike International Airport (BIA)</option>
                    <option value="colombo">Colombo City (Hotel / Residence)</option>
                  </select>
                </div>
              </div>

              {/* Destination Dropdown */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Destination Drop-off
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all text-sm font-medium appearance-none cursor-pointer"
                  >
                    {Object.entries(DESTINATIONS).map(([key, dest]) => (
                      <option key={key} value={key}>
                        {dest.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination Info Snippet */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  Destination Insights: {destData?.name}
                </h4>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  {destData?.description}
                </p>
              </div>
            </div>

            {/* Travel Metrics */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                    Est. Duration
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {rateData?.time || '--'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                    Distance
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {rateData?.distance || '--'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Display Card */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between text-white relative overflow-hidden">
            {/* Glossy radial blur */}
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-600/20 rounded-full blur-2xl"></div>

            <div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase rounded-md tracking-wider">
                Direct Driver Price
              </span>
              <h4 className="text-lg font-bold text-slate-300 mt-6 leading-tight">
                {startName} to {destData?.name}
              </h4>
              <p className="text-slate-400 text-xs mt-1">Toyota KDH Luxury Van</p>

              {/* Price Display */}
              <div className="my-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-slate-400 text-xl font-bold font-display">$</span>
                  <span className="text-5xl sm:text-6xl font-bold font-display tracking-tight text-white leading-none">
                    {rateData?.priceUSD || '--'}
                  </span>
                  <span className="text-slate-400 text-sm font-semibold ml-2">USD</span>
                </div>
                <div className="text-amber-400 font-bold font-display text-lg mt-2">
                  LKR {rateData ? (rateData.priceUSD * EXCHANGE_RATE).toLocaleString() : '--'}
                </div>
              </div>

              {/* Bullet details */}
              <ul className="space-y-3.5 mb-8">
                <li className="flex items-center gap-2.5 text-xs text-slate-300">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>Highway tolls & taxes included</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-slate-300">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>Airport parking fees covered</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-slate-300">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                  <span>No prepayment/deposit needed</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleBookClick}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-wide transition-all duration-300 shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/20 group"
            >
              <span>Book This Transfer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
