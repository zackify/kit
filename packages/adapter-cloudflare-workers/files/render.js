import { render } from './app.js';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

addEventListener('fetch', (event) => {
	event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
	//try static files first
	if (event.request.method == 'GET') {
		try {
			return await getAssetFromKV(event);
		} catch (e) {
			if (!e instanceof NotFoundError) {
				return new Response('Error loading static asset:' + (e.message || e.toString()), {
					status: 500
				});
			}
		}
	}

	//fall back to an app route
	const request = event.request;
	const request_url = new URL(request.url);

	try {
		const rendered = await render({
			host: request_url.host,
			path: request_url.pathname,
			query: request_url.searchParams,
			body: request.body,
			method: request.method
		});

		if (rendered) {
			const response = new Response(rendered.body, {
				status: rendered.status,
				headers: rendered.headers
			});
			return response;
		}
	} catch (e) {
		return new Response('Error rendering route:' + (e.message || e.toString()), { status: 500 });
	}

	return new Response({
		status: 404,
		statusText: 'Not Found'
	});
}
