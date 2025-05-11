import axios from "axios"
import { HTTP_BACKEND } from "@/config"
// import { eventNames } from "process";
// import { setHeapSnapshotNearHeapLimit } from "v8";
import { RefObject } from "react";
import { json } from "stream/consumers";
// import { Cambay, Caveat, Flow_Circular } from "next/font/google";
// import { SocketAddress } from "net";
// import { cookies } from "next/headers";
type Shape = { 
    type: "rect" ; 
    x:number;
    y:number;
    width: number;
    height : number; 
    DBid ?: number
} | { 
    type: "circle";
    centerX : number; 
    centerY :number; 
    radius : number;
    DBid ?:number
}
| { 
   type: "pencil" ;
   X  : number[] ; 
   Y :number[] ; 
   DBid ?: number ; 

} | {
    type : "drag" ; 
    DBid ?: number
    
}


export async function initDraw(canvas : HTMLCanvasElement , roomId : string  , socket : WebSocket  ,shapeRef:RefObject<string> ){
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
    
    let cameraZoom = 1 
    let MAX_ZOOM = 5 
    let MIN_ZOOM = 0.1
    let ctx = canvas.getContext("2d"); 
    //@ts-ignore
    // ctx.fillStyle = "rgba(0,0,0)"
   

    // canvas.width = window.innerWidth; 
    // canvas.height = window.innerHeight
    // canvas.style.width = '100vw'
    // canvas.style.height = '100vh'
    // canvas.style.position = 'absolute';
    // canvas.style.top = '0';
    // canvas.style.left = '0';
   

    
    let SCROLL_SENSITIVITY = 0.0005
    let cancelRedraw = false ;
    
    
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


        clearCanvas(existingShapes, canvas, ctx);
        if(!cancelRedraw){ 
        requestAnimationFrame(Redraw)
        }
    }
    let dragStart = { x : 0 , y : 0 }
    
    
    


    let existingShapes: Shape[] = await getExistingShapes(roomId)
    let  arrX : any = [];
    let  arrY: any = [];    
    if(!ctx){ 
        return
    }
   


    socket.onmessage = (event) => { 
        
        const message = JSON.parse(event.data); 
        console.log("websocket message " + JSON.stringify(message))
        // clearCanvas(existingShapes , canvas , ctx )
        if(message.type == "chat"){ 
            const parseShape = JSON.parse(message.message)
            const id:number = JSON.parse(message.id)
            const mainShape = parseShape.shape 
            mainShape.DBid  = id
            existingShapes.push(mainShape)
            console.log("exisitingShapes: "  +JSON.stringify(existingShapes))
            clearCanvas(existingShapes , canvas , ctx )
            // Redraw()
            console.log("rerenderd")
        }
        if(message.type == "update"){ 
            const parseShape =message.message
           for(let i = 0 ; i < existingShapes.length ; i++) { 
            if(parseShape.DBid == existingShapes[i].DBid){ 
                existingShapes[i] = parseShape;
                console.log("updated the exisitng shape")
                console.log(" rerenderd exisitingShapes: "  +JSON.stringify(existingShapes))
                clearCanvas(existingShapes , canvas , ctx )
                // Redraw()
            }
            else { 
                console.log("cant find the exisiting shape! oh oh")
            }
           }         
        }
        if(message.type == "delete"){ 
            const parseShape = message.message;
            
            for(let i = 0 ; i < existingShapes.length ; i++) { 
                if(parseShape.DBid == existingShapes[i].DBid){ 
                    existingShapes.splice(i , 1)
                    // existingShapes[i] = parseShape;
                    console.log("deleted the exisitng shape")
                    console.log(" rerenderd exisitingShapes: "  +JSON.stringify(existingShapes))
                    clearCanvas(existingShapes , canvas , ctx )
                    // Redraw()
                    return;
                }
                
            }
        }
       
    }

        

        clearCanvas(existingShapes , canvas , ctx )
        let clicked = false ; 
        let startX = 0; 
        let startY = 0;
        let Drag = false; 
        let currentShapeIndex :number = 0 
        let databaseId :number ;
        let current_shape :any  ={}
        

        function getEventLocation(e:any)
            {
                return { x: e.clientX -offset_x , y: e.clientY - offset_y }        
  
            }

        function is_mouse_in_shape(x:number , y :number , shape :any){ 
            console.log("inside rect")
            if(shape.type == "rect"){ 
                let shape_Left = shape.x; 
                let shape_Right = shape.x + shape.width;
                let shape_top = shape.y;
                let shape_bottom = shape.y + shape.height;

                if(x > shape_Left && x < shape_Right && y > shape_top && y < shape_bottom){ 
                    return true
                 }
            }
            else if(shape.type == "circle"){ 
                console.log("I have reached till here (inside the circle if )")
                console.log("shape : " + JSON.stringify(shape))
                
                let shape_left = shape.centerX - shape.radius; 
                let shape_Right =  shape.centerX + shape.radius 
                let shape_top = shape.radius + shape.centerY ; 
                let shape_bottom = shape.centerY - shape.radius;
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
                console.log("shape " + shape)
                let arrayX = shape.X 
                let arrayY = shape.Y
                console.log("inside pensil")
                for(let i = 0 ; i < shape.X.length ; i++){ 
                    
                    if(x == arrayX[i] || y == arrayY[i] || x == arrayX[i]+1 || x == arrayX[i] -1 || y == arrayY[i] - 1 || y == arrayY[i] + 1){
                        return true
                    }
                 }
            }
            
            return false
        }
        canvas.addEventListener("mousedown" , (e) =>{
                if(shapeRef.current == "rect" || shapeRef.current == "circle" || shapeRef.current == "pencil"){
                canvas.style.cursor = 'crosshair'
                }
            
            console.log(cameraOffset)
            cancelRedraw = true ; 
            console.log(shapeRef.current)
            clicked = true
            startX = e.clientX- cameraOffset.x;
            startY = e.clientY- cameraOffset.y ;
            
            
            arrX.length = 0; 
            arrY.length = 0;
            console.log(arrX); 
            console.log(arrY)
            console.log("before " + JSON.stringify({existingShapes}));
            if(shapeRef.current == "pencil"){ 
                // ctx.beginPath()
                ctx.moveTo(startX ,startY)
            }
            let index = 0
            if(shapeRef.current == "drag" || shapeRef.current == "erase"){     
            e.preventDefault()  
            for(let shape of existingShapes){  
                if(shape.type == "rect" || shape.type == "circle" || shape.type == "pencil"){
                    if(is_mouse_in_shape(startX , startY ,shape)){
                        if(shape.DBid == null){ 
                            console.warn("shape foound nut missign db id " , shape); 
                            return;
                        }
                        else{ 
                            console.log("found shape +id " )
                        }
                        console.log('yes'); 
                        Drag = true;
                        
                        currentShapeIndex = index;
                        console.log("currentShapeIndexFrom mosueee Down : " + currentShapeIndex)
                        //@ts-ignore
                        databaseId = shape.DBid;
                        return;
                    }
                    else{ 
                        console.log("no")
                    }
                    index++;
                }
                else{
                    continue;
                }
            }
            }
            if(shapeRef.current == "pan"){ 
                dragStart.x = getEventLocation(e).x/cameraZoom - cameraOffset.x; 
                dragStart.y = getEventLocation(e).y/cameraZoom -cameraOffset.y
                // cancelRedraw = false ; 
            }
            // if(shapeRef.current == "erase"){
            //     e.preventDefault()

            // }
            else{ 
                return;
            }
            
            
        })
        canvas.addEventListener("mouseup" , (e)=> { 
        if(shapeRef.current == "rect" || shapeRef.current == "circle" || shapeRef.current == "pencil"){
                canvas.style.cursor = 'default'
        }
        
        clicked = false ;
        cancelRedraw = false ; 

        const width = e.clientX   - startX - cameraOffset.x; 
        const height = e.clientY  -startY - cameraOffset.y ; 

        let shape :Shape | null = null;
        if(shapeRef.current == "rect"){
           
             shape = {
                type: "rect",
                x : startX ,
                y : startY , 
                height,
                width
            }
           
        }
        else if(shapeRef.current == "circle"){ 
            const radius = Math.sqrt(width * width + height * height) / 2;
            const centerX = (startX + (e.clientX - cameraOffset.x) )/ 2;
            const centerY = (startY + (e.clientY - cameraOffset.y )) / 2;
            

 
            shape  = { 
                type : "circle", 
                radius : radius , 
                centerX : centerX  , 
                centerY : centerY,

            }
        }
        else if(shapeRef.current == "pencil"){ 
            
            ctx.stroke();
            ctx.beginPath();

            shape = { 
                type : "pencil" , 
                X : arrX , 
                Y : arrY
            }
            // Redraw()
        }
        else if (shapeRef.current == "drag"){ 
            if(!Drag){ 
                return ;
            }
            e.preventDefault(); 
            Drag = false ; 
            
            console.log("currentShapeIndex afterwards :::::::>" + currentShapeIndex)
            console.log("currenttt shape bhi haii " +JSON.stringify(current_shape))
            for(let i = 0 ; i < existingShapes.length ; i++){ 
                if (currentShapeIndex == i){ 
                    current_shape = existingShapes[i]; 
                    console.log("foundeddd the shape here it is : " + current_shape)
                }
                
            }
            
            console.log("currrent shape : " + current_shape)
            if(current_shape.type == "rect") { 
                shape = { 
                    type : "rect" , 
                    x: current_shape.x,
                    y: current_shape.y , 
                    width :current_shape.width, 
                    height : current_shape.height,
                    DBid : current_shape.DBid

                }
            }
            else if(current_shape.type == "circle"){ 
                shape = { 
                    type  : "circle", 
                    radius :  current_shape.radius , 
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
            console.log("current shape db ID "+current_shape.DBid)
            socket.send(JSON.stringify({
                type : "update",
                //@ts-ignore
                message :  shape,
                roomId
            }))
            console.log("after : " + JSON.stringify({existingShapes}))
            
        }
        else if (shapeRef.current == "erase"){ 
            for(let i = 0 ; i < existingShapes.length ; i++){ 
                if (currentShapeIndex == i){ 
                    current_shape = existingShapes[i]; 
                    console.log("foundeddd the shape here it is : " + current_shape)
                }
                if(current_shape.type == "rect") { 
                    shape = { 
                        type : "rect" , 
                        x: current_shape.x,
                        y: current_shape.y , 
                        width :current_shape.width, 
                        height : current_shape.height,
                        DBid : current_shape.DBid
    
                    }
                }
                else if(current_shape.type == "circle"){ 
                    shape = { 
                        type  : "circle", 
                        radius :  current_shape.radius , 
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
                console.log("current shape db ID "+current_shape.DBid)
                socket.send(JSON.stringify({
                    type : "delete",
                    //@ts-ignore
                    message : shape,
                    roomId
                }))
                console.log("after : " + JSON.stringify({existingShapes}))
            }
        }

        else if (shapeRef.current == "pan") { 
            lastZoom = cameraZoom
            // clearCanvas(existingShapes , canvas , ctx)
            Redraw()
        }
        else { 
            return
        }
        
        
        if(shapeRef.current != "drag" && shapeRef.current!= "pan" && shapeRef.current!= "erase") {
            
            console.log("after : " + JSON.stringify({existingShapes}))
            socket.send(JSON.stringify({
                type : "chat",
                message : JSON.stringify({
                    shape
                }),
                roomId
            }))
            arrX.length = 0; 
            arrY.length = 0;
        }
            // console.log(e.clientX)
            // console.log(e.clientY)
        })
        canvas.addEventListener("mousemove" , (e) => { 
            if(clicked) { 
                // console.log("inside the function")
                const width = e.clientX - startX - cameraOffset.x; 
                const height = e.clientY - startY - cameraOffset.y ;  
                
                if(shapeRef.current == "rect"){
                    // console.log("inside the rect function")
                    // e.preventDefault()
                    // clearCanvas(existingShapes , canvas , ctx)
                    Redraw()
                    // requestAnimationFrame(animate);
                    ctx.strokeStyle = "rgba(255 ,255, 255)"
                    ctx.strokeRect(startX , startY , width , height); 
                // ctx.beginPath();
                }
                else if(shapeRef.current == "circle"){ 
                    // e.preventDefault()
                    // clearCanvas(existingShapes , canvas , ctx )
                    Redraw()
                    const radius = Math.sqrt(width * width + height * height) / 2;
                    const centerX = (startX + (e.clientX - cameraOffset.x)) / 2;
                    const centerY = (startY + (e.clientY - cameraOffset.y)) / 2;

                    ctx.beginPath();
                    ctx.arc(centerX , centerY , Math.abs(radius) , 0 , Math.PI * 2) 
                    ctx.stroke(); 
                    ctx.closePath();
                
                }
                else if(shapeRef.current == "pencil"){ 
                    console.log("ArrayX" + arrX)
                    ctx.lineWidth = 1;
                    ctx.lineCap = 'round';
                    arrX.push(e.clientX - cameraOffset.x)
                    arrY.push(e.clientY - cameraOffset.y)
                    ctx.lineTo(e.clientX - cameraOffset.x , e.clientY - cameraOffset.y);
                    ctx.lineCap = "round";
                    ctx.stroke();
                    
                }
                else if(shapeRef.current  == "drag"){ 
                    if(!Drag) { 
                        return ; 

                    }
                    if(Drag){
                        e.preventDefault()
                        let  mouseX = e.clientX -cameraOffset.x; 
                        let  mouseY = e.clientY -cameraOffset.y;
                        
                        let dx = mouseX - startX ; 
                        let dy = mouseY - startY ; 
                        console.log(dx , dy); 
                        
                        
                        current_shape = existingShapes[currentShapeIndex]
                        console.log(currentShapeIndex)
                        console.log(current_shape)
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
                        
                    }
                }
                else if(shapeRef.current == "pan"){ 
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
                }
               
                cameraZoom = Math.min(cameraZoom , MAX_ZOOM)
                cameraZoom = Math.max(cameraZoom , MIN_ZOOM)
                Redraw()

                // console.log(zoomAmount)
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

function clearCanvas(existingShapes : Shape[] ,canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D ){  
    // canvas.width = window.innerWidth
    // canvas.height = window.innerHeight
    //   ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.clearRect(0,0,window.innerWidth , window.innerHeight) no my co
    //   ctx.fillStyle = "rgba(0,0,0)"
      ctx.fillRect(0,0, canvas.width , canvas.height) 
      existingShapes.map((shape)=> { 
            if(shape.type === "rect") { 
                ctx.strokeStyle = "rgba(255 ,255, 255)"
                ctx.strokeRect(shape.x, shape.y , shape.width , shape.height); 
            }else if (shape.type == "circle"){ 
                    ctx.beginPath();
                    ctx.arc(shape.centerX , shape.centerY , Math.abs(shape.radius) , 0 , Math.PI * 2) 
                    ctx.stroke(); 
                    ctx.closePath();
            }
            else if ( shape.type == "pencil" ){ 
                ctx.beginPath();
                for(let i = 0 ; i < shape.X.length; i++){
                    ctx.lineTo(shape.X[i] , shape.Y[i]);
                    ctx.lineCap = "round";
                    ctx.stroke()
                }
                
                
               
                
                // ctx.lineTo(shape.X , shape.Y)
                
            }
               
            }
        
      )
    
}

async function getExistingShapes(roomId : string ) { 
    const res = await  axios.get(`${HTTP_BACKEND}/chats/${roomId}`); 
    const messages = res.data.messages; 
    
    const shapes = messages.map((x : {message : string})=> { 
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })
    return shapes;
}