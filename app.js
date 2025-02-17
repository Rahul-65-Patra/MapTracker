const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const server = http.createServer(app)
const io = socketio(server);
const dotenv = require('dotenv');
dotenv.config();


app.set('view engine','ejs');
const staticFile = path.join(__dirname,'./public')
app.use(express.static(staticFile));

io.on('connection',(socket)=>{
   socket.on("send-location",(data)=>{
     io.emit("receive-location",{id:socket.id,...data});
   })
   socket.on("disconnect",()=>{
    io.emit("user-disconnected",socket.id);
   })
})   
app.get('/',(req,res)=>{
  res.render("index",{})
})

const PORT = process.env.PORT || 4000;  

server.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
})       