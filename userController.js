// 'use strict';
var app = angular.module("userModule", ['ui.bootstrap']);
app.controller("modalAccountFormController", ['$scope', '$modal', 'userService', function ($scope, $modal, userService) {


    $scope.init = function () {
        userService.getUsers().then(function (response) {
            $scope.products = response.data;
        });
    };



    $scope.saveUpdateUserModel = function (userData) {
        var modalInstance = $modal.open({
            templateUrl: 'modal-form.html',
            controller: 'createUpdateUserModelController',
            scope: $scope,
            resolve: {
                user: function () {
                    return userData;
                }
            }
        }).result.then(function (selectedItem) {
            $scope.init();
            $scope.selected = selectedItem;
        });
    };

    $scope.removeProduct = function (userData) {
        console.log("inside delete in controller")
        // $scope.products.splice(index, 1);
        console.log(userData)
        userService.deleteUser(userData._id).then(function (response) {
            $scope.products = response.data;
        })
    };

}])
    .controller('createUpdateUserModelController', ['$scope', '$modalInstance', 'userService', 'user', function ($scope, $modalInstance, userService, user) {
        $scope.userData = {};
        $scope.products = [];
        if (user) {
            $scope.userData = user;
            // $scope.deleteObj = user.username;
        };

        $scope.saveUpdateUser = function (userForm) {
            if (userForm.$valid) {
                var userObj = angular.copy($scope.userData);

                if (!userObj._id) {
                    userService.postUser(userObj).then(function (response) {
                        $scope.products = response.data;
                        $modalInstance.close('closed');
                        console.log("done posting")
                    }).catch(function (err) {
                        $scope.userError = err.data.messsage ? err.data.messsage : err.data;
                    })
                }
                else {
                    userService.updateUser(userObj).then(function (response) {
                        $scope.products = response.data;
                        $modalInstance.close('closed');
                    }).catch(function (err) {
                        $scope.userError = err.data.messsage ? err.data.messsage : err.data;
                    })
                }
            } else {
                userForm.submited = true;
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        // $scope.removeProduct = function (userData) {
        //     console.log("inside delete in controller")
        //     // $scope.products.splice(index, 1);
        //     console.log($scope.userData)
        //     userService.deleteUser(userData._id).then(function (response){
        //         $scope.products = response.data;
        //     })
        // };
    }
    ])


    .factory('userService', ['$http', function ($http) {
        return {
            getUsers: function () {
                return $http.get("http://192.168.2.212:8080/groupUser/groupdetails");
            },
            postUser: function (userobj) {
                console.log("post in service")
                return $http.post("http://192.168.2.212:8080/groupuser/creategroup", userobj)
            },
            deleteUser: function (_id) {
                console.log("delete in service")
                return $http.delete("http://192.168.2.212:8080/groupuser/delete/" + _id)
            },
            updateUser: function (userObj) {
                console.log("inside service-update" + userObj._id)
                return $http.patch("http://192.168.2.212:8080/groupuser/groupupdate/" + userObj._id, userObj)
            }
        };
    }
    ]);