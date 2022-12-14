import {getCart, saveCart} from "./product.js";

/**
 * Get the total quantity of products in the cart and display it on page
 */
function getTotalQuantity() {
  let cart = getCart();
  let quantity = 0;
  for (let product of cart) {
    quantity += product.quantity;
  }
  document.querySelector('#totalQuantity').textContent = quantity;
}

/**
 * Get the total price of the cart (price of each product asked via API, this information is not in the cart) and display it on page
 */
function getTotalPrice() {
  let cart = getCart();
  let totalPrice = 0;
  document.querySelector('#totalPrice').textContent = totalPrice;
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

/**
 * Remove from the cart the parent product of the element put in argument (here it is a button 'supprimer'). Total price and quantity are recalculated at the end
 * @param {HTMLElement} element 
 */
function removeFromCart(element) {
  if (confirm("Voulez-vous supprimer ce produit de votre panier ?")) {
    let productToRemove = element.target.closest('.cart__item')
    let cart = getCart()
    //keep in cart products which have a different id of color than the product to remove
    cart = cart.filter(p => p.id != productToRemove.dataset.id || p.color != productToRemove.dataset.color);
    saveCart(cart);
    productToRemove.remove();
    getTotalPrice();
    getTotalQuantity();
  }
}

/**
 * Change the quantity of the parent product of the element put in argument (here it is a input 'value'). Total price and quantity are recalculated at the end
 * @param {HTMLElement} element 
 */
function changeQuantity(element) {
  let newQuantity = Number(element.target.value);
  let cart = getCart();
  let productToChange = element.target.closest('.cart__item');
  //Search in the cart the product to change
  let findProduct = cart.find(p => p.id == productToChange.dataset.id && p.color == productToChange.dataset.color);
  if (newQuantity > 0 && newQuantity < 101) {
    findProduct.quantity = newQuantity;
    saveCart(cart);
  } else {
    alert('veuillez indiquer une valeur valide (entre 1 et 100)')
    element.target.value = findProduct.quantity;
  }
  getTotalPrice();
  getTotalQuantity();
}

/**
 * Display the cart on the cart page
 */
async function displayCart () {
  //Sort the cart to display products by ID and colors
  let cartList = getCart();
  cartList.sort((a, b) => a.id.localeCompare(b.id));
  for (let item of cartList) {
    await fetch(`http://localhost:3000/api/products/${item.id}`)
    .then(function(data) {
      if (data.ok) {
        return data.json();
      }
    })
    .then(function(product) {
      //display a product on the cart page
      let cartProduct = document.createElement('article');
      cartProduct.classList.add('cart__item');
      cartProduct.setAttribute('data-id', item.id);
      cartProduct.setAttribute('data-color', item.color);
      cartProduct.innerHTML = `
          <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${product.name}</h2>
              <p>${item.color}</p>
              <p>${product.price} ???</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qt?? : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>`
      document.querySelector('#cart__items').appendChild(cartProduct);
    })
    .catch(function(err) {
      console.log(err);
    }); 
  }
  getTotalQuantity();
  getTotalPrice();
  //add the possibility to remove a product by clicking on his button 'supprimer'
  let removeBtn = document.querySelectorAll('.deleteItem');
  for (let element of removeBtn) {
    element.addEventListener('click', (e) => {
    removeFromCart(e);
    })
  };  
  //add the possibility to change the quantity of a product by changing his input 'Qt??'
  let productsQuantities = document.querySelectorAll('.itemQuantity');
  for (let productQuantity of productsQuantities) {
    productQuantity.addEventListener('change', (e) => {
    changeQuantity(e);
    })
  };
};

/**
 * Check if an input is empty or not for the POST of the form
 * @param {HTMLElement} input 
 * @param {string} errorMessage Allows to personalize the error message
 * @returns {boolean} true if the input is valid (not empty)
 */
function checkEmptyInput(input, errorMessage) {
  //Using the property 'trim' takes into account string containing only spaces
  if (input.value.trim().length != 0) {
    input.nextElementSibling.textContent = '';
    return true
  } else {
    input.nextElementSibling.textContent = errorMessage;
    return false
  };
}

/**
 * Check if an input has number or not in it for the POST of the form
 * @param {HTMLElement} input 
 * @param {string} errorMessage Allows to personalize the error message
 * @returns {boolean} true if the input is valid (no number in it)
 */
function checkNumber(input, errorMessage) {
  if (/[0-9]+/.test(input.value)) {
    input.nextElementSibling.textContent = errorMessage;
    return false
  } else {
    input.nextElementSibling.textContent = '';
    return true
  };
}

/**
 * Check the validity of the form
 * @returns {boolean} true if the from is valid (all inputs are correct)
 */
function checkFormValidity() {
  let validForm = true;
  //Run trought inputs of the form, and check their validity (switch/case allows to personalize the validity check of all input)
  for (let input of document.querySelectorAll('form input')) {
    switch(input.id) {

      case 'firstName':
        let validFirstName  = checkEmptyInput(input, 'Veuillez renseigner votre pr??nom');
        if (validFirstName) {
          validFirstName = checkNumber(input, 'Veuillez renseigner un pr??nom valide (sans chiffres)');
          validForm &= validFirstName;
        }
        break;

      case 'lastName':
        let validLastName  = checkEmptyInput(input, 'Veuillez renseigner votre nom');
        if (validLastName) {
          validLastName = checkNumber(input, 'Veuillez renseigner un nom valide (sans chiffres)');
          validForm &= validLastName;
        }
        break;

      case 'address':
        let validAddress = checkEmptyInput(input, 'Veuillez renseigner votre adresse');
        validForm &= validAddress
        break;

      case 'city':
        let validCity  = checkEmptyInput(input, 'Veuillez renseigner votre ville');
        if (validCity) {
          validCity = checkNumber(input, 'Veuillez renseigner un nom de ville valide (sans chiffres)');
          validForm &= validCity;
        }
        break;

      case 'email':
        if (input.checkValidity()) {
          input.nextElementSibling.textContent = '';
          validForm &= true;
        } else {
          input.nextElementSibling.textContent = 'Veuillez renseigner une adresse mail valide';
          validForm &= false;
        }
        break;
    }
  }
  return validForm;
}

/**
* Creation of a object 'contact', used for the POST request. Contains informations on the client : firstName, lastName, address, city, email
* @returns {object}
*/
function createContact() {
  let contact = {};
  for (let input of document.querySelectorAll('form input[type=text], input[type=email]')) {
    contact[input.id] = input.value;
    };
  return contact
}

/**
* Creation of an array 'products', used for the POST request. Contains the id(s) of the cart's products
* @returns {array}
*/
function createProducts() {
  let cart = getCart();
  let products = []
  for (let item of cart) {
    products.push(item.id)
  }
  return products
}

/**
 * Send a Post request to the API to obtain the client's order's ID
 * @param {object} contact 
 * @param {Array} products 
 */
 function sendRequest(contact, products) {
  fetch('http://localhost:3000/api/products/order', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'contact': contact,
      'products': products})
  }) 
  .then(function(data) {
    if (data.ok) {
      return data.json()
    }
  })
  .then(function(order) {
    //LocalStorage is cleaned after the command
    localStorage.removeItem('cart');
    location.href = `./confirmation.html?orderId=${order.orderId}`
  })
  .catch(function(err) {
    console.log(err);
  })
}

//Display the cart on the html page on its load
displayCart();

//Verify all inputs when the button 'commander !' is clicked
document.querySelector('#order').addEventListener('click', (e) => {
  //prevent display of the default invalid input's message
  e.preventDefault();
  //if checkFormValidity is true, it means that all inputs are valid
  if (checkFormValidity()) {
    let cart = getCart();
    if (cart.length == 0) {
      alert('votre panier est vide');
    } else {
      alert('votre commande a bien ??t?? effectu??e');
      let contact = createContact();
      let products = createProducts();
      sendRequest(contact, products);
    }
  }
})


