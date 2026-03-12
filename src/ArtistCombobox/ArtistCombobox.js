import React, { useState, useRef, useEffect } from 'react';
import './ArtistCombobox.css';

function ArtistCombobox({ artists, value, onChange }) {
	const selectedArtist = artists.find((a) => String(a.id) === String(value));
	const [query, setQuery] = useState(selectedArtist ? selectedArtist.artist : '');
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef(null);

	// Keep display text in sync if value changes externally (e.g. after new artist created)
	useEffect(() => {
		const match = artists.find((a) => String(a.id) === String(value));
		setQuery(match ? match.artist : '');
	}, [value, artists]);

	const filtered = query
		? artists.filter((a) =>
				a.artist.toLowerCase().includes(query.toLowerCase())
		  )
		: artists;

	const handleSelect = (artist) => {
		setQuery(artist.artist);
		setIsOpen(false);
		onChange(String(artist.id));
	};

	const handleInputChange = (e) => {
		setQuery(e.target.value);
		setIsOpen(true);
		// Clear selection if user edits the text
		onChange('');
	};

	const handleBlur = (e) => {
		// Delay so clicks on list items register before closing
		setTimeout(() => {
			if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
				setIsOpen(false);
				// If nothing selected, reset query to empty
				const match = artists.find((a) => String(a.id) === String(value));
				if (!match) setQuery('');
			}
		}, 150);
	};

	return (
		<div className='artist-combobox' ref={containerRef} onBlur={handleBlur}>
			<input
				className='inputField'
				type='text'
				placeholder='Search artists...'
				value={query}
				onChange={handleInputChange}
				onFocus={() => setIsOpen(true)}
				autoComplete='off'
			/>
			{isOpen && filtered.length > 0 && (
				<ul className='artist-combobox-list'>
					{filtered.map((a) => (
						<li
							key={a.id}
							className='artist-combobox-item'
							onMouseDown={() => handleSelect(a)}>
							{a.artist}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default ArtistCombobox;
