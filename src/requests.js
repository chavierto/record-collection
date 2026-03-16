const devUrl = import.meta.env.DEV
	? `http://${window.location.hostname}:8000`
	: import.meta.env.VITE_PROD_URL;

const requests = {
	baseUrl: devUrl,
	postAlbumURL: `/albums`,
	postSongURL: `/songs`,
	postArtistURL: `/artists`,
	albumDetailURL: (id) => `/albums/${id}`,
	songDetailURL: (id) => `/songs/${id}`,
	artistDetailURL: (id) => `/artists/${id}`,
};

export default requests;
