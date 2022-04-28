import { Menu } from '@mui/icons-material';
import { AppBar, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomeView from './features/HomeView';
import NotFoundView from './features/NotFoundView';
import PostsView from './features/posts/PostsView';


function App() {
  return (
    <>
      <CssBaseline />
      <div className="App">
        <>
          <AppBar position="sticky" sx={{ top: 0, left: 0 }}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <Menu />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Pano
              </Typography>
              {/* <Button color="inherit">Login</Button> */}
            </Toolbar>
          </AppBar>
        </>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="posts/*" element={<PostsView />} />
            <Route path="*" element={<NotFoundView />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
