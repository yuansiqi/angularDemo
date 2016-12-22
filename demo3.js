var app=angular.module("testApp",['Encryption']);
//定义一个控制器 bandContr
app.controller("bandContr",function($scope,Md5){
    $scope.people=
        [
            {"name":"yuansq","sex":"yuansq is a boy!"},
            {"name":"zhangyu","sex":"zhangyu is a boy!"},
            {"name":"tangchen","sex":"tangchen is a boy!"},
            {"name":"liuteng","sex":"zhangyu is a boy!"}
        ];
});
//定义一个指令1  变形模板
app.directive("search",function(searchService,Md5){
    return{
        restrict:'EA',
        templateUrl:"demo3temp.html",
        repace:true,
        scope:true,
        link:function(scope,element,attrs){
            scope.query="";
        //选择性别
        scope.queryChange = function(param){
                   searchService.peopleQuery(param,function(data){
                   scope.people=data;
                })
        };
    }}
});
//定义一个指令2 翻译模板
app.directive("baidufanyi",function(searchService,Md5){
    return{
        restrict:'EA',
        templateUrl:"demo3temp2.html",
        repace:true,
        scope:true,
        link:function(scope,element,attrs){
        //初始化
        scope.keyWord="";
        //翻译
        scope.trans=function(){
       
         // 拼接appid=2015063000000001+q=apple+salt=1435660288+密钥=12345678
        //得到字符串1 =2015063000000001apple143566028812345678
            if(scope.keyWord==""){
                scope.dst="";  
                 return ;
            }
       //  var user= searchService.getTemp("BDFY");
       //  alert(user.appid);
            var param={
                q:scope.keyWord,//searchService.changeCode(scope.keyWord),
                from:"auto",
                to:"auto",
                appid:"2015063000000001",//"2015063000000001",
                salt:(new Date).getTime(),
                key:"12345678" //12345678
            }
            //加密
             param.sign=Md5.hex_md5(param.appid+Md5.utf8_encode(param.q)+param.salt+param.key);
             searchService.transgGet(param,function(data){
               // scope.$apply(function(){   })
                     scope.dst=  data.trans_result[0].dst;
                      if(scope.keyWord==""){
                          scope.dst="";
                        }
                      }
              );
        }
        //监控
        scope.$watch('keyWord', scope.trans);
       }
    }
});
app.factory("searchService",function(HashMapServices,$http,$templateCache,$q){
   var baiduTransUrl="http://api.fanyi.baidu.com/api/trans/vip/translate";
  
  var  _peopleQuery =function(param,callback){          
      var data={
          boy:[ {"name":"yuansq","sex":"yuansq is a boy!"},
                {"name":"zhangyu","sex":"zhangyu is a boy!"},
                {"name":"tangchen","sex":"tangchen is a boy!"},
                {"name":"liuteng","sex":"zhangyu is a boy!"}
               ] ,
          girl:[ {"name":"yuansq","sex":"yuansq is a girl!"},
                 {"name":"zhangyu","sex":"zhangyu is a girl!"},
                 {"name":"tangchen","sex":"tangchen is a girl!"},
                 {"name":"liuteng","sex":"zhangyu is a girl!"}
               ]
        };
        if(param=="boy"){
            callback(data.boy);
        }else{
             callback(data.girl);
       }
  }
  //缓存数组
  var cache=[];
  var _transGet=function (param,callback){
    var cacheIndex=_getIndex(param.q);
    var cacheData=cache[cacheIndex];
   //  var cacheData= HashMapServices.get(param.q)
     if(cacheData==undefined||cacheData==null||cacheData=="") {
      var urlParam="?q="+param.q+"&from="+param.from+"&to="+param.to+"&appid="+param.appid+"&salt="+param.salt+"&sign="+param.sign+"&callback=JSON_CALLBACK";
       $http.jsonp(baiduTransUrl+urlParam)
         .success(function(data){
         cache[cacheIndex]=data;
       //  HashMapServices.put(param.q,data);
         callback(data);
         });
     }else {
         callback(cacheData);
     }
  }
 var _getTemp=function(url){
      $http.get("js/API.json")
      .success(
             function(data) {
               return data;
              });
 }
 var _getIndex =function(str){
      var index=  _hashCode(str);
     // console.log(index%100000);
      return index;
 }
 var _hashCode =function(str){
      var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
 }
var service={
       peopleQuery:_peopleQuery,
       transgGet:_transGet,
       getTemp:_getTemp,
       hashCode:_hashCode
};
   return service;
});
//hashMap
app.factory('HashMapServices', function () {
    var params = new Array(16);
    var LOAD_FACTOR=0.75; 
    var CURRENT_LENGTH=16;
    return {
        get: function (key) {
            return params[this.hashCode(key)%CURRENT_LENGTH];
        },
        put: function (key, object) {
            if(this.size>=(CURRENT_LENGTH*LOAD_FACTOR)){
                CURRENT_LENGTH*=2;
                param= arrayCopy(params,CURRENT_LENGTH)
            }
            params[this.hashCode(key)%CURRENT_LENGTH]=object;
        },
        remove: function (key) {
               params[this.hashCode(key)%CURRENT_LENGTH]=null;
        },
        hashCode:function(str){
             var hash = 0;
            if (str.length == 0) return hash;
             for (i = 0; i < str.length; i++) {
                   char = str.charCodeAt(i);
                    hash = ((hash<<5)-hash)+char;
                       hash = hash & hash; // Convert to 32bit integer
            }
         return hash;
        },
        size:function(){
            return this.params.length;
        },
        arrayCopy:function(o,length){
            var copy =  new array(length);;
            for ( var i in o )
            {
                copy[i] = o[i];
            }
            return copy;
        }
       
    };
})
  //    toUnicode:_toUnicode,
    //    changeCode:_changeCode
// var _changeCode= function(str){
//     var zhReg="^[\u4e00-\u9fa5]+";
//     var reg = new RegExp(zhReg);
//     if(reg.test(str)){
//         return   _toUnicode(str);
//     }else{
//         return str;
//     }
// } 
// var _toUnicode =function(str){
//    var src="";
//    for(var i=0;i<str.length;i++)
//    {
//       src+="\\u"+parseInt(str[i].charCodeAt(0),10).toString(16);
//    }
//    return src;
// }
 /**ajax */
    //   $.ajax({
    //     url: baiduTransUrl,
    //    type: 'get',
    //    dataType: 'jsonp',
    //    data: param,
    //    success: function (data) {
    //    callback(data);
    //     } 
    //   });
    /**http */
    //   $http({
    //         url:baiduTransUrl,
    //         method:'GET',
    //         dataType: 'jsonp',
    //         data: param,
    //   }).success(function(data){
    //     callback(data);
    //  }).error(function(data){
    //     //处理响应失败
    //     alert("失败@");
    //  });