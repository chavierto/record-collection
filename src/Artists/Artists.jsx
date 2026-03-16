import React, { useState, useEffect, useRef } from 'react';
import axios from '../axios';
import requests from '../requests';
import './Artists.css';

function Artists() {
	const [artists, setArtists] = useState([]);
	const [loadError, setLoadError] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	const [showAdd, setShowAdd] = useState(false);
	const [newName, setNewName] = useState('');
	const [newPhotoUrl, setNewPhotoUrl] = useState('');
	const [newNotes, setNewNotes] = useState('');
	const [addError, setAddError] = useState('');

	const [editingId, setEditingId] = useState(null);
	const [editName, setEditName] = useState('');
	const [editPhotoUrl, setEditPhotoUrl] = useState('');
	const [editNotes, setEditNotes] = useState('');
	const [editError, setEditError] = useState('');

	const [confirmDeleteId, setConfirmDeleteId] = useState(null);
	const [deleteError, setDeleteError] = useState('');
	const [protectedMessageId, setProtectedMessageId] = useState(null);

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
			.post(requests.postArtistURL, {
				artist: trimmed,
				photo_url: newPhotoUrl || null,
				notes: newNotes || null,
			})
			.then((res) => {
				setArtists((prev) => [...prev, res.data]);
				setNewName('');
				setNewPhotoUrl('');
				setNewNotes('');
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
		setEditPhotoUrl(artist.photo_url || '');
		setEditNotes(artist.notes || '');
		setEditError('');
		setConfirmDeleteId(null);
		setDeleteError('');
		setProtectedMessageId(null);
	};

	const handleEditSave = (id) => {
		const trimmed = editName.trim();
		if (!trimmed) return;
		setEditError('');
		axios
			.patch(requests.artistDetailURL(id), {
				artist: trimmed,
				photo_url: editPhotoUrl || null,
				notes: editNotes || null,
			})
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

	const handleDeleteClick = (artist) => {
		if (artist.album_count > 0) {
			setProtectedMessageId(protectedMessageId === artist.id ? null : artist.id);
			return;
		}
		setConfirmDeleteId(artist.id);
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

	const filtered = artists.filter((a) =>
		a.artist.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className='artists-page'>
			<h4>Artists</h4>

			<div className='artists-toolbar'>
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
								if (e.key === 'Escape') { setShowAdd(false); setNewName(''); setNewPhotoUrl(''); setNewNotes(''); setAddError(''); }
							}}
						/>
						<input
							className='inputField'
							type='text'
							placeholder='Photo URL'
							value={newPhotoUrl}
							onChange={(e) => setNewPhotoUrl(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
								if (e.key === 'Escape') { setShowAdd(false); setNewName(''); setNewPhotoUrl(''); setNewNotes(''); setAddError(''); }
							}}
						/>
						<input
							className='inputField'
							type='text'
							placeholder='Notes'
							value={newNotes}
							onChange={(e) => setNewNotes(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
								if (e.key === 'Escape') { setShowAdd(false); setNewName(''); setNewPhotoUrl(''); setNewNotes(''); setAddError(''); }
							}}
						/>
						{addError && <span role='alert' className='formError'>{addError}</span>}
						<div className='artist-form-actions'>
							<button
								type='button'
								className='artist-btn'
								onClick={() => { setShowAdd(false); setNewName(''); setNewPhotoUrl(''); setNewNotes(''); setAddError(''); }}>
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
						className='artist-btn'
						onClick={() => setShowAdd(true)}>
						+ Add Artist
					</button>
				)}

				<div className='artist-search-wrapper'>
					<input
						className='inputField artist-search'
						type='text'
						placeholder='Search artists...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Escape') setSearchQuery('');
						}}
					/>
					{searchQuery && (
						<button
							type='button'
							className='artist-search-clear'
							onClick={() => setSearchQuery('')}
							aria-label='Clear search'>
							✕
						</button>
					)}
				</div>
			</div>

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
				{filtered.map((artist) => (
					<li key={artist.id} className='artist-list-item'>
						<div className='artist-row'>
							{editingId === artist.id ? (
								<>
									<div className='artist-edit-form'>
										<input
											ref={editInputRef}
											className='inputField'
											type='text'
											placeholder='Name'
											value={editName}
											onChange={(e) => setEditName(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === 'Escape') handleEditCancel();
											}}
										/>
										<input
											className='inputField'
											type='text'
											placeholder='Photo URL'
											value={editPhotoUrl}
											onChange={(e) => setEditPhotoUrl(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === 'Escape') handleEditCancel();
											}}
										/>
										<input
											className='inputField'
											type='text'
											placeholder='Notes'
											value={editNotes}
											onChange={(e) => setEditNotes(e.target.value)}
											onKeyDown={(e) => {
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
										<div
											className='artist-delete-wrapper'
											data-tooltip={artist.album_count > 0 ? "Remove this artist's albums before deleting" : undefined}>
											<button
												type='button'
												className={`artist-btn artist-btn-danger${artist.album_count > 0 ? ' artist-btn-protected' : ''}`}
												onClick={() => handleDeleteClick(artist)}>
												Delete
											</button>
										</div>
									</div>
								</>
							)}
						</div>
						{protectedMessageId === artist.id && (
							<p className='artist-protected-msg'>
								{artist.artist} has {artist.album_count} {artist.album_count === 1 ? 'album' : 'albums'} and can't be deleted. Remove their albums first.
							</p>
						)}
					</li>
				))}
				{filtered.length === 0 && !loadError && (
					<li className='artist-empty'>
						{searchQuery ? 'No artists match your search.' : 'No artists yet.'}
					</li>
				)}
			</ul>
		</div>
	);
}

export default Artists;
