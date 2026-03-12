import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from './axios';
import requests from './requests';

function useNewArtist() {
	const history = useHistory();
	const [inputs, setInputs] = useState({
		title: '',
		artist: '',
		artist_string: '',
		artist_id: '',
		genre: '',
		label: '',
		release_date: '',
		acquired_date: '',
		photo_url: '',
		notes: '',
		songs: '',
	});
	const [error, setError] = useState('');

	const handleSubmit = (event) => {
		if (event) {
			event.preventDefault();
			setError('');
			const newArtist = inputs;
			axios
				.post(requests.postArtistURL, newArtist)
				.then(() => history.push('/'))
				.catch((err) => {
					if (err.response && err.response.status === 400) {
						const data = err.response.data;
						const msg = data.artist
							? data.artist[0]
							: 'Something went wrong. Please try again.';
						setError(msg);
					} else {
						setError('Something went wrong. Please try again.');
					}
				});
		}
	};
	const handleInputChange = (event) => {
		event.persist();
		setInputs((inputs) => ({
			...inputs,
			[event.target.id]: event.target.value,
		}));
	};

	return {
		handleSubmit,
		handleInputChange,
		inputs,
		error,
	};
}

export default useNewArtist;
