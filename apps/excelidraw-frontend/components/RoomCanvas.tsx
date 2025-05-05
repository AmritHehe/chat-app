"use client"

import { WS_URL } from "@/config";
import { initDraw } from "@/draw";
import { Socket } from "dgram";
import { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";

export function RoomCanvas ({roomId} : {roomId :string}){ 
    const [socket , setSocket ] = useState<WebSocket | null > (null); 


    useEffect(()=> { 
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MDk4YTg5ZS0xZjY5LTQ0NGMtYjhkNi0yYjlhMDc0NGZjYzgiLCJpYXQiOjE3NDYwOTYwNTJ9.riTEeLgKCgxq-cgW1j8WGkyUoDw4fD8uhJYULhz1UfM`)
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