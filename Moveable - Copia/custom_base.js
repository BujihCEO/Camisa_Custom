let isInteracting = false;
function btnHold(element, action) {
    if (element) {
        let timer = null;
        let touchTimer = null;

        function startMoving() {
            if (element) {
                function ContinueAction() {
                    action();
                    if (isInteracting) {
                        timer = setTimeout(ContinueAction, 100);
                    }
                }
                if (isInteracting) {
                    action();
                    timer = setTimeout(ContinueAction, 400);
                }
            }
        }

        function stopMoving() {
            isInteracting = false;
            clearTimeout(timer);
            clearTimeout(touchTimer);
        }

        element.addEventListener('mousedown', () => {
            isInteracting = true;
            startMoving();
        });

        element.addEventListener('touchstart', () => {
            isInteracting = true;
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

function textScaleX(target) {
    value = target.parentNode.offsetWidth / target.offsetWidth; 
    target.style.transform = `scaleX(${value})`;
}

function inputText(input, target, maxLength, XYlimited, scaleX) {
    if (maxLength) {
        input.value = input.value.slice(0, maxLength);
    }
    target.textContent = input.value;
    if (XYlimited) {
        if (target.offsetHeight > target.parentNode.offsetHeight || 
        target.offsetWidth > target.parentNode.offsetWidth) {
            input.value = input.value.slice(0, -1);
            target.textContent = input.value;
            var message = 'Texto grande demais. Diminua o tamanho da fonte e tente novamente.';
            document.querySelector('.alertBox span').textContent = message;
            document.querySelector('.alertBox').classList.remove('hidden');
        }
    }
    if (scaleX) {
        if (target.offsetWidth > target.parentNode.offsetWidth) {
            textScaleX(target);
        } else {
            target.style.transform = '';
        }
    }
}

function changeFontSize(target, value, signal, XYlimited, scaleX) {
    return function() {
        var actualSize = parseFloat(window.getComputedStyle(target).fontSize);
        if (signal == true) {
            target.style.fontSize = (actualSize + parseFloat(value)) + 'px';
        } else {
            target.style.fontSize = (actualSize - parseFloat(value)) + 'px';
        }
        if (XYlimited) {
            if (target.offsetHeight > target.parentNode.offsetHeight || 
            target.offsetWidth > target.parentNode.offsetWidth) {
                target.style.fontSize = actualSize + 'px';
                isInteracting = false;
                var message = 'Texto grande demais. Diminua o tamanho da fonte e tente novamente.';
                document.querySelector('.alertBox span').textContent = message;
                document.querySelector('.alertBox').classList.remove('hidden');
            }
        }
        if (scaleX) {
            if (target.offsetWidth > target.parentNode.offsetWidth) {
                textScaleX(target);
            } else {
                target.style.transform = '';
            }
        }
    }
}

function createFontSizeBox(parent, target, value, XYlimited, scaleX) {
    var box = document.createElement('div');
    box.className = 'fontSizeBox';
    parent.appendChild(box);
    var plus = document.createElement('div');
    plus.className = 'plusIcon btn';
    btnHold(plus, changeFontSize(target, value, true, XYlimited, scaleX));
    var less = document.createElement('div');
    less.className = 'lessIcon btn';
    btnHold(less, changeFontSize(target, value, false, XYlimited, scaleX));
    box.appendChild(plus);
    box.appendChild(less);
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
        target.classList.add(`index${index}`);
        var input = document.createElement('input');
        input.className = `inputText index${index}`;
        input.setAttribute('type', type);
        input.setAttribute('placeholder', 'Digite aqui...');
        input.addEventListener('input', function() {
            inputText(input, target, maxLength, XYlimited, scaleX);
            if (element.hasAttribute('addFunction')) {
                var addFunctions = element.getAttribute('addFunction').split(',').map(func => func.trim());
                addFunctions.forEach(addFunctionName => {
                    var addFunction = window[addFunctionName];
                    addFunction();
                });
            }
        });
        element.appendChild(input);
        if (element.hasAttribute('fontSize')) {
            var value = element.getAttribute('font-size-value');
            createFontSizeBox(element, target, value, XYlimited, scaleX);
        }
    });
}

createInputTextBox();


function createFontSizeBox1() {
    var boxes = document.querySelectorAll('.fontSizeBox');
    boxes.forEach((element) => {
        var value = element.getAttribute('data-value');
        var XYlimited = element.getAttribute('data-XYlimited');
        var scaleX = element.getAttribute('data-scaleX');
        var parents = document.querySelectorAll(`.${element.parentNode.classList[0]}`);
        var index = Array.from(parents).indexOf(element.parentNode);
        var textReplace = document.querySelectorAll('.textReplace');
        var target = textReplace[index];
        var plus = document.createElement('div');
        plus.className = 'plusIcon btn';
        btnHold(plus, changeFontSize(target, value, true, XYlimited, scaleX));
        var less = document.createElement('div');
        less.className = 'lessIcon btn';
        btnHold(less, changeFontSize(target, value, false, XYlimited, scaleX));
        element.appendChild(plus);
        element.appendChild(less);
    });
}

var ImgSelector = document.querySelector('.ImgSelector');
var ImgSizeList = ['T', 'B', 'L', 'R', 'T-L', 'T-R', 'B-L', 'B-R'];
for (let i = 0; i < 8; i++) {
    var div = document.createElement('div');
    div.classList.add('imgSize');
    div.classList.add(ImgSizeList[i]);
    ImgSelector.appendChild(div);
}

const pinchElement = document.querySelector('.ProductBox');
const MoveExmp = document.querySelector('.MoveExmp');

let initialDistance = 0;
let initialScale = 1;

pinchElement.addEventListener('touchstart', (e) => {
    const touches = e.touches;
    if (touches.length === 2) {
        initialDistance = getDistance(touches[0], touches[1]);
        initialScale = pinchElement.style.transform ? parseFloat(pinchElement.style.transform.split('(')[1]) : 1;
    }
});

pinchElement.addEventListener('touchmove', (e) => {
    const touches = e.touches;
    if (touches.length === 2 && !isElementClicked(e.target, ['ImgSelector', 'ImgPreview'])) {
        e.preventDefault();
        MoveExmp.classList.add('hidden');
        const currentDistance = getDistance(touches[0], touches[1]);
        const scale = Math.min(3, Math.max(1, initialScale * (currentDistance / initialDistance)));
        pinchElement.style.transform = `scale(${scale})`;
        imgSizeAll.forEach(element => {
            element.style.transform = `scale(${1 / scale})`;
        });
        ImgSelector.style.boxShadow = `0 0 0 ${1 / scale}px blue`;
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

pinchElement.addEventListener('mouseenter', () => {
    isHovered = true;
});

pinchElement.addEventListener('mouseleave', () => {
    isHovered = false;
});

document.addEventListener('wheel', (e) => {
    if (isHovered) {
        e.preventDefault();
        MoveExmp.classList.add('hidden');
        const direction = e.deltaY > 0 ? -1 : 1;
        scale = Math.min(3, Math.max(1, scale + direction * 0.1));
        pinchElement.style.transform = `scale(${scale})`;
        imgSizeAll.forEach(element => {
            element.style.transform = `scale(${1 / scale})`;
        })
        ImgSelector.style.boxShadow = `0 0 0 ${1 / scale}px blue`;
        PreviewScale = scale;
    }
}, { passive: false });

pinchElement.addEventListener('mousedown', (e) => {
    if (isHovered && !isElementClicked(e.target, ['ImgSelector', 'ImgPreview'])) {
        MoveExmp.classList.add('hidden');
        onClick = true;
        isDragging = true;
        initialX = e.clientX - offsetX;
        initialY = e.clientY - offsetY;
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                onClick = false;
                size = pinchElement.offsetHeight / 2;
                offsetX = Math.min(size, Math.max(-size, e.clientX - initialX));
                offsetY = Math.min(size, Math.max(-size, e.clientY - initialY));
                pinchElement.style.translate = `${offsetX}px ${offsetY}px`;
            }
        });
        pinchElement.addEventListener('mouseup', () => {
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

pinchElement.addEventListener('touchstart', function (event) {
    if (!isElementClicked(event.target, ['ImgSelector', 'ImgPreviewBox'])) {
        onClick = true;
        isDragging = true;
        initialX = event.touches[0].clientX - offsetX;
        initialY = event.touches[0].clientY - offsetY;
        pinchElement.addEventListener('touchmove', (e) => {
            const touches = e.touches;
            if (isDragging) {
                onClick = false;
                e.preventDefault();
                MoveExmp.classList.add('hidden');
                size = pinchElement.offsetHeight / 2;
                offsetX = Math.min(size, Math.max(-size, touches[0].clientX - initialX));
                offsetY = Math.min(size, Math.max(-size, touches[0].clientY - initialY));
                pinchElement.style.translate = `${offsetX}px ${offsetY}px`;
            }
        });
        pinchElement.addEventListener('touchend', () => {
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

function createImgSliderBox() {
    var div = document.querySelector('.imgSliderBox');
    var html = `<label class="addImage empty" for="InputImage"></label><div class="imgIconBox"><div class="iconsButtons"><label class="addImage" for="InputImage"><div class="Icon-1-1 imageAdd"></div></label><div class="deletImg" onclick="deleteImg()"><div class="Icon-1-1 delete"></div></div></div><div class="imgSlider"></div><div class="idxCtrl hidden"><div class="idxCtrl_before"></div><div class="idxCtrl_after"></div></div><input class="InputImage" id="InputImage" type="file" accept="image/*" onchange="loadImage(this)" style="display: none;"></div>`
    div.innerHTML = html;
}

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
}
createAlert();