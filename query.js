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



function findRecipeByIngredient(ingredient){
dishfloadModel.find({
    'ingredients': {
        $elemMatch : {
            'ingredient_name' : ingredient
        }
    }
}, function (err, docs) {

	console.log(docs);
	//console.log(docs[0]._id);
});
}

//findRecipeByIngredient('lemon');



function findRecipeByCategory(category){
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

//findRecipeByCategory("Fruit");



function findRecipeByNation(nation){

	dishfloadModel.find({Cuisine: nation}, function (err, docs) {
	console.log(docs);

	//console.log(docs[0]._id);
});
}
//findRecipeByNation("USA");





console.log("-- findTopIngredientByNation --");

function findTopIngredientByNation(){
  dishfloadModel.aggregate([
     {$match: { Cuisine: "USA"}},
     {$group: {_id: "$ingredients.categoria", total: { $sum: 1}}}
  ],function(err,results){
          if(err) throw err;
          console.log(results)
      });
}

//findTopIngredientByNation();


// findTopIngredientByNation();
//
// var recipe = dishfloadModel.find({}, function (err, docs) {
// 	//console.log(docs[0]._id);
// });
//
// /*
// var pipeline = [
//         {
//             "$group": {
// 				"_id": "$Cuisine",
//                 "count": { "$sum": 1 }
//             }
//         }
//     ];
//
//     dishfloadModel.aggregate(pipeline, function (err, results) {
//         if(err) throw err;
//         console.log(results)
//     });
// */
//
// /*
// let res = dishfloadModel.aggregate([
//    {$match: { Cuisine: "USA"}},
//    {$group: {_id: "$ingredients.categoria", total: { $sum: 1}}}
// ])
// console.log(res);
// */
//
// let res = dishfloadModel.aggregate([
//    {$match: { Cuisine: "USA"}},
//    {$group: {_id: "$ingredients.categoria", total: { $sum: 1}}}
// ],function(err,results){
//         if(err) throw err;
//         console.log(results[0]["_id"])
//     });

function nationList(){
  dishfloadModel.aggregate([
     {$group: {_id: "$Cuisine"}}
  ],function(err,results){
          if(err) throw err;
          console.log(results)
      });
}
nationList();
