import React from 'react';
import { DESTINATIONS, START_COORDS } from '../utils/pricing';

export default function SriLankaMap({ selectedStops, startPoint }) {
  // Combine start coordinates and destination coordinates
  const getCoordinates = (stopKey) => {
    if (stopKey === 'bia' || stopKey === 'colombo') {
      return START_COORDS[stopKey];
    }
    return DESTINATIONS[stopKey]?.coords;
  };

  // Build the connector path points
  const points = [];
  
  // Starting point (BIA or Colombo)
  const startCoords = START_COORDS[startPoint];
  if (startCoords) {
    points.push(startCoords);
  }

  // Selected destinations
  selectedStops.forEach(stopKey => {
    const coords = getCoordinates(stopKey);
    if (coords && coords !== startCoords) {
      points.push(coords);
    }
  });

  // If there are points, return back to starting point or close the loop if it's a loop
  if (points.length > 2) {
    points.push(startCoords); // return to start
  }

  // Create SVG path string
  const pathD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="relative w-full max-w-[360px] aspect-[380/540]">
        <svg
          viewBox="0 0 380 540"
          className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          {/* Stylized Island of Sri Lanka */}
          <path
            d="M 175,45 C 145,75 135,105 145,155 C 150,175 145,195 130,210 C 115,225 100,245 105,275 C 110,295 105,315 95,335 C 85,355 85,395 95,430 C 105,455 120,475 145,495 C 170,505 200,510 230,495 C 265,475 285,445 295,395 C 305,345 290,275 280,225 C 270,185 270,150 245,115 C 225,85 200,65 175,45 Z"
            className="fill-slate-900 stroke-slate-800/80 stroke-2 transition-colors duration-500"
          />

          {/* Grid lines inside Sri Lanka shape using clipPath (Optional, skipped for clean minimalism) */}

          {/* Connecting Glowing Route Path */}
          {points.length > 1 && (
            <>
              {/* Outer Glow */}
              <path
                d={pathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-40 blur-sm"
              />
              {/* Inner Glowing Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 6"
                className="animate-map-glow"
              />
            </>
          )}

          {/* Starting point node (BIA or Colombo) */}
          <g>
            <circle
              cx={startCoords.x}
              cy={startCoords.y}
              r="7"
              className="fill-amber-500 stroke-slate-950 stroke-2 animate-pulse"
            />
            <circle
              cx={startCoords.x}
              cy={startCoords.y}
              r="12"
              className="fill-none stroke-amber-500/30 stroke-1 animate-ping"
              style={{ animationDuration: '3s' }}
            />
            <text
              x={startCoords.x + 12}
              y={startCoords.y + 4}
              className="fill-amber-400 font-bold text-[10px] tracking-wide font-display shadow-sm"
            >
              START ({startCoords.name.split(' ')[0]})
            </text>
          </g>

          {/* Destination Nodes */}
          {Object.entries(DESTINATIONS).map(([key, dest]) => {
            const isSelected = selectedStops.includes(key);
            const coords = dest.coords;
            if (!coords) return null;

            return (
              <g key={key} className="group cursor-pointer">
                {/* Node Ring */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isSelected ? '6' : '4'}
                  className={`transition-all duration-300 stroke-slate-950 stroke-1.5 ${
                    isSelected
                      ? 'fill-emerald-400 scale-125 filter drop-shadow-[0_0_8px_#10b981]'
                      : 'fill-slate-700 hover:fill-slate-400'
                  }`}
                />
                
                {/* Visual Glow behind selected */}
                {isSelected && (
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="10"
                    className="fill-none stroke-emerald-400/20 stroke-1 animate-pulse"
                  />
                )}

                {/* Node label */}
                <text
                  x={coords.x + 8}
                  y={coords.y + 3}
                  className={`text-[9px] font-semibold tracking-wide transition-all duration-300 pointer-events-none select-none ${
                    isSelected
                      ? 'fill-white font-bold opacity-100'
                      : 'fill-slate-500 opacity-60 group-hover:opacity-100 group-hover:fill-slate-300'
                  }`}
                >
                  {dest.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-3.5 py-2.5 rounded-xl flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>
            <span>Start Point</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block"></span>
            <span>Selected Stops</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-0.5 border-t border-dashed border-amber-400 inline-block"></span>
            <span>Itinerary Route</span>
          </div>
        </div>
      </div>
    </div>
  );
}
