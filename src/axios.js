import axios from 'axios';
import requests from './requests';

const instance = axios.create({
	baseURL: `${requests.baseUrl}`,
});

export default instance;
