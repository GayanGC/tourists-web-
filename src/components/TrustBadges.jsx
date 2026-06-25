import React from 'react';
import { Percent, Shield, ShieldCheck, Languages, Banknote, HelpCircle, Users, Wind, Briefcase, Zap } from 'lucide-react';

const ADVANTAGES = [
  {
    icon: <Percent className="w-6 h-6 text-amber-500" />,
    title: "0% Commission",
    desc: "No travel agencies or middlemen. Deal directly with the driver for the absolute lowest pricing."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
    title: "10+ Years Safe Driving",
    desc: "Unblemished safety record touring across Sri Lanka's winding mountain ranges and highways."
  },
  {
    icon: <Languages className="w-6 h-6 text-emerald-500" />,
    title: "Fluent English Speaker",
    desc: "Clear communication throughout. Your driver serves as a friendly driver-guide for local tips."
  },
  {
    icon: <Banknote className="w-6 h-6 text-amber-500" />,
    title: "0% Upfront Deposit",
    desc: "No pre-payment required. Pay in cash (USD or LKR) or via card at the end of your trip."
  }
];

const VAN_SPECS = [
  { icon: <Users className="w-5 h-5 text-emerald-500 shrink-0" />, label: "Comfortable Seating", value: "Up to 10 passengers + bags" },
  { icon: <Wind className="w-5 h-5 text-emerald-500 shrink-0" />, label: "Dual Zone A/C", value: "Individual vents for all rows" },
  { icon: <Briefcase className="w-5 h-5 text-emerald-500 shrink-0" />, label: "Ample Luggage Capacity", value: "Fits up to 10 large suitcases" },
  { icon: <Zap className="w-5 h-5 text-emerald-500 shrink-0" />, label: "Modern Amenities", value: "USB charging ports, Wi-Fi" }
];

export default function TrustBadges() {
  return (
    <section id="fleet" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative Blur BG */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
            Why Book Premier Lanka Tours
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white mt-2 mb-6">
            Direct Bookings, Direct Trust
          </h2>
          <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
          <p className="text-slate-400 mt-6 text-lg leading-relaxed">
            Avoid large aggregators. Booking directly with an independent operator ensures personalized service, absolute flexibility, and transparent pricing.
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {ADVANTAGES.map((adv, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:border-emerald-500/50 hover:bg-slate-800/60 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                {adv.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                {adv.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {adv.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Fleet Details */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-800/65 to-slate-900 border border-slate-700 p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Fleet Image and Label */}
            <div className="lg:col-span-6 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 rounded-2xl"></div>
              {/* Using a high quality image of a Toyota HiAce KDH van model on the road or a mockup */}
              <img
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
                alt="Toyota KDH Premium Van"
                className="w-full h-80 object-cover rounded-2xl shadow-lg border border-slate-700"
              />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-bold uppercase rounded-md tracking-wider">
                  Premium Vehicle
                </span>
                <h4 className="text-2xl font-bold font-display text-white mt-2">
                  Toyota HiAce KDH — Spacious & High-Roof
                </h4>
                <p className="text-slate-300 text-xs mt-1">Super Long Wheelbase • High Roof</p>
              </div>
            </div>

            {/* Fleet Specs */}
            <div className="lg:col-span-6">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Fleet Spotlight
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1 mb-4">
                Travel Sri Lanka in Comfort & Style
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
                Our well-maintained, spacious Toyota HiAce KDH van is deep-cleaned before every tour and specifically outfitted for travelers navigating Sri Lanka's tropical climate.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {VAN_SPECS.map((spec, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-700">
                      {spec.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300">{spec.label}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extra Perks Badge */}
              <div className="mt-8 p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0"></div>
                <p className="text-xs text-emerald-300">
                  Fully licensed with tourism passenger insurance cover and highway passes.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
