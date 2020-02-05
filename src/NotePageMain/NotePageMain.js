import React from 'react'
import Note from '../Note/Note'
import ApiContext from '../ApiContext'
import { findNote } from '../notes-helpers'
import './NotePageMain.css'

export default class NotePageMain extends React.Component {
  static defaultProps = {
    match: {
      params: {}
    }
  }
  static contextType = ApiContext

  handleDeleteNote = noteId => {
    this.props.history.push(`/`)
  }

  render() {
    const { notes=[] } = this.context
    const { noteId } = this.props.match.params
    console.log('Notes from context!!!!:', notes);
    console.log('NoteId!!!!:', noteId, typeof(noteId));
    const note = findNote(notes, noteId) || { content: '' }
    
    console.log('Found note!!!', note);
    return (
      <section className='NotePageMain'>
        <Note
          id={note.id}
          name={note.note_name}
          modified={note.modified}
          onDeleteNote={this.handleDeleteNote}
          content={note.content}
          folderId={note.folder_id}
        />
        <div className='NotePageMain__content'>
  
          {note.content.split(/\n \r|\n/).map((para, i) =>
            <p key={i}>{para}</p>
          )}
        </div>
      </section>
    )
  }
}
