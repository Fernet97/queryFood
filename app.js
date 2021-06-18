const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const port = process.env.PORT || 3000;

const app = express()

const url = process.env.LOCAL_MONGO_CONNECTION;

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}

mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })



//Get the default connection
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
