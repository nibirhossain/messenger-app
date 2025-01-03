const mongose = require('mongoose');

const connectDatabase = () => {
    // mongose.connect("mongodb://localhost:27017/messenger", {
    mongose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Mongodb connected successfully");
    }).catch(error => {
        console.log("Mongodb connection is not successful");
        console.log(error);
    })
}

module.exports = connectDatabase;