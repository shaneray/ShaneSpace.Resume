angular.module("windowManagerService", [])
    .factory('windowManager', [
        function () {
            var activeWindow = null;
            var openWindows = [];
            var fileSystem = {
                extensions: [
                    {
                        extension: "html",
                        icon: "html5"
                    },
                    {
                        extension: "txt",
                        icon: "file text outline"
                    },
                    {
                        extension: "json",
                        icon: "file code outline"
                    }
                ],
                applications: [
                    {
                        name: "Notepad",
                        icon: "file text outline",
                        view: 'views/SSResumeViewer/Windows/notepad/notepad.html',
                        extensions: [ "txt" ]
                    },
                    {
                        name: "Visual Studio Code",
                        icon: "vsCode",
                        view: 'views/SSResumeViewer/Windows/vscode/vscode.html',
                        extensions: ["json"]
                    },
                    {
                        name: "Microsoft Edge",
                        icon: "microsoftEdge",
                        view: 'views/SSResumeViewer/Windows/edge/edge.html',
                        extensions: ["html"]
                    }
                ]
            };

            // methods
            var getApplicationsByExtension = function (fileExtension) {
                var output = [];

                fileSystem.applications.forEach(function (application) {
                    if ($.inArray(fileExtension, application.extensions) >= 0) {
                        output.push(application);
                    }
                });

                return output;
            };

            var setActiveWindow = function (windowId) {
                openWindows.forEach(function (element) {
                    element.active = element.windowId == windowId;
                    if (element.windowId == windowId) {
                        element.zIndex = 1000;
                        if (element.windowState == "minimized") {
                            element.windowState = "";
                        }
                    }
                    else {
                        element.zIndex--;
                    }
                });
            };

            var openWindow = function (fileName) {
                // get file extension
                var fileExtension = fileName.substring(fileName.indexOf(".") + 1);
                var applications = getApplicationsByExtension(fileExtension);

                if (applications.length > 1)
                {
                    // show application chooser
                    alert("more than one application found for file extension: " + fileExtension);
                    return;
                }

                if (applications.length < 1) {
                    // show error
                    alert("no application found for file extension: " + fileExtension);
                    return;
                }

                // TODO: base windowId off filename + applicationName
                var application = applications[0];
                var windowId = fileName + "-" + application;
                var windowOpen = false;

                // check if window is already open, if so set to active
                openWindows.forEach(function (element) {
                    if (element.windowId == windowId) {
                        windowOpen = true;
                    }
                });
                if (windowOpen) {
                    setActiveWindow(windowId);
                    return;
                }

                openWindows.forEach(function (element) {
                    element.active = false;
                });

                // if not add to open windows, and set it to active
                var newWindow = {
                    windowId: fileName,
                    fileName: fileName,
                    application: application,
                    icon: "file",
                    active: true,
                    zIndex: 1000,
                    windowState: "",
                    position: {
                        top: 50 + (50 * openWindows.length),
                        left: 50 + (50 * openWindows.length)
                    },
                    size: {
                        height: 50,
                        width: 50
                    }
                };

                openWindows.push(newWindow);
            };

            var updateWindowPosisition = function (windowId, position) {
                openWindows.forEach(function (element) {
                    if (element.windowId == windowId) {
                        element.position = position;
                    }
                });
            };

            var updateWindowState = function (windowId, windowState) {
                openWindows.forEach(function (element) {
                    if (element.windowId == windowId) {
                        // if mazimized button clicked when already maximized, restore
                        if (element.windowState == "maximized" && windowState == "maximized") {
                            element.windowState = "";
                        }
                        else {
                            element.windowState = windowState;
                        }
                    }

                    // if the window was minimized set the next active window
                    if (windowState == "minimized") {
                        setNextActiveWindow();
                    }
                });
            };

            var closeWindow = function (windowId) {
                openWindows.forEach(function (element) {
                    if (element.windowId == windowId) {
                        index = openWindows.indexOf(element);
                        openWindows.splice(index, 1);
                    }
                });

                setNextActiveWindow();
            };

            var setNextActiveWindow = function () {
                // get window with highest zIndex
                var nextWindow = {
                    windowId: "desktop",
                    zIndex: 0
                };

                openWindows.forEach(function (element) {
                    if (element.windowState != "minimized" && element.zIndex > nextWindow.zIndex) {
                        nextWindow = element;
                    }
                });

                setActiveWindow(nextWindow.windowId);

            };

            // return service
            return {
                fileSystem: fileSystem,
                windows: openWindows,
                openWindow: openWindow,
                setActiveWindow: setActiveWindow,
                updateWindowPosisition: updateWindowPosisition,
                updateWindowState: updateWindowState,
                closeWindow: closeWindow
            };
        }
    ]);