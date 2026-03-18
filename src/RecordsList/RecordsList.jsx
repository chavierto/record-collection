import React from 'react';
import { Link } from 'react-router-dom';
import './RecordsList.css';
import RecordCard from '../RecordCard/RecordCard';
import RecordModal from '../RecordModal/RecordModal';

function RecordsList(props) {
	const records = props.records;
	const isEmpty = records.length === 0;
	return (
		<div className='record-list'>
			<h2 className='record-list-title'>Records</h2>
			{isEmpty ? (
				<p className='record-list-empty'>
					{props.isFiltered
						? 'No records match your search.'
						: <>Your collection is empty.<br /><Link to='/records/new' className='record-list-add-cta'>+ Add your first record</Link></>}
				</p>
			) : (
			<div className='record-list-grid'>
				{records.map((record) => {
					return (
						<div key={record.id} onClick={() => props.handleShow(record)}>
							<RecordCard record={record} />
						</div>
					);
				})}
			</div>
			)}
			<RecordModal
				currentRecord={props.currentRecord}
				show={props.show}
				handleShow={props.handleShow}
				handleClose={props.handleClose}
				handleRecordUpdated={props.handleRecordUpdated}
				handleRecordDeleted={props.handleRecordDeleted}
			/>
		</div>
	);
}

export default RecordsList;
