
import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart';
import { csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";

import { TypeChooser } from "react-stockcharts/lib/helper";
import ReadFileComponent from "./ReadFileComponent";

class ChartComponent extends React.Component {
	// componentDidMount() {
	// 	getData().then(data => {
	// 		this.setState({ data })
	// 	})
	// }
	
	state = {
		parsedData : ""
	};
	
	setData = data => {
		let parseDate  = timeParse("%Y-%m-%d %H:%M:%S");
		let parsedData = csvParse(data, parseData(parseDate));
		
		parsedData.sort((a, b) => {
			return a.date.valueOf() - b.date.valueOf();
		});
		
		this.setState({parsedData});
	};
	
	render() {
		if (this.state.parsedData === "") {
			return <ReadFileComponent setData = {this.setData} />;
		}
		else {
			return (
				<TypeChooser>
					{type => <Chart type={type} data={this.state.parsedData}/>}
				</TypeChooser>
			)
		}
	}
}

function parseData(parseDate) {
	return function(d) {
		d.date = parseDate(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;
		
		return d;
	};
}

render(
	<ChartComponent />,
	document.getElementById("root")
);
