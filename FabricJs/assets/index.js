var previewWrap = document.querySelector('.previewWrap');

var canvasPreview = document.createElement('div');
canvasPreview.className = 'canvasPreview';
previewWrap.appendChild(canvasPreview);

var popupEditor = document.createElement('div');
popupEditor.className = 'popupEditor hidden';

var canvaBox = document.createElement('div');
canvaBox.className = 'canvaBox';
popupEditor.appendChild(canvaBox);

var closePopup = document.createElement('div');
closePopup.className = 'close';
closePopup.addEventListener('click', ()=> {
    popupEditor.classList.add('hidden');
    Array.from(productLayer.children).forEach((e, i) => {
        setPreviews(e, canvasPreview, i);
    });
});
popupEditor.appendChild(closePopup);

var popupTop = document.createElement('div');
popupTop.className = 'popupTop';
popupEditor.appendChild(popupTop);

var popupBottom = document.createElement('div');
popupBottom.className = 'popupBottom';
popupEditor.appendChild(popupBottom);

var popupBtnWrap = document.createElement('div');
popupBtnWrap.className = 'popupBtnWrap';
popupBottom.appendChild(popupBtnWrap);

var mainEdit = document.createElement('div');
mainEdit.className = 'mainEdit';
popupBottom.appendChild(mainEdit);

var configPopup = document.createElement('div');
configPopup.className = 'configPopup';
popupEditor.appendChild(configPopup);

var showPopup = document.createElement('div');
showPopup.className = 'showPopup';
showPopup.textContent = 'personalizar';
showPopup.addEventListener('click', ()=> {
    popupEditor.classList.remove('hidden');
});
document.body.appendChild(showPopup);
document.body.appendChild(popupEditor);

var stage = new Konva.Stage({
    container: canvaBox,
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true,
});

var layer = new Konva.Layer();
stage.add(layer);

function createMaskedImage(group, url, fillColor, addStyle) {
    group.destroyChildren();
    layer.draw();
    var img = new Image();
    img.onload = function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = fillColor;
        ctx.drawImage(img, 0, 0);
        ctx.globalCompositeOperation = "source-in";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var maskedImg = new Image();
        maskedImg.onload = function() {
            var konvaMask = new Konva.Image({
                image: maskedImg,
                x: 0,
                y: 0,
                width: group.width(),
                height: group.height(),
                ...addStyle,
            });
            group.add(konvaMask);
            layer.draw();
        };
        maskedImg.src = canvas.toDataURL();
    };
    img.src = url;
}

function setOverlay(group, url) {
    group.destroyChildren();
    layer.draw();
    var img = new Image();
    img.onload = function() {
        var background = new Konva.Image({
            image: img,
            width: group.width(),
            height: group.height(),
            globalCompositeOperation: 'multiply',
            listening: false,
        });
        group.add(background);
        layer.draw();
    };
    img.src = url;
}

function objectCover(node, object, parent) {
    var objectWidth = object.width;
    var objectHeight = object.height;
    var width = parent.width();
    var height = parent.height();
    
    var scaleX = width / objectWidth;
    var scaleY = height / objectHeight;
    var scale = Math.max(scaleX, scaleY);

    var newWidth = objectWidth * scale;
    var newHeight = objectHeight * scale;
    var newX = (width - newWidth) / 2;
    var newY = (height - newHeight) / 2;
    node.setAttrs({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
    });
}

function clickTap(target, callback) {
    target.on('click', callback);
    target.on('tap', callback);
}

function setPreviews(node, parent, index) {
    var visible = node.isVisible();
    stage.setAttrs({x:0, y:0, scale: {x:1, y:1}})
    visible || node.show();
    var canvas = node.toCanvas();
    canvas.style = '';
    parent.children[index] ? parent.replaceChild(canvas, parent.children[index]) : parent.appendChild(canvas);
    visible || node.hide();
}

var productLayer = new Konva.Group({
    width: Math.min(layer.width(), 400),
    height: Math.min(layer.width(), 400),
    x: 0,
    y: 0,
});
layer.add(productLayer);
var scaleLayer = (productLayer.width() * 0.4);

var frontArea = new Konva.Group({
    width: productLayer.width(),
    height: productLayer.height(),
});
var frontBg = new Konva.Group({
    width: productLayer.width(),
    height: productLayer.height(),
    listening: false,
});
createMaskedImage(frontBg, `assets/Camiseta-Front.png`, '#FDF5E6', {
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: { x: 5, y: 5},
    shadowOpacity: 0.3,
}
);

var frontPrint = new Konva.Group({
    width: 3508,
    height: 4961,
    x: (productLayer.width() / 2) - ((3508  * (scaleLayer / 3508)) / 2),
    y: (productLayer.height() / 2) - ((4961  * (scaleLayer / 3508)) / 2),
    scale: { 
        x: scaleLayer / 3508, 
        y: scaleLayer / 3508,
    },
    clip: {
        x: 0,
        y: 0,
        width: 3508,
        height: 4961,
    }
});

var frontOverlay = new Konva.Group({
    width: productLayer.width(),
    height: productLayer.height(),
});
setOverlay(frontOverlay, `assets/Camiseta-Front.png`);
frontArea.add(frontBg);
frontArea.add(frontPrint);
frontArea.add(frontOverlay);
productLayer.add(frontArea);

var backArea = new Konva.Group({
    width: productLayer.width(),
    height: productLayer.height(),
});
var backBg = new Konva.Group({
    width: productLayer.width(),
    height: productLayer.height(),
    listening: false,
});
createMaskedImage(backBg, `assets/Camiseta-Back.png`, '#FDF5E6', {
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: { x: 5, y: 5},
    shadowOpacity: 0.3,
}
);
var backPrint = new Konva.Group({
    width: 3508,
    height: 4961,
    x: (productLayer.width() / 2) - ((3508  * (scaleLayer / 3508)) / 2),
    y: (productLayer.height() * 0.14),
    scale: { 
        x: scaleLayer / 3508, 
        y: scaleLayer / 3508,
    },
    clip: {
        x: 0,
        y: 0,
        width: 3508,
        height: 4961,
    }
});
var backOverlay = new Konva.Group({
    width: productLayer.width(),
    height: productLayer.height(),
});
setOverlay(backOverlay, `assets/Camiseta-Back.png`);
backArea.add(backBg);
backArea.add(backPrint);
backArea.add(backOverlay);
productLayer.add(backArea);

    //  TRANSFORMER //

var transformer = new Konva.Transformer({
    enabledAnchors: [
        'top-left', 
        'top-right',
        'bottom-left',
        'bottom-right',
    ],
    shouldOverdrawWholeArea: true,
});
layer.add(transformer);
transformer.hide();

function dragOn(target) {
    nodeTarget = target;
    transformer.nodes([target]);
    transformer.show();
}

function dragOff() {
    transformer.nodes([]);
    transformer.hide();
}

var canSelect = [];

clickTap(stage, (e)=> {
    if (canSelect.includes(e.target)) {
        return;
    }
    dragOff();
});

function upload(e, parent, iconPlace) {
    var file = e.target.files[0];
    var reader = new FileReader();
    parent.destroyChildren();
    iconPlace.innerHTML = '';
    reader.onload = function () {
        var img = new Image();
        img.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.ctx.drawImage(img, 0, 0);

            var konvaImage = new Konva.Image({
                image: canvas,
                icon: iconPlace,
                brightness: 1,
                contrast: 1,
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffset: { x: 10, y: 10 },
                shadowOpacity: 0.5,
            });

            objectCover(konvaImage, img, parent);
            parent.add(konvaImage);
            canSelect.push(konvaImage);
            dragOn(konvaImage);
            clickTap(konvaImage, () => {
                dragOn(konvaImage);
            });
            iconPlace.appendChild(img);
            e.target.value = '';

            canvas.draw = ()=> {
                canvas.ctx.filter = `
                    brightness(${konvaImage.getAttr('brightness')})
                    contrast(${konvaImage.getAttr('contrast')})
                `;
                canvas.ctx.drawImage(img, 0, 0);
                parent.draw();
            };
        };
        img.src = reader.result;
    };

    reader.readAsDataURL(file);
};


stage.on('wheel', function (e) {
    e.evt.preventDefault();
    var scaleBy = 1.1;
    var oldScale = stage.scaleX();

    var pointer = stage.getPointerPosition();

    var mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };

    var newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    stage.scale({ x: newScale, y: newScale });

    var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();
});
var lastDist = 0;

function createJsColor(parent, target = [], color, setAtt = false) {
var box = document.createElement('div');
var jscolorButton = document.createElement('button');
box.className = 'JsColorBox';
jscolorButton.className = 'jscolor';
jscolorButton.setAttribute('data-jscolor', `{value:'${color}'}`);
box.appendChild(jscolorButton);
parent.appendChild(box);

jscolor.install();

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'data-current-color') {
            var newColor = mutation.target.getAttribute('data-current-color');
            target.forEach(e => {
                e.setAttrs({ fill: newColor });
            });
            var nextSibling = jscolorButton.nextElementSibling;
            if (nextSibling) {
                nextSibling.style.background = newColor;
            }
        }
    });
});

observer.observe(jscolorButton, { attributes: true });

if (setAtt) {
    updateOptionsFunctions.push(() => {
        var tgt = target();
        if (tgt instanceof Element) {
            var color = tgt.getAttribute(setAtt);
            jscolorButton.style.background = color;
            jscolorButton.setAttribute('data-current-color', color);
        }
    });
}
}

function getPath(url, parent, fillColor) {
    return fetch(url)
        .then(response => response.text())
        .then(svgText => {
            var parser = new DOMParser();
            var svgDoc = parser.parseFromString(svgText, "image/svg+xml");
            var pathElement = svgDoc.querySelector('path');
            if (pathElement) {
                var pathData = pathElement.getAttribute('d');
                var svgPath = new Konva.Path({ data: pathData });
                if (fillColor) {svgPath.fill(fillColor);}
                if (parent) {parent.add(svgPath);}
                return svgPath;
            } else {
                throw new Error("No path element found in the SVG.");
            }
        })
        .catch(error => {
            console.error("Error fetching or parsing SVG:", error);
            throw error;
        });
}

function NewPotrace(event, fill, parent, conclusion = () => {}) {
    var file = event.target.files[0];
    var reader = new FileReader();
    var img = new Image();

    reader.onload = function () {
        img.onload = () => {
            Potrace.loadImageFromFile(file);
            Potrace.process(() => {
                var shape = new Konva.Shape();
                objectCover(shape, img, parent);
                
                var scaleX = shape.width() / img.width;
                var scaleY = shape.height() / img.height;
                var scale = Math.min(scaleX, scaleY);
                
                var svgText = Potrace.getSVG(scale);
                var parser = new DOMParser();
                var svgDoc = parser.parseFromString(svgText, "image/svg+xml");
                var pathElement = svgDoc.querySelector('path');
                var pathData = pathElement.getAttribute('d');
                var path2D = new Path2D(pathData);
                
                shape.setAttrs({
                    id: 'svgImage',
                    fill: fill,
                    svgScale: scale,
                    sceneFunc: function (ctx) {
                        ctx.beginPath();
                        ctx.clip(path2D);
                        ctx.fillStyle = shape.fill();
                        ctx.fillRect(0, 0, shape.width(), shape.height());
                        ctx.closePath();
                    },
                    hitFunc: (ctx) => {
                        ctx.rect(0, 0, shape.width(), shape.height());
                        ctx.fillStrokeShape(shape);
                    },
                });

                parent.add(shape);
                canSelect.push(shape);
                dragOn(shape);
                clickTap(shape, ()=> {
                    dragOn(shape);
                });

                conclusion(shape);
            });
        };
        img.src = reader.result;
    };

    reader.readAsDataURL(file);
}

var colorOrder = [
    '000000',
    '0000ff',
    '008000',
    'ffff00',
    'ff00ff',
    'c0c0c0',
    '000080',
    '008080',
    'ffa500',
    '800080',
];

var nodeTarget;

function createInput() {
    var listBtn = [];
    var listBox = [];

    function createJsColor(input, parent, setAtt = false) {
        var box = document.createElement('div');
        input = document.createElement('button');
        box.className = 'JsColorBox';
        input.className = 'jscolor';
        input.setAttribute('data-jscolor', `{value:''}`);
        box.appendChild(input);
        parent.appendChild(box);
        
        jscolor.install();
    
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'data-current-color') {
                    var newColor = mutation.target.getAttribute('data-current-color');
                    input.target? input.target.setAttrs({ fill: newColor }): '';
                    var nextSibling = input.nextElementSibling;
                    if (nextSibling) {
                        nextSibling.style.background = newColor;
                    }
                }
            });
        });
    
        observer.observe(input, { attributes: true });
    
        if (setAtt) {
            updateOptionsFunctions.push(() => {
                var tgt = target();
                if (tgt instanceof Element) {
                    var color = tgt.getAttribute(setAtt);
                    input.style.background = color;
                    input.setAttribute('data-current-color', color);
                }
            });
        }
    }

    function rangeInput(input, parent, attr, v) {
        input = document.createElement('input');
        input.type = 'range';
        Object.assign(input, { min: v.min, max: v.max, step: v.step, value: v.value });
    
        input.addEventListener('input', () => {
            nodeTarget.setAttr(attr, input.value);
            nodeTarget.image().draw();
        });
    
        parent.appendChild(input);
    }

    var aBox = document.createElement('div');
    configPopup.appendChild(aBox);
    aBox.a = document.createElement('div');
    aBox.b = document.createElement('div');
    aBox.b.textContent = 'Ajustes';
    aBox.c = document.createElement('div');
    aBox.c.addEventListener('click', ()=> {
        dragOff();
        configPopup.classList.add('down');
        setTimeout(()=> {
            popupBottom.classList.remove('down'); 
        }, 300);
    });
    aBox.append(aBox.a, aBox.b, aBox.c);

    var bBox = document.createElement('div');
    configPopup.appendChild(bBox);
    var cBox = document.createElement('div');
    configPopup.appendChild(cBox);

    var create = [
        {
            name: 'Cor',
            type: 'color',
            attrs: 'fill',
        },
        {
            name: 'Brilho',
            type: 'range',
            attrs: 'brightness',
            setAtt: {value: 1, min: 0, max: 2, step: 0.1},
        },
        {
            name: 'Contraste',
            type: 'range',
            attrs: 'contrast',
            setAtt: {value: 1, min: 0, max: 2, step: 0.1},
        },
    ];

    create.forEach((e) => {
        var box = document.createElement('div');
        var tittle = document.createElement('div');
        tittle.textContent = e.name;
        box.appendChild(tittle);

        var input;
        if(e.type === 'color') {
            createJsColor(input, box);
        }

        if(e.type === 'range') {
            rangeInput(input, box, e.attrs, e.setAtt);
        }

        bBox.appendChild(box);

        var button = document.createElement('div');
        button.textContent = e.name;
        cBox.appendChild(button);
    });
}

createInput();

