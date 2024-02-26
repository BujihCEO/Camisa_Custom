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


var ImgWrap = document.querySelector('.ImgWrap');
var ImgPreviewBox = null;
var ImgPreview = null;
var imgIcon = null;
var imgSlider = document.querySelector('.imgSlider');

function centerImg() {
    ImgPreview.style.left = (ImgPreview.offsetWidth - ImgWrap.offsetWidth) / 2 + 'px';
    ImgPreview.style.top = (ImgPreview.offsetTop - ImgWrap.offsetTop) / 2 + 'px';
}

function loadImage(input) {
    //Drag = true;
    //threshold = 1;
    //thresholdSlider.value = 1;
    if (imgIcon) {
        imgIcon.classList.remove('selected');
        ImgPreview.classList.remove('selected');
    }
    ImgPreview = document.createElement('div');
    ImgPreview.className = 'ImgPreview selected';
    ImgWrap.appendChild(ImgPreview);
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        imgIcon = new Image();
        imgIcon.classList = 'imgIcon selected';
        imgIcon.src = e.target.result;
        imgIcon.onclick = selectIcon;
        imgSlider.appendChild(imgIcon);
        IconCount();
        potrace(file);
    };
    reader.readAsDataURL(file);
    input.value = '';
}

function potrace(target) {
    //loadContainer.classList.add('on');
    Potrace.loadImageFromFile(target);
    Potrace.process(function() {
        displaySVG(1);
    });
}

function displaySVG(size, type) {
    var svg = Potrace.getSVG(size, type);
    var newSvg = newSVG(svg);
    ImgPreview.innerHTML = newSvg;
    moveable();
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
        });
        imgIcon = null;
        ImgPreviewBox = null;
    } else {
        Icons.forEach((icon, index) => {
            icon.classList.remove('selected');
            Box[index].classList.remove('selected');
        });
        var index = Array.from(this.parentNode.children).indexOf(this);
        imgIcon = Icons[index];
        ImgPreviewBox = Box[index];
        Icons[index].classList.add('selected');
        Box[index].classList.add('selected');
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

function moveable() {
    const move = new Moveable(Preview, {
        target: ImgPreview,
        draggable: true,
        resizable: { keepRatio: true },
        clippable: { keepRatio: false },
        clipTargetBounds: true,
    });
    move.on("drag",  ({ target, transform }) => {
        target.style.transform = transform;
    });
    move.on("resize", e => {
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
        e.target.style.transform = e.drag.transform;
    });
    move.on("rotate", ({ target, transform }) => {
        target.style.transform = transform;
    });
    move.on("clip", e => {
        e.target.style.clipPath = e.clipStyle;
    });
        
}
