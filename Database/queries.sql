USE ml_heroes;

SELECT * FROM roles;
SELECT * FROM hero_roles;
SELECT * FROM heroes;
SELECT h.id, h.name, h.image_url, tbl.roles, h.description FROM heroes h INNER JOIN (SELECT hero_id, GROUP_CONCAT(r.role SEPARATOR ' / ') AS roles FROM hero_roles hr INNER JOIN roles r ON hr.role_id = r.id GROUP BY hero_id) tbl ON h.id = tbl.hero_id;

-- DELETE FROM heroes WHERE id = 6;