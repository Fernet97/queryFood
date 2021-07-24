const express = require('express')
const mongoose = require('mongoose')
var path = require('path');
var favicon = require('serve-favicon')
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



var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
var queriesModel = require('./utils/queries');



var countries = ["salt" , "water", "onion"];

app.get('/', (req, res) => {
  let query = queriesModel.findAllIngredients();
  query.then(
     (list) => {
       // console.log(list[0]);
       let result = list.map(a => a._id);
       //console.log(result);
       res.render('home', {listaRicette: result})
     },
   (err) => {console.log(err)}
   );
})



//****** AJAX *************

app.post('/findRecipeByIngredient', (req, res) => {
  var ingredient = req.body.ingredient;
  var from = Number(req.body.from)
  var to = Number(req.body.to)
  console.log("from : " , from , "   to: " , to )
  let query = queriesModel.findRecipeByIngredient(ingredient , from, to);
  query.then(
     (list) => {
       // console.log(list[0]);
       var response = {
         ricette : list,
     }
     res.end(JSON.stringify(response));

     },
   (err) => {console.log(err)}
   );
})


app.post('/findRecipeByNation', (req, res) => {
  var nation = req.body.nation;
  var from = Number(req.body.from)
  var to = Number(req.body.to)
  let query = queriesModel.findRecipeByNation(nation , from, to);
  query.then(
     (list) => {
       // console.log(list[0]);
       var response = {
         ricette : list,
     }
     res.end(JSON.stringify(response));

     },
   (err) => {console.log(err)}
   );
})


app.post('/findTopCuisineByIngredient', (req, res) => {

  var ingredient = req.body.ingredient;
  console.log("Trovo chi abusa "+ ingredient+ " ...")
  let query = queriesModel.findTopCuisineByIngredient(ingredient);
  query.then(
     (list) => {
       //Dizionario con numeri piatti per nazione
       const NationNumberRecipe = {
           'Italy' : 7504,'Greece' :  934,'France': 2703,'Misc.: Dutch' : 40,
           'South America' : 310,'Spain' : 816,'Eastern Europe' : 565,
           'Misc.: Central America' : 14, 'Africa' : 1112,'Australia & NZ' : 494,
           'Canada' : 1112,  'USA' : 16118,  'China' : 941,  'Misc.: Portugal' : 138,
           'South East Asia': 611,'Thailand' : 667,'British Isles' : 1075,
           'Scandinavia' : 404,'Indian Subcontinent' : 4058,'Middle East' : 993,
           'Japan' : 580 ,  'Korea' : 301,  'Caribbean' : 1103,
           'Mexico' : 3138,  'Misc.: Belgian' : 15,  'DACH Countries' : 487,
       };
       var classificaAbuse = {};

       list.forEach(item => {
            if(NationNumberRecipe[item._id]){
              console.log(item._id, (item.total/NationNumberRecipe[item._id]*100).toFixed(1) + "%");
              let val = (item.total/NationNumberRecipe[item._id]*100);
              classificaAbuse[item._id] = val;
            }
       });


       var response = {
         classifica : classificaAbuse,
     }
     res.end(JSON.stringify(response));

     },
   (err) => {console.log(err)}
   );
})


app.post('/findTopIngredientByCuisine', (req, res) => {
  var nation = req.body.nation;
  let query = queriesModel.findTopIngredientByCuisine(nation);
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


app.post('/findRecipeByCategory', (req, res) => {
  var categories = req.body.categories;
  var from = Number(req.body.from)
  var to = Number(req.body.to)
  let query = queriesModel.findRecipeByCategory(categories , from , to);
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

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.listen(port, () => {
  console.log(`Sono in ascolto su http://localhost:${port}`)
})
