import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from './axios';
import requests from './requests';

function useForm() {
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
	const handleSubmit = (event) => {
		if (event) {
			event.preventDefault();
			const newAlbum = {
				...inputs,
				release_date: inputs.release_date || null,
				acquired_date: inputs.acquired_date || null,
			};
			axios
				.post(requests.postAlbumURL, newAlbum)
				.then(() => history.push('/'))
				.catch((err) => console.log(err));
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
	};
}

export default useForm;
