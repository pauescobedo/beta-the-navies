#!/usr/bin/env python3
import base64
import secrets
import urllib.parse

issuer = "The Navies"
account = "The Navies"
totp_secret = base64.b32encode(secrets.token_bytes(20)).decode().rstrip("=")
session_secret = secrets.token_urlsafe(48)
label = urllib.parse.quote(account)
query = urllib.parse.urlencode({"secret": totp_secret, "issuer": issuer, "algorithm": "SHA1", "digits": 6, "period": 30})

print("CLAVE PARA GOOGLE AUTHENTICATOR (TOTP_SECRET):")
print(totp_secret)
print("\nSECRETO DE SESIÓN (SESSION_SECRET):")
print(session_secret)
print("\nURI DE CONFIGURACIÓN:")
print(f"otpauth://totp/{label}?{query}")
print("\nNo guardes estos valores en GitHub ni en archivos públicos.")
