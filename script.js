var key= '0IA37F9JE1OFIMZM'
var company = "GSPC"
// wanted companies DJI, NDAQ, GSPC
var queryURL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${company}&apikey=${key}`
// https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=BA&apikey=demo

$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(resp){
  console.log(resp);
  })
