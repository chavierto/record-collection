import React from 'react';
import Modal from 'react-bootstrap/Modal';

function RecordModal(props) {
	return (
		<Modal centered show={props.show} onHide={props.handleClose}>
			<Modal.Title>{props.currentRecord.title}</Modal.Title>
			<Modal.Body>
				<img
					className='modal-img'
					alt={props.currentRecord.title}
					src={props.currentRecord.photo_url}
				/>
				<p>
					<br></br>
					Artist: {props.currentRecord.artist_string}
					<br></br>
					Genre: {props.currentRecord.genre}
					<br></br>
					Label: {props.currentRecord.label}
					<br></br>
					Release date: {props.currentRecord.release_date}
					<br></br>
					Acquired date: {props.currentRecord.acquired_date}
					<br></br>
					<br></br>
					Notes: {props.currentRecord.notes}
				</p>
			</Modal.Body>
		</Modal>
	);
}
export default RecordModal;
