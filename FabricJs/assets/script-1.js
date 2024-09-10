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
        //setPreviews(e, canvasPreview, i);
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
adjustBox.className = 'adjustBox toDown';
popupEditor.appendChild(adjustBox);

var showPopup = document.createElement('div');
showPopup.className = 'showPopup';
showPopup.textContent = 'personalizar';
showPopup.addEventListener('click', ()=> {
    popupEditor.classList.remove('hidden');
});
document.body.appendChild(showPopup);
document.body.appendChild(popupEditor);

Konva.hitOnDragEnabled = true;

var stage = new Konva.Stage({
    container: canvaBox,
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true,
});

function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCenter(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
    };
}

var lastCenter = null;
var lastDist = 0;
var dragStopped = false;

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

stage.on('touchmove', function (e) {
    e.evt.preventDefault();
    var touch1 = e.evt.touches[0];
    var touch2 = e.evt.touches[1];

    // we need to restore dragging, if it was cancelled by multi-touch
    if (touch1 && !touch2 && !stage.isDragging() && dragStopped) {
        stage.startDrag();
        dragStopped = false;
    }

    if (touch1 && touch2) {
        // if the stage was under Konva's drag&drop
        // we need to stop it, and implement our own pan logic with two pointers
        if (stage.isDragging()) {
            dragStopped = true;
            stage.stopDrag();
        }

        var p1 = {
            x: touch1.clientX,
            y: touch1.clientY,
        };
        var p2 = {
            x: touch2.clientX,
            y: touch2.clientY,
        };

        if (!lastCenter) {
            lastCenter = getCenter(p1, p2);
            return;
        }
        var newCenter = getCenter(p1, p2);

        var dist = getDistance(p1, p2);

        if (!lastDist) {
            lastDist = dist;
        }

        // local coordinates of center point
        var pointTo = {
            x: (newCenter.x - stage.x()) / stage.scaleX(),
            y: (newCenter.y - stage.y()) / stage.scaleX(),
        };

        var scale = stage.scaleX() * (dist / lastDist);

        stage.scaleX(scale);
        stage.scaleY(scale);

        // calculate new position of the stage
        var dx = newCenter.x - lastCenter.x;
        var dy = newCenter.y - lastCenter.y;

        var newPos = {
            x: newCenter.x - pointTo.x * scale + dx,
            y: newCenter.y - pointTo.y * scale + dy,
        };

        stage.position(newPos);

        lastDist = dist;
        lastCenter = newCenter;
    }
});

stage.on('touchend', function (e) {
    lastDist = 0;
    lastCenter = null;
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

var previewList = [];

function setPreviews(node, parent, index) {
    var visible = node.isVisible();
    stage.setAttrs({x:0, y:0, scale: {x:1, y:1}});
    visible || node.show();
    var canvas = node.toCanvas();
    canvas.style = '';
    parent.children[index] ? parent.replaceChild(canvas, parent.children[index]) : parent.appendChild(canvas);
    visible || node.hide();
}

var productLayer = new Konva.Group({
    //width: Math.min(layer.width(), 400),
    //height: Math.min(layer.width(), 400),
    width: layer.width(),
    height: layer.width(),
    x: 0,
    y: 0,
});
layer.add(productLayer);

var scaleLayer = (productLayer.width() * 0.4) / 3508;

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
});

var frontPrint = new Konva.Group({
    width: 3508,
    height: 4961,
    x: (productLayer.width() / 2) - ((3508  * scaleLayer) / 2),
    y: (productLayer.height() / 2) - ((4961  * scaleLayer) / 2),
    scale: { 
        x: scaleLayer,
        y: scaleLayer,
    },
    clip: {
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
    x: (productLayer.width() / 2) - ((3508  * scaleLayer) / 2),
    y: (productLayer.height() * 0.14),
    scale: { 
        x: scaleLayer, 
        y: scaleLayer,
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
            adjustBox.classList.add('toDown');
            setTimeout(()=> {
                updateSets();
                adjustBox.classList.remove('toDown');
                adjBox = true;
            }, 300);
        } else {
            popupBottom.classList.add('toDown'); 
            setTimeout(()=> {
                updateSets();
                adjustBox.classList.remove('toDown');
                adjBox = true;
            }, 300);
        }

    } else {
        adjustBox.classList.add('toDown');
        setTimeout(()=> {
            popupBottom.classList.remove('toDown');
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

var limiter = new Konva.Rect({
    stroke: 'red',
    strokeWidth: 20,
});
layer.add(limiter);
limiter.hide();

var transformer = new Konva.Transformer({
    shouldOverdrawWholeArea: true,
    anchorSize: 5,
    anchorStyleFunc: (anchor) => {
        anchor.cornerRadius(10);
        if (anchor.hasName('top-center') || anchor.hasName('bottom-center')) {
          anchor.height(8);
          anchor.offsetY(4);
          anchor.width(20);
          anchor.offsetX(10);
        }
        if (anchor.hasName('middle-left') || anchor.hasName('middle-right')) {
          anchor.height(20);
          anchor.offsetY(10);
          anchor.width(8);
          anchor.offsetX(4);
        }
    },
});
layer.add(transformer);
transformer.hide();

transformer.on('transformstart', () => {
    limiter.show();
});

transformer.on('transformend', () => {
    limiter.hide();
});

transformer.on('dragstart', (e) => {
    limiter.show();
});

transformer.on('dragend', (e) => {
    limiter.hide();
});

var dontMove = () => {
    transformer.centeredScaling(true);
    transformer.setAttrs({
        enabledAnchors: anchors.all
    });
    let initialPositions = transformer.nodes().map((node) => node.position());
    transformer.on('transformend', () => {
        initialPositions = transformer.nodes().map((node) => node.position());
    });
    transformer.on('dragstart', (e) => {
        transformer.nodes().forEach((shape, index) => {
            shape.position(initialPositions[index]);
        });
        transformer.getLayer().batchDraw();
    });
    transformer.on('dragmove', () => {
        //stopDrag();
        transformer.nodes().forEach((shape, index) => {
            shape.position(initialPositions[index]);
        });
        transformer.getLayer().batchDraw();
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

function newUpload(e, parent, icon, attrs) {
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

            var noEdit = {...attrs.noEdit};
            var edit = {...attrs.edit};
            Object.assign(edit, { brightness: 1, contrast: 1 });

            var kvImg = new Konva.Image({
                image: canvas,
                icon: icon,
                ...noEdit,
                ...edit,
                edit: Object.keys(edit),
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

var jsColorList = [];

function getColor(id, attrs = []) {

}

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

function getPath(url, parent, attrs) {
    return fetch(url)
        .then(response => response.text())
        .then(svgText => {
            var parser = new DOMParser();
            var svgDoc = parser.parseFromString(svgText, "image/svg+xml");
            var pathElement = svgDoc.querySelector('path');
            if (pathElement) {
                var pathData = pathElement.getAttribute('d');
                var svgPath = new Konva.Path({ 
                    data: pathData,
                    ...attrs
                });
                parent.add(svgPath);
            } else {
                throw new Error("No path element found in the SVG.");
            }
        })
        .catch(error => {
            console.error("Error fetching or parsing SVG:", error);
            throw error;
        });
}

function translatePathData(pathData, dx, dy, scaleX, scaleY) {
    return pathData.replace(/([MLHVCSQTA])([^MLHVCSQTA]+)/gi, function(match, command, params) {
        var paramArray = params.trim().split(/[\s,]+/).map(parseFloat);

        if (command === 'H') {
            // Ajusta o valor X para comandos horizontais (H), com o deslocamento e escala
            paramArray = paramArray.map(x => dx + (x * scaleX)); // Primeiro adiciona o dx, depois aplica a escala
        } else if (command === 'V') {
            // Ajusta o valor Y para comandos verticais (V), com o deslocamento e escala
            paramArray = paramArray.map(y => dy + (y * scaleY)); // Primeiro adiciona o dy, depois aplica a escala
        } else {
            // Para os comandos que afetam tanto X quanto Y, ajuste ambos
            for (let i = 0; i < paramArray.length; i += 2) {
                paramArray[i] = dx + (paramArray[i] * scaleX);    // Ajuste X com dx e escala
                paramArray[i + 1] = dy + (paramArray[i + 1] * scaleY); // Ajuste Y com dy e escala
            }
        }

        return command + ' ' + paramArray.join(' ');
    });
}

var nodePath = {n: undefined, y: 0, x: 0, sY: 0, sX: 0};

function movePath(p, t) {
    var path = p.getAttr('path2D');
    var size = p.size();
    var scale = t.scale();
    var pos = t.position();

    var x = pos.x;
    var y = pos.y;
    var scaleX = scale.x;
    var scaleY = scale.y;
    var height = size.height;
    var width = size.width;

    var pathDraw = new Path2D(translatePathData(path, x, y, scaleX, scaleY));

    // Ajustes para criar retângulos com base na posição e escala
    if (y > 0) {
        // Preencher a área acima
        pathDraw.rect(0, 0, width, Math.abs(y));
    }
    if (x > 0) {
        // Preencher a área à esquerda
        pathDraw.rect(0, 0, Math.abs(x), height);
    }
    
    // Preencher a área abaixo (se houver espaço devido à escala Y)
    if (y + height * scaleY < height) {
        pathDraw.rect(0, height * scaleY + y, width, height - height * scaleY - y);
    }
    
    // Preencher a área à direita (se houver espaço devido à escala X)
    if (x + width * scaleX < width) {
        pathDraw.rect(width * scaleX + x, 0, width - width * scaleX - x, height);
    }

    p.setAttr('pathDraw', pathDraw);
    p.draw();
}

function textClip(url, targetID, text, height, input, rule = 0) {
    var font;
    var target = stage.findOne(`#${targetID}`);
    opentype.load(url, function(err, newfont) {
        if (err) {
            console.error('Erro ao carregar a fonte: ', err);
            return;
        }
        font = newfont;
    });
    
    var fontSize = text.getAttr('fontSize');
    
    // if (target.getAttr('pathText')) {
    //     var pathData = font.getPath(text.text(), text.x(), text.y() + height, fontSize);
    //     target.setAttr('pathText', new Path2D(pathData.toPathData()));
    // } else {
    //     rule === 0 ? rule = 'nonzero' : rule = 'evenodd';
    //     target.setAttrs({
    //         pathText: pathText,
    //         rule: rule,
    //         clipFunc: function (ctx) {
    //             ctx.rect(0, 0, width, height);
    //             var path2D = new Path2D();
    //             rule === 0 ? '' : path2D.rect(0, 0, width, height);
    //             path2D.addPath(target.getAttr('pathText'));
    //             ctx._context.clip(path2D, rule);
    //         },
    //     });
    // }

    input.addEventListener('input', ()=> {
        var pathData = font.getPath(input.value.toUpperCase(), text.x(), text.y() + height, fontSize);
        target.setAttr('pathText', new Path2D(pathData.toPathData()));
    });
}

function setClip(url, target, rule = 0) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'document';

    xhr.onload = function () {
        if (xhr.status === 200) {
            var svgDoc = xhr.response;
            var pathElement = svgDoc.querySelector('path');
            
            if (pathElement) {
                var clip = pathElement.getAttribute('d');
                var width = target.width();
                var height = target.height();
                var pathClip = new Path2D(clip);
                var pathText = new Path2D();
                
                rule === 0 ? rule = 'nonzero' : rule = 'evenodd';
                
                target.setAttrs({
                    pathClip: pathClip,
                    pathText: pathText,
                    rule: rule, 
                    clipFunc: function (ctx) {
                        ctx.rect(0, 0, width, height);
                        var path2D = new Path2D();
                        rule === 0 ? '' : path2D.rect(0, 0, width, height);
                        path2D.addPath(target.getAttr('pathClip'));
                        path2D.addPath(target.getAttr('pathText'));
                        ctx._context.clip(path2D, rule);
                    },
                });

                var rect = new Konva.Rect({
                    height: height,
                    width: width,
                    fill: 'red',
                });
                //target.add(rect);

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
                
                var noEdit = {...attrs.noEdit};
                var edit = {...attrs.edit};
                Object.assign(edit, { potrace: 1, invert: 0, sharpen: 0, moveable: true, });

                var shape = new Konva.Shape({
                    width: img.width,
                    height: img.height,
                    icon: icon,
                    path2D: path2D,
                    ...noEdit,
                    ...edit,
                    edit: Object.keys(edit),
                });

                shape.getAttr('func') ? shape.getAttr('func')() : '';
            
                shape.setAttrs({
                    sceneFunc: function (ctx) {
                        ctx.clip(shape.getAttr('path2D'));
                        ctx.fillStyle = shape.fill();
                        ctx.fillRect(0, 0, shape.width(), shape.height());
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
                shape.on('dragstart', ()=> {
                    console.log(true);
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

function applySharpen(ctx, width, height, intensity = 1) {
    // Ajuste a intensidade do sharpen
    const weights = [
        0, -1 * intensity, 0,
        -1 * intensity, 1 + 4 * intensity, -1 * intensity,
        0, -1 * intensity, 0
    ];
    
    const side = Math.round(Math.sqrt(weights.length));
    const halfSide = Math.floor(side / 2);
    const srcData = ctx.getImageData(0, 0, width, height);
    const dstData = ctx.createImageData(width, height);
    
    const src = srcData.data;
    const dst = dstData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const dstOff = (y * width + x) * 4;
            let r = 0, g = 0, b = 0;
            
            for (let cy = 0; cy < side; cy++) {
                for (let cx = 0; cx < side; cx++) {
                    const scy = Math.min(height - 1, Math.max(0, y + cy - halfSide));
                    const scx = Math.min(width - 1, Math.max(0, x + cx - halfSide));
                    const srcOff = (scy * width + scx) * 4;
                    const wt = weights[cy * side + cx];
                    
                    r += src[srcOff] * wt;
                    g += src[srcOff + 1] * wt;
                    b += src[srcOff + 2] * wt;
                }
            }
            
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = src[dstOff + 3]; // Copy alpha channel
        }
    }
    
    ctx.putImageData(dstData, 0, 0);
}

function upPotrace() {
    loadOn(0);
    var img = new Image();
    img.onload = () => {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = `brightness(${nodeTarget[0].getAttr('potrace')})
            invert(${nodeTarget[0].getAttr('invert')})`;
        ctx.drawImage(img, 0, 0);
        applySharpen(ctx, canvas.width, canvas.height, nodeTarget[0].getAttr('sharpen'));
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

jscolor.presets.default = {
    width:250, height:165, closeButton:true, closeText:'', sliderSize:20
};

function btnHold(element, action) {
    if (element || action) {
        let timer = null;
        let touchTimer = null;

        function startMoving() {
            if (element) {
                element.classList.add('onClick');
                function ContinueAction() {
                    action();
                    if (btnOnFocus) {
                        timer = setTimeout(ContinueAction, 100);
                    } else {
                        stopMoving();
                    }
                }
                if (btnOnFocus) {
                    action();
                    timer = setTimeout(ContinueAction, 400);
                } else {
                    stopMoving();
                }
            }
        }

        function stopMoving() {
            btnOnFocus = false;
            clearTimeout(timer);
            clearTimeout(touchTimer);
            element.classList.remove('onClick');
        }

        element.addEventListener('mousedown', () => {
            btnOnFocus = true;
            startMoving();
        });

        element.addEventListener('touchstart', () => {
            btnOnFocus = true;
            touchTimer = setTimeout(() => {
                startMoving();
            }, 200);
        });
        
        element.addEventListener('touchmove', () => {
            clearTimeout(touchTimer);
        });

        element.addEventListener('mouseup', stopMoving);
        element.addEventListener('touchend', stopMoving);
    }
}

function align(v) {
    var parent = nodeTarget[0].getParent();
    var pSize = parent.size();
    var nodeSize = nodeTarget[0].size();
    var newPos = nodeTarget[0].position();
    var scale = nodeTarget[0].scale();

    switch (v) {
        case 'top':
            newPos.y = 0;
            break;
        case 'bottom':
            newPos.y = pSize.height - (nodeSize.height * scale.y);
            break;
        case 'left':
            newPos.x = 0;
            break;
        case 'right':
            newPos.x = pSize.width - (nodeSize.width * scale.x);
            break;
        case 'middle':
            newPos.y = (pSize.height - (nodeSize.height * scale.y)) / 2;
            break;
        case 'center':
            newPos.x = (pSize.width - (nodeSize.width * scale.x)) / 2;
            break;
        default:
            break;
    }

    nodeTarget[0].position(newPos);
    transformer.getLayer().batchDraw();
}

function moveNode(v = {n: undefined, v: 0}) {
    var newPos = nodeTarget[0].position();

    switch (v.n) {
        case 'up':
            newPos.y = newPos.y - v.v;
            break;
        case 'down':
            newPos.y = newPos.y + v.v;
            break;
        case 'left':
            newPos.x = newPos.x - v.v;
            break;
        case 'right':
            newPos.x = newPos.x + v.v;
        default:
            break;
    }

    nodeTarget[0].position(newPos);
    transformer.getLayer().batchDraw();
}

function createInput() {
    var listBtn = [];

    function createJsColor(parent, add) {
        var box = document.createElement('div');
        box.className = 'JsColorBox';
        if (add.list) {
            var tittle = document.createElement('div');
            tittle.textContent = add.name;
            box.classList.add('list');
            box.appendChild(tittle);
        }
        var input = document.createElement('button');
        input.className = 'jscolor';
        input.setAttribute('data-jscolor', `{value:'#ff0000'}`);
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
                            parent.btn.style.setProperty('--color', newColor);
                            if (needDraw.includes(add.attr)) {
                                e.image().draw();
                            }
                        });
                    }
                }
            });
        });
        
        observer.observe(input, { attributes: true });
        
        input.change = ()=> {
            var value = nodeTarget[0].getAttr(add.attr);
            parent.btn.style.setProperty('--color', value);
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
        
        var inputRange = document.createElement('input');
        Object.assign(inputRange, {
            type: 'range',
            min: v.min, 
            max: v.max, 
            step: v.label ? (v.max - v.min) * 0.005 : 1 
        });
        
        parent.input.push(inputRange);
        
        var inputText = document.createElement('input');
        inputText.type = 'text';
        inputText.value = inputRange.value;
        
        function mapToRange(value) {
            var l = v.label;
            var mappedValue = ((value - v.min) / (v.max - v.min)) * (l.max - l.min) + l.min;
            inputText.value = `${Math.round(mappedValue)}`;
        }
    
        inputRange.change = () => {
            var value = nodeTarget[0].getAttr(add.attr) / (v.scale ? 5 : 1);
            inputRange.value = value;
            v.label ? mapToRange(value) : inputText.value = value;
        };
    
        inputRange.addEventListener(add.onChange ? 'change' : 'input', () => {
            if (nodeTarget.length > 0) {
                nodeTarget.forEach(e => {
                    var value = inputRange.value * (v.scale ? 5 : 1);
                    e.setAttr(add.attr, value);
                    add.func ? eval(add.func) : '';
                    if (needDraw.includes(add.attr)) {
                        e.image().draw();
                    }
                });
            }
        });
    
        inputRange.oninput = () => { 
            v.label ? mapToRange(inputRange.value) : inputText.value = inputRange.value;
        };
    
        inputText.addEventListener('input', () => {
            var value = parseFloat(inputText.value);
            if (isNaN(value)) {
                value = v.min;
            } else if (value < v.min) {
                value = v.min;
            } else if (value > v.max) {
                value = v.max;
            }
            inputRange.value = value;
            inputRange.dispatchEvent(new Event('input'));
        });
    
        inputText.addEventListener('keydown', (e) => {
            var step = parseFloat(inputRange.step) || 1;
            var value = parseFloat(inputText.value);
    
            if (isNaN(value)) value = v.min;
    
            if (e.key === 'ArrowUp') {
                value = Math.min(value + step, v.max);
            } else if (e.key === 'ArrowDown') {
                value = Math.max(value - step, v.min);
            }
    
            inputText.value = value;
            inputRange.value = value;
            inputRange.dispatchEvent(new Event('input'));
        });
    
        box.append(title, inputRange, inputText);
        parent.appendChild(box);
    }
    
    function createChooser(parent, add) {
        var box = document.createElement('div');
        box.className = 'chooserBox';
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

    function btnFunc(parent, add) {
        var box = document.createElement('div');
        box.className = '';
        if (add.name) {
            var tittle = document.createElement('div');
            tittle.textContent = add.name;
            box.appendChild(tittle);
        }
        
        var btnBox = document.createElement('div');
        add.class ? btnBox.className = add.class : '';

        var list = [];
        add.btns.forEach(e => {
            var value = e.value;
            var btn = document.createElement('button');
            e.class ? btn.className = e.class : '';
            list.push(btn);
            if (e.text) {
                var span = document.createElement('span');
                span.textContent = e.text;
                btn.append(span);
            }
            if (add.btnHold) {
                var func = ()=> {
                    nodeTarget.forEach(e => {
                        (add.attr ? e.setAttr(add.attr, value) : '');
                    });
                    eval(add.btnHold);
                };
                btnHold(btn, func);
            } else {
                btn.onclick = ()=> {
                    nodeTarget.forEach(e => {
                        (add.attr ? e.setAttr(add.attr, value) : '');
                        (add.func ? eval(add.func) : '');
                    });
                };
            }
            btnBox.appendChild(btn);
        });
        
        box.append(btnBox);
        parent.append(box);
    }

    var aBox = document.createElement('div');
    adjustBox.appendChild(aBox);
    aBox.a = document.createElement('div');
    aBox.b = document.createElement('div');
    aBox.c = document.createElement('button');
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
            class: 'color',
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
            class: 'color',
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
            name: 'Ajuste',
            class: 'Adjust',
            add: [
                {
                    name: 'Brilho',
                    type: 'range',
                    attr: 'brightness',
                    values: {min: 0, max: 2, label: {min: -100, max: 100}},
                },
                {
                    name: 'Contraste',
                    type: 'range',
                    attr: 'contrast',
                    values: {min: 0, max: 2, label: {min: -100, max: 100}},
                },
            ],
        },

        // Potrace
      
        {
            name: 'Efeito',
            class: 'svgEfect',
            add: [
                {
                    name: 'Brilho',
                    type: 'range',
                    attr: 'potrace',
                    onChange: true,
                    func: 'upPotrace()',
                    values: {min: 0, max: 2, label: {min: -10, max: 10}},
                },
                {
                    name: 'Detalhamento',
                    type: 'range',
                    attr: 'sharpen',
                    onChange: true,
                    func: 'upPotrace()',
                    values: {min: 0, max: 2, label: {min: 0, max: 100}},
                },
                {
                    name: 'inverter',
                    class: 'flex',
                    type: 'btnFunc',
                    attr: 'invert',
                    func: 'upPotrace()',
                    btns: [
                        {text: 'Não', value: '0', class: ''}, 
                        {text: 'Sim', value: '1', class: ''},
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

        {
            name: 'Borda',
            class: 'stroke',
            add: [
                {
                    name: 'Espessura',
                    type: 'range',
                    attr: 'strokeWidth',
                    values: {min: 0, max: 20, scale: true},
                },
                {
                    name: 'Cor',
                    type: 'color',
                    attr: 'stroke',
                    list: true,
                },
            ]
        },

        // effects 

        {
            name: 'Sombra',
            class: 'shadow',
            add: [
                {
                    name: 'Borrão',
                    type: 'range',
                    attr: 'shadowBlur',
                    values: {min: 0, max: 20, scale: true},
                },
                {
                    name: 'Transparência',
                    type: 'range',
                    attr: 'shadowOpacity',
                    values: {min: 0, max: 1, label: {min: 0, max: 100}},
                },
                {
                    name: 'Cor',
                    type: 'color',
                    attr: 'shadowColor',
                    list: true,
                },
                {
                    name: 'Posição Horizontal',
                    type: 'range',
                    attr: 'shadowOffsetX',
                    values: {min: -50, max: 50},
                },
                {
                    name: 'Posição Vetical',
                    type: 'range',
                    attr: 'shadowOffsetY',
                    values: {min: -50, max: 50},
                },
            ],
        },

        // position

        {
            name: 'Posição',
            class: 'position',
            add: [
                {
                    name: '',
                    class: 'grid position',
                    type: 'btnFunc',
                    attr: 'moveable',
                    func: 'align(value)',
                    btns: [
                        {text: 'Em cima', value: 'top', class: 'onTop'}, 
                        {text: 'Esquerda', value: 'left', class: 'onLeft'},
                        {text: 'Meio', value: 'middle', class: 'onMiddle'}, 
                        {text: 'Centro', value: 'center', class: 'onCenter'},
                        {text: 'Em baixo', value: 'bottom', class: 'onBottom'}, 
                        {text: 'Direita', value: 'right', class: 'onRight'},
                    ],
                },
                {
                    name: '',
                    class: 'flex position',
                    type: 'btnFunc',
                    attr: 'moveable',
                    btnHold: 'moveNode(value)',
                    btns: [
                        {value: {n: 'up', v: 1 / scaleLayer}, class: 'up'},
                        {value: {n: 'down', v: 1 / scaleLayer}, class: 'down'},
                        {value: {n: 'left', v: 1 / scaleLayer}, class: 'left'},
                        {value: {n: 'right', v: 1 / scaleLayer}, class: 'right'},
                    ],
                },
            ]
        }

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
            if(add.type === 'btnFunc') {
                btnFunc(box, add);
            }
        });

        bBox.appendChild(box);

        let button = document.createElement('button');
        button.className = `iconBtn  ${e.class}`;
        button.textContent = e.name;
        button.box = box;
        button.n = e.add.map(e => e.attr);
        listBtn.push(button);

        button.onclick = ()=> {
            listBtn.forEach(e => {
                if (e === button) {
                    e.classList.add('selected');
                    e.box.classList.remove('hidden');
                    aBox.b.textContent = e.textContent;
                } else {
                    e.classList.remove('selected');
                    e.box.classList.add('hidden');
                }
            });
        };

        box.btn = button;

        cBox.appendChild(button);
    });

    updateSets = () => {
        var attrs = nodeTarget[0].getAttr('edit');
        cBox.setAttribute('type', nodeTarget[0].getClassName());
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
                aBox.b.textContent = e.textContent;
            } else {
                e.classList.remove('selected');
                e.box.classList.add('hidden');
            }
            e.box.input.forEach(input => {
                input.change();
            });
        });
    };
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