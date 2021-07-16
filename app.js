const express = require('express')
const mongoose = require('mongoose')
var path = require('path');

require('dotenv').config()


var publico = path.join(__dirname, 'public');

const port = process.env.PORT || 3000;
const url = process.env.LOCAL_MONGO_CONNECTION;

const app = express()


// **** Configura Template Engine EJS x front-end ****
// PS: assicurati di aver dato: npm install ejs
app.set('view engine', 'ejs');


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


var arrayToInsert = [];

app.get('/', (req, res) => {
   res.render('home', {listaRicette: arrayToInsert})
})


//****** AJAX?***************************
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.post('/findRecipeByIngredient', (req, res) => {
  var queriesModel = require('./utils/queries');
  var ingredient = req.body.ingredient;
  let query = queriesModel.findRecipeByIngredient(ingredient);
  query.then(
     (list) => {
       console.log(list);
       var response = {
         ricette : list,
     }
     res.end(JSON.stringify(response));

     },
   (err) => {console.log(err)}
   );
})

//****************************


app.use('/', express.static(publico));

app.listen(port, () => {
  console.log(`Sono in ascolto su http://localhost:${port}`)
})
