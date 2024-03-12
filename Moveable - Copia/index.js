const ProductBox = document.querySelector('.ProductBox');
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
            dragOn(imgIcon, ImgPreviewBox);
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
        dragOn(imgIcon, ImgPreviewBox);
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
        dragOn(imgIcon, ImgPreviewBox);
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
    dragOn(imgIcon, ImgPreviewBox);
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

function deleteImg() {
    if (imgIcon) {
        imgIcon.remove();
        ImgPreviewBox.remove();
        imgIcon = null;
        ImgPreviewBox = null;
        IconCount();
        dragOn(imgIcon, ImgPreviewBox);
    }
}

function IconCount() {
    var addImgEmpty = document.querySelector('.addImage.empty');
    var imgIconBox = document.querySelector('.imgIconBox');
    if (imgSlider.childElementCount === 0) {
        imgIconBox.classList.add('hidden');
        addImgEmpty.classList.remove('hidden');
    } else {
        imgIconBox.classList.remove('hidden');
        addImgEmpty.classList.add('hidden');
    }
}

var nameBox = document.querySelector('.nameBox');
function resize() {
    var value = ProductBox.offsetWidth / window.innerWidth;
    ProductBox.style.setProperty('--resize', value);
    nameBox.style.fontSize = nameBox.offsetHeight + 'px';
}
resize();

var iconsBox = document.querySelector('.iconsBox');
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

function dragOn(verify, targetName) {
    if (verify) {
        ImgSelector.style = '';
        ImgSelector.classList.add('selected');
        ImgSelector.style.height = targetName.clientHeight + 'px';
        ImgSelector.style.width = targetName.clientWidth + 'px';
        const Target = targetName.getBoundingClientRect();
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