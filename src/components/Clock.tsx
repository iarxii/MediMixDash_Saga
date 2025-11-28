import React from 'react';

interface ClockProps {
  currentTime: number;
  gameOver: boolean;
}

const Clock: React.FC<ClockProps> = ({ currentTime, gameOver }) => {
  return (
    <div className="p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        {/* <h3 className="text-sm lg:text-lg font-bold text-center">Current Time</h3> */}
        <div /* className="text-2xl md:text-3xl" */ style={{ fontSize: '20px', textAlign: 'center', width: '100%' }} aria-hidden="true">
          {(() => {
            const hours24 = Math.floor(currentTime / 3600);
            if (hours24 >= 5 && hours24 < 12) return '🌅 Good Morning';
            if (hours24 >= 12 && hours24 < 18) return '☀️ Good Afternoon';
            return '🌙 Night Shift';
          })()}
        </div>
      </div>

      {/* Clock Row: responsive - column on small screens, row on md+ */}
      <div className="flex flex-col md:flex-row items-center justify-center mb-3 gap-3 md:gap-6">
        {/* Analogue Clock */}
        <div className="flex justify-center mb-3">
          <div className="relative w-20 h-20 md:w-24 md:h-24">
            {/* Clock Face */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Clock Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="white"
                stroke="#374151"
                strokeWidth="2"
              />

              {/* Hour Markers */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30) * (Math.PI / 180);
                const x1 = 50 + 35 * Math.sin(angle);
                const y1 = 50 - 35 * Math.cos(angle);
                const x2 = 50 + 40 * Math.sin(angle);
                const y2 = 50 - 40 * Math.cos(angle);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#374151"
                    strokeWidth="2"
                  />
                );
              })}

              {/* Minute Markers */}
              {[...Array(60)].map((_, i) => {
                if (i % 5 !== 0) {
                  const angle = (i * 6) * (Math.PI / 180);
                  const x1 = 50 + 38 * Math.sin(angle);
                  const y1 = 50 - 38 * Math.cos(angle);
                  const x2 = 50 + 40 * Math.sin(angle);
                  const y2 = 50 - 40 * Math.cos(angle);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#6B7280"
                      strokeWidth="1"
                    />
                  );
                }
                return null;
              })}

              {/* Hour Hand */}
              <line
                x1="50"
                y1="50"
                x2={50 + 20 * Math.sin(((Math.floor(currentTime / 3600) % 12) * 30 + (Math.floor((currentTime % 3600) / 60) * 0.5)) * (Math.PI / 180))}
                y2={50 - 20 * Math.cos(((Math.floor(currentTime / 3600) % 12) * 30 + (Math.floor((currentTime % 3600) / 60) * 0.5)) * (Math.PI / 180))}
                stroke="#1F2937"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Minute Hand */}
              <line
                x1="50"
                y1="50"
                x2={50 + 30 * Math.sin((Math.floor((currentTime % 3600) / 60) * 6) * (Math.PI / 180))}
                y2={50 - 30 * Math.cos((Math.floor((currentTime % 3600) / 60) * 6) * (Math.PI / 180))}
                stroke="#374151"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Second Hand */}
              <line
                x1="50"
                y1="50"
                x2={50 + 35 * Math.sin(((currentTime % 60) * 6) * (Math.PI / 180))}
                y2={50 - 35 * Math.cos(((currentTime % 60) * 6) * (Math.PI / 180))}
                stroke="#EF4444"
                strokeWidth="1"
                strokeLinecap="round"
              />

              {/* Center Dot */}
              <circle
                cx="50"
                cy="50"
                r="3"
                fill="#374151"
              />
            </svg>
          </div>
        </div>

        {/* Digital Clock */}
        <div className="text-center">
          <div className="bg-gray-100 px-4 py-2 rounded-lg border-2 border-gray-300 inline-block">
            <p className="text-xl md:text-2xl font-mono font-bold text-gray-800 tabular-nums">
              {(() => {
                const hours24 = Math.floor(currentTime / 3600);
                const hours12 = hours24 % 12 || 12;
                const minutes = Math.floor((currentTime % 3600) / 60);
                const seconds = currentTime % 60;
                const ampm = hours24 >= 12 ? 'PM' : 'AM';
                return `${hours12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`;
              })()}
            </p>
          </div>
        </div>
      </div>

      {gameOver && <p className="text-center text-red-600 font-bold text-sm lg:text-base mt-2">Game Over!</p>}
    </div>
  );
};

export default Clock;