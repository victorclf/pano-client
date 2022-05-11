import { Skeleton, Typography } from "@mui/material"

export const PostTitle = ({title}: {title: string}) => {
    return (
        <Typography paddingTop={0} variant="h6" color="text.primary">
            {title}
        </Typography>
    )
}

export const PostTitleSkeleton = () => {
    return (
        <Skeleton>
            <PostTitle title="Title Title Title Title" />
        </Skeleton>
    )
}