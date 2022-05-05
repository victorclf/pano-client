import { factory, oneOf, manyOf, primaryKey } from '@mswjs/data'
import { faker } from '@faker-js/faker';
import { rest } from 'msw';


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
    score: Number,
    author: oneOf('user'),
    // date: String,
    // reactions: oneOf('reaction'),
    // comments: manyOf('comment'),
  },
  comment: {
    id: primaryKey(faker.datatype.uuid),
    body: String,
    post: oneOf('post'),
    score: Number,
    author: {
      id: Number,
      username: String,
    },
    replies: manyOf('comment'),
    // date: String,
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
    title: faker.lorem.words(),
    // date: faker.date.recent(RECENT_NOTIFICATIONS_DAYS).toISOString(),
    author,
    body: faker.lorem.paragraphs(),
    score: faker.datatype.number(MAX_SCORE),
    // reactions: db.reaction.create(),
  }
}

const createCommentData = (post, author) => {
  return {
    body: faker.lorem.sentences(),
    post: post,
    score: faker.datatype.number(MAX_SCORE),
    author,
    replies: []
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
      const comment = createCommentData(post, commenter);
      if (k === 0) {
        for (let l = 0; l < MAX_REPLIES_PER_COMMENT; ++l) {
          const replier = faker.helpers.arrayElement(users);
          const reply = db.comment.create(createCommentData(post, replier));
          comment.replies.push(reply);
        }
      }
      db.comment.create(comment)
    }
  }
}




// ****************
// *** REST API ***
// ****************
export const handlers = [
  ...db.post.toHandlers('rest'),
    rest.get('/posts/:postId/comments', function (req, res, ctx) {
      const comments = db.comment.findMany({
        where: {
          post: {
            id: {
              equals: req.params.postId
            }
          }
        }
      });
      return res(ctx.json(comments));
    }),
]

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

