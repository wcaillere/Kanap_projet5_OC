/**
 * Save the new cart in the localStorage
 * @param {Array} cart 
 */
 function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
* Get the actual cart which was in the localStorage
* @returns {Array}
*/
function getCart() {
  let cart = localStorage.getItem('cart');
  if (cart == null) {
      return [];
  } else {
      return JSON.parse(cart);
  }
}

function getTotalQuantity() {
  let cart = getCart();
  let quantity = 0;
  for (let product of cart) {
    quantity += product.quantity;
  }
  document.querySelector('#totalQuantity').textContent = quantity;
}

function getTotalPrice() {
  let cart = getCart();
  let totalPrice = 0;
  for (let item of cart) {
    fetch(`http://localhost:3000/api/products/${item.id}`)
    .then(function(data) {
        if (data.ok) {
            return data.json();
        }
    })
    .then(function(product) {
      totalPrice += product.price*item.quantity;
      document.querySelector('#totalPrice').textContent = totalPrice;
    })
    .catch(function(err) {
        console.log(err);
    });
  }
}

function removeFromCart(element) {
  elementToRemove = element.target.closest('.cart__item')
  let cart = getCart()
  cart = cart.filter(p => p.id != elementToRemove.dataset.id || p.color != elementToRemove.dataset.color);
  saveCart(cart);
  elementToRemove.remove();
  getTotalPrice();
  getTotalQuantity();
}

/**
 * Show the cart on the cart page
 */
function showCart () {
  let cartList = JSON.parse(localStorage.getItem('cart'));
  for (let item of cartList) {
      fetch(`http://localhost:3000/api/products/${item.id}`)
      .then(function(data) {
          if (data.ok) {
              return data.json();
          }
      })
      .then(function(product) {
        document.querySelector('#cart__items').innerHTML += `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
          <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${product.name}</h2>
              <p>${item.color}</p>
              <p>${product.price} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>`
        document.querySelector('.deleteItem').addEventListener('click', (e) => {
          removeFromCart(e);
        })
      })
      .catch(function(err) {
          console.log(err);
      }); 
  }
  getTotalQuantity();
  getTotalPrice();
};

showCart();