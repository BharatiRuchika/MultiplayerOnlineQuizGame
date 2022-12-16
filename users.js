const users = [];
const host = [];
 const addHost = (id,room)=>{
  console.log("host called");
  console.log("data",id,room);
  const hostArray = {id,room};
  host.push(hostArray);
  return {hostArray};
 }
const addUser = ({id, name, room}) => {
  console.log("add user called");
  console.log("data",id,name,room);
    name = name.trim().toLowerCase();
    const existingUser = users.find((user) => {
        user.room === room && user.name === name
    });
 
    if(existingUser) {
        return{error: "Username is taken"};
    }
    const user = {id,name,room};
 
    users.push(user);
    return {user};
 
}
 const removeHost = (id)=>{
  const index = host.findIndex((h) => {
    console.log("h",h);
      return h.id === id
    });
    console.log("index",index);
    if(index !== -1) {
      return host.splice(index,1)[0];
  }
 }
 const getHost = ()=>{
   return host;
 }
const removeUser = (id) => {
  console.log("users",users);
    const index = users.findIndex((user) => {
      console.log("id",user.id);
        return user.id === id
      });
 console.log("index",index);
      if(index !== -1) {
          return users.splice(index,1)[0];
      }

  }
   
  const getUser = (id) => users
          .find((user) => user.id === id);
   
  const getUsersInRoom = (room) => users
          .filter((user) => user.room === room);
   
  module.exports = {addUser, removeUser,
          getUser, getUsersInRoom,addHost,removeHost,getHost};