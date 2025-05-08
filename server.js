const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const multer = require("multer");
const data = require("./data");
const mongoose = require("mongoose");
const Car = require("./models/Car");
const Booking = require("./models/Booking");

const app = express();

// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});
//khtm 
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
app.get("/cars", async (req, res) => {
  try {
    const cars = await Car.find();
    res.render("cars", { cars });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).send("Error fetching cars");
  }
});

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/car_rental", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.post("/cars", upload.single('carImage'), async (req, res) => {
  try {
    const newCar = new Car({
      name: req.body.name,
      brand: req.body.brand,
      pricePerDay: Number(req.body.pricePerDay),
      available: req.body.available === "true",
      image: req.file ? `/uploads/${req.file.filename}` : null
    });
    await newCar.save();
    res.redirect("/cars");
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).send("Error adding car");
  }
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

app.put("/cars/:id", upload.single('carImage'), (req, res) => {
  try {
    const car = data.cars.find(c => c.id === req.params.id);
    if (!car) return res.status(404).send("Car not found");

    car.name = req.body.name;
    car.brand = req.body.brand;
    car.pricePerDay = Number(req.body.pricePerDay);
    car.available = req.body.available === "true";
    
    // Update image if a new one was uploaded
    if (req.file) {
      car.image = `/uploads/${req.file.filename}`;
    }
    
    res.redirect(`/cars/${car.id}`);

  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).send("Error updating car");
  }
});

app.delete("/cars/:id", (req, res) => {
  try {
    data.cars = data.cars.filter(c => c.id !== req.params.id);
    res.redirect("/cars");
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).send("Error deleting car");
  }
});

// Bookings Routes
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate('carId');
    const formattedBookings = bookings.map(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      const diffTime = Math.abs(end - start);
      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        id: booking._id,
        carName: booking.carId ? booking.carId.name : "Deleted Car",
        userName: booking.userName,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalDays,
        totalPrice: booking.carId ? booking.carId.pricePerDay * totalDays : "N/A"
      };
    });
    res.render("bookings", { bookings: formattedBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).send("Error fetching bookings");
  }
});

app.get("/bookings/new", async (req, res) => {
  try {
    const cars = await Car.find({ available: true });
    res.render("new-booking", { cars });
  } catch (error) {
    console.error("Error fetching available cars:", error);
    res.status(500).send("Error fetching available cars");
  }
});

app.post("/bookings", async (req, res) => {
  try {
    const car = await Car.findById(req.body.carId);
    if (!car || !car.available) return res.status(400).send("Car not available");

    const newBooking = new Booking({
      carId: req.body.carId,
      userName: req.body.userName,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });

    await newBooking.save();

    // Update car availability
    car.available = false;
    await car.save();
    
    res.redirect(`/bookings/${newBooking._id}/success`);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).send("Error creating booking");
  }
});

app.get("/bookings/:id/success", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('carId');
    if (!booking) return res.status(404).send("Booking not found");
    
    res.render("booking-success", {
      userName: booking.userName,
      carName: booking.carId ? booking.carId.name : "Unknown Car",
      startDate: booking.startDate,
      endDate: booking.endDate
    });
  } catch (error) {
    console.error("Error showing booking success:", error);
    res.status(500).send("Error showing booking success");
  }
});

app.delete("/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).send("Booking not found");

    // Update car availability
    const car = await Car.findById(booking.carId);
    if (car) {
      car.available = true;
      await car.save();
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.redirect("/bookings");
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).send("Error deleting booking");
  }
});

// Server Start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});