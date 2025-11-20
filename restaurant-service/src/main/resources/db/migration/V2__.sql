CREATE TABLE menu
(
    id            BIGINT AUTO_INCREMENT NOT NULL,
    name          VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    restaurant_id BIGINT NULL,
    CONSTRAINT pk_menu PRIMARY KEY (id)
);

CREATE TABLE menu_item
(
    id            BIGINT AUTO_INCREMENT NOT NULL,
    name          VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    price DOUBLE NOT NULL,
    menu_id       BIGINT NULL,
    CONSTRAINT pk_menuitem PRIMARY KEY (id)
);

CREATE TABLE restaurant
(
    id            BIGINT AUTO_INCREMENT NOT NULL,
    name          VARCHAR(255) NULL,
    address       VARCHAR(255) NULL,
    phone_number  VARCHAR(255) NULL,
    email         VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    CONSTRAINT pk_restaurant PRIMARY KEY (id)
);

ALTER TABLE menu_item
    ADD CONSTRAINT FK_MENUITEM_ON_MENU FOREIGN KEY (menu_id) REFERENCES menu (id);

ALTER TABLE menu
    ADD CONSTRAINT FK_MENU_ON_RESTAURANT FOREIGN KEY (restaurant_id) REFERENCES restaurant (id);