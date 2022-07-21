import { ReactNode } from 'react';
import { useAuth } from './useAuth';

export function PrivateComponent({children}: {children: ReactNode}) {
    const { loggedIn } = useAuth();

    return loggedIn 
        ? (
            <>
                {children}
            </>
        )
        : null;
}
