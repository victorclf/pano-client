import { Navigate, useLocation } from 'react-router-dom';

export default function NavigateToLogin() {
    const location = useLocation();

    return (
        <Navigate to="/login" state={{ from: location }} />
    );
}

