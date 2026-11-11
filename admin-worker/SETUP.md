# Activar la administración segura

Este servicio valida códigos de Google Authenticator sin publicar la clave secreta en la web.

1. Crea un Worker en Cloudflare y usa `worker.js` como código.
2. Copia `wrangler.toml.example` como `wrangler.toml` si lo despliegas con Wrangler.
3. Ejecuta `python3 generate_admin_setup.py` en tu ordenador.
4. En Google Authenticator, pulsa **Añadir código → Introducir clave de configuración**.
5. Usa `The Navies` como nombre y pega el valor `TOTP_SECRET` generado.
6. Guarda `TOTP_SECRET` y `SESSION_SECRET` como secretos privados del Worker:
   - `npx wrangler secret put TOTP_SECRET`
   - `npx wrangler secret put SESSION_SECRET`
7. Despliega el Worker con `npx wrangler deploy`.
8. Copia su URL en `admin-config.js`, por ejemplo:
   `window.NAVIES_ADMIN_API_URL = 'https://the-navies-admin.tu-cuenta.workers.dev';`

La sesión administrativa dura diez minutos. El botón de extensión aparece cuando quedan dos minutos o menos y genera otra sesión de diez minutos.

Nunca subas `wrangler.toml` si contiene datos privados ni escribas las claves dentro de `worker.js`, `admin.js` o `admin-config.js`.
