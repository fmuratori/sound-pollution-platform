import { Server } from "socket.io";

const setupSocket = httpServer => {
  const io = new Server(httpServer, {
    // ...
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export default setupSocket;

