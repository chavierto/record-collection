import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import useEditRecord from '../EditRecordHook';
import axios from '../axios';
import requests from '../requests';
import './RecordModal.css';

function RecordModal(props) {
	const { currentRecord, handleClose, handleRecordUpdated, handleRecordDeleted } = props;
	const [isEditing, setIsEditing] = useState(false);
	const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
	const [artists, setArtists] = useState([]);
	const titleRef = useRef(null);

	// Reset modal state when a different record is opened
	useEffect(() => {
		setIsEditing(false);
		setIsConfirmingDelete(false);
	}, [currentRecord.id]);

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

	const onSuccess = (updatedRecord) => {
		if (updatedRecord) {
			handleRecordUpdated(updatedRecord);
			setIsEditing(false);
		} else {
			handleRecordDeleted(currentRecord.id);
		}
	};

	const { inputs, handleInputChange, handleUpdate, handleDelete, error } =
		useEditRecord(currentRecord, onSuccess);

	const readView = (
		<>
			<Modal.Body>
				<img
					className='modal-img'
					alt={currentRecord.title}
					src={currentRecord.photo_url}
				/>
				<p>
					<br />
					Artist: {currentRecord.artist_string}
					<br />
					Genre: {currentRecord.genre}
					<br />
					Label: {currentRecord.label}
					<br />
					Release date: {currentRecord.release_date}
					<br />
					Acquired date: {currentRecord.acquired_date}
				</p>
				<p className='note'>{currentRecord.notes}</p>
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
		<form onSubmit={handleUpdate} autoComplete='off'>
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
			</Modal.Body>
			<Modal.Footer style={{ justifyContent: 'space-between' }}>
				<button
					className='modal-btn'
					type='button'
					onClick={() => setIsEditing(false)}>
					Cancel
				</button>
				<button className='modal-btn' type='submit'>
					Save
				</button>
			</Modal.Footer>
		</form>
	);

	return (
		<Modal centered show={props.show} onHide={handleClose}>
			<ModalHeader closeButton>
				<Modal.Title>{currentRecord.title}</Modal.Title>
			</ModalHeader>
			{isEditing ? editView : readView}
		</Modal>
	);
}

export default RecordModal;
