if (colorMenu) {
    colorMenu.forEach((c, i) => {
        createJsColor(mainMenuList, c.color, i + 1);
    });
}

var editList = [];
var btnAreaList = [];
for (var [index, item] of iniciar.entries()) {
    if (item.area.node) {
        let a = item.area;
        let p = a.node.getParent();
        let btn = document.createElement('button');
        btn.textContent = a.name;
        btnAreaList.push(btn);
        popupBtnWrap.appendChild(btn);
        let edit = document.createElement('div');
        edit.className = 'customBox';
        editList.push(edit);
        mainEdit.appendChild(edit);
        btn.addEventListener('click', () => {
            dragOff();
            stage.setAttrs({x:0, y:0, scale: {x:1, y:1}});
            function change() {
                btnAreaList.forEach((e, i) => {
                    if (e === btn) {
                        e.classList.add('selected');
                        editList[i].classList.remove('hidden');
                        iniciar[i].area.node.getParent().show();
                    } else {
                        e.classList.remove('selected');
                        editList[i].classList.add('hidden');
                        iniciar[i].area.node.getParent().hide();
                    }
                });
            }
            if (onShow == mainDesign) { 
                toShow(mainDesign, change);
            } else {
                if (onShow == adjustBox) { 
                    toShow(previous);
                    change();
                }
                else { change(); }
            }
        });

        previewList.push(p);

        if (index === 0) {
            btn.classList.add('selected');
        } else { 
            p.hide();
            edit.classList.add('hidden'); 
        }
        
        if (a.add) {
            a.add.forEach((e, i) => {
                var box = document.createElement('div');
                if (e.tittle) {
                    var tittle = document.createElement('div');
                    tittle.className = 'tittle';
                    tittle.textContent = e.tittle;
                    box.appendChild(tittle);
                }
                if (e.image) {
                    var att = e.image;
                    var width = att.position.width !== undefined && att.position.width !== null ? att.position.width : a.node.width();
                    var height = att.position.height !== undefined && att.position.height !== null ? att.position.height : a.node.height();
                    var group = new Konva.Group({
                        id: `${index + 1}-${i + 1}`,
                        width: width,
                        height: height,
                        x: att.position.x !== undefined && att.position.x !== null ? att.position.x : (a.node.width() / 2) - (width / 2),
                        y: att.position.y !== undefined && att.position.y !== null ? att.position.y : (a.node.height() / 2) - (height / 2),
                        clip: {
                            width: width,
                            height: height,
                        },
                    });
                    a.node.add(group);

                    if (att.upload) {
                        var upload = att.upload;
                        var upBox = document.createElement('div');
                        upBox.className = 'imageBox';
                        box.appendChild(upBox);
                        var input = document.createElement('input');
                        input.className = 'inputHidden';
                        input.type = 'file';
                        input.accept = 'image/png, image/jpeg, image/webp';
                        upBox.appendChild(input);
                        
                        var configBox = document.createElement('div');
                        configBox.className = 'configBox hidden';

                        var changeImg = document.createElement('button');
                        changeImg.className =  'changeImg iconBox';
                        changeImg.addEventListener('click', ()=> {
                            input.click();
                        });              
                        changeImg.span = document.createElement('span');
                        changeImg.span.textContent = 'Trocar imagem';
                        changeImg.appendChild(changeImg.span);
                        configBox.appendChild(changeImg);

                        var callEditor = document.createElement('button');
                        callEditor.className = 'callEditor iconBox';
                        callEditor.addEventListener('click', ()=> {
                            toShow(adjustBox, updateSets);
                        });
                        callEditor.span = document.createElement('span');
                        callEditor.span.textContent = 'Editar';
                        callEditor.appendChild(callEditor.span);
                        configBox.appendChild(callEditor);

                        if (upload.add) {
                            var add = upload.add;
                            var multi = add.length > 1;

                            if (multi) {
                                var boxPositions = document.createElement('div');
                                boxPositions.className = 'boxPositions';
                                boxPositions.style.aspectRatio = `${width}/${height}`;
                                var subBox = document.createElement('div');
                                boxPositions.append(subBox);
                                
                                for (let i = 0; i < add.length; i++) {
                                    var position = document.createElement('div');
                                    position.style = `
                                        left: ${(add[i].x / width) * 100}%; 
                                        top: ${(add[i].y / height) * 100}%; 
                                        width: ${(add[i].width / width) * 100}%; 
                                        height: ${(add[i].height / height) * 100}%;
                                        color: #${colorOrder[i]}
                                    `;
                                    subBox.appendChild(position);
                                }

                                upBox.appendChild(boxPositions);
                            }

                            var iconsBox = document.createElement('div');
                            iconsBox.className = `iconsBox slider ${multi? 'multi': ''}`;
                            upBox.appendChild(iconsBox);

                            add.forEach((e, i) => {
                                let div = document.createElement('button');

                                let imgIcon = document.createElement('div');
                                imgIcon.className = 'addImage';
                                imgIcon.onInput = true;
                                imgIcon.input = input;
                                imgIcon.parent = div;
                                imgIcon.configBox = configBox;
                                iconsList.push(imgIcon);
                                div.appendChild(imgIcon);

                                if (multi) {
                                    let color = document.createElement('span');
                                    color.style.color = `#${colorOrder[i]}`;
                                    div.appendChild(color);
                                }

                                let konvaBox = new Konva.Group(e);
                                
                                konvaBox.setAttrs({
                                    clip: konvaBox.size(),
                                });
                                
                                nodesBox.push(konvaBox);

                                group.add(konvaBox);
                                
                                imgIcon.onclick = ()=> {
                                    onSelect(imgIcon, true);
                                }

                                imgIcon.nodeBox = konvaBox;

                                iconsBox.appendChild(div);
                            });

                        }

                        upBox.appendChild(configBox);

                        if (upload.type === 'svg') {
                            input.addEventListener('change', function(event) {
                                NewPotrace(event, nodesBox.selected, iconsList.selected, {...upload.attrs});
                                iconsList.selected.onInput = false;
                            });
                        }
    
                        if (!upload.type) {
                            input.addEventListener('change', function(event) {
                                newUpload(event, nodesBox.selected, iconsList.selected, {...upload.attrs});
                                iconsList.selected.onInput = false;
                            });
                        }
                        
                    }

                    if (att.clip) {
                        var clip = att.clip;
                        if (clip.url) {
                            setClip(clip.url, group, clip.rule ? clip.rule : 0);
                        }
                    }

                    if (att.mask) {
                        var mask = att.mask;
                        if (mask.url) {
                            if (Array.isArray(mask.url)) {
                                var maskBox = document.createElement('div');
                                maskBox.className = 'slider imgChooser';
                                mask.url.forEach((url, i) => {
                                    var button = document.createElement('button');
                                    var img = new Image();
                                    img.src = url;
                                    if (i === 0) {
                                        getPath(url, group, {...mask.attrs});
                                        button.classList.add('selected');
                                        maskBox.selected = button;
                                    }
                                    button.onclick = ()=> {
                                        if (button === maskBox.selected) {
                                            return;
                                        } else {
                                            getPath(url, group, {...mask.attrs});
                                            maskBox.selected.classList.remove('selected');
                                            button.classList.add('selected');
                                            maskBox.selected = button;
                                        }

                                    };
                                    button.append(img);
                                    maskBox.append(button);
                                });
                                box.append(maskBox);
                                console.log('array');
                            } else {
                                getPath(mask.url, group, {...mask.attrs});
                            }
                        }
                    }
                    
                }
                if (e.text) {
                    var att = e.text;
                    var width = att.position.width !== undefined && att.position.width !== null ? att.position.width : a.node.width();
                    var height = att.position.height !== undefined && att.position.height !== null ? att.position.height : a.node.height();
                    var group = new Konva.Group({
                        id: `${index + 1}-${i + 1}`,
                        width: width,
                        height: height,
                        x: att.position.x !== undefined && att.position.x !== null ? att.position.x : (a.node.width() / 2) - (width / 2),
                        y: att.position.y !== undefined && att.position.y !== null ? att.position.y : (a.node.height() / 2) - (height / 2),
                        clip: {
                            width: width,
                            height: height,
                        },
                    });
                    group.setAttrs(att.setAttrs);
                    a.node.add(group);

                    let targets = [];
                    
                    var input = document.createElement('input');
                    Object.assign(input, {type: 'text', placeholder: 'Escreva aqui...'});

                    var noEditAttrs = {...att.attrs.noEdit};
                    var editAttrs = {...att.attrs.edit};

                    if (e.text.add) {
                        e.text.add.forEach(e => {
                            var text = new Konva.Text({
                                icon: input,
                                ...e,
                                ...noEditAttrs,
                                ...editAttrs,
                                edit: Object.keys(editAttrs),
                                moveable: true,
                            });
                            canSelect.push(text);
                            colorAnalize(text, noEditAttrs);
                            clickTap(text, () => {
                                dragOn(targets);
                                toShow(adjustBox, updateSets);
                            });
                            group.add(text);
                            targets.push(text);
                            text.onSelect = ()=> {onSelect(text)};
                        });
                    }
                    
                    var inputBox = document.createElement('div');
                    inputBox.className = 'inputTextBox';
                    input.configBox = document.createElement('div');
                    
                    var configBox = document.createElement('div');
                    configBox.className = 'configBox';

                    var selectText = document.createElement('button');
                    selectText.className = 'findTarget';
                    selectText.addEventListener('click', ()=> {
                        onSelect(input, true);
                    });
                    selectText.span = document.createElement('span');
                    selectText.span.textContent = 'Selecionar';
                    selectText.appendChild(selectText.span);
                    
                    var callEditor = document.createElement('button');
                    callEditor.className = 'callEditor';
                    callEditor.addEventListener('click', ()=> {
                        dragOn(targets);
                        toShow(adjustBox, updateSets);
                    });
                    callEditor.span = document.createElement('span');
                    callEditor.span.textContent = 'Editar';
                    callEditor.appendChild(callEditor.span);

                    var uppercase = e.text.onInput.uppercase;
                    if (uppercase === true) {
                        targets.forEach(node => {
                            node.text(node.text().toUpperCase());
                        });
                    }
                    input.node = targets;
                    input.parent = inputBox;
                    
                    input.onclick = ()=> {
                        onSelect(input, true);
                    }

                    input.oninput = (value)=> {
                        value = uppercase === true ?
                        input.value.toUpperCase() : input.value;
                        targets.forEach(e=> {
                            e.setAttr('text', value);
                        });
                    }
                    
                    if (e.text.onInput.align) {
                        targets[0].on('fontSizeChange textChange xChange yChange', function() {
                            align(e.text.onInput.align);
                        }); 
                    }

                    if (att.textClip) {
                        var clip = att.textClip;
                        textClip(clip.url, clip.target, targets, clip.height);
                    }

                    if (att.clip) {
                        var clip = att.clip;
                        if (clip.url) {
                            setClip(clip.url, group, clip.rule ? clip.rule : 0);
                        }
                    }

                    configBox.append(selectText, callEditor);
                    inputBox.append(input, configBox);
                    box.appendChild(inputBox);
                }
                box.childElementCount > 0 ? edit.appendChild(box) : '';
            });
        }

    }
}