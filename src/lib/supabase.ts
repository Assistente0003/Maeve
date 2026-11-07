import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ceshgmaomhieppjcgabs.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlc2hnbWFvbWhpZXBwamNnYWJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5MTYwODYsImV4cCI6MjEwOTQ5MjA4Nn0.toUw0pFevcpgSGBeBTL6dFj4sG578zLHlXXTkX1xmWY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseRsvpRecord {
  id?: string;
  guest_name: string;
  attendees_count: number;
  gift_to_bring: string;
  created_at?: string;
}

export async function fetchRsvpsFromSupabase(): Promise<SupabaseRsvpRecord[]> {
  const tableCandidates = ['rsvps', 'presencas', 'convidados'];

  for (const table of tableCandidates) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map((item) => ({
          id: item.id?.toString() || Math.random().toString(),
          guest_name: item.guest_name || item.nome || item.name || 'Convidado',
          attendees_count: Number(item.attendees_count || item.quantidade || item.pessoas || 1),
          gift_to_bring: item.gift_to_bring || item.presente || item.gift || 'Não informado',
          created_at: item.created_at || new Date().toISOString(),
        }));
      }
    } catch {
      // try next table
    }
  }

  return [];
}

export async function saveRsvpToSupabase(record: {
  guest_name: string;
  attendees_count: number;
  gift_to_bring: string;
}): Promise<boolean> {
  const tableCandidates = ['rsvps', 'presencas', 'convidados'];

  for (const table of tableCandidates) {
    try {
      const { error } = await supabase.from(table).insert([
        {
          guest_name: record.guest_name,
          attendees_count: record.attendees_count,
          gift_to_bring: record.gift_to_bring,
          nome: record.guest_name,
          quantidade: record.attendees_count,
          presente: record.gift_to_bring,
        },
      ]);

      if (!error) {
        return true;
      }
    } catch {
      // try next table
    }
  }

  return false;
}
