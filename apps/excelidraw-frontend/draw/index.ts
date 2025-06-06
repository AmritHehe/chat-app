import axios from "axios"
import { HTTP_BACKEND } from "@/config"
// import { eventNames } from "process";
// import { setHeapSnapshotNearHeapLimit } from "v8";
import { RefObject } from "react";
import { json, text } from "stream/consumers";
import { Fascinate, Qahiri } from "next/font/google";
import { requestFormReset } from "react-dom";

type Shape = { 
    type: "rect" ; 
    x:number;
    y:number;
    width: number;
    height : number; 
    DBid ?: number;
    strokeW ?:number | 1;
    strokeC ?: string ;
    Fill ?: string ; 
} | { 
    type: "circle";
    centerX : number; 
    centerY :number; 
    radiusX : number;
    radiusY :number;
    DBid ?:number ;
    strokeW ?:number|1;
    strokeC ?: string ;
    Fill ?: string ; 
}
| { 
   type: "pencil" ;
   X  : number[] ; 
   Y :number[] ; 
   DBid ?: number ; 
   strokeW ?:number|1;
   strokeC ?: string ;

} | {
    type : "drag" ; 
    DBid ?: number
    
} | { 
    type : "circleRect" ; 
    x:number;
    y:number;
    width: number;
    height : number; 
    centerX : number; 
    centerY :number; 
    radiusX : number;
    radiusY :number;
    strokeW ?:number |1
    DBid ?: number
} | { 
    type : "line"; 
    startX : number;
    startY : number ;
    currentX : number ; 
    currentY : number ; 
    strokeW ?: number ; 
    strokeC ?: string ;
    DBid ?: number
} | { 
    type : "arrow";
    startX : number ; 
    startY : number ; 
    currentX : number;
    currentY :number ; 
    strokeW ?: number ; 
    strokeC ?: string ;
    DBid ?: number ; 

} | { 
    type : "text"; 
    text :string ;
    x : number; 
    y : number; 
    strokeC ?: string ;
    DBid ?:number 
} | { 
    type : "heart" ;
    startX : number ; 
    startY : number ; 
    currentX : number ; 
    currentY : number ; 
    strokeW ?: number ; 
    strokeC ?: string ; 
    DBid ?: number ; 
}


export async function initDraw(canvas : HTMLCanvasElement , roomId : string  , socket : WebSocket  ,shapeRef:RefObject<string> , strokeRef:RefObject<number> , strokeColorRef : RefObject<string> , bodyColorRef : RefObject<string> , textRef: RefObject<HTMLTextAreaElement> , zoom:number , setZoom: any , setText : any){
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    let offset_x :any; 
    let offset_y :any; 
    let get_offsets = function(){ 
        let canvas_offsets = canvas.getBoundingClientRect(); 
        offset_x = canvas_offsets.left;
        offset_y = canvas_offsets.top;
    } 
    get_offsets(); 
    window.onscroll = (()=> {get_offsets()}) 
    window.onresize = (() => {get_offsets()})
    canvas.onresize = (()=> { get_offsets()})
    
    let cameraOffset = { x:offset_x, y: offset_y};
    
    let cameraZoom = zoom 
    let MAX_ZOOM = 5 
    let MIN_ZOOM = 0.1
    let ctx = canvas.getContext("2d"); 
    //@ts-ignore
    ctx.fillStyle = "rgba(0,0,0)"
     let hehe = false ;
    
    // canvas.width = window.innerWidth; 
    // canvas.height = window.innerHeight
    // canvas.style.width = '100vw'
    // canvas.style.height = '100vh'
    // canvas.style.position = 'absolute';
    // canvas.style.top = '0';
    // canvas.style.left = '0';
   

    
    let SCROLL_SENSITIVITY = 0.0005
    let cancelRedraw = false ;
    let cancelLiveDraw = false;
    
    
    function Redraw(){ 
        // canvas.width = window.innerWidth
        // canvas.height = window.innerHeight
        // if(!ctx){ 
        //     return
        // }
        // ctx.translate(-window.innerWidth/2 , window.innerHeight/2); 
        // ctx.scale(cameraZoom , cameraZoom)
        // ctx.translate(-window.innerWidth/2 +cameraOffset.x , -window.innerHeight/2 + cameraOffset.y)
        // ctx.clearRect(0,0,window.innerWidth , window.innerHeight)
        // ctx.fillStyle = "rgba(0,0,0)"
        
        
        // clearCanvas(existingShapes ,canvas , ctx)
        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;
        if (!ctx) return;

        // Reset transform to avoid stacking
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset first
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // ctx.translate(canvas.width / 2, canvas.height / 2);
        // ctx.scale(cameraZoom, cameraZoom);
        // ctx.translate(canvas.width / 2 + cameraOffset.x, -canvas.height / 2 + cameraOffset.y);
        ctx.translate( window.innerWidth / 2, window.innerHeight / 2 )
        ctx.scale(cameraZoom, cameraZoom)
        ctx.translate( -window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y )
        // ctx.translate( -window.innerWidth / 2 , -window.innerHeight / 2  )


        clearCanvas(existingShapes, canvas, ctx ,cameraZoom );
        if(!cancelRedraw){ 
        requestAnimationFrame(Redraw)
        }
    }
    let dragStart = { x : 0 , y : 0 }
    
    
    
    let existingShapes : Shape[] = []; 
    localStorage.setItem("existingShapes" , JSON.stringify(existingShapes))
    existingShapes = await getExistingShapes(roomId)
    // console.log("shru hote hi exisiting shapes ye agy hai dostonn"+JSON.stringify(existingShapes))
    let  arrX : any = [];
    let  arrY: any = [];    
    if(!ctx){ 
        return
    }
   


    socket.onmessage = (event) => { 
        
        const message = JSON.parse(event.data); 
        // console.log("websocket message " + JSON.stringify(message))
        // clearCanvas(existingShapes , canvas , ctx )
        if(message.type == "chat"){ 
            const parseShape = JSON.parse(message.message)
            // console.log("parseshape chat thingy got rfjngdf" + JSON.stringify(parseShape))
            const id:number = JSON.parse(message.id)
            const mainShape = parseShape.shape 
            mainShape.DBid  = id
            existingShapes.push(mainShape)
             localStorage.setItem("existingShapes" , JSON.stringify(existingShapes));
            // existingShapes.push(parseShape.shape)
            // console.log("exisitingShapes: "  +JSON.stringify(existingShapes))
            // clearCanvas(existingShapes , canvas , ctx )
            Redraw()
            // console.log("rerenderd")
        }
        if(message.type == "update"){ 
            const parseShape =message.message
           for(let i = 0 ; i < existingShapes.length ; i++) { 
            if(parseShape.DBid == existingShapes[i].DBid){ 
                existingShapes[i] = parseShape;
                // console.log("updated the exisitng shape")
                // console.log(" rerenderd exisitingShapes: "  +JSON.stringify(existingShapes))
                localStorage.setItem("existingShapes" , JSON.stringify(existingShapes));
                clearCanvas(existingShapes , canvas , ctx ,cameraZoom )
                // Redraw()
                return;
            }
            else { 
                // console.log("cant find the exisiting shape! oh oh")
            }
           }         
        }
        if(message.type == "delete"){ 
            const parseShape = message.message;
            
            for(let i = 0 ; i < existingShapes.length ; i++) { 
                if(parseShape.DBid == existingShapes[i].DBid){ 
                    existingShapes.splice(i , 1)
                    // existingShapes[i] = parseShape;
                    // console.log("deleted the exisitng shape")
                    // console.log(" rerenderd exisitingShapes: "  +JSON.stringify(existingShapes))
                    clearCanvas(existingShapes , canvas , ctx ,cameraZoom )
                    // Redraw()
                    return;
                }
                
            }
        }
        if(message.type == "deleteMany"){ 
            const parseShape = message.message ; 
            // console.log("parseShape length : " + parseShape.length)
            for(let j = 0  ; j < parseShape.length ; j++){ 
                for(let i = 0 ; i < existingShapes.length ; i++) { 
                    if(parseShape[j].DBid == existingShapes[i].DBid){ 
                        existingShapes.splice(i , 1)
                        // existingShapes[i] = parseShape;
                        // console.log("deleted the exisitng shape")
                        // console.log(" rerenderd exisitingShapes: "  +JSON.stringify(existingShapes))
                        // clearCanvas(existingShapes , canvas , ctx )
                        Redraw()
                    }
                    
                }
            }
            localStorage.setItem("existingShapes" , JSON.stringify(existingShapes));
            
        }
        if(message.type == "liveDraw"){ 
            // console.log("hello from live draw")
            const parseShape = JSON.parse(message.message); 
            // console.log("parsedshape I got husdujfh" + JSON.stringify(parseShape))
            function hehe (){ 
            if(!ctx){ 
                 return
            }
            if(!cancelLiveDraw){
                LiveDraw(parseShape , ctx , canvas ,existingShapes, cameraZoom , cameraOffset , strokeRef)
                requestAnimationFrame(hehe)
            }
            }
            if(!cancelLiveDraw){

            hehe()
            }
            
         

            // Redraw()
            // clearCanvas(existingShapes , canvas , ctx , cameraZoom)
        }
        if(message.type == "clear"){ 
            existingShapes = [];
            Redraw();
            return ;
        }
    }

        

        clearCanvas(existingShapes , canvas , ctx , cameraZoom  )
        ctx.strokeStyle = "rgba(255 ,255, 255)"
        let clicked = false ; 
        let startX = 0; 
        let startY = 0;
        let Drag = false; 
        let select = false;
        let currentShapeIndex :number = 0 
        let databaseId :number ;
        let current_shape :any  ={}
        let erased_Shapes :any[] = []
        let selected_shape :any = {}
        let selectedShapeIndex = 0 ;
        let whatToResize : any ;
        let countclick = 0 ;
        let textX = 0 ; 
        let textY = 0 ;

        function getEventLocation(e:any)
            {
                return { x: e.clientX -offset_x , y: e.clientY - offset_y }        
  
            }

        function is_mouse_in_shape(x:number , y :number , shape :any){ 
            
            if(shape.type == "rect"){ 
                // console.log("inside rect")
                // console.log("SHAPE i GOT "  + JSON.stringify(shape) + " x " + x + " y " + y)
                let shape_Left ;
                let shape_Right ; 
                let shape_Top ; 
                let shape_Bottom ;
                if(shape.height >0 && shape.width>0){
                    shape_Left = shape.x; 
                    shape_Right = shape.x + shape.width;
                    shape_Top = shape.y;
                    shape_Bottom = shape.y + shape.height;
                }
                else if(shape.height > 0  && shape.width <=0){ 
                    shape_Left = shape.x + shape.width ; 
                    shape_Right = shape.x ; 
                    shape_Top = shape.y ;
                    shape_Bottom = shape.y + shape.height;
                    
                }
                else if(shape.height < 0 && shape.width >=0){ 
                    shape_Left = shape.x;
                    shape_Right = shape.x + shape.width ;
                    shape_Top = shape.y + shape.height ;
                    shape_Bottom = shape.y ; 
                    
                }
                else if(shape.height < 0 && shape.width < 0){ 
                    shape_Left = shape.x + shape.width ; 
                    shape_Right = shape.x ; 
                    shape_Top = shape.y + shape.height ; 
                    shape_Bottom = shape.y;
                }
                // console.log("shape Left + " + shape_Left + " shape_Right " + shape_Right + " shape_Top" + shape_Top + " shape_Bottom " +shape_Bottom )
                if(x > shape_Left && x < shape_Right && y > shape_Top && y < shape_Bottom){ 
                    return true
                 }
            }
            else if(shape.type == "circle"){ 
                // console.log("I have reached till here (inside the circle if )")
                // console.log("shape : " + JSON.stringify(shape))
                
                let shape_left = shape.centerX - shape.radiusX; 
                let shape_Right =  shape.centerX + shape.radiusX 
                let shape_top = shape.radiusY + shape.centerY ; 
                let shape_bottom = shape.centerY - shape.radiusY;
                // console.log(shape_left )
                // console.log(shape_Right)
                // console.log(shape_top)
                // console.log(shape_bottom) 
                // console.log( x)
                // console.log(y)
                if(x > shape_left && x < shape_Right && y < shape_top && y > shape_bottom){ 
                    return true
                 }

            }
            else if (shape.type == "pencil"){ 
                // console.log("shape " + JSON.stringify(shape))
                // console.log("start X and start Y jo aye  , startX " + x + "start Y" + y)
                let arrayX = shape.X 
                let arrayY = shape.Y
                // console.log("inside pensil")
                for(let i = 0 ; i < shape.X.length ; i++){ 
                    
                    if((8 >= (Math.abs(arrayX[i] - x))  && 8 >= (Math.abs(arrayY[i] - y)))){
                        return true
                    }
                 }
            }
            else if(shape.type == "line"|| shape.type == "arrow" || shape.type == "heart"){ 
                let width = shape.currentX - shape.startX; 
                let height =shape.currentY - shape.startY ;
                let startX = shape.startX;
                let startY = shape.startY;
                let newShape = { 
                    type : "rect" ,
                    x : startX , 
                    y : startY ,  
                    height : height ,
                    width : width ,
                    DBid : shape.DBid
                }
                if(is_mouse_in_shape(x , y , newShape)){ 
                    return true;
                }
            }
            else if(shape.type == "text"){
                // console.log("reached here !") 
                let SX = shape.x ;
                let SY = shape.y ; 
                let text = shape.text ;
                let textW = ctx.measureText(text).width;
                // console.log("text W" + textW)
                let height = 48;
                let newShape = { 
                    type : "rect",
                    x : SX , 
                    y : SY , 
                    height : height , 
                    width : textW , 
                    DBid : shape.DBid
                }
                if((is_mouse_in_shape(x , y , newShape))){ 
                    // console.log("intelligent hora sher")
                    return true;
                }
            }
            else{ 
                return false;
            }
            
            return false
        }
        function is_mouse_in_border(x:number , y:number , shape:any){
            let shape_Top ; 
            let shape_Bottom ; 
            let shape_Left ; 
            let shape_Right
            // console.log("hello from is mouse in border")
            // console.log("shape I recieived" + JSON.stringify(shape))
            // console.log("start XX" + startX , "startYY " + startY )
            if(shape.type == "rect"||shape.type=="circleRect"){ 
                // console.log("inside 1st if")
                if(shape.width <=0 && shape.height <=0){ 
                    shape_Top = shape.y + shape.height ; 
                    shape_Bottom = shape.y; 
                    shape_Left = shape.x + shape.width; 
                    shape_Right = shape.x;
                }
                if(shape.width > 0 && shape.height <=0){ 
                    shape_Top = shape.y + shape.height ; 
                    shape_Bottom = shape.y ; 
                    shape_Left = shape.x ; 
                    shape_Right = shape.x + shape.width ; 
                }
                if(shape.width <=0 && shape.height > 0){ 
                    shape_Top = shape.y ; 
                    shape_Bottom = shape.y + shape.height ; 
                    shape_Left = shape.x + shape.width ; 
                    shape_Right = shape.x; 
                }
                if(shape.width > 0 && shape.height > 0){ 
                    // console.log("inside 2nd if");
                    shape_Top = shape.y ; 
                    shape_Bottom = shape.y + shape.height ; 
                    shape_Left = shape.x ; 
                    shape_Right = shape.x + shape.width ; 
                }
            }
            let oldX = x ; 
            let oldY = y ;
            //for left left line 
            if(shape.height > 0 && shape.width < 0){
                for(let i = 0 ; i < 13 ; ++i){ 
                    // console.log("XXXXX: " + x , " YYYYYY " + y)
                // if((x == shape_Left && y >  shape_Top && y < shape_Bottom )|| (x==shape_Right && y > shape_Top && y < shape_Bottom)||(y==shape_Top && x<shape_Left && x > shape_Right)||(y==shape_Bottom && x <shape_Left && x > shape_Right)){ 
                    if((6 >= Math.abs(shape_Left-x) && y >  shape_Top && y < shape_Bottom )){
                        whatToResize = "left"
                        return true
                    }
                    else if((6>=Math.abs(shape_Right-x) && y > shape_Top && y < shape_Bottom)){   
                        whatToResize = "right"
                        return true; 
                    }
                    else if((6>=Math.abs(shape_Top-y) && x >= shape_Left && x <= shape_Right)){ 
                        whatToResize = "top"
                        return true;
                    }
                    else if((6>=Math.abs(shape_Bottom-y) && x >= shape_Left && x <= shape_Right)){ 
                        whatToResize = "bottom"
                        return true;
                    }
                
                }
            }
            else if(shape.width > 0 && shape.height > 0){ 
                    if((6 >= Math.abs(shape_Left-x) && y >  shape_Top && y < shape_Bottom )){
                        whatToResize = "left"
                        return true
                    }
                    else if((6>=Math.abs(shape_Right-x) && y > shape_Top && y < shape_Bottom)){   
                        whatToResize = "right"
                        return true; 
                    }
                    else if((6>=Math.abs(shape_Top-y) && x >= shape_Left && x <= shape_Right)){ 
                        whatToResize = "top"
                        return true;
                    }
                    else if((6>=Math.abs(shape_Bottom-y) && x >= shape_Left && x <= shape_Right)){ 
                        whatToResize = "bottom"
                        return true;
                    }
            }
            else if(shape.width > 0 && shape.height <=0){ 
              
                    if((6 >= Math.abs(shape_Left-x) && y >= shape_Top && y <= shape_Bottom )){
                        whatToResize = "left"
                        return true
                    }
                    else if((6>=Math.abs(shape_Right-x) && y >= shape_Top && y <= shape_Bottom)){   
                        whatToResize = "right"
                        return true; 
                    }
                    else if(6>=Math.abs(shape_Top-y) && x >= shape_Left && x <= shape_Right){ 
                        whatToResize = "top"
                        return true;
                    }
                    else if((6>=Math.abs(shape_Bottom-y) && x >= shape_Left && x <= shape_Right)){ 
                        whatToResize = "bottom"
                        return true;
                    }
            }
            else if(shape.width < 0 && shape.height < 0){
                    // console.log("XXXXX: " + x , " YYYYYY " + y)
                // if((x == shape_Left && y >  shape_Top && y < shape_Bottom )|| (x==shape_Right && y > shape_Top && y < shape_Bottom)||(y==shape_Top && x<shape_Left && x > shape_Right)||(y==shape_Bottom && x <shape_Left && x > shape_Right)){ 
                    if((6 >= Math.abs(shape_Left-x) && y >=  shape_Top && y <= shape_Bottom )){
                        whatToResize = "left"
                        return true
                    }
                    else if(6>=Math.abs(shape_Right-x) && y >= shape_Top && y  <= shape_Bottom){   
                        whatToResize = "right"
                        return true; 
                    }
                    else if((6>=Math.abs(shape_Top-y) && x >= shape_Left && x <= shape_Right)){ 
                        whatToResize = "top"
                        return true;
                    }
                    else if((6>=Math.abs(shape_Bottom-y) && x >= shape_Left && x <= shape_Right)){ 
                        whatToResize = "bottom"
                        return true;
                    }
            }
            return false ;
        }
        canvas.addEventListener("mousemove" , (e) => { 
            if(!clicked){
                if(shapeRef.current == "select"){ 
                    // console.log("hello brosaki from here")
                    let currentX = ((e.clientX - window.innerWidth / 2) / cameraZoom + window.innerWidth/2 - cameraOffset.x) ;
                    let currentY = ((e.clientY - window.innerHeight/ 2) / cameraZoom + window.innerHeight/2 - cameraOffset.y) ; 
                    let index = 0 ;
                    for(let shape of existingShapes){
                        
                        if(is_mouse_in_border(currentX , currentY , shape)){
                            if(whatToResize == "left" || whatToResize =="right"){ 
                                canvas.style.cursor = 'w-resize'
                                select = true;
                                Drag = false ;
                                selectedShapeIndex = index ; 
                                selected_shape = shape;
                                return;
                            } 
                            else if(whatToResize == "top" || whatToResize == "bottom"){
                                canvas.style.cursor = 'n-resize'
                                select = true ;
                                Drag = false ; 
                                selectedShapeIndex = index ; 
                                selected_shape = shape;
                                return;
                            }
                        }
                        else if(is_mouse_in_shape(currentX , currentY , shape)){ 
                            canvas.style.cursor = 'move'
                            Drag = true;
                            select = false;
                            currentShapeIndex = index;
                            databaseId = shape.DBid;
                            return;
                        }
                        else { 
                            select = false ;
                            Drag = false;
                            canvas.style.cursor = 'default'
                            // return;
                            // continue;

                        }
                        index++;
                    }
                }
            }
        })
        canvas.addEventListener("mousedown" , (e) =>{
                hehe = false
            // selected_shape = {}
                cancelLiveDraw = true ;
                if(shapeRef.current=="rect")
                { 
                    cancelLiveDraw = false;
                }
                if(shapeRef.current == "rect" || shapeRef.current == "circle" || shapeRef.current == "pencil"|| shapeRef.current == "line"){
                canvas.style.cursor = 'crosshair'
                }
           
                         
                startX = Math.trunc((e.clientX - window.innerWidth / 2) / cameraZoom + window.innerWidth/2 - cameraOffset.x)
                startY =  Math.trunc((e.clientY - window.innerHeight/ 2) / cameraZoom + window.innerHeight/2 - cameraOffset.y)
            // Redraw();
            // console.log(cameraOffset)
            cancelRedraw = true ; 
            // console.log(shapeRef.current)
            clicked = true
            // console.log( "get bounding client rect " + JSON.stringify(rect))
            // console.log("camera zoom when mouseeDown" + cameraZoom)
            // console.log("console values " + e.clientX)
            // console.log("console Y " + e.clientY)
            // console.log ("After dividing with camera zoom X " + startX)
            // console.log ("After dividing with camera zoom Y " + startY)
            // startX = (e.clientX/cameraZoom) - (cameraOffset.x/cameraZoom);
            // startY =( e.clientY/cameraZoom)- (cameraOffset.y/cameraZoom) ;
            // startX = e.clientX  - cameraOffset.x ;
            // startY = e.clientY  - cameraOffset.y ;
            // startX =  getEventLocation(e).x/cameraZoom - cameraOffset.x;
            // startY = getEventLocation(e).y/cameraZoom - cameraOffset.y;
            // console.log("startX " + startX + "staart Y" + startY)
            
            
            arrX.length = 0; 
            arrY.length = 0;
            // console.log(arrX); 
            // console.log(arrY)
            // console.log("before " + JSON.stringify({existingShapes}));
            if(shapeRef.current == "pencil"){ 
                // ctx.beginPath()
                arrX = [startX] 
                arrY = [startY];
                ctx.moveTo(startX ,startY)
            }
            if(shapeRef.current == "line"){ 
                ctx.moveTo(startX , startY)
            }
            let index = 0
            if(shapeRef.current == "arrow"){ 
                ctx.moveTo(startX , startY)
            }
            if(shapeRef.current == "text"){
                // console.log("countclick  " + countclick) 
                if(countclick == 0){
                textX = startX ; 
                textY = startY
                // console.log("yha tk to araha hu")
                // console.log("startX to string" + startX.toString())
                textRef.current.style.top = `${e.clientY}px`
                textRef.current.style.left = `${e.clientX}px` ;
                requestAnimationFrame(()=>{textRef.current.focus()})
                countclick+=1;
                }
                else { 
                    countclick +=1;
                    // console.log("sabassh sher ")
                }
            }
            if(shapeRef.current == "drag" || shapeRef.current == "erase"){     
            e.preventDefault()  
            // canvas.style.cursor = "drag"
            for(let shape of existingShapes){  
                if(shape.type == "rect" || shape.type == "circle" || shape.type == "pencil"|| shape.type =="line"){
                    if(is_mouse_in_shape(startX , startY ,shape)){
                        if(shape.DBid == null){ 
                            console.warn("shape foound nut missign db id " , shape); 
                            return;
                        }
                        else{ 
                            // console.log("found shape +id " )
                        }
                        // console.log('yes'); 
                        Drag = true;
                        
                        currentShapeIndex = index;
                        // console.log("currentShapeIndexFrom mosueee Down : " + currentShapeIndex)
                        //@ts-ignore
                        databaseId = shape.DBid;
                        return;
                    }
                    else{ 
                        // console.log("no")
                    }
                    index++;
                }
                else{
                    continue;
                }
            }
            }

            // if(shapeRef.current == "select"){ 
            //     console.log("hello from select")
            //     e.preventDefault()
            //     for(let i = 0 ; i <  existingShapes.length ; i++){ 
            //         let shape = existingShapes[i]
            //         if(shape.type == "rect"){ 
            //             if((is_mouse_in_border(startX , startY , shape))){
            //                 console.log("yes mouse in border sir ! ") 
            //                 selectedShapeIndex = i ; 
            //                 selected_shape = shape;
            //                 console.log("whatToResixe: "+ whatToResize)
            //                 return ; 
            //             }
            //             else { 
            //                 continue;
            //             }
            //         }
            //         if(shape.type == "circle"){ 
            //             let shapeRadiusX = Math.trunc(shape.radiusX)
            //             let shapeRadiusY = Math.trunc(shape.radiusY)
            //             let shapeCircleX = Math.trunc(shape.centerX - shapeRadiusX); 
            //             let shapeCircleY = Math.trunc(shape.centerY - shapeRadiusY)
            //             // console.log("int of shape Radius" + shapeRadius)
            //             let circleRect :Shape = {
            //                 type : "circleRect", 
            //                 x : shapeCircleX , 
            //                 y : shapeCircleY, 
            //                 height : shapeRadiusY*2 , 
            //                 width : shapeRadiusX*2 ,
            //                 radiusX  : shapeRadiusX ,
            //                 radiusY :  shapeRadiusY ,
            //                 centerX : shape.centerX , 
            //                 centerY : shape.centerY ,
            //                 DBid : shape.DBid
            //             };  
            //             // ctx.strokeRect(circleRect.x , circleRect.y , circleRect.width , circleRect.height)
            //             console.log("circleRect"+ JSON.stringify(circleRect))
            //             console.log("startX " + startX , "startY " + startY)
            //             if(is_mouse_in_border(startX , startY , circleRect)){ 
            //                 console.log("wow it works")
            //                  selected_shape = circleRect;
            //                 // selectedShapeIndex = i ; 
            //                 console.log("old exisiting shape " + JSON.stringify(existingShapes[i]))
            //                 // existingShapes.splice(i ,1); 
            //                 existingShapes[i] = circleRect
            //                 console.log("new exisiting shapes " + JSON.stringify(existingShapes[i]))
            //                 //  existingShapes.push(circleRect)
            //                  ctx.strokeRect(circleRect.x , circleRect.y , circleRect.width , circleRect.height)
            //                  return;
            //             }
            //             else{ 
            //                 continue;
            //             }
            //         }
            //         if(shape.type == "pencil"){ 
            //             if(is_mouse_in_shape(startX , startY , shape)){ 
            //                 console.log("yessir in Shape ")

            //             }
            //         }
            //     }
            // }
            if(shapeRef.current == "pan"){ 
                dragStart.x = getEventLocation(e).x/cameraZoom - cameraOffset.x; 
                dragStart.y = getEventLocation(e).y/cameraZoom -cameraOffset.y
                // cancelRedraw = false ; 
            }
            if(shapeRef.current == "eraseDrag"){ 

            }
            if(shapeRef.current == "clear"){ 

            }
            // if(shapeRef.current == "erase"){
            //     e.preventDefault()

            // }
            else{ 
                return;
            }
            
            
        })
        canvas.addEventListener("mouseup" , (e)=> { 
            if(shapeRef.current!="rect"){
                 cancelLiveDraw = true ; 
            }
        if(shapeRef.current == "rect" || shapeRef.current == "circle" || shapeRef.current == "pencil" || shapeRef.current == "line"){
                canvas.style.cursor = 'default'
        }
        
        clicked = false ;
        cancelRedraw = false ; 
        let mouseX =(e.clientX - window.innerWidth/2)/cameraZoom ;  
        let mouseY = (e.clientY - window.innerHeight/2)/cameraZoom ;
        let width = mouseX - startX + window.innerWidth/2 - cameraOffset.x; 
        let height = mouseY - startY + window.innerHeight/2 - cameraOffset.y;  ; 
        // const width = e.clientX   - startX - cameraOffset.x; 
        // const height = e.clientY  -startY - cameraOffset.y ; 
        let shape :Shape | null = null;
        if(shapeRef.current == "rect"){
           if(width<=0 && height < 0){ 
               startX += width ; 
               startY += height ; 
               width = Math.abs(width); 
               height = Math.abs(height); 
            }
            else if(width >= 0 && height < 0){ 
                startY += height;
                height = Math.abs(height) ;
            }
            else if(width <= 0 && height > 0){ 
                startX+=width ; 
                width = Math.abs(width);
            }
             shape = {
                type: "rect",
                x : Math.trunc(startX) ,
                y : Math.trunc(startY) , 
                height : Math.trunc(height),
                width : Math.trunc(width) ,
                strokeW : strokeRef.current , 
                strokeC : strokeColorRef.current , 
                Fill : bodyColorRef.current
            }
           
        }
        else if(shapeRef.current == "circle"){ 
            if(width<=0 && height < 0){ 
            //    startX += width ; 
            //    startY += height ; 
               width = Math.abs(width); 
               height = Math.abs(height); 
            }
            else if(width >= 0 && height < 0){ 
                // startY += height;
                height = Math.abs(height) ;
            }
            else if(width <= 0 && height > 0){ 
                // startX+=width ; 
                width = Math.abs(width);
            }
            const radius = Math.sqrt(width * width + height * height) / 2;
            const radiusX = width/2 ; 
            const radiusY = height/2 ;
            const centerX = (startX + (mouseX + window.innerWidth/2 - cameraOffset.x) )/ 2;
            const centerY = (startY + (mouseY + window.innerHeight/2 - cameraOffset.y )) / 2;
            
            

 
            shape  = { 
                type : "circle", 
                radiusX : Math.trunc(radiusX),
                radiusY : Math.trunc(radiusY) ,
                centerX : Math.trunc(centerX)  , 
                centerY : Math.trunc(centerY),
                strokeW : strokeRef.current,
                strokeC : strokeColorRef.current,
                Fill : bodyColorRef.current
            }
        }
        else if(shapeRef.current == "pencil"){ 
            
            // ctx.stroke();
            // ctx.beginPath();
            const heheX = [...arrX] ; 
            const heheY = [...arrY] ;
            ctx.closePath();

            shape = { 
                type : "pencil" , 
                X : heheX , 
                Y : heheY ,
                strokeW : strokeRef.current,
                strokeC : strokeColorRef.current
            }
            arrX.length = 0 ; 
            arrY.length = 0 ; 
            // Redraw()

        }
        else if(shapeRef.current == "line"){ 
            let endPointX = mouseX + window.innerWidth/2  - cameraOffset.x; 
            let endPointY = mouseY + window.innerHeight/2 - cameraOffset.y;
            shape = { 
                type : "line" , 
                startX : startX , 
                startY : startY ,
                currentX : endPointX , 
                currentY : endPointY , 
                strokeW  : strokeRef.current , 
                strokeC : strokeColorRef.current
            }
        }
        else if(shapeRef.current == "arrow"){ 
            let endPointX = mouseX + window.innerWidth/2  - cameraOffset.x; 
            let endPointY = mouseY + window.innerHeight/2 - cameraOffset.y;
            shape = { 
                type : "arrow" , 
                startX : startX , 
                startY : startY ,
                currentX : endPointX , 
                currentY : endPointY , 
                strokeW  : strokeRef.current , 
                strokeC : strokeColorRef.current
            }
        }
        else if(shapeRef.current == "heart"){ 
            let endPointX = mouseX + window.innerWidth/2  - cameraOffset.x; 
            let endPointY = mouseY + window.innerHeight/2 - cameraOffset.y;
            shape = { 
                type : "heart" , 
                startX : startX , 
                startY : startY ,
                currentX : endPointX , 
                currentY : endPointY , 
                strokeW  : strokeRef.current , 
                strokeC : strokeColorRef.current
            }
        }
        else if(shapeRef.current == "text"){ 
            if(countclick >= 1)
            {   
                let texttosend = textRef.current.value
                let textW = ctx.measureText(texttosend).width; 
                let totallines = Math.ceil(textW/(textRef.current.offsetWidth)) + 1
                // console.log("textref ki width" + textRef.current.offsetWidth)

                // console.log("totalLines " + totallines)
                // console.log("text W" + textW) 
                let x = textX; 
                let y = textY ;
                // console.log("text ref value" + textRef.current.value)
                // console.log("why I am here")
                ctx.font = "50px Gamja_Flower";
                ctx.fillStyle = strokeColorRef.current;
                ctx.textBaseline = "hanging";
                // let textH = ctx.measureText(texttosend).emHeightAscent
                ctx.fillText(textRef.current.value , x , y)
                // ctx.fillText(textRef.current.value , x , y)
                countclick = 0;
                if(texttosend!=""){
                    shape = { 
                        type : "text" , 
                        text : texttosend ,
                        x : x , 
                        y : y ,
                        strokeC : "#FFFFFF"
                    }

                    // console.log("after : " + JSON.stringify({existingShapes}))
                    socket.send(JSON.stringify({
                        type : "chat",
                        message : JSON.stringify({
                            shape
                        }),
                        roomId
                    }))

                }
                
                setText("")
            }
            else { 

                // countclick = 0 ;
            }
            
        }
        else if (shapeRef.current == "drag" || Drag == true){ 
            // canvas.style.cursor = "default"
            if(!Drag){ 
                return ;
            }
            e.preventDefault(); 
            Drag = false ; 
            
            // console.log("currentShapeIndex afterwards :::::::>" + currentShapeIndex)
            // console.log("currenttt shape bhi haii " +JSON.stringify(current_shape))
            for(let i = 0 ; i < existingShapes.length ; i++){ 
                if (currentShapeIndex == i){ 
                    current_shape = existingShapes[i]; 
                    // console.log("foundeddd the shape here it is : " + current_shape)
                }
                
            }
            
            // console.log("currrent shape : " + current_shape)
            if(current_shape.type == "rect") { 
                shape = { 
                    type : "rect" , 
                    x: current_shape.x,
                    y: current_shape.y , 
                    width :current_shape.width, 
                    height : current_shape.height,
                    strokeC : current_shape.strokeC , 
                    strokeW : current_shape.strokeW ,
                    Fill :current_shape.Fill ,
                    DBid : current_shape.DBid

                }
            }
            else if(current_shape.type == "circle"){ 
                shape = { 
                    type  : "circle", 
                    radiusX :  current_shape.radiusX ,
                    radiusY :  current_shape.radiusY,
                    centerX : current_shape.centerX , 
                    centerY : current_shape.centerY ,
                    strokeC : current_shape.strokeC , 
                    strokeW : current_shape.strokeW ,
                    Fill :current_shape.Fill ,
                    DBid : current_shape.DBid
                }
            }
            else if (current_shape.type == "pencil"){ 
                shape = { 
                    type : "pencil" , 
                    X : current_shape.X , 
                    Y : current_shape.Y ,
                    strokeC : current_shape.strokeC , 
                    strokeW : current_shape.strokeW ,
                    DBid : current_shape.DBid
                }
            }
            else if(current_shape.type == "line"){
                shape = { 
                    type :"line", 
                    startX : current_shape.startX ,
                    startY : current_shape.startY , 
                    currentX : current_shape.currentX , 
                    currentY : current_shape.currentY , 
                    strokeC : current_shape.strokeC , 
                    strokeW : current_shape.strokeW ,
                    DBid : current_shape.DBid
                }
            }
            else if(current_shape.type == "arrow"){ 
                shape = { 
                    type : "arrow", 
                    startX : current_shape.startX ,
                    startY : current_shape.startY , 
                    currentX : current_shape.currentX , 
                    currentY : current_shape.currentY , 
                    strokeC : current_shape.strokeC , 
                    strokeW : current_shape.strokeW ,
                    DBid : current_shape.DBid
                }
            }
            else if(current_shape.type == "heart"){ 
                shape = { 
                    type : "heart", 
                    startX : current_shape.startX ,
                    startY : current_shape.startY , 
                    currentX : current_shape.currentX , 
                    currentY : current_shape.currentY , 
                    strokeC : current_shape.strokeC , 
                    strokeW : current_shape.strokeW ,
                    DBid : current_shape.DBid
                }
            }
            else if(current_shape.type == "text"){ 
                shape = { 
                    type : "text", 
                    text : current_shape.text , 
                    x : current_shape.x , 
                    y : current_shape.y , 
                    strokeC : current_shape.strokeC , 
                    DBid : current_shape.DBid
                }
            }
            // console.log("current shape db ID "+current_shape.DBid)
            socket.send(JSON.stringify({
                type : "update",
                //@ts-ignore
                message :  shape,
                roomId
            }))
            // console.log("after : " + JSON.stringify({existingShapes}))
            Redraw()
        }
        else if (shapeRef.current == "erase"){ 
            for(let i = 0 ; i < existingShapes.length ; i++){ 
                if (currentShapeIndex == i){ 
                    current_shape = existingShapes[i]; 
                    // console.log("foundeddd the shape here it is : " + current_shape)
                }
                if(current_shape.type == "rect") { 
                    shape = { 
                        type : "rect" , 
                        x: current_shape.x,
                        y: current_shape.y , 
                        width :current_shape.width, 
                        height : current_shape.height,
                        DBid : current_shape.DBid,
    
                    }
                }
                else if(current_shape.type == "circle"){ 
                    shape = { 
                        type  : "circle", 
                        radiusX :  current_shape.radiusX ,
                        radiusY : current_shape.radiusY , 
                        centerX : current_shape.centerX , 
                        centerY : current_shape.centerY ,
                        DBid : current_shape.DBid
                    }
                }
                else if (current_shape.type == "pencil"){ 
                    shape = { 
                        type : "pencil" , 
                        X : current_shape.X , 
                        Y : current_shape.Y ,
                        DBid : current_shape.DBid
                    }
                }
                // console.log("current shape db ID "+current_shape.DBid)
                socket.send(JSON.stringify({
                    type : "delete",
                    //@ts-ignore
                    message : shape,
                    roomId
                }))
                console.log("after : " + JSON.stringify({existingShapes}))
            }
        }
        else if(shapeRef.current == "eraseDrag"){ 
            // console.log("shapes to erase " + JSON.stringify(erased_Shapes))
            // console.log("mouse up tk pochgye hai ")
            // let sendhogye = false;
            if(erased_Shapes.length > 0){
                socket.send(JSON.stringify({
                    type :"deleteMany", 
                    message : erased_Shapes, 
                    roomId
                }))
            }
            clearCanvas(existingShapes , canvas , ctx,cameraZoom )
            // }
            
            // if(sendhogye){
                // console.log("websocket ya backend tk request pochgyi aur proceed bhi hogyi")
                erased_Shapes  = []
            // }
            
        }
        

        else if (shapeRef.current == "pan") { 
            lastZoom = cameraZoom
            // clearCanvas(existingShapes , canvas , ctx)
            Redraw()
        }
        else if(shapeRef.current == "select" && select == true){ 
            // console.log("sellected shape "+  JSON.stringify(selected_shape))
            if(selected_shape.type != "rect" && selected_shape.type != "circleRect"){ 
                // console.log("yhi se return hogya ")
                return ;
            }
            let updated_shape = selected_shape
            if(selected_shape.type == "rect"){ 
                // console.log("update request :" + JSON.stringify(selected_shape))
            if( updated_shape.width<=0 &&  updated_shape.height < 0){ 
               updated_shape.x +=  updated_shape.width ; 
                updated_shape.y +=  updated_shape.height ; 
                updated_shape.width = Math.abs( updated_shape.width); 
                updated_shape.height = Math.abs( updated_shape.height); 
            }
            else if( updated_shape.width >= 0 &&  updated_shape.height < 0){ 
                 updated_shape.y +=  updated_shape.height;
                 updated_shape.height = Math.abs( updated_shape.height) ;
            }
            else if( updated_shape.width <= 0 &&  updated_shape.height > 0){ 
                 updated_shape.x+= updated_shape.width ; 
                 updated_shape.width = Math.abs( updated_shape.width);
            }
                shape = { 
                    type : "rect" , 
                    x: Math.trunc(updated_shape.x),
                    y: Math.trunc(updated_shape.y) , 
                    width :Math.trunc(updated_shape.width), 
                    height :Math.trunc(updated_shape.height),
                    DBid :Math.trunc(updated_shape.DBid) 
                }
                selected_shape = {}
                socket.send(JSON.stringify({
                    type : "update",
                //@ts-ignore
                    message :  shape,
                    roomId
                }))
            }
            if(selected_shape.type == "circleRect"){ 
                // console.log("updated_shape " + JSON.stringify(updated_shape))
                    updated_shape.radiusY =Math.trunc(updated_shape.height / 2); 
                    updated_shape.radiusX =Math.trunc(updated_shape.width / 2)
                    updated_shape.centerX = Math.trunc(Math.trunc(updated_shape.x) + updated_shape.radiusX) ; 
                    updated_shape.centerY = Math.trunc(Math.trunc(updated_shape.y) + updated_shape.radiusY) ; 
                shape = { 
                    type : "circle", 
                    centerX : updated_shape.centerX ,  
                    centerY : updated_shape.centerY , 
                    radiusX : Math.abs(updated_shape.radiusX) , 
                    radiusY : Math.abs(updated_shape.radiusY) , 
                    strokeW : strokeRef.current,
                    DBid : updated_shape.DBid
                }
                selected_shape = {}
                socket.send(JSON.stringify({
                    type : "update",
                //@ts-ignore
                    message :  shape,
                    roomId
                }))
            }
        }
        else if(shapeRef.current == "clear"){ 
            // console.log("hello from here");
            socket.send(JSON.stringify({
                    type : "clear",
                    roomId
                }))
        }
        else { 
            return
        }

        
        
        if(shapeRef.current != "drag" && shapeRef.current!= "pan" && shapeRef.current!= "erase" && shapeRef.current!="eraseDrag" && shapeRef.current != "select" && shapeRef.current != "clear" && shapeRef.current != "text") {
            
            // console.log("after : " + JSON.stringify({existingShapes}))
            socket.send(JSON.stringify({
                type : "chat",
                message : JSON.stringify({
                    shape
                }),
                roomId
            }))
            if(shapeRef.current == "pencil") { 
                // clearCanvas(existingShapes,canvas,ctx)
                // Redraw()
            }
            // clearCanvas(existingShapes , canvas , ctx)
            // Redraw()
            // arrX.length = 0; 
            // arrY.length = 0;
        }
        // clearCanvas(existingShapes , canvas , ctx)
        //if agar ham cleaqrcanvas ko chalate hai to shapes rehete hai but thoda opacity kam hone lasgti hai if redraw reheta hai to bs shape jab srver se aata hai tab kuch hota H
        // Redraw()
            // console.log(e.clientX)
            // console.log(e.clientY)
            //IF DONO HI NHI TO jav shapes aajate hai tab dikkat hoti hai like tab brightness badti hai 
        })
      
        canvas.addEventListener("mousemove" , (e) => { 
            if(clicked) { 
                // console.log("inside the function")
                const mouseX =(e.clientX - window.innerWidth/2)/cameraZoom ;  
                const mouseY = (e.clientY - window.innerHeight/2)/cameraZoom ;
                const width = mouseX - startX + window.innerWidth/2 - cameraOffset.x; 
                const height = mouseY - startY + window.innerHeight/2 - cameraOffset.y;  
                
                if(shapeRef.current == "rect"){
                    cancelLiveDraw = false ; 
                    // console.log("inside the rect function")
                    // e.preventDefault()
                    // clearCanvas(existingShapes , canvas , ctx)
                    Redraw()
                    // requestAnimationFrame(animate);
                    ctx.beginPath();
                     ctx.roundRect(startX , startY , width , height , [40]);
                    // console.log("stroke Color ref .current" + strokeColorRef.current)
                    ctx.strokeStyle = strokeColorRef.current      
                    ctx.lineWidth =  Math.trunc(strokeRef.current);
                    ctx.fillStyle=bodyColorRef.current
                    ctx.fill();

                    ctx.stroke()
                    ctx.closePath() ;
                    //  let shape = {
                    //     type: "rect",
                    //     x : startX,
                    //     y : startY , 
                    //     height,
                    //     width
                    // }
                    // localStorage.setItem("existingShapes" , "existingShapes[]");

                    // console.log("shape to go " + shape)
                    // socket.send(JSON.stringify({
                    //     type : "liveDraw",
                    //     message : JSON.stringify({
                    //         shape
                    //     }),
                    //     roomId
                    // }))
                // ctx.beginPath();
                }
                else if(shapeRef.current == "circle"){ 
                    // e.preventDefault()
                    // clearCanvas(existingShapes , canvas , ctx )
                    Redraw()
                    // const radius = Math.sqrt(width * width + height * height) / 2;
                    const radiusX = width/2; 
                    const radiusY = height/2;
                    const centerX = (startX + (mouseX + window.innerWidth/2 - cameraOffset.x) )/ 2;
                    const centerY = (startY + (mouseY + window.innerHeight/2 - cameraOffset.y )) / 2;

                    // console.log("radiusX " + radiusX , "radiusY " + radiusY + "centerX " + centerX + "centerY " + centerY )
                    ctx.beginPath();
                    ctx.lineWidth =  Math.trunc(strokeRef.current);
                    ctx.ellipse(centerX , centerY , Math.abs(radiusX) , Math.abs(radiusY) , Math.PI * 2 , 0 , Math.PI * 2) 
                    ctx.strokeStyle = strokeColorRef.current
                    ctx.fillStyle=bodyColorRef.current
                    ctx.fill();
                    ctx.stroke(); 
                    ctx.closePath();
                
                }
                else if(shapeRef.current == "line"){ 
                    cancelLiveDraw = false ;
                    Redraw() 
                    ctx.beginPath(); 
                    ctx.moveTo(startX , startY)
                    ctx.lineTo(mouseX + window.innerWidth/2  - cameraOffset.x  , mouseY+ window.innerHeight/2 - cameraOffset.y)
                    ctx.strokeStyle = strokeColorRef.current;   
                    ctx.lineWidth = 5;
                    // ctx.fillStyle=bodyColorRef.current;
                    ctx.stroke()
                    // console.log("start X of MM " + startX + "start Y" + startY)
                    // console.log("line to of MM X :  " + (mouseX + window.innerWidth/2  - cameraOffset.x) + " Y : " + ( mouseY+ window.innerHeight/2 - cameraOffset.y) )
                    ctx.closePath()
                }
                else if(shapeRef.current == "arrow"){ 
                    // cancelLiveDraw = false
                    Redraw()
                    let currentX = (mouseX + window.innerWidth/2  - cameraOffset.x ); 
                    let currentY = (mouseY + window.innerHeight/2 - cameraOffset.y)
                    ctx.beginPath(); 
                    ctx.moveTo(startX ,startY)
                    ctx.lineTo(currentX, currentY)
                    ctx.lineWidth = strokeRef.current;
                    ctx.strokeStyle = strokeColorRef.current;
                    ctx.stroke() ;
                    const headsize = 25;
                    const angle = Math.atan2(startY - currentY , startX -currentX); 
                    let delta = Math.PI / 7 ; 
                    for(let i = 0 ; i < 2 ; i++){ 
                        ctx.moveTo(currentX , currentY)
                        const x = currentX + headsize * Math.cos(angle + delta); 
                        const y = currentY + headsize * Math.sin(angle + delta); 
                        ctx.lineTo(x , y)
                        delta *= -1;
                    }
                    ctx.stroke();
                    // ctx.strokeStyle =- strokeRef.current ;

                }
                else if(shapeRef.current == "pencil"){ 
                    // console.log("ArrayX" + arrX)
                    ctx.beginPath();
                     ctx.moveTo(arrX.slice(-1)   ,arrY.slice(-1));
                    ctx.lineTo(mouseX  + window.innerWidth/2  - cameraOffset.x , mouseY + window.innerHeight/2 - cameraOffset.y);
                     ctx.strokeStyle = strokeColorRef.current
                     ctx.lineWidth =  Math.trunc(strokeRef.current);
                    ctx.lineCap = 'round';
                    arrX.push(mouseX + window.innerWidth/2 - cameraOffset.x)
                    arrY.push(mouseY + window.innerHeight/2 - cameraOffset.y)
                    // ctx.lineCap = "round";
                    ctx.stroke();
                    ctx.closePath();
                    
                }
                else if(shapeRef.current == "heart"){ 
                    let x = startX ; 
                    let y = startY ;
                    let currentX = mouseX  + window.innerWidth/2  - cameraOffset.x; 
                    let currentY = mouseY + window.innerHeight/2 - cameraOffset.y ;
                    let width = currentX  - x ; 
                    let height = currentY - y ;
                    Redraw()
                    ctx.beginPath();
                    ctx.fillStyle = strokeColorRef.current;
                    ctx.lineWidth =  Math.trunc(strokeRef.current);
                    let topCurveHeight = height * 0.3;
                    ctx.moveTo(x, y + topCurveHeight);
                    // top left curve
                    ctx.bezierCurveTo(
                        x, y, 
                        x - width / 2, y, 
                        x - width / 2, y + topCurveHeight
                    );

                    // bottom left curve
                    ctx.bezierCurveTo(
                        x - width / 2, y + (height + topCurveHeight) / 2, 
                        x, y + (height + topCurveHeight) / 2, 
                        x, y + height
                    );

                    // bottom right curve
                    ctx.bezierCurveTo(
                        x, y + (height + topCurveHeight) / 2, 
                        x + width / 2, y + (height + topCurveHeight) / 2, 
                        x + width / 2, y + topCurveHeight
                    );

                    // top right curve
                    ctx.bezierCurveTo(
                        x + width / 2, y, 
                        x, y, 
                        x, y + topCurveHeight
                    );

                    ctx.closePath();
                  
                    ctx.stroke();
                }
                else if(shapeRef.current  == "drag"|| Drag == true){ 
                    if(!Drag) { 
                        return ; 

                    }
                    if(Drag){
                        e.preventDefault()
                        let currentX = (e.clientX - window.innerWidth/2)/cameraZoom
                        let currentY = (e.clientY - window.innerHeight/2)/cameraZoom
                        let  mouseX = currentX+window.innerWidth/2 -cameraOffset.x; 
                        let  mouseY = currentY+window.innerHeight/2 -cameraOffset.y;
                        
                        let dx = mouseX - startX ; 
                        let dy = mouseY - startY ; 
                        // console.log(dx , dy); 
                        
                        
                        current_shape = existingShapes[currentShapeIndex]
                        // console.log(currentShapeIndex)
                        // console.log(current_shape)
                        if(current_shape.type == "rect" ){ 
                            current_shape.x += dx ; 
                            current_shape.y += dy;
                         
                        //  clearCanvas(existingShapes , canvas , ctx)
                        Redraw()
                         startX = mouseX 
                         startY = mouseY
                        //  ctx.strokeStyle = "rgba(255 ,255, 255)"
                        //  ctx.strokeRect(current_shape.x , current_shape.y, current_shape.width , current_shape.height);
                        } 
                        else if (current_shape.type == "circle"){ 
                            current_shape.centerX +=dx ; 
                            current_shape.centerY +=dy;
                            Redraw()
                            startX = mouseX ; 
                            startY = mouseY
                        }
                        else if (current_shape.type == "pencil"){ 
                            for(let i = 0 ; i < current_shape.X.length ; i++){ 
                                current_shape.X[i] += dx;
                                current_shape.Y[i] += dy;
                            }
                            Redraw();
                            startX = mouseX; 
                            startY = mouseY;
                        }
                        else if (current_shape.type == "line" || current_shape.type == "arrow"){ 
                            current_shape.startX += dx; 
                            current_shape.startY += dy; 
                            current_shape.currentX += dx; 
                            current_shape.currentY +=dy;

                            Redraw(); 
                            startX = mouseX ; 
                            startY = mouseY ;
                        }
                        else if(current_shape.type == "heart"){ 
                            current_shape.startX += dx; 
                            current_shape.startY += dy; 
                            current_shape.currentX += dx ; 
                            current_shape.currentY += dy;
                            Redraw(); 
                            startX = mouseX ; 
                            startY = mouseY ;
                        }
                        else if(current_shape.type == "text"){ 
                            current_shape.x +=dx;
                            current_shape.y += dy; 
                            ctx.fillText(current_shape.text , current_shape.x , current_shape.y); 
                            Redraw(); 
                            startX  = mouseX ; 
                            startY = mouseY;
                        }
                    }
                }
                else if(shapeRef.current == "select" && select == true){
                    // cancelRedraw= false;
                    // console.log("hello from mouse move ")
                    // console.log("selected shape"+ JSON.stringify(selected_shape))
                    
                    let height = selected_shape.height ;
                    let currentX = (e.clientX - window.innerWidth/2)/cameraZoom
                    let currentY = (e.clientY - window.innerHeight/2)/cameraZoom
                    let  mouseX = currentX+window.innerWidth/2 -cameraOffset.x; 
                    let  mouseY = currentY+window.innerHeight/2 -cameraOffset.y;
                    if(whatToResize == "left" ){ 
                        // console.log("hello from mousemove hehe")
                        // console.log( "hello from left")
                        // console.log("current Selected Shape " + JSON.stringify(selected_shape))
                        if((selected_shape.height > 0 && selected_shape.width > 0)||(selected_shape.height <=0 && selected_shape.width > 0)){ 
                        // console.log("left ke plus wale mein")
                        //  console.log("selected shape width before operations " + selected_shape.width); 
                        // console.log("selected shape before operations X "  + selected_shape.x)
                        let difference  = selected_shape.x- mouseX
                        // console.log("difference" + difference)
                        selected_shape.x = mouseX
                        selected_shape.width+=difference
                        Redraw()
                        startX = mouseX 
                        startY = mouseY
                        // console.log("selected shape width " + selected_shape.width); 
                        // console.log("selected shape X "  + selected_shape.x)
                        // console.log("current mouse X" + mouseX)
                        //  console.log("difference" + difference)
                        //  console.log("current mouse X" + mouseX)
                         let khikhi = selected_shape.width - 5 + selected_shape.x
                        // console.log("selectedshape width plus selected shape x " + (khikhi))
                        if(selected_shape.width<0){ 
                            // console.log("went from here to right")
                            whatToResize = "right"
                            
                        }
                        // if((mouseX  == (selected_shape.width-1 + selected_shape.x))||  (mouseX == (selected_shape.width -2 + selected_shape.x))){ 
                        //     console.log("yha to agya")
                        //     selected_shape.x = khikhi; 
                        //     selected_shape.width = (khikhi-mouseX)-2
                        //      console.log("selected shape X from if "  + selected_shape.x)
                        //       console.log("selected shape X from if "  + selected_shape.width)
                        //     whatToResize = "right"
                        //     selected_shape
                        // } 
                        }
                        else if((selected_shape.height > 0 && selected_shape.width <= 0)||(selected_shape.height <= 0 && selected_shape.width <=0)){ 
                            // console.log("le bhosdu mein to yha agya left ke minus mein")
                            let difference = selected_shape.x + selected_shape.width -mouseX ; 
                            // selected_shape.x = mouseX ; 
                            selected_shape.width-=difference

                            Redraw()
                            startX = mouseX 
                            startY = mouseY
                             if(selected_shape.width>-1){ 
                                // console.log("went from here to right")
                                whatToResize = "right"
                            
                            }
                        }
                        
                    }
                    else if(whatToResize == "right"){ 
                        // console.log("hello from right")
                        // console.log("current Selected Shape " + JSON.stringify(selected_shape))
                        if((selected_shape.height > 0 && selected_shape.width > 0)||(selected_shape.height <=0 && selected_shape.width > 0)){ 
                            // console.log("right ke plus wale mein agya")
                        //  console.log("current Selected Shape " + JSON.stringify(selected_shape))

                        let difference  =  selected_shape.x+selected_shape.width - mouseX

                        selected_shape.width-=difference
                        // console.log("selected shape width " + selected_shape.width); 
                        // console.log("selected shape X "  + selected_shape.x)
                        // console.log("current mouse X" + mouseX)
                        //  console.log("difference" + difference)
                        //  console.log("current mouse X" + mouseX)
                        Redraw()
                        startX = mouseX 
                        startY = mouseY
                        // if((mouseX  == (selected_shape.x-selected_shape.width))||(mouseX == (selected_shape.x+2 -selected_shape.width))){ 
                        if(selected_shape.width < 0){
                            // console.log("hello from if ")
                            whatToResize = "left"
                            // selected_shape.x=selected_shape.width+mouseX;
                            // hehe = true;  
                            // selected_shape.width = selected_shape.x + 1;
                        }  
                        } 
                        else if((selected_shape.height > 0 && selected_shape.width <= 0)||(selected_shape.height <=0 && selected_shape.width <= 0)){ 
                            // console.log("le bhosdu right wale mein bhi agya right ke minus wale mein  ")
                            let difference = selected_shape.x  -mouseX ; 
                            selected_shape.x = mouseX ; 
                            selected_shape.width+=difference

                            Redraw()
                            startX = mouseX 
                            startY = mouseY
                            if(selected_shape.width >-1){
                            // console.log("hello from if ")
                            whatToResize = "left"
                            // selected_shape.x=selected_shape.width+mouseX;
                            // hehe = true;  
                            // selected_shape.width = selected_shape.x + 1;
                        } 
                        }
                    }
                    else if(whatToResize == "top"){ 
                        if((selected_shape.height > 0 && selected_shape.width > 0)||(selected_shape.height > 0 && selected_shape.width <= 0)){ 
                            
                            let difference  =  selected_shape.y - mouseY
                            selected_shape.y = mouseY
                            selected_shape.height+=difference
                            
                            Redraw()
                            startX = mouseX 
                            startY = mouseY
                            if(selected_shape.height<=0){ 
                                whatToResize="bottom"
                            }
                        } 
                        else if((selected_shape.height <=0 && selected_shape.width > 0)||(selected_shape.height <=0 && selected_shape.width <= 0)){ 
                            let difference = selected_shape.y + selected_shape.height - mouseY ; 
                            selected_shape.height -= difference 

                            Redraw()
                            startX = mouseX 
                            startY = mouseY
                            if(selected_shape.height>0){ 
                                whatToResize="bottom"
                            }
                        }
                    }

                    
                    else if(whatToResize == "bottom"){ 
                        if((selected_shape.height > 0 && selected_shape.width > 0) || (selected_shape.height > 0 && selected_shape.width <= 0)){ 
                            let difference = selected_shape.y + selected_shape.height - mouseY ; 
                            selected_shape.height -= difference;

                             Redraw()
                            startX = mouseX 
                            startY = mouseY
                            if(selected_shape.height<=0){ 
                                whatToResize="top"
                            }
                        }
                        else if((selected_shape.height <=0 && selected_shape.width > 0)||(selected_shape.height <=0 && selected_shape.width <= 0)){ 
                            let difference = selected_shape.y - mouseY ; 
                            selected_shape.y = mouseY ; 
                            selected_shape.height += difference; 

                            Redraw()
                            startX = mouseX 
                            startY = mouseY
                            if(selected_shape.height<=0){ 
                                whatToResize="bottom"
                            }
                        }
                    }
                    }
                    
                else if(shapeRef.current == "pan"){ 
                    canvas.style.cursor == "grabbing"
                    // const mousePos = getEventLocation(e);
                // if (mousePos) {
                    cameraOffset.x = getEventLocation(e).x/cameraZoom - dragStart.x
                    cameraOffset.y = getEventLocation(e).y/cameraZoom - dragStart.y;
                    // startX = mousePos.x;
                    // startY = mousePos.y;
                   Redraw()
                //    clearCanvas(existingShapes , canvas , ctx)
                // }
                    // Redraw()
                }
                else if(shapeRef.current == "eraseDrag"){ 
                    let currentX =  (e.clientX - window.innerWidth/2)/cameraZoom; 
                    let currentY = (e.clientY - window.innerHeight/2)/cameraZoom;

                    let  mouseX = currentX + window.innerWidth/2 -cameraOffset.x; 
                    let  mouseY = currentY + window.innerHeight/2 -cameraOffset.y;
                    // console.log(mouseX , mouseY)
                    for ( let shape of existingShapes) { 
                        // console.log("reached inside to find shape")
                        if(is_mouse_in_shape(mouseX , mouseY , shape)){ 
                            // console.log("checked the shape ")
                            if(erased_Shapes.length==0){ 
                                // console.log("the length of errased shapes is 0 so direct push")
                                erased_Shapes.push(shape)
                            }
                            else {
                                let hehe = false;
                                for(let i = 0 ; i < erased_Shapes.length ; i++){ 
                                    // console.log("checking if the shape doesnt already presesnt in the erased array")
                                    // console.log("that fake bitch"+JSON.stringify( erased_Shapes[i]))
                                    // console.log("that fake bitch db id " + erased_Shapes[i].DBid)
                                    // console.log("current shape db id" + shape.DBid)
                                    if(shape.DBid != erased_Shapes[i].DBid){
                                        // console.log("hehe true krdia")
                                        hehe = true ;
                                        // return;
                                    }  
                                    else{ 
                                        // console.log("hehe false krdia")
                                        // // return
                                        hehe = false;
                                        return;
                                    }                              
                                }
                                if(hehe){ 
                                    // console.log("pushed the shape")
                                    erased_Shapes.push(shape)
                                }
                            }
                        }
                    }
                    // console.log(erased_Shapes)
                }
                // else if(shapeRef.current == "pencil"){ }
                // ctx.ellipse(startX , startY , width , height , Math.PI / 4, 0, 2 * Math.PI)
                // ctx.stroke();

                
                // console.log(e.clientX)
                // console.log(e.clientY)
            } 
        })
        let lastZoom = cameraZoom
        function adjustZoom(zoomAmount:any){ 
            if(!clicked){ 
                if(zoomAmount){ 
                    cameraZoom += zoomAmount
                    setZoom(cameraZoom)
                }
                cameraZoom = Math.min(cameraZoom , MAX_ZOOM)
                setZoom(cameraZoom)
                cameraZoom = Math.max(cameraZoom , MIN_ZOOM)
                setZoom(cameraZoom)
                Redraw()
                //@ts-ignore
                fixZoomInLive(ctx, canvas , cameraZoom , cameraOffset)

                // console.log(cameraZoom)
            }
        }
        canvas.addEventListener('wheel', (e) => adjustZoom(e.deltaY*SCROLL_SENSITIVITY))
        //   @ts-ignore
        // function animate() {
                      //@ts-ignore

            // clearCanvas(existingShapes, canvas, ctx); // Make sure this resets transform first
            // requestAnimationFrame(animate);
        // }
        // requestAnimationFrame(Redraw);
          //@ts-ignore
        //   Redraw()
          
        
        // function clearCanvas(existingShapes : Shape[] ,canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D ){     
        //     ctx.setTransform(1, 0, 0, 1, 0, 0);
        //     ctx.clearRect(0, 0, canvas.width, canvas.height);
            
        //     ctx.translate( canvas.width / 2, canvas.height / 2 )
        //     ctx.scale(cameraZoom, cameraZoom)
        //     ctx.translate( -canvas.width / 2 + cameraOffset.x, -canvas.height / 2 + cameraOffset.y )
        
        //     // ctx.clearRect(0,0,window.innerWidth , window.innerHeight) no my co
        //     //   ctx.clearRect(0 , 0 , canvas.width , canvas.height); my code
        
        //       ctx.fillStyle = "rgba(0,0,0)"
        //       ctx.fillRect(0,0, canvas.width , canvas.height) 
        //       existingShapes.map((shape)=> { 
        //             if(shape.type === "rect") { 
        //                 ctx.strokeStyle = "rgba(255 ,255, 255)"
        //                 ctx.strokeRect(shape.x, shape.y , shape.width , shape.height); 
        //             }else if (shape.type == "circle"){ 
        //                     ctx.beginPath();
        //                     ctx.arc(shape.centerX , shape.centerY , Math.abs(shape.radius) , 0 , Math.PI * 2) 
        //                     ctx.stroke(); 
        //                     ctx.closePath();
        //             }
        //             else if ( shape.type == "pencil" ){ 
        //                 ctx.beginPath();
        //                 for(let i = 0 ; i < shape.X.length; i++){
        //                     ctx.lineTo(shape.X[i] , shape.Y[i]);
        //                     ctx.lineCap = "round";
        //                     ctx.stroke()
        //                 }
                        
                        
                       
                        
        //                 // ctx.lineTo(shape.X , shape.Y)
                        
        //             }
                       
        //             }
                
        //       )
        //     //   requestAnimationFrame( animate);
        // }
}
function fixZoomInLive(ctx : CanvasRenderingContext2D , canvas : HTMLCanvasElement , cameraZoom : number , cameraOffset : any){ 
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

   
    ctx.translate( window.innerWidth / 2, window.innerHeight / 2 )
    ctx.scale(cameraZoom, cameraZoom)
    ctx.translate( -window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y )
}
function LiveDraw(parseShape:any , ctx : CanvasRenderingContext2D , canvas : HTMLCanvasElement , exisitingShapes : any, cameraZoom : number, cameraOffset :any ,strokeRef:any){
    // console.log("hello from the parsedShape")
    // console.log("here is the parseShape I am getting :" +JSON.stringify(parseShape.shape))
    // console.log("here is the context i am getting " +JSON.stringify(ctx) ) ; 
    // console.log("here is the canvas I am getting " + canvas)
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    fixZoomInLive(ctx, canvas , cameraZoom , cameraOffset)
    clearCanvas(exisitingShapes , canvas , ctx , cameraZoom )
    let shape = parseShape.shape;
    // console.log("shapeX " + JSON.stringify(shape.x) + " shapeY " +shape.y + " weidth " + shape.width + " height " + shape.height )  
    // ctx.clearRect(0,0, canvas.width , canvas.height); 
    // ctx.fillRect(0,0,canvas.width,canvas.height)
    // ctx.beginPath();
    //  ctx.strokeStyle = "rgba(255 ,255, 255)"
    // ctx.lineWidth = 5
    // ctx.strokeRect(parseShape.x , parseShape.y , parseShape.width , parseShape.height);
    // ctx.closePath() 
    // clearCanvas(parseShape , ctx , canvas  ,1)     
 
    ctx.beginPath();
    ctx.lineWidth =  Math.trunc(strokeRef.current);
    ctx.strokeStyle = "rgba(255 ,255, 255)";
    ctx.roundRect(shape.x, shape.y , shape.width , shape.height , [40]); 
    ctx.stroke()
    ctx.closePath();
    
    // requestAnimationFrame(LiveDraw(parseShape , ctx , canvas))


}


function clearCanvas(existingShapes : Shape[] ,canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D ,cameraZoom :number){  
    // canvas.width = window.innerWidth
    // canvas.height = window.innerHeight
    //   ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.clearRect(0,0,window.innerWidth , window.innerHeight) no my co
     ctx.fillStyle = "rgba(17,17,17)"
      ctx.fillRect(0,0, canvas.width , canvas.height) 
      existingShapes.map((shape)=> { 
            if(shape.type === "rect") { 
                ctx.beginPath();
                //@ts-ignore
                ctx.roundRect(shape.x, shape.y , shape.width , shape.height , [40]); 
                //@ts-ignore
                ctx.lineWidth =  Math.trunc(shape.strokeW) 
                //@ts-ignore
                ctx.strokeStyle = shape.strokeC;
                //@ts-ignore
                ctx.fillStyle = shape.Fill
                ctx.fill();
                ctx.stroke()
                ctx.closePath();
            }else if (shape.type == "circle"){ 
                    ctx.beginPath();
                    ctx.ellipse(shape.centerX , shape.centerY , Math.abs(shape.radiusX) , Math.abs(shape.radiusY), Math.PI * 2,  0 , Math.PI * 2)
                    //@ts-ignore
                    ctx.lineWidth =  Math.trunc(shape.strokeW) 
                    //@ts-ignore
                    ctx.strokeStyle = shape.strokeC;
                    //@ts-ignore
                    ctx.fillStyle = shape.Fill
                    ctx.fill();
                    ctx.stroke(); 
                    ctx.closePath();
            }
            else if ( shape.type == "pencil" ){ 
                ctx.beginPath();
                for(let i = 0 ; i < shape.X.length; i++){
                    ctx.beginPath()
                    
                    ctx.lineCap = "round";
                    //@ts-ignore
                    
                    ctx.lineWidth =  Math.trunc(shape.strokeW) ;
                    //@ts-ignore
                    ctx.strokeStyle = shape.strokeC;
                    ctx.moveTo(shape.X[i-1] , shape.Y[i-1]);
                    ctx.lineTo(shape.X[i] , shape.Y[i]);
                    ctx.stroke()
                    ctx.closePath()
                }
                 // ctx.lineTo(shape.X , shape.Y)    
            }
            else if(shape.type == "line"){ 
                // console.log("yha tk poch gya hu " + JSON.stringify(shape))
                ctx.beginPath(); 
                // ctx.moveTo(shape.startX , shape.startY); 
                // ctx.lineTo(shape.x , shape.y); 
                ctx.moveTo(shape.startX , shape.startY); 
                ctx.lineTo(shape.currentX , shape.currentY); 
                ctx.strokeStyle = shape.strokeC ; 
                ctx.lineWidth = shape.strokeW ; 
                ctx.stroke() ; 
               
                ctx.closePath()
            }
            else if(shape.type == "arrow"){ 
                  ctx.beginPath(); 
                // ctx.moveTo(shape.startX , shape.startY); 
                // ctx.lineTo(shape.x , shape.y); 
                ctx.moveTo(shape.startX , shape.startY); 
                ctx.lineTo(shape.currentX , shape.currentY); 
                ctx.strokeStyle = shape.strokeC ; 
                ctx.lineWidth = shape.strokeW ; 
                ctx.stroke() ; 
                const headsize = 25;
                    const angle = Math.atan2(shape.startY - shape.currentY , shape.startX - shape.currentX); 
                    let delta = Math.PI / 7 ; 
                    for(let i = 0 ; i < 2 ; i++){ 
                        ctx.moveTo(shape.currentX , shape.currentY)
                        const x = shape.currentX + headsize * Math.cos(angle + delta); 
                        const y = shape.currentY + headsize * Math.sin(angle + delta); 
                        ctx.lineTo(x , y)
                        delta *= -1;
                    }
                    ctx.stroke();
                ctx.closePath()
            }
            else if(shape.type == "text"){ 
                ctx.font = "50px Gamja_Flower";
                ctx.fillStyle = shape.strokeC;
                ctx.textBaseline = "hanging";
                ctx.fillText(shape.text , shape.x ,shape.y)
            }
            else if(shape.type == "heart"){ 
                let x = shape.startX ; 
                let y = shape.startY ;
                let currentX =shape.currentX
                let currentY = shape.currentY ;
                let width = currentX  - x ; 
                let height = currentY - y ;
                ctx.beginPath();
                ctx.lineWidth =  Math.trunc(shape.strokeW);
                let topCurveHeight = height * 0.3;
                ctx.moveTo(x, y + topCurveHeight);
                // top left curve
                ctx.bezierCurveTo(
                    x, y, 
                    x - width / 2, y, 
                    x - width / 2, y + topCurveHeight
                );

                // bottom left curve
                ctx.bezierCurveTo(
                    x - width / 2, y + (height + topCurveHeight) / 2, 
                    x, y + (height + topCurveHeight) / 2, 
                    x, y + height
                );

                // bottom right curve
                ctx.bezierCurveTo(
                    x, y + (height + topCurveHeight) / 2, 
                    x + width / 2, y + (height + topCurveHeight) / 2, 
                    x + width / 2, y + topCurveHeight
                );

                // top right curve
                ctx.bezierCurveTo(
                    x + width / 2, y, 
                    x, y, 
                    x, y + topCurveHeight
                );

                ctx.closePath();
                ctx.fillStyle = shape.strokeC;
                ctx.stroke();


            }
            else if(shape.type == "circleRect"){ 
                     shape.radiusY = shape.height / 2; 
                    shape.radiusX = shape.width / 2
                    shape.centerX = shape.x + shape.radiusX ; 
                    shape.centerY = shape.y + shape.radiusY ;   
                    
                    
                    ctx.beginPath();
                    //@ts-ignore
                    ctx.lineWidth =  Math.trunc(shape.strokeW) 
                    //@ts-ignore
                    ctx.strokeStyle = shape.strokeC;
                    ctx.ellipse(shape.centerX , shape.centerY , Math.abs(shape.radiusX) , Math.abs(shape.radiusY), Math.PI * 2,  0 , Math.PI * 2) 
                    ctx.strokeRect(shape.x , shape.y  , shape.width , shape.height ) ;
                    ctx.stroke(); 
                    ctx.closePath();
            }      
            }
        
      )
    
}

async function getExistingShapes(roomId : string ) { 
    const res = await  axios.get(`${HTTP_BACKEND}/chats/${roomId}`); 
    //@ts-ignore
    let localres  = JSON.parse(localStorage.getItem("existingShapes"))
    // console.log("localstorage se ye items aye" + JSON.stringify(localres))
    const messages = res.data.messages; 
    // console.log("hello from get exisiting sapes"); 
    // console.log("message reciive : "  + JSON.stringify(messages))

    // const parseShape = JSON.parse(message.message)
    //         const id:number = JSON.parse(message.id)
    //         const mainShape = parseShape.shape 
    //         mainShape.DBid  = id
    //         existingShapes.push(mainShape)
    //         console.log("exisitingShapes: "  +JSON.stringify(existingShapes))
    
    const shapes = messages.map((x : {message : string , id :string})=> { 
        const messageData = JSON.parse(x.message)
        const messageDataAll = JSON.parse(x.id)
        // console.log("hello from map function"); 
        // console.log("i got this here" + JSON.stringify(messageDataAll))
        const id  =  messageDataAll;
        const shape = messageData.shape
        shape.DBid = id ; 
        
        // return messageData.shape;
        // console.log(" shape jo aaraha hai " + JSON.stringify(shape))
        return shape; 

    })
    // console.log(shapes)
     localStorage.setItem("existingShapes" , JSON.stringify(shapes))
    return shapes;
   
}

