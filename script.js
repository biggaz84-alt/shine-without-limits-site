const ORDER_EMAIL = "shinewithoutlimits@hotmail.com";

const bundleButtons = document.querySelectorAll(".bundle-option");
const pecChoices = document.querySelectorAll(".pec-choice");

const selectedCount = document.getElementById("selected-count");
const bundleLimitText = document.getElementById("bundle-limit");
const summaryBundleName = document.getElementById("summary-bundle-name");
const summaryBundleLimit = document.getElementById("summary-bundle-limit");
const summaryBundlePrice = document.getElementById("summary-bundle-price");
const selectedCardList = document.getElementById("selected-card-list");
const emptyMessage = document.getElementById("empty-message");
const orderButton = document.getElementById("order-button");

let currentBundle = {
  name: "Starter Bundle",
  limit: 10,
  price: 8
};

let selectedCards = [];

function updateSummary() {
  selectedCount.textContent = selectedCards.length;
  bundleLimitText.textContent = currentBundle.limit;

  summaryBundleName.textContent = currentBundle.name;
  summaryBundleLimit.textContent = `Up to ${currentBundle.limit} cards`;
  summaryBundlePrice.textContent = `£${currentBundle.price}`;

  selectedCardList.innerHTML = "";

  if (selectedCards.length === 0) {
    emptyMessage.style.display = "block";
    orderButton.classList.add("disabled");
    orderButton.href = "#custom-pec-cards";
    return;
  }

  emptyMessage.style.display = "none";
  orderButton.classList.remove("disabled");

  selectedCards.forEach((cardName) => {
    const listItem = document.createElement("li");

    listItem.innerHTML = `
      <span>${cardName}</span>
      <button type="button" data-remove="${cardName}">Remove</button>
    `;

    selectedCardList.appendChild(listItem);
  });

  const emailBody = encodeURIComponent(
    `Hi, I would like to order the ${currentBundle.name}.\n\n` +
    `Cards selected:\n${selectedCards.map((card) => `- ${card}`).join("\n")}\n\n` +
    `Total: £${currentBundle.price}\n\n` +
    `Name:\n` +
    `Delivery address:\n` +
    `Any notes:`
  );

  orderButton.href = `mailto:${ORDER_EMAIL}?subject=Custom PEC Card Order&body=${emailBody}`;
}

bundleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    bundleButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    currentBundle = {
      name: button.dataset.bundleName,
      limit: Number(button.dataset.limit),
      price: Number(button.dataset.price)
    };

    if (selectedCards.length > currentBundle.limit) {
      selectedCards = selectedCards.slice(0, currentBundle.limit);

      pecChoices.forEach((choice) => {
        const cardName = choice.dataset.name;

        if (!selectedCards.includes(cardName)) {
          choice.classList.remove("selected");
          choice.querySelector("b").textContent = "Select";
        }
      });
    }

    updateSummary();
  });
});

pecChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    const cardName = choice.dataset.name;

    if (selectedCards.includes(cardName)) {
      selectedCards = selectedCards.filter((card) => card !== cardName);
      choice.classList.remove("selected");
      choice.querySelector("b").textContent = "Select";
      updateSummary();
      return;
    }

    if (selectedCards.length >= currentBundle.limit) {
      alert(`You can choose up to ${currentBundle.limit} cards in this bundle.`);
      return;
    }

    selectedCards.push(cardName);
    choice.classList.add("selected");
    choice.querySelector("b").textContent = "✓ Selected";

    updateSummary();
  });
});

selectedCardList.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove]");

  if (!removeButton) return;

  const cardName = removeButton.dataset.remove;

  selectedCards = selectedCards.filter((card) => card !== cardName);

  pecChoices.forEach((choice) => {
    if (choice.dataset.name === cardName) {
      choice.classList.remove("selected");
      choice.querySelector("b").textContent = "Select";
    }
  });

  updateSummary();
});

updateSummary();