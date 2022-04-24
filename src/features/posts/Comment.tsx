import { ArrowDownward, ArrowUpward } from "@mui/icons-material"
import { Card, CardActions, CardContent, IconButton, Typography } from "@mui/material"
import { CommentData } from "./postSlice"

export const Comment = ({ comment }: { comment: CommentData }) => {
    return (
        <>
            <Card key={comment.id} sx={{ m: 1, mt: 2 }}>
                <CardContent sx={{ pb: 0 }}>
                    <Typography variant="subtitle2" color="text.primary">
                        {comment.author}
                    </Typography>
                    <Typography paddingLeft={1} paddingTop={0.5} variant="body2" color="text.primary">
                        {comment.body}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ pt: 0 }}>
                    <IconButton aria-label="upvote">
                        <ArrowUpward />
                    </IconButton>
                    <Typography variant="body2" color="text.primary" sx={{ textAlign: 'center', width: 32 }}>
                        {comment.score}
                    </Typography>
                    <IconButton aria-label="downvote">
                        <ArrowDownward />
                    </IconButton>
                </CardActions>
            </Card>

            {comment.replies?.map((reply) => (
                <Card key={reply.id} sx={{ m: 1, mt: 0, ml: 6 }}>
                    <CardContent sx={{ pb: 0 }}>
                        <Typography variant="subtitle2" color="text.primary">
                            {reply.author}
                        </Typography>
                        <Typography paddingLeft={1} paddingTop={0.5} variant="body2" color="text.primary">
                            {reply.body}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing sx={{ pt: 0 }}>
                        <IconButton aria-label="upvote">
                            <ArrowUpward />
                        </IconButton>
                        <Typography variant="body2" color="text.primary" sx={{ textAlign: 'center', width: 32 }}>
                            {reply.score}
                        </Typography>
                        <IconButton aria-label="downvote">
                            <ArrowDownward />
                        </IconButton>
                    </CardActions>
                </Card>
            ))}
        </>
    )
}

