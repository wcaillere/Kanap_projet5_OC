//get order's id after visitor comes from the cart page
let url = new URL(window.location.href);
var orderId = url.searchParams.get('orderId');

document.querySelector('#orderId').textContent = orderId;