import React from 'react';
import SortDropdown from './SortDropdown';
import './SearchSort.css';

const SORT_OPTIONS = [
	{ value: 'default', label: 'Default' },
	{ value: 'title', label: 'Title' },
	{ value: 'artist_string', label: 'Artist' },
	{ value: 'genre', label: 'Genre' },
	{ value: 'label', label: 'Label' },
	{ value: 'release_date', label: 'Date released' },
	{ value: 'acquired_date', label: 'Date acquired' },
];

function SearchSort({ searchQuery, onSearchChange, sortBy, onSortChange, sortAsc, onSortDirectionToggle }) {
	return (
		<div className='search-sort'>
			<div className='search-input-wrapper'>
				<input
					className='inputField search-input'
					type='text'
					placeholder='Search by title, artist or song...'
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					onKeyDown={(e) => { if (e.key === 'Escape') onSearchChange(''); }}
				/>
				{searchQuery && (
					<button
						type='button'
						className='search-clear'
						onClick={() => onSearchChange('')}
						aria-label='Clear search'>
						✕
					</button>
				)}
			</div>
			<div className='sort-controls'>
				<span className='sort-label'>Sort by:</span>
				<SortDropdown
					options={SORT_OPTIONS}
					value={sortBy}
					onChange={onSortChange}
				/>
				<button
					type='button'
					className='sort-direction-btn'
					onClick={onSortDirectionToggle}
					title={sortAsc ? 'Ascending' : 'Descending'}>
					{sortAsc ? '↑' : '↓'}
				</button>
			</div>
		</div>
	);
}

export default SearchSort;
