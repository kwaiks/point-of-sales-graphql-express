import express, {Application} from "express";
import dotenv from "dotenv";
import { Model } from "objection";
import cors from "cors";
import { graphqlUploadExpress } from 'graphql-upload';
import cookieParser from "cookie-parser";
import knexConfig from "config/db/knex";
import { graphqlHTTP } from "express-graphql";
import schema from "schema";
import { verifyToken } from "middlewares/jwt";

export default (app: Application) => {
    dotenv.config();
    Model.knex(knexConfig);
    app.use(cookieParser());
    app.use(cors({
        origin: "*" ,
        //origin: process.env.NODE_ENV === "development" ? "*" : ["https://pranala.link","https://pranala.app","https://www.pranala.link"],
        // credentials: true
    }));
    // if (process.env.NODE_ENV === "development"){
    //     app.use(morgan("dev"));
    // }
    app.use(express.static("public"));
    app.use('/gql',
        verifyToken,
        graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
        graphqlHTTP({
            schema: schema,
            graphiql: process.env.NODE_ENV === "development" ? ({
                headerEditorEnabled: true
            }) : false,
            customFormatErrorFn: (err) => {
                if(err.message === "UNAUTHORIZED"){
                    return ({message: err.message, statusCode: 401})
                }
                return err;
            }
        }
    ));
    app.get("*", (_req, res) => {
        res.status(404).send("Not Found");
    });
};