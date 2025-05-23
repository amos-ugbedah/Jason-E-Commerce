import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const UserProtectedRoute = () => {
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // 1. Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          toast.error('Please log in first');
          navigate('/auth?type=login', { replace: true });
          return;
        }

        // 2. Verify user role from jason_profiles
        const { data: profile, error: profileError } = await supabase
          .from('jason_profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (profileError || !profile) {
          toast.error('User profile not found');
          navigate('/auth?type=login', { replace: true });
          return;
        }

        // 3. Redirect sellers away from user routes
        if (profile.role === 'seller') {
          navigate('/seller/dashboard', { replace: true });
          return;
        }

        setStatus('authorized');
      } catch (error) {
        console.error('User verification error:', error);
        toast.error('An error occurred during verification');
        navigate('/auth?type=login', { replace: true });
      }
    };

    verifyUser();
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

export default UserProtectedRoute;