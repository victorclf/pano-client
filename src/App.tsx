import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import styles from './App.module.css';
import { MyAppBar } from './features/gui/MyAppBar';
import HomeView from './features/HomeView';
import NotFoundView from './features/NotFoundView';
import PostsView from './features/posts/PostsView';


function App() {
  return (
    <>
      <CssBaseline />
      <div className={styles.App}>
          <Routes>
            <Route path="/" element={<MyAppBar />}>
              <Route path="posts/*" element={<PostsView />} />
              <Route index element={<HomeView />} />
              <Route path="*" element={<NotFoundView />} />
            </Route>
          </Routes>
      </div>
    </>
  );
}

export default App;
