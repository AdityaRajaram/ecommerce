const mongoose = require('mongoose');
const keys = require('./keys');

// connecting to database
const connectDB = () => {

    mongoose.connect(keys.mongoDBURI, {
        useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify:false
        })
        .then(() => {
            console.log('connected to Database');
        })
        .catch(error => {
            console.log(error.array);
        })
}

module.exports = connectDB