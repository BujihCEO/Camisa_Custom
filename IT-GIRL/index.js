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

function resize() {
    var value = Tshirt.offsetWidth / window.innerWidth;
    Tshirt.style.setProperty('--resize', value);
}
resize();

const imgWrap = document.querySelector('.imgWrap');
const TextName = document.querySelector('.TextName');
function textScaleX() {
    var Maxwidth = imgWrap.clientWidth;
    var width = TextName.offsetWidth;
    if (width > Maxwidth) {
        const scale = Maxwidth / width;
        TextName.style.transform = `scaleX(${scale})`;
    } else {
        TextName.style.transform = 'scaleX(1)';
    }
}
window.onload = function() {
    textScaleX();
};

const ImgContainer = document.querySelector('.ImgContainer');
const IconContainer = document.querySelector('.IconContainer');

function DragOn() {
    if (imgIcon.classList.contains('onDrag')) {
        ImgSelector.classList.remove('selected');
        imgIcon.classList.remove('onDrag');
    } else {
        ImgSelector.style.width = ImgContainer.offsetWidth + 'px';
        ImgSelector.style.height = ImgContainer.offsetHeight + 'px';
        ImgSelector.style.left =  `${imgWrap.offsetLeft + ImgContainer.offsetLeft + 2}px`;
        ImgSelector.style.top = `${imgWrap.offsetTop + ImgContainer.offsetTop + 2 }px`;
        ImgSelector.classList.add('selected');
        imgIcon.classList.add('onDrag');
    }
}

let ImgPreview = null;
let imgIcon = null;
let halftone = null;
const Slider = document.querySelector('.Slider');
const ImgOptions = document.querySelector('.ImgOptions');
const ImgSelector = document.querySelector('.ImgSelector');
const ImgDragMove = document.querySelector('.ImgDragMove');
const ImgSizeControl = document.querySelector('.ImgSizeControl');

function loadNewImage() {
    Slider.value = 0.50;
    ImgContainer.style = '';
    ImgContainer.innerHTML = '';
    IconContainer.innerHTML = '';
    const file = imgInput.files[0];
    const reader = new FileReader();
    ImgPreview = new Image();
    halftone = document.createElement('div');
    imgIcon = document.createElement('img');
    ImgPreview.className = `ImgPreview`;
    halftone.className = `halftone`;
    imgIcon.className = `imgIcon`;
    ImgPreview.onclick = DragOn;
    imgIcon.onclick = DragOn;
    IconContainer.appendChild(imgIcon);

    reader.onload = function (e) {
        imgIcon.src = e.target.result;
        ImgPreview.src = e.target.result;
        ImgPreview.onload = function() {
            ImgContainer.appendChild(ImgPreview);
            ImgContainer.appendChild(halftone);
            ImgContainer.style.setProperty('--mask', `url(${e.target.result})`);
            DragOn();
            imgBrightness();
        };
    };

    reader.readAsDataURL(file);
    ImgOptions.classList.add('selected');
    IconContainer.classList.add('uploaded');
    imgInput.value = '';
}

function imgBrightness() {
    ImgPreview.style.filter = `grayscale(1) brightness(${Slider.value})`;
    sliderStyle();
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
            var currentTop = ImgContainer.offsetTop * PreviewScale;
            var currentLeft = ImgContainer.offsetLeft * PreviewScale;
            var dragCurrentTop = ImgSelector.offsetTop * PreviewScale;
            var dragCurrentLeft = ImgSelector.offsetLeft * PreviewScale;
            document.onmousemove = function (e) {
                var movimentY = e.clientY - startY;
                var movimentX = e.clientX - startX;
                ImgContainer.style.top = ((movimentY + currentTop) / PreviewScale) + 'px';
                ImgContainer.style.left = ((movimentX + currentLeft) / PreviewScale) + 'px';
                ImgSelector.style.top = ((movimentY + dragCurrentTop) / PreviewScale) + 'px';
                ImgSelector.style.left = ((movimentX + dragCurrentLeft) / PreviewScale) + 'px';
                ImgContainer.classList.add('onDrag');
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
                ImgContainer.classList.remove('onDrag');
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
            var currentTop = ImgContainer.offsetTop * PreviewScale;
            var currentLeft = ImgContainer.offsetLeft * PreviewScale;
            var dragCurrentTop = ImgSelector.offsetTop * PreviewScale;
            var dragCurrentLeft = ImgSelector.offsetLeft * PreviewScale;
            event.preventDefault();
            function TouchMove(event) {
                var touch = event.touches[0];
                var movimentX = touch.clientX - startX;
                var movimentY = touch.clientY - startY;
                ImgContainer.style.top = ((movimentY + currentTop) / PreviewScale) + 'px';
                ImgContainer.style.left = ((movimentX + currentLeft) / PreviewScale) + 'px';
                ImgSelector.style.top = ((movimentY + dragCurrentTop) / PreviewScale) + 'px';
                ImgSelector.style.left = ((movimentX + dragCurrentLeft) / PreviewScale) + 'px';
                ImgContainer.classList.add('onDrag');
                event.preventDefault();
            }
            element.addEventListener('touchmove', TouchMove);
            element.addEventListener('touchend', function () {
                element.removeEventListener('touchmove', TouchMove);
                ImgContainer.classList.remove('onDrag');
            });
        }
    });
});

ImgSizeControl.addEventListener('mousedown', function (event) {
    if (ImgContainer) {
        startY = event.clientY;
        var currentHeight = ImgContainer.offsetHeight * PreviewScale;
        var currentWidth = ImgContainer.offsetWidth * PreviewScale;
        var currentTop = ImgContainer.offsetTop * PreviewScale;
        var DragcurrentTop = ImgSelector.offsetTop * PreviewScale;
        var Aspect = currentWidth / currentHeight;
        document.onmousemove = function (e) {
            var moviment = e.clientY - startY;
            ImgContainer.style.height = ((-moviment + currentHeight) / PreviewScale) + 'px';
            ImgContainer.style.width = ((-moviment * Aspect) + currentWidth) / PreviewScale + 'px';
            ImgContainer.style.top = ((moviment + currentTop) / PreviewScale) + 'px';
            ImgContainer.style.left = ImgContainer.offsetLeft + 'px';
            ImgSelector.style.height = ImgPreview.offsetHeight + 'px';
            ImgSelector.style.width = ImgPreview.offsetWidth + 'px';
            ImgSelector.style.top = ((moviment + DragcurrentTop) / PreviewScale) + 'px';
            ImgContainer.classList.add('onDrag');
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            ImgContainer.classList.remove('onDrag');
        };
        ImgSizeControl.ondragstart = function () {
            return false;
        };
    }
});

ImgSizeControl.addEventListener('touchstart', function (event) {
    if (ImgContainer) {
        var touch = event.touches[0];
        startY = touch.clientY;
        var currentHeight = ImgContainer.offsetHeight * PreviewScale;
        var currentTop = ImgContainer.offsetTop * PreviewScale;
        var DragcurrentTop = ImgSelector.offsetTop * PreviewScale;
        event.preventDefault();
        function TouchMove(event) {
            var touch = event.touches[0];
            var moviment = touch.clientY - startY;
            ImgContainer.style.height = ((-moviment + currentHeight) / PreviewScale) + 'px';
            ImgContainer.style.top = ((moviment + currentTop) / PreviewScale) + 'px';
            ImgContainer.style.left = ImgContainer.offsetLeft + 'px';
            ImgSelector.style.height = ImgPreview.offsetHeight + 'px';
            ImgSelector.style.width = ImgPreview.offsetWidth + 'px';
            ImgSelector.style.top = ((moviment + DragcurrentTop) / PreviewScale) + 'px';
            ImgContainer.classList.add('onDrag');
            event.preventDefault();
        }
        ImgSizeControl.addEventListener('touchmove', TouchMove);
        ImgSizeControl.addEventListener('touchend', function () {
            ImgSizeControl.removeEventListener('touchmove', TouchMove);
            ImgContainer.classList.remove('onDrag');
        });
    }
});

const InputText_1 = document.querySelector('.InputText_1');
InputText_1.addEventListener('input', function() {
    var Max = 20;
    InputText_1.value = InputText_1.value.slice(0, Max);
    TextName.textContent = InputText_1.value;
    textScaleX();
});

const InputText_2 = document.querySelector('.InputText_2');
const dateText = document.querySelector('.dateText');
InputText_2.addEventListener('input', function() {
    var Max = 4;
    InputText_2.value = InputText_2.value.slice(0, Max);
    dateText.textContent = InputText_2.value;
});

window.addEventListener('resize', resize, textScaleX);

const BtnBuyNow = document.querySelector('.BtnBuyNow');

BtnBuyNow.addEventListener('click', () => {
    var scale = 4961 / Pr_Drag.offsetHeight;
    domtoimage.toPng(Pr_Drag, {
        width: Pr_Drag.clientWidth * scale,
        height: Pr_Drag.clientHeight * scale,
        style: {
            transform: 'scale('+scale+')',
            transformOrigin: 'top left'
        }  
    })
    .then(function (dataUrl) {
        var img = new Image();
        img.style = 'width: 100%;';
        img.src = dataUrl;
        document.body.appendChild(img);
    });
});