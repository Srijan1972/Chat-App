const users=[];

function user_join(id,username,room){
    const user={id,username,room}
    users.push(user)
    return user
}

function get_user(id){
    return users.find(user => user.id===id)
}

function user_leave(id){
    const index=users.findIndex(user => user.id===id)
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

function get_room_users(room){
    return users.filter(user => user.room===room)
}

module.exports={
    user_join,
    get_user,
    user_leave,
    get_room_users
}