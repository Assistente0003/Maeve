import React, { useState, useEffect } from 'react';
import { Heart, Flag, Volume2, VolumeX } from 'lucide-react';
import { JellybeanCanvas, triggerGlobalCandyBurst } from './components/JellybeanCanvas';
import { InvitationCard } from './components/InvitationCard';
import { CountdownTimer } from './components/CountdownTimer';
import { RsvpSection } from './components/RsvpSection';
import { RaceStartGate } from './components/RaceStartGate';
import { PartyDetails, DEFAULT_PARTY_DETAILS } from './types/invitation';
import { sugarRushAudio } from './audio/sugarRushSynth';

export default function App() {
  const [party] = useState<PartyDetails>(DEFAULT_PARTY_DETAILS);
  const [hasStartedRace, setHasStartedRace] = useState<boolean>(false);
  const [burstTrigger, setBurstTrigger] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    // Keep mute state synced
    setIsMuted(!sugarRushAudio.isSoundPlaying() && sugarRushAudio.getVolume() === 0);
  }, []);

  const handleToggleSound = () => {
    if (isMuted) {
      setIsMuted(false);
      sugarRushAudio.setVolume(0.12);
      sugarRushAudio.start();
    } else {
      setIsMuted(true);
      sugarRushAudio.setVolume(0);
      sugarRushAudio.stop();
    }
  };

  const handleTriggerConfetti = () => {
    setBurstTrigger((prev) => prev + 1);
    triggerGlobalCandyBurst();
  };

  return (
    <div className="min-h-screen bg-[#110521] text-slate-100 font-outfit relative overflow-x-hidden selection:bg-[#ff2a7a] selection:text-white">
      {/* Background Interactive Candy & Jellybean Canvas */}
      <JellybeanCanvas burstTrigger={burstTrigger} />

      {/* Background Ambient Candy Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#ff2a7a]/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-[#00e5c9]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Discreet Sound Toggle in bottom corner */}
      <button
        onClick={handleToggleSound}
        className="fixed bottom-4 right-4 z-40 p-2.5 rounded-full bg-[#1e0833]/85 backdrop-blur-md border border-pink-500/40 text-pink-200 hover:text-white hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,42,122,0.3)] transition-all cursor-pointer"
        title={isMuted ? 'Tocar trilha suave' : 'Silenciar música'}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00e5c9]" />}
      </button>

      {!hasStartedRace ? (
        /* FIRST SCREEN: The Proportional Sweet Racetrack with Candy Karts and START button */
        <RaceStartGate
          childName={party.childName}
          age={party.age}
          onStartRace={() => setHasStartedRace(true)}
          onTriggerConfetti={handleTriggerConfetti}
        />
      ) : (
        /* SECOND SCREEN: The Invitation (Directly with Countdown at the Top - No Top Nav Bar) */
        <div className="animate-fade-in transition-opacity duration-500">
          {/* Main Container */}
          <main className="relative z-20 max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20 space-y-6">
            {/* 1. Countdown Timer placed at the very top */}
            <section id="countdown" className="scroll-mt-6">
              <CountdownTimer dateStr={party.dateStr} timeStr={party.timeStr} />
            </section>

            {/* 2. Main Invitation Card with Pool Alert and Guaianazes Address */}
            <section id="invitation" className="scroll-mt-6">
              <InvitationCard
                party={party}
                onTriggerConfetti={handleTriggerConfetti}
              />
            </section>

            {/* 3. RSVP Presence & Written Gift Selection */}
            <section id="rsvp" className="scroll-mt-6">
              <RsvpSection
                party={party}
                onTriggerConfetti={handleTriggerConfetti}
              />
            </section>
          </main>

          {/* Clean Footer with Discreet Action Links */}
          <footer className="relative z-20 border-t border-pink-500/20 bg-[#0c0317] py-8 px-4 text-center">
            <div className="max-w-md mx-auto space-y-3 text-xs text-pink-300/70 font-fredoka">
              <div className="flex items-center justify-center gap-2 text-white font-bold text-sm">
                <span>🍬</span>
                <span>Reino dos Doces · {party.childName} faz {party.age} Anos!</span>
                <span>🏊‍♀️</span>
              </div>
              <p>
                21/11/2026 às {party.timeStr} · Estrada Nossa Senhora da Fonte, 711c - Guaianazes
              </p>

              {/* Discreet Action Buttons in Footer */}
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => setHasStartedRace(false)}
                  className="px-3.5 py-1.5 rounded-full bg-[#1e0833] border border-pink-400/30 text-pink-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Rever Largada da Corrida</span>
                </button>
              </div>

              <div className="text-[11px] text-pink-400/50 flex items-center justify-center gap-1 pt-1">
                <span>Vanellope von Schweetz & Festa com Piscina</span>
                <Heart className="w-3 h-3 text-pink-500 fill-current" />
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
