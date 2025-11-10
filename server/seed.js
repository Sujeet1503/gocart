const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Product } = require("./model/Product");

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection error", err));

const seedDB = async () => {
  await Product.deleteMany({});
  await Product.insertMany([
    // Phones
    {
      name: "iPhone 15 Pro",
      description: "Latest Apple iPhone with advanced camera and A17 Pro chip",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
      price: 89999,
      stock: 15,
      brand: "Apple"
    },
    {
      name: "Samsung Galaxy S24",
      description: "Ultra smartphone with AI features and powerful processor",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop",
      price: 74999,
      stock: 20,
      brand: "Samsung"
    },
    {
      name: "Google Pixel 8",
      description: "Smartphone with best-in-class camera and Google AI",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop",
      price: 65999,
      stock: 12,
      brand: "Google"
    },

    // Laptops
    {
      name: "MacBook Pro 16-inch",
      description: "Professional laptop with M3 chip for creators",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
      price: 199999,
      stock: 8,
      brand: "Apple"
    },
    {
      name: "Dell XPS 13",
      description: "Sleek design with powerful performance and infinity display",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      price: 124999,
      stock: 10,
      brand: "Dell"
    },
    {
      name: "HP Spectre x360",
      description: "2-in-1 convertible laptop with OLED display",
      image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=300&fit=crop",
      price: 114999,
      stock: 7,
      brand: "HP"
    },

    // Headphones
    {
      name: "Sony WH-1000XM5",
      description: "Industry-leading noise cancellation with 30hr battery",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      price: 29999,
      stock: 25,
      brand: "Sony"
    },
    {
      name: "Apple AirPods Max",
      description: "Premium over-ear headphones with spatial audio",
      image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop",
      price: 59999,
      stock: 15,
      brand: "Apple"
    },

    // Gaming
    {
      name: "PlayStation 5",
      description: "Next-gen gaming console with 4K gaming",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop",
      price: 49999,
      stock: 5,
      brand: "Sony"
    },
    {
      name: "Xbox Series X",
      description: "4K gaming powerhouse with Game Pass",
      image: "https://images.unsplash.com/photo-1621259182978-fbf83265f8c0?w=400&h=300&fit=crop",
      price: 54999,
      stock: 8,
      brand: "Microsoft"
    },

    // Smart Watches
    {
      name: "Apple Watch Series 9",
      description: "Advanced health monitoring with always-on display",
      image: "https://images.unsplash.com/photo-1579586337278-3f43625425fb?w=400&h=300&fit=crop",
      price: 45999,
      stock: 18,
      brand: "Apple"
    },
    {
      name: "Samsung Galaxy Watch 6",
      description: "Premium fitness tracking with sleep coaching",
      image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=300&fit=crop",
      price: 29999,
      stock: 22,
      brand: "Samsung"
    },

    // Cameras
    {
      name: "Canon EOS R5",
      description: "Professional mirrorless camera with 8K video",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
      price: 389999,
      stock: 4,
      brand: "Canon"
    },
    {
      name: "Sony A7 IV",
      description: "Full-frame mirrorless camera for professionals",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
      price: 249999,
      stock: 6,
      brand: "Sony"
    },

    // Tablets
    {
      name: "iPad Pro 12.9",
      description: "Pro performance tablet with M2 chip",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
      price: 119999,
      stock: 12,
      brand: "Apple"
    },
    {
      name: "Samsung Galaxy Tab S9",
      description: "Premium Android tablet with S Pen",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
      price: 94999,
      stock: 9,
      brand: "Samsung"
    },

    // Home Appliances
    {
      name: "Dyson V15 Vacuum",
      description: "Cordless stick vacuum cleaner with laser detection",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
      price: 59999,
      stock: 14,
      brand: "Dyson"
    },
    {
      name: "Instant Pot Pro",
      description: "8-in-1 pressure cooker with smart programs",
      image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=300&fit=crop",
      price: 12999,
      stock: 30,
      brand: "Instant Pot"
    },

    // Fitness
    {
      name: "Fitbit Charge 6",
      description: "Advanced fitness tracker with GPS and heart rate",
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop",
      price: 14999,
      stock: 25,
      brand: "Fitbit"
    },
    {
      name: "Peloton Bike+",
      description: "Connected fitness bike with rotating screen",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      price: 249999,
      stock: 3,
      brand: "Peloton"
    },

    // Fashion
    {
      name: "Nike Air Force 1",
      description: "Classic white sneakers with premium leather",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
      price: 10999,
      stock: 35,
      brand: "Nike"
    },
    {
      name: "Adidas Ultraboost",
      description: "Running shoes with boost technology and primeknit",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop",
      price: 17999,
      stock: 28,
      brand: "Adidas"
    },

    // Smart Home
    {
      name: "Amazon Echo Dot",
      description: "Smart speaker with Alexa voice assistant",
      image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&h=300&fit=crop",
      price: 4999,
      stock: 40,
      brand: "Amazon"
    },
    {
      name: "Google Nest Hub",
      description: "Smart display with Google Assistant",
      image: "https://images.unsplash.com/photo-1558089687-b47de1df5aa6?w=400&h=300&fit=crop",
      price: 8999,
      stock: 20,
      brand: "Google"
    },

    // Audio
    {
      name: "JBL Flip 6",
      description: "Portable Bluetooth speaker with deep bass",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
      price: 12999,
      stock: 18,
      brand: "JBL"
    },
    {
      name: "Bose SoundLink",
      description: "Premium portable speaker with 360 sound",
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop",
      price: 24999,
      stock: 12,
      brand: "Bose"
    }
  ]);
  console.log("✅ Database seeded with 25 products with real working images!");
};

seedDB().then(() => {
  console.log("🎉 Seeding completed!");
  mongoose.connection.close();
});

