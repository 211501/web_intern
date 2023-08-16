document.addEventListener("DOMContentLoaded", function () {
  const menuList = document.getElementById("menu-list");
  const cartList = document.getElementById("cart-list");
  const totalPrice = document.getElementById("total-price");

  let cartItems = [];

  // Hàm để tạo phần tử HTML cho món hàng
  function createMenuItem(item) {
    const menuItem = document.createElement("div");
    menuItem.classList.add("menu-item");
    menuItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="item-image">
      <h3 class="item-name">${item.name}</h3>
      <p class="item-description">${item.description}</p>
      <p class="item-price">${item.price.toFixed(2)}đ</p>
      <button class="buy-btn">Chọn mua</button>
    `;
    menuItem.dataset.name = item.name;
    menuItem.dataset.price = item.price;
    return menuItem;
  }

  // Đọc dữ liệu từ tệp JSON và hiển thị danh sách món hàng trong menu
  fetch("shoes.json")
    .then(response => response.json())
    .then(data => {
      const shoes = data.shoes;
      shoes.forEach(item => {
        const menuItem = createMenuItem(item);
        menuList.appendChild(menuItem);
      });
    })
    .catch(error => console.error("Lỗi khi đọc dữ liệu JSON:", error));

  

    menuList.addEventListener("click", function (event) {
      if (event.target.classList.contains("buy-btn")) {
        const menuItem = event.target.parentElement;
        const itemName = menuItem.dataset.name;
        const itemPrice = parseFloat(menuItem.dataset.price);
    
        const existingCartItem = cartItems.find(item => item.name === itemName);
        if (existingCartItem) {
          existingCartItem.quantity++;
        } else {
          cartItems.push({ name: itemName, price: itemPrice, quantity: 1 });
        }
    
        // Gửi dữ liệu lên PHP
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "add_to_cart.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              console.log(xhr.responseText); // Hiển thị phản hồi từ PHP
            } else {
              console.error("Lỗi khi gửi dữ liệu lên PHP");
            }
          }
        };
        const data = `item_name=${itemName}&item_price=${itemPrice}&quantity=1`; // Dữ liệu gửi đi
        xhr.send(data);
    
        updateCartView();
    
        event.target.innerHTML = `<img src="/web_intern/check.png" alt="Đã mua" class="buy-icon" />`;
        event.target.disabled = true;
        event.target.classList.add("disabled");
      }
    });
    

  cartList.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-btn")) {
      const cartItem = event.target.parentElement;
      const itemName = cartItem.textContent.split(" - ")[0];

      cartItems = cartItems.filter(item => item.name !== itemName);

      updateCartView();
      
      const buyBtn = menuList.querySelector(`[data-name="${itemName}"] .buy-btn`);
      buyBtn.innerText = "Chọn mua";
      buyBtn.disabled = false;
      buyBtn.classList.remove("disabled");
    }
    
    // Xử lý tăng giảm số lượng món hàng trong giỏ
    if (event.target.classList.contains("quantity-control")) {
      const cartItem = event.target.parentElement;
      const itemName = cartItem.textContent.split(" - ")[0];
      const existingCartItem = cartItems.find(item => item.name === itemName);
      
      if (event.target.classList.contains("increase")) {
        existingCartItem.quantity++;
      } else if (event.target.classList.contains("decrease")) {
        if (existingCartItem.quantity > 1) {
          existingCartItem.quantity--;
        }
      }
      
      updateCartView();
    }
  });

  function updateCartView() {
    if (cartItems.length === 0) {
      cartList.innerHTML = "<p>Giỏ hàng của bạn trống</p>";
      totalPrice.textContent = `0đ`;
    }
    else{
      cartList.innerHTML = "";
      let total = 0;
      for (const cartItem of cartItems) {
        const cartItemTotal = cartItem.price * cartItem.quantity;
        total += cartItemTotal;
        const cartItemElement = document.createElement("li");
        cartItemElement.innerHTML = `${cartItem.name} - ${cartItem.price}đ 
          <button class="quantity-control decrease">-</button>
          <span class="item-quantity">${cartItem.quantity}</span>
          <button class="quantity-control increase">+</button>
          <button class="remove-btn">Xóa</button>`;
        cartList.appendChild(cartItemElement);
      }
      totalPrice.textContent = `${total.toFixed(2)}đ`;
    }
  }
});