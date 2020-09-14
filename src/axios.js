// Create an axios function that will make code cleaner when invoked

import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://record-collection-be-xl.herokuapp.com/',
});

export default instance;
