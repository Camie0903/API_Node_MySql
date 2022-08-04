const express = require("express");
const router = express.Router();
const con = require("../lib/db_connection");
const bcrypt = require('bcryptjs');
const middleware = require("../middleware/auth");
const jwt = require('jsonwebtoken');

router.post("/register", (req, res) => {
    try {
      let sql = "INSERT INTO users SET ?";
      const {
        full_name,
        email,
        password,
        user_type,
        phone,
        country,
        billing_address,
        default_shipping_address,
      } = req.body;
  
      // The start of hashing / encryption
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
  
      let user = {
        full_name,
        email,
        // We sending the hash value to be stored witin the table
        password: hash,
        user_type,
        phone,
        country,
        billing_address,
        default_shipping_address,
      };
      con.query(sql, user, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(`User ${(user.full_name, user.email)} created successfully`);
      });
    } catch (error) {
        console.log(error);
      }
    });  

router.get("/", (req, res) => {
    try {
        con.query("SELECT * FROM users", (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.log(error);
      
    }
});

router.post("/login", (req, res) => {
  console.log('hello')
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, async (err, result) => {
      console.log(result)
      if (err) throw err;
      if (result.length === 0) {
        res.send("Email not found please register");
      } else {
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        console.log(isMatch)
        if (!isMatch) {
          res.send("Password incorrect");
        } else {
          // The information the should be stored inside token
          const payload = {
            user: {
              user_id: result[0].user_id,
              full_name: result[0].full_name,
              email: result[0].email,
              user_type: result[0].user_type,
              phone: result[0].phone,
              country: result[0].country,
              billing_address: result[0].billing_address,
              default_shipping_address: result[0].default_shipping_address,
            },
          };
          // Creating a token and setting expiry date
          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/user/verify", (req, res) => {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({
        msg: "Unauthorized Access!",
      });
    } else {
      res.status(200);
      res.send(decodedToken);
    }
  });
});

router.get("/", middleware, (req, res) => {
  try {
    let sql = "SELECT * FROM user";
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/', (req, res) => {
    const {
            email, 
            password,
            full_name,
            billing_address,
            default_shipping_address,
            country,
            phone,
        user_type} = req.body
    try {
        con.query(`INSERT INTO users (email,password,full_name,billing_address,default_shipping_address,country,phone,user_type) VALUES( '${email}', '${password}', '${full_name}', '${billing_address}', '${default_shipping_address}', '${country}', '${phone}', '${user_type}')`, (err, result)=>{
            if (err) throw err;
            res.send(result);
        })
    } catch (error) {
        console.log(error)
    }
});

router.patch("/:id", (req, res) => {
    const {
            email, 
            password,
            full_name,
            billing_address,
            default_shipping_address,
            country,
            phone,
            user_type
        } = req.body;
    try {
      con.query(
        `update users set email = "${email}", password = "${password}", full_name = "${full_name}", billing_address = "${billing_address}", default_shipping_address = "${default_shipping_address}", country = "${country}", phone = "${phone}", user_type = "${user_type}" where users = "${req.params.id}"`,
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
        `delete from users where users_id = ${req.params.id}`,
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