CREATE TABLE IF NOT EXISTS blackjack_scores(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    createdate TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user TEXT NOT NULL,
    win INT NOT NULL DEFAULT 0,
    lose INT NOT NULL DEFAULT 0
);

CREATE INDEX blackjack_scores_user_idx ON blackjack_scores(user);