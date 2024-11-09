const input = document.querySelector('.input');
const preview = document.querySelector('.preview');

const editor = document.createElement('div');
editor.className = 'editor';
const prImg = document.createElement('div');
const prSvg = document.createElement('div');
const inputsBox = document.createElement('div');

let inputTarget;

const brightness = document.createElement('input');
brightness.oninput = ()=> {
    
}
const contrast = document.createElement('input');
contrast.oninput = ()=> {
    
}
const highlights = document.createElement('input');
highlights.oninput = ()=> {
    
}
const shadows = document.createElement('input');
shadows.oninput = ()=> {
    
}
const whites = document.createElement('input');
whites.oninput = ()=> {
    
}
const blacks = document.createElement('input');
blacks.oninput = ()=> {
    
}

[brightness, contrast, highlights, shadows, whites, blacks].forEach(input=> {
    Object.assign(input, {type: 'range', min: -100, max: 100, value: 0 });
})

inputsBox.append(brightness, contrast, highlights, shadows, whites, blacks);

editor.append(prImg, prSvg, inputsBox);
console.log(editor);
document.body.append(editor);

function upCanvas() {
    
}

input.addEventListener('input', (event)=> {
    var file = event.target.files[0];
    var reader = new FileReader();
    var img = new Image();
    reader.onload = function () {
        img.onload = () => {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var scaleFactor = 1;
            var maxSize = 2000;
            if (img.width > maxSize || img.height > maxSize) {
                scaleFactor = Math.min(maxSize / img.width, maxSize / img.height);
            }
            var width = img.width * scaleFactor;
            var height = img.height * scaleFactor;
            
            img.width = width;
            img.height = height;
            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            prImg.replaceChildren(canvas);
            inputTarget = canvas;
        }
        img.src = reader.result;
        event.target.value = '';
    };
    reader.readAsDataURL(file);
});
