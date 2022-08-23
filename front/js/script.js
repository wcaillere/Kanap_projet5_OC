const url = "http://localhost:3000/api/products";

//display products on the homepage via API request
fetch(url)
    .then(function(data) {
        if (data.ok) {
            return data.json();
        }
    })
    .then(function(productList) {
        for (let product of productList) {
            document.querySelector('#items').innerHTML += `<a href="./product.html?id=${product._id}">
            <article>
              <img src=${product.imageUrl} alt=${product.altTxt}>
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
          </a>`;
        }
    })
    .catch(function(err) {
        console.log(err);
    });