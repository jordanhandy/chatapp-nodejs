const users = [];

//addUser

//getUser

//getUsersInRoom

//removeUser

const addUser = ({id, username, room}) =>{
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate data
    if(!username || !room){
        return {
            error: "Both username and room are required!"
        }
    }
    // Check for existing user
    const existingUser = users.find((user)=>{
        return user.room == room && user.username === username
    })
    // Validate username
    if(existingUser){
        return {
            error:"Username is already in use"
        }
    }
    // Store user
    const user = {id, username, room}
    users.push(user)
    return {user}

}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })
    if(index != -1){
        return users.splice(index,1)[0]
    }
}

addUser({
    id:22,
    username:"Jordan",
    room:"Ajax"
})
console.log(users)
const res = addUser({
    id:33,
    username: '',
    room: ''
})
console.log(res)