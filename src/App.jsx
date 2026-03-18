import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useAuth } from '@clerk/react';
import NavBar from './NavBar/NavBar';
import RecordsList from './RecordsList/RecordsList';
import NewRecord from './NewRecord/NewRecord';
import Artists from './Artists/Artists';
import Landing from './Landing/Landing';
import SignInPage from './SignInPage/SignInPage';
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy';
import SearchSort from './SearchSort/SearchSort';
import axiosInstance from './axios';
import requests from './requests';
import './App.css';

function ProtectedRoute({ children, ...rest }) {
	const { isSignedIn, isLoaded } = useAuth();
	if (!isLoaded) return null;
	return (
		<Route {...rest} render={() =>
			isSignedIn ? children : <Redirect to='/' />
		} />
	);
}

function AuthenticatedApp() {
	const [data, setData] = useState([]);
	const [loadError, setLoadError] = useState(false);
	const hasLoadedOnce = React.useRef(false);
	const [show, setShow] = useState(false);
	const [currentRecord, setCurrentRecord] = useState({});
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState('artist_string');
	const [sortAsc, setSortAsc] = useState(true);
	async function getRecords() {
		try {
			const result = await axiosInstance.get(requests.postAlbumURL);
			setData(result.data);
			setLoadError(false);
			hasLoadedOnce.current = true;
		} catch {
			setLoadError(true);
		}
	}

	useEffect(() => {
		getRecords();
	}, []);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') getRecords();
		};
		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
	}, []);

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
				(r.artist_string && r.artist_string.toLowerCase().includes(q)) ||
				(r.songs && r.songs.some((s) => s.title && s.title.toLowerCase().includes(q)))
			);
		})
		.sort((a, b) => {
			if (sortBy === 'date_added') return sortAsc ? a.id - b.id : b.id - a.id;
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
				<Switch>
					<Route path='/records' exact render={() => (
						<>
							{loadError && hasLoadedOnce.current && (
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
					)} />
					<Route path='/records/new' render={() => <NewRecord albums={data} />} />
					<Route path='/artists' render={() => <Artists />} />
				</Switch>
			</main>
		</div>
	);
}

function AppRoutes() {
	const { isSignedIn, isLoaded, getToken } = useAuth();

	useEffect(() => {
		const id = axiosInstance.interceptors.request.use(async (config) => {
			const token = await getToken();
			if (token) config.headers.Authorization = `Bearer ${token}`;
			return config;
		});
		return () => axiosInstance.interceptors.request.eject(id);
	}, [getToken]);

	if (!isLoaded) return null;

	return (
		<Switch>
			<Route path='/' exact render={() =>
				isSignedIn ? <Redirect to='/records' /> : <Landing />
			} />
			<Route path='/sign-in' render={() =>
				isSignedIn ? <Redirect to='/records' /> : <SignInPage />
			} />
			<Route path='/privacy' component={PrivacyPolicy} />
		<ProtectedRoute path='/'>
				<AuthenticatedApp />
			</ProtectedRoute>
		</Switch>
	);
}

function App() {
	return (
		<Router>
			<AppRoutes />
		</Router>
	);
}

export default App;
