import Express from "express";
import loaders from "loaders/index";
import https from "https";
import http from "http";
// import httpsLocalhost from "https-localhost";
import fs from "fs";

const PORT = process.env.NODE_ENV !== "test" ? process.env.PORT: 3002;

let express;
switch(process.env.NODE_ENV){
    case "development":
        express = Express();
        loaders(express);
        http.createServer(express);
        break;
        // express =  httpsLocalhost("192.168.1.131");
        // loaders(express);
        // break;
    case "production":
        express = Express();
        loaders(express);
        const options = {
            key: fs.readFileSync('key.pem'),
            cert: fs.readFileSync('cert.pem')
        };
        https.createServer(options, express);
        break;
    case "test":
        express = Express();
        loaders(express);
        http.createServer(express);
        break;
}
const app = express.listen(PORT, ()=>{
    console.log("Server Started " +process.env.PORT);
});

export default app;