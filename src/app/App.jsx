import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from '../routes/AppRoutes';
import { fetchMe } from '../features/auth/authSlice';

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  return <AppRoutes />;
}
