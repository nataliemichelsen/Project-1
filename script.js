var key = '0IA37F9JE1OFIMZM'
var comp = "GSPC"
// wanted companies DJI, NDAQ, GSPC
var queryURL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${comp}&apikey=${key}`
// https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=BA&apikey=demo
// http://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=803f9ad748be457e83fc9fa29df97188
//`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${comp}&interval=5min&apikey=demo${key}`

// $.ajax({
//     url: queryURL,
//     method: "GET"
//   }).then(function(resp){
//     console.log(resp);
//   })



function getNews(){
  var newsURL = "http://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=803f9ad748be457e83fc9fa29df97188";
  $.ajax({
    url: newsURL,
    method: "GET"
  }).then(function(resp){
    console.log(resp); 
  }).catch(function(error){
    console.log(error.statusText);
  });
}

function getTopThree(){
  var key= '0IA37F9JE1OFIMZM'
  var comp = ["DJI", "NDAQ", "GSPC"];
  for(i in comp){
    var topURL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + comp[i] + "&apikey=0IA37F9JE1OFIMZM";
    $.ajax({
      url: topURL,
      method: "GET"
    }).then(function(resp){
      if(resp.Note === undefined){
        console.log(resp);
      }else{
        console.log("limited queries");
      }
    }).catch(function(error){
      console.log(error.statusText);
    });
  }
}

function getStockInfo(stock){
  var stockURL = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=60min&outputsize=compact&apikey=0IA37F9JE1OFIMZM"
  $.ajax({
    url: stockURL,
    method: "GET"
  }).then(function(resp){
    if(resp.Note === undefined){
      console.log(resp["Time Series (60min)"].length());
    }else{
      console.log("limited queries");
    }
  }).catch(function(error){
    //console.log(error.statusText);
  });
}

function addToFavorite(item){
  if(item !== null && item !== ""){
    var favorites = [];
    var saved = JSON.parse(localStorage.getItem("favorites"));
    console.log("favorites", favorites);
    if(saved !== null){
      favorites = saved;
      if(!favorites.includes(item)){
        favorites.push(item);
      }else{
        console.log("item already exist");
      }
    }else{
      console.log("favorites are empty"); 
      favorites.push(item);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

function getFavorites(){
  var favorites = JSON.parse(localStorage.getItem("favorites"));
  if(favorites === null){
    console.log("you have not favs");
  }else{
    for(i in favorites){
      console.log(favorites[i]);
    }
  }
}
  // getNews();
  //getTopThree();
  getStockInfo("IBM");
  // getFavorites("IBM");