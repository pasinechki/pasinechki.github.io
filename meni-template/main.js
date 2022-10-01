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
