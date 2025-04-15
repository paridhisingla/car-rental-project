const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const data = require("./data");

const app = express();

// Configuration
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Routes
app.get("/", (req, res) => {
  res.render("home", { title: "Car Rental System" });
});

// Cars Routes
app.get("/cars", (req, res) => {
  res.render("cars", { cars: data.cars });
});

app.post("/cars", (req, res) => {
  const newCar = {
    id: Date.now().toString(),
    ...req.body,
    pricePerDay: Number(req.body.pricePerDay),
    available: req.body.available === "true"
  };
  data.cars.push(newCar);
  res.redirect("/cars");
});

app.get("/cars/:id", (req, res) => {
  const car = data.cars.find(c => c.id === req.params.id);
  if (!car) return res.status(404).send("Car not found");
  res.render("car-detail", { car });
});

app.get("/cars/:id/edit", (req, res) => {
  const car = data.cars.find(c => c.id === req.params.id);
  if (!car) return res.status(404).send("Car not found");
  res.render("edit-car", { car });
});

app.put("/cars/:id", (req, res) => {
  const car = data.cars.find(c => c.id === req.params.id);
  if (!car) return res.status(404).send("Car not found");

  car.name = req.body.name;
  car.brand = req.body.brand;
  car.pricePerDay = Number(req.body.pricePerDay);
  car.available = req.body.available === "true";
  res.redirect(`/cars/${car.id}`);
});

app.delete("/cars/:id", (req, res) => {
  data.cars = data.cars.filter(c => c.id !== req.params.id);
  res.redirect("/cars");
});

// Bookings Routes
app.get("/bookings", (req, res) => {
  const bookings = data.bookings.map(booking => {
    const car = data.cars.find(c => c.id === booking.carId);
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      ...booking,
      carName: car?.name || "Deleted Car",
      totalDays,
      totalPrice: car ? car.pricePerDay * totalDays : "N/A"
    };
  });
  res.render("bookings", { bookings });
});

app.get("/bookings/new", (req, res) => {
  res.render("new-booking", { cars: data.cars.filter(c => c.available) });

});

app.post("/bookings", (req, res) => {
  const car = data.cars.find(c => c.id === req.body.carId);
  if (!car || !car.available) return res.status(400).send("Car not available");

  const newBooking = {
    id: Date.now().toString(),
    ...req.body
  };

  car.available = false;
  data.bookings.push(newBooking);
  res.redirect("/bookings");
});

app.delete("/bookings/:id", (req, res) => {
  const booking = data.bookings.find(b => b.id === req.params.id);
  if (booking) {
    const car = data.cars.find(c => c.id === booking.carId);
    if (car) car.available = true;
  }
  data.bookings = data.bookings.filter(b => b.id !== req.params.id);
  res.redirect("/bookings");
});

// Server Start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});