"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou senha inválidos");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm space-y-8 p-8 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/images/logo-nome.svg"
            alt="Zoryam"
            width={160}
            height={40}
            style={{ width: "auto", height: "auto" }}
            priority
          />
          <p className="text-sm text-gray-500">Acesse sua conta</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-[#6852FA] focus:border-[#6852FA] focus:outline-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-[#6852FA] focus:border-[#6852FA] focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#6852FA] hover:bg-[#5142B7] text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
