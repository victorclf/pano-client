import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function LinkToLogin({ children }: { children: ReactNode }) {
    const location = useLocation();

    return (
        <Link to="/login" state={{ from: location }}>
            {children}
        </Link>
    );
}

