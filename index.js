const express = require("express"); // Used to set up a server
const cors = require("cors"); // Used to prevent errors when working locally
const app = express(); // Initialize express as an app variable
app.set("port", process.env.PORT || 6969); // Set the port
app.use(express.json()); // Enable the server to handle JSON requests
app.use(cors()); // Dont let local development give errors
app.use(express.static('public'));   

// import routes
const userRoute = require("./routes/userRoutes");
const productRoute = require("./routes/productRoutes");
const categoriesRoute = require("./routes/categoriesRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const order_detailsRoutes = require("./routes/order_detailsRoutes");
const product_categoriesRoutes = require("./routes/product_categoriesRoutes");


app.get("/", (req, res) => {
  res.json({ msg: "Welcome" });
});


app.use("/users", userRoute);
app.use("/product", productRoute);
app.use("/categories", categoriesRoute);
app.use("/orders", ordersRoutes);
app.use("/order_details", order_detailsRoutes);
app.use("/product_categories", product_categoriesRoutes);


app.listen(app.get("port"), () => {
  console.log(`Listening for calls on port ${app.get("port")}`);
  console.log("Press Ctrl+C to exit server");
});

app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(_dirname + "/" + "index.html");
});










