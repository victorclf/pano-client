import { faker } from '@faker-js/faker';
import { sub } from 'date-fns';
import { db, NULL_WORKAROUND } from './handlers';

const NUM_USERS = 10
const POSTS_PER_USER = 7
const COMMENTS_PER_POST = 5
const MAX_REPLIES_PER_COMMENT = 5
const MAX_SCORE = 1000
const RECENT_DAYS = 7;

export const setFixedRandomSeed = () => {
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
};

const createUserData = () => {
    // const firstName = faker.name.firstName()
    // const lastName = faker.name.lastName()

    return {
        // firstName,
        // lastName,
        // name: `${firstName} ${lastName}`,
        username: faker.internet.userName(),
        password: faker.internet.password(),
        date: faker.date.past().toISOString(),
        country: faker.address.country(),
        score: faker.datatype.number(MAX_SCORE),
    }
}

const createPostData = (author) => {
    return {
        title: faker.lorem.words(4),
        author,
        body: faker.lorem.paragraphs(),
        date: faker.date.recent(RECENT_DAYS).toISOString(),
        score: faker.datatype.number(MAX_SCORE),
        upvoted: false,
        downvoted: false,
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

const dbCreateReply = (commentData) => {
    const reply = db.comment.create(commentData);

    db.comment.update({
        where: {
            id: {
                equals: commentData.parentCommentId
            }
        },
        data: {
            replies: (prevReplies, comment) => [...prevReplies, reply]
        }
    });
};

const pickRandomUser = (users = null) => faker.helpers.arrayElement(users ? users : db.user.getAll());

const generateUsers = () => {
    const users = [];
    for (let i = 0; i < NUM_USERS; i++) {
        users.push(db.user.create(createUserData()));
    }
    return users;
};

const generatePosts = (users) => {
    const posts = [];
    for (const op of users) {
        for (let j = 0; j < POSTS_PER_USER; j++) {
            posts.push(db.post.create(createPostData(op)));
        }
    }
    return posts;
};

const generateCommentReplies = (comment, post, users) => {
    for (let l = 0; l < MAX_REPLIES_PER_COMMENT; ++l) {
        const replier = pickRandomUser(users);
        const replyData = createCommentData(post, replier, comment)
        dbCreateReply(replyData);
    }
}

const generateCommentsForPost = (post, users = null) => {
    for (let k = 0; k < COMMENTS_PER_POST; k++) {
        const commenter = pickRandomUser(users);
        let comment = db.comment.create(createCommentData(post, commenter));
        if (k === 0) {
            generateCommentReplies(comment, post, users);
        }
    }
};

const generateRandomMockData = () => {
    const users = generateUsers();
    const posts = generatePosts(users);
    for (const post of posts) {
        generateCommentsForPost(post, users);
    }
};


const createD1Thread = () => {
    const author = db.user.create({ ...createUserData(), username: 'd.cain' });
    const post = db.post.create({
        ...createPostData(pickRandomUser()),
        title: 'The Forgotten Tower',
        author: author,
        body: `
            And so it came to pass that the 
            Countess, who once bathed in the
            rejuvenating blood of a hundred
            virgins, was buried alive... And her
            castle in which so many cruel deeds
            took place fell rapidly into ruin. Rising
            over the buried dungeons in that
            god-forsaken wilderness, a solitary
            tower, like some monument to Evil, is
            all that remains.

            The Countess' fortune was believed to
            be divided among the clergy, although
            some say that more remains unfound, 
            still buried alongside the rotting skulls
            that bear mute witness to the
            inhumanity of the human creature.
        `.trim(),
        date: sub(new Date(), { hours: 1}).toISOString(),
        score: 999
    });
    
    db.comment.create({...createCommentData(post, pickRandomUser()), body: 'Worst quest in act 1', score: -93});
    db.comment.create({...createCommentData(post, pickRandomUser()), body: 'good times', score: 2});
    db.comment.create({...createCommentData(post, pickRandomUser()), body: 'you missed the ellipsis at the beginning of the quote', score: 1});
    const user1 = db.user.create({ ...createUserData(), username: 'warrior2000' });
    const c1 = db.comment.create({...createCommentData(post, user1), body: 'Your death will be avenged!', score: 461});
    const user2 = pickRandomUser();
    dbCreateReply({...createCommentData(post, user2, c1), body: `@${user1.username} The sanctity of this place has been fouled.`, score: 37});
    const user3 = pickRandomUser();
    dbCreateReply({...createCommentData(post, user3, c1), body: `@${user2.username} Hello, my friend. Stay awhile and listen.`, score: 6});
}

const createDemoPost1 = () => {
    const post = db.post.create({
        ...createPostData(pickRandomUser()),
        title: "A search engine that favors text-heavy sites and punishes modern web design",
        body: `
            This is an independent DIY search engine that focuses on non-commercial content, and attempts to show you sites you perhaps weren't aware of in favor of the sort of sites you probably already knew existed. 

            https://search.marginalia.nu/
        `.trim(),
        date: sub(new Date(), { minutes: 58}).toISOString(),
    });
    generateCommentsForPost(post);
    return post;
};

const createDemoPost2 = () => {
    const post = db.post.create({
        ...createPostData(pickRandomUser()),
        title: "The Heilmeier Catechism",
        body: `
        George H. Heilmeier, a former DARPA director (1975-1977), crafted a set of questions known as the "Heilmeier Catechism" to help Agency officials think through and evaluate proposed research programs.
        
        - What are you trying to do? Articulate your objectives using absolutely no jargon.
        - How is it done today, and what are the limits of current practice?
        - What is new in your approach and why do you think it will be successful?
        - Who cares? If you are successful, what difference will it make?
        - What are the risks?
        - How much will it cost?
        - How long will it take?
        - What are the mid-term and final “exams” to check for success? 

        https://www.darpa.mil/work-with-us/heilmeier-catechism
        `.trim(),
        date: sub(new Date(), { minutes: 59}).toISOString(),
    });
    generateCommentsForPost(post);
    return post;
}

const createDemoPost3 = () => {
    const post = db.post.create({
        ...createPostData(pickRandomUser()),
        title: "Return to Monkey Island Trailer",
        body: `
        https://grumpygamer.com/rtmi_trailer#1656548734
        `.trim(),
        date: sub(new Date(), { hours: 1}).toISOString(),
    });
    generateCommentsForPost(post);
    return post;
}

const createReadmePost = () => {
    const author = db.user.create({ ...createUserData(), username: 'victorclf' });
    const post = db.post.create({
        ...createPostData(pickRandomUser()),
        title: "README: What's this app?",
        author,
        body: `
            Pano is a demo of a social news app written with TS, React, Redux (+ RTK Query) and MUI.

            Currently, the backend is a mock built with MSW, so the data is local and only lasts until the app is refreshed. Moreover, the response delays are artificial.

            Features:
            - Voting (up, down, unvote)
            - Posts (infinite scroll listing, create and view)
            - Comments (create, edit and view)
            - Users (view)
            - Auth (log in and out)
        `.trim(),
        date: new Date().toISOString(),
        score: 999
    });
    generateCommentsForPost(post);
    return post;
}

const addCustomMockData = () => {
    createDemoPost1();
    createDemoPost2();
    createDemoPost3();
    createD1Thread();
    createReadmePost();
};

export const generateMockData = () => {
    setFixedRandomSeed();
    generateRandomMockData();
    addCustomMockData();
};


