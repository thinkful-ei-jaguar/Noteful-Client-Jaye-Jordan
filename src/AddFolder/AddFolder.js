import React, { Component } from 'react'
import ValidationError from '../ValidationError'
import StateContext from '../StateContext'
import './AddFolder.css';

class AddFolder extends Component {
  static contextType = StateContext;
  constructor(props){
    super(props);
    this.state = {
      error: null
    }
  }

  validateFolderName = (value) => {
    const name= value.trim();
    if (name.length === 0){
      return 'Name of folder is required'
    } else {
      return false
    }
  }

  clearError = () => {
    this.setState({
      error: null
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();

    //process input value here
    const folderName = event.target.folderName.value;
    const error = this.validateFolderName(folderName);
    if (error){
      this.setState({
        error
      }) 
    } else {
      //submit these values to the server here
      const url = 'http://localhost:9090/folders';
      const options = {
        method: 'POST',
        body: JSON.stringify({name: folderName}),
        headers: {'Content-Type': 'application/json'}
      }
      fetch(url, options)
      .then(res => {
        if(!res.ok){
          throw new Error('Something went wrong, please try again later');
        }
        return res.json();
      })
      .then(folder => {
        this.context.addFolder(folder)
        //where Router comes into play to push the user to the foler id url
        this.props.history.push(`/folder/${folder.id}`)
      })
      .catch(err => console.log(err.message)) 
    }
  }

  render(){
    
    return(
      <form className='add-folder-form' onSubmit={(event) => this.handleSubmit(event)}>
        <h2>Add a Folder</h2>
        <div className='form-group'>
          <label htmlFor='folder-name'>Name of folder:</label>
          <input type='text' className='folder-name' id='folder-name' name='folderName'/>
          {this.state.error && (<ValidationError message={this.state.error} clearError={this.clearError}/>)}
        </div>
        <div className="addFolder-button-group">
        <button type="reset" className="addFolder-button" onClick={() => this.props.history.goBack()}>
            Cancel
        </button>
        <button type="submit" className="addFolder-button" disabled={this.state.error}>
            Save Folder
        </button>
       </div>
      </form>
    )
  }
}

export default AddFolder;