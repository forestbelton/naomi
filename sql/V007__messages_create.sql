CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sendtime TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    user TEXT NOT NULL,
    discriminator INTEGER NOT NULL,
    channel INTEGER NOT NULL,
    server TEXT NOT NULL
);

CREATE UNIQUE INDEX user_index ON messages(user);
CREATE UNIQUE INDEX channel_index ON messages(channel);
CREATE UNIQUE INDEX server_index ON messages(server);
