const productsContainer = document.querySelector(".products-container")
const openCartButton = document.getElementById("btn-cart")
const closeCartButton = document.getElementById("btn-close")
const cartDOM = document.querySelector(".cart-container")
const cartList = document.querySelector(".cart-list")
const btnPayment = document.querySelector(".btn-payment")
const paymentDOM = document.querySelector(".payment-container")
const closePaymentButton = document.getElementById("btn-payment-close")
const formDOM = document.querySelector(".payment-form")
const category = document.getElementById("category")
const btnMainMenu = document.getElementById("btn-main-menu")
const mainMenu =document.getElementById("main-menu")
const btnMenuClose = document.getElementById("btn-menu-close")
const cartTotalValue = document.getElementById("cartTotalValue")


let cart = []
let cartId = []
let cartCurrent = 0
let cartValue = 0
let cartTotal = 0
openCartButton.addEventListener("click",()=>showCart())
closeCartButton.addEventListener("click",()=>closeCart())
btnMenuClose.addEventListener("click",()=>closeMenu())
mainMenu.addEventListener("mouseleave",()=>closeMenu())
btnMainMenu.addEventListener("click",()=>showMenu())


const getProducts =async ()=>{
        let result = await fetch("product.json")
        let data = await result.json();
        let products = data.items;
        products = products.map(item => {
            const {id, name, price, type, img} = item
            return {id, name, price,type, img}
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
        //showCart()
    }
}})

const addProduct =(id)=>{
    getProducts().then(products=>{
        id=id.slice(4)
        const productToAdd = products.find(product=>product.id==id)
        cart.push({...productToAdd, value:1})
        //display result
        let result = ""
        cartTotal = 0
        cart.forEach(product => {
            cartTotal = cartTotal + product.price*product.value
            result += `
            <div class="cart-item">
                <img src=${product.img}>
                <div class="cart-item-value">
                    <p>${product.name}</p>
                    <p>£${(product.price*product.value).toFixed(2)}</p>
                    <div class="cart-item-qty">
                        <i class="fa-solid fa-circle-minus" id=${product.id}></i><p>${product.value}</p><i class="fa-solid fa-circle-plus" id=${product.id}></i>
                        <i class="fa-solid fa-trash-can" id=${product.id}></i>
                    </div>
                </div>
            </div>
            `})
        cartList.innerHTML = result
        cartTotalValue.innerHTML = `Cart total: £${cartTotal.toFixed(2)}`

        
        cartCurrent = cartCurrent +1
        //show cart item total
        document.querySelector(".cart-total").style.display ="block"
        document.querySelector(".cart-total").innerText = cartCurrent 
        btnPayment.style.display="block"
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
        reloadCart()
        
    }else if (event.target.classList.contains("fa-circle-minus")){
        let id = event.target.id
        let tempItem = cart.find(item => item.id ===id)
        if(tempItem.value>1){
        tempItem.value = tempItem.value - 1
        event.target.nextSibling.innerText =tempItem.value 
        saveCart(cart)
        cartCurrent = cartCurrent -1
        document.querySelector(".cart-total").innerText = cartCurrent
        reloadCart()
        }else if (tempItem.value=1){
        let removeItem = event.target;    
        tempItem.value = tempItem.value - 1
        event.target.nextSibling.innerText =tempItem.value 
        cartCurrent = cartCurrent -1
        document.querySelector(".cart-total").innerText = cartCurrent
        cartList.removeChild(removeItem.parentElement.parentElement.parentElement)
        cart = cart.filter(item=>item.id !== id)
        saveCart(cart)
        let tempButton = ""
        tempButton = "btn-"+id
        document.getElementById(tempButton).innerHTML = `<i class="fas fa-shopping-cart"></i>
        add to bag`
        document.getElementById(tempButton).classList.remove("btn-disable")
        reloadCart()
        }
        
    }else if (event.target.classList.contains("fa-trash-can")){
        let removeItem = event.target;
        let id = removeItem.id;
        let tempItem = cart.find(item => item.id ===id)
        cartCurrent = cartCurrent -tempItem.value
        document.querySelector(".cart-total").innerText = cartCurrent
        cartList.removeChild(removeItem.parentElement.parentElement.parentElement)
        cart = cart.filter(item=>item.id !== id)
        saveCart(cart)
        let tempButton = ""
        tempButton = "btn-"+id
        document.getElementById(tempButton).innerHTML = `<i class="fas fa-shopping-cart"></i>
        add to bag`
        document.getElementById(tempButton).classList.remove("btn-disable")
        reloadCart()
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
        bagButtonValue = tempBag?"In Cart":"<i class='fas fa-shopping-cart'></i>add to bag"
        bagClass = tempBag?" btn-disable":""
        if (category.value === "all"){
            result += `<div class="product">
            <img src=${product.img} class="product-image" alt="product">
            <h3>${product.name}</h3>
            <h4>£${product.price}</h4>
            <p class="bag-btn${bagClass}" id=btn-${product.id}>
            ${bagButtonValue}</p>
            </div>`
        }else{    
            if(category.value===product.type){
                result += `<div class="product">
            <img src=${product.img} class="product-image" alt="product">
            <h3>${product.name}</h3>
            <h4>£${product.price}</h4>
            <p class="bag-btn${bagClass}" id=btn-${product.id}>
            ${bagButtonValue}</p>
            </div>`
            }
        }
})

    productsContainer.innerHTML = result})   
}

const closeMenu = () =>{
    mainMenu.style.display="none"
}
const showMenu = () =>{
    mainMenu.style.display="block"
}

const showCart = () => {
    cartDOM.classList.add("show")    
}

const closeCart = () =>{
    cartDOM.classList.remove("show")
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
    cartCurrent=0
    cart.forEach(item => {
        cartCurrent = cartCurrent+item.value
    })
    //update current cart with local storage//
    document.querySelector(".cart-total").innerText = cartCurrent
    if(cartCurrent>0){
        document.querySelector(".cart-total").style.display ="block"
        btnPayment.style.display="block"
    }
    //render product list
    displayProducts()
    //render cart list

    let result = ""
    cartTotal = 0
        cart.forEach(product => {
            cartTotal = cartTotal + product.price*product.value
            result += `
            <div class="cart-item">
                <img src=${product.img}>
                <div class="cart-item-value">
                    <p>${product.name}</p>
                    <p>£${(product.price*product.value).toFixed(2)}</p>

                    <div class="cart-item-qty">
                        <i class="fa-solid fa-circle-minus" id=${product.id}></i><p>${product.value}</p><i class="fa-solid fa-circle-plus" id=${product.id}></i>
                        <i class="fa-solid fa-trash-can" id=${product.id}></i>
                    </div>
                </div>
            </div>
            `})
        if (result===""){
            result=`<h3 id="cart-empty">Your cart is empty</h3>`
        }
        cartList.innerHTML = result
        cartTotalValue.innerHTML = `Cart total: £${cartTotal.toFixed(2)}`
}
renderAll()

const reloadCart =()=>{
    let result = ""
    cartTotal = 0
        cart.forEach(product => {
            cartTotal = cartTotal + product.price*product.value
            result += `
            <div class="cart-item">
                <img src=${product.img}>
                <div class="cart-item-value">
                    <p>${product.name}</p>
                    <p>£${(product.price*product.value).toFixed(2)}</p>
                    <div class="cart-item-qty">
                        <i class="fa-solid fa-circle-minus" id=${product.id}></i><p>${product.value}</p><i class="fa-solid fa-circle-plus" id=${product.id}></i>
                        <i class="fa-solid fa-trash-can" id=${product.id}></i>
                    </div>
                </div>
            </div>
            `})
            
        cartList.innerHTML = result
        if(cartCurrent===0){
            document.querySelector(".cart-total").style.display ="none"
            cartList.innerHTML = `<h3 id="cart-empty">Your cart is empty</h3>`
            btnPayment.style.display="none"
        }
        cartTotalValue.innerHTML = `Cart total: £${cartTotal.toFixed(2)}`

}

//payment
btnPayment.addEventListener("click",()=>{
    paymentDOM.style.display="block"
})

closePaymentButton.addEventListener("click",()=>{
    paymentDOM.style.display="none"
})

const paymentSubmit=()=>{
    localStorage.clear()
    formDOM.innerHTML="Payment successful"
    setTimeout(()=>location.reload(),2000)
}
const handleForm=event=> { 
    event.preventDefault();
    localStorage.clear()
    formDOM.innerHTML="Payment successful"
    setTimeout(()=>location.reload(),2000)
} 
formDOM.addEventListener('submit', handleForm);

const sorting = () =>{
    displayProducts()
}

category.addEventListener("change",sorting)

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
