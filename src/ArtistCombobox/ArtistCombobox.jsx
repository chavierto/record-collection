import React, { useState, useRef, useEffect } from 'react';
import './ArtistCombobox.css';

function ArtistCombobox({ artists, value, onChange }) {
	const selectedArtist = artists.find((a) => String(a.id) === String(value));
	const [query, setQuery] = useState(selectedArtist ? selectedArtist.artist : '');
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const containerRef = useRef(null);
	const listRef = useRef(null);

	// Keep display text in sync if value changes externally (e.g. after new artist created)
	useEffect(() => {
		const match = artists.find((a) => String(a.id) === String(value));
		if (match) setQuery(match.artist);
	}, [value, artists]);

	// Reset highlight when list changes
	useEffect(() => {
		setHighlightedIndex(-1);
	}, [query]);

	const filtered = query
		? artists.filter((a) =>
				a.artist.toLowerCase().includes(query.toLowerCase())
		  )
		: artists;

	const handleSelect = (artist) => {
		setQuery(artist.artist);
		setIsOpen(false);
		setHighlightedIndex(-1);
		onChange(String(artist.id));
	};

	const handleInputChange = (e) => {
		setQuery(e.target.value);
		setIsOpen(true);
		onChange('');
	};

	const handleKeyDown = (e) => {
		if (!isOpen) {
			if (e.key === 'ArrowDown') {
				setIsOpen(true);
			}
			return;
		}

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			setHighlightedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			setHighlightedIndex((prev) => Math.max(prev - 1, 0));
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
				handleSelect(filtered[highlightedIndex]);
			}
		} else if (e.key === 'Escape') {
			e.stopPropagation();
			e.nativeEvent.stopImmediatePropagation();
			const committedValue = selectedArtist ? selectedArtist.artist : '';
			if (query !== committedValue) {
				setQuery(committedValue);
			} else {
				setIsOpen(false);
				setHighlightedIndex(-1);
			}
		} else if (e.key === 'Tab') {
			setIsOpen(false);
			setHighlightedIndex(-1);
		}
	};

	// Scroll highlighted item into view
	useEffect(() => {
		if (listRef.current && highlightedIndex >= 0) {
			const item = listRef.current.children[highlightedIndex];
			if (item) item.scrollIntoView({ block: 'nearest' });
		}
	}, [highlightedIndex]);

	const handleBlur = () => {
		setTimeout(() => {
			if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
				setIsOpen(false);
				setHighlightedIndex(-1);
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
				onKeyDown={handleKeyDown}
				autoComplete='off'
			/>
			{isOpen && filtered.length > 0 && (
				<ul className='artist-combobox-list' ref={listRef}>
					{filtered.map((a, i) => (
						<li
							key={a.id}
							className={`artist-combobox-item${i === highlightedIndex ? ' highlighted' : ''}`}
							onMouseDown={() => handleSelect(a)}
							onMouseEnter={() => setHighlightedIndex(i)}>
							{a.artist}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default ArtistCombobox;
