let url = new URL(window.location.href);
let id = url.searchParams.get('id');

fetch(`http://localhost:3000/api/products/${id}`)
    .then(function(data) {
        if (data.ok) {
            return data.json();
        }
    })
    .then(function(product) {
        console.log(product);
        document.querySelector('.item__img').innerHTML = `<img src=${product.imageUrl} alt=${product.altTxt}>`
    })
    .catch(function(err) {
        console.log(err);
    });