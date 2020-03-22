importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}

workbox.setConfig({ debug: true });

workbox.routing.registerRoute(
    /\.js$/,
    new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
    /\.css$/,
    new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
    /cougargrades\.github\.io\/assets\//,
    new workbox.strategies.CacheFirst()
)
