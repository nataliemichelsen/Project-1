var key = '0IA37F9JE1OFIMZM'
var comp = "GSPC"
// wanted companies DJI, NDAQ, GSPC
var queryURL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${comp}&apikey=${key}`
// https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=BA&apikey=demo
// http://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=803f9ad748be457e83fc9fa29df97188
//`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${comp}&interval=5min&apikey=demo${key}`

function getNews() {
  var newsURL = "http://newsapi.org/v2/top-headlines?country=us&pageSize=5&category=business&apiKey=803f9ad748be457e83fc9fa29df97188";
  $.ajax({
    url: newsURL,
    method: "GET"
  }).then(function (resp) {
    console.log(resp)
    for(var i=0; i<5; i++){
      var article = $(`<a href="${resp.articles[i].url}" target="_blank">
      <div class="newsArticle">
      <img class="thumbnail" width="180" src="${resp.articles[i].urlToImage}"/>
      <p class="p">${resp.articles[i].description}<br/>
      <span class="time">Published on ${resp.articles[i].publishedAt} <br/>By: ${resp.articles[i].author}</span></p>
      </div></a>`);
      $(".news").append(article);
    }



  }).catch(function (error) {
    console.log(error.statusText);
  });
}

function getTopThree() {
  var key = '0OGUB3H5NFMSGVIS'
  var comp = ["DJI", "NDAQ", "GSPC"];
  for (i in comp) {
    var topURL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + comp[i] + "&apikey=0IA37F9JE1OFIMZM";
    $.ajax({
      url: topURL,
      method: "GET"
    }).then(function (resp) {
      if (resp.Note === undefined) {
        var myClass = "up";
        if(Object.entries(resp["Global Quote"])[9][1].startsWith("-")){
           myClass = "down";
        }
        $("#listCompany").append(`<div class="col s4 m4 l4">
        <div class="card">
          <div class="card-content">
            <h4 class="card-title">${Object.entries(resp["Global Quote"])[0][1]}</h4>
            <h5 class="stockPrice">$${~~Object.entries(resp["Global Quote"])[4][1]}</h5>
            <p class="${myClass}">${Object.entries(resp["Global Quote"])[9][1]}</p>
          </div>
        </div>
      </div>`);
      } else {
        console.log("limited queries");
      }
    }).catch(function (error) {
      console.log(error.statusText);
    });
  }
}

function getStockInfo(stock) {
  var stockURL = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=60min&outputsize=compact&apikey=0IA37F9JE1OFIMZM"
  $.ajax({
    url: stockURL,
    method: "GET"
  }).then(function (resp) {
    if (resp.Note === undefined) {
      console.log(resp["Time Series (60min)"].length());
    } else {
      console.log("limited queries");
    }
  }).catch(function (error) {
    //console.log(error.statusText);
  });
}

function addToFavorite(item) {
  if (item !== null && item !== "") {
    var favorites = [];
    var saved = JSON.parse(localStorage.getItem("favorites"));
    console.log("favorites", favorites);
    if (saved !== null) {
      favorites = saved;
      if (!favorites.includes(item)) {
        favorites.push(item);
      } else {
        console.log("item already exist");
      }
    } else {
      console.log("favorites are empty");
      favorites.push(item);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

function getFavorites() {
  var favorites = JSON.parse(localStorage.getItem("favorites"));
  if (favorites === null) {
    console.log("you have not favs");
  } else {
    for (i in favorites) {
      console.log(favorites[i]);
    }
  }
}

function getSearch(query){
  $.ajax({
    url: `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=0IA37F9JE1OFIMZM`,
    method: "GET"
  }).then(function (resp) {
    console.log(resp.bestMatches);
    for (let [key, value] of Object.entries(resp.bestMatches)) {
      console.log(`${key}: ${value}`);
    }
  }).catch(function (error) {
    //console.log(error.statusText);
  });
}



$( document ).ready(function() {
  
  getNews();
  getTopThree();

  $("#search-form").on("submit", function(event){
      event.preventDefault();
      var query = $("#stockSearch").val().trim().toLowerCase();
      if(query !== null && query !== ""){
        getSearch(query);
      }
  })
});


//getStockInfo("IBM");
  // getFavorites("IBM");