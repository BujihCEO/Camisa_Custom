const Tshirt = document.querySelector('.Tshirt');
const Preview = document.querySelector('.Preview');
var PreviewScale = 1;
var ImgWrap = document.querySelector('.ImgWrap');
var ImgPreviewBox = null;
var ImgPreview = null;
var imgIcon = null;
var imgSlider = document.querySelector('.imgSlider');
var idxCtrl = document.querySelector('.idxCtrl');

function loadImage(input) {
    if (imgIcon) {
        imgIcon.classList.remove('selected');
        ImgPreviewBox.classList.remove('selected');
    }
    ImgPreviewBox = document.createElement('div');
    ImgPreviewBox.className = 'ImgPreviewBox selected';
    ImgPreview = new Image();
    ImgPreview.className = 'ImgPreview';
    ImgPreviewBox.onclick = selectIcon;
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
            idxCtrl_(true);
        }
        ImgPreview.src = e.target.result;
        imgIcon = new Image();
        imgIcon.src = e.target.result;
        imgIcon.classList = 'imgIcon selected';
        imgIcon.onclick = selectIcon;
        imgSlider.appendChild(imgIcon);
        IconCount();
    };
    reader.readAsDataURL(file);
    input.value = '';
}

function selectIcon() {
    var Box = document.querySelectorAll('.ImgPreviewBox');
    var Icons = document.querySelectorAll('.imgIcon');
    if (this.classList.contains('selected')) {
        Icons.forEach((icon, index) => {
            icon.classList.remove('selected');
            Box[index].classList.remove('selected');
        });
        imgIcon = null;
        ImgPreviewBox = null;
        ImgPreview = null;
        dragOn();
        idxCtrl_(false);
    } else {
        Icons.forEach((icon, index) => {
            icon.classList.remove('selected');
            Box[index].classList.remove('selected');
        });
        var index = Array.from(this.parentNode.children).indexOf(this);
        imgIcon = Icons[index];
        ImgPreviewBox = Box[index];
        ImgPreview = ImgPreviewBox.firstElementChild;
        imgIcon.classList.add('selected');
        dragOn();
        idxCtrl_(true);
    }
}

function deselectIcon() {
    var Box = document.querySelectorAll('.ImgPreviewBox');
    var Icons = document.querySelectorAll('.imgIcon');
    Icons.forEach((icon, index) => {
        icon.classList.remove('selected');
        Box[index].classList.remove('selected');
    });
    imgIcon = null;
    ImgPreviewBox = null;
    ImgPreview = null;
    dragOn();
    idxCtrl_(false);
}

function idxCtrl_(verify) {
    if (verify) {
        idxCtrl.classList.remove('hidden');
    } else {
        idxCtrl.classList.add('hidden');
    }
}

Array.from(idxCtrl.children).forEach(function(btn, index) {
    btn.addEventListener('click', function() {
        if (index === 0) {
            if (imgIcon.previousElementSibling) {
                imgIcon.parentNode.insertBefore(imgIcon, imgIcon.previousElementSibling);
                ImgPreviewBox.parentNode.insertBefore(ImgPreviewBox, ImgPreviewBox.previousElementSibling);
            }
        } else {
            if (imgIcon.nextElementSibling) {
                imgIcon.parentNode.insertBefore(imgIcon.nextElementSibling, imgIcon);
                ImgPreviewBox.parentNode.insertBefore(ImgPreviewBox.nextElementSibling, ImgPreviewBox);
            }
        }
    })
});

var imgIconBox = document.querySelector('.imgIconBox');
function deleteImg() {
    if (imgIcon) {
        imgIcon.remove();
        ImgPreviewBox.remove();
        imgIcon = null;
        ImgPreviewBox = null;
        IconCount();
        dragOn();
    }
}

var addImgEmpty = document.querySelector('.addImage.empty');
function IconCount() {
    if (imgSlider.childElementCount === 0) {
        imgIconBox.style.display = '';
        addImgEmpty.style.display = '';
    } else {
        imgIconBox.style.display = 'flex';
        addImgEmpty.style.display = 'none';
    }
}

var namePlace = document.querySelector('.name');
var iconsBox = document.querySelector('.iconsBox');
var nameBox = document.querySelector('.nameBox');

function resize() {
    var value = Tshirt.offsetWidth / window.innerWidth;
    Tshirt.style.setProperty('--resize', value);
    nameBox.style.fontSize = nameBox.offsetHeight + 'px';
}
resize();

function creatIcons() {
    iconsBox.innerHTML = '';
    var value = Math.floor(iconsBox.offsetWidth / iconsBox.offsetHeight);
    for (let i = 0; i < value; i++) {
        var div = document.createElement('div');
        div.classList.add('iconName');
        iconsBox.appendChild(div);
    }
}
creatIcons();

window.addEventListener('resize', resize, creatIcons);

var inputText = document.querySelector('.inputText');
inputText.addEventListener('input', ()=> {
    namePlace.textContent = inputText.value;
    creatIcons();
});

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
    } else {
        ImgSelector.classList.remove('selected');
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
        document.onmousemove = function (e) {
            movimentY = e.clientY - startY;
            movimentX = e.clientX - startX;
            onMoviment();
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
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
            touch = event.touches[0];
            movimentY = touch.clientY - startY;
            movimentX = touch.clientX - startX;
            onMoviment();
        }
        element.addEventListener('touchmove', touchMove);
        element.addEventListener('touchend', function () {
            element.removeEventListener('touchmove', touchMove);
        });
    });
});

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
  