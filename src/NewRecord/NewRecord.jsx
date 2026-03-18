import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useForm from '../CustomHooks';
import ArtistCombobox from '../ArtistCombobox/ArtistCombobox';
import DiscogsSearch from '../DiscogsSearch/DiscogsSearch';
import axios from '../axios';
import requests from '../requests';
import './NewRecord.css';

function NewRecord(props) {
	const { albums = [], onRecordAdded } = props;
	const history = useHistory();
	const { inputs, handleInputChange, setInputs, error: formError } = useForm();
	const [artists, setArtists] = useState([]);
	const [showNewArtist, setShowNewArtist] = useState(false);
	const [newArtistName, setNewArtistName] = useState('');
	const [newArtistError, setNewArtistError] = useState('');
	const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
	const [pendingSubmit, setPendingSubmit] = useState(false);
	const [artistExistsNotice, setArtistExistsNotice] = useState('');
	const [pendingTracks, setPendingTracks] = useState([]);
	const [submitError, setSubmitError] = useState('');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		axios.get(requests.postArtistURL).then((res) => setArtists(res.data));
	}, []);

	const doSubmit = (inputsToSubmit) => {
		setSubmitError('');
		setSubmitting(true);
		const newAlbum = {
			...inputsToSubmit,
			release_date: inputsToSubmit.release_date || null,
			acquired_date: inputsToSubmit.acquired_date || null,
		};
		axios
			.post(requests.postAlbumURL, newAlbum)
			.then((res) => {
				const albumId = res.data.id;
				const artistId = res.data.artist_id;
				if (pendingTracks.length > 0) {
					return Promise.all(
						pendingTracks.map((t) =>
							axios.post(requests.postSongURL, {
								track: t.position || null,
								title: t.title,
								album_id: albumId,
								artist_id: artistId,
							})
						)
					).catch(() => {
						history.push('/records');
						return Promise.reject('tracks_failed');
					});
				}
			})
			.then(() => {
				if (onRecordAdded) onRecordAdded();
				history.push('/records');
			})
			.catch((err) => {
				if (err === 'tracks_failed') return;
				setSubmitting(false);
				setSubmitError('Something went wrong. Please try again.');
			});
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		const duplicate = albums.find(
			(a) =>
				a.title.toLowerCase() === inputs.title.toLowerCase() &&
				String(a.artist_id) === String(inputs.artist_id)
		);
		if (duplicate) {
			setPendingSubmit(true);
			setShowDuplicateWarning(true);
			return;
		}
		doSubmit(inputs);
	};

	const handleDiscogsSelect = async (release) => {
		const rawName = release.artists?.[0]?.name || '';
		const artistName = rawName.replace(/\s*\(\d+\)\s*$/, '').replace(/\s*\(a\)\s*$/, '').trim();
		const matchedArtist = artists.find(
			(a) => a.artist.toLowerCase() === artistName.toLowerCase()
		);
		const primaryImage = release.images?.find((i) => i.type === 'primary')?.uri
			|| release.images?.[0]?.uri
			|| '';

		const tracks = (release.tracklist || []).filter((t) => t.title && t.type_ !== 'heading');
		setPendingTracks(tracks);

		const parsedDate = (() => {
			const r = release.released;
			if (!r) {
				if (release.year) return { release_date: `${release.year}-01-01`, date_precision: 'year' };
				return null;
			}
			if (r.length === 10) {
				const [y, m, d] = r.split('-');
				if (m === '00') return { release_date: `${y}-01-01`, date_precision: 'year' };
				if (d === '00') return { release_date: `${y}-${m}-01`, date_precision: 'month' };
				return { release_date: r, date_precision: 'full' };
			}
			if (r.length === 7) {
				const [y, m] = r.split('-');
				if (m === '00') return { release_date: `${y}-01-01`, date_precision: 'year' };
				return { release_date: `${y}-${m}-01`, date_precision: 'month' };
			}
			if (r.length === 4) return { release_date: `${r}-01-01`, date_precision: 'year' };
			return null;
		})();

		setInputs((prev) => ({
			...prev,
			title: release.title || prev.title,
			genre: release.genres?.[0] || prev.genre,
			label: release.labels?.[0]?.name || prev.label,
			...(parsedDate ? parsedDate : {}),
			photo_url: primaryImage || prev.photo_url,
			...(matchedArtist ? { artist_id: String(matchedArtist.id) } : {}),
		}));

		if (!matchedArtist && artistName) {
			try {
				const res = await axios.post(requests.postArtistURL, { artist: artistName });
				const created = res.data;
				setArtists((prev) => [...prev, created]);
				setInputs((prev) => ({ ...prev, artist_id: String(created.id) }));
				setArtistExistsNotice(`Artist created: ${created.artist}`);
				setTimeout(() => setArtistExistsNotice(''), 3000);
			} catch {
				const existing = artists.find(
					(a) => a.artist.toLowerCase() === artistName.toLowerCase()
				);
				if (existing) {
					setInputs((prev) => ({ ...prev, artist_id: String(existing.id) }));
					setArtistExistsNotice(`${existing.artist} already exists — selected.`);
					setTimeout(() => setArtistExistsNotice(''), 3000);
				} else {
					setNewArtistName(artistName);
					setShowNewArtist(true);
				}
			}
		}
	};

	const handleConfirmDuplicate = () => {
		setShowDuplicateWarning(false);
		setPendingSubmit(false);
		doSubmit(inputs);
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

	const error = submitError || formError;

	return (
		<div className='new-record-page'>
			<h4>New Record</h4>
			<form onSubmit={handleFormSubmit} autoComplete='off'>
				<DiscogsSearch onSelect={handleDiscogsSelect} />
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
							<span style={{ fontSize: '0.85rem', color: '#2a7a2a', fontFamily: "'Oswald', sans-serif" }}>
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
							value={inputs.label}
							onChange={handleInputChange}></input>
					</div>
					<div>
						<label>Release date:</label>
						<div className='field-with-clear'>
							<input
								className='inputField'
								type='date'
								name='release_date'
								id='release_date'
								value={inputs.release_date}
								onChange={handleInputChange}></input>
							{inputs.release_date && (
								<button
									type='button'
									className='search-clear'
									onClick={() => setInputs((p) => ({ ...p, release_date: '' }))}
									aria-label='Clear date'>✕</button>
							)}
						</div>
					</div>
					<div>
						<label>Acquired date:</label>
						<div className='field-with-clear'>
							<input
								className='inputField'
								type='date'
								name='acquired_date'
								id='acquired_date'
								value={inputs.acquired_date}
								onChange={handleInputChange}></input>
							{inputs.acquired_date && (
								<button
									type='button'
									className='search-clear'
									onClick={() => setInputs((p) => ({ ...p, acquired_date: '' }))}
									aria-label='Clear date'>✕</button>
							)}
						</div>
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
							name='notes'
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
								onClick={() => { setShowDuplicateWarning(false); setPendingSubmit(false); }}>
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
						<button type='button' className='submitButton' onClick={() => history.push('/records')}>
							Cancel
						</button>
						<input type='submit' className='submitButton' disabled={submitting} />
					</div>
				)}
			</form>
		</div>
	);
}

export default NewRecord;
