import React from 'react';

export default class BookList extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  render() {
    return (
      <ul className='clearFix'>{this.props.renderBookList()}</ul>
    );
  }
}
