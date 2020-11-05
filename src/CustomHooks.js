import { useState } from 'react';
import axios from './axios';

const useForm = () => {
	const [inputs, setInputs] = useState({
		title: '',
		artist: '',
		genre: '',
		label: '',
		release_date: '',
		acquired_date: '',
		notes: '',
	});
	const handleSubmit = (event, {postURL}) => {
		if (event) {
			event.preventDefault();
			const newAlbum = inputs;
			axios.post(postURL, newAlbum).catch(console.error);
			console.log(newAlbum);
			// return res;
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
};

export default useForm;
