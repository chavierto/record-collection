import React, { useState, useEffect } from 'react';
import './RecordsList.css';
import RecordCard from '../RecordCard/RecordCard';
import axios from '../axios';
import Modal from 'react-bootstrap/Modal';

function RecordsList() {
	const [data, setData] = useState({
		records: {},
	});

	useEffect(() => {
		async function getRecords() {
			const result = await axios.get();
			setData(result.data);
			return result;
		}
		getRecords();
	}, []);

	return (
		<ul>
			<li>
				<RecordCard />
			</li>
			{/* {data.records.map((record, i) => {
				return (
					<div key={record.id} onClick={(e) => this.handleShow(i)}>
						<RecordCard record={record} />
					</div>
				);
			})} */}
		</ul>
	);
}

export default RecordsList;
