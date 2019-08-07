import express from 'express';
import db from "./../lib/DbHelper";
let router = express.Router();


//登录接口
router.post("/login",(req,res,next)=>{
    let sql ="SELECT `uid`,`uname` FROM user_infor WHERE `uname`= ? AND `upassword`=?;";
    let params =[req.body.uname,req.body.upassword];
    //返回结果
    var resultObj = {
        "msg":"登录失败",
        status: -1
    };

    db.query(sql,params).then((result)=>{
        console.log(result[0]);
        if(result.length > 0){
            resultObj.data = result[0];
            resultObj.msg="登录成功";
            resultObj.status=1;
        }
        res.json(resultObj);
    }).catch((err)=>{
        console.log("error");
        resultObj.err = err;
        res.json(resultObj);
    });
})

//注册接口
router.post("/reg",(req,res,next)=>{
    let sql = "INSERT INTO user_infor (uname,upassword,uemail) VALUES(?,?,?);";
    let params = [
        req.body.uname,
        req.body.upassword,
        req.body.uemail
    ];
    db.queryAsync(sql,params).then((data)=>{
        if(data.affectedRows ==1){
            res.json({"msg":"注册成功",status:1})
        }else{
            res.json({"msg":"注册失败",status:-1})
        }
        //console.log(data)
    },(err)=>{
        res.json({"msg":"注册失败",status:-2,err})
    });
});

module.exports={
    router
}