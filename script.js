// Danh sách sản phẩm tĩnh (dữ liệu mẫu)
const PRODUCTS = [
  {
    id: 1,
    name: "Giày bóng đá adidas Predator League Turf Unisex",
    price: 2300000,
    oldPrice: 3000000,
    image: "img/giayadidas.jpg",
  },
  {
    id: 2,
    name: "Men's Nike Mercurial Vapor 16 Academy 'Kylian Mbappé' Multi-Ground Football Boots - Yellow",
    price: 3500000,
    oldPrice: 4300000,
    image: "img/giaynike.jpg",
  },
  {
    id: 3,
    name: "Balo Thời Trang",
    price: 450000,
    oldPrice: 550000,
    image: "img/balo.jpg",
  },
  {
    id: 4,
    name: "Giày đá bóng PUMA Ultra Ultimate Cage TF Fearless",
    price: 1200000,
    oldPrice: 1900000,
    image: "img/giaypuma.jpg",
  },
];

let cart = []; // Mảng chứa các sản phẩm trong giỏ hàng

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartIconContainer = document.getElementById("cartIconContainer");

// Modal Giỏ Hàng
const shoppingCartModal = document.getElementById("shoppingCartModal");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const viewCartBtn = document.getElementById("viewCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn"); // Nút THANH TOÁN

// Modal Thanh Toán
const checkoutModal = document.getElementById("checkoutModal");
const checkoutForm = document.getElementById("checkoutForm");

// Nút Đóng Modal chung
document.querySelectorAll(".close-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const modalId = e.target.dataset.modalId;
    document.getElementById(modalId).style.display = "none";
  });
});

// --- Hàm Khởi tạo Trang Sản phẩm (Không đổi) ---
function renderProducts() {
  productGrid.innerHTML = "";
  PRODUCTS.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    // TRONG file script.js, tìm khối này trong hàm renderProducts:
    card.innerHTML = `
    <img 
        src="${product.image}" 
        alt="${product.name}" 
        class="product-image-actual" 
        onerror="this.onerror=null; this.src='placeholder.png';"
    />
    <div class="product-info">
        <h3>${product.name}</h3>
        <div class="price-group">
            <span class="old-price">${product.oldPrice.toLocaleString(
              "vi-VN"
            )} VNĐ</span>
            <span class="new-price">${product.price.toLocaleString(
              "vi-VN"
            )} VNĐ</span>
        </div>
        <button class="btn-add-to-cart" data-id="${product.id}">
            <i class="fas fa-cart-plus"></i> Thêm vào giỏ
        </button>
    </div>
`;
    productGrid.appendChild(card);
  });
  // Gắn sự kiện cho tất cả các nút 'Thêm vào giỏ'
  productGrid.querySelectorAll(".btn-add-to-cart").forEach((button) => {
    button.addEventListener("click", handleAddToCart);
  });
}

// --- Logic Giỏ Hàng ---

function handleAddToCart(event) {
  const productId = parseInt(event.target.closest("button").dataset.id);
  const product = PRODUCTS.find((p) => p.id === productId);

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();

  // Gợi ý sinh động: Hiệu ứng rung icon giỏ hàng
  cartIconContainer.classList.add("shake");
  setTimeout(() => {
    cartIconContainer.classList.remove("shake");
  }, 500);
}

function updateCartUI() {
  cartCount.textContent = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  renderCartItems();
}

function renderCartItems() {
  cartList.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartList.innerHTML =
      '<p style="text-align: center;">Giỏ hàng trống. Hãy bắt đầu mua sắm!</p>';
  } else {
    cart.forEach((item) => {
      total += item.price * item.quantity;
      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";
      itemElement.innerHTML = `
            <span>${item.name} (${item.price.toLocaleString(
        "vi-VN"
      )} VNĐ)</span>
            <div class="cart-controls">
                <button data-id="${item.id}" data-action="decrease">-</button>
                <span>${item.quantity}</span>
                <button data-id="${item.id}" data-action="increase">+</button>
                <button data-id="${
                  item.id
                }" data-action="remove" class="delete-btn">Xóa</button>
            </div>
        `;
      cartList.appendChild(itemElement);
    });
  }

  cartTotal.textContent = total.toLocaleString("vi-VN") + " VNĐ";

  cartList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", handleCartControls);
  });

  // Ẩn/hiện nút THANH TOÁN nếu giỏ hàng rỗng
  checkoutBtn.disabled = cart.length === 0;
  // Cập nhật màu nút THANH TOÁN dựa trên trạng thái (sử dụng .style.opacity thay vì background-color trực tiếp)
  checkoutBtn.style.opacity = cart.length === 0 ? 0.5 : 1;
}

function handleCartControls(event) {
  const button = event.target;
  const productId = parseInt(button.dataset.id);
  const action = button.dataset.action;
  const itemIndex = cart.findIndex((i) => i.id === productId);

  if (itemIndex === -1) return;
  const item = cart[itemIndex];

  if (action === "increase") {
    item.quantity += 1;
  } else if (action === "decrease") {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart.splice(itemIndex, 1); // Xóa khỏi mảng nếu số lượng <= 0
    }
  } else if (action === "remove") {
    cart.splice(itemIndex, 1); // Xóa hẳn khỏi mảng
  }

  updateCartUI();
}

// --- Logic Chuyển đổi Modal ---

// Mở Modal Giỏ Hàng
cartIconContainer.addEventListener("click", () => {
  shoppingCartModal.style.display = "block";
  renderCartItems();
});
viewCartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  shoppingCartModal.style.display = "block";
  renderCartItems();
});

// Chuyển từ Giỏ hàng sang Thanh toán
checkoutBtn.addEventListener("click", () => {
  if (cart.length > 0) {
    shoppingCartModal.style.display = "none"; // Đóng giỏ hàng
    checkoutModal.style.display = "block"; // Mở thanh toán
  }
});

// Đóng khi click bên ngoài Modal
window.addEventListener("click", (event) => {
  if (event.target == shoppingCartModal || event.target == checkoutModal) {
    event.target.style.display = "none";
  }
});

// --- Xử lý Form Thanh toán (Checkout) ---
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // 1. Thu thập thông tin khách hàng
  const orderInfo = {
    name: document.getElementById("fullName").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
    paymentMethod: document.getElementById("paymentMethod").value,
    items: cart,
    total: cart.reduce((total, item) => total + item.price * item.quantity, 0),
  };

  // 2. Xuất (In) thông tin khách hàng ra Console
  console.log("--- XÁC NHẬN ĐƠN HÀNG MỚI ---");
  console.log("Thông tin Khách hàng:", orderInfo);
  console.log("-------------------------------");
  console.log("Họ và Tên:", orderInfo.name);
  console.log("Điện thoại:", orderInfo.phone);
  console.log("Email:", orderInfo.email);
  console.log("Địa chỉ:", orderInfo.address);
  console.log("Phương thức TT:", orderInfo.paymentMethod);
  console.log("TỔNG TIỀN:", orderInfo.total.toLocaleString("vi-VN") + " VNĐ");
  console.log(
    "Chi tiết sản phẩm:",
    orderInfo.items.map((item) => `${item.name} x${item.quantity}`)
  );

  // Gợi ý sinh động: Thông báo xác nhận đơn hàng (popup)
  alert(
    `Cảm ơn ${
      orderInfo.name
    }! Đơn hàng trị giá ${orderInfo.total.toLocaleString(
      "vi-VN"
    )} VNĐ đã được xác nhận. Chúng tôi sẽ liên hệ qua SĐT ${orderInfo.phone}.`
  );

  // Reset Giỏ hàng và đóng Modal
  cart = [];
  updateCartUI();
  checkoutModal.style.display = "none";

  // Reset form sau khi gửi thành công
  checkoutForm.reset();
});

// Khởi chạy ứng dụng
renderProducts();
