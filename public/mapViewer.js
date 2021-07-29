var myCenter=new google.maps.LatLng(42.492595, 12.845449); // Italy
var centers = []

centers.push(new google.maps.LatLng(42.492595, 12.845449) )                     // Italy
centers.push(new google.maps.LatLng(39.095962936305476, 22.082519531250004) )   // Grecia
centers.push(new google.maps.LatLng(46.95026224218562, 2.3510742187500004) )    // Francia
centers.push(new google.maps.LatLng(52.10650519075632, 5.097656250000001) )     // Olanda
centers.push(new google.maps.LatLng(-7.449624260197816, -58.53515625000001) )   // South America
centers.push(new google.maps.LatLng(40.44694705960048, -3.6914062500000004) )   // Spain
centers.push(new google.maps.LatLng(51.45400691005982, 23.818359375000004) )    // Eastern Europe
centers.push(new google.maps.LatLng(16.97274101999902, -97.3828125) )           // Central America
centers.push(new google.maps.LatLng(7.36246686553575, 20.039062500000004) )     // Africa
centers.push(new google.maps.LatLng(-24.046463999666567, 134.12109375000003) )  // Australia
centers.push(new google.maps.LatLng(56.07203547180089, -101.77734375000001) )   // Canada
centers.push(new google.maps.LatLng(37.99616267972814, -98.08593750000001) )    // USA
centers.push(new google.maps.LatLng(35.17380831799959, 101.77734375000001) )    // China
centers.push(new google.maps.LatLng(40.26276066437183, -8.129882812500002) )    // Portugal
centers.push(new google.maps.LatLng(11.781322229287971, 107.05078870311749) )   // South East Asia
centers.push(new google.maps.LatLng(16.972738336609233, 99.93164761586442) )    // Thailand
centers.push(new google.maps.LatLng(53.696706395901856, -1.5600585580823314) )  // British Isles
centers.push(new google.maps.LatLng(66.6529778873872, 21.70898478589164) )      // Scandinavia
centers.push(new google.maps.LatLng(24.46715063178086, 78.68408206121084) )     // Indian Subcontinent
centers.push(new google.maps.LatLng(26.82407092408581, 43.066403938734624) )    // Middle East
centers.push(new google.maps.LatLng(37.474858193000316, 139.64721678974146) )   // Japan
centers.push(new google.maps.LatLng(37.5666791, 126.9782914) )                  // Korea
centers.push(new google.maps.LatLng(18.646245102007867, -69.3896481493052) )    // Caribbean
centers.push(new google.maps.LatLng(24.527135134940764, -102.83203313325329) )  // Mexico
centers.push(new google.maps.LatLng(50.61113160353964, 4.702148448913671) )     // Belgian
centers.push(new google.maps.LatLng(49.55372557959741, 10.239257812500002) )    // DACH ( Germania , Austria e Svizzera)


// array degli infoWindows
infoWindow_array = [
                      "Cucina italiana",
                      "Cucina greca",
                      "Cucina francese" ,
                      "Cucina olandese" ,
                      "Cucina sud americana",
                      "Cucina spagnola",
                      "Cucina del est Europa" ,
                      "Cucina dell'America centrale" ,
                      "Cucina africana",
                      "Cucina austaliana",
                      "Cucina canadese" ,
                      "Cucina americana",
                      "Cucina cinese" ,
                      "Cucina portoghese" ,
                      "Cucina del sud-est asiatico",
                      "Cucina thailandese",
                      "Cucina delle isole britanniche",
                      "Cucina scandinava",
                      "Cucina dell'India subcontinentale",
                      "Cucina del medio oriente",
                      "Cucina giapponese",
                      "Cucina coreana",
                      "Cucina caraibica",
                      "Cucina messicana",
                      "Cucina belga",
                      "Cucina tedesca"
                  ]


country_array = [
                  'Italy',
                  'Greece' ,
                  'France' ,
                  'Misc.: Dutch' ,
                  'South America' ,
                  'Spain' ,
                  'Eastern Europe' ,
                  'Misc.: Central America' ,
                  'Africa' ,
                  'Australia & NZ' ,
                  'Canada' ,
                  'USA' ,
                  'China' ,
                  'Misc.: Portugal' ,
                  'South East Asia' ,
                  'Thailand' ,
                  'British Isles' ,
                  'Scandinavia' ,
                  'Indian Subcontinent' ,
                  'Middle East' ,
                  'Japan' ,
                  'Korea' ,
                  'Caribbean',
                  'Mexico' ,
                  'Misc.: Belgian',
                  'DACH Countries'
              ]



function initialize()
{
  var mapProp = {
                  center:myCenter,
                  zoom:5,
                  mapTypeId:google.maps.MapTypeId.ROADMAP
                };

  var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);

  var marker=new google.maps.Marker({ position:myCenter, });
  marker.setMap(map);

  var i = 0;
  for( i = 0; i < centers.length; i+= 1)
  {
    marker = new google.maps.Marker({position: centers[i]});
    marker.setMap(map)


    var infowindow = new google.maps.InfoWindow({ content:infoWindow_array[i]});

    // marker.addListener('mouseover', function() { infowindow.open(map, this); } );
    // // assuming you also want to hide the infowindow when user mouses-out
    // marker.addListener('mouseout', function() { infowindow.close(); } );


    // google.maps.event.addListener(marker, 'click', function() { infowindow.open(map,marker); });



    //qui ci va la query di ricerca piatti per nazionalità
    function f(str)
    {
      return function()
      {
        console.log("ho fatto click su ", str)
        //AJAX SU QUERY PER NAZIONALITA'
        let numberItemsInPage = 4
         $.ajax({
               url: '/findRecipeByNation',
               type: 'POST',
               cache: false,
               dataType: 'json',
               data: { nation:  str},
               success: function (result) {
                    //console.log(result.ricette);

                      if(result.ricette.length > 0)
                      {
                        $('#NationRecipeView').removeAttr('hidden');
                        document.getElementById("discoverMap").innerHTML =  "Trovate " + result.ricette.length + " ricette della "+infoWindow_array[country_array.indexOf(str)];
                        document.getElementById("nomeCucina").innerHTML =  infoWindow_array[country_array.indexOf(str)] + " 🍽️";
                        let tmp = document.createElement('div')
                        tmp.id = "paginationMapViewer"
                        console.log(tmp, document.getElementById("tmp"));
                        document.getElementById("NationRecipeView").appendChild(tmp)
                        $('#paginationMapViewer').pagination({
                        // Total number of items present
                        // in wrapper class

                        items : result.ricette.length,
                        itemsOnPage: 4,
                        displayedPages : 10,
                        edges : 1,
                        // Items allowed on a single page

                        cssStyle: 'compact-theme',
                        onPageClick: function (pageNuber) {
                                                            var k = (parseInt(pageNuber) - 1 ) * numberItemsInPage;
                                                            console.log("click su " , pageNuber)
                                                            $.ajax({
                                                                    url: '/findRecipeByNation',
                                                                    type: 'POST',
                                                                    cache: false,
                                                                    dataType: 'json',
                                                                    data: { nation : str, from: k, to: numberItemsInPage },
                                                                    success: function (result) {
                                                                                                  console.log(result);

                                                                                                  var elements = document.getElementsByClassName("TitleRecipeNation");
                                                                                                  var elementsD = document.getElementsByClassName("RecipeContentNation");
                                                                                                  var item = document.getElementsByClassName("piattoItem");
                                                                                                  var elementsImagePAGE = document.getElementsByClassName("imgInItem");

                                                                                                  let i = 0
                                                                                                  let z = 0
                                                                                                  for( i = 0; i < result.ricette.length; i = i+1 , k+=1)
                                                                                                  {
                                                                                                    const settings = {
                                                                                                      	"async": true,
                                                                                                     	"crossDomain": true,
                                                                                                     	"url": "https://bing-image-search1.p.rapidapi.com/images/search?q="+result.ricette[i].name,
                                                                                                     	"method": "GET",
                                                                                                      	"headers": {
                                                                                                      		"x-rapidapi-key": "", // INSERIRE UNA KEY VALIDA
                                                                                                      		"x-rapidapi-host": "bing-image-search1.p.rapidapi.com"
                                                                                                      	}
                                                                                                   };
                                                                                                   setTimeout(function () {
                                                                                                     $.ajax(settings).done(function (response) {
                                                                                                       console.log("get immagine paginator...","indice:", z, "l'item:", elementsImagePAGE[z]);
                                                                                                       console.log(response.value[0].contentUrl);
                                                                                                      elementsImagePAGE[z].src = response.value[0].contentUrl;
                                                                                                       z+=1;
                                                                                                     });
                                                                                                   }, 1000*z);


                                                                                                    //console.log(elements[i]);
                                                                                                    elements[i].innerHTML = result.ricette[i].name;
                                                                                                    let strtmp = ""
                                                                                                    for(let j = 0; j < result.ricette[i].ingredients.length; j++)
                                                                                                    {
                                                                                                      strtmp+= result.ricette[i].ingredients[j].ingredient_name.toString()
                                                                                                    }

                                                                                                    //elementsD[i].innerHTML = result.ricette[i].ingredients[0].ingredient_name.toString();
                                                                                                    elementsD[i].innerHTML = strtmp
                                                                                                    item[i].style.display = 'flex'

                                                                                                  }
                                                                                                  while(i < item.length)
                                                                                                  {

                                                                                                    item[i].style.display = 'none';
                                                                                                    i+= 1;
                                                                                                  }

                                                                                                } , error : function(result){ console.log("errore " , result)}
                                                                })
                        }
                        , onInit : function (pageNuber){ console.log("ho caricato la paginazione : " , pageNuber) }
                        });

                      }
                      else{
                        document.getElementById("discoverMap").innerHTML = " Non ho trovato nessuna ricetta della "+ infoWindow_array[country_array.indexOf(str)];
                      }

                      var elementsTitles = document.getElementsByClassName("TitleRecipeNation");
                      var elementsDescriptions = document.getElementsByClassName("RecipeContentNation");
                      var elementsImage = document.getElementsByClassName("imgInItem");

                      for(let i = 0; i < result.ricette.length; i = i+ 1){
                        if(elementsTitles[i]){
                          elementsTitles[i].innerHTML = result.ricette[i].name;
                              //API per immagini ricetta
                               const settings = {
                                 	"async": true,
                                	"crossDomain": true,
                                	"url": "https://bing-image-search1.p.rapidapi.com/images/search?q="+result.ricette[i].name,
                                	"method": "GET",
                                 	"headers": {
                                 		"x-rapidapi-key": "", // INSERIRE UNA KEY VALIDA
                                 		"x-rapidapi-host": "bing-image-search1.p.rapidapi.com"
                                 	}
                              };


                              setTimeout(function () {
                                $.ajax(settings).done(function (response) {
                                  console.log("get immagine ...");
                                  console.log(response.value[0].contentUrl);
                                 elementsImage[i].src = response.value[0].contentUrl;
                                });
                              }, 1000*i);

                        }

                        if(elementsDescriptions[i]){
                          let descr = " · ";
                          for(let j = 0; j < result.ricette[j].ingredients.length; j = j+ 1){
                             descr = descr + result.ricette[j].ingredients[j].ingredient_name+" · ";
                          }
                          elementsDescriptions[i].innerHTML = descr;
                        }
                      }


                }
               , error: function(result){
                    console.log(result);
                }
            });


            $.ajax({
                  url: '/findTopIngredientByCuisine',
                  type: 'POST',
                  cache: false,
                  dataType: 'json',
                  data: { nation:  str},
                  success: function (result) {
                       if(result.status == 200){
                          console.log("OK");
                       }
                       console.log("top categorie", result.ricette[0]._id, result.ricette[2]._id,  result.ricette[3]._id);
                       document.getElementById("topCategoryXNation").innerHTML = "Ingredienti più usati nella "+ infoWindow_array[country_array.indexOf(str)];
                       var itemCategory = document.getElementsByClassName("itemCateogory");
                       for(let i = 0; i < 3; i = i + 1){
                           if(i == 0) itemCategory[i].innerHTML = i+1 +". "+ result.ricette[i]._id + " 🏆";
                           else itemCategory[i].innerHTML = i+1 +". "+ result.ricette[i]._id;
                       }

                   }
                  , error: function(result){
                       console.log(result);
                   }
               });
      }

    }

    //google.maps.event.addListener(marker,'click', ( function(marker,content,infowindow) { return function() { infowindow.setContent(content); infowindow.open(map,marker); }; } )(marker,infoWindow_array[i],infowindow) );

    // funzine che ci server per avviare la query di ricerca di ricette per
    google.maps.event.addListener(marker,'click', f(country_array[i]) );

    google.maps.event.addListener(marker,'mouseover', (function(marker,content,infowindow){
      return function() {
        infowindow.setContent(content);
        infowindow.open(map,marker);
      };
    })(marker,infoWindow_array[i],infowindow));

    google.maps.event.addListener(marker,'mouseout', (function(marker,content,infowindow){
      return function() {
        //infowindow.setContent(content);
        infowindow.close();
      };
    })(marker,infoWindow_array[i],infowindow));


  }


}

google.maps.event.addDomListener(window, 'load', initialize);
