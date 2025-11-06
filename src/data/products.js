export const products = [
  {
    id: 1,
    name: "Ceramic Coffee Pour-Over",
    price: 45.00,
    description: "Handcrafted ceramic pour-over coffee maker with a beautiful natural glaze. Perfect for making single-serve coffee with style.",
    category: "coffee",
    features: [
      "Handmade from high-quality stoneware",
      "Natural clay glaze finish",
      "Dishwasher safe",
      "Holds standard size filters"
    ],
    images: [
      "https://images.unsplash.com/photo-1614849427248-287c4e88ef58?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578943277523-5c59912b1867?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 15,
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 2,
    name: "Minimalist Dining Set",
    price: 120.00,
    description: "Complete dining set including 4 plates, 4 bowls, and 4 cups. Each piece is handcrafted with care and finished with our signature earth-tone glaze.",
    category: "dining",
    features: [
      "12-piece set",
      "Microwave and dishwasher safe",
      "Stackable design",
      "Durable stoneware construction"
    ],
    images: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 8,
    rating: 4.9,
    reviews: 42,
  },
  {
    id: 3,
    name: "Large Decorative Vase",
    price: 89.00,
    description: "Elegant handcrafted vase with a unique organic form. Perfect as a statement piece or for holding dried flower arrangements.",
    category: "decor",
    features: [
      "Height: 12 inches",
      "Unique organic form",
      "Matte finish",
      "Water-resistant"
    ],
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 5,
    rating: 4.7,
    reviews: 16,
  },
  {
    id: 4,
    name: "Ceramic Plant Pot Set",
    price: 65.00,
    description: "Set of three differently sized plant pots with drainage holes and matching saucers. Features our popular speckled glaze finish.",
    category: "planters",
    features: [
      "Set of 3 different sizes",
      "Drainage holes included",
      "Matching saucers",
      "Speckled glaze finish"
    ],
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d412?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 12,
    rating: 4.9,
    reviews: 38,
  },
];

export const categories = [
  { id: "all", name: "All Products" },
  { id: "coffee", name: "Coffee & Tea" },
  { id: "dining", name: "Dining" },
  { id: "decor", name: "Decor" },
  { id: "planters", name: "Planters" },
  { id: "new", name: "New Arrivals" },
  { id: "sale", name: "Sale" },
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Interior Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    content: "The quality of ClayAura's ceramics is outstanding. Each piece tells a story and brings warmth to any space.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Coffee Shop Owner",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    content: "We exclusively use ClayAura pour-over coffee makers in our shop. Our customers love the aesthetic and the coffee tastes amazing.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Home Chef",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    content: "The dining set I purchased is both beautiful and practical. It's become the centerpiece of my dinner parties.",
    rating: 4,
  },
];