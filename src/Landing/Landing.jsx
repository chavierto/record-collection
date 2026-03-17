import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
	return (
		<div className='landing'>
			<h1 className='landing-title'>Record Collection</h1>
			<p className='landing-tagline'>Your personal vinyl catalog.</p>
			<Link to='/sign-in' className='landing-btn'>Sign in with Google</Link>
		</div>
	);
}

export default Landing;
