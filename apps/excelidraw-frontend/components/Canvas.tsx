// import { initDraw } from "@/draw";
// import { initDraw } from "@/draw";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState , useCallback } from "react"
import {Circle} from "@repo/ui/circle"
import {Rect} from "@repo/ui/rect"
import {Pencil} from "@repo/ui/pencil" 
import { Hand } from "@repo/ui/hand";
// import { Drag } from "@repo/ui/drag";
import { Select } from "@repo/ui/select";
import {Eraser} from "@repo/ui/eraser"
import {Arrow} from "@repo/ui/arrow"
import {Line} from "@repo/ui/line"
// import {Diamond} from "@repo/ui/dimond"
import {Text} from "@repo/ui/Text"
import {Share} from "@repo/ui/share"
import {Transparent} from "@repo/ui/transparent"
import {Heart} from "@repo/ui/heart"
import {Gamja_Flower} from "next/font/google"
// import { EraserCursor } from "@repo/ui/eraserC";
// import { url } from "inspector";
// import {Kirang_Haerang} from "next/font/google" 
// import {Darrow} from "@repo/ui/Darrow"
const gamja = Gamja_Flower({
        weight: '400',
        subsets: ['latin'],
    })
    // const kirang = Kirang_Haerang({
    //     weight: '400',
    //     subsets: ['latin'],
    // })

export default function Canvas ({roomId , socket} : { 
    roomId : string , 
    socket : WebSocket
} ){ 
    type Shapee = "pencil " | "rect" | "circle" | "square" | "line" | "arrow" | "drag" | "pan" | "erase" |"clear"| string
     
    const canvasRef = useRef<HTMLCanvasElement>(null); 
    const [currShape , setShape] = useState<Shapee>("");
    // const [theme , setTheme] = useState("dark");
    const shapeRef = useRef<Shapee> ("")
    const strokeRef = useRef(1)
    const [menu , setMenu] = useState(false)
    const [introScreen , setIntroScreen] = useState(true)
    const [strokeW , setStrokeW] = useState(1)
    const [strokeC , setStrokeC] = useState("#FFFFFFF")
    const strokeColorRef = useRef(strokeC)
    const [bodyColor , setBodyColor] = useState("rgba(255, 0, 0, 0)")
    const bodyColorRef = useRef(bodyColor)
    const [showText , setShowText ] = useState(false)
    const [text , setText] = useState("")
    const textRef  = useRef<HTMLTextAreaElement>(null)
    const [zoom , setZoom] = useState<number>(1)
    useEffect(() => {
        const textt = textRef.current;
        if(textRef.current != null){
            // let adjustedHeight = text.clientHeight; 
            // adjustedHeight = Math.max(text.scrollHeight , adjustedHeight)
            // if(adjustedHeight > text.clientHeight){
            //     text.style.height = adjustedHeight+"px"
            // }
            const maxheight = window.innerHeight/2; 
            // console.log("window height " + maxheight)
            // console.log("textbox heifht" + textt.offsetHeight)
            if((textt.offsetHeight)<maxheight){
                textt.style.height = textt.scrollHeight+"px"; 
                // text.style.overflowY = "hidden";
                if(textt.offsetHeight < maxheight){
                textt.addEventListener("input" , function(){ 
                    this.style.height = "auto"; 
                    this.style.height = this.scrollHeight + "px";
                })
            }
            }
        }
    },[ text])
    useEffect(()=> { 
        bodyColorRef.current = bodyColor
    } , [bodyColor])
    useEffect(()=> { 
        strokeColorRef.current = strokeC; 
    }, [strokeC])
    useEffect(()=>{
        strokeRef.current = strokeW;
        console.log(strokeW)
    },[strokeW])
    useEffect(()=>{
        shapeRef.current = currShape;
    },[currShape])
    useEffect(()=> { }, [window.onscroll])
    useEffect(()=> {
        if(canvasRef.current){  
            
            initDraw(canvasRef.current ,roomId , socket ,shapeRef ,strokeRef , strokeColorRef , bodyColorRef , textRef , zoom , gatedSetKeywords , setText)
        }
    } , [canvasRef])
    useEffect(()=> {gatedSetKeywords(1)},[])
    const gatedSetKeywords = useCallback((value) => {
        if (typeof value !== 'number') {
            console.error('wow, you wrote another bug!');
            return;
        }
        const percentValue = value*100;
        const hehe = parseFloat(percentValue.toFixed(5))
        console.log(hehe)
        setZoom(hehe);
        }, []);
   
   useEffect(()=>{
    const hehe =  JSON.parse(localStorage.getItem("IntroScreen"))
    console.log("hehehehe"  +JSON.stringify(hehe))
    if(!hehe){
        setIntroScreen(false)
    }
   },[])
    return <>
    <div className="flex items-center justify-center">
        <div className="static w-screen h-screen" onClick={()=>{setIntroScreen(false) ; localStorage.setItem("IntroScreen" , "true") }}>
        <canvas id="canvas" className={currShape == "pan" ? `cursor-grab active:cursor-grabbing` : currShape =="drag" ? `cursor-move` : `cursor-default`  }  ref={canvasRef} > </canvas> 
        </div>
        {(currShape == "rect" || currShape == "circle" || currShape == "diamond" || currShape == "pencil" || currShape == "line" || currShape == "arrow"|| currShape == "heart")? <div className="absolute left-0 top-20 m-5 min-w-1/7 bg-zinc-900 rounded-md text-white p-2 max-w-1/7">

        <div className="ml-3 m-1.5 text-sm">
            Stroke
        </div>
        <div className="flex justify-center">
            <button onClick={()=>{setStrokeC("#FFFFFF")}} className="bg-white rounded-lg w-8 h-8 p-1 m-1"> </button>
            <button onClick={()=>{setStrokeC("#F98080")}} className="bg-red-400 rounded-lg p-1 w-8 h-8 m-1 text-rose-400">  </button>
            <button onClick={()=>{setStrokeC("#0E9F6E")}} className="bg-green-500 rounded-lg p-1 m-1 w-8 h-8 text-green-500">  </button>
            <button onClick={()=>{setStrokeC("#A4CAFE")}} className="bg-blue-300 rounded-lg p-1 m-1 w-8 h-8 text-sky-400"> </button>
            <p className="p-2 inline-block text-zinc-600"> | </p>

            <div className="w-12 h-10 rounded-lg"><input id="colorInput" value={strokeC} className="w-full overflow-hidden h-full rounded-lg"  type="color" onChange={(e)=>{setStrokeC(e.target.value)}} /></div>
        </div>
        <div className="ml-3 mt-4 m-1.5 text-sm">
            Background
        </div>
        <div className="flex  justify-center">
            <button onClick={()=>{setBodyColor("rgba(255, 0, 0, 0)")}} className=" rounded-lg w-8 h-8 p-1 m-1"> <Transparent/> </button>
            <button onClick={()=>{setBodyColor("#FBD5D5")}} className="bg-red-200 rounded-lg p-1 w-8 h-8 m-1 text-rose-400">  </button>
            <button onClick={()=>{setBodyColor("#84E1BC")}} className="bg-green-300 rounded-lg p-1 m-1 w-8 h-8 text-green-500">  </button>
            <button onClick={()=>{setBodyColor("#C3DDFD")}} className="bg-blue-200 rounded-lg p-1 m-1 w-8 h-8 text-sky-400"> </button>
            <p className="p-2 inline-block text-zinc-600"> | </p>

            <div className="w-12 h-10 rounded-lg"><input id="colorInput" value = {bodyColor} onChange={(e)=> {setBodyColor(e.target.value) }} className="w-full overflow-hidden h-full rounded-lg"  type="color" /></div>
        </div>
        <div className="ml-3 mt-4 m-1.5 text-sm">
            Stroke width
        </div>
        <div className="flex ml-2 justify-start">
            <div>
            <button onClick={() => {setStrokeW(1)}} className={strokeW == 1 ?`bg-blue-500 rounded-lg p-1 w-8 h-8 m-1` :`bg-neutral-700 rounded-lg p-1 w-8 h-8 m-1`}>1  </button>
            <button onClick={() => {setStrokeW(2)}} className={strokeW == 2 ?`bg-blue-500 rounded-lg p-1 w-8 h-8 m-1` :`bg-neutral-700 rounded-lg p-1 w-8 h-8 m-1`}>2  </button>
            <button onClick={() => {setStrokeW(3)}} className={strokeW == 3 ?`bg-blue-500 rounded-lg p-1 w-8 h-8 m-1` :`bg-neutral-700 rounded-lg p-1 w-8 h-8 m-1`}> 3</button>
           
            </div>
        </div>
        <div className="ml-3 mt-4 m-1.5 text-sm">
            Edges
        </div>
        <div className="flex  justify-center">
            <button className="bg-white rounded-lg w-8 h-8 p-1 m-1"> </button>
            <button className="bg-rose-400 rounded-lg p-1 w-8 h-8 m-1 text-rose-400">  </button>
            <button className="bg-green-500 rounded-lg p-1 m-1 w-8 h-8 text-green-500">  </button>
            <button className="bg-sky-400 rounded-lg p-1 m-1 w-8 h-8 text-sky-400"> </button>
            <p className="p-2 inline-block text-zinc-600"> | </p>

            <div className="w-12 h-10 rounded-lg"><input id="colorInput" className="w-full overflow-hidden h-full rounded-lg"  type="color" /></div>
        </div>
        
        
        </div>
        : <></>}
        {menu ? <div className="absolute left-0 top-15 m-5 min-w-1/6 bg-zinc-900 rounded-md text-white p-2 max-w-1/6">
        
        <div  className="  m-1 relative  h-15 w-58">
           
            <img onClick={()=>{setShape("clear");console.log("seth the shape to clear from photo" + console.log(currShape))}} className="object-fit rounded-xl w-full h-25" src="https://www.themarysue.com/wp-content/uploads/2023/05/thanos-snap.jpeg?fit=1350%2C870" alt="" />
             <p onClick={()=>{setShape("clear") ; console.log("seth the shape to clear")}} className="absolute   text-white top-18 text-sm left-2 text-shadow-gray-900 z-30">Clear canvas</p>
        </div>
        <div className="flex items-end p-2 m-1 h-10 text-sm">
            Export Drawing
        </div>
        <div className="flex items-end p-2 m-1 h-10 text-sm">
            Import Drawing
        </div>
        <div className="flex items-end p-2 m-1 h-10 text-sm">
            Live Collaboration
        </div>
        <div className="flex items-end p-2 m-1 h-10 text-sm">
            Log In
        </div>
        <div className="flex items-end p-2 m-1 h-10 text-sm">
            GitHub
        </div>
        <div className="flex items-end p-2 m-1 h-10 text-sm">
            Twitter
        </div>
        <div className="flex items-end p-2 m-1 h-10 text-sm">
            Linkedin
        </div>
        <div className="flex items-end p-2 m-1 h-10 text-sm">
            Theme
        </div>
        <div className="p-2 m-1 h-15 flex items-end text-sm">
            Canvas Background
        </div>
        </div>
        : <></> }
        <div onClick={()=>{}} className="absolute top-0 m-4 right-0 bg-purple-400 px-4 py-3  rounded-lg">Share <Share/></div>
        <div onClick={()=>{setMenu(!menu)}} className="absolute top-0 m-4 left-0 bg-zinc-800 px-4 py-3 text-white rounded-lg">Menu</div>
        <div className="absolute bottom-0 m-4 right-0 bg-purple-300 px-4 py-3 rounded-lg">current Zoom 
            <p  id="zoom">{zoom+'%'}</p>
        </div>

       {showText ? <textarea ref={textRef} className ="text-3xl h-10 font-serif resize-none text-wrap absolute text-white border-0 focus:outline-none top-999 botto-999 overflow-hidden" value={text} onChange={(e)=>{setText(e.target.value)}}   name="" id=""></textarea>  : <></> }
        { introScreen ?  <div className="static h-100vh w-100vh bg-blue-200">
            <div onClick={()=>{}} className="absolute left-180 items-center justify-center scale-400 px-4 py-3 text-blue-300 rounded-lg ">
            <p className={gamja.className}>Excelidraw</p>
        </div>
        <div onClick={()=>{}} className="absolute top-110 left-170 scale-150 px-4 py-3 text-blue-100 rounded-lg ">
            <p className={gamja.className}>Handwritten Draw & feel</p>
            <p className={gamja.className}>Collab with your friends</p>
        </div>
        <div onClick={()=>{}} className="absolute flex top-26 left-170 scale-150  px-4 py-3 text-neutral-300 rounded-lg ">
            <p className={gamja.className}>Pick a tool &
                <br/> start doodling !</p>
                    
        </div>
        
        <div className="absolute top-20 left-200">
            <img className="w-20 h-20 scale-90 rotate-300  invert " src="https://www.svgrepo.com/show/408495/arrow-02.svg" alt="" />
        </div>

        <div onClick={()=>{}} className="absolute flex top-18 left-32 scale-150  px-4 py-3 text-neutral-300 rounded-lg ">
            <p className={gamja.className}>Github , Clear Canvas , theme
                <br/> export Drawing & more !</p>
                    
        </div> 
         <div className="absolute top-15 left-6">
            <img className="w-20 h-20 scale-90 rotate-200 rotate-x-180 invert " src="https://www.svgrepo.com/show/408495/arrow-02.svg" alt="" />
        </div>
        </div>: <></>}
        
        
        {/* <div className={theme == "light" ? `absolute top-0 px-4 m-4 rounded-lg bg-white` : `absolute top-0 px-4 m-4 rounded-lg bg-white invert` }> */}
           <div className="absolute top-0 px-4 m-4 rounded-lg bg-white invert">
            
           
           {/* <button onClick={()=> {setShape("drag"); setMenu(false)}} className={ currShape == "drag" ? `bg-yellow-700 p-2.5 m-1 rounded-lg`:`bg-white p-2.5 m-1 rounded-lg`}> */}
                {/* Drag */}
                {/* <Drag/> */}
            {/* </button>  */}
            <button onClick={()=> {setShape("pan") ; setMenu(false)}}  className={ currShape == "pan" ? `bg-yellow-700 p-2.5 m-1 rounded-lg`:`bg-white p-2.5 m-1 rounded-lg`}>
                {/* Pan */}
                <Hand/>
            </button>
            {/* <button onClick={()=> {setShape("erase")}} className="bg-white p-4 m-2 rounded-lg">
                Erase
            </button> */}
            
            <button onClick={()=> {setShape("select"); setMenu(false); setShowText(false)}} className={ currShape == "select" ? `bg-yellow-700 p-2.5 m-1 rounded-lg`:`bg-white p-2.5 m-1 rounded-lg`}>
                {/* Select */}
                <Select/>
            </button>
             <button onClick={()=> {setShape("rect"); setMenu(false); setShowText(false)}} className={ currShape == "rect" ? `bg-yellow-700 p-2.5 m-1 rounded-lg`:`bg-white p-2.5 m-1 rounded-lg`}>
                {/* Rect */}
                <Rect/>
            </button>
            <button onClick={()=> {setShape("heart"); setMenu(false); setShowText(false)}} className={ currShape == "heart" ? `bg-yellow-700 p-2.5 m-1 rounded-lg`:`bg-white p-2.5 m-1 rounded-lg`}>
                {/* EraseDrag
                 */}
                 <Heart/>
            </button>
            {/* <button onClick={()=> {setShape("diamond"); setMenu(false); setShowText(false)}} className={ currShape == "diamond" ? `bg-yellow-700 p-2.5 m-1 rounded-lg`:`bg-white p-2.5 m-1 rounded-lg`}>
                {/* Select */}
                {/* <Diamond/> */}
            {/* </button> */} 
             <button onClick={()=> {setShape("circle"); setMenu(false); setShowText(false)}} className={ currShape == "circle" ? `bg-yellow-700 p-2.5 m-1 rounded-lg`:`bg-white p-2.5 m-1 rounded-lg`}>
                <Circle/>
            </button>
            <button onClick={()=> {setShape("arrow"); setMenu(false); setShowText(false)}} className={ currShape == "arrow" ? `bg-yellow-700 p-2.5 m-1 rounded-lg`:`bg-white p-2.5 m-1 rounded-lg`}>
                {/* Arrow */}
                <Arrow/>
            </button>
             <button onClick={()=> {setShape("line"); setMenu(false); setShowText(false)}} className={ currShape == "line" ? `bg-yellow-700 p-2.5 m-1 rounded-lg`:`bg-white p-2.5 m-1 rounded-lg`}>
                <Line/>
            </button>
            <button onClick={()=> {setShape("pencil"); setMenu(false); setShowText(false)}} className={ currShape == "pencil" ? `bg-yellow-700 p-2.5 m-1 rounded-lg`:`bg-white p-2.5 m-1 rounded-lg`}>
                {/* Pencil */}
                <Pencil/>
            </button>
            <button onClick={()=> {setShape("text"); setMenu(false) ; setShowText(true)}} className={ currShape == "text" ? `bg-yellow-700 p-2.5 m-1 rounded-lg`:`bg-white p-2.5 m-1 rounded-lg`}>
                {/* Select */}
                {/* <Diamond/> */}
                <Text/>
            </button>
            <button onClick={()=> {setShape("eraseDrag"); setMenu(false); setShowText(false)}} className={ currShape == "eraseDrag" ? `bg-yellow-700 p-2.5 m-1 rounded-lg`:`bg-white p-2.5 m-1 rounded-lg`}>
                {/* EraseDrag
                 */}
                 <Eraser/>
            </button>
            
            
            
        </div>
     </div>
    </> 
}