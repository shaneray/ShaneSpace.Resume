var myApp = angular.module('resume', ['ngRoute', 'configService', 'windowManagerService', 'resumeService'])
    .config(config)
    .run(run);

run.$inject = ['$rootScope', '$http', '$location', '$route', 'config'];
function run($rootScope, $http, $location, $route) {
    // declare globals
}

config.$inject = ['$routeProvider', '$locationProvider'];
function config($routeProvider, $locationProvider) {
    $routeProvider.
        when('/default', {
            templateUrl: 'views/Default/Blank.html',
            controller: 'StandardController',
            pageTitle: 'Shane Ray\'s Resume'
        }).
        when('/interactive', {
            templateUrl: 'views/SSResumeViewer/Default.html',
            controller: 'InteractiveController',
            pageTitle: 'Shane Ray\'s Resume'
        }).
        when('/login', {
            templateUrl: 'Login.html',
            controller: 'StandardController',
            pageTitle: 'Shane Ray\'s Resume'
        }).
        otherwise({
            redirectTo: '/login'
        });
}