var key = '0OGUB3H5NFMSGVIS'
// wanted companies DJI, NDAQ, INX
var gStockSymbol = null;
var gStockName = null;

function getNews() {
  var newsURL = "http://newsapi.org/v2/top-headlines?country=us&pageSize=5&category=business&apiKey=803f9ad748be457e83fc9fa29df97188";
  $.ajax({
    url: newsURL,
    method: "GET"
  }).then(function (resp) {
    for (var i = 0; i < resp.articles.length; i++) {
      if (resp.articles[i].urlToImage !== null) {
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
  var comp;
  if (localStorage.getItem("companies") !== null) {
    comp = JSON.parse(localStorage.getItem("companies"));
  } else {
    comp = ["DJI", "NDAQ", "INX"];
  }
  var savedTimestamp = 0;
  if (localStorage.getItem("timeout") !== null) {
    savedTimestamp = localStorage.getItem("timeout");
  }

  function getCompanyName(symbol) {
    switch(symbol){
      case "DJIA": 
      return "Dow Jones Industrial Average";
      break;
      case "NDAQ": 
      return "NASDAQ";
      break;
      case "INX": 
      return "S&P 500";
      break;
    }
  }

  for (let i in comp) {
    var companyName = getCompanyName(comp[i]);
    if (Date.now() > savedTimestamp) {
      localStorage.setItem("timeout", (Date.now() + 900000));
      var topURL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + comp[i] + "&apikey=" + key;
      $.ajax({
        url: topURL,
        method: "GET"
      }).then(function (resp) {
        console.log(resp);
        if (resp.Note === undefined) {
          var company = Object.entries(resp["Global Quote"])[0][1];
          var stockPrice = Number(Object.entries(resp["Global Quote"])[4][1]).toFixed(2);
          var stockPerformace = Object.entries(resp["Global Quote"])[9][1];
          saveTopThree(company, stockPrice, stockPerformace);
          var myClass = "up";
          if (stockPerformace.startsWith("-")) {
            myClass = "down";
          }
          $("#listCompany").append(`<div class="col s4 m4 l4">
            <div class="card">
              <a href="#!" onclick="getStockInfo('${comp[i]}', '${companyName}')" class="card-content">
                <h4 class="card-title">${comp[i]}</h4>
                <h5 class="stockPrice">$` + stockPrice + `</h5>
                <p class="${myClass}">${stockPerformace}</p>
              </a>
            </div>
          </div>`);
        }
      }).catch(function (error) {
        console.log(error);
      });
    } else {
      prices = JSON.parse(localStorage.getItem("prices"));
      performances = JSON.parse(localStorage.getItem("performances"));
      var stockPrice = prices[i];
      var stockPerformace = performances[i];
      var myClass = "up";
      if (stockPerformace.startsWith("-")) {
        myClass = "down";
      }
      $("#listCompany").append(`<div class="col s4 m4 l4">
        <div class="card">
          <a href="#!" onclick="getStockInfo('${comp[i]}', '${companyName}')" class="card-content">
            <h4 class="card-title">${comp[i]}</h4>
            <h5 class="stockPrice">$` + stockPrice + `</h5>
            <p class="${myClass}">${stockPerformace}</p>
          </a>
        </div>
      </div>`);
    }
  }
}


var companies = [];
var prices = [];
var performances = [];
function saveTopThree(company, price, performance) {
  console.log("wwwww", company);
  companies.push(company);
  prices.push(price);
  performances.push(performance);
  localStorage.setItem("companies", JSON.stringify(companies));
  localStorage.setItem("prices", JSON.stringify(prices));
  localStorage.setItem("performances", JSON.stringify(performances));
}

function getStockInfo(stock, name) {
  gStockSymbol = stock;
  gStockName = name;
  var name = unescape(name);
  var stockData = [];
  var stockURL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stock}&interval=30min&outputsize=compact&apikey=${key}`
  $.ajax({
    url: stockURL,
    method: "GET"
  }).then(function (resp) {
    if (resp.Note === undefined) {
      $("#company-name").text(`(${stock})  ${name}`);
      for (let i = 0; i < 13; i++) {
        let day = Object.entries(resp["Time Series (30min)"])[i][0];
        let today = Object.entries(resp["Time Series (30min)"])[0][0].split(" ")[0];
        if (day.startsWith(today)) {
          hour = Object.entries(resp["Time Series (30min)"])[i][1];
          stockData.push(Object.entries(hour)[0][1]);
        }
      }
      graph(stockData);
    } else {
      $("#company-name").text("No graph");
    }
  }).catch(function (error) {
    console.log(error.statusText);
  });
}

function graph(data) {
  // data.push(1000);
  var ctx = document.getElementById('graph').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['9AM', '10AM', '11AM', '12AM', '1PM', '2PM', '3PM'],
      datasets: [{
        label: 'Price in U.S. dollar',
        data: data,
        backgroundColor: [
          'rgba(108,	42,	127, 0.75)',
          'rgba(108, 42, 127, 0, 1)',
          'rgba(108, 42, 127, 0, 1)',
          'rgba(108, 42, 127, 0, 1)',
          'rgba(108, 42, 127, 0, 1)',
          'rgba(108, 42, 127, 0, 1)',
          'rgba(108, 42, 127, 0, 1)',
        ],
        borderWidth: 1,
      }]
    }
  });
}

function addToFavorite(item, name) {
  var favorites = [];
  if (item !== null && item !== "") {
    var saved = JSON.parse(localStorage.getItem("favorites"));
    console.log("saved", saved);
    console.log("favorites", favorites);
    if (saved !== null) {
      favorites = saved;
      var exist = false;
      console.log(item);
      for (i in favorites) {
        if (favorites[i].includes(item)) {
          exist = true;
          console.log("item already exist");
        }
      }
      if(!exist){
        favorites.push([item, name]);
        let favoriteCompanies = `<a href="#!" class="collection-item">(${item}) ${name}</a>`
        $("#favorites").append(favoriteCompanies);
      }
    } else {
      favorites.push([item, name]);
      let favoriteCompanies = `<a href="#!" class="collection-item">(${item}) ${name}</a>`
      $("#favorites").append(favoriteCompanies);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));

  }
}


function getFavorites() {
  var favorites = null;
  if(localStorage.getItem("favorites") !== null && localStorage.getItem("favorites") !== ""){
    favorites = JSON.parse(localStorage.getItem("favorites"));
  }
  console.log("favs", favorites);
  if (favorites === null) {
    $(".clearFavorites").css("display", "none");
    console.log("you have not favs");
  } else {
    for (let i in favorites) {
      let favoriteCompanies = `<a href="#!" onclick="getStockInfo('${favorites[i][0]}', '${favorites[i][1]}')" class="collection-item">(${favorites[i][0]}) ${favorites[i][1]}</a>`
      $("#favorites").append(favoriteCompanies);
    }
  }
}

function getSearch(query) {
  $("#search-results").empty();
  $.ajax({
    url: `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${key}`,
    method: "GET"
  }).then(function (resp) {
    console.log(resp);
    for (var i = 0; i < Object.entries(resp.bestMatches).length; i++) {
      let symbol = Object.entries(resp.bestMatches[i])[0][1];
      let name = escape(Object.entries(resp.bestMatches[i])[1][1]);
      $("#search-results").append(`<a href="#!" onclick="getStockInfo('${symbol}','${name}')" class="collection-item">(${symbol}) ${Object.entries(resp.bestMatches[i])[1][1]}</a>`);
    }

  }).catch(function (error) {
    //console.log(error.statusText);
  });
}

$(document).ready(function () {
  getNews();
  getTopThree();
  getStockInfo("DJIA", "Dow Jones Industerial Average");
  getFavorites();
  $("#search-form").on("submit", function (event) {
    event.preventDefault();
    var query = $("#stockSearch").val().trim().toLowerCase();
    if (query !== null && query !== "") {
      getSearch(query);
    }
  });

  $(".clearFavorites").on("click", function () {
    localStorage.removeItem("favorites");
    $("#favorites").empty();
  });

  $(".addFavorite").click(function () {
    addToFavorite(gStockSymbol, gStockName);
  });
});




  // getFavorites("IBM");