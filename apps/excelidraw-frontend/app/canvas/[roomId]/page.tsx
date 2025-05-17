
import { RoomCanvas } from "@/components/RoomCanvas";


export default async function CanvasPage(props : 
    {
        params : Promise<{roomId:string}>}){
    
    const params = await props.params
    const roomId = await params.roomId 
    
    console.log("room  Id : ")
    console.log(roomId)
    return <RoomCanvas roomId = {roomId} /> 
}