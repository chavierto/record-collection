import React from 'react';
import './NavBar.css';

function NavBar() {
	return (
		<nav className='nav'>
			<h1 className='nav-text'>Record Collection</h1>
			<h1 className='nav-text-small'>RC</h1>
			<ul className='menu-list'>
				<li>Records</li>
				<li>Artists</li>
				{/* <li>Songs</li> */}
				<li>Add Record</li>
			</ul>
		</nav>
	);
}

export default NavBar;
