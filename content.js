let contentTitle = [];
let currentIndex = 0;
const itemsPerPage = 10;
let selectedCategory = "all";

console.log(document.cookie);

function dynamicClothingSection(ob) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";

  let boxLink = document.createElement("a");
  boxLink.href = "/contentDetails.html?" + ob.id;

  let imgTag = document.createElement("img");
  imgTag.src = ob.preview;

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  let h3 = document.createElement("h3");
  h3.appendChild(document.createTextNode(ob.name));

  let h4 = document.createElement("h4");
  h4.appendChild(document.createTextNode(ob.brand));

  let h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode("rs " + ob.price));

  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);

  return boxDiv;
}

let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");

function clearContainers() {
  containerClothing.innerHTML = "";
  containerAccessories.innerHTML = "";
}

function renderNextBatch() {
  // Filter content based on selected category
  const filtered = selectedCategory === "all"
    ? contentTitle
    : contentTitle.filter(item =>
        item.category.toLowerCase().includes(selectedCategory.toLowerCase()) // Use category field for filtering
      );

  const end = currentIndex + itemsPerPage;
  const slice = filtered.slice(currentIndex, end);

  slice.forEach(item => {
    const element = dynamicClothingSection(item);
    if (item.isAccessory) {
      containerAccessories.appendChild(element);
    } else {
      containerClothing.appendChild(element);
    }
  });

  currentIndex = end;

  // Hide or show the "Load More" button
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (currentIndex >= filtered.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }
}

function populateCategories() {
  const dropdown = document.getElementById("categoryDropdown");
  
  // Get unique categories from the products
  const categories = [...new Set(contentTitle.map(item => item.category.toLowerCase()))];

  // Add 'all' category to show all products
  categories.unshift("all");

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1); // Capitalize first letter
    dropdown.appendChild(option);
  });
}

// Event Listener: Category change
document.getElementById("categoryDropdown").addEventListener("change", function () {
  selectedCategory = this.value;
  currentIndex = 0;
  clearContainers();
  renderNextBatch();
});

// Event Listener: Load more
document.getElementById("loadMoreBtn").addEventListener("click", renderNextBatch);

// Backend data call
let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
  if (this.readyState === 4) {
    if (this.status === 200) {
      contentTitle = JSON.parse(this.responseText);

      if (document.cookie.indexOf(",counter=") >= 0) {
        var counter = document.cookie.split(",")[1].split("=")[1];
        document.getElementById("badge").innerHTML = counter;
      }

      populateCategories(); // Populate category dropdown
      renderNextBatch(); // Render first batch of products
    } else {
      console.log("call failed!");
    }
  }
};

httpRequest.open(
  "GET",
  "https://6856d9ca1789e182b37f3392.mockapi.io/productsapi/products",
  true
);
httpRequest.send();
