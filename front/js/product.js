let url = new URL(window.location.href);
var id = url.searchParams.get('id');

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

/**
 * 
 */
function addCart() {
    let color = document.querySelector('#colors').value;
    let quantity = document.querySelector('#quantity').value;
    if (color && quantity != 0) {
        let command = [id, color, quantity];
        localStorage.setItem([id, color], command);
    }
};

document.querySelector('#addToCart').addEventListener('click', addCart);