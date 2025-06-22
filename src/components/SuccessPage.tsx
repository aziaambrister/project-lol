import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Coins, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface SuccessPageProps {
  onContinue: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onContinue }) => {
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        // Get the session ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        if (!sessionId) {
          setError('No session ID found');
          setLoading(false);
          return;
        }

        // Fetch order details from Supabase
        const { data, error: fetchError } = await supabase
          .from('stripe_user_orders')
          .select('*')
          .eq('checkout_session_id', sessionId)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching order:', fetchError);
          setError('Failed to fetch order details');
        } else if (data) {
          setOrderDetails(data);
        } else {
          setError('Order not found');
        }
      } catch (err: any) {
        console.error('Error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading your purchase details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors"
          >
            Continue to Game
          </button>
        </div>
      </div>
    );
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="relative inline-block">
            <CheckCircle size={120} className="text-green-400 animate-pulse" />
            <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Payment Successful!
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          Thank you for your purchase! Your items have been added to your account.
        </p>

        {/* Order Details */}
        {orderDetails && (
          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
              <Coins className="text-yellow-400 mr-2" />
              Order Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Order ID</div>
                <div className="font-mono text-sm">{orderDetails.order_id}</div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Amount Paid</div>
                <div className="text-green-400 font-bold text-lg">
                  {formatAmount(orderDetails.amount_total, orderDetails.currency)}
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Payment Status</div>
                <div className="text-green-400 font-bold capitalize">
                  {orderDetails.payment_status}
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Order Date</div>
                <div className="font-medium">
                  {new Date(orderDetails.order_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/50 mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center justify-center">
            <Crown className="text-yellow-400 mr-2" />
            What's Next?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center bg-black/30 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🎮</div>
                <div>Continue your adventure in Fighter's Realm</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center bg-black/30 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <div>Your coins have been added to your account</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center bg-black/30 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🛒</div>
                <div>Visit the shop to spend your new coins</div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="group px-12 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <span className="flex items-center justify-center">
            Continue to Game
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
          </span>
        </button>

        {/* Support Info */}
        <div className="mt-8 text-sm text-gray-400">
          <p>Need help? Contact our support team at support@fightersrealm.com</p>
          <p className="mt-2">Your purchase is protected by our 30-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;