const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const { markOrderPaid } = require('../controllers/payment');

const router = express.Router();

// Signing secret comes from `stripe listen` locally or the dashboard in prod, never commit it
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Stripe needs the raw body to check the signature, so this is mounted before express.json()
router.post('/', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        // backup for when the user closes the tab before reaching /success
        await markOrderPaid(event.data.object);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error('Error handling webhook:', err);
    return response.status(500).send('Webhook handler failed');
  }

  // Return a 200 response to acknowledge receipt of the event
  response.sendStatus(200);
});

module.exports = router;
