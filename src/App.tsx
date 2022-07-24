import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import styles from './App.module.css';
import { MyAppBar } from './features/gui/MyAppBar';
import HomeView from './features/HomeView';
import NotFoundView from './features/NotFoundView';
import PostsRoutes from './features/posts/PostsRoutes';
import LoginView from './features/auth/LoginView';
import { InboxView } from './features/users/InboxView';
import { AboutView } from './features/AboutView';


function App() {
  return (
    <>
      <CssBaseline />
      <div className={styles.App}>
          <Routes>
            <Route path="/" element={<MyAppBar />}>
              <Route path="posts/*" element={<PostsRoutes />} />
              <Route path="login" element={<LoginView />} />
              <Route path="messages" element={<InboxView />} />
              <Route path="about" element={<AboutView />} />
              <Route index element={<HomeView />} />
              <Route path="*" element={<NotFoundView />} />
            </Route>
          </Routes>
      </div>
    </>
  );
}

export default App;
