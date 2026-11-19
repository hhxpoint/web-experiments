const cartData = [
  { id: 1, name: "旺旺星", price: 600, quantity: 1 },
  { id: 2, name: "大欢欢", price: 900, quantity: 1 }
];

const cartBody = document.getElementById("cartBody");
const totalPriceElement = document.getElementById("totalPrice");
const noticeElement = document.getElementById("notice");
const updateBtn = document.getElementById("updateBtn");
const continueBtn = document.getElementById("continueBtn");
const clearBtn = document.getElementById("clearBtn");
const navTabs = document.getElementById("navTabs");
const titleElement = document.querySelector(".title");
const navLinks = document.querySelectorAll("#navTabs a");
const tabPanels = document.querySelectorAll(".tab-panel");

const tabTitleMap = {
  home: "网站首页",
  news: "宠物新闻",
  hospital: "宠物医院",
  latest: "最新宠物",
  sale: "特价宠物",
  cart: "查看购物车",
  order: "查看订单"
};

function setActiveTab(tabName) {
  navLinks.forEach((link) => {
    const isCurrent = link.dataset.tab === tabName;
    link.classList.toggle("active", isCurrent);
  });

  tabPanels.forEach((panel) => {
    const isCurrent = panel.dataset.panel === tabName;
    panel.classList.toggle("active", isCurrent);
  });

  titleElement.innerHTML = `<span class="dot"></span>${tabTitleMap[tabName] || "查看购物车"}`;

  if (tabName === "cart") {
    noticeElement.textContent = "提示：可直接修改数量后点击“修改订单”。";
    noticeElement.style.color = "#8b6a35";
  } else {
    noticeElement.textContent = `当前显示：${tabTitleMap[tabName] || "页面"}`;
    noticeElement.style.color = "#8b6a35";
  }
}

function renderCart() {
  cartBody.innerHTML = "";

  if (cartData.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="5" style="text-align:center; padding: 20px;">购物车为空，请先添加商品。</td>';
    cartBody.appendChild(tr);
    totalPriceElement.textContent = "0";
    return;
  }

  cartData.forEach((item) => {
    const tr = document.createElement("tr");

    const subtotal = item.price * item.quantity;
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>
        <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="qty-input">
      </td>
      <td class="subtotal">${subtotal}</td>
      <td>
        <button class="remove-btn" data-id="${item.id}">删除</button>
      </td>
    `;

    cartBody.appendChild(tr);
  });

  updateTotal();
}

function updateTotal() {
  const total = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPriceElement.textContent = String(total);
}

function updateOrder() {
  const inputs = document.querySelectorAll(".qty-input");
  let hasInvalid = false;

  inputs.forEach((input) => {
    const id = Number(input.dataset.id);
    const qty = Number(input.value);

    if (!Number.isInteger(qty) || qty <= 0) {
      hasInvalid = true;
      return;
    }

    const target = cartData.find((item) => item.id === id);
    if (target) {
      target.quantity = qty;
    }
  });

  if (hasInvalid) {
    noticeElement.textContent = "数量必须是大于 0 的整数，请检查后再试。";
    noticeElement.style.color = "#c0392b";
    return;
  }

  noticeElement.textContent = "订单已更新。";
  noticeElement.style.color = "#2e7d32";
  renderCart();
}

function removeItem(id) {
  const index = cartData.findIndex((item) => item.id === id);
  if (index !== -1) {
    cartData.splice(index, 1);
  }

  noticeElement.textContent = "商品已删除。";
  noticeElement.style.color = "#2e7d32";
  renderCart();
}

function clearCart() {
  cartData.length = 0;
  noticeElement.textContent = "购物车已清空。";
  noticeElement.style.color = "#2e7d32";
  renderCart();
}

cartBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.classList.contains("remove-btn")) {
    const id = Number(target.dataset.id);
    removeItem(id);
  }
});

updateBtn.addEventListener("click", updateOrder);

continueBtn.addEventListener("click", () => {
  noticeElement.textContent = "已跳转到宠物商品页（示例提示）。";
  noticeElement.style.color = "#8b6a35";
});

clearBtn.addEventListener("click", clearCart);

navTabs.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.tagName === "A" && target.dataset.tab) {
    event.preventDefault();
    setActiveTab(target.dataset.tab);
  }
});

renderCart();
setActiveTab("cart");
