myApp.controller('InteractiveController', ['$scope', '$http', 'windowManager', '$rootScope',
        function ($scope, $http, windowManager, $rootScope) {
            $scope.today = new Date();
            $scope.fileSystem = windowManager.fileSystem;

            $scope.desktopIconClicked = function desktopIconClicked(clickEvent) {
                fileName = clickEvent.currentTarget.innerText.trim();
                windowManager.openWindow(fileName);
            };

            // make windows draggable
            $(".draggable").draggable({ handle: ".titleBar", containment: "parent" });
        }]);