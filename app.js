import express from 'express';
import * as dotenv from 'dotenv';
import database from './src/startup/db.js'
import startupRouter from './src/startup/router.js'
import expressMiddlewares from './src/startup/middlewares.js'
const app = express();
dotenv.config();
const port = process.env.PORT || 3000

// Middlewares
database()
expressMiddlewares(app)
startupRouter(app)

app.listen(port,()=>{console.log(`Listening to port : ${port}`)})