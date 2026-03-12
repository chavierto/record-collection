import React from 'react';
import useForm from '../NewArtistHook';
import './NewArtist.css';

function NewArtist(props) {
	const { inputs, handleInputChange, handleSubmit, error } = useForm();

	return (
		<div>
			<br></br>
			<h4>New Artist</h4>
			<br></br>
			<form onSubmit={handleSubmit} autoComplete='off'>
				<div className='editInputs'>
					<div>
						<label htmlFor='artist'>Artist:</label>
						<input
							required
							className='inputField'
							type='text'
							name='artist'
							id='artist'
							value={inputs.artist}
							aria-describedby={error ? 'artist-error' : undefined}
							onChange={handleInputChange}></input>
						{error && (
							<span id='artist-error' role='alert' className='formError'>
								{error}
							</span>
						)}
					</div>
					<div>
						<label>Photo URL:</label>
						<input
							className='inputField'
							type='text'
							name='photo_url'
							id='photo_url'
							value={inputs.photo_url}
							onChange={handleInputChange}></input>
					</div>
					<div>
						<label>Notes:</label>
						<input
							className='inputField'
							type='text'
							name='body'
							id='notes'
							value={inputs.notes}
							onChange={handleInputChange}></input>
					</div>
				</div>
				<input type='submit' className='submitButton' />
			</form>
		</div>
	);
}

export default NewArtist;
