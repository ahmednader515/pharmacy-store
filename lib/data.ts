import { Data, IProductInput, IUserInput } from '@/types'
import { toSlug } from './utils'
import bcrypt from 'bcryptjs'

const users: IUserInput[] = [
  {
    name: 'John',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'Admin',
    address: {
      fullName: 'John Doe',
      street: '111 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'Jane',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Jane Harris',
      street: '222 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '1002',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Jack',
    email: 'jack@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Jack Ryan',
      street: '333 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '1003',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
  {
    name: 'Sarah',
    email: 'sarah@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Sarah Smith',
      street: '444 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '1005',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Michael',
    email: 'michael@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'John Alexander',
      street: '555 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '1006',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
  {
    name: 'Emily',
    email: 'emily@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Emily Johnson',
      street: '666 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'Alice',
    email: 'alice@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Alice Cooper',
      street: '777 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10007',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Tom',
    email: 'tom@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Tom Hanks',
      street: '888 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10008',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'Linda',
    email: 'linda@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Linda Holmes',
      street: '999 Main St',
      city: 'New York',
      province: 'NY',
      postalCode: '10009',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
  {
    name: 'George',
    email: 'george@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'George Smith',
      street: '101 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10010',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'Jessica',
    email: 'jessica@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Jessica Brown',
      street: '102 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10011',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Chris',
    email: 'chris@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Chris Evans',
      street: '103 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10012',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
  {
    name: 'Samantha',
    email: 'samantha@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Samantha Wilson',
      street: '104 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10013',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Stripe',
    emailVerified: false,
  },
  {
    name: 'David',
    email: 'david@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'David Lee',
      street: '105 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10014',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'Cash On Delivery',
    emailVerified: false,
  },
  {
    name: 'Anna',
    email: 'anna@example.com',
    password: bcrypt.hashSync('123456', 5),
    role: 'User',
    address: {
      fullName: 'Anna Smith',
      street: '106 First Ave',
      city: 'New York',
      province: 'NY',
      postalCode: '10015',
      country: 'USA',
      phone: '123-456-7890',
    },
    paymentMethod: 'PayPal',
    emailVerified: false,
  },
]

const products: IProductInput[] = [
  {
    name: 'Tylenol Extra Strength Acetaminophen 500mg',
    slug: toSlug('Tylenol Extra Strength Acetaminophen 500mg'),
    category: 'Pain Relief',
    images: ['/images/p11-1.jpg', '/images/p11-2.jpg'],
    tags: ['best-seller', 'pain-relief'],
    isPublished: true,
    price: 12.99,
    listPrice: 15.99,
    brand: 'Tylenol',
    avgRating: 4.71,
    numReviews: 127,
    ratingDistribution: [
      { rating: 1, count: 2 },
      { rating: 2, count: 3 },
      { rating: 3, count: 8 },
      { rating: 4, count: 25 },
      { rating: 5, count: 89 },
    ],
    numSales: 234,
    countInStock: 45,
    description: 'Extra strength pain reliever and fever reducer. Contains 500mg acetaminophen per tablet. For temporary relief of minor aches and pains due to headache, backache, minor pain of arthritis, toothache, muscular aches, premenstrual and menstrual cramps, and for the reduction of fever.',
    sizes: ['100 tablets', '200 tablets'],
    colors: ['White'],
    reviews: [],
  },
  {
    name: 'Advil Ibuprofen 200mg Tablets',
    slug: toSlug('Advil Ibuprofen 200mg Tablets'),
    category: 'Pain Relief',
    images: ['/images/p12-1.jpg', '/images/p12-2.jpg'],
    tags: ['featured', 'pain-relief'],
    isPublished: true,
    price: 14.99,
    listPrice: 0,
    brand: 'Advil',
    avgRating: 4.5,
    numReviews: 89,
    ratingDistribution: [
      { rating: 1, count: 1 },
      { rating: 2, count: 2 },
      { rating: 3, count: 5 },
      { rating: 4, count: 20 },
      { rating: 5, count: 61 },
    ],
    numSales: 156,
    countInStock: 67,
    description: 'Ibuprofen 200mg tablets for temporary relief of minor aches and pains. Reduces fever and inflammation. Take with food or milk to minimize stomach upset.',
    sizes: ['50 tablets', '100 tablets'],
    colors: ['White'],
    reviews: [],
  },
  {
    name: 'Centrum Silver Multivitamin for Adults 50+',
    slug: toSlug('Centrum Silver Multivitamin for Adults 50+'),
    category: 'Vitamins & Supplements',
    brand: 'Centrum',
    images: ['/images/p13-1.jpg', '/images/p13-2.jpg'],
    tags: ['best-seller', 'vitamins'],
    isPublished: true,
    price: 18.99,
    listPrice: 22.99,
    avgRating: 4.3,
    numReviews: 203,
    ratingDistribution: [
      { rating: 1, count: 5 },
      { rating: 2, count: 8 },
      { rating: 3, count: 15 },
      { rating: 4, count: 45 },
      { rating: 5, count: 130 },
    ],
    numSales: 445,
    countInStock: 89,
    description: 'Complete multivitamin specially formulated for adults 50+. Contains essential vitamins and minerals to support heart health, brain function, and eye health. One tablet daily with food.',
    sizes: ['60 tablets', '120 tablets'],
    colors: ['Silver'],
    reviews: [],
  },
  {
    name: 'Claritin 24-Hour Non-Drowsy Allergy Relief',
    slug: toSlug('Claritin 24-Hour Non-Drowsy Allergy Relief'),
    category: 'Allergy & Sinus',
    images: ['/images/p14-1.jpg', '/images/p14-2.jpg'],
    tags: ['featured', 'allergy'],
    isPublished: true,
    price: 16.99,
    listPrice: 19.99,
    brand: 'Claritin',
    avgRating: 4.6,
    numReviews: 167,
    ratingDistribution: [
      { rating: 1, count: 3 },
      { rating: 2, count: 4 },
      { rating: 3, count: 10 },
      { rating: 4, count: 35 },
      { rating: 5, count: 115 },
    ],
    numSales: 298,
    countInStock: 56,
    description: '24-hour non-drowsy allergy relief. Contains loratadine 10mg. Relieves sneezing, runny nose, itchy watery eyes, and itchy throat and nose due to hay fever or other upper respiratory allergies.',
    sizes: ['30 tablets', '60 tablets'],
    colors: ['Blue'],
    reviews: [],
  },
  {
    name: 'Zinc 50mg Immune Support Supplements',
    slug: toSlug('Zinc 50mg Immune Support Supplements'),
    category: 'Vitamins & Supplements',
    images: ['/images/p15-1.jpg', '/images/p15-2.jpg'],
    tags: ['immune-support', 'supplements'],
    isPublished: true,
    price: 11.99,
    listPrice: 0,
    brand: 'Nature Made',
    avgRating: 4.4,
    numReviews: 78,
    ratingDistribution: [
      { rating: 1, count: 2 },
      { rating: 2, count: 3 },
      { rating: 3, count: 6 },
      { rating: 4, count: 18 },
      { rating: 5, count: 49 },
    ],
    numSales: 134,
    countInStock: 34,
    description: 'Zinc 50mg tablets to support immune system health. Essential mineral that helps maintain normal immune function. Take one tablet daily with food.',
    sizes: ['60 tablets', '120 tablets'],
    colors: ['White'],
    reviews: [],
  },
  {
    name: 'Pepto-Bismol Liquid Upset Stomach Relief',
    slug: toSlug('Pepto-Bismol Liquid Upset Stomach Relief'),
    category: 'Digestive Health',
    images: ['/images/p16-1.jpg', '/images/p16-2.jpg'],
    tags: ['digestive', 'stomach-relief'],
    isPublished: true,
    price: 8.99,
    listPrice: 10.99,
    brand: 'Pepto-Bismol',
    avgRating: 4.2,
    numReviews: 95,
    ratingDistribution: [
      { rating: 1, count: 4 },
      { rating: 2, count: 5 },
      { rating: 3, count: 12 },
      { rating: 4, count: 25 },
      { rating: 5, count: 49 },
    ],
    numSales: 187,
    countInStock: 42,
    description: 'Liquid upset stomach relief. Relieves nausea, heartburn, indigestion, upset stomach, and diarrhea. Contains bismuth subsalicylate. Take as directed.',
    sizes: ['8 fl oz', '16 fl oz'],
    colors: ['Pink'],
    reviews: [],
  },
  {
    name: 'Vitamin D3 2000 IU Softgels',
    slug: toSlug('Vitamin D3 2000 IU Softgels'),
    category: 'Vitamins & Supplements',
    images: ['/images/p17-1.jpg', '/images/p17-2.jpg'],
    tags: ['vitamins', 'bone-health'],
    isPublished: true,
    price: 13.99,
    listPrice: 16.99,
    brand: 'Nature Made',
    avgRating: 4.7,
    numReviews: 234,
    ratingDistribution: [
      { rating: 1, count: 3 },
      { rating: 2, count: 4 },
      { rating: 3, count: 8 },
      { rating: 4, count: 35 },
      { rating: 5, count: 184 },
    ],
    numSales: 567,
    countInStock: 78,
    description: 'Vitamin D3 2000 IU softgels for bone health and immune support. Helps the body absorb calcium and maintain strong bones. Take one softgel daily with food.',
    sizes: ['60 softgels', '120 softgels'],
    colors: ['Yellow'],
    reviews: [],
  },
  {
    name: 'Mucinex DM Extended-Release Tablets',
    slug: toSlug('Mucinex DM Extended-Release Tablets'),
    category: 'Cold & Flu',
    images: ['/images/p18-1.jpg', '/images/p18-2.jpg'],
    tags: ['cold-flu', 'cough-relief'],
    isPublished: true,
    price: 15.99,
    listPrice: 18.99,
    brand: 'Mucinex',
    avgRating: 4.3,
    numReviews: 156,
    ratingDistribution: [
      { rating: 1, count: 5 },
      { rating: 2, count: 7 },
      { rating: 3, count: 15 },
      { rating: 4, count: 40 },
      { rating: 5, count: 89 },
    ],
    numSales: 234,
    countInStock: 45,
    description: 'Extended-release tablets for cough and chest congestion relief. Contains guaifenesin and dextromethorphan. Provides 12-hour relief. Take as directed.',
    sizes: ['20 tablets', '40 tablets'],
    colors: ['White'],
    reviews: [],
  },
  {
    name: 'Fish Oil Omega-3 1000mg Softgels',
    slug: toSlug('Fish Oil Omega-3 1000mg Softgels'),
    category: 'Vitamins & Supplements',
    images: ['/images/p19-1.jpg', '/images/p19-2.jpg'],
    tags: ['omega-3', 'heart-health'],
    isPublished: true,
    price: 19.99,
    listPrice: 24.99,
    brand: 'Nature Made',
    avgRating: 4.5,
    numReviews: 189,
    ratingDistribution: [
      { rating: 1, count: 4 },
      { rating: 2, count: 6 },
      { rating: 3, count: 12 },
      { rating: 4, count: 45 },
      { rating: 5, count: 122 },
    ],
    numSales: 345,
    countInStock: 67,
    description: 'Fish oil omega-3 1000mg softgels for heart health. Supports cardiovascular health and brain function. Take two softgels daily with food.',
    sizes: ['60 softgels', '120 softgels'],
    colors: ['Orange'],
    reviews: [],
  },
  {
    name: 'Bayer Aspirin 325mg Tablets',
    slug: toSlug('Bayer Aspirin 325mg Tablets'),
    category: 'Pain Relief',
    images: ['/images/p20-1.jpg', '/images/p20-2.jpg'],
    tags: ['pain-relief', 'heart-health'],
    isPublished: true,
    price: 9.99,
    listPrice: 12.99,
    brand: 'Bayer',
    avgRating: 4.4,
    numReviews: 145,
    ratingDistribution: [
      { rating: 1, count: 3 },
      { rating: 2, count: 5 },
      { rating: 3, count: 10 },
      { rating: 4, count: 30 },
      { rating: 5, count: 97 },
    ],
    numSales: 278,
    countInStock: 89,
    description: 'Bayer aspirin 325mg tablets for pain relief and heart health. Used for temporary relief of minor aches and pains. May also be used for heart attack prevention as directed by a doctor.',
    sizes: ['100 tablets', '200 tablets'],
    colors: ['White'],
    reviews: [],
  },
]
const orders = [
  {
    userId: 'user-1', // This will be replaced with actual user ID during seeding
    expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    paymentMethod: 'Stripe',
    itemsPrice: 45.97,
    shippingPrice: 4.99,
    taxPrice: 3.68,
    totalPrice: 54.64,
    isPaid: true,
    paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isDelivered: false,
    orderItems: [
      {
        productId: 'product-1',
        name: 'Tylenol Extra Strength Acetaminophen 500mg',
        image: '/images/p11-1.jpg',
        price: 12.99,
        quantity: 2,
        category: 'Pain Relief'
      },
      {
        productId: 'product-2',
        name: 'Advil Ibuprofen 200mg Tablets',
        image: '/images/p12-1.jpg',
        price: 14.99,
        quantity: 1,
        category: 'Pain Relief'
      }
    ]
  },
  {
    userId: 'user-2',
    expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    paymentMethod: 'PayPal',
    itemsPrice: 32.98,
    shippingPrice: 4.99,
    taxPrice: 2.54,
    totalPrice: 40.51,
    isPaid: true,
    paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isDelivered: true,
    deliveredAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000),
    orderItems: [
      {
        productId: 'product-3',
        name: 'Centrum Silver Multivitamin for Adults 50+',
        image: '/images/p13-1.jpg',
        price: 18.99,
        quantity: 1,
        category: 'Vitamins & Supplements'
      },
      {
        productId: 'product-4',
        name: 'Claritin 24-Hour Non-Drowsy Allergy Relief',
        image: '/images/p14-1.jpg',
        price: 16.99,
        quantity: 1,
        category: 'Allergy & Sinus'
      }
    ]
  },
  {
    userId: 'user-3',
    expectedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    paymentMethod: 'Cash On Delivery',
    itemsPrice: 67.96,
    shippingPrice: 4.99,
    taxPrice: 5.22,
    totalPrice: 78.17,
    isPaid: false,
    isDelivered: false,
    orderItems: [
      {
        productId: 'product-5',
        name: 'Zinc 50mg Immune Support Supplements',
        image: '/images/p15-1.jpg',
        price: 11.99,
        quantity: 2,
        category: 'Vitamins & Supplements'
      },
      {
        productId: 'product-6',
        name: 'Pepto-Bismol Liquid Upset Stomach Relief',
        image: '/images/p16-1.jpg',
        price: 8.99,
        quantity: 1,
        category: 'Digestive Health'
      },
      {
        productId: 'product-7',
        name: 'Vitamin D3 2000 IU Softgels',
        image: '/images/p17-1.jpg',
        price: 13.99,
        quantity: 2,
        category: 'Vitamins & Supplements'
      }
    ]
  }
]

const reviews = [
  {
    rating: 1,
    title: 'Poor quality',
    comment:
      'Very disappointed. The item broke after just a few uses. Not worth the money.',
  },
  {
    rating: 2,
    title: 'Disappointed',
    comment:
      "Not as expected. The material feels cheap, and it didn't fit well. Wouldn't buy again.",
  },
  {
    rating: 2,
    title: 'Needs improvement',
    comment:
      "It looks nice but doesn't perform as expected. Wouldn't recommend without upgrades.",
  },
  {
    rating: 3,
    title: 'not bad',
    comment:
      'This product is decent, the quality is good but it could use some improvements in the details.',
  },
  {
    rating: 3,
    title: 'Okay, not great',
    comment:
      'It works, but not as well as I hoped. Quality is average and lacks some finishing.',
  },
  {
    rating: 3,
    title: 'Good product',
    comment:
      'This product is amazing, I love it! The quality is top notch, the material is comfortable and breathable.',
  },
  {
    rating: 4,
    title: 'Pretty good',
    comment:
      "Solid product! Great value for the price, but there's room for minor improvements.",
  },
  {
    rating: 4,
    title: 'Very satisfied',
    comment:
      'Good product! High quality and worth the price. Would consider buying again.',
  },
  {
    rating: 4,
    title: 'Absolutely love it!',
    comment:
      'Perfect in every way! The quality, design, and comfort exceeded all my expectations.',
  },
  {
    rating: 4,
    title: 'Exceeded expectations!',
    comment:
      'Fantastic product! High quality, feels durable, and performs well. Highly recommend!',
  },
  {
    rating: 5,
    title: 'Perfect purchase!',
    comment:
      "Couldn't be happier with this product. The quality is excellent, and it works flawlessly!",
  },
  {
    rating: 5,
    title: 'Highly recommend',
    comment:
      "Amazing product! Worth every penny, great design, and feels premium. I'm very satisfied.",
  },
  {
    rating: 5,
    title: 'Just what I needed',
    comment:
      'Exactly as described! Quality exceeded my expectations, and it arrived quickly.',
  },
  {
    rating: 5,
    title: 'Excellent choice!',
    comment:
      'This product is outstanding! Everything about it feels top-notch, from material to functionality.',
  },
  {
    rating: 5,
    title: "Couldn't ask for more!",
    comment:
      "Love this product! It's durable, stylish, and works great. Would buy again without hesitation.",
  },
]

const data: Data = {
  users,
  products,
  orders,
  reviews,
  webPages: [
    {
      title: 'About Us',
      slug: 'about-us',
      content: `Welcome to MediCare Pharmacy, your trusted partner in health and wellness. Since our founding, we have been committed to providing the highest quality medications, health products, and personalized care to our community.

At MediCare Pharmacy, we understand that your health is your most valuable asset. That's why we've built our reputation on trust, expertise, and a deep commitment to your well-being. Our team of licensed pharmacists and healthcare professionals is here to ensure you receive the right medications, proper guidance, and the care you deserve.

**Our Mission**
To provide accessible, reliable, and professional pharmaceutical services that enhance the health and quality of life for our customers. We strive to be your first choice for all your medication and health product needs.

**Why Choose MediCare Pharmacy?**
- **Licensed Pharmacists**: Our team of experienced pharmacists is available to answer your questions and provide medication counseling
- **Quality Products**: We carry only FDA-approved medications and high-quality health products from trusted manufacturers
- **Convenient Service**: Easy online ordering, prescription refills, and fast delivery to your doorstep
- **Privacy & Security**: Your health information is protected with the highest standards of privacy and security
- **Competitive Pricing**: We offer competitive prices and accept most insurance plans

**Our Services**
- Prescription medications and refills
- Over-the-counter medications and health products
- Vitamins and nutritional supplements
- Medication therapy management
- Health screenings and consultations
- Immunization services

Thank you for choosing MediCare Pharmacy. Your health is our priority, and we're here to serve you with care, expertise, and dedication.`,
      isPublished: true,
    },
    {
      title: 'Contact Us',
      slug: 'contact-us',
      content: `We’re here to help! If you have any questions, concerns, or feedback, please don’t hesitate to reach out to us. Our team is ready to assist you and ensure you have the best shopping experience.

**Customer Support**
For inquiries about orders, products, or account-related issues, contact our customer support team:
- **Email:** support@example.com
- **Phone:** +1 (123) 456-7890
- **Live Chat:** Available on our website from 9 AM to 6 PM (Monday to Friday).

**Head Office**
For corporate or business-related inquiries, reach out to our headquarters:
- **Address:** 1234 E-Commerce St, Suite 567, Business City, BC 12345
- **Phone:** +1 (987) 654-3210

We look forward to assisting you! Your satisfaction is our priority.
`,
      isPublished: true,
    },
    {
      title: 'Help',
      slug: 'help',
      content: `Welcome to MediCare Pharmacy's Help Center! We're here to assist you with all your pharmaceutical needs and questions. Whether you need help with prescriptions, medication information, or general pharmacy services, our comprehensive help resources are designed to provide you with the information you need.

**Prescription Services**
Managing your prescriptions is easy with our online platform. You can:
- **Order Refills**: Log into your account and request prescription refills online
- **Transfer Prescriptions**: Transfer your prescriptions from other pharmacies
- **Medication Information**: Access detailed information about your medications
- **Dosage Reminders**: Set up reminders for when to take your medications

**Ordering and Delivery**
- **Prescription Orders**: Upload your prescription or have your doctor send it electronically
- **Over-the-Counter Products**: Browse and order health products, vitamins, and supplements
- **Shipping Options**: Choose from standard (3-5 days), express (1-2 days), or same-day delivery
- **Tracking**: Track your order status through your account or email notifications

**Account Management**
- **Profile Updates**: Keep your personal information, insurance details, and delivery addresses current
- **Order History**: View past orders and prescription refills
- **Auto-Refill**: Set up automatic refills for your regular medications
- **Insurance Information**: Update and manage your insurance coverage

**Medication Safety**
- **Drug Interactions**: Check for potential interactions between your medications
- **Side Effects**: Learn about possible side effects and when to contact your doctor
- **Storage Instructions**: Get proper storage information for your medications
- **Expiration Dates**: Track medication expiration dates and receive reminders

**Insurance and Billing**
- **Insurance Processing**: We accept most major insurance plans
- **Copay Information**: View your copay amounts before ordering
- **Billing Questions**: Get help with billing issues or insurance claims
- **Payment Options**: Use credit cards, insurance, or other accepted payment methods

**Emergency Information**
For medical emergencies, call 911 immediately. For urgent medication questions outside business hours, call our 24-hour pharmacist hotline at +1 (555) 123-4568.

**Contact Support**
Our pharmacy team is available to help with any questions about your medications, orders, or general health information. Contact us via phone, email, or live chat during business hours.`,
      isPublished: true,
    },
    {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: `We value your privacy and are committed to protecting your personal information. This Privacy Notice explains how we collect, use, and share your data when you interact with our services. By using our platform, you consent to the practices described herein.

We collect data such as your name, email address, and payment details to provide you with tailored services and improve your experience. This information may also be used for marketing purposes, but only with your consent. Additionally, we may share your data with trusted third-party providers to facilitate transactions or deliver products.

Your data is safeguarded through robust security measures to prevent unauthorized access. However, you have the right to access, correct, or delete your personal information at any time. For inquiries or concerns regarding your privacy, please contact our support team.`,
      isPublished: true,
    },
    {
      title: 'Conditions of Use',
      slug: 'conditions-of-use',
      content: `Welcome to [Ecommerce Website Name]. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. These terms govern your use of our platform, including browsing, purchasing products, and interacting with any content or services provided. You must be at least 18 years old or have the consent of a parent or guardian to use this website. Any breach of these terms may result in the termination of your access to our platform.

We strive to ensure all product descriptions, pricing, and availability information on our website are accurate. However, errors may occur, and we reserve the right to correct them without prior notice. All purchases are subject to our return and refund policy. By using our site, you acknowledge that your personal information will be processed according to our privacy policy, ensuring your data is handled securely and responsibly. Please review these terms carefully before proceeding with any transactions.
`,
      isPublished: true,
    },
    {
      title: 'Customer Service',
      slug: 'customer-service',
      content: `At MediCare Pharmacy, we're committed to providing exceptional customer service and support for all your pharmaceutical needs. Our dedicated team is here to help you with any questions, concerns, or assistance you may need.

**Contact Information**
- **Phone**: +1 (555) 123-4567
- **Email**: customer.service@medicare-pharmacy.com
- **Address**: 456 Health Plaza, Medical District, CA 90210
- **Hours**: Monday-Friday 8:00 AM - 8:00 PM, Saturday 9:00 AM - 6:00 PM, Sunday 10:00 AM - 4:00 PM

**Prescription Services**
- **Prescription Refills**: Order refills online or call us directly
- **New Prescriptions**: Drop off prescriptions in person or have your doctor send them electronically
- **Medication Counseling**: Our pharmacists are available for consultation about your medications
- **Insurance Processing**: We accept most major insurance plans and can help with coverage questions

**Online Services**
- **Account Management**: Update your profile, manage prescriptions, and view order history
- **Auto-Refill**: Set up automatic refills for your regular medications
- **Medication Reminders**: Receive notifications when it's time to refill or take your medications
- **Health Information**: Access educational materials and health resources

**Shipping & Delivery**
- **Standard Delivery**: 3-5 business days
- **Express Delivery**: 1-2 business days
- **Same-Day Delivery**: Available in select areas
- **Free Shipping**: On orders over $50

**Returns & Refunds**
- **Unopened Products**: Full refund within 30 days
- **Prescription Medications**: Cannot be returned for safety reasons
- **Damaged Items**: Immediate replacement or refund
- **Wrong Items**: Free replacement with correct medication

**Privacy & Security**
Your health information is protected by HIPAA regulations and our strict privacy policies. We never share your personal or medical information without your explicit consent.

**Emergency Services**
For medical emergencies, please call 911 or go to the nearest emergency room immediately. For urgent medication questions outside of business hours, call our 24-hour pharmacist hotline at +1 (555) 123-4568.

We're here to help you maintain your health and wellness. Don't hesitate to reach out to us with any questions or concerns.`,
      isPublished: true,
    },
    {
      title: 'Returns Policy',
      slug: 'returns-policy',
      content: `At [Your Store Name], we want you to be completely satisfied with your purchase. If you're not happy with your order for any reason, we offer a hassle-free return and replacement policy.

**Return Window**
- Most items can be returned within 30 days of delivery
- Some products may have different return windows (check product page for details)
- Returns must be in original condition with all packaging intact

**How to Return**
1. Log into your account and go to "My Orders"
2. Select the item you want to return
3. Choose your return reason and follow the instructions
4. Print the return label and package your item
5. Drop off at any authorized shipping location

**Refund Process**
- Refunds are processed within 5-7 business days after we receive your return
- Original shipping costs are non-refundable
- Return shipping costs may apply depending on the reason for return

For more information or assistance with returns, please contact our customer service team.`,
      isPublished: true,
    },
    {
      title: 'Careers',
      slug: 'careers',
      content: `Join our team at [Your Store Name]! We're always looking for talented individuals who are passionate about e-commerce and customer service.

**Current Openings**
We currently have openings in the following departments:
- Customer Service Representatives
- Marketing Specialists
- IT and Development
- Warehouse Operations
- Sales and Business Development

**Why Work With Us**
- Competitive salary and benefits
- Flexible work arrangements
- Professional development opportunities
- Collaborative and inclusive work environment
- Growth potential within the company

**How to Apply**
To apply for any of our open positions, please send your resume and cover letter to careers@example.com. Include the position title in your subject line.

We look forward to hearing from you and potentially welcoming you to our team!`,
      isPublished: true,
    },
    {
      title: 'Blog',
      slug: 'blog',
      content: `Welcome to the [Your Store Name] blog! Here you'll find the latest news, product updates, shopping tips, and industry insights.

**Latest Posts**
- "How to Choose the Perfect Gift for Any Occasion"
- "Sustainable Shopping: Making Eco-Friendly Choices"
- "Top 10 Must-Have Products for 2024"
- "Customer Spotlight: Success Stories"

**Categories**
- Shopping Guides
- Product Reviews
- Lifestyle Tips
- Company News
- Customer Stories

Stay tuned for regular updates and exclusive content. Subscribe to our newsletter to never miss a post!`,
      isPublished: true,
    },
    {
      title: 'Become an Affiliate',
      slug: 'become-affiliate',
      content: `Join our affiliate program and earn commissions by promoting [Your Store Name] products! Our affiliate program offers competitive rates and comprehensive support.

**How It Works**
- Sign up for our affiliate program
- Get unique tracking links
- Promote our products on your platform
- Earn commissions on successful sales

**Commission Structure**
- 5% commission on all sales
- 30-day cookie tracking
- Monthly payout schedule
- Performance bonuses available

**Affiliate Benefits**
- High commission rates
- Real-time tracking and analytics
- Marketing materials and banners
- Dedicated affiliate support
- Regular training and webinars

**Requirements**
- Active website or social media presence
- Compliance with our affiliate terms
- Regular promotional activity

Start earning today! Apply for our affiliate program at affiliates@example.com.`,
      isPublished: true,
    },
    {
      title: 'Advertise Your Products',
      slug: 'advertise',
      content: `Promote your products to our engaged customer base with our comprehensive advertising solutions! We offer various advertising options to help you reach your target audience effectively.

**Advertising Options**
- Sponsored Product Listings
- Banner Advertisements
- Email Marketing Campaigns
- Social Media Promotions
- Search Result Promotions

**Benefits**
- Targeted audience reach
- Real-time performance tracking
- Flexible budget options
- Professional ad management
- ROI optimization

**Getting Started**
1. Choose your advertising package
2. Set your budget and targeting
3. Create your ad campaign
4. Monitor and optimize performance

**Pricing**
Our advertising rates are competitive and based on performance. Contact our advertising team for a custom quote tailored to your needs.

Ready to boost your sales? Contact us at advertising@example.com to discuss your advertising strategy.`,
      isPublished: true,
    },
    {
      title: 'Shipping Rates & Policies',
      slug: 'shipping',
      content: `We offer fast and reliable shipping options to get your orders to you as quickly as possible. Our shipping policies are designed to provide you with flexibility and transparency.

**Shipping Options**
- **Standard Shipping (3-5 business days):** $5.99
- **Express Shipping (2-3 business days):** $12.99
- **Overnight Shipping (1 business day):** $24.99
- **Free Shipping:** Available on orders over $50

**Shipping Destinations**
We currently ship to all 50 US states and territories. International shipping is available to select countries.

**Order Processing**
- Orders placed before 2 PM EST are processed the same day
- Orders placed after 2 PM EST are processed the next business day
- Weekend orders are processed on the following Monday

**Tracking Your Order**
- You'll receive a tracking number via email once your order ships
- Track your package in real-time through our website
- Receive delivery notifications and updates

**Shipping Restrictions**
Some items may have shipping restrictions due to size, weight, or destination. These will be clearly indicated on the product page.

For questions about shipping, please contact our customer service team.`,
      isPublished: true,
    },
  ],
  headerMenus: [
    {
      name: "Today's Specials",
      href: '/search?tag=todays-deal',
    },
    {
      name: 'New Medications',
      href: '/search?tag=new-arrival',
    },
    {
      name: 'Featured Products',
      href: '/search?tag=featured',
    },
    {
      name: 'Best Sellers',
      href: '/search?tag=best-seller',
    },
    {
      name: 'Browsing History',
      href: '/#browsing-history',
    },
    {
      name: 'Customer Service',
      href: '/page/customer-service',
    },
    {
      name: 'About Us',
      href: '/page/about-us',
    },
    {
      name: 'Help',
      href: '/page/help',
    },
  ],
  carousels: [
    // This carousel array is deprecated and should not be used
    // Use the carousel data from settings instead
  ],
  settings: [
    {
      common: {
        freeShippingMinPrice: 35,
        isMaintenanceMode: false,
        pageSize: 9,
      },
      site: {
        name: 'MediCare Pharmacy',
        description:
          'MediCare Pharmacy - Your trusted online pharmacy for prescription medications, over-the-counter drugs, health supplements, and wellness products.',
        keywords: 'Pharmacy, Medications, Prescription Drugs, Health Supplements, Wellness, Online Pharmacy',
        url: 'https://medicare-pharmacy.com',
        logo: '/icons/logo.svg',
        slogan: 'Your Health, Our Priority.',
        author: 'MediCare Pharmacy',
        copyright: '2000-2024, MediCare Pharmacy, Inc. All rights reserved.',
        email: 'info@medicare-pharmacy.com',
        address: '456 Health Plaza, Medical District, CA 90210',
        phone: '+1 (555) 123-4567',
      },
      carousels: [
        {
          title: 'Essential Medications & Prescriptions',
          buttonCaption: 'Shop Now',
          image: '/images/banner3.jpg',
          url: '/search?category=Prescription Medications',
        },
        {
          title: 'Over-the-Counter Health Products',
          buttonCaption: 'Shop Now',
          image: '/images/banner1.jpg',
          url: '/search?category=Over-the-Counter',
        },
        {
          title: 'Vitamins & Health Supplements',
          buttonCaption: 'See More',
          image: '/images/banner2.jpg',
          url: '/search?category=Vitamins & Supplements',
        },
      ],
      availableLanguages: [
        { code: 'en-US', name: 'English' }
      ],
      defaultLanguage: 'en-US',
      availableCurrencies: [
        {
          name: 'United States Dollar',
          code: 'USD',
          symbol: '$',
          convertRate: 1,
        },
        { name: 'Euro', code: 'EUR', symbol: '€', convertRate: 0.96 },
        { name: 'UAE Dirham', code: 'AED', symbol: 'AED', convertRate: 3.67 },
      ],
      defaultCurrency: 'USD',
      availablePaymentMethods: [
        { name: 'PayPal', commission: 0 },
        { name: 'Stripe', commission: 0 },
        { name: 'Cash On Delivery', commission: 0 },
      ],
      defaultPaymentMethod: 'PayPal',
      availableDeliveryDates: [
        {
          name: 'Tomorrow',
          daysToDeliver: 1,
          shippingPrice: 12.9,
          freeShippingMinPrice: 0,
        },
        {
          name: 'Next 3 Days',
          daysToDeliver: 3,
          shippingPrice: 6.9,
          freeShippingMinPrice: 0,
        },
        {
          name: 'Next 5 Days',
          daysToDeliver: 5,
          shippingPrice: 4.9,
          freeShippingMinPrice: 35,
        },
      ],
      defaultDeliveryDate: 'Next 5 Days',
    },
  ],
}

export default data
