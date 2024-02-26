const Tshirt = document.querySelector('.Tshirt');
const Preview = document.querySelector('.Preview');
var PreviewScale = 1;
var ImgWrap = document.querySelector('.ImgWrap');
var ImgWrapAll = document.querySelectorAll('.ImgWrap');
var ImgPreviewBox = null;
var ImgPreview = null;
var imgIcon = null;
var idxCtrl = document.querySelector('.idxCtrl');
var addImage = document.querySelector('.addImage');
var addImageAll = document.querySelectorAll('.addImage');
var changeImg = document.querySelector('.changeImg');

const BtnCustomAll = document.querySelectorAll('.BtnCustom');
const CustomContainerAll = document.querySelectorAll('.CustomContainer');
BtnCustomAll.forEach((element, index) => {
    element.addEventListener('click', () => {
        BtnCustomAll.forEach((element, index) => {
            element.classList.remove('selected');
            CustomContainerAll[index].classList.add('hidden');
        });
        element.classList.add('selected');
        CustomContainerAll[index].classList.remove('hidden');
    });
});

addImageAll.forEach((element, index) => {
    element.addEventListener('click', ()=> {
        ImgWrap = ImgWrapAll[index];
        addImage = element;
    });
});

function loadImage(input) {
    if (imgIcon) {
        addImageAll.forEach(element => {
            element.classList.remove('selected');
        });
    }
    addImage.innerHTML = '';
    ImgWrap.innerHTML = '';
    addImage.removeAttribute('for');
    addImage.classList.add('selected');
    ImgPreviewBox = document.createElement('div');
    ImgPreviewBox.className = 'ImgPreviewBox';
    ImgPreview = new Image();
    ImgPreview.className = 'ImgPreview';
    ImgPreviewBox.appendChild(ImgPreview);
    ImgWrap.appendChild(ImgPreviewBox);
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        ImgPreview.onload = function() {
            ImgPreviewBox.style.height = this.offsetHeight + 'px';
            ImgPreviewBox.style.width = this.offsetWidth + 'px';
            ImgPreview.style.height = this.offsetHeight + 'px';
            ImgPreview.style.width = this.offsetWidth + 'px';
            ImgPreview.style.position = 'absolute';
            dragOn();
        }
        ImgPreview.src = e.target.result;
        imgIcon = new Image();
        imgIcon.src = e.target.result;
        imgIcon.classList = 'imgIcon';
        imgIcon.onclick = selectIcon;
        ImgPreviewBox.onclick = selectIcon;
        addImage.appendChild(imgIcon);
    };
    reader.readAsDataURL(file);
    input.value = '';
}

function selectIcon() {
    if (this.parentNode.classList.contains('selected')) {
        addImageAll.forEach((element) => {
            element.classList.remove('selected');
        });
        imgIcon = null;
        ImgPreviewBox = null;
        ImgPreview = null;
        addImage = null;
        dragOn();
    } else {
        addImageAll.forEach((element) => {
            element.classList.remove('selected');
        });
        var group = document.getElementsByClassName(this.parentNode.classList[0]);
        var index = Array.from(group).indexOf(this.parentNode);
        ImgWrap = ImgWrapAll[index];
        ImgPreviewBox = ImgWrapAll[index].firstElementChild;
        ImgPreview = ImgPreviewBox.firstElementChild;
        addImage = addImageAll[index];
        addImage.classList.add('selected');
        imgIcon = addImageAll[index].firstElementChild;
        dragOn();
    }

}

function deselectIcon() {
    addImageAll.forEach((element) => {
        element.classList.remove('selected');
    });
    imgIcon = null;
    ImgPreviewBox = null;
    ImgPreview = null;
    addImage = null;
    dragOn();
}

var ImgSelector = document.querySelector('.ImgSelector');
var ImgSizeList = ['T', 'B', 'L', 'R', 'T-L', 'T-R', 'B-L', 'B-R'];
for (let i = 0; i < 8; i++) {
    var div = document.createElement('div');
    div.classList.add('imgSize');
    div.classList.add(ImgSizeList[i]);
    ImgSelector.appendChild(div);
}

function dragOn() {
    if (imgIcon) {
        ImgSelector.style = '';
        ImgSelector.classList.add('selected');
        ImgSelector.style.height = ImgPreviewBox.clientHeight + 'px';
        ImgSelector.style.width = ImgPreviewBox.clientWidth + 'px';
        const Target = ImgPreviewBox.getBoundingClientRect();
        const Selector = ImgSelector.getBoundingClientRect();
        const X = (Target.left - Selector.left) / PreviewScale;
        const Y = (Target.top - Selector.top) / PreviewScale;
        ImgSelector.style.left = X + 'px';
        ImgSelector.style.top = Y + 'px';
        addImage.appendChild(changeImg);
        changeImg.classList.remove('hidden');
    } else {
        ImgSelector.classList.remove('selected');
        changeImg.remove();
        changeImg.classList.add('hidden');
    }
}

var ImgDragMove = document.querySelector('.ImgDragMove');
ImgDragMove.addEventListener('mousedown', function (event) {
    if (ImgSelector.classList.contains('selected')) {
        startY = event.clientY;
        startX = event.clientX;
        var currentTop = ImgPreviewBox.offsetTop * PreviewScale;
        var currentLeft = ImgPreviewBox.offsetLeft * PreviewScale;
        var dragCurrentTop = ImgSelector.offsetTop * PreviewScale;
        var dragCurrentLeft = ImgSelector.offsetLeft * PreviewScale;
        ImgWrap.classList.add('border');
        document.onmousemove = function (e) {
            var movimentY = e.clientY - startY;
            var movimentX = e.clientX - startX;
            ImgPreviewBox.style.top = ((movimentY + currentTop) / PreviewScale) + 'px';
            ImgPreviewBox.style.left = ((movimentX + currentLeft) / PreviewScale) + 'px';
            ImgSelector.style.top = ((movimentY + dragCurrentTop) / PreviewScale) + 'px';
            ImgSelector.style.left = ((movimentX + dragCurrentLeft) / PreviewScale) + 'px';
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            ImgWrap.classList.remove('border');
        };
        ImgDragMove.ondragstart = function () {
            return false;
        };
    }
});
ImgDragMove.addEventListener('touchstart', function (event) {
    var touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    var currentTop = ImgPreviewBox.offsetTop * PreviewScale;
    var currentLeft = ImgPreviewBox.offsetLeft * PreviewScale;
    var dragCurrentTop = ImgSelector.offsetTop * PreviewScale;
    var dragCurrentLeft = ImgSelector.offsetLeft * PreviewScale;
    ImgWrap.classList.add('border');
    event.preventDefault();
    function TouchMove(event) {
        var touch = event.touches[0];
        var movimentX = touch.clientX - startX;
        var movimentY = touch.clientY - startY;
        ImgPreviewBox.style.top = ((movimentY + currentTop) / PreviewScale) + 'px';
        ImgPreviewBox.style.left = ((movimentX + currentLeft) / PreviewScale) + 'px';
        ImgSelector.style.top = ((movimentY + dragCurrentTop) / PreviewScale) + 'px';
        ImgSelector.style.left = ((movimentX + dragCurrentLeft) / PreviewScale) + 'px';
        event.preventDefault();
    }
    ImgDragMove.addEventListener('touchmove', TouchMove);
    ImgDragMove.addEventListener('touchend', function () {
        ImgDragMove.removeEventListener('touchmove', TouchMove);
        ImgWrap.classList.remove('border');
    });
});

var imgSizeAll = document.querySelectorAll('.imgSize');
imgSizeAll.forEach((element) => {
    function startTouch() {
        currentHeight = ImgPreviewBox.clientHeight * PreviewScale;
        currentWidth = ImgPreviewBox.clientWidth * PreviewScale;
        currentTop = ImgPreviewBox.offsetTop * PreviewScale;
        currentLeft = ImgPreviewBox.offsetLeft * PreviewScale;
        imgHeight = ImgPreview.clientHeight * PreviewScale;
        imgWidth = ImgPreview.clientWidth * PreviewScale;
        imgTop = ImgPreview.offsetTop * PreviewScale;
        imgLeft = ImgPreview.offsetLeft * PreviewScale;
        DragCurrentTop = ImgSelector.offsetTop * PreviewScale;
        DragCurrentLeft = ImgSelector.offsetLeft * PreviewScale;
    }
    function onMoviment() {
        function applyStyles() {
            if (verify) {
                ImgPreviewBox.style.height = Vheight / PreviewScale + 'px';
                ImgPreviewBox.style.width = Vwidth / PreviewScale + 'px';
                ImgPreviewBox.style.top = ((Vtop + currentTop) / PreviewScale) + 'px';
                ImgPreviewBox.style.left = ((Vleft + currentLeft) / PreviewScale) + 'px';
            
                ImgPreview.style.height = Cheight / PreviewScale + 'px';
                ImgPreview.style.width = Cwidth / PreviewScale + 'px';
                ImgPreview.style.top = Ctop / PreviewScale + 'px';
                ImgPreview.style.left = Cleft / PreviewScale + 'px';
            
                ImgSelector.style.height = ImgPreviewBox.clientHeight + 'px';
                ImgSelector.style.width = ImgPreviewBox.clientWidth + 'px';
                ImgSelector.style.top = ((Vtop + DragCurrentTop) / PreviewScale) + 'px';
                ImgSelector.style.left = ((Vleft + DragCurrentLeft) / PreviewScale) + 'px';
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
            verify = Vheight / PreviewScale <= ImgPreview.clientHeight + ImgPreview.offsetTop;
        }
        if (element.classList.contains('L')) {
            Vheight = currentHeight; Vwidth = -movimentX + currentWidth; Vtop = 0; Vleft = movimentX;
            Cheight = imgHeight; Cwidth = imgWidth; Ctop = imgTop; Cleft = -movimentX + imgLeft;
            verify = Cleft / PreviewScale <= 0;
        }
        if (element.classList.contains('R')) {
            Vheight = currentHeight; Vwidth = movimentX + currentWidth; Vtop = 0; Vleft = 0;
            Cheight = imgHeight; Cwidth = imgWidth; Ctop = imgTop; Cleft = imgLeft;
            verify = Vwidth / PreviewScale <= ImgPreview.clientWidth + ImgPreview.offsetLeft;
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
        ImgWrap.classList.add('border');
        document.onmousemove = function (e) {
            movimentY = e.clientY - startY;
            movimentX = e.clientX - startX;
            onMoviment();
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            ImgWrap.classList.remove('border');
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
        ImgWrap.classList.add('border');
        function touchMove(event) {
            touch = event.touches[0];
            movimentY = touch.clientY - startY;
            movimentX = touch.clientX - startX;
            onMoviment();
        }
        element.addEventListener('touchmove', touchMove);
        element.addEventListener('touchend', function () {
            element.removeEventListener('touchmove', touchMove);
            ImgWrap.classList.remove('border');
        });
    });
});

jscolor.presets.default = {
    width:250, height:165, closeButton:true, closeText:'', sliderSize:20
};

function updateJSColor(picker, selector) {
    document.querySelector(selector).style.background = picker.toBackground();
}

function InputJsColor(InputJsColor, getSelectedElement, Attribute, update) {
    InputJsColor.addEventListener('input', function() {
        NewValue = InputJsColor.value;
        if (getSelectedElement){
            const SelectedElement = getSelectedElement();
            if (Attribute) {
                SelectedElement.setAttribute(Attribute, NewValue);
            }
        }
        update(NewValue);
    });
}

const inputGridColor = document.querySelector('.inputGridColor');
const GridImg = document.querySelector('.GridImg');

function gridImgColor(value) {
    GridImg.style.setProperty('--color', value);
}

InputJsColor(inputGridColor, ()=> GridImg, false, gridImgColor);

var TextWrap = document.querySelector('.TextWrap');
var textPreviewAll = document.querySelectorAll('.textPreview');
var inputText = document.querySelector('.inputText');

function textScaleX() {
    var scale = TextWrap.offsetWidth / textPreviewAll[0].offsetWidth;
    if (scale < 1) {
        textPreviewAll.forEach(element => {
            element.style.transform = `scaleX(${scale})`;
        });
    }
}

inputText.addEventListener('input', ()=> {
    textPreviewAll.forEach(element => {
        element.textContent = inputText.value;
    });
    textScaleX();
});

const inputTextColor_1 = document.querySelector('.inputTextColor_1');
const text_1 = document.querySelector('.textPreview:nth-child(1)');
function upColorText_1(value) {
    text_1.style.color = value;
}
InputJsColor(inputTextColor_1, ()=> text_1, false, upColorText_1);

const inputTextColor_2 = document.querySelector('.inputTextColor_2');
const text_2 = document.querySelector('.textPreview:nth-child(5)');
function upColorText_2(value) {
    text_2.style.color = value;
}
InputJsColor(inputTextColor_2, ()=> text_2, false, upColorText_2);

function resize() {
    var value = Tshirt.offsetWidth / window.innerWidth;
    Tshirt.style.setProperty('--resize', value);
}
resize();

window.addEventListener('resize', resize);

const pinchElement = document.querySelector('.Tshirt');
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
    if (!isElementClicked(event.target, ['ImgSelector', 'ImgPreview'])) {
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