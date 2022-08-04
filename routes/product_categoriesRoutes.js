const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");

router.get("/", (req, res) => {
    try {
        con.query("SELECT * FROM product_categories", (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
      
    }
});

router.post('/', (req, res) => {
    const {
            product_id, 
            category_id
            } = req.body
    try {
        con.query(`INSERT INTO categories (product_id,category_id) VALUES( '${product_id}', '${category_id}')`, (err, result)=>{
            if (err) throw err;
            res.send(result);
        })
    } catch (error) {
        console.log(error)
    }
});

router.patch("/:id", (req, res) => {
    const {
        product_id, 
        category_id
        } = req.body;
    try {
      con.query(
        `update product_categories set product_id = "${product_id}", category_id = "${category_id}" where product_categories = "${req.params.id}"`,
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
        `delete from product_categories where product_categories_id = ${req.params.id}`,
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