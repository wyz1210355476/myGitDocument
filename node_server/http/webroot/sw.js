self.addEventListener('fetch', function(event) {  
  if (/\.jpg$/.test(event.request.url)) {            
    event.respondWith(fetch('ads5.jpg'));
  }
});