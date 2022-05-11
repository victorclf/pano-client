import { Skeleton, Typography } from "@mui/material"

export const PostBody = ({ body }: { body: string }) => {
    return (
        <Typography paddingTop={2} variant="body1" color="text.primary">
            {body}
        </Typography>
    )
}

export const PostBodySkeleton = () => {
    return (
        <Skeleton>
            <PostBody body={"Iure exercitationem voluptas vero id occaecati fugit. Quia nesciunt non aut iusto. Inventore nobis tempore adipisci magni quis laborum. Voluptatem doloribus autem excepturi quo tempora vitae qui. Odit accusamus explicabo. Occaecati qui expedita qui id molestias sint.Iure exercitationem voluptas vero id occaecati fugit. Quia nesciunt non aut iusto. Inventore nobis tempore adipisci magni quis laborum. Voluptatem doloribus autem excepturi quo tempora vitae qui. Odit accusamus explicabo. Occaecati qui expedita qui id molestias sint."} />
        </Skeleton>
    )
}