const path=require('path')
const http=require('http')
const express=require('express')
const socketio=require('socket.io')
const formatMessage=require('./utils/msg.js')
const users=require('./utils/users.js')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const name="Admin"

app.use(express.static(path.join(__dirname,'/public')))

io.on('connection',(socket)=>{
    socket.on('joinRoom',({username,room})=>{
        const user=users.user_join(socket.id,username,room)
        socket.join(user.room)

        socket.emit('message',formatMessage(name,'Welcome to WebChat'))
        socket.broadcast.to(user.room).emit('message',formatMessage(name,`${user.username} has joined the chat`))

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: users.get_room_users(user.room)
        })
    })

    socket.on('chatmsg',(msg)=>{
        const user=users.get_user(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })

    socket.on('disconnect',()=>{
        const user=users.user_leave(socket.id)
        if(user){
            io.to(user.room).emit('message',formatMessage(name,`${user.username} has left the chat`))
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: users.get_room_users(user.room)
            })
        }
    })
})

const PORT=process.env.PORT || 3000

server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})