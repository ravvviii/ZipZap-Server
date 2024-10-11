import "dotenv/config";
import Fastify from "fastify";
import fastifySocketIO from "fastify-socket.io";
import { PORT } from "./src/config/config.js";
import { connectDB } from "./src/config/connect.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/index.js";


const start  = async ()=>{
    await  connectDB(process.env.MONGO_URI)
    const app = Fastify()

    app.register(fastifySocketIO,{
        cors:{
            origin:'*'
        },
        pingInterval:10000,
        pingTimeout:5000,
        transports:['websocket']
    });

    await registerRoutes(app)
 
    await buildAdminRouter(app);
    app.listen({port: PORT , host:'0.0.0.0',}, (err,addr)=>{
        if(err){

            console.log(err);
            
        }
        else{
            console.log(`ZipZap Started on http://localhost:${PORT}${admin.options.rootPath}`);
            
        }
    })

    app.ready().then(() => {
        app.io.on("connection", (socket) => {
          console.log("A User Connected ✅");

          socket.on("joinRoom",(orderId)=>{
            socket.join(orderId);
            console.log(`🔴 User Joined room ${orderId}`);

          })

          socket.on('disconnect',()=>{
            console.log(`User Disconnected ❌`);
            
          })


        });
      });
}

start()




// export const authenticate = async (email, password) => {
//     if (email && password) {
//       const user = await Admin.findOne({ email });
//       if (!user) {
//         return null;
//       }
  
//       if (user.password === password) {
//         return Promise.resolve({ email: email, password: password });
//       } else {
//         return null;
//       }
//     }
//   };