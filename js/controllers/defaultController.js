myApp.controller('DefaultController', ['$scope', '$http', '$timeout', 'resume', 'config', 'display', '$rootScope', '$location',
        function ($scope, $http, $timeout, resume, config, display, $rootScope, $location) {
            $scope.printMode = $location.search().print === '1';
            $scope.profileKey = $location.search().profile || 'default';

            function applyResume(resumeData) {
                $scope.resume = display.enrich(resumeData, $scope.profileKey);
                $scope.printView = display.buildPrintView($scope.resume);
                $scope.siteName = resumeData.basics.name + "'s Resume";

                document.title = $scope.resume.basics.name + ' - ' +
                    $scope.resume.basics.label.replace(/\s*[·|]\s*/g, ', ') + ' Resume';
            }

            config.getData()
                .then(function (config) {
                    $scope.config = config;

                    resume.getData(config.resumeJsonUrl)
                        .then(function (resumeData) {
                            applyResume(resumeData);

                            if ($scope.printMode) {
                                document.body.classList.add('print-preview');
                                $timeout(function () {
                                    window.print();
                                }, 500);
                            }
                        });
                });

            $scope.updateResumeUrl = function () {
                url = $('#resumeJsonSetting').val();
                resume.getData(url)
                        .then(function (resumeData) {
                            applyResume(resumeData);
                        });
            };
        }]);
