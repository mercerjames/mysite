import express from 'express';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';

//引入路由管理
import {router} from './routes/apiRouter';  //es6结构解析

const app = express();
//配置中间件
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(cookieParser("mercerJames.cn"));
app.use(cookieSession({
    name: "mercerJames.cn",
    keys: ["aa","bb","cc"],
    expires: 1000*60*20
}));

//拦截器
app.all("*",(req,res,next)=>{
    res.header("Content-Type","application/json;charset=utf-8");
    res.header("Access-Control-Allow-Origin","*");//后期删除,之后会使用代理

    next();
})

//配置路由
app.use("/api",router)


app.listen(8080,()=>{
    console.log("run server http://127.0.0.1")
})