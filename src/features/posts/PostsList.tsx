import { ArrowDownward, ArrowUpward } from "@mui/icons-material"
import { Card, CardActions, CardContent, Container, IconButton, Stack, Typography } from "@mui/material"

const posts = [
  {
    title: 'STICKY: new rules! plz read!',
    user: 'anon1',
    score: 0
  },
  {
    title: 'My first text post...',
    user: 'anon1',
    score: 6,
  },
  {
    title: 'Poll: who\'s that?',
    user: 'anon1',
    score: 455,
  },
  {
    title: '2022 is the END!',
    user: 'anon1',
    score: 23,
  },
  {
    title: 'My first text post...',
    user: 'anon1',
    score: 6,
  },
  {
    title: 'Poll: who\'s that?',
    user: 'anon1',
    score: 455,
  },
  {
    title: '2022 is the END!',
    user: 'anon1',
    score: 23,
  },
  {
    title: 'My first text post...',
    user: 'anon1',
    score: 6,
  },
  {
    title: 'Poll: who\'s that?',
    user: 'anon1',
    score: 455,
  },
  {
    title: '2022 is the END!',
    user: 'anon1',
    score: 23,
  }
]

export const PostsList = () => {
    return (
        <Container maxWidth="sm">
          <Stack spacing={1} sx={{pt: 1}}>
            {posts.map((post) => (
              // <Card key={post.title} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Card key={post.title} sx={{pt: 0.5}}>
                <CardContent>
                  <Typography variant="caption"  color="text.secondary">
                    Posted by {post.user}
                  </Typography>
                  <Typography paddingTop={0}  variant="h6" color="text.primary">
                    {post.title}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{pt: 0}}>
                  <IconButton aria-label="upvote">
                    <ArrowUpward />
                  </IconButton>
                  <Typography variant="body2" color="text.primary" sx={{ textAlign: 'center', width: 32 }}>
                    {post.score}
                  </Typography>
                  <IconButton aria-label="downvote">
                    <ArrowDownward />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Stack>
        </Container>
    )
}