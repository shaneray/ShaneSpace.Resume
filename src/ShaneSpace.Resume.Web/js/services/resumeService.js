angular.module("resumeService", [])
    .factory('resume', ['$http',
    function ($http, $window) {
        // declare
        this.promise = null;
        this.resumeJsonUrl = null;

        // methods
        function loadResume(resumeJsonUrl) {
            console.log("loading: " + resumeJsonUrl);
            return $http.get(resumeJsonUrl)
                        .then(function (res) {
                            this.resumeJsonUrl = resumeJsonUrl;
                            return res.data;
                        });
        };

        // service
        var resumeService = {
            getData: function (resumeJsonUrl) {
                // only load if not already loaded or new url provided
                if (!this.promise || resumeJsonUrl != this.resumeJsonUrl) {
                    this.promise = loadResume(resumeJsonUrl);
                }

                return this.promise;
            }
        };

        return resumeService;
    }]);