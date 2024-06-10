document.addEventListener('DOMContentLoaded', function () {
    const canvas = new fabric.Canvas('canvas');
    const rulerTop = document.getElementById('ruler-top');
    const rulerLeft = document.getElementById('ruler-left');
    const ctxTop = rulerTop.getContext('2d');
    const ctxLeft = rulerLeft.getContext('2d');

    const objectX = document.getElementById('object-x');
    const objectY = document.getElementById('object-y');
    const objectWidth = document.getElementById('object-width');
    const objectHeight = document.getElementById('object-height');

    document.getElementById('add-image').addEventListener('click', function () {
        const url = prompt('Enter image URL');
        if (url) {
            fabric.Image.fromURL(url, function (img) {
                img.set({
                    left: 100,
                    top: 100,
                    padding: 10,
                    cornersize: 10,
                    hasRotatingPoint: true
                });
                canvas.add(img).setActiveObject(img);
            });
        }
    });

    document.getElementById('add-rect').addEventListener('click', function () {
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'red',
            width: 50,
            height: 50,
            padding: 10,
            cornersize: 10,
            hasRotatingPoint: true
        });
        canvas.add(rect).setActiveObject(rect);
    });

    document.getElementById('add-text').addEventListener('click', function () {
        const text = new fabric.Text('Hello, Fabric.js!', {
            left: 100,
            top: 100,
            fontFamily: 'Arial',
            fill: 'black',
            fontSize: 20
        });
        canvas.add(text).setActiveObject(text);
    });

    canvas.on('object:selected', function (e) {
        const activeObject = e.target;
        updateControls(activeObject);
    });

    canvas.on('object:modified', function (e) {
        const activeObject = e.target;
        updateControls(activeObject);
        clearAlignmentLines();
    });

    function updateControls(object) {
        objectX.value = object.left.toFixed(0);
        objectY.value = object.top.toFixed(0);
        objectWidth.value = object.width * object.scaleX;
        objectHeight.value = object.height * object.scaleY;
    }

    objectX.addEventListener('change', function () {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.set('left', parseInt(objectX.value, 10));
            canvas.renderAll();
        }
    });

    objectY.addEventListener('change', function () {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.set('top', parseInt(objectY.value, 10));
            canvas.renderAll();
        }
    });

    objectWidth.addEventListener('change', function () {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.scaleToWidth(parseInt(objectWidth.value, 10));
            canvas.renderAll();
        }
    });

    objectHeight.addEventListener('change', function () {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.scaleToHeight(parseInt(objectHeight.value, 10));
            canvas.renderAll();
        }
    });

    function drawRulers() {
        ctxTop.clearRect(0, 0, rulerTop.width, rulerTop.height);
        ctxLeft.clearRect(0, 0, rulerLeft.width, rulerLeft.height);

        for (let i = 0; i < rulerTop.width; i += 10) {
            ctxTop.moveTo(i, 0);
            ctxTop.lineTo(i, 20);
            ctxTop.stroke();
            if (i % 100 === 0) {
                ctxTop.fillText(i, i + 2, 10);
            }
        }

        for (let i = 0; i < rulerLeft.height; i += 10) {
            ctxLeft.moveTo(0, i);
            ctxLeft.lineTo(20, i);
            ctxLeft.stroke();
            if (i % 100 === 0) {
                ctxLeft.fillText(i, 2, i + 10);
            }
        }
    }

    drawRulers();

    canvas.on('object:moving', function (e) {
        drawAlignmentLines(e.target);
    });

    canvas.on('object:scaling', function (e) {
        drawAlignmentLines(e.target);
    });

    canvas.on('before:render', function() {
        canvas.clearContext(canvas.contextTop);
    });

    function drawAlignmentLines(activeObject) {
        const ctx = canvas.getSelectionContext();
        const activeObjectCenter = activeObject.getCenterPoint();
        const activeObjectLeft = activeObjectCenter.x;
        const activeObjectTop = activeObjectCenter.y;
        const activeObjectBoundingRect = activeObject.getBoundingRect();
        const activeObjectHeight = activeObjectBoundingRect.height / 2;
        const activeObjectWidth = activeObjectBoundingRect.width / 2;

        const canvasObjects = canvas.getObjects();
        const aligningLines = { x: [], y: [] };

        for (let i = 0; i < canvasObjects.length; i++) {
            if (canvasObjects[i] === activeObject) continue;

            const objectCenter = canvasObjects[i].getCenterPoint();
            const objectLeft = objectCenter.x;
            const objectTop = objectCenter.y;
            const objectBoundingRect = canvasObjects[i].getBoundingRect();
            const objectHeight = objectBoundingRect.height / 2;
            const objectWidth = objectBoundingRect.width / 2;

            // Vertical alignment
            if (Math.abs(objectLeft - activeObjectLeft) < 5) {
                aligningLines.x.push({
                    x1: objectLeft,
                    y1: Math.min(objectTop - objectHeight, activeObjectTop - activeObjectHeight),
                    x2: objectLeft,
                    y2: Math.max(objectTop + objectHeight, activeObjectTop + activeObjectHeight)
                });
                activeObject.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
            }

            // Horizontal alignment
            if (Math.abs(objectTop - activeObjectTop) < 5) {
                aligningLines.y.push({
                    x1: Math.min(objectLeft - objectWidth, activeObjectLeft - activeObjectWidth),
                    y1: objectTop,
                    x2: Math.max(objectLeft + objectWidth, activeObjectLeft + activeObjectWidth),
                    y2: objectTop
                });
                activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
            }
        }

        drawVerticalLine(ctx, aligningLines.x);
        drawHorizontalLine(ctx, aligningLines.y);
    }

    function drawVerticalLine(ctx, lines) {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255,0,0,0.5)';
        ctx.beginPath();
        for (let i = 0; i < lines.length; i++) {
            ctx.moveTo(lines[i].x1, lines[i].y1);
            ctx.lineTo(lines[i].x2, lines[i].y2);
        }
        ctx.stroke();
        ctx.restore();
    }

    function drawHorizontalLine(ctx, lines) {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255,0,0,0.5)';
        ctx.beginPath();
        for (let i = 0; i < lines.length; i++) {
            ctx.moveTo(lines[i].x1, lines[i].y1);
            ctx.lineTo(lines[i].x2, lines[i].y2);
        }
        ctx.stroke();
        ctx.restore();
    }

    function clearAlignmentLines() {
        canvas.clearContext(canvas.contextTop);
    }
});
