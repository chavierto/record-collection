import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/react';
import './NavBar.css';

function NavBar() {
	return (
		<nav className='nav'>
			<Link to='/records'>
				<h1 className='nav-text'>Record Collection</h1>
				<h1 className='nav-text-small'>RC</h1>
			</Link>
			<ul className='menu-list'>
				<li>
					<Link to='/records/new'>Add Record</Link>
				</li>
				<li><Link to='/artists'>Artists</Link></li>
				<li><UserButton afterSignOutUrl='/' /></li>
			</ul>
		</nav>
	);
}

export default NavBar;
