document.addEventListener('DOMContentLoaded', function () {
    const canvas = new fabric.Canvas('canvas');

    document.getElementById('add-image').addEventListener('click', function () {
        const url = prompt('Enter image URL');
        if (url) {
            fabric.Image.fromURL(url, function (img) {
                img.set({
                    left: 100,
                    top: 100,
                    angle: 0,
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
            angle: 0,
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

    // Optional: Adding selection events to show controls
    canvas.on('selection:created', function (e) {
        console.log('Object selected:', e.target);
    });

    canvas.on('selection:cleared', function () {
        console.log('Selection cleared');
    });

    // Optional: Adding deletion functionality
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                canvas.remove(activeObject);
            }
        }
    });
});
