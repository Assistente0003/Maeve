import React, { useState, useEffect } from 'react';
import { CheckCircle2, Users, Gift, MessageCircle, Heart, Loader2, Sparkles } from 'lucide-react';
import { PartyDetails, GuestRsvp } from '../types/invitation';
import { fetchRsvpsFromSupabase, saveRsvpToSupabase } from '../lib/supabase';

interface RsvpSectionProps {
  party: PartyDetails;
  onTriggerConfetti: () => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ party, onTriggerConfetti }) => {
  const [guestName, setGuestName] = useState<string>('');
  const [attendeesCount, setAttendeesCount] = useState<number | ''>(0);
  const [giftWritten, setGiftWritten] = useState<string>('');
  const [confirmedList, setConfirmedList] = useState<GuestRsvp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasConfirmed, setHasConfirmed] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);

      try {
        const stored = localStorage.getItem(`sugar_rush_rsvp_${party.childName}_v3`);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setConfirmedList(parsed);
          }
        }
      } catch {
        // ignore
      }

      try {
        const remoteData = await fetchRsvpsFromSupabase();
        if (isMounted && remoteData.length > 0) {
          const mapped: GuestRsvp[] = remoteData.map((r, i) => ({
            id: r.id || String(i),
            guestName: r.guest_name,
            attendeesCount: r.attendees_count,
            giftToBring: r.gift_to_bring,
            confirmedAt: r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR') : 'Hoje',
          }));
          setConfirmedList(mapped);
          setIsLoading(false);
          return;
        }
      } catch {
        // quiet fallback
      }

      if (isMounted) setIsLoading(false);
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [party.childName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !giftWritten.trim()) return;

    setIsSubmitting(true);
    onTriggerConfetti();

    const giftText = giftWritten.trim();
    const countValue = typeof attendeesCount === 'number' ? attendeesCount : 0;

    const newRsvp: GuestRsvp = {
      id: Date.now().toString(),
      guestName: guestName.trim(),
      attendeesCount: countValue,
      giftToBring: giftText,
      confirmedAt: 'Hoje',
    };

    try {
      await saveRsvpToSupabase({
        guest_name: guestName.trim(),
        attendees_count: countValue,
        gift_to_bring: giftText,
      });
    } catch {
      // quiet fallback
    }

    const updatedList = [newRsvp, ...confirmedList];
    setConfirmedList(updatedList);
    try {
      localStorage.setItem(`sugar_rush_rsvp_${party.childName}_v3`, JSON.stringify(updatedList));
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    setHasConfirmed(true);

    const cleanPhone = '5511983182725';
    const companionsText = countValue === 0 ? '0 (apenas eu)' : `${countValue} pessoa(s)`;
    const message = encodeURIComponent(
      `🏁 *CONFIRMAÇÃO DE PRESENÇA - ANIVERSÁRIO DA ${party.childName.toUpperCase()}!* 🍬🏊‍♀️\n\n` +
      `Olá! Aqui é *${guestName.trim()}*, confirmando nossa presença na festa!\n\n` +
      `📅 *Data:* 21/11/2026 às 14:00\n` +
      `📍 *Local:* Estrada Nossa Senhora da Fonte, 711c - Guaianazes\n` +
      `👥 *Pessoas que vão com você:* ${companionsText}\n` +
      `🎁 *Presente que vamos levar:* ${giftText}\n` +
      `🏊‍♀️ Já estamos com as roupas de banho preparadas para a piscina!\n\n` +
      `Até lá com muita alegria! ✨`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const totalAttendees = confirmedList.reduce((acc, curr) => acc + 1 + (Number(curr.attendeesCount) || 0), 0);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-[#170929]/95 border-2 border-[#ff2a7a] p-5 sm:p-7 shadow-[0_0_30px_rgba(255,42,122,0.25)]">
      {/* Title */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00e5c9]/20 border border-[#00e5c9] text-xs font-arcade text-[#00e5c9] uppercase tracking-wider mb-1.5">
          <Gift className="w-3.5 h-3.5" />
          Confirmação de Presença & Presente
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-fredoka text-white">
          Marque Presença no Reino dos Doces! 🎁
        </h3>
        <p className="text-xs text-pink-200/80 mt-1">
          Confirme quem vai, traga roupa de banho para a piscina e <strong>escreva qual presente você vai levar para a Maeve</strong>!
        </p>
      </div>

      {!hasConfirmed ? (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Guest Name */}
          <div>
            <label className="block text-xs font-bold text-pink-300 mb-1 font-fredoka uppercase tracking-wider">
              Seu Nome ou Nome da Família: <span className="text-[#00e5c9]">*</span>
            </label>
            <input
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Ex: Família Souza, Mariana & Pedro..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#230f3a] border border-pink-500/40 text-white placeholder-pink-300/40 focus:outline-hidden focus:border-[#00e5c9] font-fredoka text-sm"
            />
          </div>

          {/* Number of Attendees - Starting at 0 */}
          <div>
            <label className="block text-xs font-bold text-pink-300 mb-1 font-fredoka uppercase tracking-wider flex items-center justify-between">
              <span>Quantas Pessoas vão com você?</span>
              <span className="text-[10px] text-pink-300/70 font-normal">0 se for apenas você</span>
            </label>
            <div className="flex items-center gap-3 bg-[#230f3a] border border-pink-500/40 rounded-xl px-3.5 py-2">
              <Users className="w-4 h-4 text-[#00e5c9] shrink-0" />
              <input
                type="number"
                min="0"
                max="20"
                value={attendeesCount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setAttendeesCount('');
                  } else {
                    setAttendeesCount(Math.max(0, parseInt(val) || 0));
                  }
                }}
                className="w-full bg-transparent text-white font-fredoka font-bold text-base focus:outline-hidden"
              />
              <span className="text-xs text-pink-300 font-fredoka shrink-0">
                {attendeesCount === '' || attendeesCount === 0
                  ? '0 pessoas'
                  : attendeesCount === 1
                  ? '1 pessoa'
                  : `${attendeesCount} pessoas`}
              </span>
            </div>
          </div>

          {/* Written Gift Requirement */}
          <div>
            <label className="block text-xs font-bold text-pink-300 mb-1 font-fredoka uppercase tracking-wider flex items-center justify-between">
              <span>Escreva o Presente que você vai levar: <span className="text-[#00e5c9]">*</span></span>
              <span className="text-[10px] text-yellow-300 font-normal">Obrigatório</span>
            </label>
            <input
              type="text"
              required
              value={giftWritten}
              onChange={(e) => setGiftWritten(e.target.value)}
              placeholder="Digite exatamente qual presente você vai levar para a Maeve..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#230f3a] border-2 border-pink-400/50 text-white placeholder-pink-300/40 focus:outline-hidden focus:border-[#00e5c9] focus:ring-2 focus:ring-[#00e5c9]/20 font-fredoka text-sm transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#25d366] to-[#128c7e] hover:brightness-110 active:scale-98 text-white font-fredoka font-bold text-sm uppercase tracking-wider shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Registrando Confirmação...</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Confirmar Presença e Presente no WhatsApp</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="text-center py-5 space-y-3 animate-sweet-bounce">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold font-fredoka text-white">
              Presença e Presente Confirmados! 🎉
            </h4>
            <p className="text-xs text-pink-200 mt-0.5">
              Obrigado, <strong className="text-[#00e5c9]">{guestName}</strong>! Seu presente (<em>{giftWritten}</em>) foi registrado com sucesso!
            </p>
          </div>
          <button
            onClick={() => {
              setHasConfirmed(false);
              setGuestName('');
              setGiftWritten('');
              setAttendeesCount(0);
            }}
            className="text-xs text-pink-300 underline hover:text-white font-fredoka cursor-pointer"
          >
            Confirmar outro convidado
          </button>
        </div>
      )}

      {/* Confirmed Guests & Written Gifts Board (Cleaned, zeroed when empty, no Supabase mention) */}
      <div className="mt-6 pt-4 border-t border-pink-500/30">
        <div className="flex items-center justify-between text-xs font-fredoka mb-2.5">
          <span className="text-pink-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-current" />
            <span>Mural dos Convidados:</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#ff2a7a] text-white font-bold text-[11px]">
            {totalAttendees} pessoas confirmadas
          </span>
        </div>

        {isLoading ? (
          <div className="py-4 text-center text-xs text-pink-300 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#00e5c9]" />
            <span>Carregando lista...</span>
          </div>
        ) : confirmedList.length === 0 ? (
          <div className="py-6 px-4 rounded-2xl bg-[#200b34]/60 border border-pink-500/20 text-center">
            <Sparkles className="w-5 h-5 text-yellow-300 mx-auto mb-1.5 opacity-80" />
            <p className="text-xs font-fredoka text-pink-200">
              Ainda não há confirmações registradas.
            </p>
            <p className="text-[11px] font-fredoka text-pink-300/70 mt-0.5">
              Seja o primeiro a confirmar presença e o presente da Maeve! 🍬
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {confirmedList.map((guest) => (
              <div
                key={guest.id}
                className="p-2.5 rounded-xl bg-[#230d3a]/80 border border-pink-400/20 flex items-center justify-between text-left text-xs"
              >
                <div className="truncate pr-2">
                  <span className="font-bold text-white block truncate">{guest.guestName}</span>
                  <span className="text-[11px] text-pink-200/90 truncate block flex items-center gap-1 mt-0.5">
                    <span>🎁 Vai levar:</span>
                    <strong className="text-yellow-300 font-semibold">{guest.giftToBring}</strong>
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#00e5c9] bg-[#00e5c9]/10 px-2 py-0.5 rounded-lg border border-[#00e5c9]/30 shrink-0">
                  {guest.attendeesCount > 0 ? `+${guest.attendeesCount}` : 'Individual'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
