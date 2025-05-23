import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SellerProtectedRoute = () => {
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  useEffect(() => {
    const verifySeller = async () => {
      try {
        // 1. Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          toast.error('Please log in as a seller');
          navigate('/seller/login', { replace: true });
          return;
        }

        // 2. Verify seller role from jason_profiles
        const { data: profile, error: profileError } = await supabase
          .from('jason_profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (profileError || !profile || profile.role !== 'seller') {
          toast.error('Seller account required');
          navigate('/unauthorized', { replace: true });
          return;
        }

        // 3. Check if seller profile exists
        const { error: sellerError } = await supabase
          .from('jason_sellers')
          .select('user_id')
          .eq('user_id', user.id)
          .single();

        if (sellerError) {
          toast.error('Complete your seller profile first');
          navigate('/seller/complete-profile', { replace: true });
          return;
        }

        setStatus('authorized');
      } catch (error) {
        console.error('Seller verification error:', error);
        toast.error('An error occurred during verification');
        navigate('/seller/login', { replace: true });
      }
    };

    verifySeller();
  }, [navigate]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return status === 'authorized' ? <Outlet /> : null;
};

export default SellerProtectedRoute;