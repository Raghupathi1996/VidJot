const mongoose = require('mongoose')

const connectDB = (url) => {
    const return_mongodb =  mongoose.connect(url, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        useunifiedTopology: true,
    }). then(() => console.log('MongoDB Connected...'))
    return return_mongodb
}

module.exports = connectDB