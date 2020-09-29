import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      isLoading: false,
      isError: false,  
      isShortlist: false,
      value: '',
      shortlist: [],
      statearray: [{"City":"","District":"","State":""}],  // to add new city
      City: '',
      State:'',
      District:''
       
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangea = this.handleChangea.bind(this);
    this.handleChangeb = this.handleChangeb.bind(this);
    this.handleChangec = this.handleChangec.bind(this);
    this.handleSubmitt = this.handleSubmitt.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  handleChangea(event) {
    this.setState({ City: event.target.value });
  }
  handleChangeb(event) {
    this.setState({ District: event.target.value });
  }
  handleChangec(event) {
    this.setState({ State: event.target.value });
  }


  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  handleSubmitt(event) {
    alert('A city added successfully ');
   console.log(this.state.statearray)
    event.preventDefault();
  }

  deleteRow(id) {                          //for deleting the city
    var array = [...this.state.shortlist]; // make a separate copy of the array
    var index = array.indexOf(id)
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ shortlist: array });
    }

    console.log(this.state.shortlist)
    console.log(index);
    var array1 = [...this.state.users]; // make a separate copy of the array
    var index1 = array1.indexOf(id)
    if (index1 !== -1) {
      array1.splice(index1, 1);
      this.setState({ users: array1 });
    }
    alert('Are you sure you want to delete ' + id.City);
    
  }
 
  deleteShortlisted(id) {                  //for deleting from shortlisted
    var array = [...this.state.shortlist]; // make a separate copy of the array
    var index = array.indexOf(id)
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ shortlist: array });
    }
  }
  additems = (id) => {                     //add city to shortlist
    var row = [...this.state.shortlist];
    var idx = row.findIndex(item => item === id);
    if (idx === -1)
      this.setState({ shortlist: [...this.state.shortlist, id] })
    console.log(this.state.shortlist);
  }
 
  async componentDidMount() {         //fetchind data from given api
    this.setState({ isLoading: true })
    const response = await fetch("https://api.jsonbin.io/b/5f5c76a5302a837e9564b5ca")
    if (response.ok) {
      const user = await response.json();
      console.log(user)
      this.setState({ users: user, isLoading: false })

    }
    else {
      this.setState({ isError: true, isLoading: false })
    }

  }
  renderTableHeader = () => {           //rendering table header
    return Object.keys(this.state.users[0]).map(attr => <th key={attr}>{attr.toUpperCase()}</th>)
  } 
  renderTableRows = () => {             //render the table data
    console.log(this.state.data)
    var sr = 1;
    return this.state.users.filter(user => user.State.toLowerCase().includes(this.state.value.toLowerCase()) ||
      user.District.toLowerCase().includes(this.state.value.toLowerCase()) ||
      user.City.toLowerCase().includes(this.state.value.toLowerCase())).map(userf => {

        return (
          <tr>
            <td>{sr++}</td>
            <td>{userf.City}</td>
            <td>{userf.State}</td>
            <td>{userf.District}</td>
            <td className="bt"><button onClick={() => this.deleteRow(userf)} style={{ color: "red" }} >delete</button></td>
            <td className="bt"><button onClick={() => this.additems(userf)} style={{ color: "green" }}>shortlist</button></td>
          </tr>
        )
      })
  }
  shortlistdata = () => { //to show shortlisted data
    this.setState({ isError: true })
  }

  shortlistdataAll = () => { //to show all data

    this.setState({ isError: false })
  }

  renderTableRowsShortlist = () => { //shortlisted data
    var sr = 1;
    if (this.state.shortlist.length < 1)
      return <div>nothing shortlisted</div>
    return this.state.shortlist.filter(user => user.State.toLowerCase().includes(this.state.value.toLowerCase()) ||
    user.District.toLowerCase().includes(this.state.value.toLowerCase()) ||
    user.City.toLowerCase().includes(this.state.value.toLowerCase())).map(userf => {

      return (
        <tr>
          <td>{sr++}</td>
          <td>{userf.City}</td>
          <td>{userf.State}</td>
          <td>{userf.District}</td>
          <td className="bt"><button onClick={() => this.deleteShortlisted(userf)} style={{ color: "red" }}>remove shortlist</button></td>
        </tr>
      )
    })
  }



  render() {

    const { users, isLoading, isError } = this.state
    if (isLoading) {
      return <div>Loading....</div>
    }
    if (isError) {    // to show shortlisted data
      return <div style={{ background: "skyblue" }}>
        <div className="header">
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
      <input type="text" placeholder="Enter city,district or state" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />

          </form>
          <button onClick={() => this.shortlistdata()}>shortlisted</button>
          <button onClick={() => this.shortlistdataAll()}>All</button>

        </div>
        <div>

        </div>
        <table border="4">
          <thead>
            <tr>
              <td>SR</td> {this.renderTableHeader()}
              <td>ACTION</td>
            </tr>
          </thead>
          <tbody>
            {this.renderTableRowsShortlist()}
          </tbody>
        </table>
      </div>
    }

    return users.length > 0  // to show all data
      ? (
        <div style={{ background: "skyblue" }}>
          <div className="header">
            <form onSubmit={this.handleSubmit}>
              <label>
                Search:
          <input type="text" placeholder="Enter city,district or state" value={this.state.value} onChange={this.handleChange} />
              </label>

            </form>
            <form onSubmit={this.handleSubmitt}>
              <label>
               
          <input type="text" placeholder="Enter city" value={this.state.City} onChange={this.handleChangea} />

          <input type="text" placeholder="Enter district" value={this.state.District} onChange={this.handleChangeb} />
           
          <input type="text" placeholder="Enter state" value={this.state.State} onChange={this.handleChangec} />
              </label>
              <input type="submit" value="Add" />

            </form>
            <button onClick={() => this.shortlistdata()}>shortlisted</button>
            <button onClick={() => this.shortlistdataAll()}>All</button>
          </div>
          <table border="4">
            <thead>
              <tr style={{}}>
                <td>SR</td> {this.renderTableHeader()}
                <td>ACTION</td>
              </tr>
            </thead>
            <tbody>
              {this.renderTableRows()}
            </tbody>
          </table>
        </div>) :
      (
        <div> no user</div>
      )
  }

}
export default App;
