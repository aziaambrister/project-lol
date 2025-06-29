import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

interface User {
  id: string;
  email: string;
  username?: string;
  emailConfirmed?: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthError {
  message: string;
  code?: string;
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
          username: session.user.user_metadata?.username,
          emailConfirmed: session.user.email_confirmed_at ? true : false
        } : null,
        loading: false
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setAuthState({
          user: session?.user ? {
            id: session.user.id,
            email: session.user.email || '',
            username: session.user.user_metadata?.username,
            emailConfirmed: session.user.email_confirmed_at ? true : false
          } : null,
          loading: false
        });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return null;
  };

  const validateUsername = (username: string): string | null => {
    if (!username) return 'Display name is required';
    if (username.length < 2) return 'Display name must be at least 2 characters long';
    if (username.length > 30) return 'Display name must be less than 30 characters';
    if (!/^[a-zA-Z0-9_\s]+$/.test(username)) return 'Display name can only contain letters, numbers, underscores, and spaces';
    return null;
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      // Validate inputs
      const emailError = validateEmail(email);
      if (emailError) {
        return { data: null, error: { message: emailError, code: 'validation_error' } };
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        return { data: null, error: { message: passwordError, code: 'validation_error' } };
      }

      const usernameError = validateUsername(username);
      if (usernameError) {
        return { data: null, error: { message: usernameError, code: 'validation_error' } };
      }

      console.log('Attempting to sign up user:', email);

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            username: username.trim()
          }
        }
      });
      
      if (error) {
        console.error('Signup error from Supabase:', error);
        
        // Handle specific Supabase errors
        let errorMessage = error.message;
        let errorCode = error.message;

        if (error.message?.includes('already_registered') || error.message?.includes('already registered')) {
          errorMessage = 'An account with this email already exists. Please try signing in instead.';
          errorCode = 'user_already_exists';
        } else if (error.message?.includes('weak_password') || error.message?.includes('Password should be')) {
          errorMessage = 'Password is too weak. Please use at least 6 characters with uppercase, lowercase, and numbers.';
          errorCode = 'weak_password';
        } else if (error.message?.includes('invalid_email')) {
          errorMessage = 'Please enter a valid email address.';
          errorCode = 'invalid_email';
        } else if (error.message?.includes('signup_disabled')) {
          errorMessage = 'New user registration is currently disabled. Please contact support.';
          errorCode = 'signup_disabled';
        } else if (error.message?.includes('rate_limit')) {
          errorMessage = 'Too many signup attempts. Please wait a moment before trying again.';
          errorCode = 'rate_limit';
        }

        return { data: null, error: { message: errorMessage, code: errorCode } };
      }
      
      if (data.user) {
        console.log('User signup successful:', data.user.email);
        
        // Check if email confirmation is required
        if (!data.session && data.user && !data.user.email_confirmed_at) {
          return { 
            data, 
            error: null,
            requiresConfirmation: true,
            message: 'Please check your email and click the confirmation link to complete your account setup.'
          };
        }
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      return { 
        data: null, 
        error: { 
          message: error.message || 'An unexpected error occurred during signup. Please try again.',
          code: 'unexpected_error'
        } 
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Validate inputs
      const emailError = validateEmail(email);
      if (emailError) {
        return { data: null, error: { message: emailError, code: 'validation_error' } };
      }

      if (!password) {
        return { data: null, error: { message: 'Password is required', code: 'validation_error' } };
      }

      console.log('Attempting to sign in user:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });
      
      if (error) {
        console.error('Signin error from Supabase:', error);
        
        // Handle specific Supabase errors
        let errorMessage = error.message;
        let errorCode = error.message;

        if (error.message?.includes('email_not_confirmed') || error.message?.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
          errorCode = 'email_not_confirmed';
        } else if (error.message?.includes('invalid_credentials') || error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          errorCode = 'invalid_credentials';
        } else if (error.message?.includes('too_many_requests')) {
          errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
          errorCode = 'rate_limit';
        } else if (error.message?.includes('signup_disabled')) {
          errorMessage = 'User authentication is currently disabled. Please contact support.';
          errorCode = 'auth_disabled';
        }

        return { data: null, error: { message: errorMessage, code: errorCode } };
      }
      
      if (data.user) {
        console.log('User signin successful:', data.user.email);
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Unexpected signin error:', error);
      
      let errorMessage = 'An unexpected error occurred during signin. Please try again.';
      
      if (error?.message) {
        if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        }
      }
      
      return { 
        data: null, 
        error: { 
          message: errorMessage,
          code: 'unexpected_error'
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
          message: error.message || 'An unexpected error occurred during signout',
          code: 'signout_error'
        } 
      };
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.toLowerCase().trim()
      });

      if (error) {
        return { error: { message: error.message, code: 'resend_error' } };
      }

      return { error: null };
    } catch (error: any) {
      return { 
        error: { 
          message: 'Failed to resend confirmation email. Please try again.',
          code: 'resend_error'
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
    resendConfirmation,
    supabase // Export the supabase client
  };
}