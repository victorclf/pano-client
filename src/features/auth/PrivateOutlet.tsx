import { Outlet } from 'react-router-dom';
import NavigateToLogin from '../auth/NavigateToLogin';
import { useAuth } from '../auth/useAuth';

export function PrivateOutlet() {
    const { loggedIn } = useAuth();

    return loggedIn ? (
        <Outlet />
    ) : (
        <NavigateToLogin />
    );
}
