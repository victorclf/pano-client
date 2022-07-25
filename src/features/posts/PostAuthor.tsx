import { Skeleton, Typography } from "@mui/material"
import { formatDistanceToNowStrict } from "date-fns"
import { Link } from "react-router-dom"
import { ShallowUser } from "../users/userSlice"

export const PostAuthor = ({ author, date }: {author: ShallowUser, date: string}) => {
    return (
        <Link className="linkButton" to={`/users/${author.id}`}>
            <Typography variant="caption" color="text.secondary">
                Posted by {author.username} &nbsp;{"\u2022"}&nbsp; {formatDistanceToNowStrict(new Date(date), { addSuffix: true })}
            </Typography>
        </Link>
    )
}

export const PostAuthorSkeleton = () => {
    return (
        <Skeleton>
            <PostAuthor author={{id:'0', username: "username"}} date={new Date().toISOString()} />
        </Skeleton>
    )
}