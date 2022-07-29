import { faker } from '@faker-js/faker';
import { factory, manyOf, nullable, oneOf, primaryKey } from '@mswjs/data';
import { compareDesc, parseISO } from 'date-fns';
import { createResponseComposition, rest } from 'msw';
import { generateMockData } from './mockData';

const FAKE_DELAY = process.env.NODE_ENV !== 'test'
    ? 500
    : 0;
// mswjs doesnt support finding objects which have a property equal to null
export const NULL_WORKAROUND = "NULL_WORKAROUND";

export const db = factory({
    user: {
        id: primaryKey(faker.datatype.uuid),
        username: String,
        password: String,
        date: String,
        country: String,
        score: Number,
        // firstName: String,
        // lastName: String,
        // name: String,
        // posts: manyOf('post'),
    },
    post: {
        id: primaryKey(faker.datatype.uuid),
        title: String,
        body: String,
        author: oneOf('user'),
        date: String,
        score: Number,
        upvoted: Boolean,
        downvoted: Boolean,
        // reactions: oneOf('reaction'),
        // comments: manyOf('comment'),
    },
    comment: {
        id: primaryKey(faker.datatype.uuid),
        body: String,
        // post: oneOf('post'),
        postId: faker.datatype.uuid,
        author: {
            id: Number,
            username: String,
        },
        replies: manyOf('comment'),
        parentCommentId: nullable(faker.datatype.uuid),
        date: String,
        score: Number,
        upvoted: Boolean,
        downvoted: Boolean,
    },
    session: {
        id: primaryKey(faker.datatype.uuid),
        userId: faker.datatype.uuid,
        token: faker.datatype.uuid
    }
    // },
    // reaction: {
    //   id: primaryKey(faker.datatype.uuid),
    //   thumbsUp: Number,
    //   hooray: Number,
    //   heart: Number,
    //   rocket: Number,
    //   eyes: Number,
    //   post: oneOf('post'),
    // },
})


// *****************
// *** MOCK DATA ***
// *****************
generateMockData();

export const testAuthenticatedUser = db.user.create({
    username: 'jcd',
    password: 'bionicman',
    score: 127,
    date: faker.date.past().toISOString(),
    country: 'United States',
});
export const testAuthenticatedUserSession = db.session.create({
    userId: testAuthenticatedUser.id,
    token: '123456'
});



// ****************
// *** REST API ***
// ****************
const getSessionFromRequest = (req) => {
    const headers = req.headers.all();
    const token = headers.authorization?.match(/Bearer (.*)/)?.[1];
    if (!token) {
        return null;
    }
    return db.session.findFirst({
        where: {
            token: { equals: token },
        },
    });
};

const getUserFromRequest = (req) => {
    const session = getSessionFromRequest(req);
    const user = db.user.findFirst({
        where: {
            id: { equals: session.userId },
        },
    });
    return user ?? null;
};

const hasValidToken = (req) => {
    return Boolean(getSessionFromRequest(req));
};

export const resWithDelay = createResponseComposition({
    delay: FAKE_DELAY
});

export const handlers = [
    rest.get('/posts', function (req, res, ctx) {
        const cursor = req.url.searchParams.get('cursor');
        const size = Math.min(req.url.searchParams.get('size') ?? 20, 20);
        const posts = db.post.findMany({
            take: size,
            cursor,
            orderBy: {
                date: 'desc',
            },
        });
        return resWithDelay(ctx.json(posts));
    }),
    rest.get('/posts/:postId', function (req, res, ctx) {
        const post = db.post.findFirst({
            where: { id: { equals: req.params.postId } },
        });
        if (!post) {
            return resWithDelay(ctx.status(404));
        }
        return resWithDelay(ctx.json(post));
    }),
    rest.post('/posts', function (req, res, ctx) {
        const user = getUserFromRequest(req);
        if (!user) {
            return resWithDelay(ctx.status(401), ctx.json({ message: 'You must sign in before accessing this.' }));
        }

        const postData = req.body;
        postData.date = new Date().toISOString();
        postData.author = user;
        const post = db.post.create(postData);

        return resWithDelay(ctx.status(201), ctx.json(post));
    }),
    rest.post('/posts/:postId/upvote', function (req, res, ctx) {
        if (!hasValidToken(req)) {
            return resWithDelay(ctx.status(401), ctx.json({ message: 'You must sign in before accessing this.' }));
        }

        const postId = req.params.postId;
        const post = db.post.findFirst({
            where: {
                id: {
                    equals: postId
                }
            },
        });

        if (!post.upvoted) {
            const newScore = post.downvoted ? post.score + 2 : post.score + 1;

            db.post.update({
                where: {
                    id: {
                        equals: postId
                    }
                },
                data: {
                    upvoted: true,
                    downvoted: false,
                    score: newScore
                },
            });
            return resWithDelay(ctx.status(200));
        }

        return resWithDelay(ctx.status(400));
    }),

    rest.post('/posts/:postId/nonvote', function (req, res, ctx) {
        if (!hasValidToken(req)) {
            return resWithDelay(ctx.status(401), ctx.json({ message: 'You must sign in before accessing this.' }));
        }

        const postId = req.params.postId;
        const post = db.post.findFirst({
            where: {
                id: {
                    equals: postId
                }
            },
        });

        if (post.upvoted) {
            db.post.update({
                where: {
                    id: {
                        equals: postId
                    }
                },
                data: {
                    upvoted: false,
                    score: post.score - 1
                },
            });
            return resWithDelay(ctx.status(200));
        } else if (post.downvoted) {
            db.post.update({
                where: {
                    id: {
                        equals: postId
                    }
                },
                data: {
                    downvoted: false,
                    score: post.score + 1
                },
            });
            return resWithDelay(ctx.status(200));
        }

        return resWithDelay(ctx.status(400)); // ctx.json(updatedPost));
    }),

    rest.post('/posts/:postId/downvote', function (req, res, ctx) {
        if (!hasValidToken(req)) {
            return resWithDelay(ctx.status(401), ctx.json({ message: 'You must sign in before accessing this.' }));
        }

        const postId = req.params.postId;
        const post = db.post.findFirst({
            where: {
                id: {
                    equals: postId
                }
            },
        });

        // const updatedPost = 
        if (!post.downvoted) {
            const newScore = post.upvoted ? post.score - 2 : post.score - 1;

            db.post.update({
                where: {
                    id: {
                        equals: postId
                    }
                },
                data: {
                    upvoted: false,
                    downvoted: true,
                    score: newScore
                },
            });
            return resWithDelay(ctx.status(200));
        }

        return resWithDelay(ctx.status(400));
    }),

    rest.get('/posts/:postId/comments', function (req, res, ctx) {
        let comments = db.comment.findMany({
            where: {
                postId: {
                    equals: req.params.postId
                },
                parentCommentId: {
                    equals: NULL_WORKAROUND
                },
            },
            orderBy: {
                score: 'desc',
            },
        });

        // comments.sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));
        for (const c of comments) {
            c.replies.sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));
        }

        return resWithDelay(ctx.json(comments));
    }),
    rest.post('/posts/:postId/comments', function (req, res, ctx) {
        const author = getUserFromRequest(req);
        if (!author) {
            return resWithDelay(ctx.status(401), ctx.json({ message: 'You must sign in before accessing this.' }));
        }

        const requestData = req.body;

        const commentData = {
            body: requestData.body,
            postId: req.params.postId,
            author,
            replies: [],
            parentCommentId: !requestData.parentCommentId ? NULL_WORKAROUND : requestData.parentCommentId,
            date: new Date().toISOString(),
            score: 0,
            upvoted: false,
            downvoted: false,
        };
        const comment = db.comment.create(commentData);

        // If reply, add reply to parent comment.
        if (requestData.parentCommentId) {
            db.comment.update({
                where: { id: { equals: requestData.parentCommentId } },
                data: {
                    replies: (prevReplies, parentComment) => [...prevReplies, comment],
                },
            });
        }

        return resWithDelay(ctx.status(201), ctx.json(comment));
    }),
    rest.patch('/posts/:postId/comments/:commentId', function (req, res, ctx) {
        const author = getUserFromRequest(req);
        if (!author) {
            return resWithDelay(ctx.status(401), ctx.json({ message: 'You must sign in before accessing this.' }));
        }

        const comment = db.comment.update({
            where: { id: { equals: req.params.commentId } },
            data: {
                body: req.body.body,
            },
        });

        return resWithDelay(ctx.status(200), ctx.json(comment));
    }),
    rest.post('/posts/:postId/comments/:commentId/upvote', function (req, res, ctx) {
        if (!hasValidToken(req)) {
            return resWithDelay(ctx.status(401), ctx.json({ message: 'You must sign in before accessing this.' }));
        }

        const commentId = req.params.commentId;
        const comment = db.comment.findFirst({
            where: {
                id: {
                    equals: commentId
                }
            },
        });

        if (!comment.upvoted) {
            const newScore = comment.downvoted ? comment.score + 2 : comment.score + 1;

            db.comment.update({
                where: {
                    id: {
                        equals: commentId
                    }
                },
                data: {
                    upvoted: true,
                    downvoted: false,
                    score: newScore
                },
            });
            return resWithDelay(ctx.status(200))
        }

        return resWithDelay(ctx.status(400));
    }),

    rest.post('/posts/:postId/comments/:commentId/nonvote', function (req, res, ctx) {
        if (!hasValidToken(req)) {
            return resWithDelay(ctx.status(401), ctx.json({ message: 'You must sign in before accessing this.' }));
        }

        const commentId = req.params.commentId;
        const comment = db.comment.findFirst({
            where: {
                id: {
                    equals: commentId
                }
            },
        });

        if (comment.upvoted) {
            db.comment.update({
                where: {
                    id: {
                        equals: commentId
                    }
                },
                data: {
                    upvoted: false,
                    score: comment.score - 1
                },
            });
            return resWithDelay(ctx.status(200));
        } else if (comment.downvoted) {
            db.comment.update({
                where: {
                    id: {
                        equals: commentId
                    }
                },
                data: {
                    downvoted: false,
                    score: comment.score + 1
                },
            });
            return resWithDelay(ctx.status(200));
        }

        return resWithDelay(ctx.status(400));
    }),

    rest.post('/posts/:postId/comments/:commentId/downvote', function (req, res, ctx) {
        if (!hasValidToken(req)) {
            return resWithDelay(ctx.status(401), ctx.json({ message: 'You must sign in before accessing this.' }));
        }

        const commentId = req.params.commentId;
        const comment = db.comment.findFirst({
            where: {
                id: {
                    equals: commentId
                }
            },
        });

        if (!comment.downvoted) {
            const newScore = comment.upvoted ? comment.score - 2 : comment.score - 1;

            db.comment.update({
                where: {
                    id: {
                        equals: commentId
                    }
                },
                data: {
                    upvoted: false,
                    downvoted: true,
                    score: newScore
                },
            });
            return resWithDelay(ctx.status(200));
        }

        return resWithDelay(ctx.status(400));
    }),

    rest.get('/users/:userId', function (req, res, ctx) {
        const user = db.user.findFirst({
            where: { id: { equals: req.params.userId } },
        });
        if (!user) {
            return resWithDelay(ctx.status(404));
        }
        return resWithDelay(ctx.json(user));
    }),

    rest.post('/auth/login', (req, res, ctx) => {
        const user = db.user.findFirst({
            where: {
                username: { equals: req.body.username },
                password: { equals: req.body.password },
            },
        });
        if (!user) {
            return resWithDelay(ctx.status(401), ctx.json({ message: `Invalid username/password` }));
        }

        const token = faker.datatype.uuid();
        db.session.create({ userId: user.id, token });

        return resWithDelay(ctx.json({ user, token }));
    }),

    rest.post('/auth/logout', (req, res, ctx) => {
        const session = getSessionFromRequest(req);
        if (!session) {
            return resWithDelay(ctx.status(401), ctx.json({ message: 'You must sign in before accessing this.' }));
        }

        db.session.delete({ where: { id: { equals: session.id } } });

        return resWithDelay(ctx.status(204));
    }),
];
