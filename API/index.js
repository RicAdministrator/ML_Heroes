const Joi = require('joi');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "ml_heroes"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

// roles > create
app.post('/api/roles', (req, res) => {
    const { error } = validateRole(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const selectRoleQuery = `SELECT * FROM roles WHERE role = '${req.body.role}'`;

    con.query(selectRoleQuery, function (err, result, fields) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        const roles = JSON.parse(JSON.stringify(result));

        if (roles.length > 0) {
            const resJSON = {
                error: "Role already exists"
            };

            return res.status(400).send(resJSON);
        }
        else {

            var sql = `INSERT INTO roles (role, logo_url, primary_function, key_attributes) VALUES ('${req.body.role}', '${req.body.logo_url}', '${req.body.primary_function}', '${req.body.key_attributes}')`

            con.query(sql, function (err, resultInsert) {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Database error");
                }

                const role = {
                    id: resultInsert.insertId,
                    role: req.body.role,
                    logo_url: req.body.logo_url,
                    primary_function: req.body.primary_function,
                    key_attributes: req.body.key_attributes
                };

                res.send(role);
            });
        }
    });
});

// roles > retrieve all
app.get('/api/roles', (req, res) => {
    con.query("SELECT * FROM roles", function (err, result, fields) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
        res.send(result);
    });
});

// roles > update by id
app.put('/api/roles/:id', (req, res) => {
    const { error } = validateRole(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    var sql = `UPDATE roles SET role = '${req.body.role}', logo_url = '${req.body.logo_url}', primary_function = '${req.body.primary_function}', key_attributes = '${req.body.key_attributes}' WHERE id = ${parseInt(req.params.id)}`;

    con.query(sql, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
    });

    const role = {
        id: parseInt(req.params.id),
        role: req.body.role,
        logo_url: req.body.logo_url,
        primary_function: req.body.primary_function,
        key_attributes: req.body.key_attributes
    };

    res.send(role);
});

// roles > delete by id
app.delete('/api/roles/:id', (req, res) => {
    var sql = "DELETE FROM roles WHERE id = " + parseInt(req.params.id);

    con.query(sql, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
    });

    res.send("Role deleted successfully");
});

// heroes > create
app.post('/api/heroes', (req, res) => {
    var sql = `INSERT INTO heroes (name, image_url, description) VALUES ('${req.body.name}', '${req.body.image_url}', '${req.body.description}')`

    con.query(sql, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        const roles = req.body.roles || [];
        if (roles) {
            let sqlHeroRoles = "INSERT INTO hero_roles (hero_id, role_id) VALUES";

            for (let i = 0; i < roles.length; i++) {

                sqlHeroRoles += ` (${result.insertId}, ${roles[i]})`;

                if (i < roles.length - 1) {
                    sqlHeroRoles += ",";
                }
            }

            sqlHeroRoles += ";";

            con.query(sqlHeroRoles, function (errHeroRoles, resultHeroRoles) {
                if (errHeroRoles) {
                    console.error(errHeroRoles);
                    return res.status(500).send("Database error");
                }
            });
        }
    });

    const hero = {
        name: req.body.name,
    };

    res.send(hero);
});

// heroes > retrieve all
app.get('/api/heroes', (req, res) => {
    const sql = `SELECT h.id, h.name, h.image_url, tbl.roles, h.description FROM heroes h INNER JOIN (SELECT hero_id, GROUP_CONCAT(r.role SEPARATOR ' / ') AS roles FROM hero_roles hr INNER JOIN roles r ON hr.role_id = r.id GROUP BY hero_id) tbl ON h.id = tbl.hero_id;`

    con.query(sql, function (err, result, fields) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
        res.send(result);
    });
});

// heroes > update by id
app.put('/api/heroes/:id', (req, res) => {
    var sql = `UPDATE heroes SET name = '${req.body.name}', image_url = '${req.body.image_url}', 
        description = '${req.body.description}' WHERE id = ${parseInt(req.params.id)}`;

    con.query(sql, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        const selectedRoles = req.body.roles || [];
        if (selectedRoles) {
            let sqlHeroRoles = `INSERT INTO hero_roles (hero_id, role_id) SELECT hero_id, role_id FROM (SELECT hr.id, toInsert.hero_id, toInsert.role_id FROM (`;

            for (let i = 0; i < selectedRoles.length; i++) {

                if (i > 0) {
                    sqlHeroRoles += " UNION ";
                }

                sqlHeroRoles += `SELECT ${parseInt(req.params.id)} AS hero_id, ${selectedRoles[i]} AS role_id`;
            }

            sqlHeroRoles += `) toInsert LEFT JOIN (SELECT id, hero_id, role_id FROM hero_roles WHERE hero_id = ${parseInt(req.params.id)}) hr ON toInsert.role_id = hr.role_id) payload WHERE payload.id IS NULL;`;

            con.query(sqlHeroRoles, function (errHeroRoles, resultHeroRoles) {
                if (errHeroRoles) {
                    console.error(errHeroRoles);
                    return res.status(500).send("Database error");
                }

                const sqlDeleteHeroRoles = `DELETE FROM hero_roles WHERE hero_id = ${parseInt(req.params.id)} AND role_id NOT IN (${selectedRoles.join(",")});`;

                con.query(sqlDeleteHeroRoles, function (errHeroRoles, resultHeroRoles) {
                    if (errHeroRoles) {
                        console.error(errHeroRoles);
                        return res.status(500).send("Database error");
                    }
                });

                const hero = {
                    name: req.body.name,
                };

                res.send(hero);
            });
        }
        else {
            const hero = {
                name: req.body.name,
            };

            res.send(hero);
        }
    });
});

// heroes > delete by id
app.delete('/api/heroes/:id', (req, res) => {
    var sql = "DELETE FROM heroes WHERE id = " + parseInt(req.params.id);

    con.query(sql, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
    });

    res.send("Hero deleted successfully");
});

// hero_roles > retrieve all
app.get('/api/hero_roles', (req, res) => {
    con.query("SELECT * FROM hero_roles", function (err, result, fields) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
        res.send(result);
    });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

function validateRole(role) {
    const schema = Joi.object({
        role: Joi.string().max(50).required(),
        //logo_url: Joi.string().max(150).uri(),
        logo_url: Joi.string().max(150).allow(''),
        primary_function: Joi.string().max(150).allow(''),
        key_attributes: Joi.string().max(150).allow('')
    });

    return schema.validate(role);
}