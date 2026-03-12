// App.js is the main document. Here I'm importing the dependencies I'm going to use.
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, useLocation } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import RecordsList from './RecordsList/RecordsList';
import NewRecord from './NewRecord/NewRecord';
import NewArtist from './NewArtist/NewArtist';
import SearchSort from './SearchSort/SearchSort';
import axios from './axios';
import requests from './requests';
import './App.css';

function AppContent() {
	const [data, setData] = useState([]);
	const [loadError, setLoadError] = useState(false);
	const [show, setShow] = useState(false);
	const [currentRecord, setCurrentRecord] = useState({});
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState('default');
	const [sortAsc, setSortAsc] = useState(true);
	const location = useLocation();

	useEffect(() => {
		async function getRecords() {
			try {
				const result = await axios.get(requests.postAlbumURL);
				setData(result.data);
				setLoadError(false);
			} catch {
				setLoadError(true);
			}
		}
		getRecords();
	}, [location]);

	const handleShow = (record) => {
		setShow(true);
		setCurrentRecord(record);
	};

	const handleClose = () => {
		setShow(false);
		setCurrentRecord({});
	};

	const handleRecordUpdated = (updatedRecord) => {
		setData((prev) =>
			prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
		);
		setCurrentRecord(updatedRecord);
	};

	const handleRecordDeleted = (id) => {
		setData((prev) => prev.filter((r) => r.id !== id));
		handleClose();
	};

	const filteredAndSorted = data
		.filter((r) => {
			if (!searchQuery) return true;
			const q = searchQuery.toLowerCase();
			return (
				(r.title && r.title.toLowerCase().includes(q)) ||
				(r.artist_string && r.artist_string.toLowerCase().includes(q))
			);
		})
		.sort((a, b) => {
			if (sortBy === 'default') return sortAsc ? a.id - b.id : b.id - a.id;
			const aVal = a[sortBy] || '';
			const bVal = b[sortBy] || '';
			if (aVal < bVal) return sortAsc ? -1 : 1;
			if (aVal > bVal) return sortAsc ? 1 : -1;
			return 0;
		});

	return (
		<div className='App'>
			<nav>
				<NavBar />
			</nav>
			<main>
				<Route
					path='/'
					exact
					render={() => (
						<>
							{loadError && (
								<p style={{ textAlign: 'center', padding: '2rem', color: '#b94a48', fontFamily: "'Oswald', sans-serif" }}>
									Could not load records. Please check your connection and try again.
								</p>
							)}
							<SearchSort
								searchQuery={searchQuery}
								onSearchChange={setSearchQuery}
								sortBy={sortBy}
								onSortChange={(val) => { setSortBy(val); setSortAsc(true); }}
								sortAsc={sortAsc}
								onSortDirectionToggle={() => setSortAsc((prev) => !prev)}
							/>
							<RecordsList
								currentRecord={currentRecord}
								show={show}
								records={filteredAndSorted}
								isFiltered={!!searchQuery}
								handleShow={handleShow}
								handleClose={handleClose}
								handleRecordUpdated={handleRecordUpdated}
								handleRecordDeleted={handleRecordDeleted}
							/>
						</>
					)}
				/>
				<Route
					path='/newrecord'
					render={() => <NewRecord albums={data} />}
				/>
				<Route
					path='/newartist'
					render={() => <NewArtist />}
				/>
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
