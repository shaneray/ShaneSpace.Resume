angular.module("resumeService", [])
    .factory('resume', ['$http', '$rootScope',
    function ($http, $rootScope) {
        // declare
        defaultPicture = "/img/user-200.png";
        resumeUrl = "https://raw.githubusercontent.com/shaneray/resume/master/data/resume.json";
        resume = null;
                
        // methods
        loadResume = function () {
            console.log("loading: " + resumeUrl);
            $http.get(resumeUrl)
                .then(function (res) {
                    console.log("loaded: " + resumeUrl);
                    resume = res.data;

                    // order skills by keyword count for better UI display
                    resume.skills = resume.skills.sort(function (a, b) { return b.keywords.length - a.keywords.length });
                    $rootScope.siteName = resume.basics.name + "'s Resume";
                    $rootScope.resume = resume;
                });
        };

        // init
        loadResume();
        $rootScope.resumeUrl = resumeUrl;
        $rootScope.defaultPicture = defaultPicture;

        var resumeService = {
            updateResumeUrl: function (url) {
                resumeUrl = url;
                loadResume();
                $rootScope.resumeUrl = resumeUrl;
            }
        };

        return resumeService;
    }]);