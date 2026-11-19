import React from 'react';
// Named LegalPage rather than PrivacyPolicy: ad blockers (e.g. Brave Shields) block
// dev-server module paths containing "PrivacyPolicy", which blanks the whole app
import './LegalPage.css';

function LegalPage() {
	return (
		<div className='privacy-page'>
			<div className='privacy-content'>
				<h1>Privacy Policy</h1>
				<p className='privacy-updated'>Last updated: November 2026</p>

				<section>
					<h2>What this app is</h2>
					<p>Deep Cuts is a personal vinyl catalog app. It lets you log, browse, and manage your record collection.</p>
				</section>

				<section>
					<h2>What data we collect</h2>
					<p>When you sign in with Google, we receive your name, email address, and profile picture from Google. This is used only to identify your account and display your avatar.</p>
					<p>We store the records you add: album titles, artists, genres, labels, dates, cover art URLs, tracklists, and notes.</p>
				</section>

				<section>
					<h2>How we use your data</h2>
					<p>Your data is used solely to power your personal catalog. We do not sell, share, or use your data for advertising or analytics.</p>
				</section>

				<section>
					<h2>Camera and barcode scanning</h2>
					<p>If you use the barcode scanner, the app asks your browser for camera access. The camera feed is processed entirely on your device to read the barcode — no images or video are recorded, stored, or sent anywhere. Only the barcode number is sent to our server to look up the record on Discogs.</p>
					<p>The camera turns off as soon as a barcode is read or the scanner is closed, and you can revoke camera access at any time in your browser settings.</p>
				</section>

				<section>
					<h2>Cookies</h2>
					<p>Clerk sets cookies to keep you signed in. Deep Cuts does not use tracking or advertising cookies.</p>
				</section>

				<section>
					<h2>Third-party services</h2>
					<ul>
						<li><strong>Clerk</strong> — handles authentication and session management. See <a href='https://clerk.com/privacy' target='_blank' rel='noreferrer'>Clerk's privacy policy</a>.</li>
						<li><strong>Google OAuth</strong> — used to sign you in. See <a href='https://policies.google.com/privacy' target='_blank' rel='noreferrer'>Google's privacy policy</a>.</li>
						<li><strong>Discogs</strong> — used to search and auto-fill album metadata. Searches are made server-side; no personal data is sent to Discogs. Cover art is loaded directly from Discogs' image servers, so Discogs can see your IP address when those images load, as with any image on the web. See <a href='https://www.discogs.com/privacy' target='_blank' rel='noreferrer'>Discogs' privacy policy</a>.</li>
						<li><strong>Railway</strong> — hosts our server and the PostgreSQL database where your catalog is stored. See <a href='https://railway.com/legal/privacy' target='_blank' rel='noreferrer'>Railway's privacy policy</a>.</li>
						<li><strong>Vercel</strong> — serves the app's web pages. See <a href='https://vercel.com/legal/privacy-notice' target='_blank' rel='noreferrer'>Vercel's privacy policy</a>.</li>
					</ul>
				</section>

				<section>
					<h2>Data storage</h2>
					<p>Your catalog data is stored in a private PostgreSQL database hosted on Railway. Authentication is managed by Clerk. We do not store your Google password or payment information of any kind.</p>
				</section>

				<section>
					<h2>Your rights</h2>
					<p>You can delete your records at any time from within the app. To request full account deletion, contact us at the email below.</p>
				</section>

				<section>
					<h2>Contact</h2>
					<p>Questions? Reach out at <a href='mailto:deepcutsapp@icloud.com'>deepcutsapp@icloud.com</a>.</p>
				</section>
			</div>
		</div>
	);
}

export default LegalPage;
