import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
	useSortable,
	arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useEditRecord from '../EditRecordHook';
import ArtistCombobox from '../ArtistCombobox/ArtistCombobox';
import axios from '../axios';
import requests from '../requests';
import './RecordModal.css';

function formatDate(dateStr) {
	if (!dateStr) return null;
	const [year, month, day] = dateStr.split('-').map(Number);
	const date = new Date(year, month - 1, day);
	const monthName = date.toLocaleString('default', { month: 'long' });
	const ordinals = ['th', 'st', 'nd', 'rd'];
	const v = day % 100;
	const suffix = ordinals[(v - 20) % 10] || ordinals[v] || ordinals[0];
	return `${monthName} ${day}${suffix}, ${year}`;
}

function SortableTrackItem({ song, onEdit, onDelete, editingId }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: song.id, disabled: editingId !== null });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.4 : 1,
	};

	const [editTrack, setEditTrack] = useState(String(song.track || ''));
	const [editTitle, setEditTitle] = useState(song.title || '');

	const isEditing = editingId === song.id;

	useEffect(() => {
		if (isEditing) {
			setEditTrack(String(song.track || ''));
			setEditTitle(song.title || '');
		}
	}, [isEditing, song.track, song.title]);

	return (
		<li ref={setNodeRef} style={style} className='tracklist-edit-item'>
			{isEditing ? (
				<>
					<div className='track-edit-inputs'>
						<input
							className='inputField track-num-input'
							type='text'
							value={editTrack}
							onChange={(e) => {
								const val = e.target.value;
								setEditTrack(val);
							}}
						/>
						<input
							className='inputField track-title-input'
							type='text'
							value={editTitle}
							onChange={(e) => {
								const val = e.target.value;
								setEditTitle(val);
							}}
						/>
					</div>
					<div className='track-edit-actions'>
						<button
							type='button'
							className='modal-btn'
							style={{ marginRight: '4px' }}
							onClick={() => onEdit(null, null, null)}>
							Cancel
						</button>
						<button
							type='button'
							className='modal-btn'
							onClick={() => onEdit(song.id, editTrack, editTitle)}>
							Save
						</button>
					</div>
				</>
			) : (
				<>
					<span className='drag-handle' {...listeners} {...attributes}>
						⠿
					</span>
					<span className='track-item-text'>
						{song.track && <span className='track-num'>{song.track}. </span>}
						{song.title}
					</span>
					<div className='track-item-actions'>
						<button
							type='button'
							className='modal-btn track-action-btn'
							onClick={() => onEdit(song.id, null, null)}>
							✎
						</button>
						<button
							type='button'
							className='modal-btn modal-btn-danger track-action-btn'
							onClick={() => onDelete(song.id)}>
							✕
						</button>
					</div>
				</>
			)}
		</li>
	);
}

function RecordModal(props) {
	const { currentRecord, handleClose, handleRecordUpdated, handleRecordDeleted } = props;
	const [isEditing, setIsEditing] = useState(false);
	const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
	const [artists, setArtists] = useState([]);
	const [songs, setSongs] = useState([]);
	const [newTrack, setNewTrack] = useState({ track: '', title: '' });
	const [showAddTrack, setShowAddTrack] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [songError, setSongError] = useState('');
	const titleRef = useRef(null);
	const newTrackTitleRef = useRef(null);

	const sensors = useSensors(useSensor(PointerSensor));

	// Reset modal state when a different record is opened
	useEffect(() => {
		setIsEditing(false);
		setIsConfirmingDelete(false);
		setShowAddTrack(false);
		setNewTrack({ track: '', title: '' });
		setEditingId(null);
		setSongs(currentRecord.songs || []);
	}, [currentRecord.id]);

	// Keep songs in sync when currentRecord updates
	useEffect(() => {
		setSongs(currentRecord.songs || []);
	}, [currentRecord.songs]);

	// Fetch artists when entering edit mode
	useEffect(() => {
		if (isEditing) {
			axios.get(requests.postArtistURL).then((res) => setArtists(res.data));
		}
	}, [isEditing]);

	// Focus title input when edit mode opens
	useEffect(() => {
		if (isEditing && titleRef.current) {
			titleRef.current.focus();
		}
	}, [isEditing]);

	// Focus track title input when add track form opens
	useEffect(() => {
		if (showAddTrack && newTrackTitleRef.current) {
			newTrackTitleRef.current.focus();
		}
	}, [showAddTrack]);

	const onSuccess = (updatedRecord) => {
		if (updatedRecord) {
			handleRecordUpdated(updatedRecord);
			setIsEditing(false);
		} else {
			handleRecordDeleted(currentRecord.id);
		}
	};

	const handleAddSong = (e) => {
		e.preventDefault();
		setSongError('');
		axios
			.post(requests.postSongURL, {
				track: newTrack.track || null,
				title: newTrack.title,
				artist_id: currentRecord.artist_id,
				album_id: currentRecord.id,
			})
			.then((res) => {
				setSongs((prev) => [...prev, res.data]);
				setNewTrack({ track: '', title: '' });
				setShowAddTrack(false);
			})
			.catch(() => setSongError('Could not add track. Please try again.'));
	};

	const handleDeleteSong = (songId) => {
		setSongError('');
		axios.delete(requests.songDetailURL(songId))
			.then(() => {
				setSongs((prev) => prev.filter((s) => s.id !== songId));
			})
			.catch(() => setSongError('Could not delete track. Please try again.'));
	};

	const handleEditSong = (songId, track, title) => {
		if (songId === null) {
			// Cancel
			setEditingId(null);
			return;
		}
		if (track === null && title === null) {
			// Enter edit mode
			setSongError('');
			setEditingId(songId);
			return;
		}
		// Save
		axios
			.patch(requests.songDetailURL(songId), {
				track: track || null,
				title,
			})
			.then((res) => {
				setSongs((prev) =>
					prev.map((s) => (s.id === songId ? { ...s, track: res.data.track, title: res.data.title } : s))
				);
				setEditingId(null);
			})
			.catch(() => setSongError('Could not save track. Please try again.'));
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		setSongs((prev) => {
			const oldIndex = prev.findIndex((s) => s.id === active.id);
			const newIndex = prev.findIndex((s) => s.id === over.id);
			const reordered = arrayMove(prev, oldIndex, newIndex);
			return reordered.map((song, i) => ({ ...song, track: i + 1 }));
		});
	};

	const handleSaveWithReorder = (e) => {
		e.preventDefault();
		const original = currentRecord.songs || [];
		const patches = songs
			.filter((s) => {
				const orig = original.find((o) => o.id === s.id);
				return orig && orig.track !== s.track;
			})
			.map((s) => axios.patch(requests.songDetailURL(s.id), { track: s.track }).catch(() => {}));
		Promise.all(patches).then(() => performUpdate());
	};

	const { inputs, handleInputChange, handleUpdate, performUpdate, handleDelete, error } =
		useEditRecord(currentRecord, onSuccess);

	const currentSongs = currentRecord.songs || [];
	const songOrderChanged = songs.some(
		(s, i) => !currentSongs[i] || s.id !== currentSongs[i].id
	);

	const isDirty =
		inputs.title !== (currentRecord.title || '') ||
		String(inputs.artist_id) !== String(currentRecord.artist_id || '') ||
		inputs.genre !== (currentRecord.genre || '') ||
		inputs.label !== (currentRecord.label || '') ||
		inputs.release_date !== (currentRecord.release_date || '') ||
		inputs.acquired_date !== (currentRecord.acquired_date || '') ||
		inputs.photo_url !== (currentRecord.photo_url || '') ||
		inputs.notes !== (currentRecord.notes || '') ||
		songOrderChanged;

	const handleModalClose = () => {
		if (isEditing && isDirty) return;
		if (isEditing) {
			setIsEditing(false);
			setSongs(currentRecord.songs || []);
			setEditingId(null);
			return;
		}
		handleClose();
	};

	const readView = (
		<>
			<Modal.Body>
				{currentRecord.photo_url && (
					<img
						className='modal-img'
						alt={currentRecord.title}
						src={currentRecord.photo_url}
					/>
				)}
				<div className='modal-details'>
					{currentRecord.artist_string && (
						<p>Artist: {currentRecord.artist_string}</p>
					)}
					{currentRecord.genre && (
						<p>Genre: {currentRecord.genre}</p>
					)}
					{currentRecord.label && (
						<p>Label: {currentRecord.label}</p>
					)}
					{currentRecord.release_date && (
						<p>Release date: {formatDate(currentRecord.release_date)}</p>
					)}
					{currentRecord.acquired_date && (
						<p>Acquired date: {formatDate(currentRecord.acquired_date)}</p>
					)}
					{currentRecord.notes && (
						<p className='note'>{currentRecord.notes}</p>
					)}
				</div>
				{songs.length > 0 && (
					<div className='tracklist'>
						<h6 className='tracklist-title'>Tracklist</h6>
						<ol className='tracklist-items'>
							{songs.map((song) => (
								<li key={song.id} className='tracklist-item'>
									{song.track && <span className='track-num'>{song.track}. </span>}
									{song.title}
								</li>
							))}
						</ol>
					</div>
				)}
			</Modal.Body>
			<Modal.Footer style={{ justifyContent: 'space-between' }}>
				{isConfirmingDelete ? (
					<>
						<span>Delete <strong>{currentRecord.title}</strong>? This cannot be undone.</span>
						<div>
							<button
								className='modal-btn'
								onClick={() => setIsConfirmingDelete(false)}
								style={{ marginRight: '8px' }}>
								Cancel
							</button>
							<button className='modal-btn modal-btn-danger' onClick={handleDelete}>
								Yes, delete
							</button>
						</div>
					</>
				) : (
					<>
						<button className='modal-btn' onClick={() => setIsEditing(true)}>
							Edit
						</button>
						<button
							className='modal-btn modal-btn-danger'
							onClick={() => setIsConfirmingDelete(true)}>
							Delete
						</button>
					</>
				)}
			</Modal.Footer>
		</>
	);

	const editView = (
		<form onSubmit={handleSaveWithReorder} autoComplete='off'>
			<Modal.Body>
				{error && (
					<p role='alert' style={{ color: '#b94a48', fontWeight: 'bold' }}>
						{error}
					</p>
				)}
				<div>
					<label htmlFor='title'>Title:</label>
					<input
						required
						ref={titleRef}
						className='inputField'
						type='text'
						id='title'
						value={inputs.title}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label htmlFor='artist_id'>Artist:</label>
					<ArtistCombobox
						artists={artists}
						value={inputs.artist_id}
						onChange={(id) => handleInputChange({ target: { id: 'artist_id', value: id } })}
					/>
				</div>
				<div>
					<label htmlFor='genre'>Genre:</label>
					<input
						className='inputField'
						type='text'
						id='genre'
						value={inputs.genre}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label htmlFor='label'>Label:</label>
					<input
						className='inputField'
						type='text'
						id='label'
						value={inputs.label}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label htmlFor='release_date'>Release date:</label>
					<input
						className='inputField'
						type='date'
						id='release_date'
						value={inputs.release_date || ''}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label htmlFor='acquired_date'>Acquired date:</label>
					<input
						className='inputField'
						type='date'
						id='acquired_date'
						value={inputs.acquired_date || ''}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label htmlFor='photo_url'>Photo URL:</label>
					<input
						className='inputField'
						type='text'
						id='photo_url'
						value={inputs.photo_url}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label htmlFor='notes'>Notes:</label>
					<input
						className='inputField'
						type='text'
						id='notes'
						value={inputs.notes}
						onChange={handleInputChange}
					/>
				</div>

				<div className='tracklist-edit'>
					<h6 className='tracklist-title'>Tracklist</h6>
					{songError && (
						<p role='alert' style={{ color: '#b94a48', fontFamily: "'Oswald', sans-serif", fontWeight: 'bold', margin: '0.25rem 0' }}>
							{songError}
						</p>
					)}
					{songs.length > 0 && (
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}>
							<SortableContext
								items={songs.map((s) => s.id)}
								strategy={verticalListSortingStrategy}>
								<ul className='tracklist-edit-items'>
									{songs.map((song) => (
										<SortableTrackItem
											key={song.id}
											song={song}
											onEdit={handleEditSong}
											onDelete={handleDeleteSong}
											editingId={editingId}
										/>
									))}
								</ul>
							</SortableContext>
						</DndContext>
					)}
					{showAddTrack ? (
						<div className='add-track-form'>
							<input
								className='inputField track-num-input'
								type='text'
								placeholder='#'
								value={newTrack.track}
								onChange={(e) => {
									const val = e.target.value;
									setNewTrack((t) => ({ ...t, track: val }));
								}}
							/>
							<input
								ref={newTrackTitleRef}
								className='inputField'
								type='text'
								placeholder='Track title'
								value={newTrack.title}
								onChange={(e) => {
									const val = e.target.value;
									setNewTrack((t) => ({ ...t, title: val }));
								}}
							/>
							<div className='add-track-actions'>
								<button
									type='button'
									className='modal-btn'
									style={{ marginRight: '8px' }}
									onClick={() => {
										setShowAddTrack(false);
										setNewTrack({ track: '', title: '' });
									}}>
									Cancel
								</button>
								<button
									type='button'
									className='modal-btn'
									onClick={handleAddSong}>
									Add
								</button>
							</div>
						</div>
					) : (
						<button
							type='button'
							className='modal-btn'
							onClick={() => {
								setNewTrack({ track: String(songs.length + 1), title: '' });
								setShowAddTrack(true);
							}}>
							+ Add track
						</button>
					)}
				</div>
			</Modal.Body>
			<Modal.Footer style={{ justifyContent: 'space-between' }}>
				<button
					className='modal-btn'
					type='button'
					onClick={() => {
						setIsEditing(false);
						setSongs(currentRecord.songs || []);
						setEditingId(null);
					}}>
					Cancel
				</button>
				<button className='modal-btn' type='submit'>
					Save
				</button>
			</Modal.Footer>
		</form>
	);

	return (
		<Modal centered show={props.show} onHide={handleModalClose}>
			<ModalHeader closeButton>
				<Modal.Title>{currentRecord.title}</Modal.Title>
			</ModalHeader>
			{isEditing ? editView : readView}
		</Modal>
	);
}

export default RecordModal;
