import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      isLoading: false,
      isError: false,
      value: '',
      shortlist: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  deleteEmployee(id) {
    console.log(id);
    fetch('https://api.jsonbin.io/b/5f5c76a5302a837e9564b5ca' + id,
      {
        method: 'DELETE',
        credentials: 'same-origin'
      })
      .then(
        res => {
          var employee = [...this.state.users];
          console.log(employee)
          var idx = employee.findIndex(item => item.City === id);
          employee.splice(idx, 1);
          this.setState({ users: employee })
        }
      )
      .catch(err => console.error(err))
  }

  additems(id) {
    this.state.shortlist.push(id);
    console.log(this.state.shortlist);
  }


  async componentDidMount() {
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
  renderTableHeader = () => {
    return Object.keys(this.state.users[0]).map(attr => <th key={attr}>{attr.toUpperCase()}</th>)
  }
  renderTableRows = () => {
    var sr = 1;
    return this.state.users.filter(user => user.State.includes(this.state.value) || user.District.includes(this.state.value)).map(userf => {

      return (
        <tr>
          <td>{sr++}</td>
          <td>{userf.City}</td>
          <td>{userf.State}</td>
          <td>{userf.District}</td>
          <td><button onClick={() => this.deleteEmployee(userf.City)}>delete</button></td>
          <td><button onClick={() => this.additems(userf.City)}>shortlist</button></td>
        </tr>
      )
    })
  }
  shortlistdata = () => {
  var sr=1;
return this.state.shortlist.map(userf =>{
  
  return(
    <tr>
      <td>{sr++}</td>
      <td>{userf.City}</td>
      <td>{userf.State}</td>
      <td>{userf.District}</td>
     
    </tr>
  )
})

  }

  render() {

    const { users, isLoading, isError } = this.state
    if (isLoading) {
      return <div>Loading....</div>
    }
    if (isError) {
      return <div>Error</div>
    }
    return users.length > 0
      ? (
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              Name:
          <input type="text" placeholder="first letter should be capital" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />

          </form>
          <button onClick={this.shortlistdata()}>shortlist</button>
          <table border="4">
            <thead>
              <tr>
               <td>sr</td> {this.renderTableHeader()}
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
