const data = {
  cars: [
    {
      id: "1",
      name: "Toyota Corolla",
      brand: "Toyota",
      pricePerDay: 50,
      available: true,
      category: "Sedan",
      features: ["Air Conditioning", "Bluetooth", "Backup Camera", "Cruise Control"],
      rating: 4.5,
      reviews: [
        { id: "r1", userName: "John Doe", rating: 5, comment: "Great car, very comfortable!" },
        { id: "r2", userName: "Jane Smith", rating: 4, comment: "Good fuel economy" }
      ],
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000",
      year: 2023,
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      location: "Downtown Branch",
      mileage: "15,000 km",
      description: "The Toyota Corolla is a reliable and fuel-efficient sedan perfect for city driving and daily commutes."
    },
    {
      id: "2",
      name: "Honda Civic",
      brand: "Honda",
      pricePerDay: 55,
      available: true,
      category: "Sedan",
      features: ["Air Conditioning", "Bluetooth", "Navigation", "Sunroof"],
      rating: 4.3,
      reviews: [
        { id: "r3", userName: "Mike Johnson", rating: 4, comment: "Smooth ride" }
      ],
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000",
      year: 2023,
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      location: "Airport Terminal",
      mileage: "12,000 km",
      description: "The Honda Civic offers a perfect blend of performance, comfort, and style with excellent fuel economy."
    },
    {
      id: "3",
      name: "BMW X5",
      brand: "BMW",
      pricePerDay: 150,
      available: true,
      category: "SUV",
      features: ["Leather Seats", "Panoramic Sunroof", "Navigation", "Heated Seats", "360 Camera"],
      rating: 4.8,
      reviews: [
        { id: "r4", userName: "Sarah Williams", rating: 5, comment: "Luxurious and powerful!" },
        { id: "r5", userName: "Robert Brown", rating: 5, comment: "Amazing driving experience" }
      ],
      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000",
      year: 2023,
      transmission: "Automatic",
      fuelType: "Diesel",
      seats: 7,
      location: "Luxury Branch",
      mileage: "8,000 km",
      description: "The BMW X5 combines luxury, performance, and versatility in a premium SUV package."
    },
    {
      id: "4",
      name: "Tesla Model 3",
      brand: "Tesla",
      pricePerDay: 120,
      available: true,
      category: "Electric",
      features: ["Autopilot", "Glass Roof", "15\" Touchscreen", "Wireless Charging", "Premium Sound"],
      rating: 4.9,
      reviews: [
        { id: "r6", userName: "Emily Davis", rating: 5, comment: "Revolutionary electric car!" },
        { id: "r7", userName: "David Wilson", rating: 5, comment: "Incredible technology" }
      ],
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1000",
      year: 2023,
      transmission: "Automatic",
      fuelType: "Electric",
      seats: 5,
      location: "Tech Hub Branch",
      mileage: "5,000 km",
      description: "The Tesla Model 3 is an all-electric sedan with cutting-edge technology and impressive range."
    },
    {
      id: "5",
      name: "Porsche 911",
      brand: "Porsche",
      pricePerDay: 250,
      available: true,
      category: "Sports Car",
      features: ["Sport Seats", "Sport Exhaust", "Navigation", "Bose Sound System", "Sport Chrono Package"],
      rating: 5.0,
      reviews: [
        { id: "r8", userName: "Michael Thompson", rating: 5, comment: "Dream car, incredible performance!" }
      ],
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000",
      year: 2023,
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 2,
      location: "Premium Sports Branch",
      mileage: "3,000 km",
      description: "The Porsche 911 is an iconic sports car offering exhilarating performance and timeless design."
    },
    {
      id: "6",
      name: "Mercedes S-Class",
      brand: "Mercedes-Benz",
      pricePerDay: 200,
      available: true,
      category: "Luxury",
      features: ["Massage Seats", "Burmester Sound", "Ambient Lighting", "Rear Entertainment", "Air Suspension"],
      rating: 4.9,
      reviews: [
        { id: "r9", userName: "Jennifer Adams", rating: 5, comment: "Ultimate luxury experience!" },
        { id: "r10", userName: "Thomas Clark", rating: 5, comment: "Smooth and sophisticated" }
      ],
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000",
      year: 2023,
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      location: "Executive Branch",
      mileage: "7,000 km",
      description: "The Mercedes S-Class represents the pinnacle of luxury, comfort, and technological innovation."
    }
  ],
  bookings: [
    { id: "101", carId: "1", userName: "John Doe", startDate: "2024-03-01", endDate: "2024-03-05" },
    { id: "102", carId: "2", userName: "Alice Smith", startDate: "2024-03-10", endDate: "2024-03-12" }
  ],
  categories: ["Sedan", "SUV", "Sports Car", "Luxury", "Electric"],
  locations: ["Downtown Branch", "Airport Terminal", "Luxury Branch", "Tech Hub Branch", "Premium Sports Branch", "Executive Branch"],
  specialOffers: [
    {
      id: "offer1",
      title: "Weekend Special",
      description: "Get 20% off on all weekend bookings",
      discount: 20,
      code: "WEEKEND20",
      validUntil: "2024-12-31"
    },
    {
      id: "offer2",
      title: "Luxury Experience",
      description: "Book a luxury car for 3+ days and get a free upgrade",
      discount: 0,
      code: "LUXURYPLUS",
      validUntil: "2024-12-31"
    },
    {
      id: "offer3",
      title: "Electric Discount",
      description: "15% off on all electric vehicle rentals",
      discount: 15,
      code: "GOGREEN",
      validUntil: "2024-12-31"
    }
  ],
  faqs: [
    {
      id: "faq1",
      question: "What documents do I need to rent a car?",
      answer: "You'll need a valid driver's license, a credit card in your name, and a valid ID or passport."
    },
    {
      id: "faq2",
      question: "Is there a security deposit?",
      answer: "Yes, we require a security deposit which varies depending on the vehicle category. The deposit is fully refundable upon return of the vehicle in its original condition."
    },
    {
      id: "faq3",
      question: "Can I modify or cancel my booking?",
      answer: "Yes, you can modify or cancel your booking up to 24 hours before the scheduled pickup time without any penalty."
    },
    {
      id: "faq4",
      question: "Are there any age restrictions?",
      answer: "Yes, the minimum age to rent a car is 21 years. For luxury and sports cars, the minimum age is 25 years."
    },
    {
      id: "faq5",
      question: "Is insurance included in the rental price?",
      answer: "Basic insurance is included in the rental price. Additional coverage options are available at an extra cost."
    }
  ],
  wishlist: []
};

module.exports = data;