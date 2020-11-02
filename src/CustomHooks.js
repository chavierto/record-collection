import { useState } from 'react';

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
