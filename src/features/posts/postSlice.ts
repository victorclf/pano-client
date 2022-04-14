export interface CommentReplyData {
    id: number;
    user: string;
    body: string;
    score: number;
}

export interface CommentData {
    id: number;
    user: string;
    body: string;
    score: number;
    replies?: Array<CommentReplyData>;
}
