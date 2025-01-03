const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const connectDatabase = require('./config/database');
const authRoute = require('./routes/authRoute');
const messengerRoute = require('./routes/messengerRoute');

dotenv.config({
    // path : 'config/config.env'
    path : './config/config.env'
})

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/messenger', authRoute);
app.use('/api/messenger', messengerRoute);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('This is from backend');
})

connectDatabase();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
