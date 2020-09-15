// App.js is the main document. Here I'm importing the dependencies I'm going to use.
import React, { useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import RecordsList from './RecordsList/RecordsList';
import NewRecord from './NewRecord/NewRecord';
import axios from './axios';
import './App.css';

function App() {
	const [data, setData] = useState([]);
	const [show, setShow] = useState(false);
	const [showAdd, setShowAdd] = useState(false);
	const [currentRecord, setCurrentRecord] = useState({});
	const [newRecordData, setNewRecordData] = useState({
		title: '',
		artist: '',
		genre: '',
		label: '',
		release_date: '',
		acquired_date: '',
		notes: '',
	});

	useEffect(() => {
		async function getRecords() {
			const result = await axios.get();
			setData(result.data);
			// return result;
		}
		getRecords();
	}, []);

	//handleShow and handleClose for RecordModal
	const handleShow = (record) => {
		setShow(true);
		setCurrentRecord(record);
	};

	const handleClose = () => {
		setShow(false);
		setCurrentRecord({});
	};

	//handleShowNew and handleCloseNew for NewRecordModal
	const handleShowNew = () => {
		setShowAdd(true);
	};

	const handleCloseNew = () => {
		setShowAdd(false);
	};

	return (
		// I'm declaring the <Router> tags to be to create the path to RecordsList, and declaring the RecordsList component.
		<Router>
			<div className='App'>
				<nav>
					<NavBar
						showAdd={showAdd}
						handleShowNew={handleShowNew}
						handleCloseNew={handleCloseNew}
					/>
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
								<NewRecord
									newRecordData={newRecordData}
									setNewRecordData={setNewRecordData}
								/>
							);
						}}></Route>
				</main>
			</div>
		</Router>
	);
}

export default App;
