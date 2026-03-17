import React from 'react';
import './PrivacyPolicy.css';

function PrivacyPolicy() {
	return (
		<div className='privacy-page'>
			<div className='privacy-content'>
				<h1>Privacy Policy</h1>
				<p className='privacy-updated'>Last updated: March 2026</p>

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
					<h2>Third-party services</h2>
					<ul>
						<li><strong>Clerk</strong> — handles authentication and session management. See <a href='https://clerk.com/privacy' target='_blank' rel='noreferrer'>Clerk's privacy policy</a>.</li>
						<li><strong>Google OAuth</strong> — used to sign you in. See <a href='https://policies.google.com/privacy' target='_blank' rel='noreferrer'>Google's privacy policy</a>.</li>
						<li><strong>Discogs</strong> — used to search and auto-fill album metadata. Searches are made server-side; no personal data is sent to Discogs. See <a href='https://www.discogs.com/privacy' target='_blank' rel='noreferrer'>Discogs' privacy policy</a>.</li>
					</ul>
				</section>

				<section>
					<h2>Data storage</h2>
					<p>Your catalog data is stored in a private database. Authentication is managed by Clerk. We do not store your Google password or payment information of any kind.</p>
				</section>

				<section>
					<h2>Your rights</h2>
					<p>You can delete your records at any time from within the app. To request full account deletion, contact us at the email below.</p>
				</section>

				<section>
					<h2>Contact</h2>
					<p>Questions? Reach out at <a href='mailto:chavi@example.com'>chavi@example.com</a>.</p>
				</section>
			</div>
		</div>
	);
}

export default PrivacyPolicy;
