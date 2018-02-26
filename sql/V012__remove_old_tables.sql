UPDATE users
    SET balance = COALESCE((SELECT balance FROM user_casebucks WHERE user = users.discord_name), 0);

DROP TABLE user_casebucks;
DROP TABLE admins;
