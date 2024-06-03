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

var popupBottom = document.createElement('div');
popupBottom.className = 'popupBottom';
popupEditor.appendChild(popupBottom);

var popupBtnWrap = document.createElement('div');
popupBtnWrap.className = 'popupBtnWrap';
popupBottom.appendChild(popupBtnWrap);

var editWrap = document.createElement('div');
popupBottom.appendChild(editWrap);

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

function objectFill(node, object, parent) {
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

var dragRect = new Konva.Rect({
    draggable: true,
    fill: '#998fff66',
});
layer.add(dragRect);
dragRect.hide();

var transformer = new Konva.Transformer({
    enabledAnchors: [
        'top-left', 
        'top-right',
        'bottom-left',
        'bottom-right',
    ],
});
layer.add(transformer);
transformer.hide();

function dragOn(target) {
    transformer.nodes([target]);
    dragRect.width(transformer.width());
    dragRect.height(transformer.height());
    dragRect.x(transformer.x());
    dragRect.y(transformer.y());
    dragRect.scaleX(transformer.scaleX());
    dragRect.scaleY(transformer.scaleY());
    transformer.nodes([target, dragRect]);
    dragRect.show();
    transformer.show();
}

function dragOff() {
    transformer.nodes([]);
    dragRect.hide();
    transformer.hide();
}

var canSelect = [dragRect];

clickTap(stage, (e)=> {
    if (canSelect.includes(e.target)) {
        return;
    }
    dragOff();
});

//  //  //  //  //  //  //

// var frontPrint = new Konva.Group({
//     x: (editLayer.width() / 2) - ((editLayer.width() * 0.4) / 2),
//     y: (editLayer.height() / 2) - (((editLayer.width() * 0.4) * 1.41) / 2),
//     width: editLayer.width() * 0.4,
//     height: (editLayer.width() * 0.4) * 1.41,
//     clip: {
//         x: 0,
//         y: 0,
//         width: editLayer.width() * 0.4,
//         height: (editLayer.width() * 0.4) * 1.41,
//     }
// });

// var backPrint = new Konva.Group({
//     x: (editLayer.width() / 2) - ((editLayer.width() * 0.4) / 2),
//     y: (editLayer.height() * 0.14),
//     width: editLayer.width() * 0.4,
//     height: (editLayer.width() * 0.4) * 1.41,
//     clip: {
//         x: 0,
//         y: 0,
//         width: editLayer.width() * 0.4,
//         height: (editLayer.width() * 0.4) * 1.41,
//     }
// });

function upload(e, parent) {
    var file = e.target.files[0];
    var reader = new FileReader();

    reader.onload = function () {
        var img = new Image();
        img.onload = function () {
            var konvaImage = new Konva.Image({
                image: img,
            });
            objectFill(konvaImage, img, parent);
            parent.add(konvaImage);
            canSelect.push(konvaImage);
            parent.getLayer().draw();
            dragOn(konvaImage);
            clickTap(konvaImage, ()=> {
                dragOn(konvaImage);
            });
            e.target.value = '';
        };
        img.src = reader.result;
    };

    reader.readAsDataURL(file);
};

stage.on('wheel', function (e) {
    e.evt.preventDefault();
    var scaleBy = 1.1;
    var oldScale = layer.scaleX();

    var pointer = stage.getPointerPosition();

    var mousePointTo = {
        x: (pointer.x - layer.x()) / oldScale,
        y: (pointer.y - layer.y()) / oldScale,
    };

    var newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    layer.scale({ x: newScale, y: newScale });

    var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };

    layer.position(newPos);
    layer.batchDraw();
});

var lastDist = 0;