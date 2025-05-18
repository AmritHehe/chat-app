"use client"

import { WS_URL } from "@/config";
// import { initDraw } from "@/draw";

// import { initDraw } from "@/draw";
// import { Socket } from "dgram";
import { useEffect, useState } from "react";
import Canvas from "./Canvas";

import { useRouter } from "next/navigation";


export function RoomCanvas ({roomId} : {roomId :string}){ 
    const router = useRouter();
    const [socket , setSocket ] = useState<WebSocket | null > (null); 

   
// ${WS_URL}

   

    useEffect(()=> { 
        
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/signin"); // Redirect to sign-in page if no token
        }
        const ws = new WebSocket(`${WS_URL}?token=${token}`)
        ws.onopen = () => { 
            setSocket(ws);
            ws.send(JSON.stringify({
                type : "join_room",
                roomId
            }))
        }
        return ()=>{ 
            ws.close();
        }

    },[roomId , router ,])
    
    if(!socket) { 
        return <div>
            Connecting to server.....
        </div>
    }

    return <div>
        <Canvas roomId = { roomId } socket = {socket} />
       

     
    </div> 
 
}