const productsContainer = document.querySelector(".products-container")
const openCartButton = document.getElementById("btn-cart")
const closeCartButton = document.getElementById("btn-close")
const cartDOM = document.querySelector(".cart-container")
const cartList = document.querySelector(".cart-list")

let cart = []
let cartId = []
let cartCurrent = 0
openCartButton.addEventListener("click",()=>showCart())
closeCartButton.addEventListener("click",()=>closeCart())

const getProducts =async ()=>{
        let result = await fetch("product.json")
        let data = await result.json();
        let products = data.items;
        products = products.map(item => {
            const {id, name, price, img} = item
            return {id, name, price, img}
        })
        return products
}

productsContainer.addEventListener("click",event=>{
    if (event.target.classList.contains("bag-btn")){
        if(event.target.classList.contains("btn-disable")===false){
        let id = event.target.id
        document.getElementById(id).innerHTML = "In Cart"
        document.getElementById(id).classList.add("btn-disable")
        addProduct(id)
        showCart()}
}})

const addProduct =(id)=>{
    getProducts().then(products=>{
        id=id.slice(4)
        const productToAdd = products.find(product=>product.id==id)
        cart.push({...productToAdd, value:1})
        //display result
        let result = ""
        cart.forEach(product => {
            result += `
            <div class="cart-item">
                <img src=${product.img}>
                <div class="cart-item-value">
                    <p>${product.name}</p>
                    <div class="cart-item-qty">
                        <i class="fa-solid fa-circle-minus" id=${product.id}></i><p>${product.value}</p><i class="fa-solid fa-circle-plus" id=${product.id}></i>
                        <i class="fa-solid fa-trash-can" id=${product.id}></i>
                    </div>
                </div>
            </div>
            `})
        cartList.innerHTML = result
        cartCurrent = cartCurrent +1
        //show cart item total
        document.querySelector(".cart-total").style.display ="block"
        document.querySelector(".cart-total").innerText = cartCurrent 
        saveCart(cart)
})}


cartList.addEventListener("click",event=>{
    if(event.target.classList.contains("fa-circle-plus")){
        let id = event.target.id
        let tempItem = cart.find(item => item.id ===id)
        tempItem.value = tempItem.value + 1
        event.target.previousSibling.innerText =tempItem.value 
        saveCart(cart)
        cartCurrent = cartCurrent +1
        document.querySelector(".cart-total").innerText = cartCurrent 
    }else if (event.target.classList.contains("fa-circle-minus")){
        let id = event.target.id
        let tempItem = cart.find(item => item.id ===id)
        if(tempItem.value>1){
        tempItem.value = tempItem.value - 1
        event.target.nextSibling.innerText =tempItem.value 
        saveCart(cart)
        cartCurrent = cartCurrent -1
        document.querySelector(".cart-total").innerText = cartCurrent
        }else if (tempItem.value=1){
        let removeItem = event.target;    
        tempItem.value = tempItem.value - 1
        event.target.nextSibling.innerText =tempItem.value 
        cartCurrent = cartCurrent -1
        document.querySelector(".cart-total").innerText = cartCurrent
        cartList.removeChild(removeItem.parentElement.parentElement.parentElement)
        cart = cart.filter(item=>item.id !== id)
        if(cartCurrent===0){
            document.querySelector(".cart-total").style.display ="none"
        }
        saveCart(cart)
        let tempButton = ""
        tempButton = "btn-"+id
        document.getElementById(tempButton).innerHTML = `<i class="fas fa-shopping-cart"></i>
        add to bag`
        document.getElementById(tempButton).classList.remove("btn-disable")
        }
        

    }else if (event.target.classList.contains("fa-trash-can")){
        let removeItem = event.target;
        let id = removeItem.id;
        let tempItem = cart.find(item => item.id ===id)
        cartCurrent = cartCurrent -tempItem.value
        if(cartCurrent===0){
            document.querySelector(".cart-total").style.display ="none"
        }
        document.querySelector(".cart-total").innerText = cartCurrent
        cartList.removeChild(removeItem.parentElement.parentElement.parentElement)
        cart = cart.filter(item=>item.id !== id)
        saveCart(cart)
        let tempButton = ""
        tempButton = "btn-"+id
        document.getElementById(tempButton).innerHTML = `<i class="fas fa-shopping-cart"></i>
        add to bag`
        document.getElementById(tempButton).classList.remove("btn-disable")
        
    }   
})

const displayProducts = () =>{
    getProducts().then(products=>{
    let result = ""
    cart.forEach(item=>{
        cartId.push(item.id)
    })
    products.forEach(product => {  
        let tempBag = false
        let bagButtonValue = ""
        let bagClass = ""
        for (let i =0;i<cartId.length;i++){
            if (cartId[i]==product.id){
                tempBag =true
                break
            }
        }
        console.log(tempBag)
        bagButtonValue = tempBag?"In Cart":"<i class='fas fa-shopping-cart'></i>add to bag"
        bagClass = tempBag?" btn-disable":""
        result += `<div class="product">
            <img src=${product.img} class="product-image" alt="product">
            <h3>${product.name}</h3>
            <h4>£${product.price}</h4>
            <p class="bag-btn${bagClass}" id=btn-${product.id}>
            ${bagButtonValue}</p>
            </div>`
})

    productsContainer.innerHTML = result})   
}

const showCart = () => {
    cartDOM.classList.add("disable")    
}

const closeCart = () =>{
    cartDOM.classList.remove("disable")
}
const saveCart = (cart) =>{
    localStorage.setItem("cart",JSON.stringify(cart))
}

const getCart = () =>{
    return localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[]
}

const renderAll = () =>{
    //update cart with local storage//
    cart = getCart()
    cart.forEach(item => {
        cartCurrent = cartCurrent+item.value
    })
    //update current cart with local storage//
    document.querySelector(".cart-total").innerText = cartCurrent
    if(cartCurrent>0){
        document.querySelector(".cart-total").style.display ="block"
    }
    //render product list
    displayProducts()

    //render cart list
    let result = ""
        cart.forEach(product => {
            result += `
            <div class="cart-item">
                <img src=${product.img}>
                <div class="cart-item-value">
                    <p>${product.name}</p>
                    <div class="cart-item-qty">
                        <i class="fa-solid fa-circle-minus" id=${product.id}></i><p>${product.value}</p><i class="fa-solid fa-circle-plus" id=${product.id}></i>
                        <i class="fa-solid fa-trash-can" id=${product.id}></i>
                    </div>
                </div>
            </div>
            `})
        cartList.innerHTML = result
}
renderAll()

//end of main function

//slideshow

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

//end of slideshow
