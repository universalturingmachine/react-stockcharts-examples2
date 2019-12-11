
import React from 'react';

class ReadFileComponent extends React.Component {
	readFile(file) {
		let fileReader = new FileReader();
		fileReader.onload = () => {
			this.props.setData(fileReader.result);
		};
		fileReader.readAsText(file);
	}
	
	render() {
		return (
			<div>
				Select a text file:
				<input
					type="file"
					id="fileInput"
					onChange={e => this.readFile(e.target.files[0])}
				/>
			</div>
		)
	}
}

export default ReadFileComponent;
