import React, { Component } from 'react';

import './App.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
      imageURL: '',
      firstName: '',
      lastName: '',
      updated:'',
      age: '',
      villageId: '',
      villageName: '',
      longitude: '',
      lattitude: '',
      filename:'',
      getvillageId:'',
      getuserId:'',
      apiresponse:''
  
		};

    this.handleFarmerData = this.handleFarmerData.bind(this);
    this.getFarmerData = this.getFarmerData.bind(this);
	}

	handleFarmerData(ev) {
		ev.preventDefault();
    const data = new FormData();
    data.append('firstName', this.firstName.value);
    data.append('lastName', this.lastName.value);
    data.append('farmerId', this.emailId.value);
    data.append('age', this.age.value);
    data.append('villageId', this.villageId.value);
    data.append('villageName', this.villageName.value);
    data.append('longitude', this.longitude.value);
    data.append('latitude', this.lattitude.value);
		data.append('file', this.uploadInput.files[0]);
    data.append('filename', this.filename.value);

		fetch('http://localhost:4000/farmers', {
			method: 'POST',
			body: data
		}).then(response => {
			response.json().then(body => {
        this.setState({ imageURL: `http://localhost:4000/${body.file}` });
			});
		});
  }
  
  getFarmerData(ev) {
		ev.preventDefault();
    if(this.getvillageId.value)
    {
   	fetch('http://localhost:4000/farmers/byvillageId/'+this.getvillageId.value, {
			method: 'GET',
		}).then(response => {
      response.json().then(body => {
        this.setState({ apiresponse: `${JSON.stringify(body)}` });
			});
    });
  }
  if(this.getuserId.value)
  {
    fetch('http://localhost:4000/farmers/byuserId/'+this.getuserId.value, {
			method: 'GET',
		}).then(res => {
			res.json().then(body => {
        this.setState({ apiresponse: `${JSON.stringify(body)}` });
			});
    });
  }
	}

	render() {
		return (
			<div className="App">
				<h1 className="display-3"> Enter Farmer Details</h1>
				<form onSubmit={this.handleFarmerData}>
        <div>
          <label>First Name:</label>
						<input
							ref={ref => {
								this.firstName = ref;
							}}
							type="text"
						/>
        </div>
        <div>
          <label>Last Name:</label>
						<input
							ref={ref => {
								this.lastName = ref;
							}}
							type="text"
						/>
        </div>
        <div>
          <label>User ID:</label>
						<input
							ref={ref => {
								this.emailId = ref;
							}}
							type="text"
						/>
        </div>

        <div>
          <label>Age:</label>
						<input
							ref={ref => {
								this.age = ref;
							}}
							type="text"
						/>
        </div>
        <div>
          <label>Village ID:</label>
						<input
							ref={ref => {
								this.villageId = ref;
							}}
							type="text"
						/>
        </div>
        <div>
          <label>Village Name:</label>
						<input
							ref={ref => {
								this.villageName = ref;
							}}
							type="text"
						/>
        </div>
        <div>
          <label>Longitude:</label>
						<input
							ref={ref => {
								this.longitude = ref;
							}}
							type="text"
						/>
        </div>
        <div>
          <label>Lattitude:</label>
						<input
							ref={ref => {
								this.lattitude = ref;
							}}
							type="text"
						/>
        </div>
					<div>
						<input
							ref={ref => {
								this.uploadInput = ref;
							}}
							type="file"
						/>
					</div>
					<div>
						<input
							ref={ref => {
								this.filename = ref;
							}}
							type="text"
							placeholder="File Name"
						/>
					</div>
					<br />
					<div>
						<button className="btn btn-success">Upload</button>
					</div>
          <hr/>
					<p>Uploaded Image:</p>
					<img src={this.state.imageURL} alt="img" />
				</form>
          <hr/>
              <p> Get Farmer Data </p>
              <form onSubmit={this.getFarmerData}> 
                <div>
                    <input
                  ref={ref => {
                    this.getvillageId = ref;
                  }}
                  type="text"
                />
                  <button className="btn btn-success">Get Farmers By VillageId</button>
                </div>  
                <div>
                    <input
                  ref={ref => {
                    this.getuserId = ref;
                  }}
                  type="text"
                />
                  <button className="btn btn-success">Get Farmers By User ID</button>
                </div>

              <hr/>
                  <div>
                  <p> Response from API</p>
                  <div>
                  <p>{this.state.apiresponse}</p>
                  </div>
                  </div>

              </form>
					
			</div>
		);
	}
}
export default App;
