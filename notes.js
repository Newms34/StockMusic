var stockDataFull=[];
var stockPriceDelta=[];
var tempo=[];
var freqs=[];
var fullJSON;
var timer;
var currNote=0;
function getStockData(pond){
	//grabs stock data from an inputted stock
	//pond: true if melody. otherwise, tempo
	var symb;
		if (pond){
			symb = document.getElementById('stockInp').value.toUpperCase();
			freqs=[];
		}
		else{
			symb = document.getElementById('stockTInp').value.toUpperCase();
			tempo=[]
		}	
	fullJSON = 'https://www.quandl.com/api/v1/datasets/WIKI/'+symb+'.json?column=4&sort_order=asc&collapse=monthly&trim_start=2012-01-01&trim_end=2014-12-31&auth_token=dx7iVzFYMEyGWQVdsRkz';
	$.getJSON(fullJSON,function(data){
		stockDataFull = data.data;
		//got data, so now parse into key-val pairs
		for (var i=0; i< stockDataFull.length-1; i++){
			stockPriceDelta[i] = stockDataFull[i+1][1] - stockDataFull[i][1];
		}
		//now stockPriceDelta should be list of changes in stock price 
		//standardize & set all vals > 0
		var avg = 0;
		var min = 0;
		for (var i=0;i<stockPriceDelta.length;i++){
			avg += stockPriceDelta[i];
			if (min>stockPriceDelta[i]){
				min = stockPriceDelta[i];//get minimum val for mathythings later
			}
		}
		avg = avg/stockDataFull.length;
		console.log('Data average: '+avg+'\nData min: '+min);
		stockPriceDelta = stockPriceDelta.map(function(num){
			return Math.abs(10*(num-min)/avg);
		});
		if (pond){
			stockPriceDelta.forEach(function(stockPrice){
				var currFreq = Math.floor((0.0000008379*Math.pow(stockPrice,4)) - (0.000346*Math.pow(stockPrice,3)) + (.057*Math.pow(stockPrice,2)) + (2.518*stockPrice)+61.112);
				freqs.push(currFreq);
			})
		}
		else {
			stockPriceDelta.forEach(function(stockPrice){
				var currTime = Math.ceil(stockPrice*3);//do we need to standardize this to median vals?
				tempo.push(currTime);
			})
		}
	});
}

function playData(){
	timer = setTimeout(function(){Note(freqs[currNote],tempo[currNote])},300);

}

function Note(oneFreq, oneTime){
	//in vals: oneFreq = note frequency
	//oneTime = note duration
	var sine1 = T("sin", {freq:oneFreq, mul:0.5});
	T("perc", {r:oneTime}, sine1).on("ended", function() {
	this.pause();
	}).bang().play();
	currNote++
	if (currNote<freqs.length){
		timer = setTimeout(function(){Note(freqs[currNote],tempo[currNote])},300);
	}
}
/*we end up with a list of values from 0 - around 3 or 400 something
this will be passed to our notes list. 

do we wanna impose an upper bound? like, 350?

T("sin",{adjustedStockPriceFreq[i]}).play();

we'll basically do a setTimeout loop thingy, where we stop the previous (Current?) element and then START the next element
we'll also need to graph the input vals (0-350?) to piano arrays.
.bang().play() seems to play one note

EQUATION:

var currFreq = Math.floor((0.0000008379*Math.pow(stockPrice,4)) - (0.000346*Math.pow(stockPrice,3)) + (.057*Math.pow(stockPrice,2)) + (2.518*stockPrice)+61.112)
*/

