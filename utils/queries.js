
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
    ingredients : [{ingredient_name:{type : String},categoria:{type : String},alias_ingredient:{type : String}}],
    }
);

var dishfloadModel =  mongoose.model('dishfload', dishfload)


/********* QUERY CERCA PIATTO PER INGREDIENTE ************/



var findRecipeByIngredient = function(ingredient,from,to){

  var query = dishfloadModel.find({"ingredients.ingredient_name":
   {"$regex": ingredient,"$options":"i"}}).skip(from).limit(to);
  return query;

}






/********* QUERY CERCA PIATTO PER PIU CATEGORIE DI INGREDIENTI ************/



var findRecipeByCategory = function(cat , from , to ){
 
 cat = JSON.parse(cat)
 var query = dishfloadModel.find({"ingredients.categoria":
 {$all:cat}}).skip(from).limit(to);
 return query

}





/********* QUERY CERCA PIATTO PER NAZIONI ************/

var findRecipeByNation = function(nation , from , to ){

  var query = dishfloadModel.find({"Cuisine":
   {"$regex": nation,"$options":"i"}}).skip(from).limit(to);
	return query;

}




/********* QUERY CERCA TOP CATEGORIE PER NAZIONI ************/
var findTopCategoryByCuisine = function(cuisine){

 var query = dishfloadModel.aggregate([
   {$match: { Cuisine: cuisine}},
   {$unwind: "$ingredients"},
   {$group: {_id: "$ingredients.categoria", total: { $sum: 1}}}
]);
return query;

}

/********* QUERY CERCA TOP INGREDIENTI PER NAZIONI ************/



var findTopIngredientByCuisine = function(cuisine){

 var query = dishfloadModel.aggregate([
   {$match: { Cuisine: cuisine}},
   {$unwind: "$ingredients"},
   {$group: {_id: "$ingredients.alias_ingredient", total: { $sum: 1}}},
   {$sort:{total:-1}}
]);
return query;

}

/********* QUERY CERCA TOP NAZIONI PER CATEGORIA ************/
var findTopCuisineByCategory = function(category){

 var query = dishfloadModel.aggregate([
   {$match: { "ingredients.categoria":category }},
   {$unwind: "$ingredients"},
   {$group: {_id: "$Cuisine", total: { $sum: 1}}}
]);
return query;

}





/********* QUERY CERCA PIATTI VEGANI ************/
var veganCategory = ["Meat","Fish","Dairy"];

var findVeganRecipe = function(veganCategory){

	var query = dishfloadModel.find({"ingredients.categoria": {$nin: veganCategory}});

return query;
}




/********* QUERY CERCA PIATTI VEGETARIANI ************/
var vegetarianCategory = ["Meat","Fish"];

var findVegetarianRecipe= function(vegetarianCategory){

	var query = dishfloadModel.find({"ingredients.categoria": {$nin: vegetarianCategory}});

return query;
}




/********* QUERY CONTA PIATTI PER NAZIONE ************/
var countRecipeOfNations = function(){

var query = dishfloadModel.aggregate([
   {$group: {_id: "$Cuisine", total: { $sum: 1}}},
   {$sort:{total:-1}}
]);
return query;
}



/********* QUERY CERCA TOP NAZIONI PER INGREDIENTE ************/


var findTopCuisineByIngredient = function(pattern){

 var query = dishfloadModel.aggregate([
   {$unwind: "$ingredients"},
   {$match: { "ingredients.ingredient_name":{"$regex": pattern,"$options":"i"}}},
   {$group: {_id: "$Cuisine", total: { $sum: 1}}},
   {$sort:{total:-1}}
]);
return query;
}


/********* QUERY CERCA TUTTI GLI INGREDIENTI ************/
var findAllIngredients = function(){

 var query = dishfloadModel.aggregate([
   {$unwind: "$ingredients"},
   {$group: {_id: "$ingredients.alias_ingredient"}},
]);
return query;
}



/********* QUERY CONTA NUMERO DI PIATTI PER SINGOLA NAZIONE ************/
var countRecipeByNation = function(nation){

 var query = dishfloadModel.aggregate([
   {$match: { Cuisine:nation}},
   {$group: {_id: "$Cuisine", total: { $sum: 1}}},
]);
return query;
}



module.exports = {findRecipeByIngredient, findRecipeByNation, findTopCuisineByIngredient, findTopIngredientByCuisine,findRecipeByCategory, countRecipeByNation, findAllIngredients};
