import express from 'express';
import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import jwt from 'jsonwebtoken';

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

//搭建一个静态资源服务器
//把public文件往外暴露了，人人都能访问public了
app.use(express.static("./public"));

var whiteList = ["/api/login","/api/reg","/api/goods","/api/checkname"];

//拦截器
app.all("*",(req,res,next)=>{
    // res.header("Content-Type","application/json;charset=utf-8");
    res.header("Access-Control-Allow-Origin","*");//后期删除,之后会使用代理
    res.header("Access-Control-Allow-Headers","token,x-requested-with,content-type");
    res.header("X-Powered-By",'3.2.1');
    // res.header("Access-Control-Allow-Methods:POST,GET,OPTIONS,DELETE,PUT");
    // res.header('Access-Control-Allow-Headers:x-requested-with,content-type'); 
    // console.log("输出"+req.originalUrl)
    //有可能是post请求带来的
    //有可能是get请求带来的
    //有可能是头部带来的
    let token = req.body.token || req.query.token || req.headers.token;
    if(whiteList.indexOf(req.originalUrl)!=-1){
        next();
    }else{
        jwt.verify(token,global.keys,function(err,data){
            if(err){
                res.json({
                    msg:"token失效"
                })
                return;
            }
            //接收到的token校验通过
            next();
        })
    }
    //进行拦截
    //console.log(req.originalUrl)
    // if(whiteList.indexOf(req.originalUrl)!=-1){
        //next();如果已经登录了，就可以访问其他的接口了
        
    // }else{
    //     //否则不允许登录
    //     if(req.session["userInfo"] != undefined){
            
    //     }
    //     res.status(404).json(
    //         {
    //             "msg":"还没有登录吧?,请先登录",
    //             status:-1
    //         })
    // }
    
})

//配置路由
app.use("/api",router)


app.listen(8080,()=>{
    console.log("run server http://127.0.0.1")
})