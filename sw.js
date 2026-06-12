// VEOS Post-Op Medication Tracker - Service Worker
const CACHE_NAME = 'veos-postop-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});

// Handle scheduled notifications via postMessage
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, delay, tag } = event.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body: body,
        icon: './icon.png',
        badge: './icon.png',
        tag: tag,
        requireInteraction: true,
        actions: [
          { action: 'taken', title: '✅ Taken' },
          { action: 'snooze', title: '⏰ Snooze 30 min' }
        ]
      });
    }, delay);
  }
});
