
const Preview = document.querySelector('.Preview');
const Pr_Img = document.querySelector('.Pr_Img');
const imageInput = document.querySelector('.imageInput');
const ImgSelector = document.querySelector('.ImgSelector');
const ImgDragMove = document.querySelector('.ImgDragMove');
const ImgSizeControl = document.querySelector('.ImgSizeControl');
const ImgCutBtn = document.querySelector('.ImgCutBtn');
let image = null;
let imgWrap = null;

imageInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        image = new Image();
        image.className = 'ImagePreview';
        imgWrap = document.createElement('div');
        imgWrap.className = 'imgWrap';
        imgWrap.appendChild(image);
        Pr_Img.appendChild(imgWrap);    
        reader.onload = function (e) {
            var imageSrc = e.target.result;
            image.onload = function() {
                imgWrap.style.bottom = (Preview.offsetHeight - imgWrap.offsetHeight) / 2;
                imgWrap.style.left = (Preview.offsetWidth - imgWrap.offsetWidth) / 2;
                image.style.width = imgWrap.offsetWidth;
                ImgSelector.style.left = imgWrap.offsetLeft;
                ImgSelector.style.bottom = imgWrap.offsetTop;
                ImgSelector.style.height = imgWrap.offsetHeight;
                ImgSelector.style.width = imgWrap.offsetWidth;
                ImgSelector.classList.add('selected');
                image.classList.add('onDrag');
            };
            image.src = imageSrc;
        };
        reader.readAsDataURL(this.files[0]);
        this.value = '';
    }
});

var startX, startY, offsetX, offsetY;
var PreviewScale = 1;
var TouchMoveGroup = [ImgDragMove];

TouchMoveGroup.forEach((element) => {
    element.addEventListener('mousedown', function (event) {
        if (imgWrap) {
            startY = event.clientY;
            startX = event.clientX;
            var currentBottom = parseFloat(window.getComputedStyle(imgWrap).bottom) * PreviewScale;
            var currentLeft = imgWrap.offsetLeft * PreviewScale;
            var border = parseFloat(window.getComputedStyle(ImgSelector).border);
            document.onmousemove = function (e) {
                var movimentY = e.clientY - startY;
                var movimentX = e.clientX - startX;
                imgWrap.style.bottom = ((-movimentY + currentBottom) / PreviewScale) + 'px';
                imgWrap.style.left = ((movimentX + currentLeft) / PreviewScale) + 'px';
                var bottom = parseFloat(window.getComputedStyle(imgWrap).bottom);
                var left = parseFloat(window.getComputedStyle(imgWrap).left);
                ImgSelector.style.bottom = (bottom - border) +'px';
                ImgSelector.style.left = (left - border) +'px';
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            };
            element.ondragstart = function () {
                return false;
            };
        }
    });
    
    element.addEventListener('touchstart', function (event) {
        if (imgWrap) {
            var touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            var currentBottom = parseFloat(window.getComputedStyle(imgWrap).bottom) * PreviewScale;
            var currentLeft = imgWrap.offsetLeft * PreviewScale;
            var border = parseFloat(window.getComputedStyle(ImgSelector).border);
            event.preventDefault();
            function TouchMove(event) {
                var touch = event.touches[0];
                var movimentX = touch.clientX - startX;
                var movimentY = touch.clientY - startY;
                imgWrap.style.bottom = ((-movimentY + currentBottom) / PreviewScale) + 'px';
                imgWrap.style.left = ((movimentX + currentLeft) / PreviewScale) + 'px';
                var bottom = parseFloat(window.getComputedStyle(imgWrap).bottom);
                var left = parseFloat(window.getComputedStyle(imgWrap).left);
                ImgSelector.style.bottom = (bottom - border) +'px';
                ImgSelector.style.left = (left - border) +'px';
                event.preventDefault();
            }
            element.addEventListener('touchmove', TouchMove);
            element.addEventListener('touchend', function () {
                element.removeEventListener('touchmove', TouchMove);
            });
        }
    });
});

ImgSizeControl.addEventListener('mousedown', function (event) {
    if (imgWrap) {
        startY = event.clientY;
        var currentHeight = imgWrap.offsetHeight * PreviewScale;
        var currentWidth = imgWrap.offsetWidth * PreviewScale;
        var Aspect = currentWidth / currentHeight;
        document.onmousemove = function (e) {
            var moviment = e.clientY - startY;
            var newHeight = ((-moviment + currentHeight) / PreviewScale);
            var newWidth = ((-moviment * Aspect) + currentWidth) / PreviewScale;
            imgWrap.style.height = newHeight;
            imgWrap.style.width = newWidth;
            image.style.width = newWidth;
            ImgSelector.style.height = imgWrap.offsetHeight;
            ImgSelector.style.width = imgWrap.offsetWidth;
            var bottom = parseFloat(window.getComputedStyle(imgWrap).bottom);
            ImgSelector.style.bottom = (bottom - 4) +'px';
            ImgSelector.style.left = (imgWrap.offsetLeft - 4) +'px';
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        ImgSizeControl.ondragstart = function () {
            return false;
        };
    }
});

ImgSizeControl.addEventListener('touchstart', function (event) {
    if (imgWrap) {
        var touch = event.touches[0];
        startY = touch.clientY;
        var currentHeight = imgWrap.offsetHeight * PreviewScale;
        var currentWidth = imgWrap.offsetWidth * PreviewScale;
        var Aspect = currentWidth / currentHeight;
        event.preventDefault();
        ImgSizeControl.addEventListener('touchmove', function (event) {
            var touch = event.touches[0];
            var moviment = touch.clientY - startY;
            var newHeight = ((-moviment + currentHeight) / PreviewScale);
            var newWidth = ((-moviment * Aspect) + currentWidth) / PreviewScale;
            imgWrap.style.height = newHeight;
            imgWrap.style.width = newWidth;
            image.style.width = newWidth;
            ImgSelector.style.height = imgWrap.offsetHeight;
            ImgSelector.style.width = imgWrap.offsetWidth;
            var bottom = parseFloat(window.getComputedStyle(imgWrap).bottom);
            ImgSelector.style.bottom = (bottom - 4) +'px';
            ImgSelector.style.left = (imgWrap.offsetLeft - 4) +'px';
            event.preventDefault();
        });
    }
});

ImgCutBtn.addEventListener('mousedown', function (event) {
    if (imgWrap) {
        startY = event.clientY;
        var currentHeight = imgWrap.offsetHeight * PreviewScale;
        var bottom = parseFloat(window.getComputedStyle(imgWrap).bottom) * PreviewScale;
        var ImgHeight = image.offsetHeight;
        document.onmousemove = function (e) {
            var moviment = e.clientY - startY;
            var newBottom = ((-moviment + bottom) / PreviewScale);
            if ((moviment + currentHeight) / PreviewScale < ImgHeight) {
                imgWrap.style.height = ((moviment + currentHeight) / PreviewScale) + 'px';
                imgWrap.style.bottom = newBottom;
                ImgSelector.style.height = imgWrap.offsetHeight;
                ImgSelector.style.width = imgWrap.offsetWidth;
                ImgSelector.style.bottom = newBottom - 4;
                ImgSelector.style.left = (imgWrap.offsetLeft - 4) +'px';
            }
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
        ImgCutBtn.ondragstart = function () {
            return false;
        };
    }
});

ImgCutBtn.addEventListener('touchstart', function (event) {
    if (imgWrap) {
        var touch = event.touches[0];
        startY = touch.clientY;
        var currentHeight = imgWrap.offsetHeight * PreviewScale;
        var bottom = parseFloat(window.getComputedStyle(imgWrap).bottom) * PreviewScale;
        var ImgHeight = image.offsetHeight;
        event.preventDefault();
        function handleTouchMove(event) {
            var touch = event.touches[0];
            var moviment = touch.clientY - startY;
            if ((moviment + currentHeight) / PreviewScale < ImgHeight) {
                var newBottom = (-moviment + bottom) / PreviewScale + 'px';
                imgWrap.style.height = (moviment + currentHeight) / PreviewScale + 'px';
                imgWrap.style.bottom = newBottom;
                ImgSelector.style.height = imgWrap.offsetHeight + 'px';
                ImgSelector.style.width = imgWrap.offsetWidth + 'px';
                ImgSelector.style.bottom = parseFloat(newBottom) - 4 + 'px';
                ImgSelector.style.left = (imgWrap.offsetLeft - 4) + 'px';
                event.preventDefault();
            }
        }
        ImgCutBtn.addEventListener('touchmove', handleTouchMove);
        ImgCutBtn.addEventListener('touchend', function () {
            ImgCutBtn.removeEventListener('touchmove', handleTouchMove);
        });
    }
});