import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, fetch }) => {
    const { word } = params;

    if (!word) {
        return json({ error: 'Word parameter is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        if (!response.ok) {
            if (response.status === 404) {
                return json({ error: 'Word not found' }, { status: 404 });
            }
            return json({ error: 'Failed to fetch data from upstream API' }, { status: response.status });
        }

        const data = await response.json();
        return json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
};