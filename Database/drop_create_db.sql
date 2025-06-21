DROP DATABASE IF EXISTS ml_heroes;
CREATE DATABASE ml_heroes;

USE ml_heroes;

CREATE TABLE hero_roles
(
	id INT,
    hero_id INT,
    role_id INT
);

CREATE TABLE heroes 
(
	id INT, 
    name VARCHAR(50),
    image_url VARCHAR(150),
    description VARCHAR(150)
);

CREATE TABLE roles 
(
	id INT,    
    role VARCHAR(50),
    logo_url VARCHAR(150),
    primary_function VARCHAR(150),
    key_attributes VARCHAR(150)
);

INSERT INTO hero_roles(id, hero_id, role_id) VALUES 
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5),
(6, 6, 3),
(7, 6, 5);

INSERT INTO heroes(id, name, image_url, description) VALUES 
(1, 'Gloo', 'https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage_1_9_642/100_8b401d50920f2359060a9c7a3c833df1.png', 'A mysterious creature that can split into many smaller ones.'),
(2, 'Lukas', 'https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage_1_9_20/100_454c13b2de7b7d1a20fbf553c620510d.png', 'A legendary Sacred Beast that can take the form of a ranbunctious young man.'),
(3, 'Nolan', 'https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_0495066df0d828c149e7fe89aa63078b.png', 'A scholar that wanders the universe with split souls to save his daughter.'),
(4, 'Zhuxin', 'https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage_92/100_13cfeec4bec7a27a09677e519f1ef9d2.png', 'A mysterious young woman who guides the ember butterflies using her Lantern ...'),
(5, 'Hanabi', 'https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_85d213390613bbc09220cf1d9f64c5c0.png', 'Leader of the Scarlet Sect, in the Scarlet Shadow of the Cadia Riverlands.'),
(6, 'Lesley', 'https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_f4f42410c90f84e4d46b129d5e8887e8.png', 'Adopted daughter of House Vance, a clandestine sniper.');

INSERT INTO roles(id, role, logo_url, primary_function, key_attributes) VALUES 
(1, 'Tank', 'https://static.wikia.nocookie.net/mobile-legends/images/f/f0/Tank_Icon.png', 'Protect teammates, soak damage, and initiate team fights.', 'High health, defense, and crowd control.'),
(2, 'Fighter', 'https://static.wikia.nocookie.net/mobile-legends/images/1/1a/Fighter_Icon.png', 'Balance damage and durability, capable of engaging in fights and soaking damage.', 'Balanced stats, good damage output, and decent survivability.'),
(3, 'Assassin', 'https://static.wikia.nocookie.net/mobile-legends/images/3/3f/Assassin_Icon.png', 'Quickly eliminate enemy heroes in team fights.', 'High burst damage, mobility, and stealth.'),
(4, 'Mage', 'https://static.wikia.nocookie.net/mobile-legends/images/5/53/Mage_Icon.png', 'Deal high magic damage, often with range and crowd control.', 'High magic power, magical damage, and often crowd control.'),
(5, 'Marksman', 'https://static.wikia.nocookie.net/mobile-legends/images/1/10/Marksman_Icon.png', 'Deal high physical damage, primarily from a distance.', 'High attack speed, physical damage, and ranged attack.');

ALTER TABLE hero_roles MODIFY id INT AUTO_INCREMENT PRIMARY KEY;
ALTER TABLE heroes MODIFY id INT AUTO_INCREMENT PRIMARY KEY;
ALTER TABLE roles MODIFY id INT AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE hero_roles ADD CONSTRAINT fk_hero_id FOREIGN KEY (hero_id) REFERENCES heroes(id) ON DELETE CASCADE;
ALTER TABLE hero_roles ADD CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(id);