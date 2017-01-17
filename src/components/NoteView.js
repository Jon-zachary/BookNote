import React from 'react';
import axios from 'axios';

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
  }


  componentDidMount(){
    this.getNotes();
  }


  getNotes(){
  axios.get(`https://booknote-5d751.firebaseio.com/${this.props.currentBook}/notes/.json`)
  .then((response) => {
    this.setState({notes:response.data})
    })
  }


  cancelNote(){
  this.setState({isAddNote:false})
 }


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
      Notes for page {this.state.notes[noteKey].page}</li>
      </div>)
    })}
    return notes;
  }

  editNote(noteKey){
    this.setState({isEditNote:true,isAddNote:true,currentNote: noteKey})
  }


  addNote(){
    this.setState({isAddNote: true})
  }

  deleteNote(noteKey){
    axios.delete(`https://booknote-5d751.firebaseio.com/${this.props.currentBook}/notes/${noteKey}.json`)
    .then(()=>{
      this.getNotes();
    })
  }

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

  render() {

    if(!this.state.isAddNote){
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
        <ul className='note-ul'>
        {this.renderNotes()}
        <button className='cancel-button' onClick={()=>{this.props.cancelSubmit()}}>Cancel</button>
        </ul>
        </div>
        )
      }

    if(!this.state.isEditNote){
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
      <button onClick={()=>{this.cancelNote()}}>Cancel</button>
      <button onClick={()=>{this.submitNote()}}>Submit</button>
      </div>
      </div>
    );
  }
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
      <button onClick={()=>{this.cancelNote()}}>Cancel</button>
      <button onClick={()=>{this.submitEdit()}}>Submit</button>
      </div>
      </div>
    );
  }

}

//
