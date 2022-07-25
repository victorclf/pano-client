import { Navigate, Route, Routes } from 'react-router-dom';
import { UserView } from './UserView';


export const UsersRoutes = () => {
    return (
        <Routes>
            <Route path=":userId" element={<UserView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
