/**
 * 配置处理用户相关请求的路由模块
 */
var db = require('../db/db')

module.exports = function (router) {


    var users = {}; //保存所有phone:code的对象
    /*
    发送验证码短信
     */
    router.get('/sendcode', function (req, res, next) {
        //1. 获取请求参数数据
        var phone = req.query.phone;
        console.log('/sendcode ', phone);
        //2. 处理数据
            //生成验证码(6位随机数)
        var code = randomCode(6);
            //发送给指定的手机号
        console.log(`向${phone}发送验证码短信: ${code}`);
            //存储数据
        users[phone] = code;
        
        console.log(users);
        //3. 返回响应数据
        res.send({"code": 0})
    })


    /*
    登陆
     */
    router.post('/login', function (req, res, next) {
        //phone=13716962779&code=123123
        var phone = req.body.phone;
        var code = req.body.code;
        console.log('/login', phone, code);

        //检查code是否正确, 如果不正确, 返回{"code" : 1}
        if(users[phone]!=code) {
            res.send({code : 1});
            return;
        }
        //删除保存的code
        delete users[phone];

        //查询, 如果有, 返回, 如果没有添加
        db.getUser(phone, function (user) {
            if(user!=null) {
                res.send({
                    "code": 0,
                    "data": user
                })
            } else {
                db.addUser(phone, function (user) {
                    res.send({
                        "code": 0,
                        "data": user
                    })
                })
            }
        })
    })

    /*
    意见反馈
     */
    router.get('/feedback', function (req, res, next) {
        var feedback = JSON.parse(req.query.data);
        console.log('/feedback', feedback);

        db.addFeedback(feedback, function (feedback) {
            res.send({
                code : 0,
                data : feedback
            })
        });
    })


    /*
    生成指定长度的随机数
     */
    function randomCode(length) {
        var chars = ['0','1','2','3','4','5','6','7','8','9'];
            var result = ""; //统一改名: alt + shift + R
            for(var i = 0; i < length ; i ++) {
                var index = Math.ceil(Math.random()*9);
                result += chars[index];
            }
            return result;
    }
   // console.log(randomCode(6));
}