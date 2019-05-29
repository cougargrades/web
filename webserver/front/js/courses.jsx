
import React, { Component } from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('root')
);

document.querySelector('form#search').addEventListener('submit', (event) => {
    event.preventDefault()
    alert('Submitted')
});