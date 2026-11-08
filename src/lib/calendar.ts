/**
 * Utility to register the party in the guest's device calendar (Apple Calendar, Google Calendar, Outlook, Android)
 */

export function generateIcsContent(gift: string): string {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const description = `Aniversário de 2 Aninhos da Maeve no Reino dos Doces com Vanellope von Schweetz! 🎂🍬\\n\\n🏊‍♀️ Festa com piscina: tragam roupa de banho e toalha!\\n🎁 Presente que vamos levar: ${gift || 'A combinar'}\\n\\n📍 Estrada Nossa Senhora da Fonte, 711c - Vila Marilena, Guaianazes`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Maeve Party//Sugar Rush//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTAMP:${now}`,
    `UID:maeve-party-20261121-${Date.now()}@sugarrush.app`,
    'SUMMARY:Aniversário de 2 Anos da Maeve - Sugar Rush 🍭🏊‍♀️',
    `DESCRIPTION:${description}`,
    'LOCATION:Estrada Nossa Senhora da Fonte, 711c - Vila Marilena, Guaianazes',
    'DTSTART:20261121T170000Z',
    'DTEND:20261121T220000Z',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Lembrete: Festa de 2 Anos da Maeve em 2 horas! 🏊‍♀️🍬',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Amanhã tem Aniversário da Maeve no Reino dos Doces! 🏊‍♀️🍬',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadCalendarEvent(gift: string) {
  try {
    const icsContent = generateIcsContent(gift);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'aniversario-maeve-2-anos.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  } catch (err) {
    console.error('Error downloading calendar event:', err);
  }
}

export function getGoogleCalendarUrl(gift: string): string {
  const title = encodeURIComponent('Aniversário de 2 Anos da Maeve - Sugar Rush 🍭🏊‍♀️');
  const details = encodeURIComponent(
    `Aniversário de 2 Aninhos da Maeve no Reino dos Doces com Vanellope von Schweetz! 🎂🍬\n\n` +
    `🏊‍♀️ Festa com piscina: não esqueçam de trazer roupa de banho e toalha!\n` +
    `🎁 Presente combinado: ${gift || 'A combinar'}\n\n` +
    `📍 Estrada Nossa Senhora da Fonte, 711c - Guaianazes`
  );
  const location = encodeURIComponent('Estrada Nossa Senhora da Fonte, 711c - Vila Marilena, Guaianazes');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261121T170000Z/20261121T220000Z&details=${details}&location=${location}`;
}
