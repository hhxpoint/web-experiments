const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
// 1. 引入path模块，处理文件路径
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 2. 关键配置：把public文件夹设为静态资源目录
// 这样浏览器访问localhost:3000/xxx.html 会自动去public文件夹里找文件
app.use(express.static(path.join(__dirname, 'public')));

// 3. 可选：配置根路径的默认响应（访问/时自动打开player.html）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'player.html'));
});


// 管理员页面路由
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});




io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userType, userId) => {
    socket.join(roomId);

    if (userType === 'player') {
      socket.to(roomId).emit('new-player', userId);
    }
  });

  socket.on('offer', (roomId, offer, fromId) => {
    socket.to(roomId).emit('offer', offer, fromId);
  });
  socket.on('answer', (roomId, answer, toId) => {
    socket.to(roomId).emit('answer', answer, toId);
  });
  socket.on('ice', (roomId, ice, fromId) => {
    socket.to(roomId).emit('ice', ice, fromId);
  });
});

server.listen(3000, () => {
  console.log('本地服务已启动：http://localhost:3000');
});