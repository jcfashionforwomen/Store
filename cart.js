console.clear();

if(document.cookie.indexOf(',counter=')>=0)
{
    let counter = document.cookie.split(',')[1].split('=')[1]
    document.getElementById("badge").innerHTML = counter
}

let cartContainer = document.getElementById('cartContainer')

let boxContainerDiv = document.createElement('div')
boxContainerDiv.id = 'boxContainer'

// Add customer info form - hidden initially
let customerForm = document.createElement('div')
customerForm.id = 'customerForm'
customerForm.style.display = 'none'
customerForm.style.border = '1px solid #ccc'
customerForm.style.padding = '20px'
customerForm.style.marginTop = '20px'

// Form HTML content
customerForm.innerHTML = `
  <h3>Enter Your Details</h3>
  <label for="custName">Your Name:</label><br>
  <input type="text" id="custName" required style="width:100%;padding:8px;margin-bottom:10px;"><br>
  <label for="custAddress">Your Address:</label><br>
  <textarea id="custAddress" required style="width:100%;padding:8px;margin-bottom:10px;"></textarea><br>
  <button id="submitOrder">Submit Order</button>
`

cartContainer.appendChild(customerForm)

// DYNAMIC CODE TO SHOW THE SELECTED ITEMS IN YOUR CART
function dynamicCartSection(ob,itemCounter)
{
    let boxDiv = document.createElement('div')
    boxDiv.id = 'box'

    // Store product details in dataset for later
    boxDiv.dataset.name = ob.name
    boxDiv.dataset.brand = ob.brand
    boxDiv.dataset.description = ob.description
    boxDiv.dataset.price = ob.price
    boxDiv.dataset.quantity = itemCounter
    boxDiv.dataset.id = ob.id // Store product ID for removal

    boxContainerDiv.appendChild(boxDiv)

    let boxImg = document.createElement('img')
    boxImg.src = ob.preview
    boxDiv.appendChild(boxImg)

    let boxh3 = document.createElement('h3')
    let h3Text = document.createTextNode(ob.name + ' × ' + itemCounter)
    boxh3.appendChild(h3Text)
    boxDiv.appendChild(boxh3)

    let boxh4 = document.createElement('h4')
    let h4Text = document.createTextNode('Amount: Rs ' + ob.price)
    boxh4.appendChild(h4Text)
    boxDiv.appendChild(boxh4)

    // Add remove button
    let removeButton = document.createElement('button')
    removeButton.textContent = 'Remove'
    removeButton.className = 'remove-btn'
    removeButton.style.marginTop = '10px'
    removeButton.style.padding = '5px 10px'
    removeButton.style.backgroundColor = '#ff4d4d'
    removeButton.style.color = 'white'
    removeButton.style.border = 'none'
    removeButton.style.cursor = 'pointer'
    removeButton.onclick = function() {
        // Remove item from cookie
        let currentItems = document.cookie.split(',')[0].split('=')[1].split(" ")
        let itemId = ob.id
        let index = currentItems.indexOf(itemId)
        if (index !== -1) {
            currentItems.splice(index, 1)
            let newCounter = currentItems.length
            document.cookie = `item=${currentItems.join(" ")},counter=${newCounter}`
            document.getElementById("badge").innerHTML = newCounter
            document.getElementById("totalItem").innerHTML = 'Total Items: ' + newCounter
        }

        // Remove the box from DOM
        boxDiv.remove()

        // Recalculate total amount
        let boxElements = document.querySelectorAll('#box')
        let total = 0
        boxElements.forEach(box => {
            let quantity = parseInt(box.dataset.quantity)
            let price = parseInt(box.dataset.price)
            total += quantity * price
        })
        amountUpdate(total)

        // If no items left, hide customer form and clear total
        if (boxElements.length === 0) {
            customerForm.style.display = 'none'
            totalContainerDiv.style.display = 'none'
        }
    }
    boxDiv.appendChild(removeButton)

    // Make sure buttonLink and totalContainerDiv appended only once
    if(!cartContainer.contains(boxContainerDiv)) {
      cartContainer.appendChild(boxContainerDiv)
    }
    if(!cartContainer.contains(totalContainerDiv)) {
      cartContainer.appendChild(totalContainerDiv)
    }

    return cartContainer
}

let totalContainerDiv = document.createElement('div')
totalContainerDiv.id = 'totalContainer'

let totalDiv = document.createElement('div')
totalDiv.id = 'total'
totalContainerDiv.appendChild(totalDiv)

let totalh2 = document.createElement('h2')
let h2Text = document.createTextNode('Total Amount')
totalh2.appendChild(h2Text)
totalDiv.appendChild(totalh2)

// TO UPDATE THE TOTAL AMOUNT
function amountUpdate(amount)
{
    // Clear previous amount if exists
    let oldAmount = document.getElementById('toth4')
    if(oldAmount) oldAmount.remove()

    let totalh4 = document.createElement('h4')
    totalh4.id = 'toth4'
    let totalh4Text = document.createTextNode('Amount: Rs ' + amount)
    totalh4.appendChild(totalh4Text)
    totalDiv.appendChild(totalh4)

    // Append buttonDiv only once
    if(!totalDiv.contains(buttonDiv)) {
      totalDiv.appendChild(buttonDiv)
    }
}

let buttonDiv = document.createElement('div')
buttonDiv.id = 'button'
totalDiv.appendChild(buttonDiv)

let buttonTag = document.createElement('button')
buttonTag.textContent = 'Place Order'
buttonDiv.appendChild(buttonTag)

buttonTag.onclick = function() {
    // Show customer form on clicking place order
    customerForm.style.display = 'block'
    // Scroll to form
    customerForm.scrollIntoView({behavior: 'smooth'})
}

// Submit order button inside customer form
document.getElementById('submitOrder').onclick = function () {
    let name = document.getElementById('custName').value.trim()
    let address = document.getElementById('custAddress').value.trim()

    if(!name || !address) {
        alert('Please enter both name and address.')
        return
    }

    let message = `Hi, I would like to place an order:\n\nCustomer Name: ${name}\nAddress: ${address}\n\nOrder Details:\n`

    let boxElements = document.querySelectorAll('#box')
    let total = 0
    let count = 1

    boxElements.forEach(box => {
        let productName = box.dataset.name
        let brand = box.dataset.brand
        let description = box.dataset.description
        let quantity = parseInt(box.dataset.quantity)
        let price = parseInt(box.dataset.price)
        let subtotal = quantity * price
        total += subtotal

        message += `${count}. Product Name: ${productName}\n`
        message += `   Brand: ${brand}\n`
        message += `   Description: ${description}\n`
        message += `   Quantity: ${quantity}\n`
        message += `   Price per item: Rs ${price}\n`
        message += `   Subtotal: Rs ${subtotal}\n\n`

        count++
    })

    message += `Total Amount: Rs ${total}`

    let encodedMessage = encodeURIComponent(message)

    // Replace 919876543212 with your WhatsApp number with country code
    let whatsappURL = `https://wa.me/919515982457?text=${encodedMessage}`
    window.location.href = whatsappURL
}

// BACKEND CALL
let httpRequest = new XMLHttpRequest()
let totalAmount = 0
httpRequest.onreadystatechange = function()
{
    if(this.readyState === 4)
    {
        if(this.status == 200)
        {
            contentTitle = JSON.parse(this.responseText)

            let counter = Number(document.cookie.split(',')[1].split('=')[1])
            document.getElementById("totalItem").innerHTML = ('Total Items: ' + counter)

            let item = document.cookie.split(',')[0].split('=')[1].split(" ")

            let i;
            let totalAmount = 0
            for(i=0; i<counter; i++)
            {
                let itemCounter = 1
                for(let j = i+1; j<counter; j++)
                {   
                    if(Number(item[j]) == Number(item[i]))
                    {
                        itemCounter +=1;
                    }
                }
                totalAmount += Number(contentTitle[item[i]-1].price) * itemCounter
                dynamicCartSection(contentTitle[item[i]-1],itemCounter)
                i += (itemCounter-1)
            }
            amountUpdate(totalAmount)
        }
        else
        {
            console.log('call failed!');
        }
    }
}

httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product', true)
httpRequest.send()