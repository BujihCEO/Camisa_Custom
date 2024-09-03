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

var mainEdit = document.createElement('div');
mainEdit.className = 'mainEdit';
popupBottom.appendChild(mainEdit);

var popupBtnWrap = document.createElement('div');
popupBtnWrap.className = 'popupBtnWrap';
popupBottom.appendChild(popupBtnWrap);

var adjustBox = document.createElement('div');
adjustBox.className = 'adjustBox down';
popupEditor.appendChild(adjustBox);

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
        scaleX: scale,
        scaleY: scale
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

var adjBox = false;
function adjShow(v = true) {
    if (v) {
        if (adjBox === true) {
            adjustBox.classList.add('down');
            setTimeout(()=> {
                updateSets();
                adjustBox.classList.remove('down');
                adjBox = true;
            }, 300);
        } else {
            popupBottom.classList.add('down'); 
            setTimeout(()=> {
                updateSets();
                adjustBox.classList.remove('down');
                adjBox = true;
            }, 300);
        }

    } else {
        adjustBox.classList.add('down');
        setTimeout(()=> {
            popupBottom.classList.remove('down');
            adjBox = false;
        }, 300);
    }
}

function createLoading() {
    var loadingContainer = document.createElement('div');
    loadingContainer.className = "LoadingCustom hidden ProductLoad";
    var loadGif = document.createElement('div');
    loadGif.className = "loadGif";
    var loadMessage_1 = document.createElement('div');
    loadMessage_1.className = "loadMessage";
    loadMessage_1.innerText = "Criando sua obra de arte";
    var loadMessage_2 = document.createElement('div');
    loadMessage_2.className = "loadMessage";
    loadMessage_2.innerText = "Enviando para o carrinho";
    var loaderDots = document.createElement('div');
    loaderDots.className = "loaderDots";
    Array.from({length: 3}, () => {
        var dot = document.createElement('div');
        dot.className = "dot";
        loaderDots.appendChild(dot);
    });
    loadingContainer.appendChild(loadGif);
    loadingContainer.appendChild(loadMessage_1);
    loadingContainer.appendChild(loadMessage_2);
    loadingContainer.appendChild(loaderDots);
    document.body.appendChild(loadingContainer);
    window.loadOn = function(type) {
        if (type === 0) {
            loadingContainer.classList.remove('message1', 'message2');
            loadingContainer.classList.add('ProductLoad');
        };
        if (type === 1) {
            loadingContainer.classList.remove('ProductLoad', 'message2');
            loadingContainer.classList.add('message1');
        };
        if (type === 2) {
            loadingContainer.classList.remove('ProductLoad', 'message1');
            loadingContainer.classList.add('message2');
        };
        loadingContainer.classList.remove('hidden');
    };
    window.loadOff = function() {
        loadingContainer.classList.add('hidden');
    }
}
createLoading();

var nodeTarget = [];

var updateSets = ()=>{};

    //  TRANSFORMER //

var anchors = {
    none: [],
    basic: [
        'top-left', 
        'top-right',
        'bottom-left',
        'bottom-right',
    ],
    all: [
        'top-left', 
        'top-center', 
        'top-right', 
        'middle-right', 
        'middle-left', 
        'bottom-left', 
        'bottom-center', 
        'bottom-right'
    ],
}

var transformer = new Konva.Transformer({
    shouldOverdrawWholeArea: true,
    anchorSize: 5,
    anchorStyleFunc: (anchor) => {
        anchor.cornerRadius(10);
        if (anchor.hasName('top-center') || anchor.hasName('bottom-center')) {
          anchor.height(4);
          anchor.offsetY(2);
          anchor.width(10);
          anchor.offsetX(5);
        }
        if (anchor.hasName('middle-left') || anchor.hasName('middle-right')) {
          anchor.height(10);
          anchor.offsetY(5);
          anchor.width(4);
          anchor.offsetX(2);
        }
    },
});
layer.add(transformer);
transformer.hide();

//transformer.removeEventListener('dragmove');
transformer.off('dragstart');
transformer.off('dragmove');

var dontMove = ()=> {
    transformer.centeredScaling(true);
    transformer.draggable(false);
    nodeTarget.forEach(e => {
        e.draggable(false);
    });
};

function dragOn(target) {
    nodeTarget = target;
    nodeTarget[0].onSelect();
    transformer.setAttrs({
        nodes: nodeTarget,
        enabledAnchors: nodeTarget[0].getAttr('anchors') ? nodeTarget[0].getAttr('anchors') : anchors.basic,
    });
    transformer.show();
}

function dragOff() {
    if (nodeTarget.length > 0) {
        onSelect();
        nodeTarget = [];
    }
    transformer.nodes([]);
    transformer.hide();
}

var canSelect = [];

clickTap(stage, (e)=> {
    if (canSelect.includes(e.target)) {
        return;
    }
    dragOff();
    adjShow(false);
});

var needDraw = ['overFill', 'brightness', 'contrast'];

function upload(e, parent, icon, attrs) {
    var file = e.target.files[0];
    var reader = new FileReader();
    parent.destroyChildren();
    icon.innerHTML = '';
    reader.onload = function () {
        var img = new Image();
        img.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;

            var kvImg = new Konva.Image({
                image: canvas,
                icon: icon,
                brightness: 1,
                contrast: 1,
            });

            var filters = ['brightness', 'contrast'];
            var filter = filters.map(e => `${e}(\${kvImg.getAttr('${e}')})`).join(' ');
            canvas.draw = () => {
                canvas.ctx.globalCompositeOperation = 'source-over';
                canvas.ctx.filter = eval("`" + filter + "`");
                canvas.ctx.drawImage(img, 0, 0);
                if (kvImg.getAttr('overFill')) {
                    canvas.ctx.fillStyle = kvImg.getAttr('overFill');
                    canvas.ctx.globalCompositeOperation = 'source-in';
                    canvas.ctx.drawImage(img, 0, 0);
                    canvas.ctx.globalCompositeOperation = 'overlay';
                    canvas.ctx.fillRect(0, 0, kvImg.width(), kvImg.height());
                }
            };
            canvas.draw();
            objectCover(kvImg, img, parent);
            parent.add(kvImg);
            canSelect.push(kvImg);
            kvImg.onSelect = ()=> {onSelect(kvImg)};
            clickTap(kvImg, () => {
                dragOn([kvImg]);
                adjShow();
            });
            icon.appendChild(img);
            icon.node = [kvImg];
            iconsList.selected = undefined;
            nodesBox.selected = undefined;
            e.target.value = '';
            dragOn([kvImg]);
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

function setClip(url, target) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'document';

    xhr.onload = function () {
        if (xhr.status === 200) {
            var svgDoc = xhr.response;
            var pathElement = svgDoc.querySelector('path');
            
            if (pathElement) {
                var pathData = pathElement.getAttribute('d');
                var path2D = new Path2D(pathData);
                var width = target.width();
                var height = target.height();
                target.setAttrs({
                    clipFunc: function (ctx) {
                        ctx.rect(0, 0, width, height);
                        ctx._context.clip(path2D);
                    },
                });
            } else {
                console.error("No path element found in the SVG.");
            }
        } else {
            console.error("Failed to load SVG. Status:", xhr.status);
        }
    };

    xhr.onerror = function () {
        console.error("Error during the request.");
    };

    xhr.send();
}

function NewPotrace(event, parent, icon, attrs) {
    loadOn(0);
    var file = event.target.files[0];
    var reader = new FileReader();
    var img = new Image();
    parent.destroyChildren();
    icon.innerHTML = '';

    reader.onload = function () {
        img.onload = () => {
            Potrace.loadImageFromFile(file);
            Potrace.process(() => {
                var svgText = Potrace.getSVG(1);
                var parser = new DOMParser();
                var svgDoc = parser.parseFromString(svgText, "image/svg+xml");
                var pathElement = svgDoc.querySelector('path');
                var pathData = pathElement.getAttribute('d');
                var path2D = new Path2D(pathData);
                
                var shape = new Konva.Shape({
                    width: img.width,
                    height: img.height,
                    icon: icon,
                    path2D: path2D,
                    potrace: 1,
                    invert: 0,
                });
                shape.setAttrs({
                    sceneFunc: function (ctx) {
                        ctx.beginPath();
                        ctx.clip(shape.getAttr('path2D'));
                        ctx.fillStyle = shape.fill();
                        ctx.fillRect(0, 0, shape.width(), shape.height());
                        ctx.closePath();
                    },
                    hitFunc: (ctx) => {
                        ctx.rect(0, 0, shape.width(), shape.height());
                        ctx.fillStrokeShape(shape);
                    },
                });
                
                objectCover(shape, img, parent);
                parent.add(shape);
                canSelect.push(shape);
                shape.onSelect = ()=> {onSelect(shape)};
                clickTap(shape, () => {
                    dragOn([shape]);
                    adjShow();
                });
                icon.appendChild(img);
                icon.node = [shape];
                iconsList.selected = undefined;
                nodesBox.selected = undefined;
                event.target.value = '';
                dragOn([shape]);
                loadOff();
            });
        };
        img.src = reader.result;
    };

    reader.readAsDataURL(file);
}

function upPotrace() {
    loadOn(0);
    var img = new Image();
    img.onload = ()=> {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = `brightness(${nodeTarget[0].getAttr('potrace')})
            invert(${nodeTarget[0].getAttr('invert')})`;
        ctx.drawImage(img, 0, 0);
        var url = canvas.toDataURL();
        Potrace.loadImageFromUrl(url);
        Potrace.process(() => {
            var svgText = Potrace.getSVG(1);
            var parser = new DOMParser();
            var svgDoc = parser.parseFromString(svgText, "image/svg+xml");
            var pathElement = svgDoc.querySelector('path');
            var pathData = pathElement.getAttribute('d');
            var path2D = new Path2D(pathData);
            nodeTarget[0].setAttr('path2D', path2D);
            loadOff();
        });
    };
    img.src = nodeTarget[0].getAttr('icon').children[0].src;
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

function createInput() {
    var listBtn = [];

    function createJsColor(parent, add) {
        var box = document.createElement('div');
        var input = document.createElement('button');
        box.className = 'JsColorBox';
        input.className = 'jscolor';
        input.setAttribute('data-jscolor', `{value:''}`);
        parent.input.push(input);
        box.appendChild(input);
        parent.appendChild(box);
        
        jscolor.install();
        
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'data-current-color') {
                    var newColor = mutation.target.getAttribute('data-current-color');
                    if (nodeTarget.length > 0) {
                        nodeTarget.forEach(e => {
                            e.setAttr(add.attr, newColor);
                            if (needDraw.includes(add.attr)) {
                                e.image().draw();
                            }
                        });
                    }
                    var nextSibling = input.nextElementSibling;
                    if (nextSibling) {
                        nextSibling.style.background = newColor;
                    }
                }
            });
        });
        
        observer.observe(input, { attributes: true });
        
        input.change = ()=> {
            var value = nodeTarget[0].getAttr(add.attr);
            input.setAttribute('data-jscolor', `{value: ${value}}`);
            input.style.background = value;
        };
    }

    function rangeInput(parent, add) {
        var v = add.values;
        var box = document.createElement('div');
        box.className = 'rangeBox';
        
        var title = document.createElement('div');
        title.textContent = add.name;
        
        var input = document.createElement('input');
        Object.assign(input, {
            type: 'range',
            min: v.min, 
            max: v.max, 
            step: v.percentage ? (v.max - v.min) * 0.005 : 1 
        });
        console.log(input.step);
        
        parent.input.push(input);
        
        var label = document.createElement('div');
        
        function mapToRange(value) {
            var mappedValue = ((value - v.min) / (v.max - v.min)) * 200 - 100;
            label.textContent = `${Math.round(mappedValue)}`;
        }
    
        input.change = () => {
            var value = nodeTarget[0].getAttr(add.attr) / (v.scale ? 5 : 1);
            input.value = value;
            v.percentage ? mapToRange(value) : label.textContent = value;
        };
    
        input.addEventListener(add.onChange ? 'change' : 'input', () => {
            if (nodeTarget.length > 0) {
                nodeTarget.forEach(e => {
                    var value = input.value * (v.scale ? 5 : 1);
                    e.setAttr(add.attr, value);
                    add.func ? eval(add.func) : '';
                    if (needDraw.includes(add.attr)) {
                        e.image().draw();
                    }
                });
            }
        });
    
        input.oninput = () => { 
            v.percentage ? mapToRange(input.value) : label.textContent = input.value;
        };
    
        box.append(title, input, label);
        parent.appendChild(box);
    }
    

    function createChooser(parent, add) {
        var box = document.createElement('div');
        box.className = 'chooserBox flex-list';
        var tittle = document.createElement('div');
        tittle.textContent = add.name;
        
        var list = [];
        var buttonBox = document.createElement('div');
        buttonBox.className = 'slider';

        add.values.forEach(e => {
            var button = document.createElement('div');
            Object.assign(button, {textContent: e.name, value: e.value});
            list.push(button);
            buttonBox.appendChild(button);

            button.onclick = ()=> {
                if (button === list.selected) {return};
                list.forEach(e => {
                    if (e === button) {
                        e.classList.add('selected');
                        list.selected = e;
                        if (nodeTarget.length > 0) {
                            nodeTarget.forEach(e => {
                                e.setAttr(add.attr, button.value);
                                add.func ? eval(add.func) : '';
                                if (needDraw.includes(add.attr)) {
                                    e.image().draw();
                                }
                            });
                        }
                    } else {
                        e.classList.remove('selected');
                    }
                });
            };
        });

        parent.input.push(buttonBox);
        buttonBox.change = ()=> {
            var value = nodeTarget[0].getAttr(add.attr);
            list.forEach(e => {
                if (e.value == value) {
                    e.classList.add('selected');
                    list.selected = e;
                } else {
                    e.classList.remove('selected');
                }
            });
        };
        box.append(tittle, buttonBox);
        parent.appendChild(box);
    }

    updateSets = () => {
        var attrs = Object.keys(nodeTarget[0].attrs);
        var available = [];
        listBtn.forEach(e => {
            if (e.n.some(n => attrs.includes(n))) {
                available.push(e);
                e.classList.remove('hidden');
            } else {
                e.classList.add('hidden');
                e.box.classList.add('hidden');
            }
        });
        available.forEach((e, i) => {
            if (i === 0) {
                e.classList.add('selected');
                e.box.classList.remove('hidden');
            } else {
                e.classList.remove('selected');
                e.box.classList.add('hidden');
            }
            e.box.input.forEach(input => {
                input.change();
            });
        });

    };

    var aBox = document.createElement('div');
    adjustBox.appendChild(aBox);
    aBox.a = document.createElement('div');
    aBox.b = document.createElement('div');
    aBox.b.textContent = 'Ajustes';
    aBox.c = document.createElement('div');
    aBox.c.addEventListener('click', ()=> {
        adjShow(false);
    });
    aBox.append(aBox.a, aBox.b, aBox.c);

    var bBox = document.createElement('div');
    adjustBox.appendChild(bBox);
    var cBox = document.createElement('div');
    adjustBox.appendChild(cBox);

    var create = [
        {
            name: 'Cor',
            add: [
                {
                    name: 'Cor',
                    type: 'color',
                    attr: 'fill',
                }
            ]
        },
        {
            name: 'Cor',
            add: [
                {
                    name: 'Cor',
                    type: 'color',
                    attr: 'overFill',
                }
            ]
        },

        // Img Filters

        {
            name: 'Brilho',
            add: [
                {
                    name: 'Brilho',
                    type: 'range',
                    attr: 'brightness',
                    values: {min: 0, max: 2, percentage: true},
                }
            ],
        },
        {
            name: 'Contraste',
            add: [
                {
                    name: 'Contraste',
                    type: 'range',
                    attr: 'contrast',
                    values: {min: 0, max: 2, percentage: true},
                },
            ]
        },

        // Potrace
      
        {
            name: 'Efeito',
            class: 'svgEfect',
            add: [
                {
                    name: 'Potencia',
                    type: 'range',
                    attr: 'potrace',
                    onChange: true,
                    func: 'upPotrace()',
                    values: {min: 0, max: 2, percentage: true},
                },
                {
                    name: 'Inverter',
                    type: 'chooser',
                    attr: 'invert',
                    func: 'upPotrace()',
                    values: [
                        {name: 'Não', value: 0}, {name: 'Sim', value: 1}
                    ],
                },
            ]
        },

        // Text Settings

        {
            name: 'Tamanho',
            class: 'fontSize',
            add: [
                {
                    name: 'Tamanho da fonte',
                    type: 'range',
                    attr: 'fontSize',
                    values: {min: 1, max: 150, scale: true},
                },
            ]
        },
    ];

    create.forEach((e) => {
        let box = document.createElement('div');
        box.input = [];
        
        e.add.forEach(add => {
            if(add.type === 'color') {
                createJsColor(box, add);
            }
            if(add.type === 'range') {
                rangeInput(box, add);
            }
            if(add.type === 'chooser') {
                createChooser(box, add);
            }
        });

        bBox.appendChild(box);

        let button = document.createElement('div');
        button.className = e.class || e.class;
        button.textContent = e.name;
        button.box = box;
        button.n = e.add.map(e => e.attr);
        listBtn.push(button);

        button.onclick = ()=> {
            listBtn.forEach(e => {
                if (e === button) {
                    e.classList.add('selected');
                    e.box.classList.remove('hidden');
                } else {
                    e.classList.remove('selected');
                    e.box.classList.add('hidden');
                }
            });
        };

        cBox.appendChild(button);
    });
}

createInput();

var iconsList = [];
var nodesBox = [];

function onSelect(target = undefined, icon = false) {
    if (!target) {
        iconsList.selected.parent.classList.remove('selected');
        iconsList.selected.configBox.classList.add('hidden');
        iconsList.selected = undefined;
        nodesBox.selected = undefined;
        console.log(4);
        return;
    }
    if (icon) {
        if (target.onInput === true) {
            if (iconsList.selected) {
                iconsList.selected.parent.classList.remove('selected');
                iconsList.selected.configBox.classList.add('hidden');
            }
            target.parent.classList.add('selected');
            target.configBox.classList.add('hidden');
            iconsList.selected = target;
            nodesBox.selected = target.nodeBox;
            nodeTarget = [];
            transformer.nodes([]);
            transformer.hide();
            target.input.click();
            console.log(1);
        } else {
            var text = target.node[0].getClassName() === 'Text';
            if (iconsList.selected === target && !text) {
                dragOff();
                console.log(2);
            } else {
                dragOn(target.node);
                console.log(3);
            }
        }
    } else {
        var icon = target.getAttr('icon');
        var text = icon.node[0].getClassName() === 'Text';
        if (iconsList.selected === icon && !text) {
            iconsList.selected.parent.classList.remove('selected');
            iconsList.selected.configBox.classList.add('hidden');
            iconsList.selected = undefined;
            nodesBox.selected = undefined;
            console.log(4);
        } else {
            if (iconsList.selected) {
                iconsList.selected.parent.classList.remove('selected');
                iconsList.selected.configBox.classList.add('hidden');
            }
            icon.parent.classList.add('selected');
            icon.configBox.classList.remove('hidden');
            iconsList.selected = icon;
            nodesBox.selected = target.getParent();
            console.log(5);
        }
    }
}