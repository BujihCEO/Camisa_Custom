const ProductEdit = document.querySelector('.ProductEdit');
let updateOptionsFunctions = [];

let btnOnFocus = false;
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

function elementScaleX(target, repeat) {
    if (target.offsetWidth > target.parentNode.offsetWidth) {
        value = target.parentNode.offsetWidth / target.offsetWidth; 
        target.style.transform = `scaleX(${value})`;
        repeat && (repeat.forEach((e => {e.style.transform = `scaleX(${value})`;})));
    } else {
        target.style.transform = '';
        repeat && (repeat.forEach((e => {e.style.transform = '';})));
    }
}

function elementXYlimited(target, type, returnStyle) {
    if (target.offsetHeight > target.parentNode.offsetHeight || 
        target.offsetWidth > target.parentNode.offsetWidth) {
            returnStyle();
            if (type.includes('text')) {
                message = 'Texto grande demais. Diminua o tamanho da fonte e tente novamente.';
            }
            callAlert(message);
        }
}

function inputText(input, target, repeat, maxLength, XYlimited, scaleX) {
    if (maxLength) {
        input.value = input.value.slice(0, maxLength);
    }
    target.textContent = input.value;
    repeat && (repeat.forEach((e => {
        e.textContent = input.value;
    })));
    if (XYlimited) {
        elementXYlimited(target, 'text', ()=> {
            input.blur();
            input.value = input.value.slice(0, -1);
            target.textContent = input.value;
            repeat && (repeat.forEach((e => {e.textContent = input.value})));
        });
    }
    if (scaleX) {
        elementScaleX(target, repeat);
    }
}

function changeSize(tgt, value, signal, style, min, max, XYlimited = false, scaleX = false) {
    var min = parseFloat(min) || Number.NEGATIVE_INFINITY;
    var max = parseFloat(max) || Number.POSITIVE_INFINITY;
    if (style.includes('--')) {
        var actualSize = parseFloat(window.getComputedStyle(tgt).getPropertyValue(style));
        var result = Math.min(max, Math.max(min, signal ? actualSize + parseFloat(value) : actualSize - parseFloat(value)));
        tgt.style.setProperty(style, result + 'px');
    } else {
        var actualSize = parseFloat(window.getComputedStyle(tgt)[style]);
        var result = Math.min(max, Math.max(min, (signal ? actualSize + parseFloat(value) : actualSize - parseFloat(value))));
        tgt.style[style] = result + 'px';
    }
    if (XYlimited) {
        if (style.includes('fontSize') || style.includes('webkitTextStrokeWidth')) {
        }
        var type = 'text';
        elementXYlimited(tgt, type, ()=> {
            if (style.includes('--')) {
                tgt.style.setProperty(style, actualSize + 'px');
            } else {
                tgt.style[style] = actualSize + 'px';
            }
            btnOnFocus = false;
        });
    }
    if (scaleX) {
        elementScaleX(tgt);
    }
}

function createChangeSizeBox(parent, className, target, value, style, min, max, XYlimited, scaleX) {
    var box = document.createElement('div');
    box.className = `sizeBox box_1 ${className}`;
    parent.appendChild(box);
    var plus = document.createElement('div');
    plus.className = 'plusIcon btn';
    btnHold(plus, ()=> {
        var tgt = target();
        if (tgt instanceof Element) {
            changeSize(tgt, value, true, style, min, max, XYlimited, scaleX);
        }
    });
    var less = document.createElement('div');
    less.className = 'lessIcon btn';
    btnHold(less, ()=> {
        var tgt = target();
        if (tgt instanceof Element) {
            changeSize(tgt, value, false, style, min, max, XYlimited, scaleX);
        }
    });
    box.appendChild(less);
    box.appendChild(plus);
}

function createFontFamilyBox(parent, target, listName, XYlimited, scaleX) {
    var box = document.createElement('div');
    var slider = document.createElement('div');
    box.className = 'fontFamilyBox box_1';
    slider.className = 'slider';
    parent.appendChild(box);
    box.appendChild(slider);
    var styleCss = document.createElement('style');
    document.body.appendChild(styleCss);
    var list = {};
    var putlistName = `list = ${listName};`;
    eval(putlistName);
    list.forEach((link, index) => {
        var button = document.createElement('div');
        button.className = 'fontIcon btn';
        var fontFamilyName = 'Font' + (index + 1);
        var css = '@font-face {' +
            'font-family: "' + fontFamilyName + '";' +
            'src: url(' + link + ') format("truetype");' +
        '}';
        styleCss.appendChild(document.createTextNode(css));
        if (index === 0) {
            button.classList.add('selected');
            target.style.fontFamily = 'Font' + (index + 1);
        }
        button.style.fontFamily = fontFamilyName;
        button.innerText = 'A';
        button.addEventListener('click', ()=> {
            Array.from(button.parentNode.children).forEach((element) => {
                element.classList.remove('selected');
            });
            button.classList.add('selected');
            target.style.fontFamily = fontFamilyName;
            if (XYlimited) {
                elementXYlimited(target, 'text', ()=> {
                    target.style.fontSize = actualSize + 'px';
                    btnOnFocus = false;
                });
            }
            if (scaleX) {
                elementScaleX(target);
            } 
        });
        slider.appendChild(button);
    });
}

function createJsColorBox(parent, newBox, target, style, value, setAtt) {
    var box = document.createElement('div');
    var jscolor = document.createElement('button');
    box.className = 'JsColorBox';
    jscolor.setAttribute('data-jscolor', `{value:'${value}'}`);
    box.appendChild(jscolor);
    if (newBox) {
        var div = document.createElement('div');
        div.className = `colorBox box_1 ${newBox}`;
        parent.appendChild(div);
        div.appendChild(box);
    } else {
        parent.appendChild(box);
    }
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-current-color') {
                var color = mutation.target.getAttribute('data-current-color');
                var tgt = target();
                if (tgt instanceof Element) {
                    tgt.setAttribute(setAtt, color);
                    if (style.includes('--')) {
                        tgt.style.setProperty(style, color);
                    } else {
                        tgt.style[style] = color;
                    }
                }
                var nextSibling = jscolor.nextElementSibling;
                if (nextSibling) {
                    nextSibling.style.background = color;
                }
            }
        });
    });
    observer.observe(jscolor, { attributes: true });
    if (setAtt) {
        updateOptionsFunctions.push(() => {
            var tgt = target();
            if (tgt instanceof Element) {
                var color = tgt.getAttribute(setAtt);
                jscolor.style.background = color;
                jscolor.setAttribute('data-current-color', color);
            }
        });
    }
}

function createInputTextBox() {
    var boxes = document.querySelectorAll('.inputTextBox');
    boxes.forEach((element, index) => {
        var XYlimited = element.getAttribute('data-XYlimited');
        var scaleX = element.getAttribute('data-scaleX');
        var type = element.getAttribute('type');
        var maxLength = element.getAttribute('maxLength');
        var textReplace = document.querySelectorAll('.textReplace');
        var target = textReplace[index];
        if (element.hasAttribute('tittle')) {
            var tittle = document.createElement('div');
            tittle.className = 'tittle';
            tittle.textContent = element.getAttribute('tittle');
            element.appendChild(tittle);
        }
        if (element.hasAttribute('repeat')) {
            var repeat = document.querySelectorAll(`.${element.getAttribute('repeat')}`);
        }
        var input = document.createElement('input');
        input.className = `inputText box_1`;
        input.setAttribute('type', type);
        input.setAttribute('placeholder', 'Digite aqui...');
        input.addEventListener('input', function() {
            inputText(input, target, repeat, maxLength, XYlimited, scaleX);
            if (element.hasAttribute('addFunction')) {
                var addFunctions = element.getAttribute('addFunction').split(',').map(func => func.trim());
                addFunctions.forEach(addFunctionName => {
                    var addFunction = window[addFunctionName];
                    addFunction();
                });
            }
        });
        element.appendChild(input);
        if (element.hasAttribute('fontFamily')) {
            var listName = element.getAttribute('fontFamily');
            createFontFamilyBox(element, target, listName, XYlimited, scaleX);
        }
        if (element.hasAttribute('color')) {
            var value = element.getAttribute('color');
            createJsColorBox(element, 'textColorBox', ()=> target, 'color', value, 'color');
        }
        if (element.hasAttribute('fontSize')) {
            var att = element.getAttribute('fontSize');
            var value = att.match(/value={([^}]*)}/)?.[1];
            var min = att.match(/min={([^}]*)}/)?.[1];
            var max = att.match(/max={([^}]*)}/)?.[1];
            createChangeSizeBox(element, 'fontSizeBox', ()=> target, value, 'fontSize', min, max, XYlimited, scaleX);
        }
        if (element.hasAttribute('textStroke')) {
            var att = element.getAttribute('textStroke');
            var value = att.match(/value={([^}]*)}/)?.[1];
            var min = att.match(/min={([^}]*)}/)?.[1];
            var max = att.match(/max={([^}]*)}/)?.[1];
            createChangeSizeBox(element, 'textStrokeBox', ()=> target, value, 'webkitTextStrokeWidth', min, max);
        }
        if (element.hasAttribute('strokeColor')) {
            var value = element.getAttribute('strokeColor');
            createJsColorBox(element, 'strokeColorBox', ()=> target, 'webkitTextStrokeColor', value, 'strokeColor');
        }
        if (element.hasAttribute('letterSpacing')) {
            var att = element.getAttribute('letterSpacing');
            var value = att.match(/value={([^}]*)}/)?.[1];
            var min = att.match(/min={([^}]*)}/)?.[1];
            var max = att.match(/max={([^}]*)}/)?.[1];
            createChangeSizeBox(element, 'letterSpacingBox', ()=> target, value, 'letterSpacing', min, max, XYlimited, scaleX);
        }
    });
}
document.querySelector('.inputTextBox') && createInputTextBox();

// JScolor Functions //
jscolor.presets.default = {
    width:250, height:165, closeButton:true, closeText:'', sliderSize:20
};
//  //
const Bg_Product = document.querySelector('.Bg_Product');
const ProductBox = document.querySelector('.ProductBox');
const MoveExmp = document.querySelector('.MoveExmp');
let PreviewScale = 1;

let initialDistance = 0;
let initialScale = 1;

Bg_Product.addEventListener('touchstart', (e) => {
    const touches = e.touches;
    if (touches.length === 2) {
        initialDistance = getDistance(touches[0], touches[1]);
        initialScale = ProductBox.style.transform ? parseFloat(ProductBox.style.transform.split('(')[1]) : 1;
    }
});

Bg_Product.addEventListener('touchmove', (e) => {
    const touches = e.touches;
    if (touches.length === 2) {
            e.preventDefault();
            MoveExmp.classList.add('hidden');
            const currentDistance = getDistance(touches[0], touches[1]);
            const scale = Math.min(3, Math.max(1, initialScale * (currentDistance / initialDistance)));
            ProductBox.style.transform = `scale(${scale})`;
            imgSizeAll.forEach(element => {
                element.style.transform = `scale(${1 / scale})`;
            });
            dragSelector.style.boxShadow = `0 0 0 ${1 / scale}px blue`;
            PreviewScale = scale;
    }
});

function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

let scale = 1;
let isHovered = false;

Bg_Product.addEventListener('mouseenter', () => {
    isHovered = true;
});

Bg_Product.addEventListener('mouseleave', () => {
    isHovered = false;
});

document.addEventListener('wheel', (e) => {
    if (isHovered) {
        e.preventDefault();
        MoveExmp.classList.add('hidden');
        const direction = e.deltaY > 0 ? -1 : 1;
        scale = Math.min(3, Math.max(1, scale + direction * 0.1));
        ProductBox.style.transform = `scale(${scale})`;
        imgSizeAll.forEach(element => {
            element.style.transform = `scale(${1 / scale})`;
        })
        dragSelector.style.boxShadow = `0 0 0 ${1 / scale}px blue`;
        PreviewScale = scale;
    }
}, { passive: false });

Bg_Product.addEventListener('mousedown', (e) => {
    if (isHovered && !isElementClicked(e.target, ['dragSelector', 'ImgPreviewBox'])) {
        MoveExmp.classList.add('hidden');
        onClick = true;
        isDragging = true;
        initialX = e.clientX - offsetX;
        initialY = e.clientY - offsetY;
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                onClick = false;
                size = ProductBox.offsetHeight / 2;
                offsetX = Math.min(size, Math.max(-size, e.clientX - initialX));
                offsetY = Math.min(size, Math.max(-size, e.clientY - initialY));
                ProductBox.style.translate = `${offsetX}px ${offsetY}px`;
            }
        });
        Bg_Product.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                if (onClick) {
                    deselectIcon();
                }
            }
        });
    }
});
  
let isDragging = false;
let initialX, initialY, offsetX = 0, offsetY = 0;

Bg_Product.addEventListener('touchstart', function (event) {
    if (!isElementClicked(event.target, ['dragSelector'])) {
        onClick = true;
        isDragging = true;
        initialX = event.touches[0].clientX - offsetX;
        initialY = event.touches[0].clientY - offsetY;
        Bg_Product.addEventListener('touchmove', (e) => {
            const touches = e.touches;
            if (isDragging) {
                onClick = false;
                e.preventDefault();
                MoveExmp.classList.add('hidden');
                size = ProductBox.offsetHeight / 2;
                offsetX = Math.min(size, Math.max(-size, touches[0].clientX - initialX));
                offsetY = Math.min(size, Math.max(-size, touches[0].clientY - initialY));
                ProductBox.style.translate = `${offsetX}px ${offsetY}px`;
            }
        });
        Bg_Product.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                if (onClick) {
                    deselectIcon();
                }
            }
        });
    }
});

function isElementClicked(target, elementClasses) {
    for (const elementClass of elementClasses) {
        if (target.classList.contains(elementClass) || target.closest(`.${elementClass}`) !== null) {
            return true;
        }
    }
    return false;
}

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
}
  
if (isTouchDevice()) {
    MoveExmp.style.background = 'url(https://www.svgrepo.com/show/443837/gui-gesture-pinch-close.svg) center / contain';
} else {
    MoveExmp.style.background = 'url(https://www.svgrepo.com/show/325415/mouse-scroll-wheel.svg) center / contain';
}

//  DRAG MOVE ELEMENT //

var dragSelector = document.querySelector('.dragSelector');
var dragMove = document.querySelector('.dragMove');
var dragSizeList = ['T', 'B', 'L', 'R', 'T-L', 'T-R', 'B-L', 'B-R'];
for (let i = 0; i < 8; i++) {
    var div = document.createElement('div');
    div.classList.add('imgSize');
    div.classList.add(dragSizeList[i]);
    dragSelector.appendChild(div);
}
var showLimits = document.querySelector('.showLimits');
var dragMove = document.querySelector('.dragMove');
var dragTarget = null;
function getPositions() {
    var target = window.getComputedStyle(dragTarget);
    currentTop = parseFloat(target.top) * PreviewScale;
    currentLeft = parseFloat(target.left) * PreviewScale;
    var selector = window.getComputedStyle(dragSelector);
    dragCurrentTop = parseFloat(selector.top) * PreviewScale;
    dragCurrentLeft = parseFloat(selector.left) * PreviewScale;
    showLimits.classList.add('on');
}
function moveElement() {
    dragTarget.style.top = ((movimentY + currentTop) / PreviewScale) + 'px';
    dragTarget.style.left = ((movimentX + currentLeft) / PreviewScale) + 'px';
    dragSelector.style.top = ((movimentY + dragCurrentTop) / PreviewScale) + 'px';
    dragSelector.style.left = ((movimentX + dragCurrentLeft) / PreviewScale) + 'px';
}
dragMove.addEventListener('mousedown', function (event) {
    startY = event.clientY;
    startX = event.clientX;
    getPositions();
    document.onmousemove = function (e) {
        movimentY = e.clientY - startY;
        movimentX = e.clientX - startX;
        moveElement();
    };
    document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
        showLimits.classList.remove('on');
    };
    dragMove.ondragstart = function () {
        return false;
    };
});
dragMove.addEventListener('touchstart', function (event) {
    event.preventDefault();
    touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    getPositions();
    function TouchMove(event) {
        if (event.touches.length == 1) {
            event.preventDefault();
            touch = event.touches[0];
            movimentX = touch.clientX - startX;
            movimentY = touch.clientY - startY;
            moveElement();
        }
    }
    dragMove.addEventListener('touchmove', TouchMove);
    dragMove.addEventListener('touchend', function () {
        dragMove.removeEventListener('touchmove', TouchMove);
        showLimits.classList.remove('on');
    });
});

var imgSizeAll = document.querySelectorAll('.imgSize');
var dragTargetChild = null;
imgSizeAll.forEach((element) => {
    function startTouch() {
        dragTargetChild = dragTarget.firstElementChild;
        var parent = window.getComputedStyle(dragTarget);
        currentHeight = parseFloat(parent.height) * PreviewScale;
        currentWidth = parseFloat(parent.width) * PreviewScale;
        currentTop = parseFloat(parent.top) * PreviewScale;
        currentLeft = parseFloat(parent.left) * PreviewScale;
        var child = window.getComputedStyle(dragTargetChild);
        imgHeight = parseFloat(child.height) * PreviewScale;
        imgWidth = parseFloat(child.width) * PreviewScale;
        imgTop = parseFloat(child.top) * PreviewScale;
        imgLeft = parseFloat(child.left) * PreviewScale;
        var selector = window.getComputedStyle(dragSelector);
        DragCurrentTop = parseFloat(selector.top) * PreviewScale;
        DragCurrentLeft = parseFloat(selector.left) * PreviewScale;
        showLimits.classList.add('on');
    }
    function onMoviment() {
        function applyStyles() {
            if (verify) {
                dragTarget.style.height = Vheight / PreviewScale + 'px';
                dragTarget.style.width = Vwidth / PreviewScale + 'px';
                dragTarget.style.top = ((Vtop + currentTop) / PreviewScale) + 'px';
                dragTarget.style.left = ((Vleft + currentLeft) / PreviewScale) + 'px';
            
                dragTargetChild.style.height = Cheight / PreviewScale + 'px';
                dragTargetChild.style.width = Cwidth / PreviewScale + 'px';
                dragTargetChild.style.top = Ctop / PreviewScale + 'px';
                dragTargetChild.style.left = Cleft / PreviewScale + 'px';
            
                dragSelector.style.height = Vheight / PreviewScale + 'px';
                dragSelector.style.width = Vwidth / PreviewScale + 'px';
                dragSelector.style.top = ((Vtop + DragCurrentTop) / PreviewScale) + 'px';
                dragSelector.style.left = ((Vleft + DragCurrentLeft) / PreviewScale) + 'px';
            }
        }
        if (element.classList.contains('T')) {
            Vheight = -movimentY + currentHeight; Vwidth= currentWidth; Vtop = movimentY; Vleft = 0;
            Cheight = imgHeight; Cwidth = imgWidth; Ctop = -movimentY + imgTop; Cleft = imgLeft;
            verify = Ctop / PreviewScale <= 0;
        }
        if (element.classList.contains('B')) {
            Vheight = movimentY + currentHeight; Vwidth = currentWidth; Vtop = 0; Vleft = 0;
            Cheight = imgHeight; Cwidth = imgWidth; Ctop = imgTop; Cleft = imgLeft,
            verify = Vheight / PreviewScale <= dragTargetChild.clientHeight + dragTargetChild.offsetTop;
        }
        if (element.classList.contains('L')) {
            Vheight = currentHeight; Vwidth = -movimentX + currentWidth; Vtop = 0; Vleft = movimentX;
            Cheight = imgHeight; Cwidth = imgWidth; Ctop = imgTop; Cleft = -movimentX + imgLeft;
            verify = Cleft / PreviewScale <= 0;
        }
        if (element.classList.contains('R')) {
            Vheight = currentHeight; Vwidth = movimentX + currentWidth; Vtop = 0; Vleft = 0;
            Cheight = imgHeight; Cwidth = imgWidth; Ctop = imgTop; Cleft = imgLeft;
            verify = Vwidth / PreviewScale <= dragTargetChild.clientWidth + dragTargetChild.offsetLeft;
        }
        if (element.classList.contains('T-L')) {
            Vheight = -movimentY + currentHeight; Vwidth = (Vheight * currentWidth) / currentHeight; Vtop = movimentY; Vleft = movimentY;
            Cheight = ((-movimentY + currentHeight) * imgHeight) / currentHeight; Cwidth = (Cheight * imgWidth) / imgHeight;
            Ctop = (Cheight * imgTop) / imgHeight; Cleft = (Cheight * imgLeft) / imgHeight;
            verify = true;
        }
        if (element.classList.contains('T-R')) {
            Vheight = -movimentY + currentHeight; Vwidth = (Vheight * currentWidth) / currentHeight; Vtop = movimentY; Vleft = 0; 
            Cheight= ((-movimentY + currentHeight) * imgHeight) / currentHeight; Cwidth = (Cheight * imgWidth) / imgHeight;
            Ctop = (Cheight * imgTop) / imgHeight; Cleft = (Cheight * imgLeft) / imgHeight;
            verify = true;
        }
        if (element.classList.contains('B-L')) {
            Vheight = movimentY + currentHeight; Vwidth = (Vheight * currentWidth) / currentHeight; Vtop = 0; Vleft = -movimentY;
            Cheight = ((movimentY + currentHeight) * imgHeight) / currentHeight; Cwidth = (Cheight * imgWidth) / imgHeight;
            Ctop = (Cheight * imgTop) / imgHeight; Cleft = (Cheight * imgLeft) / imgHeight;
            verify = true;
        }
        if (element.classList.contains('B-R')) {
            Vheight = movimentY + currentHeight; Vwidth = (Vheight * currentWidth) / currentHeight; Vtop = 0; Vleft = 0;
            Cheight = ((movimentY + currentHeight) * imgHeight) / currentHeight; Cwidth = (Cheight * imgWidth) / imgHeight;
            Ctop = (Cheight * imgTop) / imgHeight; Cleft = (Cheight * imgLeft) / imgHeight;
            verify = true;
        }
        applyStyles();
    }
    element.addEventListener('mousedown', function (event) {
        startY = event.clientY;
        startX = event.clientX;
        startTouch();
        document.onmousemove = function (e) {
            movimentY = e.clientY - startY;
            movimentX = e.clientX - startX;
            onMoviment();
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            showLimits.classList.remove('on');
        };
        element.ondragstart = function () {
            return false;
        };
    });
    element.addEventListener('touchstart', function (event) {
        touch = event.touches[0];
        startY = touch.clientY;
        startX = touch.clientX;
        event.preventDefault();
        startTouch();
        function touchMove(event) {
            if (event.touches.length == 1) {
                touch = event.touches[0];
                movimentY = touch.clientY - startY;
                movimentX = touch.clientX - startX;
                onMoviment();
            }
        }
        element.addEventListener('touchmove', touchMove);
        element.addEventListener('touchend', function () {
            element.removeEventListener('touchmove', touchMove);
            showLimits.classList.remove('on');
        });
    });
});

//  //  //  //

function createInputRange(parent, className, minValue, maxValue, stepValue, value, ftc, tittleText, attUpdate, oninput = true) {
    var inputBox = document.createElement('div');
    inputBox.className = `inputRangeBox ${className}  ${tittle ? '' : 'box_1'}`;
    parent.appendChild(inputBox);
    if (tittleText) {
        var tittle = document.createElement('div');
        tittle.textContent = tittleText;
        inputBox.appendChild(tittle);
    }
    var input = document.createElement('input');
    input.type = 'range';
    input.min = minValue;
    input.max = maxValue;
    input.step = stepValue;
    input.value = value;
    inputBox.appendChild(input);
    input.onchange = ()=> {
        oninput == true ? '' : ftc(input);
    };
    function updateStyle() {
        var percentage = (input.value - input.min) / (input.max - input.min) * 100;
        var colorBefore = '#000';
        var colorAfter = '#fff';
        var gradient = 'linear-gradient(to right, ' + colorBefore + ' 0%, ' + colorBefore + ' ' + percentage + '%, ' + colorAfter + ' ' + percentage + '%, ' + colorAfter + ' 100%)';
        input.style.background = gradient;
    }
    input.oninput = (event)=> {
        event.preventDefault();
        oninput == true ? ftc(input) : '';
        updateStyle();
    };
    updateOptionsFunctions.push(() => {
        input.value = previewTarget.getAttribute(attUpdate);
        updateStyle();
    });
}

function createSwitchBox(parent, addClass, code1, code2, attUpdate) {
    var box = document.createElement('div');
    box.className = `switchBox box_1 ${addClass}`;
    var buttonBox = document.createElement('div');
    buttonBox.className = '';
    var button = document.createElement('div');
    button.className = 'switchBtn';
    parent.appendChild(box);
    box.appendChild(buttonBox);
    buttonBox.appendChild(button);
    function on() { button.classList.remove('onLeft'); button.classList.add('onRight'); }
    function off() { button.classList.remove('onRight'); button.classList.add('onLeft'); }
    buttonBox.onclick = () => {
        if (button.classList.contains('onLeft')) {
            on();
            if (typeof code2 === 'function') {
                code2();
            } else {
                eval(code2);
            }
        } else {
            off();
            if (typeof code1 === 'function') {
                code1();
            } else {
                eval(code1);
            }
        }
    };
    if (attUpdate) {
        updateOptionsFunctions.push(() => {
            if (previewTarget.hasAttribute(attUpdate)) {
                if (previewTarget.getAttribute(attUpdate).includes(1)) {
                    on();
                } else {
                    off();
                }
            }
        });
    } else {
        off();
    }
}

function potrace(target, append, conclusion = ()=>{}) {
    function displaySVG(size, type) {
        var svg = Potrace.getSVG(size, type);
        var modifiedSVG = newSVG(svg);
        append.innerHTML = modifiedSVG;
    }
    function newSVG(svg) {
        svg = svg.replace(/fill="black"/g, 'fill="var(--color)"');
        const match = svg.match(/<svg[^>]* width="([^"]+)"[^>]* height="([^"]+)"/);
        if (match && match.length === 3) {
            const width = match[1];
            const height = match[2];
            svg = svg.replace(/<svg([^>]*)>/, `<svg$1 viewBox="0 0 ${width} ${height}">`);
            svg = svg.replace(/<svg([^>]*)>/, `<svg$1 aspectRatio="${width}/${height}">`);
        }
        return svg;
    }
    Potrace.loadImageFromUrl(target);
    Potrace.process(function() {
        displaySVG(1);
        conclusion();
    });
}

function upadatePotrace(input, invert) {
    if (iconTarget) {
        if (input) {
            var threshold = input.value;
            previewTarget.setAttribute('Threshold', threshold);
            invert = parseInt(previewTarget.getAttribute('invert'));
        } else {
            var threshold = previewTarget.getAttribute('Threshold');
            previewTarget.setAttribute('invert', invert);
        }
        var Src = iconTarget.src;
        var newImage = new Image();
        newImage.src = Src;
        newImage.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = newImage.width;
            canvas.height = newImage.height;
            var ctx = canvas.getContext('2d');
            ctx.filter = `brightness(${threshold}) invert(${invert})`;
            ctx.drawImage(newImage, 0, 0, newImage.width, newImage.height);
            var imgCanvas = canvas.toDataURL();
            potrace(imgCanvas, previewTarget);
        }
    }
}

function dragOn(verify, target) {
    if (verify) {
        dragTarget = target;
        dragSelector.style = '';
        showLimits.style = '';
        dragSelector.classList.remove('hidden');
        var Target = target.getBoundingClientRect();
        var Selector = dragSelector.getBoundingClientRect();
        var TargetParent = target.parentNode.getBoundingClientRect();
        var limites = showLimits.getBoundingClientRect();
        var X = (Target.left - Selector.left) / PreviewScale;
        var Y = (Target.top - Selector.top) / PreviewScale;
        dragSelector.style.height = target.clientHeight + 'px';
        dragSelector.style.width = target.clientWidth + 'px';
        dragSelector.style.left = X + 'px';
        dragSelector.style.top = Y + 'px';
        var pX = (TargetParent.left - limites.left) / PreviewScale;
        var pY = (TargetParent.top - limites.top) / PreviewScale;
        showLimits.style.height = TargetParent.height / PreviewScale + 'px';
        showLimits.style.width = TargetParent.width / PreviewScale + 'px';
        showLimits.style.left = pX + 'px';
        showLimits.style.top = pY + 'px';

    } else {
        dragSelector.classList.add('hidden');
    }
}

function updateOptions() {
    updateOptionsFunctions.forEach(func => func());
}

let previewBoxTarget = null;
let iconTarget = null;
let previewTarget = null;
let imgGroup = [];

function selectIcon(clicked, icon, previewBox, imgOptions) {
    if (clicked.classList.contains('selected')) {
        imgGroup.forEach(e => {
            e.classList.remove('selected');
        });
        dragOn(false);
        document.querySelectorAll('.imgOptionsBox').forEach(e =>{e.classList.add('hidden')});
    } else {
        imgGroup.forEach(e => {
            e.classList.remove('selected');
        });
        previewBoxTarget = previewBox;
        iconTarget = icon;
        previewTarget = previewBox.firstElementChild;
        icon.classList.add('selected');
        updateOptions();
        dragOn(true, previewBox);
        document.querySelectorAll('.imgOptionsBox').forEach(e =>{e.classList.add('hidden')});
        imgOptions.classList.remove('hidden');
    }
}

function deselectIcon() {
    imgGroup.forEach(e => {
        e.classList.remove('selected');
    });
    dragOn(false);
    document.querySelectorAll('.imgOptionsBox').forEach(e =>{e.classList.add('hidden')});
}

function loadImage(input, parentImg, parentIcon, imgGroup, process, optionBox) {
    deselectIcon();
    const file = input.files[0];
    const reader = new FileReader();
    var ImgPreviewBox = document.createElement('div');
    previewBoxTarget = ImgPreviewBox;
    ImgPreviewBox.className = 'ImgPreviewBox selected';
    parentImg.appendChild(ImgPreviewBox);
    var imgIcon = new Image();
    imgIcon.classList = 'imgIcon btn selected';
    iconTarget = imgIcon;
    ImgPreviewBox.onclick = ()=> selectIcon(ImgPreviewBox, imgIcon, ImgPreviewBox, optionBox);
    imgIcon.onclick = ()=> selectIcon(imgIcon, imgIcon, ImgPreviewBox, optionBox);
    parentIcon.appendChild(imgIcon);
    imgGroup.push(ImgPreviewBox, imgIcon);
    reader.onload = function (e) {
        function setSize(element, child) {
            var style = window.getComputedStyle(element);
            element.style.height = style.height;
            element.style.width = style.width;
            child.style.height = style.height;
            child.style.width = style.width;
            child.style.position = 'absolute';
        }
        if(process.includes('normal')) {
            var ImgPreview = new Image();
            ImgPreview.className = 'ImgPreview';
            previewTarget = ImgPreview;
            if (process.includes('colorMode')) {
                var color = process.match(/colorMode={([^}]*)}/)?.[1]
                color ? previewBoxTarget.setAttribute('color', color) : '';
                previewBoxTarget.classList.add('colorMode');
            }
            if (process.includes('dropShadow')) {
                var color = process.match(/dropShadow.*?color=['"]([^'"]+)['"]/)?.[1];
                previewTarget.setAttribute('dropShadowColor', color);
            } 
            ImgPreviewBox.appendChild(ImgPreview);
            ImgPreview.onload = ()=> {
                setSize(ImgPreviewBox, ImgPreview);
                dragOn(true, ImgPreviewBox);
                updateOptions();
                optionBox.classList.remove('hidden');
            };
            ImgPreview.src = e.target.result;
        }
        if(process.includes('potrace')) {
            var ImgPreview = document.createElement('div');
            ImgPreview.className = 'ImgPreview';
            previewTarget = ImgPreview;
            ImgPreviewBox.appendChild(ImgPreview);
            potrace(e.target.result, ImgPreview, ()=> {
                previewTarget.setAttribute('Threshold', 1);
                previewTarget.setAttribute('invert', 0);
                if (process.includes('color=')) {
                    var color = process.match(/color={([^}]*)}/)?.[1]
                    previewTarget.setAttribute('svg-fill', color);
                } 
                setSize(ImgPreviewBox, ImgPreview);
                dragOn(true, ImgPreviewBox);
                updateOptions();
                optionBox.classList.remove('hidden');
            });
        }
        imgIcon.src = e.target.result;
    };
    reader.readAsDataURL(file);
    input.value = '';
}

function createAddImgBox() {
    var boxes = document.querySelectorAll('.addImgBox');
    boxes.forEach((box, index) => {
        if (box.hasAttribute('tittle')) {
            var tittle = document.createElement('div');
            tittle.className = 'tittle';
            tittle.textContent = box.getAttribute('tittle');
            box.appendChild(tittle);
        }
        var input = document.createElement('input');
        input.className = 'hidden';
        input.id = `inputImg${index}`;
        input.type = 'file';
        input.accept = 'image/*';
        box.appendChild(input);
        Imgwrap = document.querySelectorAll('.ImgWrap');
        var imgOptionsBox = document.createElement('div');
        imgOptionsBox.className = 'imgOptionsBox hidden';
        if (box.hasAttribute('slider')) {
            if (box.getAttribute('slider').includes('0')) {
                var limit = null;
            } else {
                var limit = parseInt(box.getAttribute('slider'));
            }
            var addImgEmpty = document.createElement('label');
            addImgEmpty.className = 'addImage empty';
            addImgEmpty.htmlFor = `inputImg${index}`;
            box.appendChild(addImgEmpty);
            var imgIconBox = document.createElement('div');
            imgIconBox.className = 'imgIconBox hidden';
            box.appendChild(imgIconBox);
            var iconButtons = document.createElement('div');
            iconButtons.className = 'iconsButtons';
            imgIconBox.appendChild(iconButtons); 
            var addImg = document.createElement('label');
            addImg.className = 'addIcon';
            addImg.htmlFor = `inputImg${index}`;
            var deleteIcon = document.createElement('div');
            deleteIcon.className = 'deleteIcon';
            iconButtons.appendChild(addImg);
            iconButtons.appendChild(deleteIcon);
            var imgSlider = document.createElement('div');
            imgSlider.className = 'imgSlider slider'; 
            imgIconBox.appendChild(imgSlider);
            var idxChange = document.createElement('div');
            idxChange.className = 'idxChange';
            imgOptionsBox.appendChild(idxChange);
            var idxBefore = document.createElement('div');
            idxBefore.className = 'idxBefore btn';
            idxBefore.onclick = ()=> {
                if (iconTarget.previousElementSibling) {
                    imgSlider.insertBefore(iconTarget, iconTarget.previousElementSibling);
                    Imgwrap[index].insertBefore(previewBoxTarget, previewBoxTarget.previousElementSibling);
                }
            }
            var orderIcon = document.createElement('div');
            orderIcon.className = 'orderIcon';
            var idxAfter = document.createElement('div');
            idxAfter.className = 'idxAfter btn';
            idxAfter.onclick = ()=> {
                if (iconTarget.nextElementSibling) {
                    imgSlider.insertBefore(iconTarget.nextElementSibling, iconTarget);
                    Imgwrap[index].insertBefore(previewBoxTarget.nextElementSibling, previewBoxTarget);
                }
            }
            idxChange.appendChild(idxBefore);
            idxChange.appendChild(orderIcon);
            idxChange.appendChild(idxAfter);
            function IconCount() {
                if (imgSlider.childElementCount === 0) {
                    imgIconBox.classList.add('hidden');
                    addImgEmpty.classList.remove('hidden');
                } else {
                    imgIconBox.classList.remove('hidden');
                    addImgEmpty.classList.add('hidden');
                }
                if (limit) {
                    if (imgSlider.childElementCount < limit) {
                        iconButtons.classList.remove('full');
                    } else {
                        iconButtons.classList.add('full');
                    }
                }
            }
            function deleteImg() {
                if (iconTarget) {
                    imgGroup = imgGroup.filter(item => item !== previewBoxTarget);
                    imgGroup = imgGroup.filter(item => item !== iconTarget);
                    previewBoxTarget.remove();
                    iconTarget.remove();
                    previewBoxTarget = null;
                    iconTarget = null;
                    imgOptionsBox.classList.add('hidden');
                    dragOn(false);
                }
            }
            deleteIcon.onclick = ()=> { 
                deleteImg(); 
                IconCount();
            };
            input.addEventListener('input', ()=> {
                loadImage(input, Imgwrap[index], imgSlider, imgGroup, process, imgOptionsBox);
                IconCount();
            });
        }
        if (box.hasAttribute('grid')) {
            var att = box.getAttribute('grid');
            if (att.includes('qty')) {
                var n = att.match(/qty={([^}]*)}/)?.[1];
            }
            if (att.includes('grid')) {
                var grid = att.match(/grid={([^}]*)}/)?.[1];
            }
            var imgIconBox = document.createElement('div');
            imgIconBox.className = 'imgIconBox';
            var gridBox = document.createElement('div');
            gridBox.className = `gridIconsBox grid_${grid !== undefined ? grid : 1} display_1`;
            Imgwrap[index].classList.add(`grid_${grid !== undefined ? grid : 1}`);
            Imgwrap[index].classList.add('display_1');
            box.appendChild(imgIconBox);
            imgIconBox.appendChild(gridBox);
            var icons = [];
            for (let i = 0; i < n; i++) {
                var label = document.createElement('label');
                label.className = 'addImage';
                label.htmlFor = `inputImg${index}`;
                gridBox.appendChild(label);
                icons.push(label);
                imgGroup.push(label);
                var imgContainer = document.createElement('div');
                imgContainer.classList = 'imgContainer';
                Imgwrap[index].appendChild(imgContainer);
            }
            icons.forEach(e => {
                e.addEventListener('click', ()=> {
                    deselectIcon();
                    e.classList.add('selected');
                });
            });
            var replaceLabel = document.createElement('label');
            replaceLabel.className = 'replaceImgIcon box_1';
            replaceLabel.htmlFor = `inputImg${index}`;
            replaceLabel.textContent = 'Mudar imagem';
            imgOptionsBox.appendChild(replaceLabel);
            
            input.addEventListener('input', ()=> {
            let indexChild = null;
            let target = document.createElement('div');
            icons.forEach((e, i) => {
                if (e.classList.contains('selected')) {
                    indexChild = i;
                    gridBox.replaceChild(target, e);
                }
            });
            Imgwrap[index].children[indexChild].innerHTML = '';
            loadImage(input, Imgwrap[index].children[indexChild], target, imgGroup, process, imgOptionsBox);
            icons[indexChild] = iconTarget;
            gridBox.replaceChild(iconTarget, target);
            });
            if (att.includes('display')) {
                var dpyN = att.match(/display={([^}]*)}/)?.[1];
                var displayBox = document.createElement('div');
                displayBox.className = 'displayBox slider';
                box.appendChild(displayBox);
                var btnList = [];
                for (let i = 0; i < dpyN; i++) {
                    var btn = document.createElement('div');
                    btn.className = `btn grid_${grid !== undefined ? grid : 1} display_${i + 1}`;
                    displayBox.appendChild(btn);
                    btnList.push(btn);
                    for (let i = 0; i < n; i++) {
                        var div = document.createElement('div');
                        btn.appendChild(div);
                    }
                }
                btnList.forEach((e, i) => {
                    btnList[0].classList.add('selected');
                    e.addEventListener('click', ()=> {
                        deselectIcon();
                        btnList.forEach (e => {e.classList.remove('selected')});
                        var l = [gridBox, Imgwrap[index]];
                        l.forEach(e => {
                            e.classList.forEach(c => {
                                if (c.includes('display_')) {
                                    e.classList.remove(c);
                                    e.classList.add(`display_${i + 1}`);
                                }
                            });
                        });
                        Imgwrap[index].querySelectorAll('.ImgPreviewBox').forEach(e =>{
                            e.style.left = '';
                            e.style.top = '';
                        });
                        e.classList.add('selected');
                    });
                });
            }
        }
        var optionBtnBox = document.createElement('div');
        optionBtnBox.className = 'optionBtnBox';
        imgOptionsBox.appendChild(optionBtnBox);
        var optionsBox = document.createElement('div');
        optionsBox.className = 'optionsBox';
        imgOptionsBox.appendChild(optionsBox);
        var process = box.getAttribute('process');
        if (process.includes('potrace')) {
            const potraceBox = document.createElement('div');
            potraceBox.className = 'potraceBox';
            optionsBox.appendChild(potraceBox);
            createSwitchBox(potraceBox, 'potrace', 'upadatePotrace(false, 0)', 'upadatePotrace(false, 1)', 'invert');
            createInputRange(potraceBox, 'potrace', '0.5', '2', '0.1', '1', upadatePotrace, '', 'threshold', false);
            if (process.includes('color=')) {
                var value = process.match(/color={([^}]*)}/)?.[1];
                createJsColorBox(potraceBox, 'colorModeBox', ()=> previewTarget, '--color', value, 'svg-fill');
            } 
        }
        if (process.includes('normal')) {
            if (process.includes('colorMode')) {
                var value = process.match(/colorMode={([^}]*)}/)?.[1];
                if (value) {
                    const colorMode = document.createElement('div');
                    colorMode.className = 'colorModeBox';
                    optionsBox.appendChild(colorMode);
                    createJsColorBox(colorMode, 'colorModeBox', ()=> previewBoxTarget, '--color', value, 'color');
                }
            }
            if (process.includes('dropShadow')) {
                var color = process.match(/dropShadow.*?color=['"]([^'"]+)['"]/)?.[1];
                var value = process.match(/dropShadow.*?value=['"]([^'"]+)['"]/)?.[1];
                var min = process.match(/dropShadow.*?min=['"]([^'"]+)['"]/)?.[1];
                var max = process.match(/dropShadow.*?max=['"]([^'"]+)['"]/)?.[1];
                createChangeSizeBox(imgOptionsBox, 'dropShadowSize', ()=> previewTarget, 0.5, '--dropShadowSize', min, max);
                if (color) {
                    createJsColorBox(imgOptionsBox, 'dropShadowColor', ()=> previewTarget, '--dropShadowColor', color, 'dropShadowColor');
                }
            }
            var filterBox = document.createElement('div');
            filterBox.className = 'filterBox';
            optionsBox.appendChild(filterBox);
            const filterName = ['brightness', 'contrast', 'saturate'];
            for (let i = 0; i < filterName.length; i++) {
                createInputRange(filterBox, `${filterName[i]}Box`, '0', '2', '0.1', '1', (input)=>{
                    previewTarget.style.setProperty(`--${filterName[i]}`, input.value);
                    previewTarget.setAttribute(filterName[i], input.value);
                }, '', filterName[i]);
            }

        }
        Array.from(optionsBox.children).forEach((e, i) => {
            var btn = document.createElement('div')
            btn.className = `${e.className}Icon btn ${i == 0 ? 'selected':''}`;
            optionBtnBox.appendChild(btn);
            i == 0 ? '': e.classList.add('hidden');
            btn.onclick = ()=> {
                if (btn.classList.contains('selected')) {
                    btn.classList.remove('selected');
                    e.classList.add('hidden');
                } else {
                    Array.from(optionBtnBox.children).forEach(e=>e.classList.remove('selected'));
                    Array.from(optionsBox.children).forEach(e=>e.classList.add('hidden'));
                    btn.classList.add('selected');
                    e.classList.remove('hidden');
                }
            };
        });
        if (box.hasAttribute('colorMode')) {
            var colorMode = box.getAttribute('colorMode');
            var color = colorMode.match(/color={([^}]*)}/)?.[1];
            Imgwrap[index].classList.add('colorMode');
            if (colorMode.includes('switch')) {
                var switchBox = document.createElement('div');
                switchBox.className = 'switchDisplay box_1'
                box.appendChild(switchBox);
                function code1() {
                    Imgwrap[index].classList.add('colorMode');
                    switchBox.children[1].classList.remove('hidden');
                }
                function code2() {
                    Imgwrap[index].classList.remove('colorMode');
                    switchBox.children[1].classList.add('hidden');
                }
                createSwitchBox(switchBox, 'colorModeBox', code1, code2, '');
                createJsColorBox(switchBox, 'colorModeBox', ()=> Imgwrap[index], '--color', color, 'color');
            } else {
                createJsColorBox(box, 'colorModeBox box_1', ()=> Imgwrap[index], '--color', color, 'color');
            }
        }
        imgIconBox.appendChild(imgOptionsBox);
    });
}
document.querySelector('.addImgBox') && createAddImgBox();

function createOptionBox() {
    var boxes = document.querySelectorAll('.addOptionsBox');
    boxes.forEach((box, index) => {
        if (box.hasAttribute('tittle')) {
            var tittle = document.createElement('div');
            tittle.className = 'tittle';
            tittle.textContent = box.getAttribute('tittle');
            box.appendChild(tittle);
        }
        if (box.hasAttribute('colorBox')) {
            var colorBox = box.getAttribute('colorBox');
            var className = colorBox.match(/class={([^}]*)}/)?.[1];
            var color = colorBox.match(/color={([^}]*)}/)?.[1];
            var att = colorBox.match(/att={([^}]*)}/)?.[1];
            createJsColorBox(box, `${className} box_1`, ()=> ProductEdit, att ? att: '--color', color, false);
        }
        if (box.hasAttribute('optionBox')) {
            var optionBox = box.getAttribute('optionBox');
            var className = optionBox.match(/class={([^}]*)}/)?.[1];
            var divBox = document.createElement('div');
            divBox.className = className;
            box.appendChild(divBox);
            var qty = optionBox.match(/qty={([^}]*)}/)?.[1];
            var att = optionBox.match(/att={([^}]*)}/)?.[1];
            for (let i = 0; i < qty; i++) {
                var btn = document.createElement('div');
                btn.style.setProperty(att, `var(${att}-${i+1})`);
                btn.onclick = ()=> {
                    ProductEdit.style.setProperty(att, `var(${att}-${i+1})`);
                };
                divBox.appendChild(btn);
            }
        }
    });
}
document.querySelector('.addOptionsBox') && createOptionBox();

function createAlert() {
    var alertBox = document.createElement('div');
    alertBox.classList.add('alertBox', 'hidden');
    var alertDiv = document.createElement('div');
    var text = document.createElement('span');
    var button = document.createElement('button');
    button.textContent = 'Ok';
    button.addEventListener('click', ()=> {
        alertBox.classList.add('hidden');
    });
    alertDiv.appendChild(text);
    alertDiv.appendChild(button);
    alertBox.appendChild(alertDiv);
    document.body.appendChild(alertBox);
    window.callAlert = function(message) {
        text.textContent = message;
        alertBox.classList.remove('hidden');
    };
}
createAlert();

if (document.querySelector('.JsColorBox')) {
    var boxes = document.querySelectorAll('.JsColorBox');
    if (boxes.length > 1) {
        var copyAll = [];
        var pasteAll = [];
        boxes.forEach((box) => {
            box.classList.add('grid');
            var pasteBox = document.createElement('div');
            var pasteText = document.createElement('div');
            var copyBox = document.createElement('div');
            var copyText = document.createElement('div');
            copyAll.push(copyBox);
            pasteAll.push(pasteBox);
            pasteText.textContent = 'Colar';
            copyText.textContent = 'Copiar';
            copyBox.appendChild(copyText);
            pasteBox.appendChild(pasteText);
            box.insertBefore(pasteBox, box.firstChild);
            box.appendChild(copyBox);
        });
        copyAll.forEach((element) => {
            element.addEventListener('click', function() {
                var color = this.style.background;
                pasteAll.forEach((pasteBox) => {
                    pasteBox.style.background = color;
                });
            });
        });
        pasteAll.forEach((element) => {
            element.addEventListener('click', function() {
                var color = this.style.background;
                this.nextElementSibling.style.background = color;
                this.nextElementSibling.setAttribute('data-current-color', color);
            });
        });
    }
}

var Preview = document.querySelector('.Preview');
function resize() {
    document.body.style.setProperty('--boxSize', `${ProductBox.offsetWidth}px`);
    if (typeof resizeBefore === 'function') {
        resizeBefore();
    }
}

window.onload = function() {
    resize();
    window.addEventListener('resize', resize);
}