
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

document.querySelector('form#search').addEventListener('submit', (event) => {
    event.preventDefault()
    alert('Submitted')
});