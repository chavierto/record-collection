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
	discogsSearchURL: `/discogs/search`,
	discogsReleaseURL: (id) => `/discogs/release/${id}`,
	discogsMasterURL: (id) => `/discogs/master/${id}`,
	discogsImageURL: (url) => `${devUrl}/discogs/image?url=${encodeURIComponent(url)}`,
};

export default requests;
