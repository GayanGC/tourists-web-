import React, { useState } from 'react';
import { Plane, MapPin, Navigation, Clock, ShieldCheck, ArrowRight, Users, Briefcase } from 'lucide-react';
import { DESTINATIONS, START_COORDS, EXCHANGE_RATE, VEHICLES } from '../utils/pricing';

// Only vehicles available for airport transfers (tourOnly: false)
const TRANSFER_VEHICLES = VEHICLES.filter(v => !v.tourOnly);

// Color palette mapping for each vehicle
const colorMap = {
  amber: {
    border: 'border-amber-400',
    bg: 'bg-amber-400/10',
    text: 'text-amber-400',
    badge: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    ring: 'ring-amber-400/40'
  },
  emerald: {
    border: 'border-emerald-400',
    bg: 'bg-emerald-400/10',
    text: 'text-emerald-400',
    badge: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
    ring: 'ring-emerald-400/40'
  }
};

export default function RatesCalculator({ onBookTransfer, triggerToast }) {
  const [startPoint, setStartPoint] = useState('bia');
  const [destination, setDestination] = useState('kandy');
  const [selectedVehicleId, setSelectedVehicleId] = useState('kdh');

  const startName = START_COORDS[startPoint]?.name || 'Airport';
  const destData = DESTINATIONS[destination];
  const rateData = destData?.rates[startPoint];
  const selectedVehicle = TRANSFER_VEHICLES.find(v => v.id === selectedVehicleId) || TRANSFER_VEHICLES[2];

  // Apply vehicle price multiplier to the KDH base rate
  const computedPriceUSD = rateData
    ? Math.round(rateData.priceUSD * selectedVehicle.priceMultiplier)
    : null;

  const handleBookClick = () => {
    if (!rateData) {
      triggerToast('info', "Pricing for this route is calculated manually. Let's discuss over WhatsApp!");
      return;
    }
    onBookTransfer({
      type: 'transfer',
      startPoint,
      destination,
      vehicle: selectedVehicle,
      priceUSD: computedPriceUSD,
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
            Fixed-Rate Airport &amp; City Transfers
          </h2>
          <div className="h-1 w-20 bg-emerald-600 mx-auto rounded-full"></div>
          <p className="text-slate-600 mt-6 text-lg leading-relaxed">
            Choose your pickup, destination, and preferred vehicle. All flat rates include expressway tolls, airport parking, fuel, and driver costs.
          </p>
        </div>

        {/* Vehicle Selector — horizontal cards */}
        <div className="max-w-4xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 text-center">
            Step 1 — Choose Your Vehicle
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TRANSFER_VEHICLES.map((vehicle) => {
              const isSelected = selectedVehicleId === vehicle.id;
              const c = colorMap[vehicle.color] || colorMap.emerald;
              return (
                <button
                  key={vehicle.id}
                  onClick={() => setSelectedVehicleId(vehicle.id)}
                  className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-300 focus:outline-none group ${
                    isSelected
                      ? `${c.border} ${c.bg} ring-2 ${c.ring} shadow-lg`
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {/* Popular badge for KDH */}
                  {vehicle.id === 'kdh' && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-emerald-600 text-white text-[9px] font-bold uppercase rounded-full tracking-wider whitespace-nowrap">
                      Most Popular
                    </span>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl leading-none">{vehicle.emoji}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${isSelected ? c.badge : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {vehicle.type}
                    </span>
                  </div>

                  <h4 className={`font-bold text-base leading-tight mb-0.5 ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                    {vehicle.name}
                  </h4>
                  <p className={`text-[11px] mb-3 ${isSelected ? c.text : 'text-slate-400'}`}>
                    {vehicle.tagline}
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span>{vehicle.pax}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Briefcase className="w-3.5 h-3.5 shrink-0" />
                      <span>{vehicle.luggage}</span>
                    </div>
                  </div>

                  {/* Rate indicator */}
                  <div className={`mt-3 pt-3 border-t ${isSelected ? 'border-slate-300' : 'border-slate-100'}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? c.text : 'text-slate-400'}`}>
                      {vehicle.priceMultiplier === 1
                        ? 'Standard Rate'
                        : vehicle.priceMultiplier < 1
                        ? `${Math.round((1 - vehicle.priceMultiplier) * 100)}% Less`
                        : `${Math.round((vehicle.priceMultiplier - 1) * 100)}% More`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form & Card Wrapper */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Form Side */}
          <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/80 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-emerald-600" />
                <span>Step 2 — Select Route</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6 ml-7">
                {selectedVehicle.emoji} {selectedVehicle.name} selected
              </p>

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
              <p className="text-slate-400 text-xs mt-1 flex items-center gap-1.5">
                <span>{selectedVehicle.emoji}</span>
                <span>{selectedVehicle.name} — {selectedVehicle.type}</span>
              </p>

              {/* Price Display */}
              <div className="my-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-slate-400 text-xl font-bold font-display">$</span>
                  <span className="text-5xl sm:text-6xl font-bold font-display tracking-tight text-white leading-none">
                    {computedPriceUSD ?? '--'}
                  </span>
                  <span className="text-slate-400 text-sm font-semibold ml-2">USD</span>
                </div>
                <div className="text-amber-400 font-bold font-display text-lg mt-2">
                  LKR {computedPriceUSD ? (computedPriceUSD * EXCHANGE_RATE).toLocaleString() : '--'}
                </div>
                {selectedVehicle.priceMultiplier !== 1 && rateData && (
                  <p className="text-slate-500 text-[11px] mt-1">
                    KDH base ${rateData.priceUSD} × {selectedVehicle.priceMultiplier} = ${computedPriceUSD}
                  </p>
                )}
              </div>

              {/* Bullet details */}
              <ul className="space-y-3.5 mb-8">
                <li className="flex items-center gap-2.5 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Highway tolls &amp; taxes included</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Airport parking fees covered</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No prepayment / deposit needed</span>
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
