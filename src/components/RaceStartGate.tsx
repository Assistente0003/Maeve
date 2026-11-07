import React, { useState } from 'react';
import { Flag, Play, Sparkles } from 'lucide-react';
import { sugarRushAudio } from '../audio/sugarRushSynth';

interface RaceStartGateProps {
  childName: string;
  age: number;
  onStartRace: () => void;
  onTriggerConfetti: () => void;
}

export const RaceStartGate: React.FC<RaceStartGateProps> = ({
  childName,
  age,
  onStartRace,
  onTriggerConfetti,
}) => {
  const [raceState, setRaceState] = useState<'idle' | 'countdown' | 'racing' | 'finished'>('idle');
  const [lightIndex, setLightIndex] = useState<number>(0);
  const [countdownText, setCountdownText] = useState<string>('');

  const handleStartClick = () => {
    if (raceState !== 'idle') return;

    setRaceState('countdown');
    sugarRushAudio.playRaceCountdownBeep(false);
    setLightIndex(1);
    setCountdownText('PREPARAR... 3');

    // Step 2: Yellow light (2)
    setTimeout(() => {
      sugarRushAudio.playRaceCountdownBeep(false);
      setLightIndex(2);
      setCountdownText('ATENÇÃO... 2');
    }, 800);

    // Step 3: Yellow light (1)
    setTimeout(() => {
      sugarRushAudio.playRaceCountdownBeep(false);
      setLightIndex(2);
      setCountdownText('QUASE LÁ... 1');
    }, 1600);

    // Step 4: Green light & GO!
    setTimeout(() => {
      sugarRushAudio.playRaceCountdownBeep(true);
      sugarRushAudio.playEngineZoom();
      sugarRushAudio.start(); // Inicia a trilha suave e bem baixa
      setLightIndex(3);
      setCountdownText('LARGADA! VAI, MAEVE! 🏁');
      setRaceState('racing');
      onTriggerConfetti();
    }, 2400);

    // Step 5: Finish race & open invitation
    setTimeout(() => {
      setRaceState('finished');
      onStartRace();
    }, 3800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-b from-[#190730] via-[#2a0e4a] to-[#120524] text-white px-3 sm:px-6 py-4 sm:py-6 select-none">
      {/* Background artwork */}
      <div className="absolute inset-0 pointer-events-none opacity-35 overflow-hidden">
        <img
          src="/src/assets/images/sugar_rush_hero_pool_1793918777080.jpg"
          alt="Reino dos Doces"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter blur-xs scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120524] via-[#1a0730]/75 to-[#120524]/70"></div>
      </div>

      {/* Floating candy sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-6 left-8 text-xl animate-float">🍭</div>
        <div className="absolute top-12 right-8 text-2xl animate-sweet-bounce">🍬</div>
        <div className="absolute bottom-10 left-10 text-xl animate-pulse">🍩</div>
        <div className="absolute bottom-12 right-10 text-2xl animate-float">✨</div>
      </div>

      {/* Unified Compact Container: No Dead Spaces */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center space-y-3 sm:space-y-4 my-auto">
        
        {/* Header Block with Maeve's Pilot Avatar */}
        <div className="text-center space-y-1.5 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#00e5c9] text-[10px] sm:text-xs font-arcade text-[#00e5c9] tracking-wider shadow-[0_0_15px_rgba(0,229,201,0.4)]">
            <Flag className="w-3.5 h-3.5 text-yellow-300" />
            <span>SUGAR RUSH GRAND PRIX</span>
          </div>

          {/* Pilot Badge with Maeve's Picture */}
          <div className="flex items-center gap-2.5 bg-[#1f093a]/90 border-2 border-pink-400/60 rounded-full py-1 px-3 shadow-[0_0_15px_rgba(255,42,122,0.4)] mt-0.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-yellow-300 bg-pink-500 shadow-md flex-shrink-0">
              <img
                src="/assets/aistudio/IMG-20261107-WA0056_b3170e5e.jpg"
                alt="Maeve"
                className="w-full h-full object-cover object-[center_20%]"
              />
            </div>
            <div className="text-left pr-1">
              <div className="text-[10px] text-pink-300 font-arcade uppercase tracking-wider">Pilota Oficial</div>
              <div className="text-xs sm:text-sm font-fredoka font-bold text-white leading-tight">Maeve · 2 Aninhos 🎂</div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-fredoka text-white tracking-wide drop-shadow-[0_4px_14px_rgba(255,42,122,0.9)] leading-tight">
            {childName} <span className="text-[#00e5c9]">faz {age} Aninhos!</span>
          </h1>

          <p className="text-xs sm:text-sm font-fredoka text-pink-200 drop-shadow max-w-md mx-auto">
            Acelere na pista mais doce do Reino dos Doces com a Vanellope! 🏎️🎂
          </p>

          {/* Traffic Light / Semáforo de Largada (Compact & Centered) */}
          <div className="pt-1 flex flex-col items-center">
            <div className="flex items-center gap-2.5 bg-[#170529] border-2 border-pink-400/50 rounded-2xl px-4 py-1.5 shadow-[0_0_20px_rgba(255,42,122,0.35)]">
              {/* Red Light */}
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white/30 transition-all ${
                  lightIndex === 1
                    ? 'bg-red-500 shadow-[0_0_18px_#ef4444] scale-110'
                    : 'bg-red-950/70 opacity-35'
                }`}
              />
              {/* Yellow Light */}
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white/30 transition-all ${
                  lightIndex === 2
                    ? 'bg-yellow-400 shadow-[0_0_18px_#eab308] scale-110'
                    : 'bg-yellow-950/70 opacity-35'
                }`}
              />
              {/* Green Light */}
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white/30 transition-all ${
                  lightIndex === 3
                    ? 'bg-[#00e5c9] shadow-[0_0_20px_#00e5c9] scale-115 animate-pulse'
                    : 'bg-emerald-950/70 opacity-35'
                }`}
              />
            </div>

            {countdownText && (
              <div className="mt-1.5 font-arcade text-xs sm:text-sm text-yellow-300 tracking-wider font-bold animate-bounce">
                {countdownText}
              </div>
            )}
          </div>
        </div>

        {/* Middle: Proportional Candy Racetrack Container */}
        <div className="w-full relative">
          {/* Starting Arch Label */}
          <div className="w-full flex items-center justify-between px-4 sm:px-6 -mb-2 z-20 relative pointer-events-none">
            <div className="w-6 sm:w-8 h-10 candy-stripes-pink rounded-t-lg border-x border-white/50"></div>
            <div className="bg-[#1f0838] border-2 border-yellow-300 px-4 py-1 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)] font-arcade text-[10px] sm:text-xs text-yellow-300 tracking-widest uppercase">
              START / LARGADA
            </div>
            <div className="w-6 sm:w-8 h-10 candy-stripes-mint rounded-t-lg border-x border-white/50"></div>
          </div>

          {/* Racetrack Box (Harmonious height, no dead spaces) */}
          <div className="w-full h-64 sm:h-72 rounded-3xl bg-gradient-to-b from-[#2a1348] via-[#3a1655] to-[#1c082e] border-3 border-yellow-400/80 shadow-[0_0_35px_rgba(255,42,122,0.35)] relative overflow-hidden flex flex-col justify-around py-2 px-2">
            {/* Asphalt & Curbs */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="h-2.5 w-full candy-stripes-pink"></div>
              <div className="h-0.5 w-full border-b border-dashed border-white/40"></div>
              <div className="h-0.5 w-full border-b border-dashed border-white/40"></div>
              <div className="h-2.5 w-full candy-stripes-mint"></div>
            </div>

            {/* Checkered starting line */}
            <div className="absolute left-14 sm:left-16 top-0 bottom-0 w-5 flex flex-col justify-between opacity-80 pointer-events-none">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full h-2.5 ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`}
                />
              ))}
            </div>

            {/* Lane 1: Maeve's Signature Cupcake Kart (#2) driven by Maeve */}
            <div
              className={`relative flex items-center transition-all ${
                raceState === 'racing'
                  ? 'translate-x-[900px] duration-[1400ms] ease-in'
                  : raceState === 'countdown'
                  ? 'animate-sweet-bounce translate-x-2'
                  : 'translate-x-0'
              }`}
            >
              <div className="relative flex items-center gap-1.5 pl-1">
                {/* Maeve Pilot Driving the Kart */}
                <div className="relative flex items-center">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-yellow-300 shadow-[0_0_10px_#ff2a7a] -mr-3 z-20 flex-shrink-0 bg-pink-500">
                    <img
                      src="/assets/aistudio/IMG-20261107-WA0056_b3170e5e.jpg"
                      alt="Maeve Pilota"
                      className="w-full h-full object-cover object-[center_20%]"
                    />
                  </div>
                  <div className="relative flex flex-col items-center">
                    <div className="flex items-center gap-1 bg-[#ff2a7a] text-white text-[9px] font-fredoka font-bold px-2 py-0.5 rounded-full border border-yellow-300 shadow-[0_0_8px_#ff2a7a] -mb-1 z-10 animate-pulse">
                      <span>🎂 Maeve #2</span>
                    </div>
                    <div className="text-3xl sm:text-4xl filter drop-shadow-[0_4px_10px_rgba(255,42,122,0.9)] transform -scale-x-100">
                      🧁🏎️
                    </div>
                  </div>
                </div>
                {raceState === 'racing' && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs animate-ping">💨</span>
                    <span className="text-[10px] text-pink-300 font-arcade">NITRO!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Lane 2: Vanellope's Cookie Kart */}
            <div
              className={`relative flex items-center transition-all ${
                raceState === 'racing'
                  ? 'translate-x-[900px] duration-[1600ms] ease-in delay-75'
                  : raceState === 'countdown'
                  ? 'animate-sweet-bounce translate-x-1'
                  : 'translate-x-0'
              }`}
            >
              <div className="relative flex items-center gap-1.5">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-fredoka font-bold text-[#00e5c9] bg-black/60 px-1.5 rounded -mb-1 z-10">
                    Vanellope
                  </span>
                  <div className="text-2xl sm:text-3xl filter drop-shadow-[0_4px_8px_rgba(0,229,201,0.8)] transform -scale-x-100">
                    🍪🏎️
                  </div>
                </div>
              </div>
            </div>

            {/* Lane 3: Donut Nitro Kart */}
            <div
              className={`relative flex items-center transition-all ${
                raceState === 'racing'
                  ? 'translate-x-[900px] duration-[1500ms] ease-in delay-150'
                  : raceState === 'countdown'
                  ? 'animate-sweet-bounce translate-x-1.5'
                  : 'translate-x-0'
              }`}
            >
              <div className="relative flex items-center gap-1.5">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-fredoka font-bold text-yellow-300 bg-black/60 px-1.5 rounded -mb-1 z-10">
                    Donut Turbo
                  </span>
                  <div className="text-2xl sm:text-3xl filter drop-shadow-[0_4px_8px_rgba(255,215,0,0.8)] transform -scale-x-100">
                    🍩🏎️
                  </div>
                </div>
              </div>
            </div>

            {/* Lane 4: Gummy Bear Racer */}
            <div
              className={`relative flex items-center transition-all ${
                raceState === 'racing'
                  ? 'translate-x-[900px] duration-[1700ms] ease-in delay-100'
                  : raceState === 'countdown'
                  ? 'animate-sweet-bounce translate-x-1'
                  : 'translate-x-0'
              }`}
            >
              <div className="relative flex items-center gap-1.5">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-fredoka font-bold text-pink-300 bg-black/60 px-1.5 rounded -mb-1 z-10">
                    Jujuba Veloz
                  </span>
                  <div className="text-2xl sm:text-3xl filter drop-shadow-[0_4px_8px_rgba(255,105,180,0.8)] transform -scale-x-100">
                    🍬🏎️
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Proportional & Tightly Framed */}
        <div className="text-center space-y-1.5 pt-1 w-full">
          {raceState === 'idle' ? (
            <button
              onClick={handleStartClick}
              className="group relative px-6 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#ff2a7a] via-[#ff0066] to-[#00e5c9] text-white font-fredoka font-black text-base sm:text-xl uppercase tracking-wider shadow-[0_0_30px_rgba(255,42,122,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-yellow-300 flex items-center justify-center gap-2.5 mx-auto animate-sweet-bounce"
            >
              <div className="w-7 h-7 rounded-full bg-yellow-300 text-slate-900 flex items-center justify-center group-hover:rotate-45 transition-transform">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <span>START / DAR LARGADA! 🚦</span>
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </button>
          ) : (
            <div className="py-2.5 font-fredoka font-bold text-base sm:text-lg text-[#00e5c9] animate-pulse flex items-center justify-center gap-2">
              <span>🏁 Acelerando os motores para o convite da Maeve...</span>
            </div>
          )}

          <p className="text-[11px] text-pink-300/80 font-fredoka">
            Toque no botão para dar a largada e abrir o convite! 🍭
          </p>
        </div>

      </div>
    </div>
  );
};
