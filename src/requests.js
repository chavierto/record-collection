const requests = {
	baseUrl: `${import.meta.env.DEV ? import.meta.env.VITE_DEV_URL : import.meta.env.VITE_PROD_URL}`,
	postAlbumURL: `/albums`,
	postSongURL: `/songs`,
	postArtistURL: `/artists`,
	albumDetailURL: (id) => `/albums/${id}`,
	songDetailURL: (id) => `/songs/${id}`,
	artistDetailURL: (id) => `/artists/${id}`,
};

export default requests;
