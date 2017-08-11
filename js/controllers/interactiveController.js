myApp.controller('InteractiveController', ['$scope', '$http', 'windowManager', '$rootScope', '$timeout', 'config', 'resume',
    function ($scope, $http, windowManager, $rootScope, $timeout, config, resume) {
        $scope.today = new Date();
        $scope.fileSystem = windowManager.fileSystem;
        $scope.windows = windowManager.windows;

        // load config
        config.getData()
            .then(function (config) {
                $scope.config = config;

                // load resume
                resume.getData(config.resumeJsonUrl)
                    .then(function (resume) {
                        // add resume to scope
                        $scope.resume = resume;
                        $scope.resumeJson = JSON.stringify($scope.resume, undefined, 4).split('\n');

                        // set page title
                        $scope.siteName = resume.basics.name + "'s Resume";
                    });
            });

        // this should be called any time windows are updated in UI
        function refreshWindows() {
            $timeout(function () {
                // make windows draggable
                $(".draggable").draggable({
                    handle: ".titleBar",
                    containment: "parent",
                    stop: function (event, ui) {
                        windowManager.updateWindowPosisition(ui.helper[0].id, ui.position);
                    }
                });
            });
        }

        // scope methods
        $scope.desktopIconClicked = function (clickEvent) {
            fileName = clickEvent.currentTarget.innerText.trim();
            windowManager.openWindow(fileName);
            refreshWindows();
        };

        $scope.windowClicked = function (windowId) {
            if (!$("#" + windowId).hasClass("active")) {
                windowManager.setActiveWindow(windowId);
                refreshWindows();
            }
        };

        $scope.setWindowState = function (windowId, windowState) {
            windowManager.updateWindowState(windowId, windowState);
            refreshWindows();
        };

        $scope.closeWindow = function (windowId) {
            windowManager.closeWindow(windowId);
            refreshWindows();
        };
    }]);