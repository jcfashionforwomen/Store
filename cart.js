console.clear();

if (document.cookie.indexOf(',counter=') >= 0) {
  let counter = document.cookie.split(',')[1].split('=')[1];
  document.getElementById("badge").innerHTML = counter;
}

let cartContainer = document.getElementById('cartContainer');

let boxContainerDiv = document.createElement('div');
boxContainerDiv.id = 'boxContainer';

// Add customer form - hidden initially
let customerForm = document.createElement('div');
customerForm.id = 'customerForm';
customerForm.style.display = 'none';

customerForm.innerHTML = `
  <h3 style="margin-bottom: 10px;">Enter Your Details</h3>

  <label for="custName">Full Name:</label>
  <input type="text" id="custName" required><br>

  <label for="custPhone">Phone Number:</label>
  <input type="text" id="custPhone" required pattern="\\d{10}" title="Enter a valid 10-digit phone number"><br>

  <label for="custEmail">Email (Optional):</label>
  <input type="email" id="custEmail"><br>

  <label for="custAddress">Address:</label>
  <textarea id="custAddress" required rows="3"></textarea><br>

  <label for="custCity">City:</label>
  <input type="text" id="custCity" required><br>

  <label for="custState">State:</label>
  <input type="text" id="custState" required><br>

  <label for="custPincode">Pincode:</label>
  <input type="text" id="custPincode" required pattern="\\d{6}" title="Enter a valid 6-digit pincode"><br>

  <button id="submitOrder">Submit Order</button>
`;

cartContainer.appendChild(customerForm);

function dynamicCartSection(ob, itemCounter) {
  let boxDiv = document.createElement('div');
  boxDiv.id = 'box';

  boxDiv.dataset.name = ob.name;
  boxDiv.dataset.brand = ob.brand;
  boxDiv.dataset.description = ob.description;
  boxDiv.dataset.price = ob.price;
  boxDiv.dataset.quantity = itemCounter;
  boxDiv.dataset.id = ob.id;
  boxDiv.dataset.size = ob.size; // Size added

  boxContainerDiv.appendChild(boxDiv);

  let boxImg = document.createElement('img');
  boxImg.src = ob.preview;
  boxDiv.appendChild(boxImg);

  let boxh3 = document.createElement('h3');
  boxh3.textContent = `${ob.name} × ${itemCounter}`;
  boxDiv.appendChild(boxh3);

  let boxh4 = document.createElement('h4');
  boxh4.textContent = `Amount: Rs ${ob.price}`;
  boxDiv.appendChild(boxh4);

  let removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.className = 'remove-btn';
  removeButton.onclick = function () {
    let currentItems = document.cookie.split(',')[0].split('=')[1].split(" ");
    let itemId = ob.id;
    let index = currentItems.indexOf(itemId);
    if (index !== -1) {
      currentItems.splice(index, 1);
      let newCounter = currentItems.length;
      document.cookie = `item=${currentItems.join(" ")},counter=${newCounter}`;
      document.getElementById("badge").innerHTML = newCounter;
      document.getElementById("totalItem").innerHTML = 'Total Items: ' + newCounter;
    }

    boxDiv.remove();

    let boxElements = document.querySelectorAll('#box');
    let total = 0;
    boxElements.forEach(box => {
      let quantity = parseInt(box.dataset.quantity);
      let price = parseInt(box.dataset.price);
      total += quantity * price;
    });
    amountUpdate(total);

    if (boxElements.length === 0) {
      customerForm.style.display = 'none';
      totalContainerDiv.style.display = 'none';
    }
  };
  boxDiv.appendChild(removeButton);

  if (!cartContainer.contains(boxContainerDiv)) {
    cartContainer.appendChild(boxContainerDiv);
  }
  if (!cartContainer.contains(totalContainerDiv)) {
    cartContainer.appendChild(totalContainerDiv);
  }
}

let totalContainerDiv = document.createElement('div');
totalContainerDiv.id = 'totalContainer';

let totalDiv = document.createElement('div');
totalDiv.id = 'total';
totalContainerDiv.appendChild(totalDiv);

let totalh2 = document.createElement('h2');
totalh2.textContent = 'Total Amount';
totalDiv.appendChild(totalh2);

function amountUpdate(amount) {
  let oldAmount = document.getElementById('toth4');
  if (oldAmount) oldAmount.remove();

  let totalh4 = document.createElement('h4');
  totalh4.id = 'toth4';
  totalh4.textContent = `Amount: Rs ${amount}`;
  totalDiv.appendChild(totalh4);

  if (!totalDiv.contains(buttonDiv)) {
    totalDiv.appendChild(buttonDiv);
  }
}

let buttonDiv = document.createElement('div');
buttonDiv.id = 'button';
totalDiv.appendChild(buttonDiv);

let buttonTag = document.createElement('button');
buttonTag.textContent = 'Place Order';
buttonDiv.appendChild(buttonTag);

buttonTag.onclick = function () {
  customerForm.style.display = 'block';
  customerForm.scrollIntoView({ behavior: 'smooth' });
};

// Submit handler
document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'submitOrder') {
    e.preventDefault();

    let name = document.getElementById('custName').value.trim();
    let phone = document.getElementById('custPhone').value.trim();
    let email = document.getElementById('custEmail').value.trim();
    let address = document.getElementById('custAddress').value.trim();
    let city = document.getElementById('custCity').value.trim();
    let state = document.getElementById('custState').value.trim();
    let pincode = document.getElementById('custPincode').value.trim();

    if (!name || !phone || !address || !city || !state || !pincode) {
      alert('Please fill all required fields.');
      return;
    }

    let boxElements = document.querySelectorAll('#box');
    let total = 0;
    let orderDetails = '';
    let count = 1;

    boxElements.forEach(box => {
      let productName = box.dataset.name;
      let brand = box.dataset.brand;
      let description = box.dataset.description;
      let size = box.dataset.size || 'N/A';
      let quantity = parseInt(box.dataset.quantity);
      let price = parseInt(box.dataset.price);
      let subtotal = quantity * price;
      total += subtotal;

      orderDetails += `${count}. Product Name: ${productName}\n`;
      orderDetails += `   Brand: ${brand}\n`;
      orderDetails += `   Description: ${description}\n`;
      orderDetails += `   Size: ${size}\n`;
      orderDetails += `   Quantity: ${quantity}\n`;
      orderDetails += `   Price per item: Rs ${price}\n`;
      orderDetails += `   Subtotal: Rs ${subtotal}\n\n`;

      count++;
    });

    orderDetails += `Total Amount: Rs ${total}`;

    let formData = {
      name: name,
      phone: phone,
      email: email,
      address: `${address}, ${city}, ${state} - ${pincode}`,
      order: orderDetails
    };

    fetch('https://formspree.io/f/mldnkrrj', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(response => {
      if (response.ok) {
        document.cookie = "item=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "counter=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = 'orderPlaced.html';
      } else {
        alert('Error submitting order.');
      }
    }).catch(error => alert('Error: ' + error));
  }
});

// Backend call
let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    let contentTitle = JSON.parse(this.responseText);
    let counter = Number(document.cookie.split(',')[1].split('=')[1]);
    document.getElementById("totalItem").innerHTML = ('Total Items: ' + counter);
    let item = document.cookie.split(',')[0].split('=')[1].split(" ");
    let i;
    let totalAmount = 0;
    for (i = 0; i < counter; i++) {
      let itemCounter = 1;
      for (let j = i + 1; j < counter; j++) {
        if (Number(item[j]) == Number(item[i])) {
          itemCounter += 1;
        }
      }
      totalAmount += Number(contentTitle[item[i] - 1].price) * itemCounter;
      dynamicCartSection(contentTitle[item[i] - 1], itemCounter);
      i += (itemCounter - 1);
    }
    amountUpdate(totalAmount);
  }
};
httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product', true);
httpRequest.send();
