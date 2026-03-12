import { useState, useEffect } from 'react';
import axios from './axios';
import requests from './requests';

function useEditRecord(initialRecord, onSuccess) {
	const [inputs, setInputs] = useState({
		title: initialRecord.title || '',
		artist_id: initialRecord.artist_id || '',
		genre: initialRecord.genre || '',
		label: initialRecord.label || '',
		release_date: initialRecord.release_date || '',
		acquired_date: initialRecord.acquired_date || '',
		photo_url: initialRecord.photo_url || '',
		notes: initialRecord.notes || '',
	});

	useEffect(() => {
		setInputs({
			title: initialRecord.title || '',
			artist_id: initialRecord.artist_id || '',
			genre: initialRecord.genre || '',
			label: initialRecord.label || '',
			release_date: initialRecord.release_date || '',
			acquired_date: initialRecord.acquired_date || '',
			photo_url: initialRecord.photo_url || '',
			notes: initialRecord.notes || '',
		});
	}, [initialRecord.id]);
	const [error, setError] = useState('');

	const handleInputChange = (event) => {
		event.persist();
		setInputs((inputs) => ({
			...inputs,
			[event.target.id]: event.target.value,
		}));
	};

	const performUpdate = () => {
		setError('');
		const updatedAlbum = {
			...inputs,
			release_date: inputs.release_date || null,
			acquired_date: inputs.acquired_date || null,
		};
		return axios
			.put(requests.albumDetailURL(initialRecord.id), updatedAlbum)
			.then((res) => onSuccess(res.data))
			.catch(() => setError('Something went wrong. Please try again.'));
	};

	const handleUpdate = (event) => {
		event.preventDefault();
		performUpdate();
	};

	const handleDelete = () => {
		axios
			.delete(requests.albumDetailURL(initialRecord.id))
			.then(() => onSuccess(null))
			.catch(() => setError('Something went wrong. Please try again.'));
	};

	return {
		inputs,
		handleInputChange,
		handleUpdate,
		performUpdate,
		handleDelete,
		error,
	};
}

export default useEditRecord;
