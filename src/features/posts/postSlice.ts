export interface CommentReplyData {
    id: number;
    author: string;
    body: string;
    score: number;
}

export interface CommentData {
    id: number;
    author: string;
    body: string;
    score: number;
    replies?: Array<CommentReplyData>;
}

export interface PostData {
    id: number;
    title: string;
    body: string;
    author: string;
    score: number;
}