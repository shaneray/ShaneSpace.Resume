angular.module("windowManagerService", [])
    .factory('windowManager', [
    function () {
        var activeWindow = null;
        var openWindows = [];

        var windowManager = {
            openWindow: function (fileName) {
                alert(fileName);
            },
            fileSystem:  {
                extensions: [
                    {
                        extension: "html",
                        icon: "html5",
                        applications: [
                            "Browser",
                            "Notepad"
                        ]
                    },
                    {
                        extension: "txt",
                        icon: "file",
                        applications: [
                            "Notepad"
                        ]
                    },
                    {
                        extension: "json",
                        icon: "file code outline",
                        applications: [
                            "Visual Studio Code"
                        ]
                    },
                    {
                        extension: "other",
                        icon: "file",
                        applications: [
                            "Soap UI"
                        ]
                    },
                ]
            }
        };

        return windowManager;
    }]);