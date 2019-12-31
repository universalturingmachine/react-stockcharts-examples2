

import { csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";

function parseData(parse) {
	return function(d) {
		d.date = parse(d.timestamp);
		
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		
		d.trading_symbol = d.tradingSymbol;
		
		return d;
	};
}

const parseDate = timeParse("%Y-%m-%d");

export default function getData(tradingSymbol) {
	const url = "http://localhost:8080/vr-backend-0.0.1-SNAPSHOT/stockdata/" + tradingSymbol;
	const data = fetch(url)
		.then(response => response.text())
		.then(data => csvParse(data, parseData(parseDate)));
	return data;
}
