import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//import logo from './logo.svg';
import './AppRouter.scss';

function Index() {
  return <h2>Home</h2>;
}

function About() {

  fetch(`${process.env.REACT_APP_API_SERVER}/api/`)
  .then(res => res.json())
  .then(data => console.log(data))

  return (<>
  <h2>About</h2>
  <p>Hello {JSON.stringify(process.env)}</p>
  </>);
}

function Users() {
  return <h2>Users</h2>;
}

function AppRouter() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about/">About</Link>
            </li>
            <li>
              <Link to="/users/">Users</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Index} />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
      </div>
    </Router>
  );
}

export default AppRouter;

