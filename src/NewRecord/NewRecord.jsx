import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useForm from '../CustomHooks';
import ArtistCombobox from '../ArtistCombobox/ArtistCombobox';
import axios from '../axios';
import requests from '../requests';
import './NewRecord.css';

function NewRecord(props) {
	const { albums = [] } = props;
	const history = useHistory();
	const { inputs, handleInputChange, handleSubmit, setInputs, error } = useForm();
	const [artists, setArtists] = useState([]);
	const [showNewArtist, setShowNewArtist] = useState(false);
	const [newArtistName, setNewArtistName] = useState('');
	const [newArtistError, setNewArtistError] = useState('');
	const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
	const [pendingSubmitEvent, setPendingSubmitEvent] = useState(null);
	const [artistExistsNotice, setArtistExistsNotice] = useState('');

	useEffect(() => {
		axios.get(requests.postArtistURL).then((res) => setArtists(res.data));
	}, []);

	const handleFormSubmit = (e) => {
		e.preventDefault();
		const duplicate = albums.find(
			(a) =>
				a.title.toLowerCase() === inputs.title.toLowerCase() &&
				String(a.artist_id) === String(inputs.artist_id)
		);
		if (duplicate) {
			setPendingSubmitEvent(e);
			setShowDuplicateWarning(true);
			return;
		}
		handleSubmit(e);
	};

	const handleConfirmDuplicate = () => {
		handleSubmit(pendingSubmitEvent);
		setShowDuplicateWarning(false);
	};

	const handleAddArtist = () => {
		const trimmed = newArtistName.trim();
		if (!trimmed) return;

		const existing = artists.find(
			(a) => a.artist.toLowerCase() === trimmed.toLowerCase()
		);

		if (existing) {
			setInputs((prev) => ({ ...prev, artist_id: String(existing.id) }));
			setShowNewArtist(false);
			setNewArtistName('');
			setNewArtistError('');
			setArtistExistsNotice(`${existing.artist} already exists — selected.`);
			setTimeout(() => setArtistExistsNotice(''), 3000);
			return;
		}

		axios
			.post(requests.postArtistURL, { artist: trimmed })
			.then((res) => {
				setArtists((prev) => [...prev, res.data]);
				setInputs((prev) => ({ ...prev, artist_id: String(res.data.id) }));
				setShowNewArtist(false);
				setNewArtistName('');
				setNewArtistError('');
			})
			.catch(() => setNewArtistError('Something went wrong. Please try again.'));
	};

	return (
		<div className='new-record-page'>
			<h4>New Record</h4>
			<form onSubmit={handleFormSubmit} autoComplete='off'>
				<div className='editInputs'>
					<div>
						<label>Title: </label>
						<input
							required
							className='inputField'
							type='text'
							name='title'
							id='title'
							value={inputs.title}
							onChange={handleInputChange}></input>
					</div>
					<div>
						<label>Artist:</label>
						<ArtistCombobox
							artists={artists}
							value={inputs.artist_id}
							onChange={(id) => setInputs((prev) => ({ ...prev, artist_id: id }))}
						/>
						{!showNewArtist && (
							<button
								type='button'
								className='new-artist-toggle'
								onClick={() => setShowNewArtist(true)}>
								+ New artist
							</button>
						)}
						{artistExistsNotice && (
						<span style={{ fontSize: '0.85rem', color: '#555555', fontFamily: "'Oswald', sans-serif" }}>
							{artistExistsNotice}
						</span>
					)}
					{showNewArtist && (
							<div className='new-artist-form'>
								<input
									autoFocus
									className='inputField'
									type='text'
									placeholder='Artist name'
									value={newArtistName}
									onChange={(e) => {
										const val = e.target.value;
										setNewArtistName(val);
									}}
								/>
								{newArtistError && (
									<span role='alert' className='formError'>{newArtistError}</span>
								)}
								<div className='new-artist-actions'>
									<button
										type='button'
										className='new-artist-btn'
										style={{ marginRight: '8px' }}
										onClick={() => {
											setShowNewArtist(false);
											setNewArtistName('');
											setNewArtistError('');
										}}>
										Cancel
									</button>
									<button
										type='button'
										className='new-artist-btn'
										onClick={handleAddArtist}>
										Add
									</button>
								</div>
							</div>
						)}
					</div>
					<div>
						<label>Genre:</label>
						<input
							className='inputField'
							type='text'
							name='genre'
							id='genre'
							value={inputs.genre}
							onChange={handleInputChange}></input>
					</div>
					<div>
						<label>Label:</label>
						<input
							className='inputField'
							type='text'
							name='label'
							id='label'
							onChange={handleInputChange}></input>
					</div>
					<div>
						<label>Release date:</label>
						<input
							className='inputField'
							type='date'
							name='release_date'
							id='release_date'
							value={inputs.release_date}
							onChange={handleInputChange}></input>
					</div>
					<div>
						<label>Acquired date:</label>
						<input
							className='inputField'
							type='date'
							name='acquired_date'
							id='acquired_date'
							value={inputs.acquired_date}
							onChange={handleInputChange}></input>
					</div>
					<div>
						<label>Photo URL:</label>
						<input
							className='inputField'
							type='text'
							name='photo_url'
							id='photo_url'
							value={inputs.photo_url}
							onChange={handleInputChange}
						></input>
					</div>
					<div>
						<label>Notes:</label>
						<textarea
							className='inputField notes-input'
							name='body'
							id='notes'
							value={inputs.notes}
							onChange={handleInputChange}
						/>
					</div>
				</div>
				{error && (
					<p role='alert' className='formError' style={{ marginTop: '0.5rem' }}>
						{error}
					</p>
				)}
				{showDuplicateWarning ? (
					<div className='duplicate-warning'>
						<p>This album may already be in your collection. Add anyway?</p>
						<div className='duplicate-warning-actions'>
							<button
								type='button'
								className='new-artist-btn'
								style={{ marginRight: '8px' }}
								onClick={() => setShowDuplicateWarning(false)}>
								Cancel
							</button>
							<button
								type='button'
								className='new-artist-btn'
								onClick={handleConfirmDuplicate}>
								Add anyway
							</button>
						</div>
					</div>
				) : (
					<div className='new-record-actions'>
						<button type='button' className='submitButton' onClick={() => history.push('/')}>
							Cancel
						</button>
						<input type='submit' className='submitButton' />
					</div>
				)}
			</form>
		</div>
	);
}

export default NewRecord;
