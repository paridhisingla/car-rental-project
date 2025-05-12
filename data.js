const data = {
  cars: [
    { id: "1", name: "Toyota Corolla", brand: "Toyota", pricePerDay: 50, available: true },
    { id: "2", name: "Honda Civic", brand: "Honda", pricePerDay: 55, available: true }
  ],
  bookings: [
    { id: "101", carId: "1", userName: "John Doe", startDate: "2024-03-01", endDate: "2024-03-05" },
    { id: "102", carId: "2", userName: "Alice Smith", startDate: "2024-03-10", endDate: "2024-03-12" }
  ]
};

module.exports = data;