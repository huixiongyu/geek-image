var redis = require('redis');
var client = redis.createClient();
client.on("error", function (err) {
    console.log("redis client连接失败",err);
});
client.on('ready', function (res) {
    console.log('client ready');
});
client.on('connect', function () {
    client.set("var_1", "var_1_val", redis.print);
    var read_var=client.get("var_1");
    console.log("读取到的值："+read_var);
    client.set("var_2", "var_2_val", function () {
        var read_var_2=client.get("var_2");
        console.log("第二次读取到的值："+read_var_2);
    });
    client.set("var_3", "var_3_val", function () {
        var read_var_3=client.get("var_3",function (err,reply) {
            console.log("第三次读取到的值：",err,reply);
        });
    });
    //client.quit();
});
client.on("error", function (err) {
    console.log("Error " + err);
});
