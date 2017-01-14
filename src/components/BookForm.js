import React from 'react';

export default class BookForm extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  render() {
    console.log('bookformfired');
    console.log(this.props.isNewBook);
    return (
      <div>
        {this.props.addNewBook(this.props.isNewBook)}
      </div>
    );
  }
}
