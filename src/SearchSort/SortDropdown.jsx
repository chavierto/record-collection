import React, { useState, useRef, useEffect } from 'react';
import './SortDropdown.css';

function SortDropdown({ options, value, onChange }) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef(null);

	const selected = options.find((o) => o.value === value);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (containerRef.current && !containerRef.current.contains(e.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSelect = (val) => {
		onChange(val);
		setIsOpen(false);
	};

	return (
		<div className='sort-dropdown' ref={containerRef}>
			<button
				type='button'
				className='sort-dropdown-toggle'
				onClick={() => setIsOpen((prev) => !prev)}>
				{selected ? selected.label : 'Select'}
				<span className='sort-dropdown-arrow'>{isOpen ? '▲' : '▼'}</span>
			</button>
			{isOpen && (
				<ul className='sort-dropdown-list'>
					{options.map((opt) => (
						<li
							key={opt.value}
							className={`sort-dropdown-item${opt.value === value ? ' selected' : ''}`}
							onMouseDown={() => handleSelect(opt.value)}>
							{opt.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default SortDropdown;
