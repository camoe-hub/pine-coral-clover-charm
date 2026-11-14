#!/usr/bin/env bash
# Full toolchain audit on a scratch copy. Usage: audit-run.sh <zip> <workdir> [grok_fixture_dir]
set -u
Z=$1; W=$2; G=${3:-/workspace/app-quality/run-r3/.grok}
N22=/workspace/tools/node-v22.23.4-linux-x64/bin; N20=${N20:-/workspace/tools/node-v20.20.2-linux-x64/bin}
rm -rf "$W/src" && mkdir -p "$W" && unzip -q "$Z" -d "$W/src" && cd "$W/src" || exit 1
echo "version: $(node -p 'require("./package.json").version')"
npm ci >"$W/ci.log" 2>&1; echo "npm ci exit=$?"
npx tsc --noEmit >"$W/tc.log" 2>&1; echo "typecheck exit=$?"
npx eslint . >"$W/lint.log" 2>&1; echo "lint: $(tail -2 "$W/lint.log" | grep problems)"
npm audit --omit=dev 2>&1 | grep -E 'found|vulnerabilit' | head -2
TS="src/lib/app-data/app-data.test.ts src/lib/app-data/readiness-schedule.test.ts src/lib/auth/gate-identity.test.ts src/lib/auth/sign-in-gate.test.ts src/lib/auth/access-decision.test.ts src/lib/preview-path-prefix.test.ts src/lib/weights.test.ts src/lib/backup-look.test.ts"
AL="src/data/fitment.test.ts src/lib/restore-undo.test.ts src/lib/schedule-link.test.ts"
for nb in "$N20" "$N22" /usr/local/bin; do [ -x "$nb/node" ] || { echo "-- $nb/node missing, not checked"; continue; }
  echo "-- node $("$nb/node" -v) script tests (as shipped)"
  "$nb/node" --test --test-reporter=tap scripts/*.test.mjs >"$W/t.log" 2>&1; grep -E '^# (tests|pass|fail)' "$W/t.log" | tr '\n' ' '; echo; grep '^not ok' "$W/t.log"
done
echo "-- TS tests (node22)"; "$N22/node" --experimental-strip-types --test $TS 2>&1 | grep -E '^# (tests|pass|fail)' | tr '\n' ' '; echo
echo "-- alias tests (node22)"; "$N22/node" --import ./scripts/alias-hooks.mjs --experimental-strip-types --test $AL 2>&1 | grep -E '^# (tests|pass|fail)' | tr '\n' ' '; echo
if [ -d "$G" ]; then echo "-- restored .grok + pack-source (node22)"; cp -r "$G" .grok; "$N22/node" scripts/pack-source.mjs >/dev/null 2>&1; "$N22/node" --test scripts/*.test.mjs 2>&1 | grep -E '^# (tests|pass|fail)|^not ok' | tr '\n' ' '; echo; fi
echo "-- data checks"
f=$(find . -name shops.json -not -path '*/node_modules/*' | head -1); [ -n "$f" ] && node -e "const s=require('$PWD/$f');const a=Array.isArray(s)?s:s.shops;console.log('Q47 shops',a.length,'no hours',a.filter(x=>!x.hours).length,'no lat',a.filter(x=>x.lat==null).length)"
grep -n 'PREVIEW_CLIENT_SECRET *=' src/lib/auth/preview.ts | sed 's/^/Q02 /'
echo "Q15 slice(0,200) in store.ts: $(grep -c 'slice(0, *200)' src/lib/store.ts)"
grep -n 'overflow-x-auto' src/components/print-view.tsx | sed 's/^/Q53 /'
