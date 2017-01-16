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
      return <li className='note-list'
      key={i} onClick={()=>{this.editNote(noteKey)}}>
      Notes for page {this.state.notes[noteKey].page}</li>
    })}
    return notes;
  }

  editNote(noteKey){
    this.setState({isEditNot:true,isAddNote:true})
  }


  addNote(){
    this.setState({isAddNote: true})
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


  render() {
    if(!this.state.isAddNote){
      return(
        <div className='note-list'>
        <h1>BookNote</h1>
        <button onClick={()=>{this.addNote()}}>Add note</button>
        <button onClick={()=>{this.props.cancelSubmit()}}>Cancel</button>
        <ul className='note-ul'>
        {this.renderNotes()}
        </ul>
        </div>
        )
      }


    return (
      <div className='noteview-wrapper'>
      <h1>BookNote</h1>
      <h2>{this.props.books[this.props.currentBook].title}</h2>
      <input type='text'
      className = 'page-input'
      placeholder='Enter page number'
      ref={(input) => { this.page = input; }} />
      <textarea className='noteText'
      placeholder='Enter noteText'
      ref={(input) => { this.note = input; }} />
      <button onClick={()=>{this.cancelNote()}}>Cancel</button>
      <button onClick={()=>{this.submitNote()}}>Submit</button>
      </div>
    );
  }
}
