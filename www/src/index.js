import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'

ReactDOM.render(<App />, document.getElementById('root'));

window.addEventListener('load', function () {
  console.log('WINDOW LOAD loaded finished')
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(
    function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
}
;