import React from 'react';
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
							value={inputs.title}
							onChange={handleInputChange}></input>
					</div>
					<div>
						<label>Artist:</label>
						<input
							className='inputField'
							type='text'
							name='artist'
							id='artist'
							value={inputs.artist}
							onChange={handleInputChange}></input>
					</div>
					<div>
						<label>Genre:</label>
						<input
							className='inputField'
							type='text'
							name='genre'
							id='genre'
							value={inputs.genre}
							onChange={handleInputChange}></input>
					</div>
					<div>
						<label>Label:</label>
						<input
							className='inputField'
							type='text'
							name='label'
							id='label'
							onChange={handleInputChange}></input>
					</div>
					<div>
						<label>Release date:</label>
						<input
							className='inputField'
							type='date'
							name='release_date'
							id='release_date'
							value={inputs.release_date}
							onChange={handleInputChange}></input>
					</div>
					<div>
						<label>Acquired date:</label>
						<input
							className='inputField'
							type='date'
							name='acquired_date'
							id='acquired_date'
							value={inputs.acquired_date}
							onChange={handleInputChange}></input>
					</div>
					<div>
						<label>Photo URL:</label>
						<input
							className='inputField'
							type='text'
							name='photo_url'
							id='photo_url'
							value={inputs.photo_url}
							onChange={handleInputChange}
						></input>
					</div>
					<div>
						<label>Notes:</label>
						<input
							className='inputField'
							type='text'
							name='body'
							id='notes'
							value={inputs.notes}
							onChange={handleInputChange}
						></input>
					</div>
				</div>
				<input type='submit' className='submitButton' />
			</form>
		</div>
	);
}

export default NewRecord;
