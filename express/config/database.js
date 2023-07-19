if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:'mongodb+srv://raghupathijan01:India9900228680@cluster0.8tmq5i6.mongodb.net/VidJotProd?retryWrites=true&w=majority&ssl=true'}
} else {
    module.exports = {mongoURI: 'mongodb+srv://raghupathijan01:India9900228680@cluster0.8tmq5i6.mongodb.net/VidJot?retryWrites=true&w=majority&ssl=true'}
}