
var processingInstance;
var _MOTION_STATE;

var startMouseX = 0,
    endMouseX,
    startMouseY,
    endMouseY;

function setLastXY(event){
    if (!processingInstance) {
        processingInstance = Processing.getInstanceById('canvasRender');
    }

    var x = event.touches[0].pageX;
    var y = event.touches[0].pageY;

    processingInstance.pmouseX = x/50;
    processingInstance.pmouseY = y/50;
}

function setFirstXY(event){
    if (!processingInstance) {
        processingInstance = Processing.getInstanceById('canvasRender');
    }
    //alert(processingInstance);

    var x = event.touches[0].pageX;
    var y = event.touches[0].pageY;

    processingInstance.mouseX = x/50;
    processingInstance.mouseY = y/50;
}

function setFirstY(value){
    if (!processingInstance) {
        processingInstance = Processing.getInstanceById('canvasRender');
    }

    processingInstance.pmouseY = value/50;
}

function setLastY(value){
    if (!processingInstance) {
        processingInstance = Processing.getInstanceById('canvasRender');
    }

    processingInstance.mouseY = value/50;
};


/* 터치 시작 */
function touchStart(event) {
    event.preventDefault();

    var countFinger = event.touches.length;

    if( countFinger == 1 ) {
        _MOTION_STATE = 1;
        setFirstXY(event);
    }
    else if( countFinger == 2 ) {
        _MOTION_STATE = 2;

        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;
        var d = Math.sqrt( dx*dx + dy*dy );
        setFirstY(d);
    }



};

/* 터치 움직일때 */
function touchMove(event) {
    event.preventDefault();

    var countFinger = event.touches.length;

    if( countFinger == 1 ) { // 한손.
        if( _MOTION_STATE != 1 ) return;
        processingInstance.mouseButton = processingInstance.LEFT;
        setLastXY(event);
    }
    else if( countFinger == 2 ) {
        if( _MOTION_STATE != 2 ) return;
        processingInstance.mouseButton = processingInstance.CENTER;

        var dx = event.touches[0].pageX - event.touches[1].pageX;
        var dy = event.touches[0].pageY - event.touches[1].pageY;
        var d = Math.sqrt( dx*dx + dy*dy );
        setLastY(d);
    }
    processingInstance.mouseDragged();
}

function touchEnd(event) {
    //alert(' 끝남 ');
    event.preventDefault();
    //setProcessingMouse(event);
    //processingInstance.mouseReleased();
}

function touchCancel(event) {
    event.preventDefault();
    //setProcessingMouse(event);
    //processingInstance.mouseReleased();
}