export interface Votable {
    score: number;
    upvoted: boolean;
    downvoted: boolean;
}

export const updateUpvote = (e?: Votable) => {
    if (e) {
        e.upvoted = true;
        e.score += 1;
        if (e.downvoted) {
            e.downvoted = false;
            e.score += 1;
        }
    }
};

export const updateNonvote = (e?: Votable) => {
    if (e) {
        if (e.upvoted) {
            e.upvoted = false;
            e.score -= 1;
        } else if (e.downvoted) {
            e.downvoted = false;
            e.score += 1;
        }
    }
};

export const updateDownvote = (e?: Votable) => {
    if (e) {
        e.downvoted = true;
        e.score -= 1;
        if (e.upvoted) {
            e.upvoted = false;
            e.score -= 1;
        }
    }
};
