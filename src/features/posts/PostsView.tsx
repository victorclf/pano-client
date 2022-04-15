import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Post } from './Post';


function PostsView() {
  return (
    <Routes>
      <Route path=":id" element={<Post />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default PostsView;
