import { CardContent, Typography } from "@mui/material"
import { formatDistanceToNowStrict } from "date-fns";
import { Link } from "react-router-dom";
import { CommentData } from "./commentSlice";

export const CommentContent = ({ comment }: { comment: CommentData }) => {
    return (
        <CardContent sx={{ pb: 0 }}>
            <Link className="linkButton" to={`/users/${comment.author.id}`}>
                <Typography variant="subtitle2" color="text.primary" component="span" >
                    {comment.author.username}
                </Typography>
            </Link>
            <Typography variant="caption" color="text.secondary" component="span" sx={{ ml: 1 }}>
                {formatDistanceToNowStrict(new Date(comment.date), { addSuffix: true })}
            </Typography>
            <Typography paddingLeft={0} paddingTop={0.5} variant="body2" color="text.primary">
                {comment.body}
            </Typography>
        </CardContent>
    );
}