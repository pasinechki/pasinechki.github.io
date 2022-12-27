import './xlsx.full.min.js';

let sessionCount = sessionStorage.getItem('count');
let path = 'products-excel'
var url = "meni-produkti.xlsx";

saveExcelToSessionStorage(url, path);

if (sessionCount === null) {
    sessionStorage.setItem('count', 42);
    location.reload();
} 

let workbook = JSON.parse(sessionStorage.getItem(path));
initiateHtml(workbook);


let langIcon = document.getElementById('lang-icon');
langIcon.addEventListener('click', event => {
    langIcon.animate([{ maxWidth: '8%' }, { maxWidth: '7.8%' }], 100);
    langIcon.animate([{ boxShadow: '0 4px 7px 0 rgba(0, 0, 0, 0.785)' }, { boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.785)' }], 100);
    setSrcToLangIcon();
    removeHtml();
    initiateHtml(workbook);
})

function setSrcToLangIcon() {
    let langIcon = document.getElementById('lang-icon');
    const src = langIcon.getAttribute('src');
    let toSet;
    if (src === 'mk-flag.webp') {
        toSet = 'uk-flag.webp'
    } else {
        toSet = 'mk-flag.webp';
    }
    langIcon.setAttribute('src', toSet);
}

function saveExcelToSessionStorage(url, path) {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";
    oReq.onload = function (e) {

        var arraybuffer = oReq.response;

        var data = new Uint8Array(arraybuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");

        let workbook = XLSX.read(bstr, { type: "binary" });
        sessionStorage.setItem(path, JSON.stringify(workbook));
    }
    oReq.send();
}

function initiateHtml(workbook) {
    let langIcon = document.getElementById('lang-icon');
    const src = langIcon.getAttribute('src');
    let lang;
    if (src === 'uk-flag.webp') {
        lang = 'mk';
    } else {
        lang = 'uk';
    }
    var menu = document.createElement('div');
    menu.setAttribute('id', 'menu');
    menu.setAttribute('class', 'menu');
    document.body.appendChild(menu);
    for (var i = 0; i < workbook.SheetNames.length; i++) {
        var sheetName = workbook.SheetNames[i];
        var worksheet = workbook.Sheets[sheetName];
        var worksheetJson = XLSX.utils.sheet_to_json(worksheet, { raw: true });

        var section = document.createElement('div');
        section.setAttribute('class', 'section');
        menu.appendChild(section);

        var sectionHeader = document.createElement('div');
        sectionHeader.setAttribute('class', 'section-header')
        section.appendChild(sectionHeader);

        var sectionName = document.createElement('div');
        sectionName.setAttribute('class', 'section-name');
        var sheetNameArr = sheetName.split(', ');
        var name;
        if (lang === 'mk') {
            name = sheetNameArr[0];
        } else {
            name = sheetNameArr[1];
        }
        sectionName.innerText = name;
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
            if (lang == 'uk') {
                productName.innerText = product.translation;
            } else {
                productName.innerText = product.product;
            }
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

function removeHtml() {
    let menu = document.getElementById('menu');
    menu.parentNode.removeChild(menu);
}
