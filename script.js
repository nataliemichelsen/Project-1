var key = 'VIW8O2VZ5QQ06ZVI'
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
    for(var i=0; i<resp.articles.length; i++){
      if(resp.articles[i].urlToImage !== null){
        var article = $(`<a href="${resp.articles[i].url}" target="_blank">
        <div class="newsArticle">
        <img class="thumbnail" width="180" src="${resp.articles[i].urlToImage}"/>
        <p class="p">${resp.articles[i].title}<br/>
        <span class="time">Published on ${resp.articles[i].publishedAt} <br/>By: ${resp.articles[i].author}</span></p>
        </div></a>`);
        $(".news").append(article);
      }
    }
  }).catch(function (error) {
    console.log(error.statusText);
  });
}

function getTopThree() {
  var key = '0OGUB3H5NFMSGVIS'
  var comp = ["DJI", "NDAQ", "GSPC"];
  var myClass = "up";
  for (let i in comp) {
    var topURL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + comp[i] + "&apikey=0IA37F9JE1OFIMZM";
    $.ajax({
      url: topURL,
      method: "GET"
    }).then(function (resp) {
      if (resp.Note === undefined) {
        var stockPrice = Number(Object.entries(resp["Global Quote"])[4][1]).toFixed(2);
        var stockPerformace = Object.entries(resp["Global Quote"])[9][1];
        saveTopThree(stockPrice, stockPerformace);
      } else {
        var stockPrice = Number(JSON.parse(localStorage.getItem("prices"))[i]).toFixed(2);
        var stockPerformace = JSON.parse(localStorage.getItem("performances"))[i];
        console.log("limited queries");
        console.log(localStorage.getItem("prices"));
      }

      if(stockPerformace > 0 && stockPerformace[i].startsWith("-")){
         myClass = "down";
      }
      $("#listCompany").append(`<div class="col s4 m4 l4">
      <div class="card">
        <div class="card-content">
          <h4 class="card-title">${comp[i]}</h4>
          <h5 class="stockPrice">$` + stockPrice + `</h5>
          <p class="${myClass}">${stockPerformace}</p>
        </div>
      </div>
    </div>`);
    }).catch(function (error) {
      console.log(error);
    });
  }
}

var prices = [];
var performances = [];
function saveTopThree(price, performance){
  prices.push(price);
  performances.push(performance);
  localStorage.setItem("prices", JSON.stringify(prices));
  localStorage.setItem("performances", JSON.stringify(performances));
}

function getStockInfo(stock) {
  var stockURL = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=30min&outputsize=compact&apikey=0IA37F9JE1OFIMZM"
  $.ajax({
    url: stockURL,
    method: "GET"
  }).then(function (resp) {
    if (resp.Note === undefined) {
      console.log(resp);
      console.log(Object.entries(resp["Time Series (30min)"]));

      for(let i = 0; i < 13; i++){
        console.log("my i", Object.entries(resp["Time Series (30min)"])[i]);
      }

    } else {
      console.log("limited queries");
    }
  }).catch(function (error) {
    console.log(error.statusText);
  });
}

function graph(){
  var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Price in U.S. dollar',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 255, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
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
  $("#search-results").empty();
  $.ajax({
    url: `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=0IA37F9JE1OFIMZM`,
    method: "GET"
  }).then(function (resp) {
    console.log(resp);
    for(var i=0;i<Object.entries(resp.bestMatches).length;i++){
      $("#search-results").append(`<a href="#!" onclick="addToFavorite('${Object.entries(resp.bestMatches[i])[0][1]}')" class="collection-item">(${Object.entries(resp.bestMatches[i])[0][1]}) ${Object.entries(resp.bestMatches[i])[1][1]}</a>`);
      console.log(Object.entries(resp.bestMatches[i])[1][1]);
      
    }
    
  }).catch(function (error) {
    //console.log(error.statusText);
  });
}

// $(".collection-item").on(function() {
// $("#collection").append(`<a href="#!" ${this}`)
// });

$( document ).ready(function() {
  
  getNews();
  //getTopThree();
  getStockInfo("IBM");

  $("#search-form").on("submit", function(event){
      event.preventDefault();
      var query = $("#stockSearch").val().trim().toLowerCase();
      if(query !== null && query !== ""){
        getSearch(query);
      }
  })
});




  // getFavorites("IBM");