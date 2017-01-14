import React from 'react';
import axios from 'axios';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import './App.css'
 class App extends React.Component {
 constructor(){
  super();
  this.state = {
    books: {},
    isNewBook: false,
    isEdit: false,
  }
  this.submitBookInfo = this.submitBookInfo.bind(this)
  this.getBooks = this.getBooks.bind(this)
  this.renderBookList = this.renderBookList.bind(this)
  this.renderNewBookForm = this.renderNewBookForm.bind(this)
  this.addNewBook = this.addNewBook.bind(this)
  this.editBook = this.editBook.bind(this)
  this.deleteBook = this.deleteBook.bind(this)
  this.cancelSubmmit = this.cancelSubmmit.bind(this)
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
  console.log(title,author);
  axios.patch(`https://booknote-5d751.firebaseio.com/${this.state.currentBook}.json`, {title, author})
  .then((response)=>{console.log(response);this.getBooks()})
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
      <div key={i}>
      <i className="fa fa-pencil" aria-hidden="true" onClick={()=>{this.editBook(book)}}></i>
      <i className="fa fa-times" aria-hidden="true" onClick={()=>{this.deleteBook(book)}}></i>
      <div><li key={i} onClick={()=>{this.bookClick()}}>
     <p>Title: {this.state.books[book].title}</p> <p id='author'>Author: {this.state.books[book].author}</p></li></div>
      </div>
     )})
    }
  return bookList.reverse();
 }

 bookClick(){
  alert('clicked')
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
  return(
  <div className='bookform-wrapper'>
    <input
    placeholder="Enter book title"
    type="text"
    ref={(input) => { this.titleInput = input; }} />
    <br />
    <br/>
    <input
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
    return (
      <div className='Wrapper'>
        <h1>BookNote</h1>
          <br/>
          {this.addNewBook(this.state.isNewBook)}
          <br/>
          <BookList renderBookList={this.renderBookList} />
      </div>
    );
  }
}

//<BookForm renderNewBookForm={this.renderNewBookForm}
//          submitBookInfo={this.submitBookInfo} />

export default App;
