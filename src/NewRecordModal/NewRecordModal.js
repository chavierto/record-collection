import React from 'react';
import Modal from 'react-bootstrap/Modal';

function NewRecordModal(props) {
	return (
		<Modal centered showAdd={props.showAdd} onHide={props.handleCloseNew}>
			<Modal.Title>
				<h1>Add a new record</h1>
			</Modal.Title>
			<Modal.Body>
				<p>Foo bar</p>
			</Modal.Body>
		</Modal>
	);
}
export default NewRecordModal;
