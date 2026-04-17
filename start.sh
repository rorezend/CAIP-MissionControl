#!/bin/sh
DB_PATH="/data/mission-control.db"
if [ ! -f "$DB_PATH" ]; then
  echo "[init] No database found at $DB_PATH — creating from seed..."
  cp /app/prisma/seed.db "$DB_PATH"
  echo "[init] Database initialized."
else
  echo "[init] Existing database found at $DB_PATH"
fi
export DATABASE_URL="file:$DB_PATH"
exec node server.js
