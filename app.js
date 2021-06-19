const express = require('express')
const mongoose = require('mongoose')
const csvtojson = require('csvtojson');
require('dotenv').config()

const port = process.env.PORT || 3000;
const url = process.env.LOCAL_MONGO_CONNECTION;
const CSVrecipeDetails = "./CulinaryDB/01_Recipe_Details.csv";


const app = express()

//**** Connessione al DB *****
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


var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
// ******************************************


// *** Importa CSVs nel database ***
var arrayToInsert = [];
csvtojson().fromFile(CSVrecipeDetails).then(source => {
    // Fetching the all data from each row
    for (var i = 0; i < source.length; i++) {
         var oneRow = {
             Recipe_ID: source[i]["Recipe ID"],
             Title: source[i]["Title"],
             //Source: source[i]["Source"], // Non serve
             Cuisine: source[i]["Cuisine"]
         };
         console.log(oneRow);
         arrayToInsert.push(oneRow);
     }

    console.log("Importazione nel db ...");

    var collectionName = 'Recipe';
    var collection = connection.collection(collectionName);
    collection.insertMany(arrayToInsert, (err, result) => {
        if (err) console.log(err);
        if(result){
            console.log("Importazione CSV nel DB completata.");
        }
    });
});
// ******************************************


// **** Configura Template Engine EJS x front-end ****
// PS: assicurati di aver dato: npm install ejs
app.set('view engine', 'ejs');



app.get('/', (req, res) => {
   res.render('home', {listaRicette: arrayToInsert})
})

app.listen(port, () => {
  console.log(`Sono in ascolto su http://localhost:${port}`)
})
