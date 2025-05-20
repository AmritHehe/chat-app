import {WebSocket ,  WebSocketServer } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config'
// const wss = new WebSocketServer({ port: 8080 });
import http from 'http';
import express from 'express';
// import { WebSocketServer } from 'ws';

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server }); 
app.get('/', (_, res) => {
  res.send('WebSocket server is live');
});
import {prismaClient} from "@repo/db/client"
const PORT = parseInt(process.env.PORT || "8080");


interface User { 
  ws: WebSocket,
  rooms : string[],
  userId : string
}
const users :User[] = []    
function checkUser(token : string) : string | null {
   try{
    const decoded = jwt.verify(token , JWT_SECRET); 
    
    if (typeof decoded == "string"){ 
      return null; 
    }
    if(!decoded || !decoded.userId){ 
      return null; 
    }  
    return decoded.userId ;
   }

   catch(e){
      return null
   }
}
wss.on('connection', function connection(ws, request) {
  console.log("WS connected:", request.url);
    ws.on("error", (err) => {
    console.error("WS Error:", err);
  });

  const url = request.url; 
  if(!url){ 
    return;
  }
  // const queryParams = new URLSearchParams(url.split("?")[1]);
  // const token = queryParams.get('token') || ""; 
  const fullUrl = new URL(request.url || "", `http://${request.headers.host}`);
  const token = fullUrl.searchParams.get("token") || "";
  const userId = checkUser(token); 
  if(userId==null){ 
    ws.close(1008 , "Invalid Token")
    return ;
  } 
  users.push({ 
    userId, 
    rooms : [], 
    ws
  })
  ws.on('message',async function message(data) {
    let parseData ; 
    

      parseData = JSON.parse(data as unknown as string);


      if (parseData.type === "join_room"){ 
        const user = users.find( x => x.ws === ws);
        user?.rooms.push(parseData.roomId)
      }

      if(parseData.type === "leave_room"){ 
        const user = users.find(x => x.ws  === ws); 
        if(!user){ 
          return; 
        }
        user.rooms = user?.rooms.filter( x=> x === parseData.room);
      }

      if(parseData.type === "chat"){ 
        const roomId = parseData.roomId; 
        const message = parseData.message; 


       const created =  await prismaClient.chat.create({
          data : { 
            roomId : Number(roomId),
            message, 
            userId 
          }
        }); 
        users.forEach(user => {
          if(user.rooms.includes(roomId)){
            user.ws.send(JSON.stringify({
              type : "chat",
              message:message,
              roomId,
              id : created.id,
              
            }))
          }
        })
      }
      if(parseData.type === "update"){ 
        const message = parseData.message ; 
        const roomId = parseData.roomId ; 

        const id = message.DBid
        await prismaClient.chat.update({
          where: { 
            id : message.DBid
          },
          data : { 
            roomId :Number(roomId), 
            message: JSON.stringify({shape : message}) , 
            userId
          }
        })
        users.forEach(user => {
          if(user.rooms.includes(roomId)){
            user.ws.send(JSON.stringify({
              type : "update",
              message:message,
              roomId,
            }))
          }
        })
      }
      if(parseData.type == "delete"){ 
        try {
        const message = parseData.message; 
        const roomId = parseData.roomId ; 

        // const id = message.DBid
        await prismaClient.chat.delete({ 
          where : { 
            id : message.DBid
          }
        })
        users.forEach(user => { 
          if(user.rooms.includes(roomId)){ 
            user.ws.send(JSON.stringify({
              type : "delete", 
              message : message , 
              roomId ,
            }))
          }
        })
      }catch(e){ 
        console.log("bad errror"+ e)
      }
    }
    if(parseData.type == "deleteMany"){ 
      
      try {
      console.log("hello from websocket")
      const message = parseData.message;
      const roomId = parseData.roomId; 
      let result = message.map( (a : any) => a.DBid)
      await prismaClient.chat.deleteMany({
        where : { 
          id : { 
            in : result
          }
        }
      })
      users.forEach(user => { 
        if(user.rooms.includes(roomId)){ 
          user.ws.send(JSON.stringify({
            type : "deleteMany", 
            message : message , 
            roomId ,
          }))
        }
      })
    } catch(e){ 
      console.log("ooffo sabzi error hogis"  + e)
    }
    }
    if(parseData.type == "liveDraw"){ 
      // console.log("hello from websocket livedraw here")
      const message = parseData.message ; 
      const roomId = parseData.roomId ; 
      users.forEach(user => { 
        if(user.rooms.includes(roomId)){
          user.ws.send(JSON.stringify({
            type :  "liveDraw",
            message : message , 
            roomId 
          }))
        }
      })
    }
    if(parseData.type == "clear"){ 
      console.log("???")
      try { 
        const roomId = parseData.roomId; 
        await prismaClient.chat.deleteMany({})
        users.forEach(user => { 
        if(user.rooms.includes(roomId)){ 
          user.ws.send(JSON.stringify({
            type : "clear", 
            roomId ,
          }))
        }
      })
      console.log("Thanos Swap done")

      }catch(e){ 
        console.log("thanos swap failed")
      }
    }



  });

  
}); 

server.listen(PORT,'0.0.0.0', () => {
  console.log(`WebSocket server listening on port ${PORT}`);
});