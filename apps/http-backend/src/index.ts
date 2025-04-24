import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from '@repo/backend-common/config'
import { middleware } from "./middleware"
import {CreateUserSchema , SigninSchema , CreateRoomSchema} from "@repo/common/types"
import { prismaClient } from "@repo/db/client"
const app = express()
const prisma = prismaClient;
app.listen(3004)
//jwt 
app.use(express.json())

app.post("/signup" , async (req , res )=> { 
  

    const parseData = CreateUserSchema.safeParse(req.body); 
    if(!parseData.success){ 
        res.json({ 
            message : "Incorrect inputes"
        })
        return;
    }
    
    try { 
        await  prisma.user.create({
            data : { 
                email : parseData.data?.username ,
                password : parseData.data?.password ,
                name : parseData.data.name,
            }
        }) 
        res.json("user created successfully")
    } 
    catch(e){ 
        res.status(411).json({ 
            message : ("user already exits or " + e )   
        })
    }
   
    
    
})
app.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    // TODO: Compare the hashed pws here
    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    })

    if (!user) {
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    }

    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET);

    res.json({
        token
    })
})

// app.post("/signin" , (req , res) => { 
//     const data = SigninSchema.safeParse(req.body); 
//     if(!data.success){ 
//         res.json({ 
//             message : "Incorrect inputes"
//         })
//         return;
//     }
//     const username = req.body.username ; 
//     const password = req.body.password ; 

    //check if there is users in user array or not otherwise return 
    //if user found , return them a jwt , 
    //else return them error or imvalid credentials 
    // const token = jwt.sign({
    //     // userId
    // },JWT_SECRET); 

    // res.json({ 
    //     token
    // })
// })
app.post ("/room",middleware ,(req , res)=> { 
    const data = CreateRoomSchema.safeParse(req.body); 
    if(!data.success){ 
        res.json({ 
            message : "Incorrect inputes"
        })
        return;
    }
    //dbcall
    res.json({ 
        roomId : 123 
    })
})