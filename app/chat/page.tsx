'use client';

import { useEffect, useState } from 'react';
import ChatInterface from '../../components/ChatInterface';
import AuthForm from '../../components/AuthForm';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-white/20 rounded-full mb-4"></div>
          <p className="text-xs uppercase tracking-[0.5em] text-white/30">Syncing Neurons...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <main className="bg-black min-h-screen">
      <ChatInterface user={user} />
    </main>
  );
}
