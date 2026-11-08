import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Sparkles,
  Navigation,
  Waves,
  SunMedium,
} from 'lucide-react';
import { PartyDetails } from '../types/invitation';
import { downloadCalendarEvent } from '../lib/calendar';

interface InvitationCardProps {
  party: PartyDetails;
  onTriggerConfetti: () => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  party,
  onTriggerConfetti,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl bg-[#180a2b]/95 border-2 border-[#ff2a7a] shadow-[0_0_35px_rgba(255,42,122,0.3)] overflow-hidden transition-all duration-300">
      {/* Candy Cane Top Edge Strip */}
      <div className="h-3 w-full candy-stripes-pink"></div>

      {/* Hero Banner with Clean Scrim */}
      <div className="relative w-full h-44 sm:h-56 overflow-hidden bg-[#240c3d]">
        <img
          src="/assets/images/sugar_rush_hero_pool_1793918777080.jpg"
          alt="Sugar Rush Reino dos Doces com Piscina"
          loading="eager"
          className="w-full h-full object-cover object-center filter saturate-110"
        />
        {/* Measured dark scrim to ensure 100% legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#180a2b] via-[#180a2b]/60 to-transparent"></div>

        {/* Top Floating Mini-Badge */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#00e5c9]/60 text-[10px] sm:text-xs font-arcade text-[#00e5c9] tracking-wider shadow">
            <span>🏁</span> REINO DOS DOCES
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ff2a7a]/80 backdrop-blur-md text-[10px] sm:text-xs font-fredoka font-bold text-white shadow">
            <span>🍬</span> Aniversário da Maeve
          </div>
        </div>
      </div>

      {/* Featured Birthday Girl Portrait - Maeve with Sugar Rush Candy Styling */}
      <div className="relative -mt-20 sm:-mt-24 mb-2 flex flex-col items-center px-4 z-20">
        <div className="relative group cursor-pointer" onClick={onTriggerConfetti}>
          {/* Glowing aura */}
          <div className="absolute -inset-2 bg-gradient-to-r from-[#ff2a7a] via-yellow-300 to-[#00e5c9] rounded-full blur-md opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
          
          {/* Candy cane circular frame */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 candy-stripes-pink shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
            <div className="w-full h-full rounded-full overflow-hidden border-3 border-white bg-[#1a0730]">
              <img
                src="/assets/aistudio/IMG-20261108-WA0000_19264d4a.jpg"
                alt="Maeve - Aniversariante 2 Aninhos"
                className="w-full h-full object-cover object-[center_25%] transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Sweet candy pins around frame */}
          <div className="absolute -top-1 -right-1 text-2xl animate-sweet-bounce drop-shadow select-none">🍭</div>
          <div className="absolute -bottom-1 -left-1 text-2xl animate-float drop-shadow select-none">🧁</div>
          <div className="absolute top-1/2 -left-3 text-lg animate-pulse select-none">✨</div>
          <div className="absolute top-1/2 -right-3 text-lg animate-pulse select-none">💖</div>
        </div>

        {/* Badge below photo */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#ff2a7a] via-[#e6005c] to-[#ff2a7a] border-2 border-yellow-300 shadow-[0_4px_15px_rgba(255,42,122,0.6)] text-xs sm:text-sm font-fredoka font-bold text-white uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
          <span>Nossa Doce Aniversariante · 2 Aninhos</span>
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
        </div>

        {/* Birthday Title */}
        <div className="text-center mt-3 space-y-1">
          <h1 className="text-3xl sm:text-5xl font-black font-fredoka text-white tracking-wide drop-shadow-[0_2px_12px_rgba(255,42,122,0.9)]">
            {party.childName} <span className="text-[#00e5c9]">faz {party.age} Anos!</span>
          </h1>
          <p className="text-xs sm:text-sm font-fredoka text-pink-200 drop-shadow">
            Tema Vanellope von Schweetz no Reino dos Doces 🍭✨
          </p>
        </div>
      </div>

      {/* Main Content - Compact, Clear, Non-Overlapping */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Custom Message */}
        <div className="p-3.5 rounded-2xl bg-[#250d3d]/80 border border-[#00e5c9]/30 text-center">
          <p className="text-sm sm:text-base font-fredoka text-pink-100 leading-snug italic">
            "{party.customMessage}"
          </p>
        </div>

        {/* Prominent Swimming Pool Announcement Alert */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#0284c7]/40 via-[#06b6d4]/30 to-[#0284c7]/40 border-2 border-[#38bdf8] text-center shadow-[0_0_20px_rgba(56,189,248,0.35)] relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 text-cyan-300 font-bold font-fredoka text-sm sm:text-base mb-1">
            <Waves className="w-5 h-5 text-cyan-300 animate-pulse" />
            <span className="uppercase tracking-wider">Aviso Importante: Festa com Piscina! 🏊‍♀️☀️</span>
            <SunMedium className="w-5 h-5 text-yellow-300" />
          </div>
          <p className="text-xs sm:text-sm text-cyan-100 font-fredoka leading-relaxed">
            Vai ter piscina para a criançada se refrescar e brincar muito! <strong>Não esqueçam de trazer roupa de banho e toalha!</strong> 🩱🩳🏖️
          </p>
        </div>

        {/* Three Compact Details Cards (Date, Time, Location) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Data da Festa: 21/11/2026 */}
          <div className="p-3.5 rounded-2xl bg-[#200b34] border border-pink-500/40 text-center flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-center gap-1.5 text-pink-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] font-arcade uppercase">Data da Festa</span>
              </div>
              <strong className="text-white font-fredoka text-base sm:text-lg block">
                21 / 11 / 2026
              </strong>
              <span className="text-xs text-pink-200/80 font-fredoka">
                Sábado às 14:00
              </span>
            </div>
            <button
              type="button"
              onClick={() => downloadCalendarEvent('')}
              className="mt-2 py-1.5 px-2.5 rounded-xl bg-pink-500/20 border border-pink-400/40 text-pink-200 hover:text-white hover:bg-pink-500/30 font-fredoka text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span>📅 Salvar na Agenda</span>
            </button>
          </div>

          {/* 2. Horário: 14:00 */}
          <div className="p-3.5 rounded-2xl bg-[#200b34] border border-teal-400/40 text-center flex flex-col justify-center">
            <div className="flex items-center justify-center gap-1.5 text-[#00e5c9] mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] font-arcade uppercase">Horário</span>
            </div>
            <strong className="text-[#00e5c9] font-fredoka text-xl sm:text-2xl block">
              {party.timeStr}
            </strong>
            <span className="text-xs text-teal-200/80 font-fredoka">
              Largada Pontual
            </span>
          </div>

          {/* 3. Local com Endereço em Guaianases */}
          <div className="p-3.5 rounded-2xl bg-[#200b34] border border-yellow-400/40 text-center flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-center gap-1.5 text-yellow-300 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-[10px] font-arcade uppercase">Endereço</span>
              </div>
              <strong className="text-white font-fredoka text-xs sm:text-sm block">
                Estrada Nossa Senhora da Fonte, 711c
              </strong>
              <span className="text-[11px] text-pink-200/80 font-fredoka block mt-0.5">
                Vila Marilena, Guaianazes
              </span>
            </div>
            <a
              href={party.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 py-1.5 px-3 rounded-xl bg-yellow-400 text-slate-950 font-fredoka font-bold text-xs flex items-center justify-center gap-1 hover:brightness-110 transition-transform active:scale-95 shadow-sm"
            >
              <Navigation className="w-3 h-3" />
              <span>Abrir no Google Maps</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* Small Candy Action Button */}
        <div className="text-center pt-1">
          <button
            onClick={onTriggerConfetti}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ff2a7a]/20 border border-[#ff2a7a] hover:bg-[#ff2a7a]/40 text-pink-200 text-xs font-fredoka font-bold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Chuva de Jujubas! 🍬</span>
          </button>
        </div>
      </div>

      {/* Candy Cane Bottom Edge Strip */}
      <div className="h-3 w-full candy-stripes-mint"></div>
    </div>
  );
};
