import { createContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';

// 1. Creamos un contexto con un estado inicial más completo
export const AuthContext = createContext({
  user: null,
  loading: true, // Importante: empieza cargando
  signUp: () => {},
  signIn: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // El estado de carga inicial

  useEffect(() => {
    // 2. Confiamos en onAuthStateChange para todo.
    // La primera vez que se ejecuta, nos da el estado de la sesión inicial.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false); // La carga inicial ha terminado aquí
      }
    );

    // 3. Nos desuscribimos cuando el componente se desmonta
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 4. Memoizamos el valor para evitar re-renderizados innecesarios en los componentes hijos
  const value = useMemo(() => ({
    user,
    loading,
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
  }), [user, loading]);

  // 5. Devolvemos el Provider con el valor
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};