import { ArrowDownward, ArrowUpward } from "@mui/icons-material"
import { CardActions, IconButton, Skeleton, Typography } from "@mui/material"

export const PostActions = ({score}: {score: number}) => {
    return (
        <CardActions disableSpacing sx={{ pt: 0 }}>
            <IconButton aria-label="upvote">
                <ArrowUpward />
            </IconButton>
            <Typography variant="body2" color="text.primary" sx={{ textAlign: 'center', width: 32 }}>
                {score}
            </Typography>
            <IconButton aria-label="downvote">
                <ArrowDownward />
            </IconButton>
        </CardActions>
    )
}

export const PostActionsSkeleton = () => {
    return (
        <Skeleton sx={{ ml: 2}}>
            <PostActions score={999} />
        </Skeleton>
    )
}