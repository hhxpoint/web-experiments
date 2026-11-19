# WebRTC 信令示例

Express + Socket.IO 实现的房间信令：管理员页发起，播放页加入，交换 offer/answer/ICE。

```bash
npm install
npm start
# http://localhost:3000
# http://localhost:3000/admin
```

媒体流需要浏览器授权摄像头/麦克风；生产环境请加 HTTPS、鉴权与 TURN。
