import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burgerbuilder-6d59b.firebaseio.com/'
});

export default instance;
