var printBtn = document.createElement('button');
printBtn.textContent = 'Criar Estampa';
printBtn.style = 'margin: 3rem 0 0; height: 6rem; width: 100%; font-size: 2rem; border-radius: 4rem;';
var deletePrintBtn = document.createElement('button');
deletePrintBtn.textContent = 'Limpar';
deletePrintBtn.style = 'margin: 0 0 3rem; height: 6rem; width: 100%; font-size: 2rem; border-radius: 4rem;';
var previewDesign = document.createElement('div');
previewDesign.style = 'width: 100%;';
document.body.appendChild(printBtn);
document.body.appendChild(deletePrintBtn);
document.body.appendChild(previewDesign);

deletePrintBtn.onclick = ()=> {previewDesign.innerHTML = ''};

const PrintTarget = document.querySelector('.ProductEdit');
printBtn.addEventListener('click', () => {
    var scale = 4961 / PrintTarget.offsetHeight;
    domtoimage.toPng(PrintTarget, {
        width: PrintTarget.clientWidth * scale,
        height: PrintTarget.clientHeight * scale,
        style: {
            transform: 'scale('+scale+')',
            transformOrigin: 'top left'
        }  
    })
    .then(function (dataUrl) {
        var img = new Image();
        img.className = 'PreviewFile';
        img.style = 'width: 100%; margin: 3rem 0;';
        img.src = dataUrl;
        previewDesign.appendChild(img);
    });
});