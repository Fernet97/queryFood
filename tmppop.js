const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectID = mongo.ObjectID;

const url = 'mongodb://localhost:27017';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {

    if (err) throw err;

    const db = client.db("foodDB");

    var df = db.collection("dishfloads")
    //df.drop()
    df = db.collection("dishfloads")

    //df.createIndex({ingredients.categoria : 1})
    db.collection("dishfloads").ensureIndex({ "Cuisine": 1 })
    db.collection("dishfloads").ensureIndex({ "ingredients.ingredient_name": 1 })
    db.collection("dishfloads").ensureIndex({ "ingredients.categoria": 1 })
    db.collection("dishfloads").ensureIndex({ "ingredients.alias_ingredient": 1 })
    x =  [{ingredient_name: "" , categoria: "ingrediedients_nameANDcategory[k].categoria" , alias_ingredient : "ingrediedients_nameANDcategory[k].alias_ingredient" } , {ingredient_name: "" , alias_ingredient : "ingrediedients_nameANDcategory[k].alias_ingredient" } ]
    let doc = {_id: new ObjectID(), name: "Toyota", price: 37600 , ingredients : x };

    db.collection('cars').insertOne(doc).then((doc) => {

        console.log('Car inserted')
        console.log(doc);
    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });



// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter )
{
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            //arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData.push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

//ricerca binaria per trovare le categorie
function binarySearch(sortedArray, key)
{
    let start = 0;
    let end = sortedArray.length - 1;

    while (start <= end)
    {
        let middle = Math.floor((start + end) / 2);

        if (sortedArray[middle][2] == key)
        {
            // found the key
            return Number(middle);
        }
        else if (sortedArray[middle][2] < key)
        {
            // continue searching to the right
            start = middle + 1;
        }
        else
        {
            // search searching to the left
            end = middle - 1;
        }
    }
	// key wasn't found
    return -1;
}



const lineByLine = require('n-readlines');
const CSVrecipe = new lineByLine('./CulinaryDB/01_Recipe_Details.csv');
const CSVingredients = new lineByLine('./CulinaryDB/04_Recipe-Ingredients_Aliases.csv');
const CSVcategories = new lineByLine('./CulinaryDB/02_Ingredients.csv');

var categoria_corrente = CSVcategories.next() // lo chiamiamo per cancellare la prima riga , quella dell'intestazione (la riga degli attributi)

//carichiamo l'array per recupereare "velocemente" le categorie attraverso la ricerca binaria
var lista_categorie = []
while(categoria_corrente = CSVcategories.next())
{
    lista_categorie.push(CSVToArray( categoria_corrente , ',') )
}

var ingrediente_corrente
var ricetta_corrente_array = []
var ricetta_corrente
var ingrediente_corrente_array = []
var ingrediedients_nameANDcategory = [ ]

//qeusto serve per far avanzare di una posizione il cursore del file per evitare di leggere la prima riga ( riga degli attributi )
ricetta_corrente = CSVrecipe.next()
//qeusto serve per far avanzare di una posizione il cursore del file per evitare di leggere la prima riga ( riga degli attributi )
ingrediente_corrente = CSVingredients.next()
//chiamiamo 2 volte CSVingredientes.next() per evirare di metter le variabili prec e cor pechè così è già caricata la prima variabile con la quale andiamo a fare il confronto
ingrediente_corrente = CSVingredients.next()


/*********************************************
**      INIZIO FASE DI "ACCORPAMENTO"       **
*********************************************/
//var dishfloadModel =  mongoose.model('dishfload', dishfload)

var i = 0;
//andaimo a scorrere tutte le ricette nel primo file e andiamo a creare i file json per il DB mongodb andando ad accorpare file delle ricette con quello degli ingredienti e quello degli ingredienti con quello delle categorie in base all'ID
while ((ricetta_corrente = CSVrecipe.next()) )
{
    i++ ;

    //serve per resettare la lista delle coppie (ingrediente, categoria) ogni volta che andiamo a considereare una nuova ricetta
    ingrediedients_nameANDcategory = [ ]
    // una volta che prendiamo l'elemento i-esimio del file delle ricette lo andiamo a dividere prendendo i token separati da virgola con la funzione CSVToArray
    ricetta_corrente_array = CSVToArray( ricetta_corrente.toString() , "," )
    // una volta che prendiamo l'elemento i-esimio del file degli ingredienti lo andiamo a dividere prendendo i token separati da virgola con la funzione CSVToArray
    ingrediente_corrente_array = CSVToArray( ingrediente_corrente.toString() , ",")
    // questo ciclo serve per andare a "concatenare il file json delle ricette con quello degli ingredienti e con quello delle categorie"
    while(ingrediente_corrente_array[0] == ricetta_corrente_array[0])  // finchè ci stanno gli id uguali vuol dire che l'ingrediente corrente è un ingrediente della ricetta corrente
    {

        //andiamo a cercare la categoria dell'ingrediente corrente utilizzando la ricerca binaria
        var indice = binarySearch( lista_categorie.slice() , Number(ingrediente_corrente_array[3].toString()))
        // andiamo a controllare che la categoria è presente ( ci sono alcuni ingredienti a cui manca la categoria ( la ricerca binaria restituisce -1 se non trova la categoria ) )
        if(indice != -1)
        {
            ingrediedients_nameANDcategory.push({ingredient_name: ingrediente_corrente_array[1].toString() , categoria:lista_categorie[indice][3].toString() , alias_ingredient :ingrediente_corrente_array[2].toString().trim() })
        }
        else
        {
            ingrediedients_nameANDcategory.push({ingredient_name: ingrediente_corrente_array[1].toString() , alias_ingredient :ingrediente_corrente_array[2].toString().trim()})
        }

        //avanziaomo al prossimo ingrediente presente nel file .csv
        ingrediente_corrente = CSVingredients.next()
        ingrediente_corrente_array = CSVToArray( ingrediente_corrente.toString() , ",")

    }

    // andiaamo a creare il file json per l'elemento i-esimo del DB
    let doc = {_id: ricetta_corrente_array[0] , name: ricetta_corrente_array[1] , Cuisine: ricetta_corrente_array[3], ingredients : ingrediedients_nameANDcategory };
    db.collection('dishfloads').insertOne(doc).then((doc) => {

        // console.log('Car inserted')
        // console.log(doc);
    }).catch((err) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });





//     dishfloadModel.findOne({ _id: ricetta_corrente_array[0] }).
//     populate('ingredients').
//     exec(function (err, user) {
//         if (err) return handleError(err);

//         console.log(user)
//         // if( ingrediedients_nameANDcategory[k].categoria )
//         // {
//         //    user.ingredients.push({ingredient_name: ingrediedients_nameANDcategory[k].ingredient_name , categoria: ingrediedients_nameANDcategory[k].categoria , alias_ingredient : ingrediedients_nameANDcategory[k].alias_ingredient })
//         // }
//         // else
//         // {
//         //    user.ingredients.push({ingredient_name: ingrediedients_nameANDcategory[k].ingredient_name , alias_ingredient : ingrediedients_nameANDcategory[k].alias_ingredient })
//         // }
//         // prints "The author is Ian Fleming"
//   });
    // for(let k = 0 ;  k < ingrediedients_nameANDcategory.length ; k++)
    // {
    //     //console.log(ingrediedients_nameANDcategory[k])
    //     if( ingrediedients_nameANDcategory[k].categoria )
    //     {
    //        user.ingredients.push({ingredient_name: ingrediedients_nameANDcategory[k].ingredient_name , categoria: ingrediedients_nameANDcategory[k].categoria , alias_ingredient : ingrediedients_nameANDcategory[k].alias_ingredient })
    //     }
    //     else
    //     {
    //        user.ingredients.push({ingredient_name: ingrediedients_nameANDcategory[k].ingredient_name , alias_ingredient : ingrediedients_nameANDcategory[k].alias_ingredient })
    //     }

    //     // if(ing)
    //     //     user.ingredients.push( { ingredient_name: ingrediente_corrente_array[1].toString() , alias_ingredient :ingrediente_corrente_array[2].toString().trim() } )
    //     // else
    //     // user.ingredients.push( {ingredient_name: ingrediente_corrente_array[1].toString() , categoria:lista_categorie[indice][3].toString() , alias_ingredient :ingrediente_corrente_array[2].toString().trim() } )

    // }


}

/*****************************************
**      FINE FASE DI "ACCORPAMENTO"     **
**      FINE FASE DI POPOLAMENTO        **
******************************************/




});
