import "dotenv/config";
import Fastify from "fastify";
import { PORT } from "./src/config/config.js";
import { connectDB } from "./src/config/connect.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";


const start  = async ()=>{
    await  connectDB(process.env.MONGO_URI)
    const app = Fastify()

 
    await buildAdminRouter(app);

    
    app.listen({port: PORT, host:"0.0.0.0"}, (err,addr)=>{
        if(err){

            console.log(err);
            
        }
        else{
            console.log(`ZipZap Started on http://localhost:${PORT}${admin.options.rootPath}`);
            
        }
    })

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