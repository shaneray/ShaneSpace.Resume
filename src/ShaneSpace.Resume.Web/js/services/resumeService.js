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

                            resume = res.data;

                            // order skills by keyword count for better UI display
                            resume.skills = resume.skills.sort(function (a, b) { return b.keywords.length - a.keywords.length });
                            return resume;
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