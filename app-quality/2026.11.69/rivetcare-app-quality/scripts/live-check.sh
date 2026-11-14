#!/usr/bin/env bash
# Read-only live checks. Usage: live-check.sh [base_url] [expected_zip_sha256]
set -u
U=${1:-https://pine-coral-clover-charm.grok.me}; EXP=${2:-}; APP_NAME=${APP_NAME:-RivetCare}
H=${U#https://}; T=$(mktemp -d)
echo "== version";  curl -sS "$U/version.txt"; echo
echo "== sw cache"; curl -sS "$U/sw.js" | grep -oE '(rivetcare|silverbook)-shell-[0-9.]+' | head -1
echo "== headers";  curl -sSI "$U/" | grep -iE '^(HTTP|content-security-policy|strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy|cross-origin)'
echo "== http->https (expect 301/308 to https)"; curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' "http://$H/"
echo "== head links (expect exactly 1 manifest, 1 apple-touch-icon)"
curl -sS --compressed "$U/" -o "$T/home.html"
grep -ao '<link[^>]*rel="\(manifest\|apple-touch-icon\)"[^>]*>' "$T/home.html"
echo "manifest links: $(grep -ao 'rel="manifest"' "$T/home.html" | wc -l)  apple-touch-icon: $(grep -ao 'rel="apple-touch-icon"' "$T/home.html" | wc -l)"
echo "== manifests (expect name RivetCare (or $APP_NAME), no #000000)"
for p in manifest.webmanifest __grok/manifest.webmanifest; do printf '%s: ' "$p"; curl -sS "$U/$p" | tr -d '\n ' | grep -oE '"name":"[^"]*"|"theme_color":"[^"]*"' | tr '\n' ' '; echo; done
echo "== Q08 scripts without integrity (third-party/extension scripts)"
grep -aoE '<script[^>]*src="[^"]*"[^>]*>' "$T/home.html" | grep -v integrity
echo "== status codes"
for p in robots.txt .well-known/security.txt security.txt silverbullet-icon-splash.zip silverbullet-book.zip rivetcare-book.zip; do curl -sS -o /dev/null -w "$p %{http_code}\n" "$U/$p"; done
echo "== robots.txt"; curl -sS "$U/robots.txt"; echo
ZN=$(curl -sS "$U/robots.txt" | grep -oE "Disallow: /[^ ]*\.zip" | head -1 | cut -d/ -f2); ZN=${ZN:-silverbullet-book.zip}
echo "== public zip hash ($ZN, path taken from robots.txt Disallow)"; C=$(curl -sS "$U/$ZN" -o "$T/live.zip" -w "%{http_code}"); [ "$C" = 200 ] || { echo "zip HTTP $C, not hashed"; exit 0; }; S=$(sha256sum "$T/live.zip" | cut -d' ' -f1); echo "$S $(stat -c%s "$T/live.zip") B"
if [ -n "$EXP" ]; then [ "$S" = "$EXP" ] && echo "ZIP UNCHANGED" || echo "ZIP CHANGED (saved $T/live.zip)"; fi
