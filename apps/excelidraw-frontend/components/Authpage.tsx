
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
import { useRouter } from 'next/navigation'
export function AuthPage ({isSignin} : {isSignin : boolean}){ 
    const router = useRouter();
    const [input , setInput] = useState("")
    const [password , setPassword ] = useState("")
    // const navigate = useNavigate();

    async function post() {
        if(input.length < 3 ){
            alert("username must be greater than 3");
            return 
        }
        if(password.length < 3){ 
            alert("passwords length must be greater than 3"); 
            return
        }
        try { 
            const response = await axios.post(`${HTTP_BACKEND}/signup` , { 
                username: input ,
                password : password , 
                name : "khikhikhi"
            })
            alert("signed up sucessfully , redirecting to signin page..")
            localStorage.setItem("userId" , response.data.userId)
           router.push('/signin');
        }
        catch(e:unknown){ 
            alert("something went wrong"+e)
        }
        
        
    }
    async function postSignIn() {
        if(input.length < 3 ){
            alert("username must be greater than 3");
            return 
        }
        if(password.length < 3){ 
            alert("passwords length must be greater than 3"); 
            return
        }
        try { 
            const response = await axios.post(`${HTTP_BACKEND}/signin` , { 
                username: input ,
                password : password , 
            })
            localStorage.setItem("token" , response.data.token)
            // localStorage.setItem("userId" , response.data.userId)/
            alert("signed in.")
           router.push('/room');
        }
        catch(e:unknown){ 
            
            alert("something went wrong"+ e)
        }
        
        
    }
    return <>
        
        <div  className="h-screen w-screen bg-gray-100 flex flex-col items-center justify-center">
            {isSignin ?<div className="text-xl mb-4">Welcome Sir! Please Sign In </div> : <div className="text-xl mb-4">Hola ! please sign up </div>}
            {/* <Input placeholder  ="Username" type = "text" onChange = {setInput} />  */}
            {/* {input} */}
            {/* <Input placeholder="password" type = "password" onChange = {setPassword} /> */}
            <input type="text"value={input} onChange={(e)=> {setInput(e.target.value)}} placeholder="Email" className="p-2 border  m-2 rounded-lg" />
            <input type="password" value={password} onChange={(e)=> {setPassword(e.target.value)}} placeholder="password " className="p-2 border m-2 rounded-lg" />
            {isSignin ? <button onClick={postSignIn} className="border-1 p-4  m-2 rounded-xl ">Submit</button> : <button onClick={post} className="border-1 p-4  m-2 rounded-xl ">Submit</button>
            }
            {isSignin  ? <div>New User ? Please Sign Up <button className="border-b-1" onClick={()=>    router.push('/signup')}>SignUp</button></div> :<div>Already a user ? Please <button className="border-b-1" onClick={()=>    router.push('/signin')}>Sign In</button></div>
            }
        </div>
             

    
    </>
}

// export default SignUpPage
