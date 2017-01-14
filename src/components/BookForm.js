import React from 'react';

export default class BookForm extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.renderNewBookForm()}
      </div>
    );
  }
}
