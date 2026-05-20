import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [contacto, setContacto] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  async function loadContactoFor(currentUser) {
    if (!currentUser?.email) {
      setContacto(null);
      return;
    }

    try {
      const email = currentUser.email.trim().toLowerCase();
      const { data, error } = await supabase
        .from('contactos')
        .select('id, nombre, email, tipo_usuario')
        .ilike('email', email)
        .limit(1);

      if (error) {
        console.error('Error cargando contacto:', error);
        setContacto(null);
        return;
      }

      setContacto(Array.isArray(data) && data.length > 0 ? data[0] : null);
    } catch (err) {
      console.error('Excepción cargando contacto:', err);
      setContacto(null);
    }
  }

  useEffect(() => {
    // Obtener la sesión actual al cargar
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        await loadContactoFor(currentUser);
      })
      .catch((err) => {
        console.error('Error obteniendo sesión:', err);
      })
      .finally(() => {
        setLoadingSession(false);
      });

    // Suscribirse a cambios (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      try {
        await loadContactoFor(currentUser);
      } finally {
        setLoadingSession(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    contacto,
    isAdmin: contacto?.tipo_usuario === 'admin',
    loadingSession,
    signIn,
    signUp,
    signOut,
  };
}
