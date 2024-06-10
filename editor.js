document.addEventListener("DOMContentLoaded", function() {
    const canvas = new fabric.Canvas('canvas');
    
    // Add Text
    window.addText = function() {
        const text = new fabric.Textbox('Hello Fabric.js', {
            left: 100,
            top: 100,
            width: 200,
            fontSize: 20,
        });
        canvas.add(text);
    };

    // Add Rectangle
    window.addRectangle = function() {
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'red',
            width: 100,
            height: 100,
        });
        canvas.add(rect);
    };

    // Add Circle
    window.addCircle = function() {
        const circle = new fabric.Circle({
            left: 100,
            top: 100,
            radius: 50,
            fill: 'green',
        });
        canvas.add(circle);
    };

    // Load Image
    document.getElementById('imageLoader').onchange = function handleImage(e) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function () {
                const image = new fabric.Image(imgObj);
                image.set({
                    left: 100,
                    top: 100,
                    angle: 0,
                    padding: 10,
                    cornersize: 10
                });
                canvas.add(image);
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    };

    // Delete Selected Object
    window.deleteObject = function() {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
        }
    };

    // Clear Canvas
    window.clearCanvas = function() {
        canvas.clear();
    };

    // Enable object controls
    canvas.on('object:selected', function(e) {
        const selectedObject = e.target;
        selectedObject.set({
            borderColor: 'red',
            cornerColor: 'green',
            cornerSize: 6,
            transparentCorners: false
        });
    });

    // Deselect object
    canvas.on('before:selection:cleared', function(e) {
        const deselectedObject = e.target;
        if (deselectedObject) {
            deselectedObject.set({
                borderColor: 'black',
                cornerColor: 'black',
            });
        }
    });
});
