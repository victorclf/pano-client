import { CssBaseline } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.css';
import HomeView from './features/HomeView';
import { MyAppBar } from './features/gui/MyAppBar';
import NotFoundView from './features/NotFoundView';
import PostsView from './features/posts/PostsView';


function App() {
  return (
    <>
      <CssBaseline />
      <div className={styles.App}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MyAppBar />}>
              <Route path="posts/*" element={<PostsView />} />
              <Route index element={<HomeView />} />
              <Route path="*" element={<NotFoundView />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
