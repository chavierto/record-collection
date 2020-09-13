import React from 'react';
import './NavBar.css';

function NavBar() {
	return (
		<nav className='nav'>
			<h1 className='navText'>Record Collection</h1>
			<ul className='menuList'>
				<li>Records</li>
				<li>Artists</li>
				<li>Songs</li>
				<li>Add Record</li>
			</ul>
		</nav>
	);
}

export default NavBar;
