import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/types/leads";

const TABLE_NAME = "captacao-paulo-wesley";

export class LeadsRepository {
  async findAll(): Promise<Lead[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Lead[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .gte("data", startDate)
      .lte("data", endDate)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async count(): Promise<number> {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from(TABLE_NAME)
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count ?? 0;
  }
}
