const chatForm=document.getElementById('chat-form')
const chatMsgs=document.querySelector('.chat-messages')
const roomName=document.getElementById('room-name')
const userList=document.getElementById('users')
const socket=io()

const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

socket.emit('joinRoom',{username,room})

socket.on('roomUsers',({room,users})=>{
    output_room(room)
    output_users(users)
})

socket.on('message',(message)=>{
    outputMessage(message)
    chatMsgs.scrollTop=chatMsgs.scrollHeight
})

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const msg=e.target.elements.msg.value
    socket.emit('chatmsg',msg)
    e.target.elements.msg.value='';
    e.target.elements.msg.focus()
})

function outputMessage(message){
    const div=document.createElement('div')
    div.classList.add('message')
    div.classList.add('bg-dark')
    div.innerHTML=`<p class="text-light">${message.username} <span class="text-secondary">${message.time}</span></p>
    <p class="text-light">${message.text}</p>`
    document.querySelector('.chat-messages').appendChild(div)
}

function output_room(room){
    roomName.innerText=room
}

function output_users(users){
    userList.innerHTML=`
    ${users.map(user=> `<li>${user.username}</li>`).join('')}`
}