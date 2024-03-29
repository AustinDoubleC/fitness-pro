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
const subMenu = document.getElementById("sub-menu")
const cartTotalValue = document.getElementById("cartTotalValue")
const productDOM = document.getElementById("product-detail")
const productMain = document.getElementById("product-detail-container")
const btnProductClose = document.getElementById("btn-product-close")
const btnMainMenuClose = document.getElementById("btn-main-menu-close")
const btnProductAll = document.getElementById("btn-all")
const btnRack = document.getElementById("btn-rack")
const btnWeight = document.getElementById("btn-weight")
const btnBench = document.getElementById("btn-bench")
const btnPaymentSubmit = document.getElementById("payment-submit")

let cart = []
let cartId = []
let cartCurrent = 0
let cartValue = 0
let cartTotal = 0
openCartButton.addEventListener("click",()=>showCart())
closeCartButton.addEventListener("click",()=>closeCart())
btnMainMenuClose.addEventListener("click",()=>closeMenu())
mainMenu.addEventListener("mouseleave",()=>closeMenu())
btnMainMenu.addEventListener("click",()=>showMenu())
btnProductClose.addEventListener("click",()=>closeProductDetail())
btnWeight.addEventListener("click",()=>changeDisplay("weight"))
btnRack.addEventListener("click",()=>changeDisplay("rack"))
btnBench.addEventListener("click",()=>changeDisplay("bench"))
btnProductAll.addEventListener("click",()=>changeDisplay("all"))
btnProductAll.addEventListener("mouseover",()=>showSubMenu())
subMenu.addEventListener("mouseleave",()=>closeSubMenu())
btnPaymentSubmit.addEventListener("click",()=>{handleForm()})


const showSubMenu = ()=>{
    subMenu.style.display="flex"
}

const closeSubMenu = ()=>{
    subMenu.style.display="none"

}

const changeDisplay = (type)=>{
    category.value=type
    displayProducts()
}

const getProducts =async ()=>{
        let result = await fetch("product.json")
        let data = await result.json();
        let products = data.items;
        products = products.map(item => {
            const {id, name, price, type, img, spec} = item
            return {id, name, price,type, img, spec}
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
    
    }else if (event.target.classList.contains("product-image")){
        let id = event.target.id
        showProductDetail(id)
    }
})

const showProductDetail = (id) =>{
    getProducts().then(products=>{
        id=id.slice(4)
        const productToShow = products.find(product=>product.id==id)
        console.log(productToShow)
        productMain.innerHTML = `
        <img src=${productToShow.img}>
        <div>
        <h2>${productToShow.name}</h2>
        <h3>£${productToShow.price}</h3>
        <p>${productToShow.spec}</p>
        </div>
        `
        productDOM.style.display="block"
    })
}


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
            <img src=${product.img} class="product-image" alt="product" id=img-${product.id}>
            <h3>${product.name}</h3>
            <h4>£${product.price}</h4>
            <p class="bag-btn${bagClass}" id=btn-${product.id}>
            ${bagButtonValue}</p>
            </div>`
        }else{    
            if(category.value===product.type){
                result += `<div class="product">
            <img src=${product.img} class="product-image" alt="product" id=img-${product.id}>
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
    btnMainMenuClose.style.display="none"
    btnMainMenu.style.display="block"
}
const showMenu = () =>{
    mainMenu.style.display="block"
    btnMainMenuClose.style.display="block"
    btnMainMenu.style.display="none"
}

const showCart = () => {
    cartDOM.style.display="block"    
}

const closeCart = () =>{
    cartDOM.style.display="none"
}
const saveCart = (cart) =>{
    localStorage.setItem("cart",JSON.stringify(cart))
}

const getCart = () =>{
    return localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[]
}

const closeProductDetail =()=>{
    productDOM.style.display="none"
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
    document.getElementById("payment-total").innerText=`Total amount: £${cartTotal.toFixed(2)}`
})

closePaymentButton.addEventListener("click",()=>{
    paymentDOM.style.display="none"
    paymentAlert.innerText = ""
    paymentName.value=""
    paymentEmail.value=""
    paymentCard.value=""
    paymentMonth.value=""
    paymentYear.value=""
    paymentCvv.value=""
})

const paymentSubmit=()=>{
    localStorage.clear()
    formDOM.innerHTML="Payment successful"
    setTimeout(()=>location.reload(),2000)
}

const filtering = () =>{
    displayProducts()
}

category.addEventListener("change",filtering)

//end of main function

//slideshow

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}

//Payment handling
const paymentAlert = document.getElementById("payment-alert")
let paymentError = ""

const handleForm=()=> { 
if (nameCheck()&&emailCheck()&&creditCardCheck()&&expiryCheck()&&cvvCheck()){
    paymentAlert.innerText = ""
    localStorage.clear()
    formDOM.innerHTML="Payment successful"
    setTimeout(()=>location.reload(),2000)
}else {
    paymentAlert.innerText = paymentError
}
    
} 
const paymentName = document.getElementById("payment-name")
const paymentEmail = document.getElementById("payment-email")
const paymentCard = document.getElementById("payment-card")
const paymentMonth = document.getElementById("payment-month")
const paymentYear = document.getElementById("payment-year")
const paymentCvv = document.getElementById("payment-cvv")

const nameCheck=()=>{
    if (paymentName.value){
        if (!/[^a-zA-Z]/.test(paymentName.value)){
            return true
        }else{
            paymentError="#Name can only contains characters"
        }
    }else paymentError ="#Enter your name"
}
const emailCheck=()=>{
    if (paymentEmail.value){
        if (paymentEmail.value.includes("@")){
            let tempEmail = paymentEmail.value.split("@")
            if (tempEmail[0] && tempEmail[1]){
            return true
            }else paymentError = "Invalid email"
        }else paymentError ="#Email should contains @"
    }else paymentError ="#Enter your email"
}

const creditCardCheck = ()=>{
    if (paymentCard.value){
        if (validateCardNumber(paymentCard.value)){
        return true
        }else{
            paymentError = "#Invalid card number"    
        }
    }else {
        paymentError = "Enter your card number"
    }
}

const validateCardNumber = number => {
    const regex = new RegExp("^[0-9]{13,19}$");
    if (!regex.test(number)){
        return false;
    }
    return luhnCheck(number);
}

const luhnCheck = val => {
    let checksum = 0; 
    let j = 1;
    for (let i = val.length - 1; i >= 0; i--) {
      let calc = 0;
      calc = Number(val.charAt(i)) * j;
      if (calc > 9) {
        checksum = checksum + 1;
        calc = calc - 10;
      }
      checksum = checksum + calc;
      if (j == 1) {
        j = 2;
      } else {
        j = 1;
      }
    }
    return (checksum % 10) == 0;
}

const expiryCheck = ()=>{
    if (paymentMonth.value && paymentYear.value){
        if (/^\d+$/.test(paymentMonth.value) && /^\d+$/.test(paymentYear.value)){
            if (paymentMonth.value >=1 && paymentMonth.value <=12 && paymentMonth.value.length ===2){
                if (paymentYear.value >=0 && paymentYear.value <=99 && paymentYear.value.length ===2){
                    return true
                }else paymentError = "Year value should between 00-99"
            }else paymentError = "Month value should between 1-12"
        }else paymentError = "Expiry date should only contains numbers"
    }else paymentError = "Enter expiry date"
}

const cvvCheck = ()=>{
    if (paymentCvv.value && paymentCvv.value){
        if (/^\d+$/.test(paymentCvv.value) && /^\d+$/.test(paymentCvv.value)){
            if (paymentCvv.value >=1 && paymentCvv.value <=999 && paymentCvv.value.length ===3){
                return true
            }else paymentError = "CVV value should between 000-999"
        }else paymentError = "CVV should only contains numbers"
    }else paymentError = "Enter CVV"
}