// App.js is the main document. Here I'm importing the dependencies I'm going to use.

import React, { useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
// import logo from './logo.svg';
import NavBar from './NavBar/NavBar';
import RecordsList from './RecordsList/RecordsList';
import axios from './axios';
import './App.css';

function App() {
	const [data, setData] = useState({
		records: {},
	});

	useEffect(() => {
		async function getRecords() {
			const result = await axios.get();
			setData(result.data);
			return result;
		}
		getRecords();
	}, []);

	return (
		// I'm declaring the <Router> tags to be to create the path to RecordsList, and declaring the RecordsList component.
		<Router>
			<div className='App'>
				<nav>
					<NavBar />
				</nav>
				<main>
					<Route path='/' exact component='RecordsList' />
					<RecordsList records={data.records} />
				</main>
			</div>
		</Router>
	);
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
