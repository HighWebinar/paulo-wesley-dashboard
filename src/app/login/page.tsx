"use client";

import { useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import Image from "next/image";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const attemptsRef = useRef(0);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  function startLockout() {
    setLocked(true);
    setCountdown(LOCKOUT_SECONDS);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setLocked(false);
          attemptsRef.current = 0;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (locked) return;

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      attemptsRef.current += 1;

      if (attemptsRef.current >= MAX_ATTEMPTS) {
        setError(`Muitas tentativas. Aguarde ${LOCKOUT_SECONDS} segundos.`);
        startLockout();
      } else {
        setError("Email ou senha inválidos");
      }

      setLoading(false);
      return;
    }

    attemptsRef.current = 0;
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
              disabled={locked}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-[#6852FA] focus:border-[#6852FA] focus:outline-none disabled:opacity-50"
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
              disabled={locked}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-[#6852FA] focus:border-[#6852FA] focus:outline-none disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || locked}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#6852FA] hover:bg-[#5142B7] text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn className="w-4 h-4" />
            {locked
              ? `Aguarde ${countdown}s`
              : loading
                ? "Entrando..."
                : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
