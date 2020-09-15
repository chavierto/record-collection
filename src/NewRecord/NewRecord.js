import React, { Component } from 'react';
import useForm from '../CustomHooks';
import './NewRecord.css';

function NewRecord(props) {
	const { inputs, handleInputChange, handleSubmit } = useForm();

	return (
		<div>
			<br></br>
			<h4>New Record</h4>
			<br></br>
			<form onSubmit={handleSubmit}>
				<div className='editInputs'>
					<div>
						<label>Title: </label>
						<input
							required
							className='inputField'
							type='text'
							//What are these names?  Do they reference
							name='title'
							id='title'
							onChange={handleInputChange}
							value={inputs.title}></input>
					</div>
					<div>
						<label>Artist:</label>
						<input
							className='inputField'
							type='text'
							name='artist'
							id='artist'
							onChange={(event) =>
								props.setNewRecordData(event.target.value)
							}></input>
					</div>
					<div>
						<label>Genre:</label>
						<input
							className='inputField'
							type='text'
							name='genre'
							id='genre'
							//When handling input change, state doesn't merge, rather it gets replaced
							// onChange={handleInputChange}
						></input>
					</div>
					<div>
						<label>Label:</label>
						<input
							className='inputField'
							type='text'
							name='label'
							id='label'
							// onChange={handleInputChange}
						></input>
					</div>
					<div>
						<label>Release date:</label>
						<input
							className='inputField'
							type='date'
							name='release_date'
							id='release_date'
							// onChange={handleInputChange}
						></input>
					</div>
					<div>
						<label>Acquired date:</label>
						<input
							className='inputField'
							type='date'
							name='acquired_date'
							id='acquired_date'
							// onChange={handleInputChange}
						></input>
					</div>
					<div>
						<label>Photo URL:</label>
						<input
							className='inputField'
							type='text'
							name='photo_url'
							id='photo_url'
							// onChange={handleInputChange}
						></input>
					</div>
					<div>
						<label>Notes:</label>
						<input
							className='inputField'
							type='text'
							name='body'
							id='notes'
							// onChange={handleInputChange}
						></input>
					</div>
				</div>
				<input type='submit' className='submitButton' />
			</form>
		</div>
	);
}

export default NewRecord;
