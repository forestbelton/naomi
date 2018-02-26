CREATE TABLE users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    createdate TEXT NOT NULL,
    discord_id TEXT,
    discord_name TEXT,
    balance INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX users_discord_id_idx ON users(discord_id);

-- Migrate admins
INSERT INTO users (createdate, discord_id)
    SELECT createdate, user_id AS discord_id FROM admins;

