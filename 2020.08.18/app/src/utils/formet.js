// 日期格式化
var date = new Date();
export function formatDate() {
    // 1.确定数据结构
    var str = "YYYY-MM-DD  hh : mm : ss";
    // 2.获取具体的年月日时分秒,替换 结构 成字符串
    var time = {
        "Y+": date.getFullYear(),
        "M+": date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1),
        "D+": date.getDate() >= 10 ? date.getDate() : "0" + date.getDate(),
        "h+": date.getHours() >= 10 ? date.getHours() : "0" + date.getHours(),
        "m+": date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes(),
        "s+": date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds()

    }
    // 3.把str字符 替换为 事件

    // 3.1 反向引用 获取 YYYY MM DD hh mm ss   RegExp.$1
    // 3.2 然后替换 str.replace(RegExp.$1 , time[key]);
    for (var key in time) {
        var reg = new RegExp(`(${key})`);
        console.log(reg);
        if (reg.test(str)) {
            // var newValue = time[key] >= 10 ? time[key] : "0" + time[key];
            // str = str.replace(RegExp.$1, newValue);
            str = str.replace(RegExp.$1, time[key]);
            // 反向引用 获取 YYYY MM DD hh mm ss
        }
    }
    console.log(str);
    return str;
}



var res = formatDate(date);

console.log(res); //2020-07-16  16:57:57

// 新增需求:日期格式不确定,

var date = new Date();
console.log(date);

 function formatDate(date,str) {
    // 1.确定数据结构
    var res = str;
    // 2.获取具体的年月日时分秒,替换 结构 成字符串
    var time = {
        "Y+": date.getFullYear(),
        "M+": date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1),
        "D+": date.getDate() >= 10 ? date.getDate() : "0" + date.getDate(),
        "h+": date.getHours() >= 10 ? date.getHours() : "0" + date.getHours(),
        "m+": date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes(),
        "s+": date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds()

    }
    // 3.把str字符 替换为 事件

    // 3.1 反向引用 获取 YYYY MM DD hh mm ss   RegExp.$1
    // 3.2 然后替换 str.replace(RegExp.$1 , time[key]);
    for (var key in time) {
        var reg = new RegExp(`(${key})`);
        console.log(reg);
        if (reg.test(res)) {
            // var newValue = time[key] >= 10 ? time[key] : "0" + time[key];
            // str = str.replace(RegExp.$1, newValue);
            res = str.replace(RegExp.$1, time[key]);
            // 反向引用 获取 YYYY MM DD hh mm ss
        }
    }
    console.log(str);
    return res;
}
var res = formatDate(date,"2020/07/16 17:54:50");
console.log(res); //2020-07-16  16:57:57
