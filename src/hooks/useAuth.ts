import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface User {
  id: string;
  email: string;
  username?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ? {
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata?.username
        } : null,
        loading: false
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({
          user: session?.user ? {
            id: session.user.id,
            email: session.user.email || '',
            username: session.user.user_metadata?.username
          } : null,
          loading: false
        });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });
      
      // Log successful signup attempts for debugging
      if (!error && data.user) {
        console.log('User signup successful:', data.user.email);
      }
      
      return { data, error };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { 
        data: null, 
        error: { 
          message: error.message || 'An unexpected error occurred during signup' 
        } 
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // Log successful signin attempts for debugging
      if (!error && data.user) {
        console.log('User signin successful:', data.user.email);
      }
      
      return { data, error };
    } catch (error: any) {
      console.error('Signin error:', error);
      return { 
        data: null, 
        error: { 
          message: error.message || 'An unexpected error occurred during signin' 
        } 
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        console.log('User signed out successfully');
      }
      
      return { error };
    } catch (error: any) {
      console.error('Signout error:', error);
      return { 
        error: { 
          message: error.message || 'An unexpected error occurred during signout' 
        } 
      };
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    signUp,
    signIn,
    signOut,
    supabase // Export the supabase client
  };
}