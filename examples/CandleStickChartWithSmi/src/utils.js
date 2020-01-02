import { timeParse } from "d3-time-format";

const parseDate = timeParse("%Y-%m-%dT%H:%M:%S");

function transformElement(element) {
	let outputElement = {
		open  : element.open,
		high  : element.high,
		low   : element.low,
		close : element.close,
		
		volume : element.volume,
		date : parseDate(element.timestamp),
		trading_symbol : element.tradingSymbol
	};
	return outputElement;
}

export default function getData(tradingSymbol) {
	const url = "http://localhost:8080/vr-backend-0.0.1-SNAPSHOT/stockdata/" + tradingSymbol + "?from=2019-12-03&to=2019-12-03";
	
	const data = fetch(url)
		.then(response => response.json())
		.then(data => data.map(transformElement));
	
	return data;
}
