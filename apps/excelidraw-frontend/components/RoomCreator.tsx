"use client"


//     return <> 
//         <div className="h-screen w-screen flex flex-col items-center justify-center">

//             <input type="text" placeholder="Email" className="p-2 border  m-2 rounded-lg" />
//             <input type="password" placeholder="password " className="p-2 border m-2 rounded-lg" />

//             <button className="border p-2 m-2 rounded-lg" onClick={ () => { }}>{isSignin ?  "SignIn" : "SignUp"} </button>
//         </div>
//     </>
// }
import  { useState }  from "react";
// import { useNavigate } from "react-router-dom";
// import Input from "../components/InputBox";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";

export function RoomCreator (){ 
    const [input , setInput] = useState("")
    const [join , setJoin] = useState("")
    // const navigate = useNavigate();
     const router = useRouter();
    async function post() {
          const token = localStorage.getItem("token");
          console.log("token" + token)  
        try {
            console.log("hitted thhe backend") 
            const response = await axios.post(`${HTTP_BACKEND}/room` , { 
                "name" : input
            } , {
            headers: {
                authorization: token  
            }});
             const roomId = response.data.roomId;
             console.log("response" + response)
             console.log("response : "+ roomId)
            alert("created the room , taking to the canvas..")
             router.push(`/canvas/${roomId}`);
        }
        catch(e:unknown){  
            alert("something went wrong"+ e)}
        }
        
    async function joinRoom() {
        try {
            alert("created the room , taking to the canvas..")
          router.push(`/canvas/${join}`);
         }
         catch(e:unknown){ 
            alert ("roomId doesnt exist " +e)
         }
         
    }       
    

   
        
    
    return <>
        
        <div  className="h-screen w-screen bg-gray-100 flex flex-col items-center justify-center">
           <div className="text-xl mb-4">Enter a Room Name </div> 
            {/* <Input placeholder  ="Username" type = "text" onChange = {setInput} />  */}
            {/* {input} */}
            {/* <Input placeholder="password" type = "password" onChange = {setPassword} /> */}
            <input type="text"value={input} onChange={(e)=> {setInput(e.target.value)}} placeholder="enter your name" className="p-2 border  m-2 rounded-lg" />
           
            <button onClick={post} className="border-1 p-4  m-2 rounded-xl ">CreateRoom</button> 
            <input type="text" value={join} onChange={(e)=> {setJoin(e.target.value)}} placeholder="join Room" className="p-2 border  m-2 rounded-lg" />
            <button onClick={joinRoom} className="border-1 p-4  m-2 rounded-xl ">Join Room</button> 

        </div>
             

    
    </>
}

// export default SignUpPage
