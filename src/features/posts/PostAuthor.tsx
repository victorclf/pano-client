import { Skeleton, Typography } from "@mui/material"

export const PostAuthor = ({ username }: {username: string}) => {
    return (
        <Typography variant="caption" color="text.secondary">
            Posted by {username}
        </Typography>
    )
}

export const PostAuthorSkeleton = () => {
    return (
        <Skeleton>
            <PostAuthor username={"username"} />
        </Skeleton>
    )
}