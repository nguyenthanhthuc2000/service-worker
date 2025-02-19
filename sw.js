// Tài liệu: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

const CACHE_NAME = 'test17777';
const imagesToCache = [
  '/images/pexels-alinaskazka-28859391.jpg',
  '/images/pexels-efrem-efre-2786187-28763589.jpg',
  '/images/pexels-aljona-ovtsinnikova-121486965-27363152 (1).jpg',
  '/images/pexels-erika-andrade-1358382831-28874283.jpg',
  '/images/pexels-ertabbt-150087708-19025446.jpg',
  '/images/pexels-eugenia-remark-5767088-28856736.jpg',
];

// Thêm data vào cache
const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(resources);
};

// Cập nhật cache với phiên bản mới nhất
const updateCache = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Network fetch failed:', error);
    return null;
  }
};

// Ưu tiên data từ cache
const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    updateCache(request);
    return responseFromCache;
  }
  
  return updateCache(request) || fetch(request); 
};

// Xoá cache cũ
const deleteCache = async (key) => {
  console.log(key);
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = [CACHE_NAME];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  console.log(cachesToDelete)
  await Promise.all(cachesToDelete.map(deleteCache));
};

// Bắt sự kiện install
self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      ...imagesToCache
    ]).then(() => self.skipWaiting()) // Skip waiting để kích hoạt SW mới,
  );
});

// Xử lí khi client gửi request
self.addEventListener("fetch", (event) => {
  // Chỉ xử lý các request GET, bỏ qua các loại khác (POST, PUT, v.v.)
  if (event.request.method === 'GET') {
    event.respondWith(cacheFirst(event.request));
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    deleteOldCaches()
      .then(() => {
        return clients.claim();  // Claim tất cả các client hiện tại
      })
  );
});