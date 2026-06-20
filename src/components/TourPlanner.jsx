import React, { useState, useEffect } from 'react';
import { Compass, HelpCircle, Check, ArrowRight, Home, Shield, DollarSign, Calendar, Star } from 'lucide-react';
import SriLankaMap from './SriLankaMap';
import { DESTINATIONS, HOTEL_TIERS, PRESET_ROUTES, EXCHANGE_RATE } from '../utils/pricing';

export default function TourPlanner({ onBookTour, triggerToast }) {
  const [plannerType, setPlannerType] = useState('preset'); // 'preset' or 'custom'
  const [selectedPreset, setSelectedPreset] = useState('route2');
  const [startPoint, setStartPoint] = useState('bia');

  // Custom Checklist State
  const [customStops, setCustomStops] = useState(['negombo', 'sigiriya', 'kandy']);
  const [customDays, setCustomDays] = useState(5);

  // Hotel accommodation tier
  const [hotelTier, setHotelTier] = useState('standard');

  // Helper: Get active stops list based on planner type
  const getActiveStops = () => {
    if (plannerType === 'preset') {
      const route = PRESET_ROUTES.find(r => r.id === selectedPreset);
      return route ? route.stops : [];
    }
    return customStops;
  };

  // Helper: Get total days
  const getTotalDays = () => {
    if (plannerType === 'preset') {
      const route = PRESET_ROUTES.find(r => r.id === selectedPreset);
      return route ? route.days : 3;
    }
    return customDays;
  };

  const activeStops = getActiveStops();
  const totalDays = getTotalDays();
  const activeHotelTier = HOTEL_TIERS[hotelTier];

  // Pricing Model
  // Vehicle rate per day (varies slightly if custom vs preset due to mileage)
  const vehicleRatePerDay = plannerType === 'preset'
    ? (selectedPreset === 'route1' ? 65 : 60)
    : 65;

  const vehicleTotal = vehicleRatePerDay * totalDays;
  
  // Nights = days - 1 (min 1 night if 1 day)
  const totalNights = Math.max(1, totalDays - 1);
  const hotelPricePerNight = activeHotelTier.pricePerNightUSD;
  const hotelTotal = hotelPricePerNight * totalNights;
  const grandTotalUSD = vehicleTotal + hotelTotal;

  // Toggle stop in custom checklist
  const handleCustomStopToggle = (stopKey) => {
    if (customStops.includes(stopKey)) {
      // Don't empty entirely, keep at least 1 stop
      if (customStops.length > 1) {
        setCustomStops(customStops.filter(s => s !== stopKey));
      } else {
        triggerToast('warning', 'Please select at least one destination.');
      }
    } else {
      setCustomStops([...customStops, stopKey]);
    }
  };

  // Update preset defaults
  useEffect(() => {
    if (plannerType === 'preset') {
      const route = PRESET_ROUTES.find(r => r.id === selectedPreset);
      if (route) {
        setHotelTier(route.hotelTierDefault);
        setStartPoint(route.startPoint);
      }
    }
  }, [selectedPreset, plannerType]);

  const handleBookClick = () => {
    onBookTour({
      type: 'tour',
      plannerType,
      presetId: selectedPreset,
      startPoint,
      stops: activeStops,
      days: totalDays,
      nights: totalNights,
      hotelTier,
      priceUSD: grandTotalUSD,
      vehicleTotal,
      hotelTotal
    });
  };

  return (
    <section id="planner" className="py-24 bg-slate-900 text-white relative">
      <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
            Tailor-Made Holidays
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white mt-2 mb-6">
            Interactive Tour Planner
          </h2>
          <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
          <p className="text-slate-400 mt-6 text-lg leading-relaxed">
            Choose a curated preset route or design your own dream Sri Lankan holiday. Check your stops, adjust days, and choose your hotel tier to watch your price calculate instantly on the live map.
          </p>
        </div>

        {/* Dual Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Configurator Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Planner Type Tabs */}
            <div className="flex p-1 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <button
                onClick={() => setPlannerType('preset')}
                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
                  plannerType === 'preset'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Curated Preset Loops
              </button>
              <button
                onClick={() => setPlannerType('custom')}
                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
                  plannerType === 'custom'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Design My Own Route
              </button>
            </div>

            {/* Inputs Wrapper */}
            <div className="bg-slate-800/30 border border-slate-700/60 backdrop-blur-sm p-6 sm:p-8 rounded-3xl space-y-6">
              
              {/* Pickup location for both */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Start From
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setStartPoint('bia')}
                    className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                      startPoint === 'bia'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-700 bg-slate-900/40 text-slate-400 hover:text-white hover:border-slate-500'
                    }`}
                  >
                    BIA Airport
                  </button>
                  <button
                    onClick={() => setStartPoint('colombo')}
                    className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                      startPoint === 'colombo'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-700 bg-slate-900/40 text-slate-400 hover:text-white hover:border-slate-500'
                    }`}
                  >
                    Colombo City
                  </button>
                </div>
              </div>

              {/* CURATED PRESETS */}
              {plannerType === 'preset' && (
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Select Curated Preset Package
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    {PRESET_ROUTES.map((route) => (
                      <div
                        key={route.id}
                        onClick={() => setSelectedPreset(route.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                          selectedPreset === route.id
                            ? 'border-emerald-500 bg-slate-800/80 shadow-lg'
                            : 'border-slate-700 bg-slate-900/20 hover:border-slate-600 hover:bg-slate-900/40'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white text-base flex items-center gap-2">
                            <Compass className="w-4 h-4 text-amber-500" />
                            <span>{route.name}</span>
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/25 text-amber-400 border border-amber-500/30 shrink-0">
                            {route.days} Days
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {route.description}
                        </p>
                        
                        {/* Preset destinations trail */}
                        <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                          <span>{startPoint === 'bia' ? 'BIA' : 'Colombo'}</span>
                          {route.stops.map((stop) => (
                            <React.Fragment key={stop}>
                              <ArrowRight className="w-3 h-3 text-slate-600" />
                              <span>{DESTINATIONS[stop]?.name}</span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CUSTOM "DESIGN MY OWN" */}
              {plannerType === 'custom' && (
                <div className="space-y-6">
                  {/* Total duration slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Trip Duration (Days)
                      </label>
                      <span className="text-amber-400 font-bold text-sm bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                        {customDays} Days / {Math.max(1, customDays - 1)} Nights
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="14"
                      value={customDays}
                      onChange={(e) => setCustomDays(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-1">
                      <span>1 Day</span>
                      <span>5 Days</span>
                      <span>10 Days</span>
                      <span>14 Days</span>
                    </div>
                  </div>

                  {/* Checklist of stops */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Select Destinations to Add to Route
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(DESTINATIONS).map(([key, dest]) => {
                        const isChecked = customStops.includes(key);
                        return (
                          <div
                            key={key}
                            onClick={() => handleCustomStopToggle(key)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 select-none ${
                              isChecked
                                ? 'border-emerald-500 bg-emerald-500/10 text-white'
                                : 'border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-500 hover:text-white'
                            }`}
                          >
                            <span className="text-xs font-medium">{dest.name}</span>
                            <div
                              className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                isChecked
                                  ? 'bg-emerald-500 border-emerald-400 text-slate-900'
                                  : 'border-slate-600 bg-slate-950'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* HOTEL SWITCHER */}
              <div className="border-t border-slate-700/50 pt-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Hotel Accommodation Budget Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.entries(HOTEL_TIERS).map(([key, tier]) => {
                    const isSelected = hotelTier === key;
                    return (
                      <div
                        key={key}
                        onClick={() => setHotelTier(key)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/10 text-white'
                            : 'border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-500 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <h5 className="font-bold text-xs sm:text-sm">{tier.name}</h5>
                          <span className="text-xs text-amber-400 font-bold shrink-0">
                            +${tier.pricePerNightUSD}/nt
                          </span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-slate-400">
                          {tier.description.substring(0, 75)}...
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Hotel List Previews */}
                <div className="mt-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-[11px] text-slate-400">
                  <span className="font-bold text-emerald-400 block mb-1">
                    Recommended Hotels for Selected Tier:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                    {activeStops.map((stop) => {
                      const hotelName = activeHotelTier.hotels[stop];
                      const destName = DESTINATIONS[stop]?.name;
                      if (!hotelName) return null;
                      return (
                        <div key={stop} className="flex justify-between py-0.5 border-b border-slate-900/40">
                          <span className="font-medium text-slate-300">{destName}:</span>
                          <span className="text-slate-400 italic">{hotelName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* Price Breakdown and Booking summary */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-left w-full">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  All-Inclusive Tour Quote
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-emerald-400 text-2xl font-bold font-display">$</span>
                  <span className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-white leading-none">
                    {grandTotalUSD}
                  </span>
                  <span className="text-slate-400 text-sm font-semibold ml-1">USD</span>
                </div>
                <p className="text-amber-400 text-base font-bold font-display mt-2">
                  LKR {(grandTotalUSD * EXCHANGE_RATE).toLocaleString()}
                </p>

                {/* Micro Breakout */}
                <div className="mt-4 flex gap-4 text-[10px] text-slate-400 font-medium">
                  <div>
                    Van & Driver ({totalDays} Days): <span className="text-white font-bold">${vehicleTotal}</span>
                  </div>
                  <div>
                    Hotels ({totalNights} Nights): <span className="text-white font-bold">${hotelTotal}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookClick}
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base tracking-wide transition-all shadow-lg shadow-emerald-950/60 hover:-translate-y-0.5 hover:shadow-emerald-500/20 group"
              >
                <span>Book This Tour</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Map Column */}
          <div className="lg:col-span-5 h-full">
            <div className="sticky top-28">
              <div className="text-left mb-3.5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Interactive Sri Lanka Route
                </h4>
                <p className="text-[11px] text-slate-500">
                  Yellow line highlights the highway path starting at {startPoint === 'bia' ? 'BIA Airport' : 'Colombo'}.
                </p>
              </div>
              <SriLankaMap selectedStops={activeStops} startPoint={startPoint} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
