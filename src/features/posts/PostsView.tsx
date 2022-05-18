import { Navigate, Route, Routes } from 'react-router-dom';
import { CreatePost } from './CreatePost';
import { Post } from './Post';


function PostsView() {
  return (
    <Routes>
      <Route path="new" element={<CreatePost />} />
      <Route path=":postId" element={<Post />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default PostsView;
