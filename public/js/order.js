import { loadStripe } from 'https://js.stripe.com/v3/';
const stripe = await loadStripe('pk_test_XXXXXXXXXXXXXXXX');

const checkoutBtn = document.getElementById('checkout-btn');
checkoutBtn.addEventListener('click', async () => {
  const items = Array.from(document.querySelectorAll('.menu-item input'))
    .map(input => ({
      id: input.dataset.id,
      name: input.dataset.name,
      price: parseInt(input.dataset.price),
      quantity: parseInt(input.value)
    }))
    .filter(item => item.quantity > 0);

  if (items.length === 0) return alert('Select at least one item.');

  const response = await fetch('/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });
  const { id } = await response.json();
  await stripe.redirectToCheckout({ sessionId: id });
});