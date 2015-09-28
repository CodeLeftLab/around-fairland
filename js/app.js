$(document).ready(function() {var offset = new Date().getTimezoneOffset();// http://stackoverflow.com/questions/1091372/getting-the-clients-timezone-in-javascript
setInterval(function()	{szpagenum = 1;	document.getElementById("szNumOfPage").innerHTML = szpagenum; szMain();  },15*60*60); // refresh every 1 minute
google.setOnLoadCallback(szMain); } ); 
///////////////////////////////////////////////////////////////
function szMain() {var szpagenum = 1;  var JSONPfeedURL='https://data.sparkfun.com/output/KJ36Y39YrVSZ0Rqxvdqv.json'; // http://phant.io/docs/output/http/
var obj={}; obj[0]=['datetime','timestamp'];obj[1]=['number','temp'];obj[2]=['number','pressure'];
var jsonPData = $.ajax({url: JSONPfeedURL, data: {page: szpagenum}, dataType: 'jsonp', }) // read the data from an external source
.done(function (results) {var elct=0;var eladded=0;var therm1 = 0.0;  var press2 = 0.0; // draw a chart
	var szChartOut = new google.visualization.DataTable(); szChartOut.addColumn(obj[0][0], obj[0][1]); szChartOut.addColumn(obj[1][0], obj[1][1]); szChartOut.addColumn(obj[2][0], obj[2][1]);
	$.each(results, function (i, row) {elct++;therm1 = parseFloat(row.temp)-0.0 .toFixed(1); press2 = parseFloat(row.pressure).toFixed(1);
		var szuse=true; var szdate = new Date(row.timestamp); var szTooOld=new Date('2015-07-23 17:08:53');	if (szdate>szTooOld) {} if (press2-1000<0) {szuse=false;}
		if (szuse==true) {eladded++; szChartOut.addRow([ szdate,  therm1,  press2-1000 ]);} });
	var szLineChartOpts = {height:563,backgroundColor: "rgb(235, 255, 235)" , legend: {position: 'bottom'}, //  vAxes: {0: {logScale: false},  1: {logScale: false, maxValue: 1.5}},
	//legend:{position:'top'}, //  ,
	title: 'Readings from Fairland Park', subtitle: 'updated every 15 minutes', animation: {"startup": true},
	series: {0:{axis: 'temp'}, 1:{axis: 'pressure'}, scaleType:'allfixed' }, 
	axes:{
	y:{ temp: {label: 'Temperature in Celsius'},  pressure: {label: 'milliBars of Pressure above 1000'}  }, 
	x: { 0: {side: 'top', label: 'showing '+elct+ ' readings'} }   
	},
 
	}; 
    var szLineChart = new google.charts.Line($('#szLineChart').get(0));szLineChart.draw(szChartOut, google.charts.Line.convertOptions(szLineChartOpts));
    // Gauges use the first line of data - the latest  
	szThermVal=szChartOut.getFormattedValue(0,1);szPressVal=szChartOut.getFormattedValue(0,2);
	var szGaugeOpts = {width: 150, height: 150, redFrom: 26, redTo: 40,	yellowFrom:-10, yellowTo: 10, greenFrom:18, greenTo:25,minorTicks: 5, max:40, min: -10};
	szDrawGauge(szGaugeOpts,'szGaugeTherm',"\u00B0"+'C',parseFloat(szThermVal)); 
	var szGaugeOpts = {width: 150, height: 150, redFrom: 1027, redTo: 1040,	yellowFrom:1013, yellowTo: 1026, greenFrom:1001, greenTo:1012,minorTicks: 5, max:1040, min: 1001};
	szDrawGauge(szGaugeOpts,'szGaugePress','mBar',parseFloat(szPressVal)+1000);
	szReadDate=szChartOut.getFormattedValue(0,0);document.getElementById("szLastUpdate").innerHTML = szReadDate;
	///////////////////////////////////////////////
	function szDrawGauge(ff_opts,ff_div,ff_labelTop,ff_labelAndVal) {var dataMemory = google.visualization.arrayToDataTable([ ['Label', 'Value'], [ff_labelTop, ff_labelAndVal] ]);
		var chart = new google.visualization.Gauge(document.getElementById(ff_div)); chart.draw(dataMemory, ff_opts);}
}); }