import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './BarcodeScanner.css';

const FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e'];
const SCAN_INTERVAL_MS = 150;

// Prefer the browser's native BarcodeDetector (Chrome/Android); fall back to the
// ZXing WebAssembly ponyfill (Safari/iOS, Firefox). The .wasm is bundled with the
// app rather than fetched from a CDN so ad blockers can't break scanning.
async function createDetector() {
	if ('BarcodeDetector' in window) {
		try {
			const supported = await window.BarcodeDetector.getSupportedFormats();
			const formats = FORMATS.filter((f) => supported.includes(f));
			if (formats.length) return new window.BarcodeDetector({ formats });
		} catch {
			// fall through to the ponyfill
		}
	}
	const [{ BarcodeDetector, prepareZXingModule }, { default: wasmUrl }] = await Promise.all([
		import('barcode-detector/ponyfill'),
		import('zxing-wasm/reader/zxing_reader.wasm?url'),
	]);
	prepareZXingModule({
		overrides: {
			locateFile: (path, prefix) => (path.endsWith('.wasm') ? wasmUrl : prefix + path),
		},
	});
	return new BarcodeDetector({ formats: FORMATS });
}

function cameraErrorMessage(err) {
	if (!window.isSecureContext) return 'The camera only works over HTTPS. Use `npm run start:https` to test on a phone.';
	if (err?.name === 'NotAllowedError') return 'Camera access was blocked. Allow it in your browser (and system) settings, or enter the barcode below.';
	if (err?.name === 'NotFoundError' || err?.name === 'OverconstrainedError') return 'No camera found. Enter the barcode below instead.';
	return 'Could not start the camera. Enter the barcode below instead.';
}

function BarcodeScanner({ onDetected, onClose }) {
	const videoRef = useRef(null);
	const [devices, setDevices] = useState([]);
	// deviceId is the camera the user picked (drives the stream); activeDeviceId is what's actually running
	const [deviceId, setDeviceId] = useState('');
	const [activeDeviceId, setActiveDeviceId] = useState('');
	const [mirrored, setMirrored] = useState(false);
	const [error, setError] = useState('');
	const [manualCode, setManualCode] = useState('');
	const [manualError, setManualError] = useState('');

	// Keep the latest callbacks without restarting the camera when they change
	const onDetectedRef = useRef(onDetected);
	onDetectedRef.current = onDetected;
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	useEffect(() => {
		const handleKey = (e) => {
			if (e.key === 'Escape') onCloseRef.current();
		};
		document.addEventListener('keydown', handleKey);
		document.body.style.overflow = 'hidden';
		return () => {
			document.removeEventListener('keydown', handleKey);
			document.body.style.overflow = '';
		};
	}, []);

	useEffect(() => {
		let stream = null;
		let timer = null;
		let cancelled = false;

		async function start() {
			setError('');
			if (!navigator.mediaDevices?.getUserMedia) {
				setError(cameraErrorMessage());
				return;
			}
			try {
				stream = await navigator.mediaDevices.getUserMedia({
					audio: false,
					video: deviceId
						? { deviceId: { exact: deviceId } }
						: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
				});
			} catch (err) {
				if (!cancelled) setError(cameraErrorMessage(err));
				return;
			}
			if (cancelled) {
				stream.getTracks().forEach((t) => t.stop());
				return;
			}

			const track = stream.getVideoTracks()[0];
			const settings = track.getSettings();
			// Webcams usually don't report facingMode; treat anything not rear-facing as a selfie view
			setMirrored(settings.facingMode !== 'environment');
			setActiveDeviceId(settings.deviceId || '');

			// Device labels are only available after permission is granted
			const all = await navigator.mediaDevices.enumerateDevices();
			if (!cancelled) setDevices(all.filter((d) => d.kind === 'videoinput'));

			const video = videoRef.current;
			if (!video) return;
			video.srcObject = stream;
			await video.play().catch(() => {});

			let detector;
			try {
				detector = await createDetector();
			} catch {
				stream.getTracks().forEach((t) => t.stop());
				if (!cancelled) setError('Barcode reader failed to load. Enter the barcode below instead.');
				return;
			}

			const scan = async () => {
				if (cancelled) return;
				if (video.readyState >= 2) {
					try {
						const codes = await detector.detect(video);
						if (cancelled) return;
						if (codes.length > 0) {
							navigator.vibrate?.(100);
							onDetectedRef.current(codes[0].rawValue);
							return;
						}
					} catch {
						// a dropped frame isn't fatal; keep scanning
					}
				}
				timer = setTimeout(scan, SCAN_INTERVAL_MS);
			};
			scan();
		}

		start();
		return () => {
			cancelled = true;
			clearTimeout(timer);
			if (stream) stream.getTracks().forEach((t) => t.stop());
		};
	}, [deviceId]);

	const submitManual = () => {
		const digits = manualCode.replace(/\D/g, '');
		if (digits.length < 8 || digits.length > 14) {
			setManualError('Barcodes are 8–13 digits.');
			return;
		}
		onDetected(digits);
	};

	return createPortal(
		<div className='barcode-scanner' role='dialog' aria-label='Scan barcode'>
			<div className='barcode-scanner-header'>
				<span className='barcode-scanner-title'>Scan barcode</span>
				<button type='button' className='barcode-scanner-close' onClick={onClose} aria-label='Close'>
					✕
				</button>
			</div>

			<div className='barcode-scanner-viewport'>
				{error ? (
					<p className='barcode-scanner-error'>{error}</p>
				) : (
					<>
						<video
							ref={videoRef}
							className={`barcode-scanner-video${mirrored ? ' mirrored' : ''}`}
							muted
							playsInline
						/>
						<div className='barcode-scanner-guide' />
					</>
				)}
			</div>

			<div className='barcode-scanner-controls'>
				{!error && <p className='barcode-scanner-hint'>Hold the barcode inside the box</p>}
				{devices.length > 1 && (
					<select
						className='barcode-scanner-select'
						value={activeDeviceId}
						onChange={(e) => setDeviceId(e.target.value)}
						aria-label='Camera'>
						{devices.map((d, i) => (
							<option key={d.deviceId} value={d.deviceId}>
								{d.label || `Camera ${i + 1}`}
							</option>
						))}
					</select>
				)}
				<div className='barcode-scanner-manual'>
					<input
						className='barcode-scanner-input'
						type='text'
						inputMode='numeric'
						placeholder='Or type the barcode digits'
						value={manualCode}
						onChange={(e) => { setManualCode(e.target.value); setManualError(''); }}
						onKeyDown={(e) => {
							if (e.key === 'Enter') { e.preventDefault(); submitManual(); }
						}}
						autoComplete='off'
					/>
					<button type='button' className='barcode-scanner-submit' onClick={submitManual}>
						Look up
					</button>
				</div>
				{manualError && <p className='barcode-scanner-manual-error'>{manualError}</p>}
			</div>
		</div>,
		document.body
	);
}

export default BarcodeScanner;
