require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');

const app = express();

// EJS Layout configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Enhanced Menu data
const menu = [
  { 
    id: '1', 
    name: 'Truffle Pasta della Casa', 
    description: 'House-made fettuccine with black truffle cream sauce, wild mushrooms, and aged parmesan',
    price: 2400, 
    category: 'pasta',
    image: 'pasta-special.jpg'
  },
  { 
    id: '2', 
    name: 'Pan-Seared Branzino', 
    description: 'Mediterranean sea bass with lemon herb crust, roasted vegetables, and salmoriglio sauce',
    price: 3200, 
    category: 'seafood',
    image: 'seafood-special.jpg'
  },
  { 
    id: '3', 
    name: 'Dry-Aged Ribeye', 
    description: '28-day aged prime ribeye with rosemary potatoes, seasonal vegetables, and red wine reduction',
    price: 4500, 
    category: 'meat',
    image: 'steak-special.jpg'
  },
  { 
    id: '4', 
    name: 'Burrata Antipasto', 
    description: 'Creamy burrata with prosciutto di Parma, arugula, and balsamic glaze',
    price: 1800, 
    category: 'appetizers',
    image: 'burrata.jpg'
  },
  { 
    id: '5', 
    name: 'Tiramisu Classico', 
    description: 'Traditional mascarpone dessert with espresso-soaked ladyfingers and cocoa',
    price: 1200, 
    category: 'desserts',
    image: 'tiramisu.jpg'
  }
];

// Routes for pages
app.get('/', (req, res) => res.render('index', { title: 'Home' }));
app.get('/about', (req, res) => res.render('about', { title: 'About' }));
app.get('/location', (req, res) => res.render('location', { title: 'Location' }));
app.get('/contact', (req, res) => res.render('contact', { title: 'Contact' }));
app.get('/vip', (req, res) => res.render('vip', { title: 'VIP Club' }));
app.get('/giftcards', (req, res) => res.render('giftcards', { title: 'Gift Cards' }));
app.get('/catering', (req, res) => res.render('catering', { title: 'Catering' }));
app.get('/reservations', (req, res) => res.render('reservations', { title: 'Reservations' }));
app.get('/order', (req, res) => res.render('order', { title: 'Order Online', menu }));

// Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
  try {
    const lineItems = req.body.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: item.price
      },
      quantity: item.quantity
    }));
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/order?success=true`,
      cancel_url: `${req.headers.origin}/order?canceled=true`
    });
    
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Unable to create checkout session' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));