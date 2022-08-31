const apiUrl = "http://localhost:3000/api/products";

/**
 * display products on the homepage via API request
 */
function displayProducts() {
  fetch(apiUrl)
    .then(function(data) {
        if (data.ok) {
            return data.json();
        }
    })
    .then(function(productList) {
        for (let product of productList) {
            //Creation of the parent <a> link
            sofaParent = document.createElement('a');
            sofaParent.setAttribute('href', `./product.html?id=${product._id}`)
            document.querySelector('#items').appendChild(sofaParent);
            //Creation of the parent <article>
            sofaArticle = document.createElement('article');
            sofaParent.appendChild(sofaArticle);
            //Creation of the <img>
            sofaImage = document.createElement('img');
            sofaImage.setAttribute('src', product.imageUrl);
            sofaImage.setAttribute('alt', product.altTxt);
            sofaArticle.appendChild(sofaImage);
            //Creation of the <h3> for the name
            sofaTitle = document.createElement('h3');
            sofaTitle.textContent = product.name;
            sofaTitle.classList.add('productName')
            sofaArticle.appendChild(sofaTitle);
            //Creation of the <p> for the description
            sofaDescription = document.createElement('p');
            sofaDescription.textContent = product.description;
            sofaDescription.classList.add('productDescription')
            sofaArticle.appendChild(sofaDescription);

        //     document.querySelector('#items').innerHTML += `<a href="./product.html?id=${product._id}">
        //     <article>
        //       <img src=${product.imageUrl} alt=${product.altTxt}>
        //       <h3 class="productName">${product.name}</h3>
        //       <p class="productDescription">${product.description}</p>
        //     </article>
        //   </a>`;
        }
    })
    .catch(function(err) {
        console.log(err);
    });  
}

//display products on the page loading
displayProducts();