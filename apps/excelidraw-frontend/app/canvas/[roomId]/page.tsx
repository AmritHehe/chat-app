
import { RoomCanvas } from "@/components/RoomCanvas";


export default async function CanvasPage({params }:  { 
    params: { 
        roomId: string 
    }
}){
    const roomId =(await params).roomId; 
    
    console.log("room  Id : ")
    console.log(roomId)
    return <RoomCanvas roomId = {roomId} /> 
}