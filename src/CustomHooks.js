import { useState } from 'react';
import axios from './axios';
import requests from './requests';

function useForm() {
	const [inputs, setInputs] = useState({
		title: '',
		artist: '',
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
			const newAlbum = inputs;
			console.log(newAlbum);
			axios
				.post(requests.postURL, newAlbum)
				.then((res) => console.log(res))
				.catch((err) => console.log(err));
			// return
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
