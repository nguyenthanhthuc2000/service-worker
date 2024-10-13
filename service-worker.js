const CACHE_NAME = 'v1';

const addResourceToCache = async (resource) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(resource);
}

const cacheFirst = async (request) => {
  const cache = await caches.open(CACHE_NAME); // Đặt tên cho cache

  // Kiểm tra xem phản hồi có trong cache không
  const responseFromCache = await cache.match(request);
  if (responseFromCache) {
    // Fetch the latest resource in the background
    fetch(request)
      .then((response) => {
        // Update the cache with the latest version
        if (response && response.ok) {
          cache.put(request, response.clone());
        }
      })
      .catch((error) => {
        console.error('Fetch failed:', error);
      });
    return responseFromCache; // Return cached response
  }

  // Nếu không có trong cache, fetch từ mạng
  try {
    const responseFromNetwork = await fetch(request);

    // Update the cache with the network response
    if (responseFromNetwork && responseFromNetwork.ok) {
      cache.put(request, responseFromNetwork.clone());
    }

    return responseFromNetwork;
  } catch (error) {
    console.error('Network request failed:', error);
    throw error; // Hoặc xử lý lỗi theo cách khác
  }
};


self.addEventListener('install', async (event) => {
  event.waitUntil(
    addResourceToCache([
      '/images/cache-first.gif', 
      '/images/pexels-alinaskazka-28859391.jpg', 
      '/images/pexels-aljona-ovtsinnikova-121486965-27363152 (1).jpg', 
      '/images/pexels-efrem-efre-2786187-28763589.jpg', 
      '/images/pexels-erika-andrade-1358382831-28874283.jpg', 
      '/images/pexels-ertabbt-150087708-19025446.jpg', 
      '/images/pexels-eugenia-remark-5767088-28856736.jpg', 
      '/images/pexels-jan-van-bizar-92378004-12266858.jpg', 
      '/images/pexels-leefinvrede-27015911.jpg', 
      '/images/pexels-lvu-image-1599405908-28570315.jpg', 
      '/images/cache-only.jpg', 
      '/images/network-first.jpg', 
      '/images/network-only.jpg', 
      '/images/stale-while-revalidate.jpg', 
      '/images/pexels-ryank-21193046.jpg', 
      '/images/pexels-ryank-21193046 (1).jpg', 
      '/images/pexels-premsinghtanwar-25189329.jpg', 
      '/images/pexels-pincalo-18936031.jpg', 
      '/images/pexels-njeromin-28772394.jpg', 
      '/images/pexels-nikitapishchugin-28494944.jpg', 
      '/images/pexels-nati-87264186-28716782.jpg',
      '/images/favicon.ico',
      '/style.css',
      '/index.html',
    ]),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheFirst(event.request));
});