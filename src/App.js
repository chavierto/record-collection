// App.js is the main document. Here I'm importing the dependencies I'm going to use.
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, useLocation } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import RecordsList from './RecordsList/RecordsList';
import NewRecord from './NewRecord/NewRecord';
import NewArtist from './NewArtist/NewArtist';
import axios from './axios';
import requests from './requests';
import './App.css';

function AppContent() {
	const [data, setData] = useState([]);
	const [show, setShow] = useState(false);
	const [currentRecord, setCurrentRecord] = useState({});
	const location = useLocation();

	useEffect(() => {
		async function getRecords() {
			const result = await axios.get(requests.postAlbumURL);
			setData(result.data);
		}
		getRecords();
	}, [location]);

	//handleShow and handleClose for RecordModal
	const handleShow = (record) => {
		setShow(true);
		setCurrentRecord(record);
	};

	const handleClose = () => {
		setShow(false);
		setCurrentRecord({});
	};

	return (
		<div className='App'>
			<nav>
				<NavBar />
			</nav>
			<main>
				<Route
					path='/'
					exact
					render={(props) => {
						return (
							<RecordsList
								currentRecord={currentRecord}
								show={show}
								records={data}
								handleShow={handleShow}
								handleClose={handleClose}
							/>
						);
					}}
				/>
				<Route
					path='/newrecord'
					render={(props) => {
						return (
							<NewRecord />
						);
					}}></Route>
				<Route path='/newartist' render={(props) => {
					return (
						<NewArtist />
					);
				}}></Route>
			</main>
		</div>
	);
}

function App() {
	return (
		<Router>
			<AppContent />
		</Router>
	);
}

export default App;
