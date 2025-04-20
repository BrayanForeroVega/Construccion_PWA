// Nombre de cache y versión
const CACHE_NAME = 'pwaV1';

// Archivos para el cacheo de la app se colocan en un array
let urlCache = [
    '../',
    '../css/estilos.css',
    '../js/js.js',
    '../img/usuario.png',
    '../images/16_1.jpg',
    '../images/18_1.jpg',
    '../images/asesoria.jpg',
    '../images/Video 2.mp4',
    



];

// Instalar la app con el evento install y va a guardar en cache urlCache
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlCache)
            .then(()=>{
                self.skipWaiting();
            });
        })
        .catch(err => {
            console.error("No se ha registrado la cache" + err);
        })
    )
});

// Activar la app con el evento activate
self.addEventListener("activate", event => {
   async function deleteOldCaches() {
    const names = await caches.keys();
    await Promise.all(names.map(name =>{
        if (name !== CACHE_NAME) {
            return caches.delete(name);
        }
    }));
   }
   event.waitUntil(deleteOldCaches());
   self.clients.claim(); 
});

// Método fetch
self.addEventListener("fetch", (e) => {
    caches.match(e.request).then((r) => {
        console.log("[Servicio Worker] Obteniendo recurso: " + e.request.url);
        return (r || fetch(e.request).then((response) => {
            return caches.open(CACHE_NAME).then((cache) => {
                console.log("[Servicio Worker] Almacena el nuevo recurso: " + e.request.url);
                cache.put(e.request, response.clone());
            });
        }));
    });
});