import React, { Component } from 'react'
import ValidationError from '../ValidationError'
import StateContext from '../StateContext'
import './AddNote.css'


class AddNote extends Component {
  static contextType = StateContext;
  constructor(props){
    super(props);
    this.state = {
      error: null
    }
  }

  validateNoteName(value){
    const name = value.trim();
    if (name.length === 0){
      return 'Name of note is required'
    } else {
      return false
    }
  }

  clearError = () => {
    this.setState({
      error: null
    })
  }

  handleSubmit(event){
    event.preventDefault();
    //process input value here
    const noteName = event.target.noteName.value;
    const noteContent = event.target.noteContent.value;
    const noteFolderId = event.target.noteFolder.value;
    console.log('noteFolderId from handleSubmit:', noteFolderId);

    function getCurrentDateTimeMySql() {        
      var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
      var mySqlDT = localISOTime;
      return mySqlDT;
  }
    const noteModified = getCurrentDateTimeMySql();
    
    const error = this.validateNoteName(noteName);

    if (error){
      this.setState({
        error
      })
    } else {
      //submit these values to the server here
      const url = 'http://localhost:9090/notes'
      const options = {
        method: 'POST',
        body: JSON.stringify({
          name: noteName, 
          content: noteContent, 
          folderId: noteFolderId,
          modified: noteModified
        }),
        headers: {'Content-Type' : 'application/json'}
      }
      fetch(url, options)
      .then(res => {
        if (!res.ok){
          throw new Error('Something went wrong, please try again later');
        }
        return res.json();
      })
      .then(note => {
        console.log('Note response from api call:', note);
        this.context.addNote(note)
        this.props.history.push(`/note/${note.id}`)
      })
      .catch(err => console.log(err.message))
    }
  }

  render(){
    const {folders} = this.context;
    const options = folders.map(folder => {
      return <option key={folder.id} value={folder.id}>{folder.name}</option>
    })
    
    return(
      <form className='add-note-form' onSubmit={(event) => this.handleSubmit(event)}>
        <h2>Add a Note</h2>
        <div className='form-group'>
          <label htmlFor='note-name'>Name of Note: </label>
          <input type='text' className='note-name' id='note-name' name='noteName'/>
          {this.state.error && (<ValidationError message={this.state.error} clearError={this.clearError}/>)}
          <div className='textarea-content'>
            <label htmlFor='note-content'>Note content: </label>
            <textarea type='text' className='note-content' id='note-content' name='noteContent' rows='5' columns='5'/>
          </div>
          <label htmlFor='note-folder'>Folder: </label>
          <select id='note-folder' className='note-folder' name='noteFolder'>
            {options}
          </select>
        </div>
        <div className="addnote-button-group">
        <button type="reset" className="addnote-button" onClick={() => this.props.history.goBack()}>
            Cancel
        </button>
        <button type="submit" className="addnote-button" disabled={this.state.error}>
            Save Note
        </button>
       </div>
      </form>
    )
  }
}

export default AddNote;