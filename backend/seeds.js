const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);
require('./models/User');
require('./models/Item');
require('./models/Comment');

const User = mongoose.model('User');
const Item = mongoose.model('Item');
const Comment = mongoose.model('Comment');

const LIMIT = 100;
const first_name = ["Liam", "Olivia", "Noah", "Emma", "Oliver", "Charlotte", "Elijah", "Amelia", "James", "Ava", "William", "Sophia", "Benjamin", "Isabella", "Lucas", "Mia", "Henry", "Evelyn", "Theodore", "Harper",]
const last_name = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"]
const adjectives = ["adorable", "adventurous", "aggressive", "agreeable", "alert", "alive", "amused", "angry", "annoyed", "annoying", "anxious", "arrogant", "ashamed", "attractive", "average", "awful", "bad", "beautiful", "better", "bewildered", "black", "bloody", "blue", "blue", "blushing", "bored", "brainy", "brave", "breakable", "bright", "busy", "calm", "careful", "cautious", "charming", "cheerful", "clean", "clear", "clever", "cloudy", "clumsy", "colorful"]
const nouns = ["Jelly", "Rose", "Camera", "Jewellery", "Russia", "Candle", "Jordan", "Sandwich", "Car", "Juice", "School", "Caravan", "Kangaroo", "Scooter", "Carpet", "King", "Shampoo", "Cartoon", "Kitchen", "Shoe", "China", "Kite", "Soccer", "Church", "Knife", "Spoon", "Crayon", "Lamp", "Stone", "Crowd", "Lawyer", "Sugar", "Daughter", "Leather", "Sweden", "Death", "Library", "Teacher", "Denmark", "Lighter", "Telephone", "Diamond", "Lion", "Television", "Dinner", "Lizard", "Tent", "Disease", "Lock", "Thailand", "Doctor", "London", "Tomato"]

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const generate_users = async function () {
    const usersPromises = [];
    for (let i = 0; i < LIMIT; i++) {
        const randf = randomIntFromInterval(0, first_name.length - 1)
        const randl = randomIntFromInterval(0, last_name.length - 1)
        const user = new User();
        user.username = `${first_name[randf]}${i}${last_name[randl]}`;
        user.email = `${first_name[randf]}.${last_name[randl]}${i}@dummy.com`
        usersPromises.push(user.save())
    }
    return Promise.all(usersPromises);

}
const generate_items = async function () {
    const items = [];
    const user = await User.findOne()

    for (let i = 0; i < LIMIT; i++) {
        const randa = randomIntFromInterval(0, adjectives.length - 1)
        const randn = randomIntFromInterval(0, nouns.length - 1)
        const item = new Item()
        item.title =  `${adjectives[randa]} ${nouns[randn]}`;
        item.description =  `A ${adjectives[randa]} ${nouns[randn]}`;
        item.image =  `Image of${adjectives[randa]} ${nouns[randn]}`;
        item.tagList = [adjectives[randa], nouns[randn]]
        item.seller = user._id;

        items.push(item.save())
    }
    return Promise.all(items);
}
const generate_comments = async function () {
    const user = await User.findOne()

    const comments = [];
    for (let i = 0; i < LIMIT; i++) {
        const randa = randomIntFromInterval(0, adjectives.length - 1)
        const randn = randomIntFromInterval(0, nouns.length - 1)
        const comment = new Comment()
        comment.body = `${adjectives[randa]} ${nouns[randn]}`;
        comment.seller = user._id;

        comments.push(comment.save())
    }
    return Promise.all(comments);
}

const dropAll = async function(){
    await Promise.all([
        User.deleteMany({}),
        Item.deleteMany({}),
        Comment.deleteMany({}),
    ])
}
const seed = async function () {
    await dropAll()
    const users = await generate_users()

    const items = await generate_items()

    const comments = await generate_comments()

    return 'FINISH';
};

seed()
    .then(data => console.log(data))
    .catch(error => console.error(error));
