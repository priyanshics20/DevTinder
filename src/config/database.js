const mongoose = require('mongoose');

const conncetDB = async () => {
    await mongoose.connect("mongodb+srv://apriyanshi637:VBZmE0FjfqqLX9pV@learnmongo.tdwh4.mongodb.net/DevTinder")
}

module.exports = conncetDB ;