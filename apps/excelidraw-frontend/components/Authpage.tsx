"use client"
export function AuthPage ({isSignin} : {isSignin : boolean}){ 

    return <> 
        <div className="h-screen w-screen flex flex-col items-center justify-center">

            <input type="text" placeholder="Email" className="p-2 border  m-2 rounded-lg" />
            <input type="password" placeholder="password " className="p-2 border m-2 rounded-lg" />

            <button className="border p-2 m-2 rounded-lg" onClick={ () => { }}>{isSignin ?  "SignIn" : "SignUp"} </button>
        </div>
    </>
}