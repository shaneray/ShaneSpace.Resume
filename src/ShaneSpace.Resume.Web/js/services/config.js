angular.module("configService", [])
    .factory('config', ['$http',
    function ($http) {
        // declare
        this.promise = null;
        configUrl = "/config.json";

        // methods
        function loadConfig() {
            return $http.get(configUrl)
                .then(function (res) {
                    return res.data;
                });
        };

        // service
        var configService = {
            updateConfigUrl: function (url) {
                configUrl = url;
            },
            getData: function () {
                if (!this.promise) {
                    this.promise = loadConfig();
                }
                return this.promise;
            }
        };

        return configService;
    }]);