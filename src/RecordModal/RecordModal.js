import React from 'react';
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import Modal from 'react-bootstrap/Modal';

function RecordModal(props) {
	return (
		<Modal centered show={props.show} onHide={props.handleClose}>
			<ModalHeader closeButton></ModalHeader>
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
				</p>
			</Modal.Body>
			<Modal.Footer>
				<p className='note'>{props.currentRecord.notes}</p>
			</Modal.Footer>
		</Modal>
	);
}
export default RecordModal;
