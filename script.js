const slides = [
	{ title: "Cyberdruk 2067", image: "cyberdruk.webp", tagline: "Місто пам’ятає все.", description: "Станьте легендою нічного міста у масштабній RPG про свободу вибору." },
	{ title: "Interpol Strike 2", image: "is2.webp", tagline: "Команда вирішує все.", description: "Зберіть загін і проведіть ідеальну операцію в тактичному шутері." },
	{ title: "Blue Alive Damnation II", image: "bad2.webp", tagline: "Дикий Захід не пробачає.", description: "Велика пригода про свободу, вірність і ціну другого шансу." },
	{ title: "Perdrun 3 Reburmalda", image: "p3r.webp", tagline: "Ніч належить тобі.", description: "Удень живіть звичайним життям, а вночі розкрийте таємницю Темної години." },
	{ title: "Become Drun", image: "drun.webp", tagline: "Кожен вибір має ціну.", description: "Розслідуйте злочин у місті, де людина й машина стали одним цілим." },
	{ title: "Ultrakall", image: "ultrakall.webp", tagline: "Рухайся. Або зникни.", description: "Стрімкий бойовий екшн, де все вирішують точність і швидкість." }
];

const featureImage = document.querySelector("#feature-image");
const featureTitle = document.querySelector("#feature-title .game-title-button");
const featureWordmark = document.querySelector("#feature-wordmark");
const featureDescription = document.querySelector("#feature-description");
const slideCount = document.querySelector("#slide-count");
const dots = [...document.querySelectorAll(".carousel-dots button")];
const searchInput = document.querySelector("#store-search");
let activeSlide = 0;
let cartCount = 0;
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const products = new Map([
	["Cyberdruk 2067", { price: 4949, original: 8999, discount: "−45%", image: "cyberdruk.webp" }],
	["Interpol Strike 2", { price: 3899, original: 5999, discount: "−35%", image: "is2.webp" }],
	["Blue Alive Damnation II", { price: 3599, original: 5999, discount: "−40%", image: "bad2.webp" }],
	["Perdrun 3 Reburmalda", { price: 3749, original: 4999, discount: "−25%", image: "p3r.webp" }],
	["Perdrun 4 Rehammam", { price: 4499, original: 4999, discount: "−10%", image: "p4r.webp" }],
	["Become Drun", { price: 1199, original: 2999, discount: "−60%", image: "drun.webp" }],
	["Ultrakall", { price: 999, original: 1999, discount: "−50%", image: "ultrakall.webp" }]
]);
const gameDetails = new Map([
	["Cyberdruk 2067", { description: "Досліджуйте неоновий мегаполіс, виконуйте контракти та вирішуйте, ким станете у місті, що ніколи не спить.", genres: ["Відкритий світ", "RPG", "Екшн"], developer: "Red Engine Studio", release: "10 жовтня 2026", review: "Дуже схвальні", reviews: "48 291 відгук", players: "24 891" }],
	["Interpol Strike 2", { description: "Плануйте штурми, координуйте загін і проходьте напружені тактичні операції разом із друзями.", genres: ["Тактичний шутер", "Кооператив", "Екшн"], developer: "Northline Works", release: "18 вересня 2026", review: "Дуже схвальні", reviews: "18 402 відгуки", players: "8 412" }],
	["Blue Alive Damnation II", { description: "Вирушайте на Дикий Захід, де кожне рішення змінює долю вашого загону та цілого краю.", genres: ["Пригода", "Відкритий світ", "Екшн"], developer: "Frontier House", release: "22 серпня 2026", review: "Надзвичайно схвальні", reviews: "42 108 відгуків", players: "16 520" }],
	["Perdrun 3 Reburmalda", { description: "Проведіть команду крізь таємничий Темний час у рольовій історії про дружбу, вибір і дорослішання.", genres: ["JRPG", "Сюжетна гра", "Покрокова"], developer: "Atlus North", release: "12 липня 2026", review: "Дуже схвальні", reviews: "9 624 відгуки", players: "3 281" }],
	["Perdrun 4 Rehammam", { description: "Поверніться до тихого містечка, знайдіть друзів і розкрийте загадки, що ховаються за щоденним туманом.", genres: ["JRPG", "Пригода", "Аніме"], developer: "Atlus North", release: "30 червня 2026", review: "Дуже схвальні", reviews: "6 214 відгуків", players: "2 093" }],
	["Become Drun", { description: "Розслідуйте злочин у футуристичному місті, де кожен допит і кожен вибір веде до іншої правди.", genres: ["Наукова фантастика", "Детектив", "Сюжетна гра"], developer: "Quantic North", release: "6 травня 2026", review: "Дуже схвальні", reviews: "31 804 відгуки", players: "4 217" }],
	["Ultrakall", { description: "Пробивайтеся крізь арени на надлюдській швидкості: точність, реакція та ритм тут важливіші за перепочинок.", genres: ["Екшн", "Шутер", "Швидкий темп"], developer: "Iron Cathedral", release: "14 березня 2026", review: "Надзвичайно схвальні", reviews: "12 890 відгуків", players: "5 606" }]
]);
function normalizeGameName(name) {
	if (name === "Cyberdruk 2077") return "Cyberdruk 2067";
	if (name === "Persona 3 Reborn") return "Perdrun 3 Reburmalda";
	return name;
}

function loadCart() {
	try {
		const savedCart = JSON.parse(localStorage.getItem("skam-cart") || "[]");
		if (!Array.isArray(savedCart)) return new Map();
		return new Map(savedCart.flatMap((item) => {
			const name = normalizeGameName(item?.name);
			const product = products.get(name);
			const quantity = Number(item?.quantity);
			const price = Number(item?.price);
			if (!product || !Number.isSafeInteger(quantity) || quantity < 1 || !Number.isSafeInteger(price) || price < 1) return [];
			return [[name, { ...product, price, quantity }]];
		}));
	} catch {
		return new Map();
	}
}

const cartItems = loadCart();
const cartDialog = document.querySelector("#cart-dialog");
const gameDialog = document.querySelector("#game-dialog");
const gameDialogTitle = document.querySelector("#game-dialog-title");
const gameDialogImage = document.querySelector("#game-detail-image");
const gameDialogTags = document.querySelector("#game-detail-tags");
const gameDialogCart = document.querySelector("#game-detail-cart");
const gameDialogFavorite = document.querySelector("#game-detail-favorite");
const cartItemsElement = document.querySelector("#cart-items");
const cartTotalElement = document.querySelector("#cart-total");
const cartStatusElement = document.querySelector("#cart-status");
const checkoutButton = document.querySelector("#checkout-button");
const favoriteGrid = document.querySelector("#favorite-grid");
const favoritesEmpty = document.querySelector("#favorites-empty");
const favoriteCount = document.querySelector("#favorite-count");
const favoritesCountLabel = document.querySelector("#favorites-count-label");
const profileDialog = document.querySelector("#profile-dialog");
const profileForm = document.querySelector("#profile-form");
const nicknameInput = document.querySelector("#nickname-input");
const avatarFile = document.querySelector("#avatar-file");
const avatarPreview = document.querySelector("#avatar-preview");
const profileStatus = document.querySelector("#profile-status");
let playerProfile = loadProfile();
let pendingAvatar = playerProfile.avatar;

function loadProfile() {
	try {
		const savedProfile = JSON.parse(localStorage.getItem("skam-profile") || "{}");
		const name = typeof savedProfile.name === "string" ? savedProfile.name.trim().slice(0, 24) : "Nox";
		const avatar = typeof savedProfile.avatar === "string" && /^data:image\/(webp|png|jpeg);base64,/i.test(savedProfile.avatar) ? savedProfile.avatar : "";
		return { name: name || "Nox", avatar };
	} catch {
		return { name: "Nox", avatar: "" };
	}
}

function renderAvatar(element, name, imageData) {
	element.textContent = imageData ? "" : [...name.trim()][0]?.toLocaleUpperCase("uk-UA") || "N";
	element.style.backgroundImage = imageData ? `url("${imageData}")` : "";
}

function renderProfile() {
	document.querySelector("#player-name").textContent = playerProfile.name;
	document.querySelector("#profile-button").setAttribute("aria-label", `Профіль гравця ${playerProfile.name}`);
	renderAvatar(document.querySelector("#player-avatar"), playerProfile.name, playerProfile.avatar);
}

function compressAvatar(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(new Error("Не вдалося прочитати файл."));
		reader.onload = () => {
			const image = new Image();
			image.onerror = () => reject(new Error("Не вдалося відкрити зображення."));
			image.onload = () => {
				const size = 192;
				const cropSize = Math.min(image.naturalWidth, image.naturalHeight);
				const canvas = document.createElement("canvas");
				canvas.width = size;
				canvas.height = size;
				canvas.getContext("2d").drawImage(image, (image.naturalWidth - cropSize) / 2, (image.naturalHeight - cropSize) / 2, cropSize, cropSize, 0, 0, size, size);
				resolve(canvas.toDataURL("image/webp", 0.8));
			};
			image.src = reader.result;
		};
		reader.readAsDataURL(file);
	});
}

function saveCart() {
	try {
		localStorage.setItem("skam-cart", JSON.stringify([...cartItems].map(([name, item]) => ({ name, price: item.price, image: item.image, quantity: item.quantity }))));
	} catch {
		cartStatusElement.textContent = "Не вдалося зберегти кошик у цьому браузері.";
	}
}

function loadFavorites() {
	try {
		const savedFavorites = JSON.parse(localStorage.getItem("skam-favorites") || "[]");
		return new Set(Array.isArray(savedFavorites) ? savedFavorites.map(normalizeGameName).filter((name) => products.has(name)) : []);
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
	saveCart();
}

function addGameToCart(name, sourceButton) {
	const product = products.get(name);
	if (!product) return;
	const existing = cartItems.get(name);
	const source = sourceButton?.closest(".game-row, .game-card, .offer-card, .feature-details");
	const priceText = source?.querySelector(".price-stack strong, .compact-price strong")?.textContent;
	const displayedPrice = priceText ? Math.round(Number(priceText.replace(/[^\d.]/g, "")) * 100) : product.price;
	cartItems.set(name, { ...product, price: existing?.price ?? (displayedPrice || product.price), quantity: (existing?.quantity ?? 0) + 1 });
	cartStatusElement.textContent = `${name} додано до кошика.`;
	renderCart();
}

function prepareGameTitleButtons() {
	document.querySelectorAll(".game-row h3, .game-card h3, .offer-art h3").forEach((heading) => {
		if (heading.querySelector("button")) return;
		const source = heading.closest(".game-row, .game-card, .offer-card");
		let name = source?.dataset.title || heading.textContent.trim();
		if (name.toLowerCase() === "ultrakall") name = "Ultrakall";
		if (!products.has(name)) return;
		const button = document.createElement("button");
		button.type = "button";
		button.className = "game-title-button";
		button.dataset.gameView = name;
		button.setAttribute("aria-label", `Переглянути гру ${name}`);
		button.textContent = heading.textContent.trim();
		heading.replaceChildren(button);
		const artwork = source?.querySelector(".card-art img, .game-row > img, .offer-art img");
		if (artwork) {
			artwork.dataset.gameView = name;
			artwork.setAttribute("aria-label", `Переглянути гру ${name}`);
		}
	});
	featureImage.dataset.gameView = featureTitle.dataset.gameView;
}

function showGameDetails(name) {
	const product = products.get(name);
	const details = gameDetails.get(name);
	if (!product || !details) return;
	gameDialogTitle.textContent = name;
	gameDialogImage.src = product.image;
	gameDialogImage.alt = `Обкладинка ${name}`;
	document.querySelector("#game-detail-description").textContent = details.description;
	document.querySelector("#game-detail-review").textContent = details.review;
	document.querySelector("#game-detail-review-count").textContent = details.reviews;
	document.querySelector("#game-detail-developer").textContent = details.developer;
	document.querySelector("#game-detail-release").textContent = details.release;
	document.querySelector("#game-detail-players").textContent = details.players;
	document.querySelector("#game-detail-original").textContent = currency.format(product.original / 100);
	document.querySelector("#game-detail-current").textContent = currency.format(product.price / 100);
	gameDialogTags.replaceChildren(...details.genres.map((genre) => {
		const tag = document.createElement("span");
		tag.textContent = genre;
		return tag;
	}));
	gameDialogCart.dataset.game = name;
	gameDialogFavorite.dataset.game = name;
	const isFavorite = favorites.has(name);
	gameDialogFavorite.setAttribute("aria-pressed", String(isFavorite));
	gameDialogFavorite.innerHTML = `<span aria-hidden="true">${isFavorite ? "♥" : "♡"}</span> ${isFavorite ? "В обраному" : "В обране"}`;
	gameDialog.showModal();
}

function renderFavorites() {
	favoriteGrid.replaceChildren();
	document.querySelectorAll(".recommendation-section .game-card, .all-games-section .game-card").forEach((card) => {
		const name = card.dataset.title;
		const isFavorite = favorites.has(name);
		const button = card.querySelector(".favorite-button");
		button.setAttribute("aria-pressed", String(isFavorite));
		button.setAttribute("aria-label", `${isFavorite ? "Прибрати" : "Додати"} ${name} ${isFavorite ? "з" : "до"} обраного`);
		button.textContent = isFavorite ? "♥" : "♡";
	});

	favorites.forEach((name) => {
		const sourceCard = [...document.querySelectorAll(".recommendation-section .game-card, .all-games-section .game-card")]
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
	featureTitle.dataset.gameView = slide.title;
	featureTitle.setAttribute("aria-label", `Переглянути гру ${slide.title}`);
	featureImage.dataset.gameView = slide.title;
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
	const gameTitleButton = event.target.closest("[data-game-view]");
	if (gameTitleButton) {
		showGameDetails(gameTitleButton.dataset.gameView);
		return;
	}

	const addButton = event.target.closest(".add-to-cart");
	if (!addButton) return;
	addGameToCart(addButton.dataset.game, addButton);
	if (addButton.classList.contains("primary-button")) {
		addButton.innerHTML = "✓ Додано";
		window.setTimeout(() => { addButton.innerHTML = "<span aria-hidden=\"true\">＋</span> До кошика"; }, 1200);
	}
});

gameDialogFavorite.addEventListener("click", () => {
	const name = gameDialogFavorite.dataset.game;
	setFavorite(name, !favorites.has(name));
	const isFavorite = favorites.has(name);
	gameDialogFavorite.setAttribute("aria-pressed", String(isFavorite));
	gameDialogFavorite.innerHTML = `<span aria-hidden="true">${isFavorite ? "♥" : "♡"}</span> ${isFavorite ? "В обраному" : "В обране"}`;
});
document.querySelector("#game-dialog-close").addEventListener("click", () => gameDialog.close());
gameDialog.addEventListener("click", (event) => {
	if (event.target === gameDialog) gameDialog.close();
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

document.querySelector("#profile-button").addEventListener("click", () => {
	nicknameInput.value = playerProfile.name;
	pendingAvatar = playerProfile.avatar;
	renderAvatar(avatarPreview, nicknameInput.value, pendingAvatar);
	profileStatus.textContent = "";
	avatarFile.value = "";
	profileDialog.showModal();
});
document.querySelector("#profile-close").addEventListener("click", () => profileDialog.close());
document.querySelector("#clear-avatar").addEventListener("click", () => {
	pendingAvatar = "";
	renderAvatar(avatarPreview, nicknameInput.value, pendingAvatar);
});
nicknameInput.addEventListener("input", () => renderAvatar(avatarPreview, nicknameInput.value, pendingAvatar));
avatarFile.addEventListener("change", async () => {
	const file = avatarFile.files[0];
	if (!file) return;
	if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
		profileStatus.textContent = "Оберіть зображення розміром до 10 МБ.";
		avatarFile.value = "";
		return;
	}
	try {
		pendingAvatar = await compressAvatar(file);
		renderAvatar(avatarPreview, nicknameInput.value, pendingAvatar);
		profileStatus.textContent = "Аватар підготовлено. Збережіть профіль.";
	} catch {
		profileStatus.textContent = "Не вдалося обробити це зображення.";
	}
});
profileForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const name = nicknameInput.value.trim();
	if (!name) {
		profileStatus.textContent = "Введіть ігровий нік.";
		return;
	}
	const nextProfile = { name, avatar: pendingAvatar };
	try {
		localStorage.setItem("skam-profile", JSON.stringify(nextProfile));
		playerProfile = nextProfile;
		renderProfile();
		profileDialog.close();
	} catch {
		profileStatus.textContent = "Не вдалося зберегти профіль у цьому браузері.";
	}
});

renderCart();
prepareGameTitleButtons();
renderFavorites();
renderProfile();
