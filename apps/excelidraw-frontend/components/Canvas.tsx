// import { initDraw } from "@/draw";
// import { initDraw } from "@/draw";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react"

export default function Canvas ({roomId , socket} : { 
    roomId : string , 
    socket : WebSocket
} ){ 
    type Shapee = "pencil " | "rect" | "circle" | "square" | "line" | "arrow" | "drag" | "pan" |string

    const canvasRef = useRef<HTMLCanvasElement>(null); 
    const [currShape , setShape] = useState<Shapee>("");
    const shapeRef = useRef<Shapee> ("")

    useEffect(()=>{
        shapeRef.current = currShape;
    },[currShape])
    
    useEffect(()=> {
        if(canvasRef.current){  
            
            initDraw(canvasRef.current ,roomId , socket ,shapeRef)
        }
    } , [canvasRef ])
    return <>
    <div className="flex items-center justify-center">
        <div className="static w-screen h-screen">
        <canvas id="canvas"  ref={canvasRef} > </canvas> 
        </div>
        <div className="absolute bottom-0 right-0 m-3 rounded bg-green-600">
            <button onClick={()=> {setShape("line")}} className="bg-white p-4 m-2 rounded-lg">
                line
            </button>
            <button onClick={()=> {setShape("circle")}} className="bg-white p-4 m-2 rounded-lg">
                Circle
            </button>
            <button onClick={()=> {setShape("square")}} className="bg-white p-4 m-2 rounded-lg">
                Square
            </button>
            <button onClick={()=> {setShape("arrow")}} className="bg-white p-4 m-2 rounded-lg">
                Arrow
            </button>
            <button onClick={()=> {setShape("rect")}} className="bg-white p-4 m-2 rounded-lg">
                Rect
            </button>
            <button onClick={()=> {setShape("pencil")}} className="bg-white p-4 m-2 rounded-lg">
                Pencil
            </button>
            <button onClick={()=> {setShape("drag")}} className="bg-white p-4 m-2 rounded-lg">
                Drag
            </button>
            <button onClick={()=> {setShape("pan")}} className="bg-white p-4 m-2 rounded-lg">
                Pan
            </button>
        </div>
     </div>
    </> 
}