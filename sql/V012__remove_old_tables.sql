UPDATE users
    SET balance = (SELECT balance FROM user_casebucks WHERE user = users.discord_name);

DROP TABLE user_casebucks;
DROP TABLE admins;
