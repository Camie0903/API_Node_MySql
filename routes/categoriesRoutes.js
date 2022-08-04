const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");

router.get("/", (req, res) => {
    try {
        con.query("SELECT * FROM categories", (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
      
    }
});

router.post('/', (req, res) => {
    const {
            name, 
            description,
            thumbnail
            } = req.body
    try {
        con.query(`INSERT INTO categories (name,description,thumbnail) VALUES( '${name}', '${description}', '${thumbnail}')`, (err, result)=>{
            if (err) throw err;
            res.send(result);
        })
    } catch (error) {
        console.log(error)
    }
});

router.patch("/:id", (req, res) => {
    const { name, description, thumbnail } = req.body;
    try {
      con.query(
        `update categories set name = "${name}", description = "${description}", thumbnail = "${thumbnail}" where category_id = "${req.params.id}"`,
        (err, result) => {
          if (err) throw err;
          res.send(result);
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

router.delete("/:id", (req, res) => {
    try {
      con.query(
        `delete from categories where category_id = ${req.params.id}`,
        (err, result) => {
          if (err) throw err;
          res.send(result);
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });  




module.exports = router;