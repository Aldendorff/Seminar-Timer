/* Firebase Messaging service worker – muss im selben GitHub-Pages-Verzeichnis wie index.html liegen. */
importScripts("https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAMNBryf4qdNLiIrc2T-2oHcXYexG1jWSk",
  authDomain: "seminar-timer.firebaseapp.com",
  databaseURL: "https://seminar-timer-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "seminar-timer",
  storageBucket: "seminar-timer.firebasestorage.app",
  messagingSenderId: "353748281033",
  appId: "1:353748281033:web:f1db0c2ab7210fcf054f18"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  // Bei Notification-Payload zeigt FCM im Hintergrund üblicherweise selbst an.
  // Für reine Data-Payloads bleibt dies als Fallback erhalten.
  if (payload.notification) return;
  const title = payload.data?.title || "🙋 Hilferuf";
  const options = {
    body: payload.data?.body || "Eine Gruppe benötigt Hilfe.",
    icon: "./icons/icon-192.png",
    badge: "./icons/icon-192.png",
    tag: payload.data?.requestId || "seminar-help",
    requireInteraction: true,
    data: { url: payload.data?.adminUrl || "./?admin=1" }
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification?.data?.url || "./?admin=1";
  event.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then((windows) => {
    for (const client of windows) {
      if ("focus" in client) { client.navigate(target); return client.focus(); }
    }
    return clients.openWindow ? clients.openWindow(target) : undefined;
  }));
});
