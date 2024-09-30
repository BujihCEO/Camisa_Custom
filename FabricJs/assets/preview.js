function printPreviews() {
    printList.forEach(node => {
        var visible = node.isVisible();
        if (!visible) node.show();
        var target = node.print;
        var scale = target.scale();
        target.setAttrs({scale: {x:1, y:1}});
        target.toImage({
            ...target.size(),
            x: target.x(),
            y: target.y(),
            callback(img) {
                img.style = 'width: 100%';
                document.body.append(img);
            }
        });
        target.setAttr('scale', scale);
        if (!visible) node.hide();
    });
}