#!/usr/bin/env bash
# Scoped helper: PUT a workflow payload to this project's n8n instance.
# Usage: n8n_workflow_put.sh <workflow_id> <payload_json_file> <output_file>
# Requires N8N_KEY to be exported by the caller (the n8n API key).
set -euo pipefail

WORKFLOW_ID="$1"
PAYLOAD_FILE="$2"
OUTPUT_FILE="$3"
N8N_BASE="https://raregoat-n8n.cloudfy.live"

: "${N8N_KEY:?N8N_KEY must be set (export N8N_KEY=\$(cat .n8n_key))}"

curl -sS -X PUT \
  -H "X-N8N-API-KEY: ${N8N_KEY}" \
  -H "Content-Type: application/json" \
  --data "@${PAYLOAD_FILE}" \
  "${N8N_BASE}/api/v1/workflows/${WORKFLOW_ID}" \
  -o "${OUTPUT_FILE}" \
  -w "HTTP %{http_code}\n"
