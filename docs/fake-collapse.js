import React from 'react';

export default class Component extends React.Component {
  state = {
    isOpen: false
  };

  handleClick = () => this.setState(({isOpen}) => ({isOpen: !isOpen}));

  render() {
    return (
      <React.Fragment>
        <button onClick={this.handleClick}>Open</button>
        <div
          style={{
            borderRadius: '50%',
            background: 'blue',
            height: this.state.isOpen ? '400px' : 0,
            width: '100%',
            transition: 'height 2000ms cubic-bezier(0.250, 0.460, 0.450, 0.940)'
          }}
        />
      </React.Fragment>
    );
  }
}
