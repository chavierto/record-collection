import React from 'react';

import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar(props) {
	return (
		<nav className='nav'>
			<Link to='/'>
				<h1 className='nav-text'>Record Collection</h1>
				<h1 className='nav-text-small'>RC</h1>
			</Link>
			<ul className='menu-list'>
				<li>
					<Link className='new-record-link' to='/newrecord'>Add Record</Link>
				</li>
				<li><Link to='/newartist'>New Artist</Link></li>
			</ul>
		</nav>
	);
}

export default NavBar;
