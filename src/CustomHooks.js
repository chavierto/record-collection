import { useState } from 'react';
import axios from 'axios';

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
	const handleSubmit = (event) => {
		if (event) {
			event.preventDefault();
			const newAlbum = inputs;
			
			console.log(newAlbum);
			axios.post(`http://record-collection-be-xl.herokuapp.com/albums/`, newAlbum).catch(console.error);
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
