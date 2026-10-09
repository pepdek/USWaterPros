#!/usr/bin/env bash
# CI check: (1) retired prices must not appear anywhere in source, (2) every dollar amount must live in lib/pricing.ts.
# Excludes tests, docs, node_modules, build output. Lines about trillions/billions (infrastructure stats) are not prices.
set -euo pipefail
cd "$(dirname "$0")/.."
FILES=$(find app components lib next.config.js -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.css' \) ! -name '*.test.ts' ! -path 'lib/pricing.ts')
fail=0

BANNED='from \$2,700|\$2,700|\$2,699|\$2,199|\$1,800|\$899|\$1,200|\$4,000|\$26\.99|2700|2699|2199|1800'
if echo "$FILES" | xargs grep -nE "$BANNED" | grep -vE 'trillion|billion|million'; then
  echo "FAIL: retired price found (see lines above)"; fail=1
fi

# Any literal "$<digit>" outside lib/pricing.ts is a hardcoded price.
for f in $FILES; do
  perl -ne 'if (/\$\d/ && !/trillion|billion|million/) { print "$ARGV:$.: $_"; $bad=1 } END { exit($bad ? 1 : 0) }' "$f" || fail=1
done
if [ "$fail" -ne 0 ]; then echo "FAIL: hardcoded prices found. Move them into lib/pricing.ts"; exit 1; fi
echo "OK: no retired prices, no hardcoded prices outside lib/pricing.ts"
