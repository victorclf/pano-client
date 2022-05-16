import { Card, Skeleton, Typography } from "@mui/material"
import { CommentActions } from "./CommentActions"
import { CommentContent } from "./CommentContent"
import { CommentData } from "./postSlice"

export const Comment = ({ comment }: { comment: CommentData }) => {
    return (
        <>
            <Card sx={{ m: 1, mt: 2 }}>
                <CommentContent comment={comment} />
                <CommentActions comment={comment} />
            </Card>

            {comment.replies?.map((reply) => (
                <Card key={reply.id} sx={{ m: 1, mt: 0, ml: 6 }}>
                    <CommentContent comment={reply} />
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