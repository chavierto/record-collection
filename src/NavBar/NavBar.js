import React from 'react';
import NewRecordModal from '../NewRecordModal/NewRecordModal';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './NavBar.css';

function NavBar(props) {
	return (
		<nav className='nav'>
			<Link to='/'>
				<h1 className='nav-text'>Record Collection</h1>
			<h1 className='nav-text-small'>RC</h1>
			</Link>
			<ul className='menu-list'>
				{/* <li>Records</li> */}
				{/* <li>Artists</li> */}
				{/* <li>Songs</li> */}
				{/* <li>
					<button onClick={props.handleShowNew}>Add Record</button>
				</li> */}
				<li>
					<Link className='new-record-link' to='/newrecord'>Add Record</Link>
				</li>
			</ul>
			<NewRecordModal
				showAdd={props.showAdd}
				handleShowNew={props.handleShowNew}
				handleCloseNew={props.handleCloseNew}
			/>
		</nav>
	);
}

export default NavBar;
