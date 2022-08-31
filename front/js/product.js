//get product's id after visitor comes from the homepage
let url = new URL(window.location.href);
let id = url.searchParams.get('id');

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

/**
 * get the command and push it in the cart saved in the localStorage
 */
function addCart() {
    let color = document.querySelector('#colors').value;
    let quantity = Number(document.querySelector('#quantity').value);
    if (color && (quantity > 0 && quantity < 101)) {
        let command = {"id": id, "color": color, "quantity": quantity};
        let cart = getCart();
        //Search if the command is already in the cart (same id and color)
        let foundProduct = cart.find(product => product.id == command.id && product.color == command.color);
        if (foundProduct != undefined) {
            if (foundProduct.quantity + command.quantity > 100) {
                alert("Action refusée : ce produit est déjà dans votre panier, et ajouter cette quantité le ferait passer au-dessus des 100 exemplaires maximaux. veuillez réduire votre quantité")
            } else {
                foundProduct.quantity += command.quantity;
                alert("Ce produit étant déjà dans votre panier, sa nouvelle quantité a bien été ajoutée")
            }
        } else {
            cart.push(command);
            alert("Votre produit a bien été ajouté à votre panier !")
        }
        saveCart(cart);
        
    } else if (color && (quantity <= 0 || quantity >= 101)) {
        alert("Veuillez renseigner une quantité comprise entre 1 et 100.")
    } else if (!color && (quantity > 0 && quantity < 101)) {
        alert("Veuillez sélectionner une couleur")
    } else {
        alert("Veuillez sélectionner une couleur et renseigner une quantité comprise entre 1 et 100.")
    }
};


/**
 * display product on the page via API request and add the eventListener on the button 'Ajout au panier'
 */
function displayProduct() {
  fetch(`http://localhost:3000/api/products/${id}`)
    .then(function(data) {
        if (data.ok) {
            return data.json();
        }
    })
    .then(function(product) {
        //Creation of the <img>
        productImage = document.createElement('img');
        productImage.setAttribute('src', product.imageUrl);
        productImage.setAttribute('alt', product.altTxt);
        document.querySelector('.item__img').appendChild(productImage);
        //Add the name, price and description
        document.querySelector('#title').textContent = product.name;
        document.querySelector('#price').textContent = product.price;
        document.querySelector('#description').textContent = product.description;
        //Creation of the <option> for colors
        for (let color of product.colors) {
            productColor = document.createElement('option');
            productColor.setAttribute('value', color.toLowerCase())
            productColor.textContent = color.toLowerCase();
            document.querySelector('#colors').appendChild(productColor);
        };
        document.querySelector('#addToCart').addEventListener('click', addCart);
    })
    .catch(function(err) {
        console.log(err);
    });  
}

//display product's details on the page loading
displayProduct();
