import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './BottomSheet.css';

function BottomSheet({ show, onClose, title, children }) {
	// Escape key — delegates to onClose which decides whether to actually close
	useEffect(() => {
		if (!show) return;
		const handleKey = (e) => {
			if (e.key === 'Escape') onClose();
		};
		document.addEventListener('keydown', handleKey);
		return () => document.removeEventListener('keydown', handleKey);
	}, [show, onClose]);

	// Lock body scroll when open
	useEffect(() => {
		document.body.style.overflow = show ? 'hidden' : '';
		return () => { document.body.style.overflow = ''; };
	}, [show]);

	return createPortal(
		<div
			className={`bottom-sheet-backdrop${show ? ' show' : ''}`}
			onClick={onClose}>
			<div
				className='bottom-sheet-panel'
				onClick={(e) => e.stopPropagation()}>
				<div className='bottom-sheet-handle'>
					<div className='bottom-sheet-handle-bar' />
				</div>
				<div className='bottom-sheet-header'>
					<h5 className='bottom-sheet-title'>{title}</h5>
					<button
						type='button'
						className='bottom-sheet-close'
						onClick={onClose}
						aria-label='Close'>
						✕
					</button>
				</div>
				<div className='bottom-sheet-content'>
					{children}
				</div>
			</div>
		</div>,
		document.body
	);
}

export default BottomSheet;
