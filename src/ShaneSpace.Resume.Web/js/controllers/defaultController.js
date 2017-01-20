myApp.controller('DefaultController', ['$scope', '$http', '$timeout', 'resume',
        function ($scope, $http, $timeout, resume) {
            $scope.updateResumeUrl = function () {
                url = $('#resumeJsonSetting').val();
                console.log("updating to:" + url);
                resume.updateResumeUrl(url);
            };
        }]);