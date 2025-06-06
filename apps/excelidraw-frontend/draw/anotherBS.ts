import axios from "axios"
import { HTTP_BACKEND } from "@/config"
import { eventNames } from "process";
import { setHeapSnapshotNearHeapLimit } from "v8";
import { RefObject } from "react";
import { Flow_Circular } from "next/font/google";
type Shape = { 
    type: "rect" ; 
    x:number;
    y:number;
    width: number;
    height : number; 
} | { 
    type: "circle";
    centerX : number; 
    centerY :number; 
    radius : number;
}
| { 
   type: "pencil" ;
   X  : number[] ; 
   Y :number[] ; 
} | {
    type : "drag" ; 
    
}
type ShapeWithId = { shape : Shape  ; id :number}


export async function initDraw(canvas : HTMLCanvasElement , roomId : string  , socket : WebSocket  ,shapeRef:RefObject<string> ){
   
    const ctx = canvas.getContext("2d")

    let existingShapes: ShapeWithId[] | any = await getExistingShapes(roomId)
    let  arrX : any = [];
    let  arrY: any = [];    
    if(!ctx){ 
        return
    }

    socket.onmessage = (event) => { 
        
        const message = JSON.parse(event.data); 
        console.log("websocket message " + JSON.stringify(message))
        if(message.type == "chat"){ 
            const parseShape = JSON.parse(message.message , message.id) 
            existingShapes.push({shape : parseShape.shape , id : parseShape.id})
            console.log("existing shapes log : " + existingShapes)
            clearCanvas(existingShapes.shape , canvas , ctx )
        }
    }
    

        

        clearCanvas(existingShapes.shape , canvas , ctx )
        let clicked = false ; 
        let startX = 0; 
        let startY = 0;
        let Drag = false; 
        let currentShapeIndex :number = 0 
        let databaseId = 0;
        


        if(shapeRef.current == "circle") { 


        }
        if(shapeRef.current == "line"){ 

        }
        if(shapeRef.current == "square"){ 

        }
        if(shapeRef.current == "arrow"){ 
            
        }
        function is_mouse_in_shape(x:number , y :number , shape :any){ 
            let shape_Left = shape.x; 
            let shape_Right = shape.x + shape.width;
            let shape_top = shape.y;
            let shape_bottom = shape.y + shape.height;

            if(x > shape_Left && x < shape_Right && y > shape_top && y < shape_bottom){ 
                return true
            }
            return false
        }
        canvas.addEventListener("mousedown" , (e) =>{
            console.log(shapeRef.current)
            clicked = true
            startX = e.clientX
            startY = e.clientY
            
            
            arrX.length = 0; 
            arrY.length = 0;
            console.log(arrX); 
            console.log(arrY)
            console.log("before " + JSON.stringify({existingShapes}));
            if(shapeRef.current == "pencil"){ 
                ctx.moveTo(startX ,startY)
            }
            let index = 0
            if(shapeRef.current == "drag"){     
            e.preventDefault()     
            for(let shape of existingShapes.shape){  
                if(shape.type == "rect"){
                    if(is_mouse_in_shape(startX , startY ,shape)){
                        console.log('yes'); 
                        Drag = true;
                        currentShapeIndex = index;
                        // databaseId = 
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
            
            
        })
        canvas.addEventListener("mouseup" , (e)=> { 
        clicked = false ;
       
        const width = e.clientX - startX ; 
        const height = e.clientY -startY ; 

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
            const centerX = (startX + e.clientX) / 2;
            const centerY = (startY + e.clientY) / 2;
            

 
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
            
        }
        else if (shapeRef.current == "drag"){ 
            if(!Drag){ 
                return ;
            }
            e.preventDefault(); 
            Drag = false ; 
            shape = { 
                type : "drag"
            }
            console.log("after : " + JSON.stringify({existingShapes}))
        }
        else { 
            return
        }
        
        if(shapeRef.current != "drag"){
        existingShapes.push(shape)
        console.log("after : " + JSON.stringify({existingShapes}))
            socket.send(JSON.stringify({
                type : "chat",
                message : JSON.stringify({
                    shape
                }),
                roomId
            }))
        }
            // console.log(e.clientX)
            // console.log(e.clientY)
        })
        canvas.addEventListener("mousemove" , (e) => { 
            if(clicked) { 
                const width = e.clientX - startX; 
                const height = e.clientY - startY;  
                
                if(shapeRef.current == "rect"){
                    clearCanvas(existingShapes , canvas , ctx)
                    ctx.strokeStyle = "rgba(255 ,255, 255)"
                    ctx.strokeRect(startX , startY , width , height); 
                // ctx.beginPath();
                }
                else if(shapeRef.current == "circle"){ 
                    clearCanvas(existingShapes , canvas , ctx )
                    const radius = Math.sqrt(width * width + height * height) / 2;
                    const centerX = (startX + e.clientX) / 2;
                    const centerY = (startY + e.clientY) / 2;

                    ctx.beginPath();
                    ctx.arc(centerX , centerY , Math.abs(radius) , 0 , Math.PI * 2) 
                    ctx.stroke(); 
                    ctx.closePath();
                
                }
                else if(shapeRef.current == "pencil"){ 
                    console.log("ArrayX" + arrX)
                    ctx.lineWidth = 1;
                    ctx.lineCap = 'round';
                    arrX.push(e.clientX)
                    arrY.push(e.clientY)
                    ctx.lineTo(e.clientX , e.clientY);
                    ctx.lineCap = "round";
                    ctx.stroke();
                    
                }
                else if(shapeRef.current  == "drag"){ 
                    if(!Drag) { 
                        return ; 

                    }
                    if(Drag){
                        e.preventDefault()
                        let  mouseX = e.clientX; 
                        let  mouseY = e.clientY;
                        
                        let dx = mouseX - startX ; 
                        let dy = mouseY - startY ; 
                        console.log(dx , dy); 
                        
                        
                        let current_shape = existingShapes[currentShapeIndex].shape
                        console.log(currentShapeIndex)
                        console.log(current_shape)
                        if(current_shape.type == "rect"){ 
                            current_shape.x += dx ; 
                            current_shape.y += dy;
                         
                         clearCanvas(existingShapes.shape , canvas , ctx)

                         startX = mouseX 
                         startY = mouseY
                        //  ctx.strokeStyle = "rgba(255 ,255, 255)"
                        //  ctx.strokeRect(current_shape.x , current_shape.y, current_shape.width , current_shape.height);
                        } 
                    }
                }
                // else if(shapeRef.current == "pencil"){ }
                // ctx.ellipse(startX , startY , width , height , Math.PI / 4, 0, 2 * Math.PI)
                // ctx.stroke();

                
                // console.log(e.clientX)
                // console.log(e.clientY)
            } 
        })
}
function clearCanvas(existingShapes : ShapeWithId[] ,canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D ){ 
      ctx.clearRect(0 , 0 , canvas.width , canvas.height);
      ctx.fillStyle = "rgba(0,0,0)"
      ctx.fillRect(0,0, canvas.width , canvas.height) 
      existingShapes.map(({shape})=> { 
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
    
    const shapes = messages.map((x : {message : string ; id : number})=> { 
        const messageData = JSON.parse(x.message)
        return {
            shape : messageData.shape ,
            id : x.id
        } 

    })
    return shapes;
}