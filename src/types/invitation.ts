export interface PartyDetails {
  childName: string;
  age: number;
  dateStr: string; // "2026-11-21"
  timeStr: string; // "14:00"
  locationName: string;
  address: string;
  mapsUrl: string;
  whatsappPhone: string;
  customMessage: string;
  poolNotice: string;
}

export interface GuestRsvp {
  id: string;
  guestName: string;
  attendeesCount: number;
  giftToBring: string;
  confirmedAt: string;
}

export const DEFAULT_PARTY_DETAILS: PartyDetails = {
  childName: "Maeve",
  age: 2,
  dateStr: "2026-11-21",
  timeStr: "14:00",
  locationName: "Festa no Reino dos Doces (Com Piscina! 🏊‍♀️)",
  address: "Estrada Nossa Senhora da Fonte, 711c - Vila Marilena, Guaianazes",
  mapsUrl: "https://maps.google.com/?q=Estrada+Nossa+Senhora+da+Fonte+711c+Vila+Marilena+Guaianases",
  whatsappPhone: "5511983182725",
  customMessage: "Preparem seus motores de caramelo e tragam roupa de banho! A Maeve convida você para comemorar seus 2 aninhos com muita piscina, doces e diversão no Reino da Vanellope! 🏊‍♀️🍭🏎️",
  poolNotice: "Festa com Piscina! Traga sua roupa de banho e toalha para curtir!",
};
