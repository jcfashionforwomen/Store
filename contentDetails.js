console.clear()

let id = location.search.split('?')[1]
console.log(id)

if (document.cookie.indexOf(',counter=') >= 0) {
    let counter = document.cookie.split(',')[1].split('=')[1]
    document.getElementById("badge").innerHTML = counter
}

// ✅ Function to convert size booleans to labels
function getSizes(sizeArray) {
    const sizeLabels = ['S', 'M', 'L', 'XL', 'XXL'];
    return sizeArray
        .map((val, i) => val ? sizeLabels[i] : null)
        .filter(Boolean);
}

function dynamicContentDetails(ob) {
    let mainContainer = document.createElement('div')
    mainContainer.id = 'containerD'
    document.getElementById('containerProduct').appendChild(mainContainer)

    let imageSectionDiv = document.createElement('div')
    imageSectionDiv.id = 'imageSection'

    let imgTag = document.createElement('img')
    imgTag.id = 'imgDetails'
    imgTag.src = ob.preview
    imageSectionDiv.appendChild(imgTag)

    let productDetailsDiv = document.createElement('div')
    productDetailsDiv.id = 'productDetails'

    let h1 = document.createElement('h1')
    h1.appendChild(document.createTextNode(ob.name))

    let h4 = document.createElement('h4')
    h4.appendChild(document.createTextNode(ob.brand))

    // ✅ NEW: Convert and display sizes properly
    let h5 = document.createElement('h5')
    let sizes = Array.isArray(ob.size) ? getSizes(ob.size).join(', ') : ob.size;
    h5.appendChild(document.createTextNode('Available Sizes: ' + sizes))

    let detailsDiv = document.createElement('div')
    detailsDiv.id = 'details'

    let h3DetailsDiv = document.createElement('h3')
    h3DetailsDiv.appendChild(document.createTextNode('Rs ' + ob.price))

    let h3 = document.createElement('h3')
    h3.appendChild(document.createTextNode('Description'))

    let para = document.createElement('p')
    para.appendChild(document.createTextNode(ob.description))

    let productPreviewDiv = document.createElement('div')
    productPreviewDiv.id = 'productPreview'

    let h3ProductPreviewDiv = document.createElement('h3')
    h3ProductPreviewDiv.appendChild(document.createTextNode('Product Preview'))
    productPreviewDiv.appendChild(h3ProductPreviewDiv)

    for (let i = 0; i < ob.photos.length; i++) {
        let imgTagProductPreviewDiv = document.createElement('img')
        imgTagProductPreviewDiv.id = 'previewImg'
        imgTagProductPreviewDiv.src = ob.photos[i]
        imgTagProductPreviewDiv.onclick = function () {
            imgTag.src = this.src
            document.getElementById("imgDetails").src = this.src
        }
        productPreviewDiv.appendChild(imgTagProductPreviewDiv)
    }

    let buttonDiv = document.createElement('div')
    buttonDiv.id = 'button'

    // Add to Cart Button
    let buttonTag = document.createElement('button')
    buttonTag.appendChild(document.createTextNode('Add to Cart'))
    buttonTag.onclick = function () {
        if (!id) {
            console.error('Product ID is undefined')
            successMsg.innerText = "❌ Error adding item to cart!"
            successMsg.style.color = "red"
            setTimeout(() => {
                successMsg.innerText = ""
            }, 3000)
            return
        }

        let order = id
        let counter = 1
        if (document.cookie.indexOf(',counter=') >= 0) {
            order = document.cookie.split(',')[0].split('=')[1] + " " + id
            counter = Number(document.cookie.split(',')[1].split('=')[1]) + 1
        }
        document.cookie = `item=${order},counter=${counter}`
        document.getElementById("badge").innerHTML = counter
        console.log(document.cookie)

        successMsg.innerText = "✅ Item added successfully!"
        successMsg.style.color = "green"

        setTimeout(() => {
            successMsg.innerText = ""
        }, 3000)
    }
    buttonDiv.appendChild(buttonTag)

    // Meesho Button (from API)
    let meeshoButton = document.createElement('button')
    meeshoButton.appendChild(document.createTextNode('Meesho'))
    meeshoButton.onclick = function () {
        window.open(ob.meesho, '_blank')
    }
    buttonDiv.appendChild(meeshoButton)

    // ✅ Message element
    let successMsg = document.createElement('p')
    successMsg.id = 'successMessage'
    successMsg.style.fontWeight = 'bold'
    successMsg.style.marginTop = '10px'
    buttonDiv.appendChild(successMsg)

    // Append all
    mainContainer.appendChild(imageSectionDiv)
    mainContainer.appendChild(productDetailsDiv)
    productDetailsDiv.appendChild(h1)
    productDetailsDiv.appendChild(h4)
    productDetailsDiv.appendChild(h5) // ✅ Added here
    productDetailsDiv.appendChild(detailsDiv)
    detailsDiv.appendChild(h3DetailsDiv)
    detailsDiv.appendChild(h3)
    detailsDiv.appendChild(para)
    productDetailsDiv.appendChild(productPreviewDiv)
    productDetailsDiv.appendChild(buttonDiv)

    return mainContainer
}

// BACKEND CALLING
let httpRequest = new XMLHttpRequest()
{
    httpRequest.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                console.log('connected!!')
                let contentDetails = JSON.parse(this.responseText)
                console.log(contentDetails)
                dynamicContentDetails(contentDetails)
            } else {
                console.log('not connected! Status:', this.status)
            }
        }
    }
}

httpRequest.open('GET', 'https://6856d9ca1789e182b37f3392.mockapi.io/productsapi/products/' + id, true)
httpRequest.send()
