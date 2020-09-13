import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
// import logo from './logo.svg';
import NavBar from './NavBar/NavBar';
import RecordsList from './RecordsList/RecordsList'
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			records: {},
		};
	}

	render() {
		return (
			<Router>
				<div className='App'>
					<nav>
						<NavBar />
					</nav>
					<main>
						<Route path='/' exact component='RecordsList' />
					</main>
				</div>
			</Router>
		);
	}
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
