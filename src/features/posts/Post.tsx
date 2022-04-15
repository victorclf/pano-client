import { ArrowDownward, ArrowUpward } from "@mui/icons-material"
import { Card, CardActions, CardContent, Container, IconButton, Paper, Typography } from "@mui/material"
import { useLocation, useParams } from "react-router-dom"
import { Comment } from "./Comment"

const post = {
    id: 1,
    title: 'The Forgotten Tower',
    body: `And so it came to pass that the Countess, who once bathed in the rejuvenating blood of a hundred virgins, was buried alive... 
           And her castle in which so many cruel deeds took place fell rapidly into ruin. Rising over the buried dungeons in that god-forsaken wilderness,
           a solitary tower, like some monument to Evil, is all that remains.
           
           The Countess' fortune was believed to be divided among the clergy, although some say that more remains unfound, 
           still buried alongside the rotting skulls that bear mute witness to the inhumanity of the human creature.`,
    user: 'anon2',
    score: 6,
}

const comments = [
    {
        id: 1,
        user: 'warrior666',
        body: 'Your death will be avenged!',
        score: 461,
        replies: [
            {
                id: 2,
                user: 'anon7',
                body: '@warrior666 The sanctity of this place has been fouled.',
                score: 6,
            },
            {
                id: 3,
                user: 'anon8',
                body: '@anon7 Hello, my friend. Stay awhile and listen.',
                score: 2,
            },
        ]
    },
    {
        id: 4,
        user: 'anon4',
        body: 'you missed the ellipsis at the beginning of the quote',
        score: 3,
    },
    {
        id: 5,
        user: 'anon0',
        body: 'good times',
        score: 1,
    },
    {
        id: 6,
        user: 'anon2',
        body: 'Worst quest in act 1!',
        score: -99,
    },
]

export const Post = () => {
    const params = useParams();

    // XXX
    console.log("postId parameter:", params.id);

    return (
        <Container maxWidth="md">
            <Card sx={{ mt: 2 }}>
                <CardContent>
                    <Typography variant="caption" color="text.secondary">
                        Posted by {post.user}
                    </Typography>
                    <Typography paddingTop={0} variant="h6" color="text.primary">
                        {post.title}
                    </Typography>
                    <Typography paddingTop={2} variant="body1" color="text.primary">
                        {post.body}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ pt: 0 }}>
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
            <Paper sx={{ mt: 3, mb: 3, pb: 1 }}>
                <Typography padding={2} variant="h6" color="text.primary">
                    {comments.length} comments
                </Typography>

                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
            </Paper>
        </Container>
    )
}

