import { useLocation, useNavigate } from 'react-router-dom';

export const useNavigateToLogin = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return {
        navigateToLogin: () => { 
            navigate("/login", { state: { from: location } });
        }
    };
};

