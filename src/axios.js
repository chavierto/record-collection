import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://record-collection-be-xl.herokuapp.com/',
	// baseURL: 'https://127.0.0.1:8000',
});

export default instance;
