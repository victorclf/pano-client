import { ReactNode } from 'react';
import NavigateToLogin from './NavigateToLogin';
import { useAuth } from './useAuth';

export function PrivateComponent({children}: {children: ReactNode}) {
    const { loggedIn } = useAuth();

    return loggedIn 
        ? (
            <>
                {children}
            </>
        )
        : <NavigateToLogin />;
}
