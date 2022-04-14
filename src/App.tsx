import { Menu } from '@mui/icons-material';
import { AppBar, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import './App.css';
import { Post } from './features/posts/Post';


function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <div className="App">
        {/* <header className="App-header"> */}
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <Counter /> */}
        {/* <p>Edit <code>src/App.tsx</code> and save to reload.</p> */}
        {/* </header> */}
        {/* <Container sx={{ bgcolor: '#cfe8fc' }} maxWidth="md"> */}
          {/* <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} /> */}
          {/* <Box>Post 0</Box> */}
          {/* <Box>Post 1</Box> */}
          {/* <Box>Post 2</Box> */}
        {/* </Container> */}
        <React.Fragment>
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
        </React.Fragment>

        <Post></Post>
        {/* <PostsList /> */}
        {/* <Blog></Blog> */}
      </div>
    </React.Fragment>
  );
}

export default App;
