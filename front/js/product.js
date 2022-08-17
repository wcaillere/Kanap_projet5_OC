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
    })
    .catch(function(err) {
        console.log(err);
    });