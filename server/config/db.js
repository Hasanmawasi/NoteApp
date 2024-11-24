import mongoose from "mongoose";
mongoose.set('strictQuery',false);

 export const connectDB = async ()=> {
try {
    const conn = await mongoose.connect(process.env.MONGODB_URL,{
        tls: true,
        tlsAllowInvalidCertificates: true // or false, depending on your needs
      });
    console.log(`data base connectes: ${conn.connection.host}`)
} catch (error) {
    console.log(error)
}
}