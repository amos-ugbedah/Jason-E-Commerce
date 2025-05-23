import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const SellerAuthWrapper = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    // Refresh session on route change
    supabase.auth.getSession();
  }, [location.pathname]);

  if (!userInfo) {
    return <Navigate to="/seller/login" state={{ from: location.pathname }} replace />;
  }

  if (userInfo.role !== 'seller') {
    return <Navigate to="/sell-with-us" replace />;
  }

  return <Outlet />;
};

export default SellerAuthWrapper;