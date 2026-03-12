import React, { useState, useEffect } from 'react';
import useForm from '../CustomHooks';
import axios from '../axios';
import requests from '../requests';
import './NewRecord.css';

function NewRecord(props) {
	const { inputs, handleInputChange, handleSubmit, setInputs } = useForm();
	const [artists, setArtists] = useState([]);
	const [showNewArtist, setShowNewArtist] = useState(false);
	const [newArtistName, setNewArtistName] = useState('');
	const [newArtistError, setNewArtistError] = useState('');

	useEffect(() => {
		axios.get(requests.postArtistURL).then((res) => setArtists(res.data));
	}, []);

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
		<div>
			<br></br>
			<h4>New Record</h4>
			<br></br>
			<form onSubmit={handleSubmit} autoComplete='off'>
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
						<select
							className='inputField'
							id='artist_id'
							value={inputs.artist_id}
							onChange={handleInputChange}>
							<option value=''>Select an artist</option>
							{artists.map((a) => (
								<option key={a.id} value={a.id}>{a.artist}</option>
							))}
						</select>
						{!showNewArtist && (
							<button
								type='button'
								className='new-artist-toggle'
								onClick={() => setShowNewArtist(true)}>
								+ New artist
							</button>
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
						<input
							className='inputField'
							type='text'
							name='body'
							id='notes'
							value={inputs.notes}
							onChange={handleInputChange}
						></input>
					</div>
				</div>
				<input type='submit' className='submitButton' />
			</form>
		</div>
	);
}

export default NewRecord;
