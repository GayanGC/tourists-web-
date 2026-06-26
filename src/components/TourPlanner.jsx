import React, { useState } from 'react';
import { Compass, Check, ArrowRight, Users, Briefcase, Mountain } from 'lucide-react';
import SriLankaMap from './SriLankaMap';
import { DESTINATIONS, PRESET_ROUTES, EXCHANGE_RATE, VEHICLES } from '../utils/pricing';

// Color palette mapping per vehicle color key
const colorMap = {
  amber: {
    border: 'border-amber-500',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    ring: 'ring-amber-500/30'
  },
  emerald: {
    border: 'border-emerald-500',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    ring: 'ring-emerald-500/30'
  },
  orange: {
    border: 'border-orange-500',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    ring: 'ring-orange-500/30'
  }
};

// KDH base rate per day for tour (per PRESET_ROUTES costPerDayUSD)
const KDH_RATE_PRESET_1 = 65;
const KDH_RATE_PRESET_2 = 60;
const KDH_RATE_CUSTOM = 65;

export default function TourPlanner({ onBookTour, triggerToast }) {
  const [plannerType, setPlannerType] = useState('preset');
  const [selectedPreset, setSelectedPreset] = useState('route2');
  const [startPoint, setStartPoint] = useState('bia');
  const [selectedVehicleId, setSelectedVehicleId] = useState('kdh');

  // Custom Checklist State
  const [customStops, setCustomStops] = useState(['negombo', 'sigiriya', 'kandy']);
  const [customDays, setCustomDays] = useState(5);

  const selectedVehicle = VEHICLES.find(v => v.id === selectedVehicleId) || VEHICLES[2];

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

  // KDH base rate per day
  const kdhBaseRatePerDay = plannerType === 'preset'
    ? (selectedPreset === 'route1' ? KDH_RATE_PRESET_1 : KDH_RATE_PRESET_2)
    : KDH_RATE_CUSTOM;

  // Apply vehicle multiplier
  const vehicleRatePerDay = Math.round(kdhBaseRatePerDay * selectedVehicle.priceMultiplier);
  const grandTotalUSD = vehicleRatePerDay * totalDays;

  // Toggle stop in custom checklist
  const handleCustomStopToggle = (stopKey) => {
    if (customStops.includes(stopKey)) {
      if (customStops.length > 1) {
        setCustomStops(customStops.filter(s => s !== stopKey));
      } else {
        triggerToast('warning', 'Please select at least one destination.');
      }
    } else {
      setCustomStops([...customStops, stopKey]);
    }
  };

  // Update preset defaults and start points
  const handleSelectPreset = (presetId) => {
    setSelectedPreset(presetId);
    const route = PRESET_ROUTES.find(r => r.id === presetId);
    if (route) {
      setStartPoint(route.startPoint);
    }
  };

  const handleSelectPlannerType = (type) => {
    setPlannerType(type);
    if (type === 'preset') {
      const route = PRESET_ROUTES.find(r => r.id === selectedPreset);
      if (route) {
        setStartPoint(route.startPoint);
      }
    }
  };

  const handleBookClick = () => {
    onBookTour({
      type: 'tour',
      plannerType,
      presetId: selectedPreset,
      startPoint,
      stops: activeStops,
      days: totalDays,
      vehicle: selectedVehicle,
      vehicleRatePerDay,
      priceUSD: grandTotalUSD
    });
  };

  return (
    <section id="planner" className="py-24 bg-slate-900 text-white relative">
      <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
            Tailor-Made Itineraries
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white mt-2 mb-6">
            Interactive Tour Planner
          </h2>
          <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
          <p className="text-slate-400 mt-6 text-lg leading-relaxed">
            Choose a curated preset loop or design your own Sri Lankan itinerary. Select your vehicle, pick stops, adjust days, and watch your private quote update live.
          </p>
        </div>

        {/* Dual Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Configurator Column */}
          <div className="lg:col-span-7 space-y-8">

            {/* ── VEHICLE SELECTOR ── */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                Select Your Vehicle
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {VEHICLES.map((vehicle) => {
                  const isSelected = selectedVehicleId === vehicle.id;
                  const c = colorMap[vehicle.color] || colorMap.emerald;
                  return (
                    <button
                      key={vehicle.id}
                      onClick={() => setSelectedVehicleId(vehicle.id)}
                      className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none ${
                        isSelected
                          ? `${c.border} ${c.bg} ring-2 ${c.ring}`
                          : 'border-slate-700 bg-slate-900/30 hover:border-slate-600 hover:bg-slate-900/50'
                      }`}
                    >
                      {/* Tour-only badge */}
                      {vehicle.tourOnly && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-orange-500 text-white text-[8px] font-bold uppercase rounded-full tracking-wider whitespace-nowrap flex items-center gap-0.5">
                          <Mountain className="w-2.5 h-2.5" /> Tours Only
                        </span>
                      )}
                      {vehicle.id === 'kdh' && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-bold uppercase rounded-full tracking-wider whitespace-nowrap">
                          Popular
                        </span>
                      )}

                      <div className="text-2xl mb-2 leading-none">{vehicle.emoji}</div>
                      <h5 className={`font-bold text-xs leading-tight mb-0.5 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {vehicle.name}
                      </h5>
                      <p className={`text-[10px] leading-tight ${isSelected ? c.text : 'text-slate-500'}`}>
                        {vehicle.type}
                      </p>

                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Users className="w-2.5 h-2.5 shrink-0" />
                          <span>{vehicle.pax}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Briefcase className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{vehicle.luggage}</span>
                        </div>
                      </div>

                      {/* Multiplier badge */}
                      <div className={`mt-2 pt-2 border-t ${isSelected ? 'border-slate-600' : 'border-slate-800'}`}>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? c.text : 'text-slate-500'}`}>
                          {vehicle.priceMultiplier === 1
                            ? 'Base Rate'
                            : vehicle.priceMultiplier < 1
                            ? `${Math.round((1 - vehicle.priceMultiplier) * 100)}% Less`
                            : `+${Math.round((vehicle.priceMultiplier - 1) * 100)}% More`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Planner Type Tabs */}
            <div className="flex p-1 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <button
                onClick={() => handleSelectPlannerType('preset')}
                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
                  plannerType === 'preset'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Curated Preset Loops
              </button>
              <button
                onClick={() => handleSelectPlannerType('custom')}
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

              {/* Pickup location */}
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
                        onClick={() => handleSelectPreset(route.id)}
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
                        {customDays} Days
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
                              className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
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

              {/* Inclusions Note */}
              <div className="border-t border-slate-700/50 pt-5">
                <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-[11px] text-emerald-300 leading-relaxed">
                  <span className="font-bold text-emerald-400 block mb-1">✅ What's included in the vehicle rate:</span>
                  Private {selectedVehicle.name} &amp; driver · Fuel costs · Expressway tolls · Airport parking · Driver accommodation. Hotel bookings are arranged independently by you.
                </div>
              </div>
            </div>

            {/* Price Breakdown and Booking Summary */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-left w-full">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  {selectedVehicle.emoji} {selectedVehicle.name} — All-In Driver Quote
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
                <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-slate-400 font-medium">
                  <div>
                    Rate: <span className="text-white font-bold">${vehicleRatePerDay}/day</span>
                  </div>
                  <div>
                    Duration: <span className="text-white font-bold">{totalDays} days</span>
                  </div>
                  <div>
                    Total: <span className="text-white font-bold">${grandTotalUSD} USD</span>
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
                  Yellow line highlights the route starting at {startPoint === 'bia' ? 'BIA Airport' : 'Colombo'}.
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
