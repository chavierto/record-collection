import React, { useState, useEffect, useRef } from 'react';
import axios from '../axios';
import requests from '../requests';
import './Artists.css';

function Artists() {
	const [artists, setArtists] = useState([]);
	const [loadError, setLoadError] = useState(false);

	const [showAdd, setShowAdd] = useState(false);
	const [newName, setNewName] = useState('');
	const [addError, setAddError] = useState('');

	const [editingId, setEditingId] = useState(null);
	const [editName, setEditName] = useState('');
	const [editError, setEditError] = useState('');

	const [confirmDeleteId, setConfirmDeleteId] = useState(null);
	const [deleteError, setDeleteError] = useState('');

	const addInputRef = useRef(null);
	const editInputRef = useRef(null);

	useEffect(() => {
		axios
			.get(requests.postArtistURL)
			.then((res) => setArtists(res.data))
			.catch(() => setLoadError(true));
	}, []);

	useEffect(() => {
		if (showAdd && addInputRef.current) addInputRef.current.focus();
	}, [showAdd]);

	useEffect(() => {
		if (editingId !== null && editInputRef.current) editInputRef.current.focus();
	}, [editingId]);

	const handleAdd = () => {
		const trimmed = newName.trim();
		if (!trimmed) return;
		setAddError('');
		axios
			.post(requests.postArtistURL, { artist: trimmed })
			.then((res) => {
				setArtists((prev) => [...prev, res.data]);
				setNewName('');
				setShowAdd(false);
			})
			.catch((err) => {
				if (err.response?.status === 400 && err.response.data.artist) {
					setAddError(err.response.data.artist[0]);
				} else {
					setAddError('Something went wrong. Please try again.');
				}
			});
	};

	const handleEditStart = (artist) => {
		setEditingId(artist.id);
		setEditName(artist.artist);
		setEditError('');
		setConfirmDeleteId(null);
		setDeleteError('');
	};

	const handleEditSave = (id) => {
		const trimmed = editName.trim();
		if (!trimmed) return;
		setEditError('');
		axios
			.patch(requests.artistDetailURL(id), { artist: trimmed })
			.then((res) => {
				setArtists((prev) => prev.map((a) => (a.id === id ? res.data : a)));
				setEditingId(null);
			})
			.catch((err) => {
				if (err.response?.status === 400 && err.response.data.artist) {
					setEditError(err.response.data.artist[0]);
				} else {
					setEditError('Something went wrong. Please try again.');
				}
			});
	};

	const handleEditCancel = () => {
		setEditingId(null);
		setEditError('');
	};

	const handleDelete = (id) => {
		setDeleteError('');
		axios
			.delete(requests.artistDetailURL(id))
			.then(() => {
				setArtists((prev) => prev.filter((a) => a.id !== id));
				setConfirmDeleteId(null);
			})
			.catch((err) => {
				if (err.response?.status === 409) {
					setDeleteError(
						err.response.data.detail || 'Cannot delete this artist.'
					);
				} else {
					setDeleteError('Something went wrong. Please try again.');
				}
				setConfirmDeleteId(null);
			});
	};

	return (
		<div className='artists-page'>
			<h4>Artists</h4>

			{showAdd ? (
				<div className='artist-add-form'>
					<input
						ref={addInputRef}
						className='inputField'
						type='text'
						placeholder='Artist name'
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
							if (e.key === 'Escape') { setShowAdd(false); setNewName(''); setAddError(''); }
						}}
					/>
					{addError && <span role='alert' className='formError'>{addError}</span>}
					<div className='artist-form-actions'>
						<button
							type='button'
							className='artist-btn'
							onClick={() => { setShowAdd(false); setNewName(''); setAddError(''); }}>
							Cancel
						</button>
						<button type='button' className='artist-btn' onClick={handleAdd}>
							Add
						</button>
					</div>
				</div>
			) : (
				<button
					type='button'
					className='artist-btn artist-btn-add'
					onClick={() => setShowAdd(true)}>
					+ Add Artist
				</button>
			)}

			{loadError && (
				<p className='formError' style={{ marginTop: '1rem' }}>
					Could not load artists. Please check your connection and try again.
				</p>
			)}
			{deleteError && (
				<p role='alert' className='formError' style={{ marginTop: '1rem' }}>
					{deleteError}
				</p>
			)}

			<ul className='artist-list'>
				{artists.map((artist) => (
					<li key={artist.id} className='artist-row'>
						{editingId === artist.id ? (
							<>
								<div className='artist-row-main'>
									<input
										ref={editInputRef}
										className='inputField artist-edit-input'
										type='text'
										value={editName}
										onChange={(e) => setEditName(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === 'Enter') { e.preventDefault(); handleEditSave(artist.id); }
											if (e.key === 'Escape') handleEditCancel();
										}}
									/>
									{editError && (
										<span role='alert' className='formError'>{editError}</span>
									)}
								</div>
								<div className='artist-row-actions'>
									<button type='button' className='artist-btn' onClick={handleEditCancel}>
										Cancel
									</button>
									<button type='button' className='artist-btn' onClick={() => handleEditSave(artist.id)}>
										Save
									</button>
								</div>
							</>
						) : confirmDeleteId === artist.id ? (
							<>
								<div className='artist-row-main'>
									<span className='artist-confirm-text'>
										Delete <strong>{artist.artist}</strong>? This cannot be undone.
									</span>
								</div>
								<div className='artist-row-actions'>
									<button
										type='button'
										className='artist-btn'
										onClick={() => setConfirmDeleteId(null)}>
										Cancel
									</button>
									<button
										type='button'
										className='artist-btn artist-btn-danger'
										onClick={() => handleDelete(artist.id)}>
										Yes, delete
									</button>
								</div>
							</>
						) : (
							<>
								<div className='artist-row-main'>
									<span className='artist-name'>{artist.artist}</span>
									<span className='artist-album-count'>
										{artist.album_count} {artist.album_count === 1 ? 'album' : 'albums'}
									</span>
								</div>
								<div className='artist-row-actions'>
									<button
										type='button'
										className='artist-btn'
										onClick={() => handleEditStart(artist)}>
										Edit
									</button>
									<button
										type='button'
										className='artist-btn artist-btn-danger'
										disabled={artist.album_count > 0}
										title={artist.album_count > 0 ? "Remove this artist's albums before deleting" : ''}
										onClick={() => setConfirmDeleteId(artist.id)}>
										Delete
									</button>
								</div>
							</>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

export default Artists;
