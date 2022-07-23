import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useNavigateToLogin } from "../auth/useNavigateToLogin";

export const useHandleDefaultAPIError = () => {
    const navigateToLogin = useNavigateToLogin();
    
    return (err: FetchBaseQueryError): boolean => {
        if (err?.status === 401) {
            navigateToLogin();
            return true;
        }
        return false;
    };
};
