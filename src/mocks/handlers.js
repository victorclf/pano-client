import { factory, oneOf, manyOf, primaryKey } from '@mswjs/data'
import { faker } from '@faker-js/faker';
import { nanoid } from '@reduxjs/toolkit'



// ******************
// *** DATA MODEL ***
// ******************
export const db = factory({
  user: {
    id: primaryKey(nanoid),
    username: String,
    // firstName: String,
    // lastName: String,
    // name: String,
    // posts: manyOf('post'),
  },
  post: {
    id: primaryKey(nanoid),
    title: String,
    body: String,
    score: Number,
    author: {
      id: Number,
      username: String,
    },
    // author: oneOf('user'),
    // date: String,
    // reactions: oneOf('reaction'),
    // comments: manyOf('comment'),
  },
  comment: {
    id: primaryKey(String),
    body: String,
    post: oneOf('post'),
    score: Number,
    replies: manyOf('commentReply'),
    // date: String,
  },
  commentReply: {
    id: primaryKey(String),
    body: String,
    post: oneOf('post'),
    score: Number,
  },
  // reaction: {
  //   id: primaryKey(nanoid),
  //   thumbsUp: Number,
  //   hooray: Number,
  //   heart: Number,
  //   rocket: Number,
  //   eyes: Number,
  //   post: oneOf('post'),
  // },
})



// **************************
// *** GENERATE MOCK DATA ***
// **************************
const NUM_USERS = 5
const POSTS_PER_USER = 5
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

const createPostData = (user) => {
  return {
    title: faker.lorem.words(),
    // date: faker.date.recent(RECENT_NOTIFICATIONS_DAYS).toISOString(),
    author: {
      id: user.id,
      username: user.username
    },
    body: faker.lorem.paragraphs(),
    score: faker.datatype.number(MAX_SCORE),
    // reactions: db.reaction.create(),
  }
}

// Create an initial set of users and posts
for (let i = 0; i < NUM_USERS; i++) {
  const author = db.user.create(createUserData())

  for (let j = 0; j < POSTS_PER_USER; j++) {
    const newPost = createPostData(author)
    db.post.create(newPost)
  }
}



// ****************
// *** REST API ***
// ****************
export const handlers = [...db.user.toHandlers('rest')]
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

