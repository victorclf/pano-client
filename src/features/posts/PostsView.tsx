import { Navigate, Route, Routes } from 'react-router-dom';
import { CreatePost } from './CreatePost';
import { PostView } from './PostView';


function PostsView() {
  return (
    <Routes>
      <Route path="new" element={<CreatePost />} />
      <Route path=":postId" element={<PostView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default PostsView;
