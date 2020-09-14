import React from 'react';
import './RecordCard.css';

function RecordCard() {

    return (
			<div className='record-card'>
				<img
					// src={this.state[0].photo_url}
                    src='https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png'
                    alt='album'
				/>
				{/* <img
					src={state.records.photo_url}
					alt={this.props.article.multimedia[2].caption}></img> */}
			</div>
		);
}



export default RecordCard;
