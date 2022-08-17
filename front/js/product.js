//get product's id after visitor comes from the homepage
let url = new URL(window.location.href);
var id = url.searchParams.get('id');

//show product on the page via API request
fetch(`http://localhost:3000/api/products/${id}`)
    .then(function(data) {
        if (data.ok) {
            return data.json();
        }
    })
    .then(function(product) {
        console.log(product);
        document.querySelector('.item__img').innerHTML = `<img src=${product.imageUrl} alt=${product.altTxt}>`;
        document.querySelector('#title').textContent = product.name;
        document.querySelector('#price').textContent = product.price;
        document.querySelector('#description').textContent = product.description;
        for (let color of product.colors) {
            document.querySelector('#colors').innerHTML += `<option value=${color.toLowerCase()}>${color.toLowerCase()}</option>`;
        }
    })
    .catch(function(err) {
        console.log(err);
    });

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCart() {
    let cart = localStorage.getItem('cart');
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}

/**
 * 
 */
function addCart() {
    let color = document.querySelector('#colors').value;
    let quantity = Number(document.querySelector('#quantity').value);
    if (color && quantity != 0) {
        let command = {"id": id, "color": color, "quantity": quantity};
        let cart = getCart();
        let foundProduct = cart.find(product => product.id == command.id && product.color == command.color);
        if (foundProduct != undefined) {
            foundProduct.quantity += command.quantity;
        } else {
            cart.push(command);
        }
        saveCart(cart);
    }
};

document.querySelector('#addToCart').addEventListener('click', addCart);