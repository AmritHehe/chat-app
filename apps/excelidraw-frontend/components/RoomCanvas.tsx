"use client"

import { WS_URL } from "@/config";
// import { initDraw } from "@/draw";

// import { initDraw } from "@/draw";
// import { Socket } from "dgram";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";


export function RoomCanvas ({roomId} : {roomId :string}){ 
    const [socket , setSocket ] = useState<WebSocket | null > (null); 

// ${WS_URL}
    useEffect(()=> { 
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MDk4YTg5ZS0xZjY5LTQ0NGMtYjhkNi0yYjlhMDc0NGZjYzgiLCJpYXQiOjE3NDcxOTY0OTR9.rdALpNkpV_3PRMVoPXpNuAF1E0NKTuEzIHAHKYl8WeY`)
        ws.onopen = () => { 
            setSocket(ws);
            ws.send(JSON.stringify({
                type : "join_room",
                roomId
            }))
        }


    },[])
    
    if(!socket) { 
        return <div>
            Connecting to server.....
        </div>
    }

    return <div>
        <Canvas roomId = { roomId } socket = {socket} />
       

     
    </div> 
 
}