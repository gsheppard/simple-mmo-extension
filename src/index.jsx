import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

const navDiv = document.querySelector('#mobile_side_menu + .container-full');
const appDiv = document.createElement('div');
appDiv.setAttribute('id', 'app');
insertAfter(appDiv, navDiv);

ReactDOM.render(<App />, appDiv);

console.log('EXTENSION LOADED');
