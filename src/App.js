import React from 'react';
import axios from 'axios';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import NoteView from './components/NoteView';
import './App.css'
 class App extends React.Component {
 constructor(){
  super();
  this.state = {
    books: {},
    isNewBook: false,
    isEdit: false,
    isAddNote: false,
    currentBook:undefined,
  }
  this.submitBookInfo = this.submitBookInfo.bind(this)
  this.getBooks = this.getBooks.bind(this)
  this.renderBookList = this.renderBookList.bind(this)
  this.renderNewBookForm = this.renderNewBookForm.bind(this)
  this.addNewBook = this.addNewBook.bind(this)
  this.editBook = this.editBook.bind(this)
  this.deleteBook = this.deleteBook.bind(this)
  this.cancelSubmmit = this.cancelSubmmit.bind(this)
  this.addNote = this.addNote.bind(this)
  this.cancelNote = this.cancelNote.bind(this)
 }

 componentDidMount(){
  this.getBooks();
 }

 submitBookInfo() {
  const isEdit = this.state.isEdit;
  this.setState({isNewBook: false})
  if(!isEdit){
  const title = this.titleInput.value;
  const author = this.authorInput.value;

  axios.post('https://booknote-5d751.firebaseio.com/.json',{ title, author })
  .then(()=>{this.getBooks()})
} else {
  const title = this.titleInput.value;
  const author = this.authorInput.value;

  axios.patch(`https://booknote-5d751.firebaseio.com/${this.state.currentBook}.json`, {title, author})
  .then(()=>{this.getBooks()})
}

  }

 getBooks(){
  axios.get('https://booknote-5d751.firebaseio.com/.json')
        .then((response) =>{
          this.setState({books: response.data})
        })
 }

 renderBookList(){
  let bookList;
  if(this.state.books){
  bookList = Object.keys(this.state.books).map((book,i) => {
    return (
      <div className='book-container' key={i}>
      <span className='icons'>
      <i className="fa fa-plus" aria-hidden="true"
      onClick={()=>{this.addNote(book)}}></i>
      <i className="fa fa-pencil" aria-hidden="true"
      onClick={()=>{this.editBook(book)}}></i>
      <i className="fa fa-times" aria-hidden="true"
      onClick={()=>{this.deleteBook(book)}}></i>
      </span>
      <div><li key={i} className='book-list'>
     <p>Title: {this.state.books[book].title}</p>
     <p id='author'>Author: {this.state.books[book].author}</p></li></div>
      </div>
     )})
    }
  return bookList.reverse();
 }

 addNote(book){
  this.setState({isAddNote:true,currentBook:book})

 }

 cancelNote(){
  this.setState({isAddNote:false})
 }


addNewBook(isNewBook){
  if(!isNewBook){
  return(
    <button id="newBookButton"
    onClick={()=>{this.setState({isNewBook: true})}}>Add New Book</button>
    )
  } else{
    return this.renderNewBookForm(this.state.isEdit)
  }
}

 renderNewBookForm(isEdit){
  let currentTitle=''
  let currentAuthor=''
  if(this.state.currentBook){
  currentTitle = this.state.books[this.state.currentBook].title
  currentAuthor = this.state.books[this.state.currentBook].author}
  return(
  <div className='bookform-wrapper'>
    <input
    defaultValue={currentTitle}
    placeholder="Enter book title"
    type="text"
    ref={(input) => { this.titleInput = input; }} />
    <br />
    <br/>
    <input
    defaultValue={currentAuthor}
    placeholder="Enter book author"
    type="text"
    ref={(input) => { this.authorInput = input; }} />
    <br/>
    <br/>
    <button  onClick={() =>{this.submitBookInfo()}}>Submit</button>
    <button onClick={() => {this.cancelSubmmit()}}>Cancel</button>
  </div>

    )
 }

deleteBook(book){
  axios.delete(`https://booknote-5d751.firebaseio.com/${book}.json`)
  .then(()=>{
    this.getBooks();
  })

}

editBook(book){
  this.setState({isNewBook:true,isEdit:true,currentBook: book})
}

cancelSubmmit(){
  this.setState({isNewBook:false})
}

  render() {
    if(!this.state.isAddNote){
    return (
      <div className='Wrapper'>
        <h1>BookNote</h1>
          <br/>
          {this.addNewBook(this.state.isNewBook)}
          <br/>
          <BookList renderBookList={this.renderBookList} />
      </div>
    );
   } else {
    return(
    <NoteView cancelNote={this.cancelNote} books={this.state.books}
     currentBook={this.state.currentBook}/>
    )
  }
   }

}



export default App;
