const fontList1 = [
    `assents/ArchivoBlack-Regular.ttf`,
    `assents/Architype_Aubette_W90.ttf`,
];

var iconsBox = document.querySelector('.iconsBox');
function creatIcons() {
    iconsBox.innerHTML = '';
        var box = iconsBox.getBoundingClientRect();
        var value = Math.floor(box.width / box.height);
        for (let i = 0; i < value; i++) {
            var div = document.createElement('div');
            div.classList.add('iconName');
            iconsBox.appendChild(div);
        }
}

function resizeBefore() {
    creatIcons();
}