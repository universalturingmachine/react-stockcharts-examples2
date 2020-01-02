import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart';

import ReadFromDbComponent from "./ReadFromDbComponent";

class ChartComponent extends React.Component {
	state = {
		parsedData : ""
	};
	
	setData = data => {
		let parsedData = data;
		this.setState({parsedData});
	};
	
	render() {
		if (this.state.parsedData === "") {
			return <ReadFromDbComponent setData = {this.setData} />;
		}
		else {
			return (
				<Chart data={this.state.parsedData} />
			)
		}
	}
}

render(
	<ChartComponent />,
	document.getElementById("root")
);
