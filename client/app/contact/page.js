'use client';
import { useState } from 'react';

export default function Contact() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [sent, setSent] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		// dummy submit — you can hook this to your backend endpoint
		console.log({ name, email, message });
		setSent(true);
		setName(''); setEmail(''); setMessage('');
	};

	return (
		<section className="max-w-3xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-4">Contact Us</h1>
			{sent && <p className="mb-4 text-green-600">Message sent (demo)</p>}
			<form onSubmit={handleSubmit} className="space-y-4">
				<input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" required />
				<input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
				<textarea placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} className="w-full p-2 border rounded" rows="6" required />
				<button className="bg-purple-600 text-white px-4 py-2 rounded">Send</button>
			</form>
		</section>
	);
}
