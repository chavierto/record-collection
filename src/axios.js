// Create an axios function that will make code cleaner when invoked

import axios from 'axios';

const instance = axios.create({
	// baseURL: 'https://record-collection-be-xl.herokuapp.com/',
	baseURL: 'http://127.0.0.1:8000/',
	postURL: 'http://127.0.0.1:8000/albums',
});

export default instance;
