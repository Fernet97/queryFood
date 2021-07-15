
const mongoose = require('mongoose')
require('dotenv').config()



const url = process.env.LOCAL_MONGO_CONNECTION;



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




// definizione dello schema del DB
const Schema = mongoose.Schema;
const dishfload = Schema
(
    {
    _id : { type: Number},
    name: { type: String },
    Cuisine : {type: String},
    ingredients : {type : Object} ,
    }
);

var dishfloadModel =  mongoose.model('dishfload', dishfload)



var findRecipeByIngredient = function(ingredient){
  var ricette = [];

  var query  =  dishfloadModel.find({
        'ingredients': {
            $elemMatch : {
                'ingredient_name' : ingredient
            }
        }
    });

   ricette = query.exec();

  return ricette;
}

var ricette = findRecipeByIngredient('lemon');
console.log(ricette);


var findRecipeByCategory = function (category){
dishfloadModel.find({
    'ingredients': {
        $elemMatch : {
            'categoria' : category
        }
    }
}, function (err, docs) {

	console.log(docs);
	//console.log(docs[0]._id);
});
}


module.exports = {findRecipeByIngredient,findRecipeByCategory};
