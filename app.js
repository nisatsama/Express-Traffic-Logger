const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const currentHour = new Date().getHours();
  if (currentHour >= 0 && currentHour < 6) {
    res.send("Sorry this site is closed at night");
  } else {
    next();
  }
});

app.use((req, res, next) => {
  console.log("Timestamp:", (req.timestamp = Date.now()));
  next();
});

app.use((req, res, next) => {
  console.log("IP Address:", req.ip);
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the Traffic Logger!");
});

app.get("/about", (req, res) => {
  res.send("This is the About Page");
});

app.get("/Service", (req, res) => {
  res.send("This is the Service Page");
});

const SECRET_PASSWORD = "123";

const checkPasswordMiddleware = (req, res, next) => {
  const userPassword = req.query.password;

  if (userPassword === SECRET_PASSWORD) {
    next();
  } else {
    res
      .status(401)
      .send("Access Denied: Invalid or missing password parameter.");
  }
};

app.get("/admin", checkPasswordMiddleware, (req, res) => {
  res.send("Welcome Admin!");
});

app.get("/user", checkPasswordMiddleware, (req, res) => {
  res.send("Welcome User!");
});

app.get("/feedback", (req, res) => {
  res.send(`<form action="/submit-feedback" method="POST">
    <input type="text" name="name" placeholder="Your Name"><br>
    <textarea name="feedback" rows="4" cols="50" placeholder="Enter your feedback here"></textarea><br>
    <input type="submit" value="Submit Feedback">
  </form>`);
});

app.post("/submit-feedback", (req, res) => {
  const name = req.body.name;
  const feedback = req.body.feedback;
  res.send(`Thank you, ${name}, for your feedback: "${feedback}"`);
});
app.get("/orders", (req, res) => {
  const orders = req.query.orders;
  if (orders) {
    const ordersArray = Array.isArray(orders) ? orders : [orders];
    res.send(`You have placed the following orders: ${ordersArray.join(", ")}`);
  } else {
    res.send("No orders were placed.");
  }
});
app.post("/orders", (req, res) => {
  const orders = req.body.orders;
  if (orders) {
    res.send("Order list created successfully.");
  } else {
    res.send("No orders were placed.");
  }
});

app.use((req, res, next) => {
  console.log("Middleware 1 running");
  next();
});



app.use((req, res, next) => {
  console.log("Middleware 2 running");
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Oops! Server Error 😢");
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port :http://localhost:${PORT}`);
});

