UPDATE users
    SET balance = (SELECT COALESCE(balance, 0) FROM user_casebucks WHERE user = users.discord_name);

DROP TABLE user_casebucks;
DROP TABLE admins;
