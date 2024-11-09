const frStyle = document.createElement("style");
frStyle.textContent = `.frButton {
    background: #fffff0;
    border: 2px solid #707aff;
    color: #707aff;
    border-radius: 20px;
    animation: bounce 2s ease infinite;
}

.frButton > p {
    margin: 5px;
}

@media screen and (max-width: 689px) {
    .frButton {
        position: fixed;
        bottom: 20px;
        left: 20px;
    }
}

.frPopup {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #000000c4;
    padding: 10px;
    box-sizing: border-box;
}

.frPopup > div{
    position: relative;
    border-radius: 30px;
    overflow: hidden;
    max-width: 100%;
    max-height: 100%;
    aspect-ratio: 100 / 189;
}

.frPopup > * > button {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 5px;
    right: 5px;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    border: 1px solid;
    background: white;
}

.frPopup > * > button::before, .frPopup > * > button::after {
    content: '';
    position: absolute;
    width: 2px;
    height: 20px;
    background: black;
    border-radius: 30px;
}

.frPopup > * > button::before {
    rotate: 45deg;
}

.frPopup > * > button::after {
    rotate: -45deg;
}

.frPopup > div > img {
    position: relative;
    max-width: 100%;
    max-height: 100%;
}

.bounce {
    animation: bounce 2s ease infinite;
}

@keyframes bounce {
    70% { transform:translateY(0%); }
    80% { transform:translateY(-15%); }
    90% { transform:translateY(0%); }
    95% { transform:translateY(-7%); }
    97% { transform:translateY(0%); }
    99% { transform:translateY(-3%); }
    100% { transform:translateY(0); }
}

@keyframes bounce2 {
	0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
	40% {transform: translateY(-30px);}
	60% {transform: translateY(-15px);}
}`;

const frTarget = document.querySelector('.product-section');
const frButton = document.createElement('button');
frButton.className = 'frButton';
frButton.innerHTML = '<p><strong>&#128525 FRETE GRÁTIS &#128525</strong></P><p>clique para ver regras</p>';
const frPopup = document.createElement('div');
frPopup.className = 'frPopup hidden';
frPopup.show = false;
const closeFrPopup = document.createElement('button');
const frImgBox = document.createElement('div');
const frImg = new Image();
frImg.src = 'https://montink.s3.amazonaws.com/produto_imagens/258943/phpHhmsO3.png';
frImgBox.append(frImg, closeFrPopup);
frPopup.append(frImgBox);

frButton.onclick = ()=> {
    if (frPopup.show == true) {
        frPopup.classList.add('hidden');
        frPopup.show = false;
    } else {
        frPopup.classList.remove('hidden');
        frPopup.show = true;
    }
};

frPopup.onclick = ()=> {
    frPopup.classList.add('hidden');
    frPopup.show = false;
}

if (frTarget) {
    frTarget.parentNode.insertBefore(frButton, frTarget);
} else {
    document.body.append(frButton);
}

document.body.append(frStyle, frPopup);