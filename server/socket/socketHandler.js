import admin from 'firebase-admin';
import User from '../models/user.model.js';
import Group from '../models/group.model.js';
import Message from '../models/message.model.js';

export const handleSocketConnections = (io) => {
  // Middleware to authenticate socket connections using a Firebase ID token
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided.'));
    }
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await User.findOne({ uid: decodedToken.uid });
      if (!user) {
          return next(new Error('Authentication error: User not found in database.'));
      }
      // Attach the full user document from our database to the socket instance
      socket.user = user; 
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token.'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (Socket ID: ${socket.id})`);

    // Handler for when a user joins a group's chat room
    socket.on('join_group', async ({ groupId }) => {
      try {
        const group = await Group.findById(groupId);
        // Authorization: Check if the connected user is a member of the group
        if (group && group.members.map(id => id.toString()).includes(socket.user._id.toString())) {
          socket.join(groupId);
          console.log(`${socket.user.name} joined room: ${groupId}`);
        } else {
          socket.emit('error', { message: 'Not authorized to join this group chat.' });
        }
      } catch (error) {
         console.error(`Error joining group for user ${socket.user.name}:`, error);
         socket.emit('error', { message: 'Error joining group.' });
      }
    });

    // Handler for when a user sends a message
    socket.on('send_message', async ({ groupId, content }) => {
      try {
        const group = await Group.findById(groupId);
        // Authorization: Re-check if the user is a member before processing the message
        if (!group || !group.members.map(id => id.toString()).includes(socket.user._id.toString())) {
            return socket.emit('error', { message: 'You are not a member of this group.' });
        }
        
        // 1. Save the new message to the database
        const newMessage = await Message.create({
          senderId: socket.user._id,
          groupId,
          content,
        });

        // 2. Populate the sender's info to send back to the clients
        const populatedMessage = await Message.findById(newMessage._id).populate(
          'senderId',
          'name profilePicture'
        );

        // 3. Broadcast the fully formed message to all clients in the specific group room
        io.to(groupId).emit('receive_message', populatedMessage);
      } catch (error) {
         console.error(`Error sending message for user ${socket.user.name}:`, error);
         socket.emit('error', { message: 'Error sending message.' });
      }
    });

    // Handler for disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name} (Socket ID: ${socket.id})`);
    });
  });
};