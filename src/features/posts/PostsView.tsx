import { Navigate, Route, Routes } from 'react-router-dom';
import { Post } from './Post';


function PostsView() {
  return (
    <Routes>
      <Route path=":postId" element={<Post />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default PostsView;
