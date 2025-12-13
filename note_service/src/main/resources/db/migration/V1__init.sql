CREATE TABLE IF NOT EXISTS ratings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
    comment VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ratings_restaurant (restaurant_id),
    INDEX idx_ratings_user (user_id)
);

