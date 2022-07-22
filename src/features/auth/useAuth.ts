import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './authSlice';
import { useNavigateToLogin } from './useNavigateToLogin';

export const useAuth = () => {
    const user = useSelector(selectCurrentUser);
    const navigateToLogin = useNavigateToLogin();

    const protectFunction = useCallback(
        (f: Function) => {
            return (...args: any[]) => {
                if (!user) {
                    navigateToLogin();
                    return;
                }
                const result = f.apply(this, args);
                return result;
            }
        },
        [user, navigateToLogin]
    );

    return useMemo(() => ({
        user,
        loggedIn: Boolean(user),
        protectFunction
    }), [user, protectFunction]);
};
