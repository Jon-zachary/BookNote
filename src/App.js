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
  this.cancelSubmit = this.cancelSubmit.bind(this)
  this.addNote = this.addNote.bind(this)
 }

 componentDidMount(){
  this.getBooks();
 }

 //function checks state to see if the book is new or being edited,
 //if new it posts book data, if edited it patches it.
 submitBookInfo() {
  const isEdit = this.state.isEdit;
  const title = this.titleInput.value;
  const author = this.authorInput.value;
  this.setState({isNewBook: false})
  if(!isEdit){
  axios.post('https://booknote-5d751.firebaseio.com/.json',{ title, author })
  .then(()=>{this.getBooks()})
  } 
  else {
  axios.patch(`https://booknote-5d751.firebaseio.com/${this.state.currentBook}.json`, {title, author})
  .then(()=>{this.getBooks()})
  }
}

  //gets book data from firebase and sets the state
 getBooks(){
  axios.get('https://booknote-5d751.firebaseio.com/.json')
        .then((response) =>{
          this.setState({books: response.data})
        })
 }

 //maps over the book data in state and returns lis with the data, if there are
 //no books returns msg that says no books yet
 renderBookList(){
  let bookList;
  if(this.state.books){
  bookList = Object.keys(this.state.books).map((book,i) => {
    return (
      <div className='book-container' key={i}>
      <span className='icons'>
      <i className="fa fa-plus" aria-hidden="true"
      onClick={()=>{this.addNote(book)}}>Add/View notes</i>
      <i className="fa fa-pencil" aria-hidden="true"
      onClick={()=>{this.editBook(book)}}>Edit book</i>
      <i className="fa fa-times" aria-hidden="true"
      onClick={()=>{this.deleteBook(book)}}>Delete book</i>
      </span>
      <div><li key={i} className='book-list'>
     <p>Title: {this.state.books[book].title}</p>
     <p id='author'>Author: {this.state.books[book].author}</p></li></div>
      </div>
     )})
    }
    if(bookList===undefined){
      return <p>no books yet</p>
    }
  return bookList.reverse();
 }

 //sets isAddNote var to true and sets a current book in state. State change
 //triggers rendering which is contingent on isAddNote value
 addNote(book){
  this.setState({isAddNote:true,currentBook:book})
 }


//checks the isNewBook var if it's true it renders a form for a new book,
//if it's false it it returns a button to add a new book
addNewBook(isNewBook){
  if(!isNewBook){
  return(
    <button className='new-book-button'
    onClick={()=>{this.setState({isNewBook: true})}}>Add Book
    <i className="fa fa-plus" aria-hidden="true"></i></button>
    )
  } else{
    return this.renderNewBookForm(this.state.isEdit)
  }
}

//renders a form to enter new book data with buttons to submit or cancel
 renderNewBookForm(){
  let currentTitle=''
  let currentAuthor=''
  if(this.state.currentBook){
  currentTitle = this.state.books[this.state.currentBook].title
  currentAuthor = this.state.books[this.state.currentBook].author}
  return(
  <div className='bookform-wrapper'>
    <input
    className='title-input'
    defaultValue={currentTitle}
    placeholder="Enter book title"
    type="text"
    ref={(input) => { this.titleInput = input; }} />
    <input
    className='author-input'
    defaultValue={currentAuthor}
    placeholder="Enter book author"
    type="text"
    ref={(input) => { this.authorInput = input; }} />
    <button  className='submit-book-button' onClick={() =>{this.submitBookInfo()}}>
    <i className="fa fa-plus submit-book" aria-hidden="true"></i>Add Book</button>
    <button className='cancel-book-button' onClick={() => {this.cancelSubmit()}}>
    <i className="fa fa-times cancel-book" aria-hidden="true"></i>Cancel</button>
  </div>
    )
 }

//deletes book and calls getBooks to re-render updated data
deleteBook(book){
  axios.delete(`https://booknote-5d751.firebaseio.com/${book}.json`)
  .then(()=>{
    this.getBooks();
  })

}

//sets isEdit to true triggers rendering contingent on isEdit
editBook(book){
  this.setState({isNewBook:true,isEdit:true,currentBook: book})
}

//triggers rendering contingent on isNewBook and isAddnote, sets currentBook
//to null so renderNewBookForm takes correct default value
cancelSubmit(){
  this.setState({isNewBook:false,isAddNote:false,currentBook:null})
}

  //render method with BookForm,Booklist and NoteView components, the first two
  //just sort of tidy things up but NoteView is a major component
  render() {
    if(!this.state.isAddNote){
    return (
      <div className='flex-container'>
      <div className='Wrapper' >
        <h1>BookNote</h1>
          <BookForm isNewBook={this.state.isNewBook} addNewBook={this.addNewBook} />
          <BookList renderBookList={this.renderBookList} />
      </div>
      </div>
    );
   }
    return(
    <NoteView books={this.state.books}
     currentBook={this.state.currentBook}
     cancelSubmit={this.cancelSubmit}/>
    )

   }

}



export default App;
