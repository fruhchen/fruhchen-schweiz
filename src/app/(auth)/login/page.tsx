'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { getSupabase } from '@/lib/supabase/client';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!magicLinkEmail) return;
    setLoading(true);
    const { error } = await getSupabase().auth.signInWithOtp({
      email: magicLinkEmail,
      options: { emailRedirectTo: `${window.location.origin}${redirect}` },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Magic Link gesendet! Bitte prüfe dein E-Mail-Postfach.');
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await getSupabase().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Willkommen zurück!');
      router.push(redirect);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12">
      {/* Decorative background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-teal-200/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo + App Name */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow-brand mb-5"
          >
            <Icon name="Heart" size={36} className="text-white" strokeWidth={2} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-display-sm text-gray-900 mb-2"
          >
            Frühchen Schweiz
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-gray-500 text-sm"
          >
            Gemeinsam stark — Melde dich an
          </motion.p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-soft-lg p-8"
        >
          {/* Magic Link Section */}
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-subheading text-gray-900">
                Anmelden mit Magic Link
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Wir senden dir einen Link per E-Mail
              </p>
            </div>

            <Input
              type="email"
              label="E-Mail-Adresse"
              placeholder="name@beispiel.ch"
              icon="Mail"
              value={magicLinkEmail}
              onChange={(e) => setMagicLinkEmail(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              icon="Wand2"
              size="lg"
            >
              Magic Link senden
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white/80 backdrop-blur-sm px-4 text-sm text-gray-400">
                Oder mit E-Mail und Passwort
              </span>
            </div>
          </div>

          {/* Password Login Section */}
          {!showPasswordLogin ? (
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <button
                type="button"
                onClick={() => setShowPasswordLogin(true)}
                className="inline-flex items-center gap-2 text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors"
              >
                <Icon name="KeyRound" size={16} />
                Mit Passwort anmelden
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={handlePasswordLogin}
              className="space-y-4"
            >
              <Input
                type="email"
                label="E-Mail-Adresse"
                placeholder="name@beispiel.ch"
                icon="Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                type="password"
                label="Passwort"
                placeholder="Dein Passwort"
                icon="Lock"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
                >
                  Passwort vergessen?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                icon="LogIn"
                size="lg"
              >
                Anmelden
              </Button>
            </motion.form>
          )}
        </motion.div>

        {/* Register Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-6 text-sm text-gray-500"
        >
          Noch kein Konto?{' '}
          <Link
            href="/register"
            className="text-brand-600 font-semibold hover:text-brand-700 transition-colors"
          >
            Jetzt registrieren
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
