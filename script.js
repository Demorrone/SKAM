const slides = [
	{ title: "Cyberdruk 2077", image: "cyberdruk.webp", tagline: "Місто пам’ятає все.", description: "Станьте легендою нічного міста у масштабній RPG про свободу вибору." },
	{ title: "Interpol Strike 2", image: "is2.webp", tagline: "Команда вирішує все.", description: "Зберіть загін і проведіть ідеальну операцію в тактичному шутері." },
	{ title: "Blue Alive Damnation II", image: "bad2.webp", tagline: "Дикий Захід не пробачає.", description: "Велика пригода про свободу, вірність і ціну другого шансу." },
	{ title: "Persona 3 Reborn", image: "p3r.webp", tagline: "Ніч належить тобі.", description: "Удень живіть звичайним життям, а вночі розкрийте таємницю Темної години." },
	{ title: "Become Drun", image: "drun.webp", tagline: "Кожен вибір має ціну.", description: "Розслідуйте злочин у місті, де людина й машина стали одним цілим." },
	{ title: "Ultrakall", image: "ultrakall.webp", tagline: "Рухайся. Або зникни.", description: "Стрімкий бойовий екшн, де все вирішують точність і швидкість." }
];

const featureImage = document.querySelector("#feature-image");
const featureTitle = document.querySelector("#feature-title");
const featureWordmark = document.querySelector("#feature-wordmark");
const featureDescription = document.querySelector("#feature-description");
const slideCount = document.querySelector("#slide-count");
const dots = [...document.querySelectorAll(".carousel-dots button")];
const searchInput = document.querySelector("#store-search");
let activeSlide = 0;
let cartCount = 0;
const cartItems = new Map();
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const products = new Map([
	["Cyberdruk 2077", { price: 4949, original: 8999, discount: "−45%", image: "cyberdruk.webp" }],
	["Interpol Strike 2", { price: 3899, original: 5999, discount: "−35%", image: "is2.webp" }],
	["Blue Alive Damnation II", { price: 3599, original: 5999, discount: "−40%", image: "bad2.webp" }],
	["Persona 3 Reborn", { price: 3749, original: 4999, discount: "−25%", image: "p3r.webp" }],
	["Persona 4 Rehammer", { price: 4499, original: 4999, discount: "−10%", image: "p4r.webp" }],
	["Become Drun", { price: 1199, original: 2999, discount: "−60%", image: "drun.webp" }],
	["Ultrakall", { price: 999, original: 1999, discount: "−50%", image: "ultrakall.webp" }]
]);
const cartDialog = document.querySelector("#cart-dialog");
const cartItemsElement = document.querySelector("#cart-items");
const cartTotalElement = document.querySelector("#cart-total");
const cartStatusElement = document.querySelector("#cart-status");
const checkoutButton = document.querySelector("#checkout-button");
const favoriteGrid = document.querySelector("#favorite-grid");
const favoritesEmpty = document.querySelector("#favorites-empty");
const favoriteCount = document.querySelector("#favorite-count");
const favoritesCountLabel = document.querySelector("#favorites-count-label");

function loadFavorites() {
	try {
		const savedFavorites = JSON.parse(localStorage.getItem("skam-favorites") || "[]");
		return new Set(Array.isArray(savedFavorites) ? savedFavorites.filter((name) => products.has(name)) : []);
	} catch {
		return new Set();
	}
}

const favorites = loadFavorites();

function updateCartCount() {
	cartCount = [...cartItems.values()].reduce((total, item) => total + item.quantity, 0);
	document.querySelector("#cart-count").textContent = String(cartCount);
	const itemLabel = cartCount === 1 ? "товар" : cartCount >= 2 && cartCount <= 4 ? "товари" : "товарів";
	document.querySelector(".cart-link").setAttribute("aria-label", `Відкрити кошик, ${cartCount} ${itemLabel}`);
}

function renderCart() {
	cartItemsElement.replaceChildren();
	let totalPrice = 0;

	if (cartItems.size === 0) {
		const emptyMessage = document.createElement("p");
		emptyMessage.className = "cart-empty";
		emptyMessage.textContent = "Ваш кошик поки порожній.";
		cartItemsElement.append(emptyMessage);
	}

	cartItems.forEach((item, name) => {
		const lineTotal = item.price * item.quantity;
		totalPrice += lineTotal;
		const row = document.createElement("article");
		row.className = "cart-item";
		const image = document.createElement("img");
		image.src = item.image;
		image.alt = "";
		const copy = document.createElement("div");
		copy.className = "cart-item-copy";
		const title = document.createElement("strong");
		title.textContent = name;
		const price = document.createElement("small");
		price.textContent = `${currency.format(item.price / 100)} × ${item.quantity} = ${currency.format(lineTotal / 100)}`;
		copy.append(title, price);
		const actions = document.createElement("div");
		actions.className = "cart-item-actions";
		const quantity = document.createElement("div");
		quantity.className = "quantity-control";
		const decrease = document.createElement("button");
		decrease.type = "button";
		decrease.dataset.action = "decrease";
		decrease.dataset.game = name;
		decrease.setAttribute("aria-label", `Зменшити кількість: ${name}`);
		decrease.textContent = "−";
		const quantityValue = document.createElement("span");
		quantityValue.textContent = String(item.quantity);
		const increase = document.createElement("button");
		increase.type = "button";
		increase.dataset.action = "increase";
		increase.dataset.game = name;
		increase.setAttribute("aria-label", `Збільшити кількість: ${name}`);
		increase.textContent = "+";
		quantity.append(decrease, quantityValue, increase);
		const remove = document.createElement("button");
		remove.type = "button";
		remove.className = "cart-remove";
		remove.dataset.action = "remove";
		remove.dataset.game = name;
		remove.textContent = "Видалити";
		actions.append(quantity, remove);
		row.append(image, copy, actions);
		cartItemsElement.append(row);
	});

	cartTotalElement.textContent = currency.format(totalPrice / 100);
	checkoutButton.disabled = cartItems.size === 0;
	updateCartCount();
}

function addGameToCart(name) {
	const product = products.get(name);
	if (!product) return;
	const existing = cartItems.get(name);
	cartItems.set(name, { ...product, quantity: (existing?.quantity ?? 0) + 1 });
	cartStatusElement.textContent = `${name} додано до кошика.`;
	renderCart();
}

function renderFavorites() {
	favoriteGrid.replaceChildren();
	document.querySelectorAll(".recommendation-section .game-card").forEach((card) => {
		const name = card.dataset.title;
		const isFavorite = favorites.has(name);
		const button = card.querySelector(".favorite-button");
		button.setAttribute("aria-pressed", String(isFavorite));
		button.setAttribute("aria-label", `${isFavorite ? "Прибрати" : "Додати"} ${name} ${isFavorite ? "з" : "до"} обраного`);
		button.textContent = isFavorite ? "♥" : "♡";
	});

	favorites.forEach((name) => {
		const sourceCard = [...document.querySelectorAll(".recommendation-section .game-card")]
			.find((card) => card.dataset.title === name);
		if (!sourceCard) return;
		const card = sourceCard.cloneNode(true);
		const button = card.querySelector(".favorite-button");
		button.setAttribute("aria-pressed", "true");
		button.setAttribute("aria-label", `Прибрати ${name} з обраного`);
		button.textContent = "♥";
		favoriteGrid.append(card);
	});

	const count = favoriteGrid.children.length;
	favoritesEmpty.classList.toggle("is-hidden", count > 0);
	favoriteGrid.classList.toggle("is-hidden", count === 0);
	favoriteCount.textContent = String(count);
	favoriteCount.hidden = count === 0;
	favoritesCountLabel.textContent = `${count} ${count === 1 ? "гра" : count >= 2 && count <= 4 ? "ігри" : "ігор"}`;
	localStorage.setItem("skam-favorites", JSON.stringify([...favorites]));
}

function setFavorite(name, isFavorite) {
	if (isFavorite) favorites.add(name);
	else favorites.delete(name);
	document.querySelectorAll(".game-card").forEach((card) => {
		if (card.dataset.title !== name) return;
		const button = card.querySelector(".favorite-button");
		button.setAttribute("aria-pressed", String(isFavorite));
		button.textContent = isFavorite ? "♥" : "♡";
		button.setAttribute("aria-label", `${isFavorite ? "Прибрати" : "Додати"} ${name} ${isFavorite ? "з" : "до"} обраного`);
	});
	renderFavorites();
}

function applyGameFilters() {
	const query = searchInput.value.trim().toLowerCase();
	const filter = document.querySelector(".filter-tabs button.selected").dataset.filter;

	document.querySelectorAll(".game-row").forEach((game) => {
		const matchesFilter = filter === "all" || game.dataset.category.split(" ").includes(filter);
		const matchesSearch = game.dataset.title.toLowerCase().includes(query);
		game.classList.toggle("is-hidden", !matchesFilter || !matchesSearch);
	});
	document.querySelectorAll(".game-card").forEach((game) => {
		game.classList.toggle("is-hidden", !game.dataset.title.toLowerCase().includes(query));
	});
}

function showSlide(index) {
	activeSlide = (index + slides.length) % slides.length;
	const slide = slides[activeSlide];
	featureImage.src = slide.image;
	featureImage.alt = `Обкладинка ${slide.title}`;
	featureTitle.textContent = slide.title;
	featureWordmark.innerHTML = slide.title.replace(" ", "<br>");
	featureDescription.textContent = slide.description;
	const product = products.get(slide.title);
	const purchaseRow = document.querySelector(".feature-details .purchase-row");
	purchaseRow.querySelector(".discount").textContent = product.discount;
	purchaseRow.querySelector(".price-stack del").textContent = currency.format(product.original / 100);
	purchaseRow.querySelector(".price-stack strong").textContent = currency.format(product.price / 100);
	document.querySelector(".feature-details .add-to-cart").dataset.game = slide.title;
	document.querySelector(".feature-details .add-to-cart").setAttribute("aria-label", `Додати ${slide.title} до кошика`);
	slideCount.innerHTML = `${String(activeSlide + 1).padStart(2, "0")} <i>/</i> 06`;
	dots.forEach((dot, dotIndex) => dot.classList.toggle("selected", dotIndex === activeSlide));
}

document.querySelector("#slide-prev").addEventListener("click", () => showSlide(activeSlide - 1));
document.querySelector("#slide-next").addEventListener("click", () => showSlide(activeSlide + 1));
dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));

document.querySelectorAll(".filter-tabs button").forEach((tab) => {
	tab.addEventListener("click", () => {
		document.querySelectorAll(".filter-tabs button").forEach((item) => {
			const selected = item === tab;
			item.classList.toggle("selected", selected);
			item.setAttribute("aria-selected", String(selected));
		});
		applyGameFilters();
	});
});

searchInput.addEventListener("input", applyGameFilters);

document.addEventListener("click", (event) => {
	const favoriteButton = event.target.closest(".favorite-button");
	if (favoriteButton) {
		const isFavorite = favoriteButton.getAttribute("aria-pressed") === "true";
		setFavorite(favoriteButton.closest(".game-card").dataset.title, !isFavorite);
		return;
	}

	const addButton = event.target.closest(".add-to-cart");
	if (!addButton) return;
	addGameToCart(addButton.dataset.game);
	if (addButton.classList.contains("primary-button")) {
		addButton.innerHTML = "✓ Додано";
		window.setTimeout(() => { addButton.innerHTML = "<span aria-hidden=\"true\">＋</span> До кошика"; }, 1200);
	}
});

document.querySelector(".cart-link").addEventListener("click", () => cartDialog.showModal());
document.querySelector("#cart-close").addEventListener("click", () => cartDialog.close());
document.querySelector("#continue-shopping").addEventListener("click", () => cartDialog.close());
cartDialog.addEventListener("click", (event) => {
	if (event.target === cartDialog) cartDialog.close();
});
cartItemsElement.addEventListener("click", (event) => {
	const button = event.target.closest("button[data-action]");
	if (!button) return;
	const item = cartItems.get(button.dataset.game);
	if (!item) return;
	if (button.dataset.action === "increase") {
		item.quantity += 1;
		cartStatusElement.textContent = "Кількість оновлено.";
	} else if (button.dataset.action === "decrease") {
		item.quantity -= 1;
		cartStatusElement.textContent = "Кількість оновлено.";
	} else {
		cartItems.delete(button.dataset.game);
		cartStatusElement.textContent = "Товар видалено з кошика.";
	}
	if (item.quantity <= 0) {
		cartItems.delete(button.dataset.game);
		cartStatusElement.textContent = "Товар видалено з кошика.";
	}
	renderCart();
});
checkoutButton.addEventListener("click", () => {
	if (cartItems.size === 0) return;
	cartItems.clear();
	renderCart();
	cartStatusElement.textContent = "Замовлення оформлено. Це демоверсія, оплату не списано.";
});

renderCart();
renderFavorites();
