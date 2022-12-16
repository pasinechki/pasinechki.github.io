import './xlsx.full.min.js';

var url = "meni-produkti.xlsx";
var oReq = new XMLHttpRequest();
oReq.open("GET", url, true);
oReq.responseType = "arraybuffer";

oReq.onload = function (e) {

    var arraybuffer = oReq.response;

    /* convert data to binary string */
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");

    /* Call XLSX */
    var workbook = XLSX.read(bstr, { type: "binary" });

    /* DO SOMETHING WITH workbook HERE */
    for (var i = 0; i < workbook.SheetNames.length; i++) {
        var sheetName = workbook.SheetNames[i];
        var worksheet = workbook.Sheets[sheetName];
        var worksheetJson = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        var menu = document.getElementById('menu');

        var section = document.createElement('div');
        section.setAttribute('class', 'section');
        menu.appendChild(section);

        var sectionHeader = document.createElement('div');
        sectionHeader.setAttribute('class', 'section-header')
        section.appendChild(sectionHeader);

        var sectionName = document.createElement('div');
        sectionName.setAttribute('class', 'section-name');
        sectionName.innerText = sheetName;
        sectionHeader.appendChild(sectionName);

        var sectionBody = document.createElement('div');
        sectionBody.setAttribute('class', 'section-body');
        section.appendChild(sectionBody);

        var line = document.createElement('div');
        line.setAttribute('class', 'line');
        sectionBody.appendChild(line);

        for (const product of worksheetJson) {
            var productDiv = document.createElement('div');
            productDiv.setAttribute('class', 'product');
            sectionBody.appendChild(productDiv);

            var productName = document.createElement('p');
            productName.setAttribute('class', 'product-name');
            productName.innerText = product.product;
            productDiv.appendChild(productName);

            var priceClassName = 'price';
            if (product.hasOwnProperty('liter')) {
                var quantity = document.createElement('p');
                quantity.setAttribute('class', 'quantity');
                quantity.innerText = ('' + product.liter).replace('.', ',');
                productDiv.appendChild(quantity);
                var priceClassName = 'price-with-quantity';
            }

            var price = document.createElement('p');
            price.setAttribute('class', priceClassName);
            price.innerText = product.price;
            productDiv.appendChild(price);

            var priceDecimal = document.createElement('p');
            priceDecimal.setAttribute('class', 'price-decimal');
            priceDecimal.innerText = ',00';
            productDiv.appendChild(priceDecimal);
        }
    }

    const sectionHeaders = document.querySelectorAll(".section-header");
    sectionHeaders.forEach(sectionHeader => {
        sectionHeader.addEventListener("click", event => {
            sectionHeader.classList.toggle("mid");
            sectionHeader.classList.toggle("active");
            const sectionHeaderBody = sectionHeader.nextElementSibling;
            if (sectionHeader.classList.contains("active")) {
                sectionHeaderBody.style.maxHeight = sectionHeaderBody.scrollHeight + "px";
            } else {
                sectionHeaderBody.style.maxHeight = 0;
            }
        });
    });
}

oReq.send();