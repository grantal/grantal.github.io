import React, { Component } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import logo from './logo.svg';
import './App.css';
import ThreeScene from './ThreeScene.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.threeScene = React.createRef();
  }

  handleKeyPress = (key) => {
    if(key === 'up'){
      this.threeScene.current.rotateUp();
    }
    if(key === 'down'){
      this.threeScene.current.rotateDown();
    }
  }

  render() {
    return (
      <div>
        <ThreeScene ref={this.threeScene}></ThreeScene>
        <KeyboardEventHandler
          handleKeys={['up', 'down', 'left', 'right']}
          onKeyEvent={this.handleKeyPress} />
      </div>
    );
  }
}

export default App;
