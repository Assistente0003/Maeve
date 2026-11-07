import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
  dateStr: string;
  timeStr: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ dateStr, timeStr }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(`${dateStr}T${timeStr || '14:00'}:00`).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [dateStr, timeStr]);

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-gradient-to-r from-[#21093b]/90 via-[#340f47]/90 to-[#21093b]/90 border-2 border-[#00e5c9]/60 p-4 sm:p-5 shadow-[0_0_25px_rgba(0,229,201,0.25)]">
      <div className="flex items-center justify-center gap-2 mb-2.5 text-xs font-arcade text-[#00e5c9] tracking-wider uppercase">
        <Timer className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
        <span>Contagem Regressiva para a Festa</span>
      </div>

      {timeLeft.isPast ? (
        <div className="text-center py-2 font-fredoka font-bold text-lg text-yellow-300 animate-sweet-bounce">
          🏁 A FESTA COM PISCINA COMEÇOU! BEM-VINDOS AO REINO DOS DOCES! 🎉
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-[#120524]/80 rounded-2xl p-2 sm:p-3 border border-pink-500/30 flex flex-col items-center">
            <span className="font-arcade text-lg sm:text-2xl text-pink-400 font-bold tabular-nums">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="font-fredoka text-[10px] sm:text-xs text-pink-200 uppercase mt-0.5">
              Dias
            </span>
          </div>

          <div className="bg-[#120524]/80 rounded-2xl p-2 sm:p-3 border border-teal-500/30 flex flex-col items-center">
            <span className="font-arcade text-lg sm:text-2xl text-[#00e5c9] font-bold tabular-nums">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="font-fredoka text-[10px] sm:text-xs text-pink-200 uppercase mt-0.5">
              Horas
            </span>
          </div>

          <div className="bg-[#120524]/80 rounded-2xl p-2 sm:p-3 border border-yellow-500/30 flex flex-col items-center">
            <span className="font-arcade text-lg sm:text-2xl text-yellow-300 font-bold tabular-nums">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="font-fredoka text-[10px] sm:text-xs text-pink-200 uppercase mt-0.5">
              Minutos
            </span>
          </div>

          <div className="bg-[#120524]/80 rounded-2xl p-2 sm:p-3 border border-purple-500/30 flex flex-col items-center">
            <span className="font-arcade text-lg sm:text-2xl text-purple-300 font-bold tabular-nums animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="font-fredoka text-[10px] sm:text-xs text-pink-200 uppercase mt-0.5">
              Segundos
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
