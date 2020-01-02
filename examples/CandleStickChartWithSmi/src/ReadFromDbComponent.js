
import React from 'react';
import getData from "./utils";

class ReadFromDbComponent extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {tradingSymbol: ''};
		
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleChange(event) {
		this.setState({tradingSymbol: event.target.value});
	}
	
	handleSubmit(event) {
		event.preventDefault();
		getData(this.state.tradingSymbol).then(data => this.props.setData(data));
	}
	
	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Trading Symbol:
					<input type="text" value={this.state.tradingSymbol} onChange={this.handleChange} />
				</label>
				<input type="submit" value="Submit" />
			</form>
		);
	}
}

export default ReadFromDbComponent;
