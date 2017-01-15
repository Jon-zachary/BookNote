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
    }
    this.renderNotes = this.renderNotes.bind(this);
    this.getNotes = this.getNotes.bind(this);
    this.addNote = this.addNote.bind(this);
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

  renderNotes(){
    let notes;
    if(this.state.notes){
    const noteKeys = Object.keys(this.state.notes);
    notes = noteKeys.map((noteKey,i) =>{
      return <li key={i} onClick={()=>{this.addNote()}}> {this.state.notes[noteKey].note.page}</li>
    })}

    return notes;
  }

  addNote(){
    this.setState({isAddNote: true})
  }

  render() {
    if(!this.state.isAddNote){
      return(
        <div className='note-list'>
        <ul>
        {this.renderNotes()}
        <button onClick={()=>{this.addNote()}}>Add note</button>
        </ul>
        </div>
        )
    }
    return (
      <div className='noteview-wrapper'>
      <h1>BookNote</h1>
      <h2>{this.props.books[this.props.currentBook].title}</h2>
      <input type='text' placeholder='Enter page number' />
      <textarea className='noteText' placeholder='Enter noteText' />
      <button onClick={()=>{this.props.cancelNote()}}>Cancel</button>
      </div>
    );
  }
}
