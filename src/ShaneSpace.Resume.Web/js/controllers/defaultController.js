myApp.controller('DefaultController', ['$scope', '$http', '$timeout', 'resume', 'config', '$rootScope',
        function ($scope, $http, $timeout, resume, config, $rootScope) {
            // load config
            config.getData()
                .then(function (config) {
                    $scope.config = config;

                    // load resume
                    resume.getData(config.resumeJsonUrl)
                        .then(function (resume) {
                            // add resume to scope
                            $scope.resume = resume;

                            // set page title
                            $scope.siteName = resume.basics.name + "'s Resume";
                        });
                });

            // update resume url
            $scope.updateResumeUrl = function () {
                url = $('#resumeJsonSetting').val();
                resume.getData(url)
                        .then(function (resume) {
                            // add resume to scope
                            $scope.resume = resume;

                            // set page title
                            $scope.siteName = resume.basics.name + "'s Resume";
                        });
            };
        }]);