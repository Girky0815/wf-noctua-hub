const BASE_URL = 'https://api.warframestat.us/pc';

export class APIClient {
  static async fetcher<T>(path: string): Promise<T> {
    const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

    // Add language header for localized responses if API supports it (Warframe Status API supports 'Accept-Language')
    const headers = {
      'Accept-Language': 'ja'
    };

    const res = await fetch(url, { headers });

    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');
      // Attach extra info to the error object.
      // @ts-expect-error - Custom error property
      error.info = await res.json();
      // @ts-expect-error - Custom error property
      error.status = res.status;
      throw error;
    }

    return res.json();
  }
}
