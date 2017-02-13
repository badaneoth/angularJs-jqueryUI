/**
 * Created by badane on 06/02/2017.
 */

(function () {
    var app = angular.module('App', []);
    app.controller('dndCtrl', ['$scope', 'someArrays', function ($scope, someArrays) {
        $scope.someArrays = someArrays;



        $scope.dropListener = function (eDraggable, eDroppable) {



            var isDropForbidden = function (aTarget, item) {
                if (aTarget.some(function (i) {
                        //return i.name == item.name;
                        // if(i.list0.name==item.name){

                        //}

                    })) {
                    return {reason:'target already contains "' + item.name + '"'};
                } else {
                    return false;
                }
            };
            var onDropRejected = function (error) {
                alert('Operation not permitted: ' + error.reason);
            };
            var onDropComplete = function (eSrc, item, index) {


                console.log('moved "' + item.name + ' from ' + eSrc.data('model') + '[' + index + ']' + ' to ' + eDroppable.data('model'));


            };
            var eSrc = eDraggable.parent();
            var sSrc = eSrc.data('model');
            var sTarget = eDroppable.data('model');
            if (sSrc != sTarget) {
                $scope.$apply(function () {
                    var index = eDraggable.data('index');
                    var aSrc = $scope.$eval(sSrc);
                    var aTarget = $scope.$eval(sTarget);
                    var item = aSrc[index];
                    var error = isDropForbidden(aTarget, item);
                    if (error) {
                        onDropRejected(error);
                    } else {
                        aTarget.push(item);
                        aSrc.splice(index, 1);
                        onDropComplete(eSrc, item, index);
                    }
                });
            }
        };
    }]);
    app.factory('someArrays', ['$q', '$timeout', function ($q, $timeout,$scope) {
        var deferred = $q.defer();
        $timeout(function () {




            deferred.resolve({



                someArrays:{
                    list0:[


                    ],

                    list2:[
                        {name:'HTML'},
                        {name:'PHP'},
                        {name:'SQL'},
                        {name:'CSS'},
                        {name:'javascript'}

                    ],
                    list3:[

                    ]}
            });
        }, 50);


        return deferred.promise.then(function (result) {
            return result.someArrays;
        });
    }]);
    app.directive('uiDraggable', function () {
        return {
            restrict:'A',
            link:function (scope, element, attrs) {
                element.draggable({
                    revert:true
                });
            }
        };
    });
    app.directive('uiDropListener', function () {
        return {
            restrict:'A',
            link:function (scope, eDroppable, attrs) {
                eDroppable.droppable({
                    drop:function (event, ui) {
                        var fnDropListener = scope.$eval(attrs.uiDropListener);
                        if (fnDropListener && angular.isFunction(fnDropListener)) {
                            var eDraggable = angular.element(ui.draggable);
                            fnDropListener(eDraggable, eDroppable, event, ui);
                        }
                    }
                });
            }
        };
    });
})();
