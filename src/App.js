import React from 'react';
import axios from 'axios';
import './App.css'
 class App extends React.Component {
 constructor(){
  super();
  this.state = {
    books: {},
  }
  this.submitBookInfo = this.submitBookInfo.bind(this)
  this.getBooks = this.getBooks.bind(this)
  this.renderBookList = this.renderBookList.bind(this)
 }

 componentDidMount(){
  this.getBooks();
 }
 submitBookInfo() {
  const title = this.titleInput.value;
  const author = this.authorInput.value;
  axios.post('https://booknote-5d751.firebaseio.com/.json',{ title, author })
  .then(()=>{this.getBooks()})
  }

 getBooks(){
  axios.get('https://booknote-5d751.firebaseio.com/.json')
        .then((response) =>{
          this.setState({books: response.data})
        })
      return this.state.books
 }

 renderBookList(){
  let bookList;
  if(this.state.books){
  bookList = Object.keys(this.state.books).map((book,i) => {
     return <li key={i}>{this.state.books[book].title} by {this.state.books[book].author}</li>
  })
}
  return bookList;
 }

  render() {
    return (
      <div>
        <h1>BookNote</h1>
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
          <button  onClick={() =>{this.submitBookInfo(this.bookTitle)}}>Submit</button>
          <br/>
          <br/>
          <ul>{this.renderBookList()}</ul>
      </div>
    );
  }
}


export default App;
