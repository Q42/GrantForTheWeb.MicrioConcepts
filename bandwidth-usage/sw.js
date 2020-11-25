/**
 * Hook into the fetch request to read the response header for content-length
 * and send it through the SW client to be read in the normal JS context.
 */
self.addEventListener('fetch', (event) =>
  fetch(event.request).then((response) => {
    console.log(event.request.url);

    if (
      !event.request.url.startsWith('https://b.micr.io') ||
      event.request.url === 'https://b.micr.io/micrio-3.0.min.js'
    )
      return;

    response.headers.forEach(async (val, key) => {
      if (key === 'content-length') {
        const client = await clients.get(event.clientId);
        client.postMessage({
          contentLength: val,
        });
      }
    });
  })
);
