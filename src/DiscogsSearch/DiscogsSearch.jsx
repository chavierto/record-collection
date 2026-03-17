import React, { useState, useEffect, useRef } from 'react';
import axios from '../axios';
import requests from '../requests';
import './DiscogsSearch.css';

function DiscogsSearch({ onSelect }) {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [specificPressing, setSpecificPressing] = useState(false);
	const containerRef = useRef(null);

	const searchType = specificPressing ? 'release' : 'master';

	useEffect(() => {
		if (query.length < 2) {
			setResults([]);
			setOpen(false);
			return;
		}
		const timer = setTimeout(async () => {
			setLoading(true);
			try {
				const res = await axios.get(requests.discogsSearchURL, {
					params: { q: query, type: searchType },
				});
				setResults(res.data.results || []);
				setOpen(true);
			} catch {
				setResults([]);
			} finally {
				setLoading(false);
			}
		}, 400);
		return () => clearTimeout(timer);
	}, [query, searchType]);

	useEffect(() => {
		const handleClick = (e) => {
			if (containerRef.current && !containerRef.current.contains(e.target)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, []);

	const handleSelect = async (result) => {
		setOpen(false);
		setQuery('');
		setLoading(true);
		try {
			const url = specificPressing
				? requests.discogsReleaseURL(result.id)
				: requests.discogsMasterURL(result.id);
			const res = await axios.get(url);
			onSelect(res.data);
		} catch {
			// fail silently — user can fill manually
		} finally {
			setLoading(false);
		}
	};

	const metaFields = specificPressing
		? (r) => [r.year, r.country, r.label?.[0], r.catno, r.format?.[0]]
		: (r) => [r.year, r.genre?.[0], r.style?.[0]];

	return (
		<div className='discogs-search' ref={containerRef}>
			<div className='discogs-search-row'>
				<div className='discogs-input-wrapper'>
					<input
						className='inputField discogs-input'
						type='text'
						placeholder='Search Discogs to auto-fill...'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={(e) => { if (e.key === 'Escape') { setQuery(''); setOpen(false); } }}
						autoComplete='off'
					/>
					{query && (
						<button
							type='button'
							className='search-clear'
							onMouseDown={() => { setQuery(''); setOpen(false); }}
							aria-label='Clear search'>
							✕
						</button>
					)}
				</div>
				<button
					type='button'
					className={`discogs-toggle ${specificPressing ? 'active' : ''}`}
					onClick={() => { setSpecificPressing((p) => !p); setResults([]); setOpen(false); }}
					title={specificPressing ? 'Searching specific pressings — click to search any edition' : 'Searching any edition — click to search a specific pressing'}
				>
					{specificPressing ? 'Exact pressing' : 'Any edition'}
				</button>
			</div>
			{loading && <span className='discogs-status'>Searching...</span>}
			{open && !loading && results.length === 0 && query.length >= 2 && (
				<span className='discogs-status'>No results found</span>
			)}
			{open && results.length > 0 && (
				<ul className='discogs-results'>
					{results.map((r) => (
						<li
							key={r.id}
							className='discogs-result-item'
							onMouseDown={() => handleSelect(r)}
						>
							{r.thumb
								? <img src={requests.discogsImageURL(r.thumb)} alt='' className='discogs-thumb' />
								: <div className='discogs-thumb discogs-thumb-placeholder' />
							}
							<div className='discogs-result-info'>
								<span className='discogs-result-title'>{r.title}</span>
								<span className='discogs-result-meta'>
									{metaFields(r).filter(Boolean).join(' · ')}
								</span>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default DiscogsSearch;
