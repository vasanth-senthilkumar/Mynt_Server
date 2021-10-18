const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const productRoutes = require('./Routes/productRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const userRoutes = require('./Routes/userRoutes');
const addressRoutes = require('./Routes/addressRoutes');
const cartRoutes = require('./Routes/cartRoutes');
const wishlistRoutes = require('./Routes/wishlistRoutes');
const coupanRoutes = require('./Routes/coupanRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const likeDislikeRoutes = require('./Routes/LikeDislikeRoutes');
const commentRoutes = require('./Routes/CommentRoutes');
const homeSliderRoutes = require('./Routes/HomeSliderRoutes');
const mongoose  = require('mongoose');
const config = require('./config/keys');
const Chat = require('./Models/ChatModel');
const path  = require('path');
const cloudinaryCon = require('./Routes/cloudinaryConfig');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: "*",
    }}
    );



/******************************************MiddleWares  ********************************************/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(__dirname+ '/uploads'));
app.use('/api/users', userRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/products', productRoutes);
app.use('/api/home', homeSliderRoutes);
app.use('/api/products/like-dislike', likeDislikeRoutes);
app.use('/api/products/comments', commentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupan', coupanRoutes);
app.use('/api/users/chats', chatRoutes);

/******************************************MongoDb Connection********************************************/

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDb Connected')).catch(err => console.log(err));

// if(process.env.NODE_ENV === 'production') {
//     app.use(express.static('./frontend/build'));

//     app.get('/*', (req, res) => {
//         res.sendFile(path.join(__dirname , 'frontend', 'build', 'index.html'));

//     });
// }

// const sessionsMap = {};
// io.on('connection', socket => {  
//     console.log('New Connection');
//     socket.on("join", ({userId, username}) => {
//         sessionsMap[userId] = socket.id;
//         console.log(sessionsMap);
//         socket.on("Get Online Status", (online) => {
//             const receiverId = sessionsMap[online.receiver];
//             if(receiverId) {
//                 socket.emit('Outputting Online Status', `Online`);
//             } else {
//                 socket.emit("Outputting Online Status", "");
//             }
//         });


//         socket.on("The user is typing....", (typing) => {
//             const receiverId = sessionsMap[typing.receiver];
//             socket.broadcast.to(receiverId).emit('outputting typing', `Typing...`);
//         });

//         socket.on("Delete Chat", (deleteChat) => {
//             // Chat.findOneAndRemove({_id: deleteChat.chatId, sender: deleteChat.userId}).exec((error, data) => {
//             Chat.findOneAndDelete({"$or": [{_id: deleteChat.chatId, "sender": deleteChat.userId, "receiver": deleteChat.receiverId}, {_id: deleteChat.chatId, "sender": deleteChat.receiverId, "receiver": deleteChat.userId}]})
//             .exec((error, data) => {
//                 if(error) {
//                     console.log(error);
//                 }
//                 if(data) {
//                     data.cloudinary_id && cloudinaryCon.uploader.destroy(data.cloudinary_id)
//                     data.remove();
//                     data.save();
//                     Chat.find({"$or": [{"sender": deleteChat.userId, "receiver": deleteChat.receiverId}, {"sender": deleteChat.receiverId, "receiver": deleteChat.userId}]})
//                     .populate('sender')
//                     .exec((err, result) => {
//                       if(err) {
//                           console.log(err);
//                       }
//                       const receiverId = sessionsMap[deleteChat.receiverId];
//                       socket.broadcast.to(receiverId).emit('Output Chat Message', result);
//                       socket.emit("Output Chat Message", result);
      
//                     });
                  
//                 }
                    
//             });
//         });

//        socket.on("Input Chat Message", (msg) => {  
        
//           let chat = new Chat({
//               message: msg.message,
//               cloudinary_id: msg.cloudinary_id,
//               sender: msg.userId,
//               receiver: msg.receiver,
//               timeOfSending: msg.nowTime,
//               type: msg.type
//           });

//           chat.save((error, doc) => {
//               if(error) {
//                 console.log(error);
//               }
 
//             //   Chat.find({"$or": [{"sender": msg.userId}]})   
//                Chat.find({"$or": [{"sender": msg.userId, "receiver": msg.receiver}, {"sender": msg.receiver, "receiver": msg.userId}]})
//               .populate('sender')
//               .exec((err, result) => {
//                 if(err) {
//                     console.log(error);
//                 }
//                 console.log(result);
//                 const receiverId = sessionsMap[msg.receiver];
//                 socket.broadcast.to(receiverId).emit('Output Chat Message', result);
//                 socket.emit("Output Chat Message", result);

//               });
//           });
//     });

// });

// });


// app.get('/get', async(req, res) => {
//     res.status(200).send('Hiii How r you');
// });

 app.listen(process.env.PORT || 8000, () => console.log(`Listening to port ${process.env.PORT}`));


 