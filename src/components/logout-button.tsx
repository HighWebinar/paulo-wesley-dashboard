"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-3 py-3 min-h-[44px] text-sm font-medium text-gray-500 hover:text-red-500 rounded-xl transition-all w-full"
    >
      <LogOut className="w-5 h-5" />
      Sair
    </button>
  );
}
