import React, { Component } from 'react';

import ImgGallery from './ImgGallery'
import CallbackQueue from './CallbackQueue'
import './App.css';

class App extends Component {
  render() {
    return (
      <main className="app-container">
        <header className="header">
          hello
        </header>

        <div className="app-content">
          <div className="app-sidebar">
            <CallbackQueue />
          </div>
          <ImgGallery />
        </div>
      </main>
    );
  }
}

export default App;
