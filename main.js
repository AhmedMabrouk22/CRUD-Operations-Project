// call all input elements from html
let outputDiv = document.querySelector(".output");
let title = document.getElementById("name");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let totalPrice = document.getElementById("total-number");
let count = document.getElementById("count");
let category = document.getElementById("cat");
let add = document.getElementById("add");
let notification = document.getElementById("notification");
let tableBody = document.getElementById("tableBody");
let productNameRadio = document.getElementById("product-name");
let categoryNameRadio = document.getElementById("category-name");
let searchInput = document.getElementById("search");
let productIdx = -1;
let productPos;
let products = [];

// page reload
getDataFromLocalStorage();
showData();

function searchInputPlaceholder() {
    if(productNameRadio.checked) {
        searchInput.placeholder = "Search by product name";
    } else {
        searchInput.placeholder = "Search by category name";
    }

}

// Update localStorage
function updateLocalStorage() {
    localStorage.setItem("products", JSON.stringify(products));
}

// getData from LocalStorage
function getDataFromLocalStorage() {
    if(localStorage.products != null)
        products = JSON.parse(localStorage.products);
}

// Update table
function showData() {
    let row = "";
    for(let i = 0 ; i < products.length ; ++i) {
        row += `
            <tr>
                <th class ="product-id">${i+1}</th>
                <th>${products[i].title}</th>
                <th>${products[i].category}</th>
                <th>${products[i].price}</th>
                <th>${products[i].taxes}</th>
                <th>${products[i].ads}</th>
                <th>${products[i].discount}</th>
                <th>${products[i].total}</th>
                <th>${products[i].count}</th>
                <th>
                    <button onclick="addDataInInputForms(${i})" id="edit">edit</button>
                    <button onclick="deleteItem(${i})" id="delete">delete item</button>
                    <button onclick="DeleteAll(${i})" id="delete-all">delete all</button>
                </th>
            </tr>
        `;
    }
    tableBody.innerHTML = row;
}

// Clear input form 
function clearData() {
    title.value = "";
    category.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    count.value = "1";
    totalPrice.textContent = "";
}

// Calculate total price
function getTotal() {
    if (+discount.value <  (+price.value + +taxes.value + +ads.value) && price.value !== '') {
        totalPrice.textContent = (+price.value + +taxes.value + +ads.value) - +discount.value;
    } else {
        totalPrice.textContent = 0;
    }
}

// ShowData in input forms 
function addDataInInputForms(idx) {
    let product = products[idx];
    let allRows = document.querySelectorAll("tbody tr");
    productPos = allRows[idx].offsetTop;
    console.log(productPos);
    scroll({
        top: 0,
        behavior: "smooth"
    });

    title.value = product.title;
    price.value = product.price;
    taxes.value = product.taxes;
    ads.value = product.ads;
    discount.value = product.discount;
    totalPrice.textContent = product.total;
    count.value = product.count;
    category.value = product.category;
    productIdx = idx;
    add.value = "Edit";
}

// Delete Item
function deleteItem(idx) {
    clearData();
    if (products[idx].count > 0) {
        products[idx].count -= 1;
    } else {
        products.splice(productIdx,1);
    }
    updateLocalStorage();
    showData();
}

// Delete all
function DeleteAll(idx) {
    clearData();
    products.splice(productIdx,1);
    updateLocalStorage();
    showData();
}

// Add Product 
function addProduct() {
    if (title.value === '' || price.value === '' || category.value === '') {
        notification.textContent = "Please add all data";
        notification.style.display = "block";
        return;
    } 

    notification.style.display = "none";
    let product = {
        title    : title.value,
        category : category.value,
        price    : price.value,
        taxes    : taxes.value,
        ads      : ads.value,
        discount : discount.value,
        total    : totalPrice.textContent,
        count    : count.value  
    }

    if (+price.value <= 0 || +taxes.value < 0 || +ads.value < 0 || +discount.value < 0 || +count.value <= 0) {
        notification.textContent = "Please add valid data";
        notification.style.display = "block";
        return;
    }

    if (this.value === "Add Product")
        products.push(product);
    else {
        products[productIdx] = product;
        add.value = "Add Product";
        scroll({
            top: (document.body.clientHeight - outputDiv.clientHeight) + productPos,
            behavior: "smooth"
        });
    } 
        
    updateLocalStorage();
    clearData();
    showData();
}

// Search
function productsSearch() {
    findProducts(searchInput.value.toLowerCase(),productNameRadio.checked);
}

// Find Products 
function findProducts(str,type) {
    let table = "";
    let property = "title";

    if (type === false) {
        property = "category";
    }

    for(let i = 0 ; i < products.length ; ++i)
    {
        if (products[i][property].toLowerCase().includes(str)) {
            table += `
                <tr>
                    <th class ="product-id">${i+1}</th>
                    <th>${products[i].title}</th>
                    <th>${products[i].category}</th>
                    <th>${products[i].price}</th>
                    <th>${products[i].taxes}</th>
                    <th>${products[i].ads}</th>
                    <th>${products[i].discount}</th>
                    <th>${products[i].total}</th>
                    <th>${products[i].count}</th>
                    <th>
                        <button onclick="addDataInInputForms(${i})" id="edit">edit</button>
                        <button onclick="deleteItem(${i})" id="delete">delete item</button>
                        <button onclick="DeleteAll(${i})" id="delete-all">delete all</button>
                    </th>
                </tr>
            `;
        }
    }
    tableBody.innerHTML = table;
}

add.addEventListener("click",addProduct);
