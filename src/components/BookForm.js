import React from 'react';

export default class BookForm extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  render() {
    return (
      <div>
        {this.props.addNewBook(this.props.isNewBook)}
      </div>
    );
  }
}
