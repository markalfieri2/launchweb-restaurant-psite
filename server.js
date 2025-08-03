require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

// Menu data (could come from a DB)
const menu = [
  { id: '1', name: 'Margherita Pizza', price: 1200 },
  { id: '2', name: 'Spaghetti Carbonara', price: 1500 },
  // Add more items...
];

// Routes for pages
app.get('/', (req, res) => res.render('index'));
app.get('/about', (req, res) => res.render('about'));
app.get('/location', (req, res) => res.render('location'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/vip', (req, res) => res.render('vip'));
app.get('/giftcards', (req, res) => res.render('giftcards'));
app.get('/catering', (req, res) => res.render('catering'));
app.get('/reservations', (req, res) => res.render('reservations'));
app.get('/order', (req, res) => res.render('order', { menu }));

// Stripe checkout session
app.post('/create-checkout-session', async (req, res) => {
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));