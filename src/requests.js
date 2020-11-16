const requests = {
	baseUrl: `${process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_URL : process.env.REACT_APP_PROD_URL}`,
	postAlbumURL: `/albums`,
	postSongURL: `/songs`,
	postArtistURL: `/artists`,
};

export default requests;
