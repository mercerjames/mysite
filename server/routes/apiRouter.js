import express from 'express';
import db from "./../lib/DbHelper";
import fs from "fs";//filesystem
import jwt from "jsonwebtoken";
// import async1 from "async";

let router = express.Router();

global.keys = "mercer";
//登录接口
router.post("/login", (req, res, next) => {
    let sql = "SELECT `uid`,`uname` FROM user_infor WHERE `uname`='"+req.body.uname+"' AND `upassword`='"+req.body.upassword+"';";
    //let params = [req.body.uname, req.body.upassword];
    //返回结果
    console.log(sql);
    
    var resultObj = {
        "msg": "登录错误",
        status: -1
    };

    db.query(sql,[]).then((result) => {
        console.log(result);
        if (result.length > 0){
            //如果登录了，就保存到session中间
            //如果登录成功了,就把当前登录者的信息保存到session
            //服务端的页面（接口）与页面（接口）之间的传值方式
            
            var token = jwt.sign(Object.assign({},result[0]),global.keys,{
                expiresIn:60*30
            });
            console.log("输出token:"+token)
            //req.session["userInfo"] = result[0];
            resultObj.data = result[0];
            resultObj.msg = "登录成功";
            resultObj.status = 1;
            resultObj.token = token;
           
            // res.status(200).json(resultObj);
            res.json(resultObj);
        }  
        
    }).catch((err) => {
        console.log("error");
        resultObj.err = err;
        res.json(resultObj);
    });
})

//注册接口
router.post("/reg", (req, res, next) => {
    let sql = "INSERT INTO user_infor (uname,upassword,uemail) VALUES(?,?,?);";
    let params = [
        req.body.uname,
        req.body.upassword,
        req.body.uemail
    ];
    db.queryAsync(sql, params).then((data) => {
        if (data.affectedRows == 1) {
            res.json({ "msg": "注册成功", status: 1 })
        } else {
            res.json({ "msg": "注册失败", status: -1 })
        }
        //console.log(data)
    }, (err) => {
        res.json({ "msg": "注册失败", status: -2, err })
    });
});


//产品列表
router.get("/goods", (req, res, next) => {
    //fs模块

    //同步方法，返回结果
    var tmpPid = req.query.pid == undefined ? 0 : req.query.pid;//接受前端发过来的url带参数得到它的参数
    var goodsStr = fs.readFileSync("./data/goodsList.json", {
        encoding: "utf-8",  //返回的编码就是utf-8格式
        flag: "r"
    });
    // console.log(JSON.parse(goodsStr));
    const goodsList = JSON.parse(goodsStr);
    var queryList = goodsList.filter((el) => {
        return el.pId.indexOf(tmpPid) != -1;
    })
    if (req.query.pid == undefined) {
        res.json(goodsList);
    } else {
        res.json(queryList);
    }

    //异步方法，用回调函数
    // var goodsStr = fs.readFile("./../data/goodsList.json",function(err,data){
    //     console.log(data)
    // })
})

//加入购物车
router.post("/addcart", async (req, res, next) => {


    //一.查询
    //1.sql
    const selectSQL = "SELECT * FROM carts WHERE pId=? AND uid=?";
    var selectParams = [
        req.body.pId,
        req.body.uId
    ]
    let queryData = await db.queryAsync(selectSQL, selectParams)


    if (queryData.length >= 1) {
        //三.修改
        var updateSQL = "UPDATE carts SET pNum=pNum+?,pTotal=pNum*pPrice WHERE uid=? AND pId=?";
        var updateParams = [
            req.body.pNum,
            req.body.uId,
            req.body.pId
        ]
        let updateData = await db.queryAsync(updateSQL, updateParams)
        if (updateData.affectedRows >= 1) {
            res.json({
                msg: "加入成功u",
                status: 1
            })
        } else {
            res.json({
                msg: "加入失败u",
                status: -1
            })
        }
    } else {
        //二.插入
        var insertSQL = "INSERT INTO carts (`uid`,`pId`,`pName`,`pPrice`,`pNum`,`pTotal`,`pImg`) VALUES (?,?,?,?,?,?,?);";
        var insertParams = [
            req.body.uId,
            req.body.pId,
            req.body.pName,
            req.body.pPrice,
            req.body.pNum,
            req.body.pTotal,
            req.body.pImg
        ]
        console.log(insertParams)
        let insertData = await db.queryAsync(insertSQL, insertParams)
        if (insertData.affectedRows >= 1) {
            res.json({
                msg: "加入成功i",
                status: 2
            })
        } else {
            res.json({
                msg: "加入失败i",
                status: -2
            })
        }
    }





    //如果大于1，表示已经购买商品，只需要修改数量即可
    //否则插入一条新的数据

    //安装组件 cnpm i async --save-dev
    //2.params





})

router.get("/getcart", async (req, res, next) => {

    let uid = req.query.uId;

    let sql = "SELECT * FROM carts WHERE uid = ?;";

    let params = [uid];

    const result = await db.query(sql, params);
    res.json(result)
    // console.log(result);

})

router.post("/modify", async (req, res, next) => {

    let params = [
        req.body.pNum,
        req.body.uId,
        req.body.pId,
    ];

    let sql = "UPDATE carts SET pNum =?,pTotal = pNum*pPrice WHERE uid=? AND pid=?;";



    const result = await db.query(sql, params);
    res.json(result)
    // console.log(result);

})
//删除
router.post("/delete", async (req, res, next) => {

    let params = [
        req.body.uId,
        req.body.pId,
    ];

    let sql = "DELETE FROM carts WHERE uid=? AND pid=?;";

    const result = await db.query(sql, params);
    res.json(result)
    // console.log(result);

})
module.exports = {
    router
}