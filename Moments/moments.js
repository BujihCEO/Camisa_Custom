let src;
let dst;
let ctx;
let Drag = false;
let threshold = 1;
const Tshirt = document.querySelector('.Tshirt');
const Personalization = document.querySelector('.Personalization');
const Preview = document.querySelector('.Preview');
const imgInput = document.querySelector('.imgInput');
const thresholdSlider = document.querySelector('.threshold-slider');
const ImgOptions = document.querySelector('.ImgOptions');
const ImgSelector = document.querySelector('.ImgSelector');
const ImgDragMove = document.querySelector('.ImgDragMove');
const ImgSizeControl = document.querySelector('.ImgSizeControl');
const loadContainer = document.querySelector('.loadContainer');
let dataPositon = null;
let IconContainer = null;
let IconInput = null;
let ImgContainer = null;
let ImgPreview = null;
let imgIcon = null;
let ImgPreviewWrap = null;

const Pr_ImgWrap = document.querySelector('.Pr_ImgWrap');
var TemplatesWrap = document.querySelector(".TemplatesWrap");
var UploadImgWrap = document.querySelector(".UploadImgWrap");

for (var i = 0; i < 8; i++) {
    var TempExm = document.createElement("div");
    TempExm.className = "TempExm";
    TempExm.classList.add("display_" + (i + 1));
    if (i === 0) {
        TempExm.classList.add('selected');
    }
    for (var j = 0; j < 6; j++) {
        var TempExmAfter = document.createElement("div");
        TempExmAfter.className = "TempExmAfter";
        TempExm.appendChild(TempExmAfter);
    }
    TemplatesWrap.appendChild(TempExm);
}

for (var i = 0; i < 6; i++) {
    var Icon = document.createElement("div");
    Icon.className = "IconContainer";
    var inputIcon = document.createElement("label");
    inputIcon.className = "iconInput";
    inputIcon.setAttribute("for", "imgInput");
    var ContainerImg = document.createElement("div");
    ContainerImg.className = "ImgContainer";
    Pr_ImgWrap.appendChild(ContainerImg);
    Icon.appendChild(inputIcon);
    UploadImgWrap.appendChild(Icon);
}

const ImgContainerAll = document.querySelectorAll('.ImgContainer');
const IconContainerAll = document.querySelectorAll('.IconContainer');
const IconInputAll = document.querySelectorAll('.iconInput');

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
        });
        if (index === 0 && IconContainer) {
            ImgSelector.classList.remove('selected');
            IconContainer.classList.remove('onDrag');
        }
        element.classList.add('selected');
        CustomContainerAll[index].classList.add('selected');
    });
});

var TempExmAll = document.querySelectorAll(".TempExm");
var ImgPreviewWrapAll  = document.querySelectorAll(".ImgPreviewWrap");

TempExmAll.forEach(element => {
    element.addEventListener('click', ()=> {
        TempExmAll.forEach(element => {
            element.classList.remove('selected');
        });
        var ImgPreviewWrapAll  = document.querySelectorAll(".ImgPreviewWrap");
        ImgPreviewWrapAll.forEach(element => {
            element.style = '';
        });
        element.classList.add('selected');
        var name = element.classList[1];
        UploadImgWrap.classList.remove(UploadImgWrap.classList[1]);
        UploadImgWrap.classList.add(name);
        Pr_ImgWrap.classList.remove(Pr_ImgWrap.classList[1]);
        Pr_ImgWrap.classList.add(name);
    });
});

IconContainerAll.forEach((element, index) => {
    element.addEventListener('click', ()=> {
        if (index + 1  === dataPositon) {
            if (element.classList.contains('onDrag')) {
                element.classList.remove('onDrag');
                ImgSelector.classList.remove('selected');
            } else {
                DragOn();
            }
        } else {
            IconContainerAll.forEach((element, index) => {
                element.classList.remove('selected');
                IconInputAll[index].classList.remove('selected');
                ImgContainerAll[index].classList.remove('selected');
            });
            IconInput = IconInputAll[index];
            ImgContainer = ImgContainerAll[index];
            IconContainer = element;
            IconInput.classList.add('selected');
            ImgContainer.classList.add('selected');
            IconContainer.classList.add('selected');
            dataPositon = index + 1;
            if (element.classList.contains('uploaded')) {
                ImgOptions.classList.add('selected');
                ImgPreviewWrap = document.querySelector(`.ImgPreviewWrap.index${dataPositon}`);
                ImgPreview = document.querySelector(`.ImgPreview.index${dataPositon}`);
                imgIcon = document.querySelector(`.imgIcon.index${dataPositon}`);
                value = imgIcon.getAttribute('Threshold');
                thresholdSlider.value = value;
                sliderStyle();
                DragOn();
            } else {
                ImgPreview = null;
                ImgOptions.classList.remove('selected');
                ImgSelector.classList.remove('selected');
            }
        }
    });
});

function DragOn() {
    if (ImgPreview) {
        ImgSelector.style.width = ImgPreviewWrap.offsetWidth + 'px';
        ImgSelector.style.height = ImgPreviewWrap.offsetHeight + 'px';
        ImgSelector.style.left =  `${Pr_ImgWrap.offsetLeft + ImgContainer.offsetLeft + ImgPreviewWrap.offsetLeft - 2}px`;
        ImgSelector.style.top = `${Pr_ImgWrap.offsetTop + ImgContainer.offsetTop + ImgPreviewWrap.offsetTop - 2}px`;
        ImgSelector.classList.add('selected');
        IconContainer.classList.add('onDrag');
    }
}

function loadNewImage() {
    Drag = true;
    threshold = 1;
    thresholdSlider.value = 1;
    ImgContainer.innerHTML = '';
    IconContainer.innerHTML = '';
    const file = imgInput.files[0];
    const reader = new FileReader();
    ImgPreview = document.createElement('div');
    ImgPreviewWrap = document.createElement('div');
    imgIcon = document.createElement('img');
    ImgPreview.className = `ImgPreview index${dataPositon}`;
    ImgPreviewWrap.className = `ImgPreviewWrap index${dataPositon}`;
    imgIcon.className = `imgIcon index${dataPositon}`;
    imgIcon.setAttribute('Threshold', threshold);
    IconContainer.appendChild(imgIcon);
    reader.onload = function (e) {
        ImgContainer.appendChild(ImgPreviewWrap);
        ImgPreviewWrap.appendChild(ImgPreview);
        imgIcon.src = e.target.result;
        const newImage = new Image();
        newImage.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = newImage.width;
            canvas.height = newImage.height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, newImage.width, newImage.height);
            ctx.filter = 'brightness(1) contrast(25000%) grayscale(1) invert(1)';
            ctx.drawImage(newImage, 0, 0, newImage.width, newImage.height);
            var imgCanvas = canvas.toDataURL();
            potrace(imgCanvas);
        };
        newImage.src = e.target.result;
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
        displaySVG(1);
    });
}

function displaySVG(size, type) {
    var svg = Potrace.getSVG(size, type);
    var modifiedSVG = newSVG(svg);
    ImgPreviewWrap.appendChild(ImgPreview);
    ImgPreview.innerHTML = modifiedSVG;
    if (Drag === true) {
        DragOn();
    }
    loadContainer.classList.remove('on');
}

function newSVG(svg) {
    svg = svg.replace(/fill="black"/g, 'fill="var(--color1)"');
    const match = svg.match(/<svg[^>]* width="([^"]+)"[^>]* height="([^"]+)"/);
    if (match && match.length === 3) {
        const width = match[1];
        const height = match[2];
        svg = svg.replace(/<svg([^>]*)>/, `<svg$1 viewBox="0 0 ${width} ${height}">`);
        svg = svg.replace(/<svg([^>]*)>/, `<svg$1 aspectRatio="${width}/${height}">`);
    }
    return svg;
}

function changeThreshold() {
    Drag = false;
    threshold = thresholdSlider.value;
    imgIcon.setAttribute('Threshold', threshold);
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
    var percentage = (thresholdSlider.value - thresholdSlider.min) / (thresholdSlider.max - thresholdSlider.min) * 100;
    var colorBefore = '#000';
    var colorAfter = '#fff';
    var gradient = 'linear-gradient(to right, ' + colorBefore + ' 0%, ' + colorBefore + ' ' + percentage + '%, ' + colorAfter + ' ' + percentage + '%, ' + colorAfter + ' 100%)';
    thresholdSlider.style.background = gradient;
}

var startX, startY, offsetX, offsetY;
const Pr_Drag = document.querySelector('.Pr_Drag');
var TouchMoveGroup = [Pr_Drag ,ImgDragMove];

TouchMoveGroup.forEach((element) => {
    element.addEventListener('mousedown', function (event) {
        if (ImgSelector.classList.contains('selected')) {
            startY = event.clientY;
            startX = event.clientX;
            var currentTop = ImgPreviewWrap.offsetTop * PreviewScale;
            var currentLeft = ImgPreviewWrap.offsetLeft * PreviewScale;
            var dragCurrentTop = ImgSelector.offsetTop * PreviewScale;
            var dragCurrentLeft = ImgSelector.offsetLeft * PreviewScale;
            document.onmousemove = function (e) {
                var movimentY = e.clientY - startY;
                var movimentX = e.clientX - startX;
                ImgPreviewWrap.style.top = ((movimentY + currentTop) / PreviewScale) + 'px';
                ImgPreviewWrap.style.left = ((movimentX + currentLeft) / PreviewScale) + 'px';
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
            var currentTop = ImgPreviewWrap.offsetTop * PreviewScale;
            var currentLeft = ImgPreviewWrap.offsetLeft * PreviewScale;
            var dragCurrentTop = ImgSelector.offsetTop * PreviewScale;
            var dragCurrentLeft = ImgSelector.offsetLeft * PreviewScale;
            event.preventDefault();
            function TouchMove(event) {
                var touch = event.touches[0];
                var movimentX = touch.clientX - startX;
                var movimentY = touch.clientY - startY;
                ImgPreviewWrap.style.top = ((movimentY + currentTop) / PreviewScale) + 'px';
                ImgPreviewWrap.style.left = ((movimentX + currentLeft) / PreviewScale) + 'px';
                ImgSelector.style.top = ((movimentY + dragCurrentTop) / PreviewScale) + 'px';
                ImgSelector.style.left = ((movimentX + dragCurrentLeft) / PreviewScale) + 'px';
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
    if (ImgPreviewWrap) {
        startY = event.clientY;
        var currentHeight = ImgPreviewWrap.offsetHeight * PreviewScale;
        var currentWidth = ImgPreviewWrap.offsetWidth * PreviewScale;
        var currentTop = ImgPreviewWrap.offsetTop * PreviewScale;
        var DragcurrentTop = ImgSelector.offsetTop * PreviewScale;
        var Aspect = currentWidth / currentHeight;
        document.onmousemove = function (e) {
            var moviment = e.clientY - startY;
            ImgPreviewWrap.style.height = ((-moviment + currentHeight) / PreviewScale) + 'px';
            ImgPreviewWrap.style.width = ((-moviment * Aspect) + currentWidth) / PreviewScale + 'px';
            ImgPreviewWrap.style.top = ((moviment + currentTop) / PreviewScale) + 'px';
            ImgSelector.style.height = ImgPreviewWrap.offsetHeight + 'px';
            ImgSelector.style.width = ImgPreviewWrap.offsetWidth + 'px';
            ImgSelector.style.top = ((moviment + DragcurrentTop) / PreviewScale) + 'px'; 
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
    if (ImgPreviewWrap) {
        var touch = event.touches[0];
        startY = touch.clientY;
        var currentHeight = ImgPreviewWrap.offsetHeight * PreviewScale;
        var currentWidth = ImgPreviewWrap.offsetWidth * PreviewScale;
        var currentTop = ImgPreviewWrap.offsetTop * PreviewScale;
        var DragcurrentTop = ImgSelector.offsetTop * PreviewScale;
        var Aspect = currentWidth / currentHeight; 
        event.preventDefault();
        function TouchMove(event) {
            var touch = event.touches[0];
            var moviment = touch.clientY - startY;
            ImgPreviewWrap.style.height = ((-moviment + currentHeight) / PreviewScale) + 'px';
            ImgPreviewWrap.style.width = ((-moviment * Aspect) + currentWidth) / PreviewScale + 'px';
            ImgPreviewWrap.style.top = ((moviment + currentTop) / PreviewScale) + 'px';
            ImgSelector.style.height = ImgPreviewWrap.offsetHeight + 'px';
            ImgSelector.style.width = ImgPreviewWrap.offsetWidth + 'px';
            ImgSelector.style.top = ((moviment + DragcurrentTop) / PreviewScale) + 'px';
            event.preventDefault();
        }
        ImgSizeControl.addEventListener('touchmove', TouchMove);
        ImgSizeControl.addEventListener('touchend', function () {
            ImgSizeControl.removeEventListener('touchmove', TouchMove);
        });
    }
});

function resize() {
    var value1 = Tshirt.offsetWidth / window.innerWidth;
    var value2 = Personalization.offsetWidth / window.innerWidth;
    Tshirt.style.setProperty('--resize', value1);
    Personalization.style.setProperty('--resize', value2);
}
resize();

window.addEventListener('resize', resize);

function Print() {
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
}