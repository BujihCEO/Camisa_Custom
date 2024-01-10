const Tshirt = document.querySelector('.Tshirt');
const Preview = document.querySelector('.Preview');
const Zoom_Btn = document.querySelectorAll('.Zoom_Btn');
var PreviewScale = 1;
Zoom_Btn.forEach(button => {
    button.addEventListener('click', () => {
        Zoom_Btn.forEach(button => {
            button.classList.remove('selected');
        });
        if (button.classList.contains('In')) {
            button.classList.add('selected');
            Tshirt.classList.add('Zoom');
            Preview.classList.add('Zoom');
            PreviewScale = 1.90;
        }
        if (button.classList.contains('Out')) {
            button.classList.add('selected');
            Tshirt.classList.remove('Zoom');
            Preview.classList.remove('Zoom');
            PreviewScale = 1;
        } 
    })
})

const Pr_Border = document.querySelector('.Pr_Border');
Pr_Border.addEventListener('click', function() {
    if (Preview.classList.contains('border')) {
        Preview.classList.remove('border');
    } else {
        Preview.classList.add('border');
    }
});

const BtnCustomAll = document.querySelectorAll('.BtnCustom');
const CustomContainerAll = document.querySelectorAll('.CustomContainer');
BtnCustomAll.forEach((element, index) => {
    element.addEventListener('click', () => {
        BtnCustomAll.forEach((element, index) => {
            element.classList.remove('selected');
            CustomContainerAll[index].classList.remove('selected');
            if (ImgSelector.classList.contains('selected')) {
                ImgSelector.classList.remove('selected');
                imgIcon.classList.remove('onDrag');
            }
        });
        element.classList.add('selected');
        CustomContainerAll[index].classList.add('selected');
    });
});

const ImgWrap = document.querySelector('.ImgWrap');
const IconContainer = document.querySelector('.IconContainer');
const loadContainer = document.querySelector('.loadContainer');

function DragOn() {
    if (imgIcon.classList.contains('onDrag')) {
        ImgSelector.classList.remove('selected');
        imgIcon.classList.remove('onDrag');
    } else {
        ImgSelector.style.width = dragPicture.offsetWidth + 'px';
        ImgSelector.style.height = dragPicture.offsetHeight + 'px';
        ImgSelector.style.left =  `${ImgWrap.offsetLeft + dragPicture.offsetLeft - 2}px`;
        ImgSelector.style.top = `${ImgWrap.offsetTop + dragPicture.offsetTop - 2 }px`;
        ImgSelector.classList.add('selected');
        imgIcon.classList.add('onDrag');
    }
}

let Picture = null;
let dragPicture = null;
let imgIcon = null;
let Drag = false;
const Slider = document.querySelector('.Slider');
const ImgOptions = document.querySelector('.ImgOptions');
const ImgSelector = document.querySelector('.ImgSelector');
const ImgDragMove = document.querySelector('.ImgDragMove');
const ImgSizeControl = document.querySelector('.ImgSizeControl');

function loadNewImage() {
    Drag = true;
    Slider.value = 1;
    ImgWrap.innerHTML = '';
    IconContainer.innerHTML = '';
    const file = imgInput.files[0];
    const reader = new FileReader();
    Picture = document.createElement('div');
    dragPicture = new Image();
    imgIcon = new Image();
    Picture.className = 'Picture';
    dragPicture.className = 'dragPicture';
    imgIcon.className = 'imgIcon';
    imgIcon.onclick = DragOn;
    ImgWrap.appendChild(Picture);
    ImgWrap.appendChild(dragPicture);
    IconContainer.appendChild(imgIcon);
    reader.onload = function (e) {
        const image = new Image();
        image.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, image.width, image.height);
            ctx.drawImage(image, 0, 0, image.width, image.height);
            var imgCanvas = canvas.toDataURL();
            potrace(imgCanvas);
        };
        imgIcon.src = e.target.result;
        image.src = e.target.result;
        sliderStyle();
    };

    reader.readAsDataURL(file);
    ImgOptions.classList.add('selected');
    IconContainer.classList.add('uploaded');
    imgInput.value = '';
}

function potrace(target) {
    loadContainer.classList.add('on');
    Potrace.loadImageFromUrl(target);
    Potrace.process(function() {
        displaySVG(4);
    });
}

function displaySVG(size, type) {
    var svg = Potrace.getSVG(size, type);
    var img = new Image();
    img.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
    img.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        dragPicture.src = canvas.toDataURL();
        dragPicture.onload = function() {
            if (Drag === true) {
                DragOn();
            }
            loadContainer.classList.remove('on');
        };
    };
}

function changePixels(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
        const value = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;

        if (value === 255) {
            pixels[i + 3] = 0;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function changeThreshold() {
    Drag = false;
    threshold = Slider.value;
    const Src = imgIcon.src;
    const newImage = new Image();
    newImage.src = Src;
    newImage.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = newImage.width;
        canvas.height = newImage.height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, newImage.width, newImage.height);
        ctx.filter = 'brightness('+ threshold +') contrast(25000%) grayscale(1)';
        ctx.drawImage(newImage, 0, 0, newImage.width, newImage.height);
        var imgCanvas = canvas.toDataURL();
        potrace(imgCanvas);
    }
}

function sliderStyle() {
    var percentage = (Slider.value - Slider.min) / (Slider.max - Slider.min) * 100;
    var colorBefore = '#000';
    var colorAfter = '#fff';
    var gradient = 'linear-gradient(to right, ' + colorBefore + ' 0%, ' + colorBefore + ' ' + percentage + '%, ' + colorAfter + ' ' + percentage + '%, ' + colorAfter + ' 100%)';
    Slider.style.background = gradient;
}

var startX, startY, offsetX, offsetY;
const Pr_Drag = document.querySelector('.Pr_Drag');
var TouchMoveGroup = [Pr_Drag ,ImgDragMove];

TouchMoveGroup.forEach((element) => {
    element.addEventListener('mousedown', function (event) {
        if (ImgSelector.classList.contains('selected')) {
            startY = event.clientY;
            startX = event.clientX;
            var currentTop = dragPicture.offsetTop * PreviewScale;
            var currentLeft = dragPicture.offsetLeft * PreviewScale;
            var dragCurrentTop = ImgSelector.offsetTop * PreviewScale;
            var dragCurrentLeft = ImgSelector.offsetLeft * PreviewScale;
            document.onmousemove = function (e) {
                var movimentY = e.clientY - startY;
                var movimentX = e.clientX - startX;
                ImgWrap.style.setProperty('--top', ((movimentY + currentTop) / PreviewScale) + 'px');
                ImgWrap.style.setProperty('--left', ((movimentX + currentLeft) / PreviewScale) + 'px');
                ImgSelector.style.top = ((movimentY + dragCurrentTop) / PreviewScale) + 'px';
                ImgSelector.style.left = ((movimentX + dragCurrentLeft) / PreviewScale) + 'px';
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
        if (ImgSelector.classList.contains('selected')) {
            var touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            var currentTop = dragPicture.offsetTop * PreviewScale;
            var currentLeft = dragPicture.offsetLeft * PreviewScale;
            var dragCurrentTop = ImgSelector.offsetTop * PreviewScale;
            var dragCurrentLeft = ImgSelector.offsetLeft * PreviewScale;
            event.preventDefault();
            function TouchMove(event) {
                var touch = event.touches[0];
                var movimentX = touch.clientX - startX;
                var movimentY = touch.clientY - startY;
                ImgWrap.style.setProperty('--top', ((movimentY + currentTop) / PreviewScale) + 'px');
                ImgWrap.style.setProperty('--left', ((movimentX + currentLeft) / PreviewScale) + 'px');
                ImgSelector.style.top = ((movimentY + dragCurrentTop) / PreviewScale) + 'px';
                ImgSelector.style.left = ((movimentX + dragCurrentLeft) / PreviewScale) + 'px';
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
    startY = event.clientY;
    var currentHeight = dragPicture.offsetHeight * PreviewScale;
    var aspect = dragPicture.offsetHeight / dragPicture.offsetWidth;
    var currentTop = dragPicture.offsetTop * PreviewScale;
    var DragcurrentTop = ImgSelector.offsetTop * PreviewScale;
    document.onmousemove = function (e) {
        var moviment = e.clientY - startY;
        ImgWrap.style.setProperty('--widht', ((-moviment + (currentHeight / aspect)) / PreviewScale) + 'px');
        ImgWrap.style.setProperty('--top', ((moviment + currentTop) / PreviewScale) + 'px');
        ImgSelector.style.height = dragPicture.offsetHeight + 'px';
        ImgSelector.style.width = dragPicture.offsetWidth + 'px';
        ImgSelector.style.top = ((moviment + DragcurrentTop) / PreviewScale) + 'px';
    };
    document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
    };
    ImgSizeControl.ondragstart = function () {
        return false;
    };
});

ImgSizeControl.addEventListener('touchstart', function (event) {
    var touch = event.touches[0];
    startY = touch.clientY;
    var currentHeight = dragPicture.offsetHeight * PreviewScale;
    var aspect = dragPicture.offsetHeight / dragPicture.offsetWidth;
    var currentTop = dragPicture.offsetTop * PreviewScale;
    var DragcurrentTop = ImgSelector.offsetTop * PreviewScale;
    event.preventDefault();
    function TouchMove(event) {
        var touch = event.touches[0];
        var moviment = touch.clientY - startY;
        ImgWrap.style.setProperty('--widht', ((-moviment + (currentHeight / aspect)) / PreviewScale) + 'px');
        ImgWrap.style.setProperty('--top', ((moviment + currentTop) / PreviewScale) + 'px');
        ImgSelector.style.height = dragPicture.offsetHeight + 'px';
        ImgSelector.style.width = dragPicture.offsetWidth + 'px';
        ImgSelector.style.top = ((moviment + DragcurrentTop) / PreviewScale) + 'px';
        event.preventDefault();
    }
    ImgSizeControl.addEventListener('touchmove', TouchMove);
    ImgSizeControl.addEventListener('touchend', function () {
        ImgSizeControl.removeEventListener('touchmove', TouchMove);
    });
});