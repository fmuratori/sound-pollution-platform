import { Server } from "socket.io";

const active_watchers = {}

const setupSocket = (httpServer, metersCollection) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);

      stop_watching(socket);
    });

    socket.on('start_watch', (device_name) => {
      console.log(`Initializing watcher for socket ${socket.id} of meter ${device_name}`);

      start_watching(socket, device_name, metersCollection)
    });

    socket.on('stop_watch', () => {
      console.log(`Stopping watcher for socket ${socket.id}`);

      stop_watching(socket);
    });

    socket.on('get_devices', () => {
      metersCollection
      .find({})
      .project({_id:0, device_name: 1, gps_lat: 1, gps_lng: 1, active_since:1, last_update: 1})
      .toArray()
      .then(data => {
        console.log(`Get  devices from socket ${socket.id}`);
        socket.emit('devices', JSON.stringify(data))
      });
    });
  });

  console.log("Socket.IO is ready")
};

function start_watching(socket, device_name, metersCollection) {
  var watcher = active_watchers[device_name];
  if (watcher === undefined) {
    // create a new watcher
    console.log(`Device ${device_name} is not beeing watched currently. Creating a new watcher`)
    watcher_behaviour(device_name, metersCollection)
    active_watchers[device_name] = {
      "device_name": device_name,
      "sockets": [socket], 
      "interval": setInterval(() => watcher_behaviour(device_name, metersCollection), 1000 * 10)
    };
  } else {
    // check for duplicated sockets in watcher
    var duplicates = watcher.sockets.filter(socket).length > 0;
    if (duplicates !== undefined) {
      console.log(`Socket ${socket.id} is already watching the device ${duplicates.device_name}`)
    } else {
      // watcher already exists, add new socket
      console.log(`Device ${device_name} is already beeing watched. Adding new socket to watchers list`)
      active_watchers[device_name]["sockets"].push(socket);
    }
  }
}

function stop_watching(socket) {
  // find a watcher containing the socket
  console.log(active_watchers)
  for (const [device_name, watcher] of Object.entries(active_watchers)) {
    var hasSocket = watcher.sockets.filter(elem => elem === socket).length > 0;
    if (hasSocket) {
      console.log(`Socket ${socket.id} was watching the device ${device_name}. Removing the socket from the watcher`)
      watcher.sockets.splice(watcher.sockets.indexOf(socket), 1)

      // device has no more active watchers
      if (watcher.sockets.length == 0) {
        console.log(`Device ${device_name} has no remaining watchers. Stopping watcher activity`)
        clearInterval(watcher.interval);
        delete active_watchers[device_name];
      }
      return;
    } 
  }

  // no watcher found for the socket
  console.log(`Socket ${socket.id} was not watching any device`)
}


function watcher_behaviour(device_name, metersCollection) {
  // query meters_collection last N measures
  metersCollection
    .findOne({
      "device_name": device_name,
    }, {
      projection: {
      _id:0, 
      device_name: 1, 
      gps_lat: 1, 
      gps_lng: 1, 
      active_since:1, 
      last_update: 1, 
      data: {
        $filter: {
          input: "$data",
          as: "element",
          cond: { 
            $gte: [ "$$element.datetime", new Date(new Date().getTime() - (60 * 60 * 1000))] 
          }
        }
      }
      }
  }).then(data => {
    active_watchers[device_name].sockets.forEach(socket => {
      socket.emit('device_data', JSON.stringify(data))
    });
  }).catch(error => console.log(error));
}

export default setupSocket;

