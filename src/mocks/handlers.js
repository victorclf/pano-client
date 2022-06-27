import { factory, oneOf, manyOf, primaryKey, nullable } from '@mswjs/data'
import { faker } from '@faker-js/faker';
import { rest } from 'msw';
import { compareDesc, parseISO } from 'date-fns';

// mswjs doesnt support finding objects which have a property equal to null
const NULL_WORKAROUND = "NULL_WORKAROUND";

// ******************
// *** DATA MODEL ***
// ******************
export const db = factory({
    user: {
        id: primaryKey(faker.datatype.uuid),
        username: String,
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

// *****************************
// *** SET FIXED RANDOM SEED ***
// *****************************
let useSeededRNG = true;
// let rng = seedrandom()
if (useSeededRNG) {
    let randomSeedString = localStorage.getItem('randomTimestampSeed');
    let seedDate;

    if (randomSeedString) {
        seedDate = new Date(randomSeedString);
    } else {
        seedDate = new Date();
        randomSeedString = seedDate.toISOString();
        localStorage.setItem('randomTimestampSeed', randomSeedString);
    }
    // rng = seedrandom(randomSeedString)
    // setRandom(rng)
    faker.seed(seedDate.getTime())
}


// **************************
// *** GENERATE MOCK DATA ***
// **************************
const NUM_USERS = 5
const POSTS_PER_USER = 5
const COMMENTS_PER_POST = 5
const MAX_REPLIES_PER_COMMENT = 5
const MAX_SCORE = 1000
const RECENT_DAYS = 7;

const createUserData = () => {
    // const firstName = faker.name.firstName()
    // const lastName = faker.name.lastName()

    return {
        // firstName,
        // lastName,
        // name: `${firstName} ${lastName}`,
        username: faker.internet.userName(),
    }
}

const createPostData = (author) => {
    return {
        title: faker.lorem.words(4),
        // date: faker.date.recent(RECENT_NOTIFICATIONS_DAYS).toISOString(),
        author,
        body: faker.lorem.paragraphs(),
        date: faker.date.recent(RECENT_DAYS).toISOString(),
        score: faker.datatype.number(MAX_SCORE),
        upvoted: false,
        downvoted: false,
        // reactions: db.reaction.create(),
    }
}

const createCommentData = (post, author, parentComment = NULL_WORKAROUND) => {
    return {
        body: faker.lorem.sentences(),
        postId: post.id,
        author,
        replies: [],
        parentCommentId: parentComment === NULL_WORKAROUND ? NULL_WORKAROUND : parentComment.id,
        date: faker.date.between(post.date, new Date()).toISOString(),
        score: faker.datatype.number(MAX_SCORE),
        upvoted: false,
        downvoted: false,
    }
}

// let author1 = createUserData()
// author1.username = 'deckard.cain'
// author1 = db.user.create(author1);
// let post1 = createPostData(author1);
// post1.title = 'The Forgotten Tower';
// post1.body = `And so it came to pass that the Countess, who once bathed in the rejuvenating blood of a hundred virgins, was buried alive... 
//          And her castle in which so many cruel deeds took place fell rapidly into ruin. Rising over the buried dungeons in that god-forsaken wilderness,
//          a solitary tower, like some monument to Evil, is all that remains.

//          The Countess' fortune was believed to be divided among the clergy, although some say that more remains unfound, 
//          still buried alongside the rotting skulls that bear mute witness to the inhumanity of the human creature.`;
// post1 = db.post.create(post1);
// let comment1 = createCommentData(post1, author1)
// let comments: Array<CommentData> = [
//   {
//       id: 1,
//       author: 'warrior666',
//       body: 'Your death will be avenged!',
//       score: 461,
//       replies: [
//           {
//               id: 2,
//               author: 'anon7',
//               body: '@warrior666 The sanctity of this place has been fouled.',
//               score: 6,
//           },
//           {
//               id: 3,
//               author: 'anon8',
//               body: '@anon7 Hello, my friend. Stay awhile and listen.',
//               score: 2,
//           },
//       ]
//   },
//   {
//       id: 4,
//       author: 'anon4',
//       body: 'you missed the ellipsis at the beginning of the quote',
//       score: 3,
//   },
//   {
//       id: 5,
//       author: 'anon0',
//       body: 'good times',
//       score: 1,
//   },
//   {
//       id: 6,
//       author: 'anon2',
//       body: 'Worst quest in act 1!',
//       score: -99,
//   },
// ]






// Create an initial set of users and posts
const users = []
for (let i = 0; i < NUM_USERS; i++) {
    users.push(db.user.create(createUserData()))
}

// const op = faker.helpers.arrayElement(users);
for (const op of users) {
    for (let j = 0; j < POSTS_PER_USER; j++) {
        const post = db.post.create(createPostData(op));
        for (let k = 0; k < COMMENTS_PER_POST; k++) {
            const commenter = faker.helpers.arrayElement(users);
            let comment = db.comment.create(createCommentData(post, commenter));
            if (k === 0) {
                for (let l = 0; l < MAX_REPLIES_PER_COMMENT; ++l) {
                    const replier = faker.helpers.arrayElement(users);
                    const reply = db.comment.create(createCommentData(post, replier, comment));

                    comment = db.comment.update({
                        where: {
                            id: {
                                equals: comment.id
                            }
                        },
                        data: {
                            // Derive the next value from the previous one and the unmodified entity
                            replies: (prevReplies, comment) => [...prevReplies, reply]
                        }
                    });
                }
            }
        }
    }
}




// ****************
// *** REST API ***
// ****************
export const handlers = [
    // ...db.post.toHandlers('rest'),
    rest.get('/posts', function (req, res, ctx) {
        const posts = db.post.getAll();
        posts.sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));
        return res(ctx.json(posts));
    }),
    rest.get('/posts/:postId', function (req, res, ctx) {
        const post = db.post.findFirst({
            where: { id: { equals: req.params.postId } },
        });
        if (!post) {
            return res(ctx.status(404));
        }
        return res(ctx.json(post));
    }),
    rest.post('/posts', function (req, res, ctx) {
        const postData = req.body;

        // Uncomment to force error on specified input
        // if (data.content === 'error') {
        // return res(
        //     ctx.status(500),
        //     ctx.json('Server error saving this post!')
        // )
        // }

        postData.date = new Date().toISOString();

        // FIXME use authenticated user instead of random
        const user = db.user.findFirst({
            where: { id: { notEquals: "ANY" } }
        });
        postData.author = user;

        const post = db.post.create(postData);
        return res(ctx.status(201), ctx.json(post));
    }),
    rest.post('/posts/:postId/upvote', function (req, res, ctx) {
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
            return res(ctx.status(200))
        }

        return res(ctx.status(400));
    }),

    rest.post('/posts/:postId/nonvote', function (req, res, ctx) {
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
            return res(ctx.status(200));
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
            return res(ctx.status(200));
        }

        return res(ctx.status(400)); // ctx.json(updatedPost));
    }),

    rest.post('/posts/:postId/downvote', function (req, res, ctx) {
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
            return res(ctx.status(200));
        }

        return res(ctx.status(400));
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
            }
        });
        return res(ctx.json(comments));
    }),

    rest.post('/posts/:postId/comments/:commentId/upvote', function (req, res, ctx) {
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
            return res(ctx.status(200))
        }

        return res(ctx.status(400));
    }),

    rest.post('/posts/:postId/comments/:commentId/nonvote', function (req, res, ctx) {
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
            return res(ctx.status(200));
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
            return res(ctx.status(200));
        }

        return res(ctx.status(400));
    }),

    rest.post('/posts/:postId/comments/:commentId/downvote', function (req, res, ctx) {
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
            return res(ctx.status(200));
        }

        return res(ctx.status(400));
    }),
];

// export const handlers = [
//     rest.post('/login', (req, res, ctx) => {
//       // Persist user's authentication in the session
//       sessionStorage.setItem('is-authenticated', 'true')
//       return res(
//         // Respond with a 200 status code
//         ctx.status(200),
//       )
//     }),
//     rest.get('/user', (req, res, ctx) => {
//       // Check if the user is authenticated in this session
//       const isAuthenticated = sessionStorage.getItem('is-authenticated')
//       if (!isAuthenticated) {
//         // If not authenticated, respond with a 403 error
//         return res(
//           ctx.status(403),
//           ctx.json({
//             errorMessage: 'Not authorized',
//           }),
//         )
//       }
//       // If authenticated, return a mocked user details
//       return res(
//         ctx.status(200),
//         ctx.json({
//           username: 'admin',
//         }),
//       )
//     }),
//   ]

