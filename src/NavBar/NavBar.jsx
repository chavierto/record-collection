import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/react';
import './NavBar.css';

function NavBar() {
	return (
		<nav className='nav'>
			<Link to='/records'>
				<h1 className='nav-text'>DeepCuts</h1>
			</Link>
			<ul className='menu-list'>
				<li>
					<Link to='/records/new'>Add Record</Link>
				</li>
				<li><Link to='/artists'>Artists</Link></li>
				<li>
					<div style={{ borderRadius: '50%', outline: '1.5px solid white', outlineOffset: '0px', lineHeight: 0 }}>
						<UserButton afterSignOutUrl='/' />
					</div>
				</li>
			</ul>
		</nav>
	);
}

export default NavBar;
