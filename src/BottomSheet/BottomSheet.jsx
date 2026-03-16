import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './BottomSheet.css';

function BottomSheet({ show, onClose, title, children }) {
	const touchStartY = useRef(null);
	const touchStartTime = useRef(null);
	const dragZoneRef = useRef(null);
	const panelRef = useRef(null);

	useEffect(() => {
		if (!show) return;
		const handleKey = (e) => {
			if (e.key === 'Escape') onClose();
		};
		document.addEventListener('keydown', handleKey);
		return () => document.removeEventListener('keydown', handleKey);
	}, [show, onClose]);

	useEffect(() => {
		document.body.style.overflow = show ? 'hidden' : '';
		return () => { document.body.style.overflow = ''; };
	}, [show]);

	useEffect(() => {
		const zone = dragZoneRef.current;
		const panel = panelRef.current;
		if (!zone || !panel || !show) return;

		const onTouchStart = (e) => {
			touchStartY.current = e.touches[0].clientY;
			touchStartTime.current = Date.now();
			// Disable CSS transition while dragging so panel follows finger instantly
			panel.style.transition = 'none';
		};

		const onTouchMove = (e) => {
			if (touchStartY.current === null) return;
			const delta = e.touches[0].clientY - touchStartY.current;
			// Only drag downward
			panel.style.transform = `translateY(${Math.max(0, delta)}px)`;
		};

		const onTouchEnd = (e) => {
			if (touchStartY.current === null) return;
			const delta = e.changedTouches[0].clientY - touchStartY.current;
			const elapsed = Date.now() - touchStartTime.current;
			const velocity = delta / elapsed; // px/ms

			// Re-enable transition for snap-back or dismiss animation
			panel.style.transition = '';

			const shouldClose = delta > 120 || (delta > 40 && velocity > 0.4);

			if (shouldClose) {
				panel.style.transform = `translateY(100%)`;
				setTimeout(() => {
					panel.style.transform = '';
					onClose();
				}, 300);
			} else {
				// Snap back
				panel.style.transform = '';
			}

			touchStartY.current = null;
			touchStartTime.current = null;
		};

		zone.addEventListener('touchstart', onTouchStart, { passive: true });
		zone.addEventListener('touchmove', onTouchMove, { passive: true });
		zone.addEventListener('touchend', onTouchEnd, { passive: true });

		return () => {
			zone.removeEventListener('touchstart', onTouchStart);
			zone.removeEventListener('touchmove', onTouchMove);
			zone.removeEventListener('touchend', onTouchEnd);
		};
	}, [show, onClose]);

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) onClose();
	};

	return createPortal(
		<div
			className={`bottom-sheet-backdrop${show ? ' show' : ''}`}
			onClick={handleBackdropClick}>
			<div ref={panelRef} className='bottom-sheet-panel'>
				<div ref={dragZoneRef} className='bottom-sheet-drag-zone'>
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
