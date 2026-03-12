import React from 'react';
import './RecordCard.css';

function RecordCard(props) {
	const record = props.record;

	return (
		<div className='record-card'>
			<div className='photo-div'>
				{record.photo_url ? (
					<img className='photo' src={record.photo_url} alt={record.title} />
				) : (
					<div className='photo photo-placeholder' />
				)}
			</div>
			<div className='record-title'>
				<p>{record.artist_string}</p>
				<p>{record.title}</p>
			</div>
		</div>
	);
}

export default RecordCard;
