const OptionCustom = document.querySelectorAll('.OptionCustom');
const CustomizationContainer = document.querySelectorAll('.CustomizationContainer');
const clearIconContainer = document.querySelector('.clearIconContainer');
const imgIconsContainer = document.querySelector('.imgIconsContainer');
const previewContainer = document.querySelector('.previewContainer');
const ImgContainer = document.querySelector('.ImgContainer');
const PreviewBorder = document.querySelector('.PreviewBorder');
const ImgControls = document.querySelector('.ImgControls');
const IconsContainer = document.querySelector('.IconsContainer');
const imageUpload = document.querySelector('.imageUpload');
const UploadImageLabel = document.querySelector('.UploadImageLabel');
const UploadImageLabelP = document.querySelector('.UploadImageLabel p');
const FullUploaded = document.querySelector('.FullUploaded');
const TshirtContainer = document.querySelector('.TshirtContainer');
const ZoomBtn = document.querySelectorAll('.ZoomBtn');
const ImgSelector = document.querySelector('.ImgSelector');
const ImgDragMove = document.querySelector('.ImgDragMove');
const ImgSizeControl = document.querySelector('.ImgSizeControl');
const ImgCutBtn = document.querySelector('.ImgCutBtn');
const LinkAssets = 'https://raw.githubusercontent.com/BujihCEO/Theme/main/assets/';
let ImgMaskContainer = null;
let PreviewImgContainer = null;
let RoundedContainer = null;
let PreviewImg = null;
let BlendModeImg = null;
let ImageIcon = null;
SelectedImgList = [() => ImgMaskContainer, () => PreviewImgContainer, () => RoundedContainer, () => PreviewImg, () => BlendModeImg, () => ImageIcon];

var StyleCss = document.createElement('style');
document.head.appendChild(StyleCss);

function ZoomInLayout(button) {
    TshirtContainer.classList.add('Zoom');
    previewContainer.classList.add('Zoom');
    ZoomBtn.forEach((icon) => {
        icon.classList.remove('selected');
    });
    button.classList.add('selected');
    PreviewScale = 1.90;
}

function ZoomOutLayout(button) {
    TshirtContainer.classList.remove('Zoom');
    previewContainer.classList.remove('Zoom');
    ZoomBtn.forEach((icon) => {
        icon.classList.remove('selected');
    });
    button.classList.add('selected');
    PreviewScale = 1;
}

PreviewBorder.addEventListener('click', function() {
    if (previewContainer.classList.contains('border')) {
        previewContainer.classList.remove('border');
    } else {
        previewContainer.classList.add('border');
    }
});

OptionCustom.forEach((button, index) => {
    button.addEventListener('click', () => {
        if (index > 0 && PreviewImg) {
            deselectImg();
        }
        OptionCustom.forEach(element => {
            element.classList.remove('selected');
        });
        OptionCustom[index].classList.add('selected');
        CustomizationContainer.forEach(element => {
            element.classList.remove('selected');
        });
        CustomizationContainer[index].classList.add('selected');
    });
});

function generateUniqueValue(existingValues) {
    const newValue = Math.floor(Math.random() * 8) + 1;
    if (!existingValues.includes(newValue)) {
        return newValue;
    } else {
        return generateUniqueValue(existingValues);
    }
}

function CenterPosition(element, container) {
    element.style.bottom = (container.offsetHeight - element.offsetHeight) / 2 + 'px';
    element.style.left = (container.offsetWidth - element.offsetWidth) / 2 + 'px';
    element.style.height = element.offsetHeight + 'px';
    element.style.width = element.offsetWidth + 'px';
    PreviewImg.style.width = element.offsetWidth + 'px';
    PreviewImg.style.height = element.offsetHeight + 'px';
}

function ImgSelectorUpdate() {
    ImgSelector.classList.add('selected');
    ImgSelector.style.height = PreviewImgContainer.offsetHeight + 'px';
    ImgSelector.style.width = PreviewImgContainer.offsetWidth + 'px';
    ImgSelector.style.bottom = parseFloat(window.getComputedStyle(PreviewImgContainer).bottom) - 2  + 'px';
    ImgSelector.style.left = PreviewImgContainer.offsetLeft - 2  + 'px';
}

//  ADD IMAGE AND SELECT

function cropImage(Input) {
    if (Input.files.length > 0) {
        const file = Input.files[0];
        const formData = new FormData();
        formData.append('file', file);
        
        const queryParams = new URLSearchParams();
        queryParams.set('mattingType', '6');
        queryParams.set('crop', 'true');

        fetch(`https://www.cutout.pro/api/v1/matting2?${queryParams.toString()}`, {
            method: 'POST',
            headers: {
                'APIKEY': cutoutValue,
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 0 && data.data && data.data.imageBase64) {
                var Url = 'data:image/png;base64,' + data.data.imageBase64;
                loadImage(Url);
                Input.value = '';
            } else {
                console.error('Erro na resposta da API:', data.msg);
            }
        })
        .catch(error => console.error(error));
    }
}

function loadImage(input) {
    if (input.files && input.files[0])  {
        var reader = new FileReader();
        // createElement
        ImgMaskContainer = document.createElement('div');
        PreviewImgContainer = document.createElement('div');
        RoundedContainer = document.createElement('div');
        var imgWrap = document.createElement('div');
        PreviewImg = document.createElement('img');
        BlendModeImg = document.createElement('div');
        ImageIcon = document.createElement('img');
        
        // className
        ImgMaskContainer.className = 'ImgMaskContainer masked';
        PreviewImgContainer.className = 'PreviewImgContainer';
        RoundedContainer.className = 'RoundedContainer';
        imgWrap.className = 'imgWrap';
        PreviewImg.className = 'PreviewImg';
        BlendModeImg.className = 'BlendModeImg';
        ImageIcon.className = 'ImageIcon';

        // add Selected
        SelectedImgList.forEach(function(element) {
            element().classList.add('selected');
        });

        // appendChild
        ImgContainer.appendChild(ImgMaskContainer);
        ImgMaskContainer.appendChild(PreviewImgContainer);
        PreviewImgContainer.appendChild(RoundedContainer);
        RoundedContainer.appendChild(imgWrap);
        imgWrap.appendChild(PreviewImg);
        imgWrap.appendChild(BlendModeImg);
        imgIconsContainer.appendChild(ImageIcon);
        
        // Unique Value
        const existingImageIcons = document.querySelectorAll('.imgIconsContainer .ImageIcon');
        const existingValues = Array.from(existingImageIcons).map(icon => parseInt(icon.getAttribute('data-value'), 10));
        const uniqueValue = generateUniqueValue(existingValues);
        SelectedImgList.forEach(function(element) {
            element().setAttribute('data-value', uniqueValue);
        });
        
        ImageIcon.onclick = ImgIconSelected;
        
        // Max Capacite 
        if (existingImageIcons.length + 1 === 8) {
            if (UploadImageLabel) {
                UploadImageLabel.style.display = 'none';
                FullUploaded.style.display = 'flex';
            }
        }
        
        // Styles Changes
        previewContainer.style.cursor = 'move';
        ImgControls.style.display = 'block';
        IconsContainer.style.display = 'flex';
        UploadImageLabelP.style.display = 'none';
        
        // Img File
        reader.onload = function (e) {
            var imageSrc = e.target.result;
            PreviewImg.onload = function() {
                CenterPosition(PreviewImgContainer, ImgContainer);
                updateImgCustomizations();
                ImgSelectorUpdate();
            };
            PreviewImg.src = imageSrc;
            ImageIcon.src = imageSrc;
        };
        reader.readAsDataURL(input.files[0]);
        imageUpload.value = '';
    }
}

imageUpload.addEventListener('change', function () {
    SelectedImgList.forEach(function(element) {
        if (element()) {
            element().classList.remove('selected');
        }
    });
    loadImage(this);
});

function deselectImg() {
    SelectedImgList.forEach(element => {
        if (element()) {
            element().classList.remove('selected');
        }
    });
    ImgMaskContainer = null;
    PreviewImgContainer = null;
    RoundedContainer = null;
    PreviewImg = null;
    BlendModeImg = null;
    ImageIcon = null;
    ImgSelector.classList.remove('selected');
    previewContainer.style.cursor = 'unset';
    ImgControls.style.display = 'none';
}

function ImgIconSelected() {
    if (this.classList.contains('selected')) {
        deselectImg();
    } else {
        const AllElements = document.querySelectorAll('.ImgMaskContainer, .PreviewImgContainer, .RoundedContainer, .PreviewImg, .BlendModeImg, .ImageIcon');
        const dataValue = this.getAttribute('data-value');
        AllElements.forEach((element) => {
                if (element.classList.contains('selected')) {
                    element.classList.remove('selected');
                }
                if (element.getAttribute('data-value') === dataValue) {
                    element.classList.add('selected');
                }
        });
        ImgMaskContainer = document.querySelector('.ImgMaskContainer.selected');
        PreviewImgContainer = document.querySelector('.PreviewImgContainer.selected');
        RoundedContainer = document.querySelector('.RoundedContainer.selected');
        PreviewImg = document.querySelector('.PreviewImg.selected');
        BlendModeImg = document.querySelector('.BlendModeImg.selected');
        ImageIcon = document.querySelector('.ImageIcon.selected');
        previewContainer.style.cursor = 'move';
        ImgControls.style.display = 'block';
        updateImgCustomizations();
        ImgSelectorUpdate();
    }
}

//  IMG TOUCH POSITION

var startX, startY, offsetX, offsetY;
var PreviewScale = 1;
var TouchMoveGroup = [ImgContainer, ImgDragMove];

TouchMoveGroup.forEach((element) => {
    element.addEventListener('mousedown', function (event) {
        if (PreviewImgContainer) {
            startY = event.clientY;
            startX = event.clientX;
            var currentBottom = parseFloat(window.getComputedStyle(PreviewImgContainer).bottom) * PreviewScale;
            var currentLeft = PreviewImgContainer.offsetLeft * PreviewScale;
            var border = parseFloat(window.getComputedStyle(ImgSelector).border);
            document.onmousemove = function (e) {
                var movimentY = e.clientY - startY;
                var movimentX = e.clientX - startX;
                PreviewImgContainer.style.bottom = ((-movimentY + currentBottom) / PreviewScale) + 'px';
                PreviewImgContainer.style.left = ((movimentX + currentLeft) / PreviewScale) + 'px';
                var bottom = parseFloat(window.getComputedStyle(PreviewImgContainer).bottom);
                var left = parseFloat(window.getComputedStyle(PreviewImgContainer).left);
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
        if (PreviewImgContainer) {
            var touch = event.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            var currentBottom = parseFloat(window.getComputedStyle(PreviewImgContainer).bottom) * PreviewScale;
            var currentLeft = PreviewImgContainer.offsetLeft * PreviewScale;
            var border = parseFloat(window.getComputedStyle(ImgSelector).border);
            event.preventDefault();
            function TouchMove(event) {
                var touch = event.touches[0];
                var movimentX = touch.clientX - startX;
                var movimentY = touch.clientY - startY;
                PreviewImgContainer.style.bottom = ((-movimentY + currentBottom) / PreviewScale) + 'px';
                PreviewImgContainer.style.left = ((movimentX + currentLeft) / PreviewScale) + 'px';
                var bottom = parseFloat(window.getComputedStyle(PreviewImgContainer).bottom);
                var left = parseFloat(window.getComputedStyle(PreviewImgContainer).left);
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

//  CLEAR IMG

clearIconContainer.addEventListener('click', function() {
    if (PreviewImg) {
        ImgMaskContainer.remove();
        ImageIcon.remove();
        ImgControls.style.display = 'none';
        UploadImageLabel.style.display = 'flex';
        FullUploaded.style.display = 'none';
        ImgSelector.classList.remove('selected');
    }
    if (imgIconsContainer.childElementCount === 0) {
        IconsContainer.style.display = 'none';
        UploadImageLabelP.style.display = 'block';
    }
});

const BtnsChooseControlsImg = document.querySelectorAll('.BtnsChooseControlsImg');
const ControlImgContainer = document.querySelectorAll('.ControlImgContainer');

//  IMG CONSTROLS

BtnsChooseControlsImg.forEach((button, index) => {
    button.addEventListener('click', () => {
        BtnsChooseControlsImg.forEach(element => {
            element.classList.remove('selected');
        });
        BtnsChooseControlsImg[index].classList.add('selected');

        ControlImgContainer.forEach(element => {
            element.classList.remove('selected');
        });
        ControlImgContainer[index].classList.add('selected');
    });
});

function addTouchHoldListener(element, action) {
    if (element) {
        let isInteracting = false;
        let timer = null;
        let touchTimer = null;

        function startMoving() {
            if (element) {
                element.style.boxShadow = '0px 0px 30px red';
                function ContinueAction() {
                    action();
                    timer = setTimeout(ContinueAction, 100);
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
            if (element) {
                element.style.boxShadow = '';
            }
        }

        element.addEventListener('mousedown', () => {
            isInteracting = true;
            startMoving();
        });

        element.addEventListener('mouseup', stopMoving);
        element.addEventListener('mouseleave', stopMoving);

        element.addEventListener('touchstart', () => {
            isInteracting = true;
            touchTimer = setTimeout(() => {
                startMoving();
            }, 200);
        });

        element.addEventListener('touchmove', () => {
            clearTimeout(touchTimer);
        });

        element.addEventListener('touchend', stopMoving);
        element.addEventListener('touchcancel', stopMoving);
    }
}

//  IMG SIZE BTN

const Scale = 1;
const sizeLess = document.querySelector('.SizeLess');
const sizePlus = document.querySelector('.SizePlus');
const SizeLessLess = document.querySelector('.SizeLessLess');
const SizePlusPlus = document.querySelector('.SizePlusPlus');

ImgSizeControl.addEventListener('mousedown', function (event) {
    if (PreviewImgContainer) {
        startY = event.clientY;
        var currentHeight = PreviewImgContainer.offsetHeight * PreviewScale;
        var currentWidth = PreviewImgContainer.offsetWidth * PreviewScale;
        var Aspect = currentWidth / currentHeight;
        if (PreviewImgContainer.classList.contains('rounded'))  {
            var ImgcurrentWidth = parseFloat(window.getComputedStyle(PreviewImg).width) * PreviewScale;
            var ImgAspect = ImgcurrentWidth / currentHeight;
        }
        document.onmousemove = function (e) {
            var moviment = e.clientY - startY;
            var height = ((-moviment + currentHeight) / PreviewScale) + 'px';
            PreviewImgContainer.style.height = height;
            PreviewImg.style.height = height;
            BlendModeImg.style.height = height;
            if (PreviewImgContainer.classList.contains('rounded')) {
                var width = ((-moviment * ImgAspect) + ImgcurrentWidth) / PreviewScale + 'px';
                PreviewImgContainer.style.width = width;
                PreviewImg.style.width = width;
            } else {
                var width = ((-moviment * Aspect) + currentWidth) / PreviewScale + 'px';
                PreviewImgContainer.style.width = width;
                PreviewImg.style.width = width;
            }
            ImgSelector.style.height = PreviewImgContainer.offsetHeight + 'px';
            ImgSelector.style.width = PreviewImgContainer.offsetWidth + 'px';
            var bottom = parseFloat(window.getComputedStyle(PreviewImgContainer).bottom);
            ImgSelector.style.bottom = (bottom - 2) +'px';
            ImgSelector.style.left = (PreviewImgContainer.offsetLeft - 2) +'px';
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
    if (PreviewImgContainer) {
        var touch = event.touches[0];
        startY = touch.clientY;
        var currentHeight = PreviewImgContainer.offsetHeight * PreviewScale;
        var currentWidth = PreviewImgContainer.offsetWidth * PreviewScale;
        var Aspect = currentWidth / currentHeight;
        if (PreviewImgContainer.classList.contains('rounded'))  {
            var ImgcurrentWidth = parseFloat(window.getComputedStyle(PreviewImg).width) * PreviewScale;
            var ImgAspect = ImgcurrentWidth / currentHeight;
        }
        event.preventDefault();
        ImgSizeControl.addEventListener('touchmove', function (event) {
            var touch = event.touches[0];
            var moviment = touch.clientY - startY;
            var height = ((-moviment + currentHeight) / PreviewScale) + 'px';
            PreviewImgContainer.style.height = height;
            PreviewImg.style.height = height;
            BlendModeImg.style.height = height;
            if (PreviewImgContainer.classList.contains('rounded')) {
                var width = ((-moviment * ImgAspect) + ImgcurrentWidth) / PreviewScale + 'px';
                PreviewImgContainer.style.width = width;
                PreviewImg.style.width = width;
            } else {
                var width = ((-moviment * Aspect) + currentWidth) / PreviewScale + 'px';
                PreviewImgContainer.style.width = width;
                PreviewImg.style.width = width;
            }
            ImgSelector.style.height = PreviewImgContainer.offsetHeight + 'px';
            ImgSelector.style.width = PreviewImgContainer.offsetWidth + 'px';
            var bottom = parseFloat(window.getComputedStyle(PreviewImgContainer).bottom);
            ImgSelector.style.bottom = (bottom - 2) +'px';
            ImgSelector.style.left = (PreviewImgContainer.offsetLeft - 2) +'px';
            event.preventDefault();
        });
    }
});

ImgCutBtn.addEventListener('mousedown', function (event) {
    if (PreviewImgContainer) {
        startY = event.clientY;
        var currentHeight = PreviewImgContainer.offsetHeight * PreviewScale;
        var bottom = parseFloat(window.getComputedStyle(PreviewImgContainer).bottom) * PreviewScale;
        document.onmousemove = function (e) {
            var moviment = e.clientY - startY;
            var newBottom = ((-moviment + bottom) / PreviewScale)  + 'px';
            var newBottom = (-moviment + bottom) / PreviewScale + 'px';
            PreviewImgContainer.style.height = (moviment + currentHeight) / PreviewScale + 'px';
            PreviewImgContainer.style.bottom = newBottom;
            PreviewImg.style.height = PreviewImgContainer.offsetHeight + 'px';
            BlendModeImg.style.height = PreviewImgContainer.offsetHeight + 'px';
            ImgSelector.style.height = PreviewImgContainer.offsetHeight + 'px';
            ImgSelector.style.width = PreviewImgContainer.offsetWidth + 'px';
            ImgSelector.style.bottom = parseFloat(newBottom) - 2 + 'px';
            ImgSelector.style.left = (PreviewImgContainer.offsetLeft - 2) + 'px';
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
    if (PreviewImgContainer) {
        var touch = event.touches[0];
        startY = touch.clientY;
        var currentHeight = PreviewImgContainer.offsetHeight * PreviewScale;
        var bottom = parseFloat(window.getComputedStyle(PreviewImgContainer).bottom) * PreviewScale;
        event.preventDefault();
        function handleTouchMove(event) {
            var touch = event.touches[0];
            var moviment = touch.clientY - startY;
            var newBottom = (-moviment + bottom) / PreviewScale + 'px';
            PreviewImgContainer.style.height = (moviment + currentHeight) / PreviewScale + 'px';
            PreviewImgContainer.style.bottom = newBottom;
            PreviewImg.style.height = PreviewImgContainer.offsetHeight + 'px';
            BlendModeImg.style.height = PreviewImgContainer.offsetHeight + 'px';
            ImgSelector.style.height = PreviewImgContainer.offsetHeight + 'px';
            ImgSelector.style.width = PreviewImgContainer.offsetWidth + 'px';
            ImgSelector.style.bottom = parseFloat(newBottom) - 2 + 'px';
            ImgSelector.style.left = (PreviewImgContainer.offsetLeft - 2) + 'px';
            event.preventDefault();
        }
        ImgCutBtn.addEventListener('touchmove', handleTouchMove);
        ImgCutBtn.addEventListener('touchend', function () {
            ImgCutBtn.removeEventListener('touchmove', handleTouchMove);
        });
    }
});

function updateScale(Scale) {
    var currentHeight = PreviewImgContainer.offsetHeight;
    PreviewImgContainer.style.height = currentHeight + Scale + 'px';
    var bottom = parseFloat(window.getComputedStyle(PreviewImgContainer).bottom);
    var left = PreviewImgContainer.offsetLeft;
    ImgSelector.style.height = PreviewImgContainer.offsetHeight;
    ImgSelector.style.width = PreviewImgContainer.offsetWidth;
    ImgSelector.style.bottom = (bottom - 4) +'px';
    ImgSelector.style.left = (left - 4) +'px';
}

function LessLessSize() {
    updateScale(-Scale * 2);
}

function LessSize() {
    updateScale(-Scale);
}

function PlusSize() {
    updateScale(Scale);
}

function PlusPlusSize() {
    updateScale(Scale * 2);
}

addTouchHoldListener(sizeLess, LessSize);
addTouchHoldListener(sizePlus, PlusSize);
addTouchHoldListener(SizeLessLess, LessLessSize);
addTouchHoldListener(SizePlusPlus, PlusPlusSize);

//  LAYER BUTTONS

const botaoSubir = document.querySelector('.LayerUp');
const botaoDescer = document.querySelector('.LayerDown');

botaoDescer.addEventListener('click', () => {
    const pai = PreviewImgContainer.parentNode;
    const paipai = pai.parentNode;
    const irmaoAnterior = pai.previousElementSibling;

    if (irmaoAnterior) {
        paipai.insertBefore(pai, irmaoAnterior);
    }
});

botaoSubir.addEventListener('click', () => {
    const pai = PreviewImgContainer.parentNode;
    const paipai = pai.parentNode;
    const irmaoSeguinte = pai.nextElementSibling;

    if (irmaoSeguinte) {
        paipai.insertBefore(irmaoSeguinte, pai);
    }
});

//  IMG MASK SELECTOR

const MaskImgFalse = document.querySelector('.MaskImgFalse');
const MaskImgTrue = document.querySelector('.MaskImgTrue');

MaskImgFalse.addEventListener('click', () => {
    PreviewImgContainer.parentNode.classList.remove('masked');
});

MaskImgTrue.addEventListener('click', () => {
    PreviewImgContainer.parentNode.classList.add('masked');
});

//  IMG EFFECTS

const BtnImgEffect = document.querySelectorAll('.BtnImgEffect');
const ImgEffect = document.querySelectorAll('.ImgEffect');

BtnImgEffect.forEach((button, index) => {
    button.addEventListener('click', () => {
        BtnImgEffect.forEach(element => {
            element.classList.remove('selected');
        });
        BtnImgEffect[index].classList.add('selected');

        ImgEffect.forEach(element => {
            element.classList.remove('selected');
        });
        ImgEffect[index].classList.add('selected');
    });
});

//  UPDATE IMG CUSTOMIZATION

function updateImgCustomizations() {
    actualImgFilter();
    actualImgColor();
    actualRoundedStyle();
}

//  ALL INPUT RANGE FUNCTION

function InputRangeFunction(InputRange, Attribute, update) {
    InputRange.addEventListener('input', function() {
        NewValue = InputRange.value;
        PreviewImg.setAttribute(Attribute, NewValue);
        sliderStyle(InputRange);
        update();
    });
}

function sliderStyle(Slider) {
    var percentage = (Slider.value - Slider.min) / (Slider.max - Slider.min) * 100;
    var colorBefore = '#000';
    var colorAfter = '#fff';
    var gradient = 'linear-gradient(to right, ' + colorBefore + ' 0%, ' + colorBefore + ' ' + percentage + '%, ' + colorAfter + ' ' + percentage + '%, ' + colorAfter + ' 100%)';
    Slider.style.background = gradient;
}

//  COPY AND PASTE FUNCTIONS

const CopyColorBtn = document.querySelectorAll('.CopyColorBtn');
const PasteColorBtn = document.querySelectorAll('.PasteColorBtn');

CopyColorBtn.forEach(function(CopyBtn) {
    CopyBtn.addEventListener('click', function() {
        if (this) {
            var value = this.previousElementSibling.getAttribute('data-current-color');
            PasteColorBtn.forEach(function(PasteBtn) {
                PasteBtn.style.background = value;
                PasteBtn.setAttribute('color', value);
            });
        }
    });
});

function PastColor(button, inputColor) {
    var color = button.getAttribute('color');
    changeInputColor(inputColor, color);
}

CopyColorBtn.forEach(button => {
    button.style.background = button.nextElementSibling.value;
});

//  ALL JSCOLOR INPUT FUNCTION

jscolor.presets.default = {
    width:250, height:165, closeButton:true, closeText:'', sliderSize:20
};

function updateJSColor(picker, selector) {
    document.querySelector(selector).style.background = picker.toBackground();
}

function InputJsColorFunction(InputJsColor, getSelectedElement, Attribute, update) {
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

function changeInputColor(InputColor, color) {
    InputColor.value = color;
    var event = new Event('input', {
        bubbles: true,
        cancelable: true
    });
    InputColor.dispatchEvent(event);
}

//  DROP-SHADOW IMG EFFECT

const ImgShadow = document.querySelector('.ImgShadow');
const InputImgShadowColor = document.querySelector('.InputImgShadowColor');

InputRangeFunction(ImgShadow,'dropshadowvalue', updateImgDropShadow);
InputJsColorFunction(InputImgShadowColor, () => PreviewImg, 'DropShadowColor', updateImgDropShadow);

function updateImgDropShadow() {
    ImgShadowValue = PreviewImg.getAttribute('DropShadowValue');
    ImgShadowColorValue = PreviewImg.getAttribute('DropShadowColor');
    PreviewImg.style.filter = 'drop-shadow('+ ImgShadowColorValue +' 0px 0px '+ ImgShadowValue +'px)';
}

function actualImgFilter() {
    if (PreviewImg.getAttribute('DropShadowValue')) {
        ImgShadow.value = PreviewImg.getAttribute('DropShadowValue');
    } else {
        PreviewImg.setAttribute('DropShadowValue', 0)
        ImgShadow.value = 0;
    }
    sliderStyle(ImgShadow);
    if (PreviewImg.getAttribute('DropShadowColor')) {
        var DropShadowColor = PreviewImg.getAttribute('DropShadowColor');
        changeInputColor(InputImgShadowColor, DropShadowColor);
    } else {
        PreviewImg.getAttribute('DropShadowColor', '#FFFFFF')
        changeInputColor(InputImgShadowColor, '#FFFFFF');
    }
}

//  GRADIENT IMG EFFECT  

const ImgGradient = document.querySelectorAll('.ImgGradient');

ImgGradient.forEach((element) => {
    element.addEventListener('click', function() {
        if (this.classList.contains('With')) {
            PreviewImg.classList.add('gradientMask');
            updateImgColor();
        } else {
            PreviewImg.classList.remove('gradientMask');
            updateImgColor();
        }
    });
});

//  COLOR IMG EFFECT

const OptionImgColorEffect = document.querySelectorAll('.OptionImgColorEffect');
const ImgColorEffectContainer = document.querySelector('.ImgColorEffectContainer');
const InputImgColor = document.querySelector('.InputImgColor');
const BlendModeColor = '#7fffd4';
const BlendModeStyle = 'color';

OptionImgColorEffect.forEach((element) => {
    element.addEventListener('click', function() {
        if (this.classList.contains('With')) {
            if (!BlendModeImg.classList.contains('blended')) {
                BlendModeImg.classList.add('blended');
                BlendModeImg.style.webkitMaskImage = `url(${PreviewImg.src})`;
                BlendModeImg.style.maskImage = `url(${PreviewImg.src})`;
                updateImgColor();
                ImgColorEffectContainer.classList.add('selected');
                OptionImgColorEffect[0].classList.remove('selected');
                OptionImgColorEffect[1].classList.add('selected');
            }
        } else {
            if (BlendModeImg.classList.contains('blended')) {
                BlendModeImg.classList.remove('blended')
                ImgColorEffectContainer.classList.remove('selected');
                OptionImgColorEffect[0].classList.add('selected');
                OptionImgColorEffect[1].classList.remove('selected');
            }
        }
    });
});

InputJsColorFunction(InputImgColor, () => PreviewImg, 'BlendModeColor', updateImgColor);

function updateImgColor() {
    if (BlendModeImg) {
        var Color = PreviewImg.getAttribute('BlendModeColor');
        var Style = PreviewImg.getAttribute('BlendModeStyle');
        if (PreviewImg.classList.contains('gradientMask')) {
            BlendModeImg.style.background = 'linear-gradient(to top, transparent 10%, '+Color+' 30%)';
        } else {
            BlendModeImg.style.background = Color;
        }
        BlendModeImg.style.mixBlendMode = Style;
    }
}

function actualImgColor() {
    if (BlendModeImg.classList.contains('blended')) {
        var Color = PreviewImg.getAttribute('BlendModeColor');
        changeInputColor(InputImgColor, Color);
        ImgColorEffectContainer.classList.add('selected');
        OptionImgColorEffect[0].classList.remove('selected');
        OptionImgColorEffect[1].classList.add('selected');
    } else {
        if (!PreviewImg.getAttribute('BlendModeColor')) {
            PreviewImg.setAttribute('BlendModeColor', BlendModeColor);
            PreviewImg.setAttribute('BlendModeStyle', BlendModeStyle);
        }
        var Color = PreviewImg.getAttribute('BlendModeColor');
        changeInputColor(InputImgColor, Color);
        ImgColorEffectContainer.classList.remove('selected');
        OptionImgColorEffect[0].classList.add('selected');
        OptionImgColorEffect[1].classList.remove('selected');
    }
}

//  ROUNDED IMG EFFECT

const RoundedSelector = document.querySelector('.RoundedSelector');
const RoundedEffectOptions = document.querySelector('.RoundedEffectOptions');
const RoundedOptions = document.querySelectorAll('.RoundedOptions');
const RoundedCustomContainer = document.querySelectorAll('.RoundedCustomContainer');
const InputRoundedBorderColor = document.querySelector('.InputRoundedBorderColor');
const InputRoundedBGColor = document.querySelector('.InputRoundedBGColor');
const InputRoundedShadowColor = document.querySelector('.InputRoundedShadowColor');

RoundedSelector.addEventListener('click', function() {
    if (RoundedSelector.classList.contains('selected')) {
        RoundedSelector.classList.remove('selected');
        PreviewImgContainer.classList.remove('rounded');
        RoundedContainer.classList.remove('rounded');
        PreviewImg.classList.remove('rounded');
        RoundedEffectOptions.classList.remove('selected');
        RoundedOptions.forEach(element => {
            element.classList.remove('selected');
        });
        RoundedCustomContainer.forEach(element => {
            element.classList.remove('selected');
        });
        updateRounded();
        ImgSelectorUpdate();
    } else {
        RoundedSelector.classList.add('selected');
        PreviewImgContainer.classList.add('rounded');
        RoundedContainer.classList.add('rounded');
        PreviewImg.classList.add('rounded');
        RoundedEffectOptions.classList.add('selected');
        RoundedOptions[0].classList.add('selected');
        RoundedCustomContainer[0].classList.add('selected');
        updateRounded();
        ImgSelectorUpdate();
    }
});

RoundedOptions.forEach((button, index) => {
    button.addEventListener('click', () => {
        RoundedOptions.forEach(element => {
            element.classList.remove('selected');
        });
        RoundedOptions[index].classList.add('selected');

        RoundedCustomContainer.forEach(element => {
            element.classList.remove('selected');
        });
        RoundedCustomContainer[index].classList.add('selected');
    });
});

InputJsColorFunction(InputRoundedBorderColor, () => PreviewImg, 'RoundedBorder', updateRounded);
InputJsColorFunction(InputRoundedBGColor, () => PreviewImg, 'RoundedBG', updateRounded);
InputJsColorFunction(InputRoundedShadowColor, () => PreviewImg, 'RoundedShadowColor', updateRounded);
let DefaultRoundedBorder = '#ffd700';
let DefaultRoundedBG = '#000000';
let DefaultRoundedShadowColor = '#ffd700';
let DefaultRoundedShadowValue = '20';
let ActualValueShadowColor = null;
let ActualValueShadowValue = null;

function updateRounded() {
    var background = PreviewImg.getAttribute('RoundedBG');
    var Border = PreviewImg.getAttribute('RoundedBorder');
    ActualValueShadowColor = PreviewImg.getAttribute('RoundedShadowColor');
    ActualValueShadowValue = PreviewImg.getAttribute('RoundedShadowValue');
    if (RoundedContainer.classList.contains('rounded')) {
        RoundedContainer.style.borderColor = Border;
        RoundedContainer.style.background = background;
        RoundedContainer.style.boxShadow = '0px 0px ' + ActualValueShadowValue + 'px' + ActualValueShadowColor;;
    } else {
        RoundedContainer.style.borderColor = '';
        RoundedContainer.style.background = '';
        RoundedContainer.style.boxShadow = '';
    }
}

function actualRoundedStyle() {
    if (PreviewImg.getAttribute('RoundedBorder')) {
        var ActualValueBorder = PreviewImg.getAttribute('RoundedBorder');
        changeInputColor(InputRoundedBorderColor, ActualValueBorder);
        var ActualValueBG = PreviewImg.getAttribute('RoundedBG');
        changeInputColor(InputRoundedBGColor, ActualValueBG);
        ActualValueShadowValue = PreviewImg.getAttribute('RoundedShadowValue');
        ActualValueShadowColor = PreviewImg.getAttribute('RoundedShadowColor');
        changeInputColor(InputRoundedShadowColor, ActualValueShadowColor);
        updateRounded();
    } else {
        PreviewImg.setAttribute('RoundedBorder', DefaultRoundedBorder);
        changeInputColor(InputRoundedBorderColor, DefaultRoundedBorder);
        PreviewImg.setAttribute('RoundedBG', DefaultRoundedBG);
        changeInputColor(InputRoundedBGColor, DefaultRoundedBG);
        ActualValueShadowValue = DefaultRoundedShadowValue;
        PreviewImg.setAttribute('RoundedShadowValue', ActualValueShadowValue);
        ActualValueShadowColor = DefaultRoundedShadowColor;
        PreviewImg.setAttribute('RoundedShadowColor', DefaultRoundedShadowColor);
        changeInputColor(InputRoundedShadowColor, ActualValueShadowColor);
        updateRounded();
    }
    if (!PreviewImg.classList.contains('rounded')) {
        RoundedSelector.classList.remove('selected');
        RoundedEffectOptions.classList.remove('selected');
        RoundedOptions.forEach(element => {
            element.classList.remove('selected');
        });
        RoundedCustomContainer.forEach(element => {
            element.classList.remove('selected');
        });
    } else {
        RoundedSelector.classList.add('selected');
        RoundedEffectOptions.classList.add('selected');
    }
}

//  ROUNDED BORDER SIZE

const LessRoundedBorder = document.querySelector('.LessRoundedBorder');
const MoreRoundedBorder = document.querySelector('.MoreRoundedBorder');

function RoundedBorderLess() {
    var border = parseFloat(window.getComputedStyle(RoundedContainer).borderWidth);
    RoundedContainer.style.borderWidth = border - 1 +'px';
}

function RoundedBorderMore() {
    var border = parseFloat(window.getComputedStyle(RoundedContainer).borderWidth);
    if (border < 15) {
        RoundedContainer.style.borderWidth = border + 1 +'px';
    }
}

addTouchHoldListener(LessRoundedBorder, RoundedBorderLess);
addTouchHoldListener(MoreRoundedBorder, RoundedBorderMore);

// ROUNDED SHADOW SIZE

function getBlurValue(boxShadow) {
    const match = boxShadow.match(/0px 0px (\d+)px/);
    return match ? parseInt(match[1], 10) : 0;
}

function RoundedShadowLess() {
    var style = window.getComputedStyle(RoundedContainer);
    var currentBoxShadow = style.boxShadow;
    var currentBlurValue = getBlurValue(currentBoxShadow);
    ActualValueShadowValue = Math.max(currentBlurValue - 1, 0);
    PreviewImg.setAttribute('RoundedShadowValue', ActualValueShadowValue);
    RoundedContainer.style.boxShadow = '0px 0px ' + ActualValueShadowValue + 'px' + ActualValueShadowColor;
}

function RoundedShadowMore() {
    var style = window.getComputedStyle(RoundedContainer);
    var currentBoxShadow = style.boxShadow;
    var currentBlurValue = getBlurValue(currentBoxShadow);
    ActualValueShadowValue = Math.min(currentBlurValue + 1, 20);
    PreviewImg.setAttribute('RoundedShadowValue', ActualValueShadowValue);
    RoundedContainer.style.boxShadow = '0px 0px ' + ActualValueShadowValue + 'px' + ActualValueShadowColor;
}

const LessRoundedShadow = document.querySelector('.LessRoundedShadow');
const MoreRoundedShadow = document.querySelector('.MoreRoundedShadow');

addTouchHoldListener(LessRoundedShadow, RoundedShadowLess);
addTouchHoldListener(MoreRoundedShadow, RoundedShadowMore);


//  TEXT CUSTOMIZATION 

const btnOptionText = document.querySelectorAll('.btnOptionText');
const OptionTextContainer = document.querySelectorAll('.OptionTextContainer');

btnOptionText.forEach((button, index) => {
    button.addEventListener('click', () => {
        btnOptionText.forEach(element => {
            element.classList.remove('selected');
        });
        btnOptionText[index].classList.add('selected');
        OptionTextContainer.forEach(element => {
            element.classList.remove('selected');
        });
        OptionTextContainer[index].classList.add('selected');
    });
});

const TextInput = document.querySelector('.TextInput');
const TextPreview = document.querySelector('.TextPreview');
const TextPreviewBG = document.querySelector('.TextPreviewBG');
const TextPreviewColor = document.querySelector('.TextPreviewColor');
let minLeft = null; 
let minRight = null;

function TextScaleX() {
    var fontSize = parseFloat(window.getComputedStyle(TextPreview).fontSize);
    var Space = parseFloat(window.getComputedStyle(TextPreview).letterSpacing);
    if (!minLeft == 0) {
        TextPreview.style.paddingLeft = fontSize * minLeft + "px";
    }
    if (!minRight == 0) {
        TextPreview.style.paddingRight = fontSize * minRight + "px";
    }    
    if (TextPreview.offsetWidth > ImgContainer.offsetWidth) {
        const scale = ImgContainer.offsetWidth / TextPreview.offsetWidth;
        TextPreview.style.transform = `scaleX(${scale})`;
        TextPreview.style.marginRight = -(Space * scale) + 'px';
    } else {
        TextPreview.style.transform = '';
        TextPreview.style.marginRight = `-${Space}px`;
    }
}

window.onload = ()=> {
    TextScaleX();
};

TextInput.addEventListener('input', function() {
    TextPreviewBG.innerText = TextInput.value;
    TextPreviewColor.innerText = TextInput.value;
    TextScaleX();
});

const FontSizeValue = 1;
const TextSize2xLess = document.querySelector('.TextSize2xLess');
const TextSizeLess = document.querySelector('.TextSizeLess');
const TextSizePlus = document.querySelector('.TextSizePlus');
const TextSize2xPlus = document.querySelector('.TextSize2xPlus');

function textSize(scale) {
    var SizeNow = parseFloat(window.getComputedStyle(TextPreview).fontSize);
    TextPreview.style.fontSize = SizeNow + scale +'px';
    TextScaleX();
}

function Size2xLessText() {
    textSize(-FontSizeValue * 2);
}

function SizeLessText() {
    textSize(-FontSizeValue);
}

function SizePlusText() {
    textSize(FontSizeValue);
}

function Size2xPlusText() {
    textSize(FontSizeValue * 2);
}

addTouchHoldListener(TextSize2xLess, Size2xLessText);
addTouchHoldListener(TextSizeLess, SizeLessText);
addTouchHoldListener(TextSizePlus, SizePlusText);
addTouchHoldListener(TextSize2xPlus, Size2xPlusText);

const LessLetterSpacing = document.querySelector('.LessLetterSpacing');
const MoreLetterSpacing = document.querySelector('.MoreLetterSpacing');
const LetterSpacingValue = 1;

function LetterSpacing(Spacing) {
    var SpacingNow = parseFloat(window.getComputedStyle(TextPreview).letterSpacing);
    var newSpacing = SpacingNow + Spacing;
    if (newSpacing < LetterSpacingValue) {
        newSpacing = LetterSpacingValue;
    }
    TextPreview.style.letterSpacing = newSpacing + 'px';
    TextScaleX();
}

function LetterSpacingLess() {
    LetterSpacing(-LetterSpacingValue);
}

function LetterSpacingMore() {
    LetterSpacing(LetterSpacingValue);
}

addTouchHoldListener(LessLetterSpacing, LetterSpacingLess);
addTouchHoldListener(MoreLetterSpacing, LetterSpacingMore);

const TextUp = document.querySelector('.TextUp');
const TextDown = document.querySelector('.TextDown');
const stepText = 1;

function TextMoveUp() { 
    var TextTopValue = parseFloat(window.getComputedStyle(TextPreview).top);
    TextPreview.style.top = TextTopValue - stepText + 'px';
}

function TextMoveDown() {
    var TextTopValue = parseFloat(window.getComputedStyle(TextPreview).top);
    TextPreview.style.top = TextTopValue + stepText + 'px';
}

addTouchHoldListener(TextUp, TextMoveUp);
addTouchHoldListener(TextDown, TextMoveDown);

//  TEXT FONT FAMILY

const fontFamilyLinks = [
    LinkAssets + 'Bootleg/Fonts/alfa-slab-one/AlfaSlabOne-Regular.ttf',
    LinkAssets + 'Bootleg/Fonts/amos-normal-maisfontes.b214/amos-normal.ttf',
    LinkAssets + 'Bootleg/Fonts/army_rust/ARMYRUST.ttf',
    LinkAssets + 'Bootleg/Fonts/ataxia-brk/Ataxia.ttf',
    LinkAssets + 'Bootleg/Fonts/bodoni-poster_Gw4Y3/BodoniPoster/BodoniPoster.otf',
    LinkAssets + 'Bootleg/Fonts/cloister_black/CloisterBlack.ttf',
    LinkAssets + 'Bootleg/Fonts/cooper-std-black-maisfontes.ed43/cooper-std-black.otf',
    LinkAssets + 'Bootleg/Fonts/coverface-se-font/CoverfaceSeBold-Yw2O.ttf',
    LinkAssets + 'Bootleg/Fonts/fusion-sans/PFFusionSansPro-Black-subset.otf',
    LinkAssets + 'Bootleg/Fonts/revue-maisfontes.99f9/revue.otf',
    LinkAssets + 'Bootleg/Fonts/soccer_league/SoccerLeague.ttf',
    LinkAssets + 'Bootleg/Fonts/wanted_m54/WantedM54.ttf',
    //'Fonts/brush-script-std_EOAtM/BrushScriptStd/BrushScriptStdMedium/BrushScriptStdMedium.ttf',
    //'Fonts/choc-std-regular/ChocStdRegular/ChocStdRegular.otf',
    //'Fonts/detonate_brk/detonate.ttf',
    //'Fonts/mistral-maisfontes.b5f1/mistral.ttf',
    //'Fonts/stencil-std/StencilStd.otf',
    //'Fonts/TextFonts.net_ole-ingrish-font-1239226/OleIngrish.ttf',
    //'Fonts/top_secret_kb/TopSecret.ttf',
]

const FontFamilyContainer = document.querySelector('.FontFamilyContainer');

function createFontSelector() {
    fontFamilyLinks.forEach((link, index) => {
        var button = document.createElement('div');
        button.className = 'FontFamilySelector';
        var fontFamilyName = 'Font' + (index + 1);
        if (index === 0) {
            button.classList.add('selected');
            TextPreview.style.fontFamily = 'Font' + (index + 1);
        }
        button.style.fontFamily = fontFamilyName;
        button.innerText = 'A';
        FontFamilyContainer.appendChild(button);

        var css = '@font-face {' +
            'font-family: "' + fontFamilyName + '";' +
            'src: url(' + link + ') format("truetype");' +
        '}';
        StyleCss.appendChild(document.createTextNode(css));
    });
}

createFontSelector();

const FontFamilySelector = document.querySelectorAll('.FontFamilySelector');

FontFamilySelector.forEach((button, index) => {
    button.addEventListener('click', () => {
        FontFamilySelector.forEach(element => {
            element.classList.remove('selected');
        });
        button.classList.add('selected');
        TextPreview.style.fontFamily = button.style.fontFamily;
        minLeft = button.getAttribute('min-left');
        minRight = button.getAttribute('min-right');
        TextPreview.setAttribute('min-left', minLeft);
        TextPreview.setAttribute('min-right', minRight);
        TextScaleX();
    });
});


//  TEXT BACKGROUND

const BackgroundTextLinks = [
    LinkAssets + 'Bootleg/Font-Textures/1.svg',
    'linear-gradient(0deg, white 100%, transparent 0%)',
    LinkAssets + 'Bootleg/Font-Textures/2.svg',
    LinkAssets + 'Bootleg/Font-Textures/3.svg',
    LinkAssets + 'Bootleg/Font-Textures/4.svg',
    LinkAssets + 'Bootleg/Font-Textures/5.svg',
    LinkAssets + 'Bootleg/Font-Textures/6.svg',
    LinkAssets + 'Bootleg/Font-Textures/7.svg',
    LinkAssets + 'Bootleg/Font-Textures/8.svg',
]
const BackgroundTextEffect = document.querySelector('.BackgroundTextEffect');

function creatBackgroundText() {
    BackgroundTextLinks.forEach((link, index) => {
        var button = document.createElement('div');
        button.className = 'btnBackgroundText';
        var colorCont = document.createElement('div');
        colorCont.className = 'btnBackgroundTextColor';
        colorCont.style = 'height: 100%; width: 100%; background-color: var(--text-color); mix-blend-mode: multiply;';
        button.appendChild(colorCont);
        if (index === 0) {
            button.classList.add('selected');
            TextPreviewBG.style.backgroundImage = `url(${link})`;
        }
        button.style.backgroundImage = `url(${link})`;
        BackgroundTextEffect.appendChild(button);
    });
}

creatBackgroundText();

const btnBackgroundText = document.querySelectorAll('.btnBackgroundText');
const btnBackgroundTextColor = document.querySelectorAll('.btnBackgroundTextColor');

btnBackgroundText.forEach((button, index) => {
    button.addEventListener('click', () => {
        btnBackgroundText.forEach(element => {
            element.classList.remove('selected');
        });
        btnBackgroundText[index].classList.add('selected');
        TextPreviewBG.style.backgroundImage = btnBackgroundText[index].style.backgroundImage;
    });
});

//  TEXT COLOR

const InputTextColor = document.querySelector('.InputTextColor');

InputJsColorFunction(InputTextColor, '', '', updateTextColor);

function updateTextColor() {
    TextPreviewColor.style.backgroundColor = NewValue;
    btnBackgroundTextColor.forEach(element => {
        element.style.backgroundColor = NewValue;
    });
}

//  TEXT STROKE WIDTH

const TextStrokeLess = document.querySelector('.TextStrokeLess');
const TextStrokePlus = document.querySelector('.TextStrokePlus');

function StrokeLessText() {
    var Stroke = parseFloat(window.getComputedStyle(TextPreview).webkitTextStrokeWidth);
    TextPreview.style.webkitTextStrokeWidth = Stroke - 1 +'px';
    TextPreviewBG.style.padding = '0px ' + ((Stroke - 1) / 2) +'px';
    TextScaleX();
}

function StrokePlusText() {
    var Stroke = parseFloat(window.getComputedStyle(TextPreview).webkitTextStrokeWidth);
    if (Stroke < 10) {
        TextPreview.style.webkitTextStrokeWidth = Stroke + 1 +'px';
        TextPreviewBG.style.padding = '0px ' + ((Stroke + 1) / 2) +'px';
        TextScaleX();
    }
}

addTouchHoldListener(TextStrokeLess, StrokeLessText);
addTouchHoldListener(TextStrokePlus, StrokePlusText);

//  TEXT STROKE COLOR

const InputStrokeColor = document.querySelector('.InputStrokeColor');

InputJsColorFunction(InputStrokeColor, '', '', updateStrokeColor);

function updateStrokeColor() {
    TextPreview.style.webkitTextStrokeColor = NewValue;
}

//  BACKGROUND CUSTOMIZATION

const InputBgColor = document.querySelector('.InputBgColor');
const ImgContainerMasked = document.querySelector('.ImgContainerMasked');
const ImgContainerColor = document.querySelector('.ImgContainerColor');

InputJsColorFunction(InputBgColor, () => ImgContainerColor, 'BgColor', updateBgColor);

function updateBgColor() {
    ImgContainerColor.style.backgroundColor = NewValue;
}

//  BG MASK

const maskLinks = [
    LinkAssets + 'Bootleg/Mask/Mask-1.svg',
    LinkAssets + 'Bootleg/Mask/Mask-2.svg',
    LinkAssets + 'Bootleg/Mask/Mask-3.svg',
    LinkAssets + 'Bootleg/Mask/Mask-4.svg',
    LinkAssets + 'Bootleg/Mask/Mask-5.svg',
    LinkAssets + 'Bootleg/Mask/Mask-6.svg',
];

const ContMask = document.querySelector('.BackgroundCustomOptions.Mask');

function CreatMaskOptions() {
    maskLinks.forEach((link, index) => {
        var divMask = document.createElement('img')
        divMask.className = 'BgOption Mask';
        divMask.src = link;
        if (index === 0) {
            divMask.classList.add('selected');
            var Mask = `url(${link})`;
            document.documentElement.style.setProperty('--mask-image', Mask)
        }
        ContMask.appendChild(divMask);
    });
}

CreatMaskOptions();

const BgOptionMask = document.querySelectorAll('.BgOption.Mask');
BgOptionMask.forEach((button, index) => {
    button.addEventListener('click', function() {
        BgOptionMask.forEach(button => {
            button.classList.remove('selected');
        });
        button.classList.add('selected');
        var Mask = `url(${maskLinks[index]})`;
        document.documentElement.style.setProperty('--mask-image', Mask);
    });
});

//  BG TEXTURES

const TextureLinks = [
    LinkAssets + 'Bootleg/Textures/Tex-1.svg',
    LinkAssets + 'Bootleg/Textures/Tex-2.svg',
    LinkAssets + 'Bootleg/Textures/Tex-3.svg',
    LinkAssets + 'Bootleg/Textures/Tex-4.svg',
    LinkAssets + 'Bootleg/Textures/Tex-5.svg',
    LinkAssets + 'Bootleg/Textures/Tex-6.svg',
    LinkAssets + 'Bootleg/Textures/Tex-7.svg',
    LinkAssets + 'Bootleg/Textures/Tex-8.svg',
    LinkAssets + 'Bootleg/Textures/Tex-9.svg',
    LinkAssets + 'Bootleg/Textures/Tex-10.svg',
    LinkAssets + 'Bootleg/Textures/Tex-11.svg',
];

const ContTexture = document.querySelector('.BackgroundCustomOptions.Texture');

function CreatTextureOptions() {
    TextureLinks.forEach((link, index) => {
        const Texture = document.createElement('div');
        Texture.className = 'BgOption Texture';
        if (index === 0) {
            Texture.classList.add('selected');
            ImgContainerMasked.style.backgroundImage = `url(${link})`;
        }
        Texture.style.backgroundImage = `url(${link})`;
        ContTexture.appendChild(Texture);
    });
}

CreatTextureOptions();

const BgOptionTexture = document.querySelectorAll('.BgOption.Texture');

BgOptionTexture.forEach((button, index) => {
    button.addEventListener('click', function() {
        BgOptionTexture.forEach(button => {
            button.classList.remove('selected');
        });
        button.classList.add('selected');
        ImgContainerMasked.style.backgroundImage = `url(${TextureLinks[index]})`;
    });
});

const ContainerCustomization = document.querySelector('.ContainerCustomization');
function resize() {
    var value1 = TshirtContainer.offsetWidth / window.innerWidth;
    TshirtContainer.style.setProperty('--resize', value1);
}
resize();

window.addEventListener('resize', resize);

const BtnBuyNow = document.querySelector('.BtnBuyNow');
const preview = document.querySelector('.preview');

BtnBuyNow.addEventListener('click', () => {
    var scale = 4961 / preview.offsetHeight;
    domtoimage.toPng(preview, {
        width: preview.clientWidth * scale,
        height: preview.clientHeight * scale,
        style: {
            transform: 'scale('+scale+')',
            transformOrigin: 'top left'
        }  
    })
    .then(function (dataUrl) {
        var img = new Image();
        img.className = 'PreviewFile';
        img.src = dataUrl;
        document.body.appendChild(img);
    });
});