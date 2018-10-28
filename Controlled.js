import React from 'react';
import Collapse from './AnimateHeight';

class Controlled extends React.Component {
  state = {
    height: 0
  };

  handleClick = () =>
    this.setState(({height}) => ({height: height === 0 ? 'auto' : 0}));

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Click</button>
        <Collapse height={this.state.height} duration={1000}>
          {({outerNode, innerNode}) => (
            <div {...outerNode()}>
              <p {...innerNode()}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
            </div>
          )}
        </Collapse>
      </div>
    );
  }
}

export default Controlled;
