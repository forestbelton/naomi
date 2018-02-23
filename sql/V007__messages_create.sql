CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sendtime TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    user TEXT NOT NULL,
    discriminator INTEGER NOT NULL,
    channel INTEGER NOT NULL,
    server TEXT NOT NULL
);
