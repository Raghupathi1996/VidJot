const mongoose = require('mongoose')

const connectDB = (url) => { 
    //Map global promise - get rid of warning 
    mongoose.Promise = global.Promise;
    const return_mongodb =  mongoose.connect(url, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        useunifiedTopology: true,
    }). then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))
    return return_mongodb
}

module.exports = connectDB