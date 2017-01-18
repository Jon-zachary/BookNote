import React from 'react';
import axios from 'axios';
import moment from 'moment'

export default class NoteView extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      notes:null,
      isAddNote: false,
      isEditNote: false,
    }
    this.renderNotes = this.renderNotes.bind(this);
    this.getNotes = this.getNotes.bind(this);
    this.addNote = this.addNote.bind(this);
    this.cancelNote = this.cancelNote.bind(this);
    this.submitNote = this.submitNote.bind(this);
    this.editNote = this.editNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.renderAddNote = this.renderAddNote.bind(this);
    this.renderEditNote = this.renderEditNote.bind(this);
    this.renderDefault = this.renderDefault.bind(this);
  }


  componentDidMount(){
    this.getNotes();
  }

  //gets notes from current book
  getNotes(){
  axios.get(`https://booknote-5d751.firebaseio.com/${this.props.currentBook}/notes/.json`)
  .then((response) => {
    this.setState({notes:response.data})
    })
  }

  //sets isAddNote to false trigger rendering
  cancelNote(){
  this.setState({isAddNote:false})
 }

 //renders the list of notes for the current book, if there are no notes
 //returns msg that no notes
  renderNotes(){
    let notes;
    if(this.state.notes){
    const noteKeys = Object.keys(this.state.notes);
    notes = noteKeys.map((noteKey,i) =>{
      return(
      <div key={i}>
      <i className="fa fa-times" aria-hidden="true"
      onClick={()=>{this.deleteNote(noteKey)}}></i>
      <i className="fa fa-pencil" aria-hidden="true"
      onClick={()=>{this.editNote(noteKey)}}></i>
      <li className='note-list' key={i}>
      Notes for page {this.state.notes[noteKey].page}<br />
      Last modified: {moment().format('l')}
      </li>
      </div>)
    })}
    if(!notes){
      return (
        <div className='empty-notes'>No notes yet</div>
      )
    }
    return notes;

  }

  //sets state triggers render; adds a timestamp to the note which is rendered
  //in the li
  editNote(noteKey){
    this.setState({isEditNote:true,isAddNote:true,currentNote: noteKey,timeStamp: moment().format('l')})
  }

  //sets state triggers render; adds a timestamp to the note which is rendered
  //in the li
  addNote(){
    this.setState({isAddNote: true,isEditNote:false,timeStamp: moment().format('l')})
  }

  //deletes note and calls getNote to re-render based on new state.
  deleteNote(noteKey){
    axios.delete(`https://booknote-5d751.firebaseio.com/${this.props.currentBook}/notes/${noteKey}.json`)
    .then(()=>{
      this.getNotes();
    })
  }

  //submits a new note with a post call. couldn't get this as compact as
  //in app component, here I use a two submit methods for a new note and
  //edited note instead of one method with a condition
  submitNote(){
    const page  = this.page.value
    const note = this.note.value
    axios.post(`https://booknote-5d751.firebaseio.com/${this.props.currentBook}/notes/.json`,{ page, note})
    .then((response) =>{
      this.getNotes();
      this.cancelNote();
    })
  }


  submitEdit(){
    const page  = this.page.value
    const note = this.note.value
    axios.patch(`https://booknote-5d751.firebaseio.com/${this.props.currentBook}/notes/${this.state.currentNote}.json`,{ page, note})
    .then((response) =>{
      this.getNotes();
      this.cancelNote();
    })
  }


//the following three methods render the view depending on whether there is a new
//note being added, an edited note or the default view. Again it's not as compact
//as in the app component and this code feels too repetetive but I haven't found
//the way to condense it and make it DRY
  renderAddNote(){
      return(
      <div className='note-list'>
      <div className='note-header'>
      <h1>BookNote</h1>
      <h2>{this.props.books[this.props.currentBook].title}</h2>
      <span>
      <button className='add-note-button' onClick={()=>{this.addNote()}}>Add note
      <i className="fa fa-plus fa-lg" aria-hidden="true"></i></button>
      </span>
      </div>
      <div className='list-cancel flex-container'>
      <ul className='note-ul'>
      {this.renderNotes()}
      </ul>
      <button className='cancel-button' onClick={()=>{this.props.cancelSubmit()}}>Back</button>
      </div>
      </div>
      )

  }

  renderDefault(){
    return (
      <div className='flex-container'>
      <div className='noteview-wrapper'>
      <h1>BookNote</h1>
      <h2>{this.props.books[this.props.currentBook].title}</h2>
      <input type='text'
      className='page-input'
      placeholder='Enter page number'
      ref={(input) => { this.page = input; }} />
      <textarea className='noteText'
      placeholder='Enter noteText'
      ref={(input) => { this.note = input; }} />
      <div className='note-buttons'>
      <button className='cancel-book-button' onClick={()=>{this.cancelNote()}}>Cancel</button>
      <button className='submit-book-button' onClick={()=>{this.submitNote()}}>Submit</button>
      </div>
      </div>
      </div>
    );
  }

  renderEditNote(){
    return (
      <div className='flex-container'>
      <div className='noteview-wrapper'>
      <h1>BookNote</h1>
      <h2>{this.props.books[this.props.currentBook].title}</h2>
      <input type='text'
      className='page-input'
      placeholder='Enter page number'
      defaultValue={ this.state.notes[this.state.currentNote].page}
      ref={(input) => { this.page = input; }} />
      <textarea className='noteText'
      placeholder='Enter noteText'
      defaultValue={ this.state.notes[this.state.currentNote].note}
      ref={(input) => { this.note = input; }} />
      <div className='note-buttons'>
      <button className='cancel-book-button' onClick={()=>{this.cancelNote()}}>Cancel</button>
      <button className='submit-book-button' onClick={()=>{this.submitEdit()}}>Submit</button>
      </div>
      </div>
      </div>
    );
  }

  render() {

    if(!this.state.isAddNote){
      return(this.renderAddNote())
  }

    if(!this.state.isEditNote){
      return(this.renderDefault())
  }
    return(this.renderEditNote())
  }

}

//
