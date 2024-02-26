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
            imgSizeAll.forEach(element => {
                element.classList.add('Zoom');
            });
            PreviewScale = 1.90;
        }
        if (button.classList.contains('Out')) {
            button.classList.add('selected');
            Tshirt.classList.remove('Zoom');
            Preview.classList.remove('Zoom');
            imgSizeAll.forEach(element => {
                element.classList.remove('Zoom');
            });
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


var ImgWrap = document.querySelector('.ImgWrap');
var ImgPreviewBox = null;
var ImgPreview = null;
var imgIcon = null;
var imgSlider = document.querySelector('.imgSlider');
var sliderBox = document.querySelector('.sliderBox');
var Slider = document.querySelector('.Slider');
var threshold = 1;

function centerImg() {
    ImgPreviewBox.style.height = ImgPreviewBox.offsetHeight + 'px';
    ImgPreviewBox.style.width = ImgPreviewBox.offsetWidth + 'px';
    ImgPreview.style.height = ImgPreviewBox.offsetHeight + 'px';
    ImgPreview.style.width = ImgPreviewBox.offsetWidth + 'px';
    ImgPreview.style.position = 'absolute';
}

function loadImage(input) {
    //Drag = true;
    threshold = 1;
    Slider.value = 1;
    if (imgIcon) {
        imgIcon.classList.remove('selected');
        ImgPreviewBox.classList.remove('selected');
        sliderBox.classList.remove('selected');
    }
    ImgPreviewBox = document.createElement('div');
    ImgPreviewBox.className = 'ImgPreviewBox selected';
    ImgPreview = document.createElement('div');
    ImgPreview.className = 'ImgPreview';
    ImgPreviewBox.onclick = selectIcon;
    ImgPreviewBox.appendChild(ImgPreview);
    ImgWrap.appendChild(ImgPreviewBox);
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        imgIcon = new Image();
        var imgCanvas = new Image();
        imgCanvas.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = imgCanvas.width;
            canvas.height = imgCanvas.height;
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.filter = 'brightness(1)';
            ctx.drawImage(imgCanvas, 0, 0, imgCanvas.width, imgCanvas.height);
            imgCanvas = canvas.toDataURL();
            center = true;
            potrace(imgCanvas);
        }
        imgCanvas.src = e.target.result;
        imgIcon.src = e.target.result;
        imgIcon.classList = 'imgIcon selected';
        imgIcon.setAttribute('Threshold', threshold);
        imgIcon.onclick = selectIcon;
        imgSlider.appendChild(imgIcon);
        IconCount();
        sliderStyle();
        sliderBox.classList.add('selected');
    };
    reader.readAsDataURL(file);
    input.value = '';
}

function potrace(target) {
    //loadContainer.classList.add('on');
    Potrace.loadImageFromUrl(target);
    Potrace.process(function() {
        displaySVG(1);
    });
}

function displaySVG(size, type) {
    var svg = Potrace.getSVG(size, type);
    var modifiedSVG = newSVG(svg);
    ImgPreview.innerHTML = modifiedSVG;
    if (center === true) {
        centerImg();
    }
    dragOn();
    //if (Drag === true) {
    //    DragOn();
    //
    //loadContainer.classList.remove('on');
}

function newSVG(svg) {
    svg = svg.replace(/fill="black"/g, 'fill="red"');
    const match = svg.match(/<svg[^>]* width="([^"]+)"[^>]* height="([^"]+)"/);
    if (match && match.length === 3) {
        const width = match[1];
        const height = match[2];
        svg = svg.replace(/<svg([^>]*)>/, `<svg$1 viewBox="0 0 ${width} ${height}">`);
        svg = svg.replace(/<svg([^>]*)>/, `<svg$1 aspectRatio="${width}/${height}">`);
    }
    return svg;
}

function selectIcon() {
    var Box = document.querySelectorAll('.ImgPreviewBox');
    var Icons = document.querySelectorAll('.imgIcon');
    if (this.classList.contains('selected')) {
        Icons.forEach((icon, index) => {
            icon.classList.remove('selected');
            Box[index].classList.remove('selected');
            sliderBox.classList.remove('selected');
        });
        imgIcon = null;
        ImgPreviewBox = null;
        ImgPreview = null;
        dragOn();
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
        Slider.value = imgIcon.getAttribute('Threshold');
        sliderStyle();
        sliderBox.classList.add('selected');
        dragOn();
    }
}

var imgIconBox = document.querySelector('.imgIconBox');
function deleteImg() {
    if (imgIcon) {
        imgIcon.remove();
        ImgPreviewBox.remove();
        imgIcon = null;
        ImgPreviewBox = null;
        IconCount();
        sliderBox.classList.remove('selected');
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
        ImgSelector.classList.add('selected');
        ImgSelector.style.top = ImgWrap.offsetTop + ImgPreviewBox.offsetTop - 1 + 'px';
        ImgSelector.style.left = ImgWrap.offsetLeft + ImgPreviewBox.offsetLeft - 1 + 'px';
        ImgSelector.style.height = ImgPreviewBox.offsetHeight + 'px';
        ImgSelector.style.width = ImgPreviewBox.offsetWidth + 'px';
    } else {
        ImgSelector.classList.remove('selected');
    }
}

function onSideLimit() {
    if (ImgPreviewBox.offsetTop === 0) {
        Preview.classList.add('top');
    } else {
        Preview.classList.remove('top');
    } 
    if (ImgPreviewBox.offsetLeft + ImgPreviewBox.offsetWidth === ImgWrap.offsetWidth) {
        Preview.classList.add('right');
    } else {
        Preview.classList.remove('right');
    }
    if (ImgPreviewBox.offsetTop + ImgPreviewBox.offsetHeight === ImgWrap.offsetHeight) {
        Preview.classList.add('bottom');
    } else {
        Preview.classList.remove('bottom');
    }
    if (ImgPreviewBox.offsetLeft === 0) {
        Preview.classList.add('left');
    } else {
        Preview.classList.remove('left');
    }
}
var ImgDragMove = document.querySelector('.ImgDragMove');
ImgDragMove.addEventListener('mousedown', function (event) {
    if (ImgSelector.classList.contains('selected')) {
        onSideLimit();
        startY = event.clientY;
        startX = event.clientX;
        var currentTop = ImgPreviewBox.offsetTop * PreviewScale;
        var currentLeft = ImgPreviewBox.offsetLeft * PreviewScale;
        var dragCurrentTop = ImgSelector.offsetTop * PreviewScale;
        var dragCurrentLeft = ImgSelector.offsetLeft * PreviewScale;
        Preview.classList.add('border');
        document.onmousemove = function (e) {
            var movimentY = e.clientY - startY;
            var movimentX = e.clientX - startX;
            ImgPreviewBox.style.top = ((movimentY + currentTop) / PreviewScale) + 'px';
            ImgPreviewBox.style.left = ((movimentX + currentLeft) / PreviewScale) + 'px';
            ImgSelector.style.top = ((movimentY + dragCurrentTop) / PreviewScale) + 'px';
            ImgSelector.style.left = ((movimentX + dragCurrentLeft) / PreviewScale) + 'px';
            onSideLimit();
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            Preview.classList.remove('border');
            Preview.classList.remove('top', 'right', 'bottom', 'left');
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
    Preview.classList.add('border');
    event.preventDefault();
    function TouchMove(event) {
        var touch = event.touches[0];
        var movimentX = touch.clientX - startX;
        var movimentY = touch.clientY - startY;
        ImgPreviewBox.style.top = ((movimentY + currentTop) / PreviewScale) + 'px';
        ImgPreviewBox.style.left = ((movimentX + currentLeft) / PreviewScale) + 'px';
        ImgSelector.style.top = ((movimentY + dragCurrentTop) / PreviewScale) + 'px';
        ImgSelector.style.left = ((movimentX + dragCurrentLeft) / PreviewScale) + 'px';
        onSideLimit();
        event.preventDefault();
    }
    ImgDragMove.addEventListener('touchmove', TouchMove);
    ImgDragMove.addEventListener('touchend', function () {
        ImgDragMove.removeEventListener('touchmove', TouchMove);
        Preview.classList.remove('border');
        Preview.classList.remove('top', 'right', 'bottom', 'left');
    });
});

var imgSizeAll = document.querySelectorAll('.imgSize');
imgSizeAll.forEach((element) => {
    function startTouch() {
        currentHeight = ImgPreviewBox.offsetHeight * PreviewScale;
        currentWidth = ImgPreviewBox.offsetWidth * PreviewScale;
        currentTop = ImgPreviewBox.offsetTop * PreviewScale;
        currentLeft = ImgPreviewBox.offsetLeft * PreviewScale;
        imgHeight = ImgPreview.offsetHeight * PreviewScale;
        imgWidth = ImgPreview.offsetWidth * PreviewScale;
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
            
                ImgSelector.style.height = ImgPreviewBox.offsetHeight + 'px';
                ImgSelector.style.width = ImgPreviewBox.offsetWidth + 'px';
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
            verify = Vheight / PreviewScale <= ImgPreview.offsetHeight + ImgPreview.offsetTop;
        }
        if (element.classList.contains('L')) {
            Vheight = currentHeight; Vwidth = -movimentX + currentWidth; Vtop = 0; Vleft = movimentX;
            Cheight = imgHeight; Cwidth = imgWidth; Ctop = imgTop; Cleft = -movimentX + imgLeft;
            verify = Cleft / PreviewScale <= 0;
        }
        if (element.classList.contains('R')) {
            Vheight = currentHeight; Vwidth = movimentX + currentWidth; Vtop = 0; Vleft = 0;
            Cheight = imgHeight; Cwidth = imgWidth; Ctop = imgTop; Cleft = imgLeft;
            verify = Vwidth / PreviewScale <= ImgPreview.offsetWidth + ImgPreview.offsetLeft;
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
            onSideLimit(); 
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            Preview.classList.remove('top', 'right', 'bottom', 'left');
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
            onSideLimit();
        }
        element.addEventListener('touchmove', touchMove);
        element.addEventListener('touchend', function () {
            element.removeEventListener('touchmove', touchMove);
            Preview.classList.remove('top', 'right', 'bottom', 'left');
        });
    });
});

function updateEffect() {
    threshold = Slider.value;
    imgIcon.setAttribute('Threshold', threshold);
    var Src = imgIcon.src;
    var newImage = new Image();
    newImage.src = Src;
    newImage.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = newImage.width;
        canvas.height = newImage.height;
        var ctx = canvas.getContext('2d');
        ctx.filter = 'brightness('+ threshold +')';
        ctx.drawImage(newImage, 0, 0, newImage.width, newImage.height);
        var imgCanvas = canvas.toDataURL();
        center = false;
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

