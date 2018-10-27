import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Collapse from 'react-collapsed';

class App extends Component {
  static propTypes = {
    test() {}
  };
  static defaultProps = {
    test: ''
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Collapse>
            {({getCollapsibleProps, contentRef, getTogglerProps}) => (
              <React.Fragment>
                <button {...getTogglerProps()}>open</button>
                <div {...getCollapsibleProps()}>
                  <img
                    ref={contentRef}
                    src={logo}
                    className="App-logo"
                    alt="logo"
                  />
                </div>
              </React.Fragment>
            )}
          </Collapse>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
