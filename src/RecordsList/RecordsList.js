import React from 'react';
import './RecordsList.css';
import RecordCard from '../RecordCard/RecordCard';
import RecordModal from '../RecordModal/RecordModal';

function RecordsList(props) {
	const records = props.records;
	return (
		<div className='record-list'>
			<h2 className='record-list-title'>Records</h2>
			<div className='record-list-grid'>
				{records.map((record) => {
					return (
						<div key={record.id} onClick={() => props.handleShow(record)}>
							<RecordCard record={record} />
						</div>
					);
				})}
			</div>
			<RecordModal
				currentRecord={props.currentRecord}
				show={props.show}
				handleShow={props.handleShow}
				handleClose={props.handleClose}
			/>
		</div>
	);
}

export default RecordsList;
