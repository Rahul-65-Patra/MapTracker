const socket = io();  // initialize socket.io connection request send to backend

if(navigator.geolocation){
  navigator.geolocation.watchPosition((position)=>{
   const {latitude,longitude}= position.coords;
   socket.emit("send-location",{latitude,longitude});
  },(error)=>{
    console.error(error);
  },
{
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 5000,
  //frequency: 10000,  // 10 seconds
})
}

const map = L.map("map").setView([0,0],16)  // 10 level zoom doing

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
   attribution: "Rahul Patra"
}).addTo(map);


const markers = {};


socket.on("receive-location",(data)=>{
  const {id,latitude,longitude} = data;
  map.setView([latitude,longitude],16);

  if(markers[id]){
    markers[id].setLatLng([latitude,longitude]);
  }
  else{
    markers[id] = L.marker([latitude,longitude],20).addTo(map);
  }
})  


socket.on("user-disconnected",(id)=>{
  if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id];
  }
})