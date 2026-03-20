# Legal Calendar Mobile (Expo + EAS)

Questa app mobile usa una WebView verso il sito Next.js e supporta notifiche push via OneSignal.

## Configurazione richiesta

Aggiorna `app.json` in `expo.extra`:

- `webBaseUrl`: URL pubblico del tuo Next.js (Railway)
- `clerkPublishableKey`: chiave publishable Clerk
- `oneSignalAppId`: App ID OneSignal
- `eas.projectId`: project id EAS (creato dopo `eas init`)

Imposta anche queste variabili nel backend Next.js:

- `ONESIGNAL_APP_ID`
- `ONESIGNAL_REST_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## Build cloud (EAS)

1. Login Expo:
   - `npx eas login`
2. Inizializza progetto EAS:
   - `npx eas init`
3. Build interna:
   - `npm run build:android:internal`
   - `npm run build:ios:internal`
4. Build produzione:
   - `npm run build:android:prod`
   - `npm run build:ios:prod`

## Submit agli store

- Android (Play Console):
  - `npm run submit:android`
- iOS (App Store Connect):
  - `npm run submit:ios`

Nota: richiede credenziali account Expo/Apple/Google e configurazione signing.

## Test minimi consigliati

1. Login utente in app.
2. Verifica caricamento WebView con URL corretto.
3. Registra il device su `/api/notifications/subscribe`.
4. Configura preferenze utente su `/api/notifications/preferences`.
5. Invia notifica evento (manuale) con `/api/notifications/send-event`.
6. Tap su notifica apre `?eventId=<id>` e la modal evento nella pagina calendario.
