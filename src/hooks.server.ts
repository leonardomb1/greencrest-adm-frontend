import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) => paraglideMiddleware(event.request, ({ request, locale }) => {
	event.request = request;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
	});
});

const handleAuth: Handle = async ({event, resolve}) => {
	const token = event.cookies.get('token');

	if (token) {
		event.locals.token = token;
	}

	if (!token && event.url.pathname !== '/login') {
		redirect(303, '/login');
	}

	return resolve(event)
}

export const handle: Handle = sequence(handleParaglide, handleAuth);
