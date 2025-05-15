const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const hbs = require("hbs");
const data = require("./data");
const mongoose = require("mongoose");
const Booking = require("./models/Booking");

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/car-rental', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB successfully');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

const app = express();

// Register Handlebars helpers
hbs.registerHelper('eq', function (v1, v2) {
    return v1 === v2;
});

hbs.registerHelper('times', function(n, block) {
    let accum = '';
    for(let i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});

hbs.registerHelper('multiply', function(a, b) {
    return a * b;
});

hbs.registerHelper('formatDate', function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

hbs.registerHelper('gt', function(a, b) {
    return a > b;
});

hbs.registerHelper('lt', function(a, b) {
    return a < b;
});

hbs.registerHelper('formatCurrency', function(number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
});

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
    res.render("home", { title: "Car Rental System", cars: data.cars });
});

// Search and Filter Cars
app.get("/cars/search", (req, res) => {
    const { query, category, minPrice, maxPrice, minRating } = req.query;
    let filteredCars = [...data.cars];

    if (query) {
        filteredCars = filteredCars.filter(car =>
            car.name.toLowerCase().includes(query.toLowerCase()) ||
            car.brand.toLowerCase().includes(query.toLowerCase())
        );
    }

    if (category) {
        filteredCars = filteredCars.filter(car => car.category === category);
    }

    if (minPrice) {
        filteredCars = filteredCars.filter(car => car.pricePerDay >= Number(minPrice));
    }

    if (maxPrice) {
        filteredCars = filteredCars.filter(car => car.pricePerDay <= Number(maxPrice));
    }

    if (minRating) {
        filteredCars = filteredCars.filter(car => car.rating >= Number(minRating));
    }

    res.render("cars", {
        cars: filteredCars,
        categories: data.categories,
        filters: req.query
    });
});

// Cars Routes
app.get("/cars", (req, res) => {
    res.render("cars", {
        cars: data.cars,
        categories: data.categories
    });
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
    car.category = req.body.category;
    car.transmission = req.body.transmission;
    car.fuelType = req.body.fuelType;
    car.seats = Number(req.body.seats);
    car.pricePerDay = Number(req.body.pricePerDay);
    car.available = req.body.available === "true";

    res.redirect("/cars");
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

app.post("/bookings", async (req, res) => {
    const car = data.cars.find(c => c.id === req.body.carId);
    if (!car || !car.available) return res.status(400).send("Car not available");

    const start = new Date(req.body.startDate);
    const end = new Date(req.body.endDate);
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = car.pricePerDay * totalDays;

    try {
        const newBooking = await Booking.create({
            carId: req.body.carId,
            userName: req.body.userName,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            totalPrice: totalPrice
        });

        car.available = false;
        data.bookings.push({
            id: newBooking._id.toString(),
            ...req.body
        });
        
        res.redirect(`/bookings/${newBooking._id}/success`);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).send('Error creating booking. Please try again.');
    }
});

app.get("/bookings/:id/success", (req, res) => {
    const booking = data.bookings.find(b => b.id === req.params.id);
    if (!booking) return res.status(404).send("Booking not found");

    const car = data.cars.find(c => c.id === booking.carId);

    res.render("booking-success", {
        userName: booking.userName,
        carName: car ? car.name : "Unknown Car",
        startDate: booking.startDate,
        endDate: booking.endDate
    });
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

// Add Review
app.post("/cars/:id/reviews", (req, res) => {
    const car = data.cars.find(c => c.id === req.params.id);
    if (!car) return res.status(404).send("Car not found");

    const newReview = {
        id: Date.now().toString(),
        userName: req.body.userName,
        rating: Number(req.body.rating),
        comment: req.body.comment
    };

    car.reviews.push(newReview);

    // Update average rating
    const totalRating = car.reviews.reduce((sum, review) => sum + review.rating, 0);
    car.rating = totalRating / car.reviews.length;

    res.redirect(`/cars/${car.id}`);
});

// Price Calculator
app.get("/cars/:id/calculate-price", (req, res) => {
    const car = data.cars.find(c => c.id === req.params.id);
    if (!car) return res.status(404).send("Car not found");

    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        return res.status(400).send("Start date and end date are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = car.pricePerDay * totalDays;

    res.json({
        carName: car.name,
        startDate,
        endDate,
        totalDays,
        pricePerDay: car.pricePerDay,
        totalPrice
    });
});

// Special Offers Routes
app.get("/special-offers", (req, res) => {
    res.render("special-offers", {
        offers: data.specialOffers,
        cars: data.cars
    });
});

// FAQ Routes
app.get("/faq", (req, res) => {
    res.render("faq", { faqs: data.faqs });
});

// Contact Routes
app.get("/contact", (req, res) => {
    res.render("contact");
});

app.post("/contact", (req, res) => {
    // In a real app, this would send an email or save to a database
    res.render("contact-success", { name: req.body.name });
});

// Wishlist Routes
app.get("/wishlist", (req, res) => {
    const wishlistItems = data.wishlist.map(itemId => {
        return data.cars.find(car => car.id === itemId);
    }).filter(Boolean);

    res.render("wishlist", { cars: wishlistItems });
});

app.post("/wishlist/add/:id", (req, res) => {
    const carId = req.params.id;
    if (!data.wishlist.includes(carId)) {
        data.wishlist.push(carId);
    }
    res.redirect("/wishlist");
});

app.delete("/wishlist/remove/:id", (req, res) => {
    const carId = req.params.id;
    data.wishlist = data.wishlist.filter(id => id !== carId);
    res.redirect("/wishlist");
});

// Compare Cars
app.get("/compare", (req, res) => {
    const { car1, car2 } = req.query;

    const firstCar = data.cars.find(c => c.id === car1);
    const secondCar = data.cars.find(c => c.id === car2);

    res.render("compare", {
        car1: firstCar,
        car2: secondCar,
        cars: data.cars
    });
});

// Dashboard
app.get("/dashboard", (req, res) => {
    // Calculate some statistics
    const totalCars = data.cars.length;
    const availableCars = data.cars.filter(car => car.available).length;
    const totalBookings = data.bookings.length;

    // Get recent bookings
    const recentBookings = data.bookings
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .slice(0, 5)
        .map(booking => {
            const car = data.cars.find(c => c.id === booking.carId);
            return {
                ...booking,
                carName: car?.name || "Unknown Car"
            };
        });

    // Get popular cars (most booked)
    const carBookingCounts = {};
    data.bookings.forEach(booking => {
        carBookingCounts[booking.carId] = (carBookingCounts[booking.carId] || 0) + 1;
    });

    const popularCars = Object.entries(carBookingCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([carId, count]) => {
            const car = data.cars.find(c => c.id === carId);
            return {
                ...car,
                bookingCount: count
            };
        });

    res.render("dashboard", {
        totalCars,
        availableCars,
        totalBookings,
        recentBookings,
        popularCars
    });
});

// Map View
app.get("/locations", (req, res) => {
    const locationCars = {};

    data.locations.forEach(location => {
        locationCars[location] = data.cars.filter(car => car.location === location);
    });

    res.render("locations", {
        locations: data.locations,
        locationCars
    });
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
