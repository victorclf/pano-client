import { Skeleton, Typography } from "@mui/material"
import { formatDistanceToNowStrict } from "date-fns"

export const PostAuthor = ({ username, date }: {username: string, date: string}) => {
    return (
        <Typography variant="caption" color="text.secondary">
            Posted by {username} &nbsp;{"\u2022"}&nbsp; {formatDistanceToNowStrict(new Date(date), { addSuffix: true })}
        </Typography>
    )
}

export const PostAuthorSkeleton = () => {
    return (
        <Skeleton>
            <PostAuthor username={"username"} date={new Date().toISOString()} />
        </Skeleton>
    )
}