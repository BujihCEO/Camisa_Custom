const printPreview = document.createElement('div');
const printBtn = document.createElement('button');
printBtn.textContent = 'Criar Estampa';
printBtn.style = 
`   position: sticky;
    top: 10px;
    width: 100%;
    margin: 20px 0px;
    background: lightgrey;
    padding: 20px;
    border-radius: 10px;
    font-size: 15px;
`;
printBtn.onclick = ()=> { printPreviews() };
document.body.append(printBtn, printPreview);

function printPreviews() {
    printList.forEach(node => {
        var visible = node.isVisible();
        if (!visible) node.show();
        var target = node.print;
        var scale = target.scale();
        target.setAttrs({scale: {x:4, y:4}});
        target.toImage({
            width: target.width() * target.scaleX(),
            height: target.height() * target.scaleY(),
            x: target.x(),
            y: target.y(),
            callback(img) {
                var box = document.createElement('div');
                box.style = `
                    border: 3px solid lightgray;
                    border-radius: 20px;
                    overflow: hidden;
                    margin: 0 0 20px;`
                ;
                img.style = 'width: 100%';
                var a = document.createElement('a');
                a.href = img.src;
                a.textContent = 'Download';
                a.download = window.location.pathname.split('/').filter(Boolean).pop();
                a.style = `
                    display: flex;
                    width: 100%;
                    align-items: center;
                    justify-content: center;
                    padding: 20px 0;
                    background: lightgray;
                    font-size: 15px;`
                ;
                
                box.append(img, a);
                printPreview.append(box);
            }
        });
        target.setAttr('scale', scale);
        if (!visible) node.hide();
    });
}
