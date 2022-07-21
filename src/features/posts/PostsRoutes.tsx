import { Navigate, Route, Routes } from 'react-router-dom';
import { PrivateComponent } from '../auth/PrivateComponent';
import { CreatePostView } from './CreatePostView';
import { PostView } from './PostView';


function PostsRoutes() {
    return (
        <Routes>
            <Route path="new" element={<PrivateComponent><CreatePostView /></PrivateComponent>} />
            <Route path=":postId" element={<PostView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default PostsRoutes;
