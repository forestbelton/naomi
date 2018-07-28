CREATE TABLE IF NOT EXISTS casebucks_events(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    createdate TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user TEXT NOT NULL,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL
);

CREATE INDEX casebucks_events_user_idx ON casebucks_events(user);

-- Indexes were created as "UNIQUE"
DROP INDEX IF EXISTS user_index;
DROP INDEX IF EXISTS channel_index;
DROP INDEX IF EXISTS server_index;
