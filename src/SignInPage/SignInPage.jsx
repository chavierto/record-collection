import React from 'react';
import { SignIn } from '@clerk/react';
import './SignInPage.css';

function SignInPage() {
	return (
		<div className='sign-in-page'>
			<SignIn routing='path' path='/sign-in' afterSignInUrl='/records' />
		</div>
	);
}

export default SignInPage;
