import { Navigate, Route, Routes } from 'react-router-dom';
import { PrivateOutlet } from '../auth/PrivateOutlet';
import { CreatePostView } from './CreatePostView';
import { PostView } from './PostView';


function PostsView() {
    return (
        <Routes>
            <Route path="new" element={<PrivateOutlet />}>
                <Route index element={<CreatePostView />} />
            </Route>
            <Route path=":postId" element={<PostView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default PostsView;
