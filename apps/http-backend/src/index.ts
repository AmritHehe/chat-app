import dotenv from 'dotenv';
dotenv.config({ path: '/etc/secrets/.env' }); // <== this is critical!

import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from '@repo/backend-common/config'
import { middleware } from "./middleware"
import {CreateUserSchema , SigninSchema , CreateRoomSchema} from "@repo/common/types"
import { prismaClient } from "@repo/db/client"
import cors from "cors"
const app = express()
const prisma = prismaClient;
// app.listen(3004)
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//jwt 
app.use(express.json())
app.use(cors())

app.post("/signup" , async (req , res )=> { 
  

    const parseData = CreateUserSchema.safeParse(req.body); 
    if(!parseData.success){ 
        res.json({ 
            message : "Incorrect inputes"
        })
        return;
    }
    
    try { 
        const user =  await  prisma.user.create({
            data : { 
                email : parseData.data?.username ,
                password : parseData.data?.password ,
                name : parseData.data.name,
            }
        }) 
        res.json({ userId : user.id}
        )
    } 
    catch(e){ 
        res.status(411).json({ 
            message : ("user already exits or " + e )   
        })
    }
   
    
    
})


app.post("/signin" , async  (req , res) => { 
    const  parseData = SigninSchema.safeParse(req.body); 
    if(!parseData.success){  
        res.json({ 
            message : "Incorrect inputes"
        })
        return;
    }
    const user = await prismaClient.user.findFirst ({ 
        where : { 
            email : parseData.data.username , 
            password : parseData.data.password
        }   
    })

    if(!user) { 
        res.status(403).json(
            { 
                message : "not authorised"
            }
        )
        return;
    }
    // check if there is users in user array or not otherwise return 
    // if user found , return them a jwt , 
    // else return them error or imvalid credentials 
    const token = jwt.sign({
        userId : user?.id
    },JWT_SECRET); 

    res.json({ 
        token
    })
})
app.post ("/room",middleware , async (req , res)=> { 
    const  parseData = CreateRoomSchema.safeParse(req.body); 
    if(!parseData.success){ 
        res.json({ 
            message : "Incorrect inputes"
        })
        return;
    }
    //@ts-ignore
    const userId = req.userId; 
    try { 
        const room = await prismaClient.room.create( { 
            data : { 
                slug : parseData.data.name , 
                adminId : userId
            }
     })
      
    //dbcall
        res.json({ 
            roomId : room.id
        })
    } 
    catch (e) { 
        res.status(411).json({ 
            message : "Room already exists with this name "
        })
    }
})

app.get("/chats/:roomId" , async (req , res) => { 
    try { 
        const roomId = Number(req.params.roomId); 
        const messages = await prismaClient.chat.findMany({
            where : { 
                roomId : roomId
            },
            orderBy: { 
                id : "desc"
            },
            take: 1000
        }); 
        res.json({
            messages
        })
    }
    catch(e) { 
         res.json({
            messages : {}
         })
    }
})
app.get("/room/:slug" , async (req , res) => { 
    const slug = req.params.slug; 
    const room = await prismaClient.room.findFirst({
        where : { 
            slug
        },
    }); 
    res.json({
        room
    })
})