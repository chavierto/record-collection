import React, { useState, useEffect } from 'react';
import './RecordsList.css';
import RecordCard from '../RecordCard/RecordCard';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';

function RecordsList() {
	const [data, setData] = useState({
		records: {},
	});

	useEffect(async () => {
		const result = await axios(
			'https://record-collection-be-xl.herokuapp.com/'
		);

		setData(result.data);
	}, []);

	return (
		<ul>
			{data.records.map((i) => (
				<li key={i.ID}>
					<a href={i.url}>{i.title}</a>
				</li>
			))}
		</ul>
	);
}

export default RecordsList;
