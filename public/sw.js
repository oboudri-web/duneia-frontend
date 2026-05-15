self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {}
  const options = {
    body: data.body || 'Reviens réviser sur DuneIA !',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || 'https://duneia.fr/app' },
    actions: [
      { action: 'open', title: 'Ouvrir DuneIA' },
      { action: 'close', title: 'Plus tard' }
    ]
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'DuneIA 🎓', options)
  )
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  if(event.action === 'open' || !event.action) {
    event.waitUntil(clients.openWindow(event.notification.data.url))
  }
})
