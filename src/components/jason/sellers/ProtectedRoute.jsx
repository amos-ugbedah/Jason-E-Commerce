import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (loading) return;

    const verifyAccess = async () => {
      try {
        // 1. Check if user is authenticated
        if (!user) {
          navigate('/auth', { replace: true });
          return;
        }

        // 2. Get user role from database (not metadata)
        const { data: userData, error } = await supabase
          .from('jason_users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error || !userData) {
          console.error('Error fetching user role:', error);
          navigate('/unauthorized', { replace: true });
          return;
        }

        // 3. Check if user has required role
        if (allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
          navigate('/unauthorized', { replace: true });
          return;
        }

        setVerifying(false);
      } catch (err) {
        console.error('Verification error:', err);
        navigate('/auth', { replace: true });
      }
    };

    verifyAccess();
  }, [user, loading, navigate, allowedRoles]);

  if (loading || verifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;