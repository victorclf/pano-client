import { ArrowDownward, ArrowUpward } from "@mui/icons-material"
import { Card, CardActions, CardContent, IconButton, Skeleton, Typography } from "@mui/material"
import { CommentData } from "./postSlice"
import { CommentActions } from "./CommentActions"

export const Comment = ({ comment }: { comment: CommentData }) => {
    return (
        <>
            <Card sx={{ m: 1, mt: 2 }}>
                <CardContent sx={{ pb: 0 }}>
                    <Typography variant="subtitle2" color="text.primary">
                        {comment.author.username}
                    </Typography>
                    <Typography paddingLeft={1} paddingTop={0.5} variant="body2" color="text.primary">
                        {comment.body}
                    </Typography>
                </CardContent>
                <CommentActions comment={comment} />
            </Card>

            {comment.replies?.map((reply) => (
                <Card key={reply.id} sx={{ m: 1, mt: 0, ml: 6 }}>
                    <CardContent sx={{ pb: 0 }}>
                        <Typography variant="subtitle2" color="text.primary">
                            {reply.author.username}
                        </Typography>
                        <Typography paddingLeft={1} paddingTop={0.5} variant="body2" color="text.primary">
                            {reply.body}
                        </Typography>
                    </CardContent>
                    <CommentActions comment={reply} />
                </Card>
            ))}
        </>
    )
}

export const CommentSkeleton = () => {
    return (
        <Skeleton>
            <Typography variant="body1" color="text.primary">
                {"haha djah dha dhaksd hahd haskjd hakhd khbh jkbhdkjfs hkjhsdg jkhdfjk gj gjdsfg jkhsglh skjlfghjk hsgj hsg jksfgjk hsfjgh skhgkl sfjghs haha  djah dha dhaksd hahd haskjd hakhd khbh jkbhdkjfs hkjhsdg jkhdfjk gj gjdsfg jkhsglh"}
            </Typography>
        </Skeleton>
    )
}