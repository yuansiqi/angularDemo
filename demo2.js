// 申明一个app的模块，app模块中注入了 ionic模块 
var app=angular.module("testApp",[]);
//定义一个控制器 bandContr
app.controller("bandContr",function($scope){

    $scope.people=
        [
            {"name":"yuansq","sex":"yuansq is a boy!"},
            {"name":"zhangyu","sex":"zhangyu is a boy!"},
            {"name":"tangchen","sex":"tangchen is a boy!"},
            {"name":"liuteng","sex":"zhangyu is a boy!"},
        ];
});
//定义一个控制器 bandContr2
app.controller("bandContr2",function($scope){

    $scope.people=
        [
            {"name":"yuansq","sex":"yuansq is a girl!"},
            {"name":"zhangyu","sex":"zhangyu is a girl!"},
            {"name":"tangchen","sex":"tangchen is a girl!"},
            {"name":"liuteng","sex":"zhangyu is a girl!"},
        ];
});