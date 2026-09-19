import express from 'express'; 
import helmet from 'helmet';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';


import { NotFoundMiddleWare } from './middlewares/NotFound.middlewares.js';
import { GlobalErrorHandler } from './middlewares/GlobalErrorHandler.middlewares.js';
import AuthRouter from './routes/auth.routes.js'; 

const app = express(); 

app.use(helmet()); 
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true 
}))
app.use(express.json()); 
app.use(cookieParser()); 

app.get('/health', (request, response) => {
    response.json({
        status: "ok", 
        message: "This is health page"
    })
}); 
app.use("/api/auth", AuthRouter); 

app.use(NotFoundMiddleWare); 
app.use(GlobalErrorHandler); 

export default app; 