if (typeof page == "undefined") page = {};
if (typeof page.protoViews == "undefined") page.protoViews = {};

/////////////////////////////////////////////////////////////////////////////////////
// AudioPlayerView
/////////////////////////////////////////////////////////////////////////////////////
(function () {
    function AudioPlayerView(arg) {

        MediaElement.call(this, arg);
    }
    AudioPlayerView.prototype = Object.create(MediaElement.prototype);
    AudioPlayerView.prototype.constructor = AudioPlayerView;

    page.createAudioPlayer = function (arg) {
        var view = new AudioPlayerView(arg);

        if (arg.tag != "") {
            var tag = scada.getTagByName(arg.tag);
            view.tag = tag;
            tag.addEventListener("change", function (event) {
                view.tagValueChanged(event);
            });
            view.setAutoPlay(false);
            view.setPlay(false);
		}

		if (arg.customUrlTag != null && arg.customUrlTag != "") {
			var customUrlTag = scada.getTagByName(arg.customUrlTag);
			view.customUrlTag = customUrlTag;
			customUrlTag.addEventListener("change", function (event) {
				view.urlTagValueChanged(event);
			});
		}

        page.protoViews[arg.id] = view;
        return view;
    }
}());

/////////////////////////////////////////////////////////////////////////////////////
// VideoPlayerView
/////////////////////////////////////////////////////////////////////////////////////
(function () {
    function VideoPlayerView(arg) {

        MediaElement.call(this, arg);
    }
    VideoPlayerView.prototype = Object.create(MediaElement.prototype);
    VideoPlayerView.prototype.constructor = VideoPlayerView;

    page.createVideoPlayer = function (arg) {
        var view = new VideoPlayerView(arg);

        if (arg.tag != "") {
            var tag = scada.getTagByName(arg.tag);
            view.tag = tag;
            tag.addEventListener("change", function (event) {
                view.tagValueChanged(event);
            });
            view.setAutoPlay(false);
            view.setPlay(false);
		}

		if (arg.customUrlTag != null && arg.customUrlTag != "") {
			var customUrlTag = scada.getTagByName(arg.customUrlTag);
			view.customUrlTag = customUrlTag;
			customUrlTag.addEventListener("change", function (event) {
				view.urlTagValueChanged(event);
			});
		}

        page.protoViews[arg.id] = view;
        return view;
    }
})();

/////////////////////////////////////////////////////////////////////////////////////
// CameraPlayerView
/////////////////////////////////////////////////////////////////////////////////////
(function () {
    function CameraPlayerView(arg) {
        this.id = arg.id;
        this.visible = arg.visible;
        this.x = arg.x;
        this.y = arg.y;
        this.width = arg.width;
        this.height = arg.height;

        this.tag = null;
        this.url = arg.url;
        this.autoPlay = arg.autoplay;
        this.controls = arg.controls;
        this.loop = arg.loop;
        this.muted = arg.muted;
        this.rate = arg.rate;
        this.volume = arg.volume;

        this.securityKey = arg.securityKey;
        this.attributes = {};

        // WebRTC - Websocket
        this.isStarted = false;
        this.cameraID = arg.cameraID;
        this.websocketServerIP = arg.websocketServerIP;
        this.websocketServerPort = arg.websocketServerPort;
        this.websocketURL = "ws://" + arg.websocketServerIP + ":" + arg.websocketServerPort;
        this.ws = null;
        this.pc = null;
        this.isPlaying = false;

        // PTZ
        this.EnablePTZ = arg.EnablePTZ;
        //this.PTZPort = arg.websocketServerPort;
        this.PTZPort = -1;
        this.PTZPanelState = false;
        this.PTAvailable = false;
        this.ZoomAvailable = false;
        this.PTZPanelWidth = 150; // PTZ panel width

        // API
        this.PTZAPI = "http://" + arg.websocketServerIP + ":" + this.PTZPort + "/ptz";
        this.InfoAPI = "http://" + arg.websocketServerIP + ":" + arg.websocketServerPort + "/info";
    }

    CameraPlayerView.prototype.startCamera = function (videotagID, camID) {
        var view = this;
        if (view.isStarted) return;
        // pc = new RTCPeerConnection({ iceServers: [{ urls: STUN_URL }] });
        var socketURL = view.websocketURL + "/" + camID;

        // Init Peer Connection
        this.pc = new RTCPeerConnection(null);

        // pc.ontrack = onTrackHandler;
        view.pc.ontrack = (evt) => {
            document.querySelector('#' + videotagID).srcObject = evt.streams[0];
        };
        view.pc.onicecandidate = evt => {
            evt.candidate && view.ws.send(JSON.stringify(evt.candidate));
        }

        // Diagnostics.
        view.pc.onicegatheringstatechange = () => console.log("onicegatheringstatechange: " + view.pc.iceGatheringState);
        view.pc.oniceconnectionstatechange = () => console.log("oniceconnectionstatechange: " + view.pc.iceConnectionState);
        view.pc.onsignalingstatechange = () => console.log("onsignalingstatechange: " + view.pc.signalingState);
        view.pc.onconnectionstatechange = () => console.log("onconnectionstatechange: " + view.pc.connectionState);

        view.ws = new WebSocket(socketURL, []);

        view.ws.onconncect = function (evt) {
            view.ws.send(JSON.stringify("\"ptz\": \"getinfo\""))
        };

        view.ws.onmessage = function (evt) {
            var receiveData = JSON.parse(evt.data);

            if (/^[\{"'\s]*candidate/.test(evt.data)) {
                view.pc.addIceCandidate(receiveData);
            }
            else {
                view.pc.setRemoteDescription(new RTCSessionDescription(receiveData));
                view.pc.createAnswer()
                    .then((answer) => view.pc.setLocalDescription(answer))
                    .then(() => view.ws.send(JSON.stringify(view.pc.localDescription)));
            }
        };

        view.isStarted = true;
    };

    CameraPlayerView.prototype.stopCamera = function () {
        this.pc.close();
        this.ws.close();
        this.isStarted = false;
    };

    CameraPlayerView.prototype.getRect = function () {
        return page.getRect(this);
    }

    CameraPlayerView.prototype.getVisible = function () {
        return this.visible;
    }

    CameraPlayerView.prototype.setVisible = function (value) {
        var visibility = value == true ? "visible" : "hidden";
        var pVisible = page.parentNodeVisibility(this.id);
        if (pVisible != null && pVisible != "visible") {
            visibility = pVisible;
        }

        d3.select("#" + this.id).style("visibility", visibility);
        this.visible = value;
    }

    CameraPlayerView.prototype.setVisibleByGroup = function (value) {
        if (value == false) {
            d3.select("#" + this.id).style("visibility", "hidden");
            return;
        }
        if (this.visible == true) {
            d3.select("#" + this.id).style("visibility", "visible");
        } else {
            d3.select("#" + this.id).style("visibility", "hidden");
        }
    }

    CameraPlayerView.prototype.getX = function () {
        return this.x;
    }

    CameraPlayerView.prototype.setX = function (value) {
        $("#" + this.id).attr("x", value);
        this.x = value;
    }

    CameraPlayerView.prototype.getY = function () {
        return this.y;
    }

    CameraPlayerView.prototype.setY = function (value) {
        $("#" + this.id).attr("y", value);
        this.y = value;
    }

    CameraPlayerView.prototype.getWidth = function () {
        return this.width;
    }

    CameraPlayerView.prototype.setWidth = function (value) {
        $("#" + this.id).attr("width", value);
        this.width = value;
    }

    CameraPlayerView.prototype.getHeight = function () {
        return this.height;
    }

    CameraPlayerView.prototype.setHeight = function (value) {
        $("#" + this.id).attr("height", value);
        this.height = value;
    }

    CameraPlayerView.prototype.getURL = function () {
        return this.url;
    }

    CameraPlayerView.prototype.setURL = function (value) {
        $("#" + this.id).attr("src", value);
        this.url = url;
    }

    CameraPlayerView.prototype.setAngle = function (value) {
    }

    CameraPlayerView.prototype.setOpacity = function (value) {
    }

    CameraPlayerView.prototype.setFillStyle = function (value) {
    }

    CameraPlayerView.prototype.setFillOpacity = function (value) {
    }

    CameraPlayerView.prototype.setStrokeStyle = function (value) {
    }

    CameraPlayerView.prototype.setStrokeOpacity = function (value) {
    }

    CameraPlayerView.prototype.getAutoPlay = function () {
        return this.autoPlay;
    }

    CameraPlayerView.prototype.setAutoPlay = function (value) {
        var attrValue = value == true ? "autoplay" : null;
        $("#" + this.id).attr("autoplay", attrValue);
        this.autoPlay = value;
    }

    CameraPlayerView.prototype.getControls = function () {
        return this.controls;
    }

    CameraPlayerView.prototype.setControls = function (value) {
        var attrValue = value == true ? "controls" : null;
        $("#" + this.id).attr("controls", attrValue);
        this.controls = value;
    }

    CameraPlayerView.prototype.getLoop = function () {
        return this.loop;
    }

    CameraPlayerView.prototype.setLoop = function (value) {
        var attrValue = value == true ? "loop" : null;
        $("#" + this.id).attr("loop", attrValue);
        this.loop = value;
    }

    CameraPlayerView.prototype.getMuted = function () {
        return this.muted;
    }

    CameraPlayerView.prototype.setMuted = function (value) {
        var attrValue = value == true ? "muted" : null;
        $("#" + this.id).attr("muted", attrValue);
        this.muted = value;
    }

    CameraPlayerView.prototype.getRate = function () {
        return this.rate;
    }

    CameraPlayerView.prototype.setRate = function (value) {
        $("#" + this.id).attr("playbackRate", value);
        this.rate = value;
    }

    CameraPlayerView.prototype.getVolume = function () {
        return this.volume;
    }

    CameraPlayerView.prototype.setVolume = function (value) {
        $("#" + this.id).attr("volume", value);
        this.volume = value;
    }

    CameraPlayerView.prototype.getIsPlaying = function () {
        return this.isPlaying;
    }
    CameraPlayerView.prototype.setIsPlaying = function (value) {
        this.isPlaying = value;
    }

    CameraPlayerView.prototype.currentTime = function (value) {
        page.getElementById(this.id).currentTime = value;
    }

    CameraPlayerView.prototype.pause = function () {
        page.getElementById(this.id).pause();
        this.setIsPlaying(false);
    }

    CameraPlayerView.prototype.play = function () {
        this.startCamera(this.id, this.cameraID);
        var camera = page.getElementById(this.id);
        var promise = camera.play();
        this.setIsPlaying(true);
        if (promise !== undefined) {
            promise.then(_ => {
                // Autoplay started!

            }).catch(error => {
                // Autoplay was prevented.
                // Show a "Play" button so that user can start playback.
                console.log(error);
                camera.play();
            });
        }
    }

    CameraPlayerView.prototype.stop = function () {
        this.stopCamera();
        page.getElementById(this.id).pause();
    }

    CameraPlayerView.prototype.setPlay = function (value) {
        value == true ? this.play() : this.pause();
    }

    CameraPlayerView.prototype.addEventListener = function (type, callback, useCapture) {
        var view = this;
        page.getElementById(this.id).addEventListener(type, view.newCallback(callback), useCapture);
    };

    CameraPlayerView.prototype.removeEventListener = function (type, callback, useCapture) {
        var view = this;
        page.getElementById(this.id).removeEventListener(type, view.newCallback(callback), useCapture);
    };

    CameraPlayerView.prototype.newCallback = function (callback) {
        var view = this;
        if (view.securityKey != "undefined" && view.securityKey.length > 0) {
            if (scada.activeSession == "undefined" || scada.activeSession == null) {
                return;
            } else if (scada.activeSession.keys.indexOf(view.securityKey) < 0) {
                return;
            }
        }
        return callback;
    }

    CameraPlayerView.prototype.tagValueChanged = function (e) {
        var value = page.valueAsBool(e.value);
        this.setPlay(value);
    }



    //////////////////////////////////////////////////////////////////////////////// 
    // Init Camera Toolbar Button ID
    ////////////////////////////////////////////////////////////////////////////////
    CameraPlayerView.prototype.toolbarButtonID = function (type) {
        if (type == "play") return this.id + "-toolbar-play";
        else if (type == "pause") return this.id + "-toolbar-pause";
        else if (type == "stop") return this.id + "-toolbar-stop";
        else if (type == "ptzBtn") return this.id + "-toolbar-ptz";
        else return "";
    }

    //#region  CAMERA TOOLBAR    
    /////////////////////////////////////////////////
    // Init Camera Toolbar
    /////////////////////////////////////////////////
    CameraPlayerView.prototype.initToolbar = function () {
        var pToolbar = $("#" + this.id + "-toolbar");
        $(pToolbar).html("");

        var show = this.getControls();
        if (show == false) {
            $(pToolbar).removeClass("show");
            $(pToolbar).addClass("hide");
            return;
        }

        $(pToolbar).removeClass("hide");
        $(pToolbar).addClass("show");

        var play = this.toolbarButtonID("play");
        var pause = this.toolbarButtonID("pause");
        var stop = this.toolbarButtonID("stop");
        var ptzBtn = this.toolbarButtonID("ptzBtn");

        var buttonHtml = '';
        buttonHtml += '<a id="' + play + '" class="btn btn-default btn-sm padding-top-2 padding-bottom-2" title="Play"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></a> ';
        buttonHtml += '<a id="' + pause + '" class="btn btn-default btn-sm padding-top-2 padding-bottom-2" title="Pause"><span class="glyphicon glyphicon-pause" aria-hidden="true"></span></a> ';
        buttonHtml += '<a id="' + stop + '" class="btn btn-default btn-sm padding-top-2 padding-bottom-2" title="Stop"><span class="glyphicon glyphicon-stop" aria-hidden="true"></span></a> ';
        buttonHtml += '<a id="' + ptzBtn + '" class="btn btn-default btn-sm padding-top-2 padding-bottom-2" title="PTZ"><span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span></a> ';

        $(pToolbar).html(buttonHtml);

        var view = this;
        $("#" + play).click(function () {
            view.toolbarByPlay();
        });
        $("#" + pause).click(function () {
            view.toolbarByPlay();
        });
        $("#" + stop).click(function () {
            view.toolbarByStop();
        });
        $("#" + ptzBtn).click(function () {
            view.toolbarByPTZBtn();
        });
    }

    /////////////////////////////////////////////////
    //  Play button on toolbar
    /////////////////////////////////////////////////    
    CameraPlayerView.prototype.toolbarByPlay = function () {
        var isPlay = this.getIsPlaying();
        // this.setIsPlaying(!isPlay);

        var pPlay = $("#" + this.toolbarButtonID("play"));
        var pPause = $("#" + this.toolbarButtonID("pause"));
        if (isPlay == false) {
            pPlay.hide();
            pPause.show();
            this.play();
        } else {
            pPlay.show();
            pPause.hide();
            this.pause();
        }
    }

    /////////////////////////////////////////////////
    // Press Stop Button on Toolbar
    /////////////////////////////////////////////////
    CameraPlayerView.prototype.toolbarByStop = function () {
        this.stopCamera();

        var pPlay = $("#" + this.toolbarButtonID("play"));
        var pPause = $("#" + this.toolbarButtonID("pause"));
        pPlay.show();
        pPause.hide();
        this.pause();
    }

    /////////////////////////////////////////////////
    //  PTZ Button to show hide PTZ Panel
    /////////////////////////////////////////////////
    CameraPlayerView.prototype.toolbarByPTZBtn = function () {
        console.log("this.PTAvailable: " + this.PTAvailable);
        console.log("this.ZoomAvailable: " + this.ZoomAvailable);

        if (!this.EnablePTZ) return;
        if (!this.PTAvailable && !this.ZoomAvailable) return;

        if (!this.PTZPanelState) {
            document.getElementById(this.id + "-Sidepanel").style.width = this.PTZPanelWidth + "px";
            document.getElementById(this.id).style.width = (this.width - this.PTZPanelWidth) + "px";
            this.PTZPanelState = true;
        }
        else {
            document.getElementById(this.id + "-Sidepanel").style.width = "0px";
            document.getElementById(this.id).style.width = this.width + "px";
            this.PTZPanelState = false;
        }
    }
    //#endregion    


    //#region PTZ PANEL
    //////////////////////////////////////////////////////////////////////////////// 
    //                              Init PTZ Panel
    ////////////////////////////////////////////////////////////////////////////////
    var presetList = [];
    var currentPreset = null;

    /////////////////////////////////////////////////
    // Init PTZ Button ID
    /////////////////////////////////////////////////
    CameraPlayerView.prototype.ptzButtonID = function (type) {
        if (type == "zoomin") return this.id + "-ptz-zoomin";
        else if (type == "zoom") return this.id + "-ptz-zoom";
        else if (type == "zoomout") return this.id + "-ptz-zoomout";
        else if (type == "leftup") return this.id + "-ptz-leftup";
        else if (type == "up") return this.id + "-ptz-up";
        else if (type == "rightup") return this.id + "-ptz-rightup";
        else if (type == "left") return this.id + "-ptz-left";
        else if (type == "presettour") return this.id + "-ptz-presettour";
        else if (type == "right") return this.id + "-ptz-right";
        else if (type == "leftdown") return this.id + "-ptz-leftdown";
        else if (type == "down") return this.id + "-ptz-down";
        else if (type == "rightdown") return this.id + "-ptz-rightdown";
        else if (type == "addpreset") return this.id + "-ptz-addpreset";
        else if (type == "delpreset") return this.id + "-ptz-delpreset";
        else return "";
    }

    /////////////////////////////////////////////////
    // Init PTZ panel
    /////////////////////////////////////////////////
    CameraPlayerView.prototype.initPTZPanel = function () {

        // Setup Height Width and position for panel
        document.getElementById(this.id + "-Sidepanel").style.height = this.height + "px";
        document.getElementById(this.id + "-Sidepanel").style.left = (this.x + this.width - this.PTZPanelWidth) + "px";
        document.getElementById(this.id + "-Sidepanel").style.top = (this.y) + "px";

        // var pToolbar = $("#" + this.id + "-ptz");
        var pToolbar = $("#" + this.id + "-Sidepanel");
        $(pToolbar).html("");

        var show = this.EnablePTZ;
        if (show == false) {
            $(pToolbar).removeClass("show");
            $(pToolbar).addClass("hide");
            return;
        }

        $(pToolbar).removeClass("hide");
        $(pToolbar).addClass("show");

        var zoomin = this.ptzButtonID("zoomin");
        var zoom = this.ptzButtonID("zoom");
        var zoomout = this.ptzButtonID("zoomout");
        var leftup = this.ptzButtonID("leftup");
        var up = this.ptzButtonID("up");
        var rightup = this.ptzButtonID("rightup");
        var left = this.ptzButtonID("left");
        var presetour = this.ptzButtonID("presettour");
        var right = this.ptzButtonID("right");
        var leftdown = this.ptzButtonID("leftdown");
        var down = this.ptzButtonID("down");
        var rightdown = this.ptzButtonID("rightdown");
        var addPreset = this.ptzButtonID("addpreset");
        var delPreset = this.ptzButtonID("delpreset");

        var panelHtml = '';

        panelHtml += '<div class="ptzButton">';
        // PTZ Direction control button
        panelHtml += '<div style="float: left;">';
        panelHtml += '<div style="float: left; ">';
        panelHtml += '<a id="' + zoomout + '" class="btn" title="ZoomIn"><span class="glyphicon glyphicon-zoom-out" aria-hidden="true"></span></a> ';
        panelHtml += '</div>';
        panelHtml += '<div style="float:left">';
        panelHtml += '<a id="' + zoom + '" class="nonbtn" title="Zoom"><span class="glyphicon" aria-hidden="true" style="background-color: #F5F5F5;"></span></a> ';
        panelHtml += '</div>';
        panelHtml += '<div style="float: left;">';
        panelHtml += '<a id="' + zoomin + '" class="btn" title="ZoomOut"><span class="glyphicon glyphicon-zoom-in" aria-hidden="true"></span></a> ';
        panelHtml += '</div>';
        panelHtml += '</div>';

        panelHtml += '<div style="float:left">';
        panelHtml += '<div style="float:left">';
        panelHtml += '<a id="' + leftup + '" class="btn" title="LeftUp"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></a> ';
        panelHtml += '</div>';
        panelHtml += '<div style="float:left">';
        panelHtml += '<a id="' + up + '" class="btn" title="Up"><span class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span></a> ';
        panelHtml += '</div>';
        panelHtml += '<div style="float:left">';
        panelHtml += '<a id="' + rightup + '" class="btn" title="RightUp"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></a> ';
        panelHtml += '</div>';
        panelHtml += '</div>';

        panelHtml += '<div style="float:left">';
        panelHtml += '<div style="float:left">';
        panelHtml += '<a id="' + left + '" class="btn" title="Left"><span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span></a> ';
        panelHtml += '</div>';
        panelHtml += '<div style="float:left">';
        panelHtml += '<a id="' + presetour + '" class="btn" title="PrestTour"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></a> ';
        panelHtml += '</div>';
        panelHtml += '<div style="float:left">';
        panelHtml += '<a id="' + right + '" class="btn" title="Right"><span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span></a> ';
        panelHtml += '</div>';
        panelHtml += '</div>';

        panelHtml += '<div style="float:left">';
        panelHtml += '<div style="float:left">';
        panelHtml += '<a id="' + leftdown + '" class="btn" title="LeftDown"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></a> ';
        panelHtml += '</div>';
        panelHtml += '<div style="float:left">';
        panelHtml += '<a id="' + down + '" class="btn" title="Down"><span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span></a> ';
        panelHtml += '</div>';
        panelHtml += '<div style="float:left">';
        panelHtml += '<a id="' + rightdown + '" class="btn" title="RightDown"><span class="glyphicon glyphicon-play" aria-hidden="true"></span></a> ';
        panelHtml += '</div>';
        panelHtml += '</div>';
        panelHtml += '</div>';

        // Preset Lis
        // panelHtml += '<div style="border-style: solid; border-width: 2px; width: 170px; heigh: 60px; margin: 5px;">';
        panelHtml += '<div class="presetListArea ListView scroll order">';
        panelHtml += '<h4 style="text-align:center; background-color:transparent;"> PRESET LIST';
        panelHtml += '</h4>';
        panelHtml += '<div id="' + this.id + '_presetList" class="ptzpresetlist">';
        panelHtml += '<ul id="' + this.id + '_prestItemsList" data-role="listview" data-inset="true">';
        panelHtml += '</ul>';
        panelHtml += '</div>';
        panelHtml += '</div>';


        // Add and remove preset 
        // panelHtml += '<div style="width: 170px; heigh: 60px; padding-left: 15px;">';
        panelHtml += '<div class="presetadddelbutton">';
        panelHtml += '<div style="float:left">';
        panelHtml += '<a id="' + addPreset + '" class="btn" title="Add Preset"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a> ';
        panelHtml += '</div>';
        panelHtml += '<div style="float:left">';
        panelHtml += '<a id="insertPreset" class="nonbtn" title="Add Preset"><span class="glyphicon" aria-hidden="true"></span></a> ';
        panelHtml += '</div>';
        panelHtml += '<div style="float:left">';
        panelHtml += '<a id="' + delPreset + '" class="btn" title="Remove Preset"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a> ';
        panelHtml += '</div>';
        panelHtml += '</div>';
        // panelHtml += '</div>';
        // panelHtml += '</div>';

        panelHtml += '</div>';
        $(pToolbar).html(panelHtml);

        var view = this;
        // ZOOM
        $("#" + zoomin).mousedown(function () {
            view.ptzByZoomIn();
        });
        $("#" + zoomin).mouseup(function () {
            view.ptzUnPress();
        });
        $("#" + zoomout).mousedown(function () {
            view.ptzByZoomOut();
        });
        $("#" + zoomout).mouseup(function () {
            view.ptzUnPress();
        });
        // LEFT
        $("#" + left).mousedown(function () {
            view.ptzByLeft();
        });
        $("#" + left).mouseup(function () {
            view.ptzUnPress();
        });

        $("#" + leftup).mousedown(function () {
            view.ptzByLeftUp();
        });
        $("#" + leftup).mouseup(function () {
            view.ptzUnPress();
        });

        $("#" + leftdown).mousedown(function () {
            view.ptzByLeftDown();
        });
        $("#" + leftdown).mouseup(function () {
            view.ptzUnPress();
        });

        //RIGHT
        $("#" + right).mousedown(function () {
            view.ptzByRight();
        });
        $("#" + right).mouseup(function () {
            view.ptzUnPress();
        });

        $("#" + rightup).mousedown(function () {
            view.ptzByRightUp();
        });
        $("#" + rightup).mouseup(function () {
            view.ptzUnPress();
        });

        $("#" + rightdown).mousedown(function () {
            view.ptzByRightDown();
        });
        $("#" + rightdown).mouseup(function () {
            view.ptzUnPress();
        });

        // UP
        $("#" + up).mousedown(function () {
            view.ptzByUp();
        });
        $("#" + up).mouseup(function () {
            view.ptzUnPress();
        });
        // DOWN
        $("#" + down).mousedown(function () {
            view.ptzByDown();
        });
        $("#" + down).mouseup(function () {
            view.ptzUnPress();
        });

        // PRESET TOUR
        $("#" + presetour).mousedown(function () {
            view.ptzByPrestTour();
        });
        $("#" + presetour).mouseup(function () {
            view.ptzUnPress();
        });

        // Add a new Preset callback
        var addPresetButton = $("#" + addPreset);
        addPresetButton.click(function () {
            view.ptzByAddPreset();
        });

        // Delete Preset callback
        var delPresetButton = $("#" + delPreset);
        delPresetButton.click(function () {
            view.ptzByDelPreset();
        });

        //Click on preset
        var listviewseries = $("#" + this.id + "_presetList");
        listviewseries.click(function (event) {
            view.OnPresetClick(event);
        });

        //DoubleClick on preset in case of goto preset
        // var listviewseries = $("#" + this.id + "_presetList");
        listviewseries.dblclick(function (event) {
            view.OnDoubleClickPreset(event);
        });

        var presetlistview = document.getElementById(this.id + "_presetList");
        // PresetItem Mouse over event
        presetlistview.addEventListener("mouseover", function (event) {
            if (event.target.className == "presetitem") {
                event.target.style.color = "black";
                event.target.style.fontWeight = "bold";
            }
        }, false);

        // PresetItem mouse out event
        presetlistview.addEventListener("mouseout", function (event) {
            if (event.target.className == "presetitem") {
                event.target.style.color = "";
                event.target.style.fontWeight = "normal";
            }
        });
    }

    /////////////////////////////////////////////////
    // POST Command using Ajax
    /////////////////////////////////////////////////
    CameraPlayerView.prototype.postCommand = function (apiUrl, data, callback = null) {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            dataType: 'JSON',
            mode: 'no-cors',
            data: data,
            async: true,
            context: this,
            // crossDomain : true,
            // xhrFields: {
            //     withCredentials: true
            // },
            success: function (res) {
                if (callback == null) return;
                callback(this, res);
                return;

                if (res.code == 200) {
                    console.log(res.data);
                    callback(res.data);
                } else {
                    console.log('get view live data failed !! ' + res.message);
                    callback(null);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("Handle Error REQUEST for Camera !!!!!!!!");
            }
        });
    }

    /////////////////////////////////////////////////
    // POST Command using Fetch 
    /////////////////////////////////////////////////
    CameraPlayerView.prototype.postCommand2 = async function (data) {
        // Default options are marked with *
        const response = await fetch(this.PTZAPI, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            // mode: 'cors', // no-cors, *cors, same-origin
            mode: 'no-cors',
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            //   body: JSON.stringify(data) // body data type must match "Content-Type" header
            body: data // body data type must match "Content-Type" header
        })
            // var reseponsedata = await response.json();
            // console.log("response: ", reseponsedata);

            .then(response => {
                response.json();
                // console.log("response: ", response.json());
            })
            .then((resdata) => {
                console.log('Success:', resdata);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        return response.json(); // parses JSON response into native JavaScript objects
    }

    // Send UnPress command
    CameraPlayerView.prototype.ptzUnPress = function () {
        var command = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"ptz\", \"value\" : \"unpress\", \"pos\" : \"pos9\" }";
        this.postCommand(this.PTZAPI, command);
    }

    // Send Zoom In command
    CameraPlayerView.prototype.ptzByZoomIn = function () {
        var command = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"ptz\", \"value\" : \"zoomin\", \"pos\" : \"pos9\" }";
        this.postCommand(this.PTZAPI, command);
    }

    // Send Zoom Out command
    CameraPlayerView.prototype.ptzByZoomOut = function () {
        var command = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"ptz\", \"value\" : \"zoomout\", \"pos\" : \"pos9\" }";
        this.postCommand(this.PTZAPI, command);
    }

    // Send Pan Left command
    CameraPlayerView.prototype.ptzByLeft = function () {
        var command = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"ptz\", \"value\" : \"left\", \"pos\" : \"pos9\" }";
        this.postCommand(this.PTZAPI, command);
    }

    // Send Pan Left Up command
    CameraPlayerView.prototype.ptzByLeftUp = function () {
        var command = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"ptz\", \"value\" : \"leftup\", \"pos\" : \"pos9\" }";
        this.postCommand(this.PTZAPI, command);
    }

    // Send Pan Left Down command
    CameraPlayerView.prototype.ptzByLeftDown = function () {
        var command = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"ptz\", \"value\" : \"leftdown\", \"pos\" : \"pos9\" }";
        this.postCommand(this.PTZAPI, command);
    }

    // Send Pan Right command
    CameraPlayerView.prototype.ptzByRight = function () {
        var command = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"ptz\", \"value\" : \"right\", \"pos\" : \"pos9\" }";
        this.postCommand(this.PTZAPI, command);
    }

    // Send Pan Right Up command
    CameraPlayerView.prototype.ptzByRightUp = function () {
        var command = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"ptz\", \"value\" : \"rightup\", \"pos\" : \"pos9\" }";
        this.postCommand(this.PTZAPI, command);
    }

    // Send Pan Right Down command
    CameraPlayerView.prototype.ptzByRightDown = function () {
        var command = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"ptz\", \"value\" : \"rightdown\", \"pos\" : \"pos9\" }";
        this.postCommand(this.PTZAPI, command);
    }

    // Send Tilt Up command
    CameraPlayerView.prototype.ptzByUp = function () {
        var command = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"ptz\", \"value\" : \"top\", \"pos\" : \"pos9\" }";
        this.postCommand(this.PTZAPI, command);
    }

    // Send Tilt Down command
    CameraPlayerView.prototype.ptzByDown = function () {
        var command = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"ptz\", \"value\" : \"down\", \"pos\" : \"pos9\" }";
        this.postCommand(this.PTZAPI, command);
    }

    // Send preset tour command
    CameraPlayerView.prototype.ptzByPrestTour = function () {
        var command = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"ptz\", \"value\" : \"presettour\", \"pos\" : \"pos9\" }";
        this.postCommand(this.PTZAPI, command);
    }

    ///////////////////////////////////////////////// PRESET /////////////////////////////////////////////////

    /////////////////////////////////////////////////
    // Get information of Preset List from server
    /////////////////////////////////////////////////    
    CameraPlayerView.prototype.ptzByGetPreset = function () {

        var ProcessGetPreset = function (view, resdata) {
            var keys = Object.keys(resdata);

            keys.forEach(element => {
                var item = resdata[element];

                var posname = item['name'];
                var postoken = item['token'];

                if (posname == "" || postoken == "") {
                    window.alert("Response from server contain a null value: Preset Name: " + posname + " Preset Token: " + postoken);
                    return;
                }

                var listitems = $("#" + view.id + "_prestItemsList");
                var item = '<li id="' + 'preset' + posname + '" class="presetitem">' + posname + "</li>";
                listitems.append(item);

                var presetitem = { name: posname, token: postoken };
                presetList.push(presetitem);
            });

            currentPreset = presetList[presetList.length - 1];
            view.UpdatePresetList();
        };


        var data = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"preset\", \"value\" : \"getpreset\", \"pos\" : \"\" }";

        this.postCommand(this.PTZAPI, data, ProcessGetPreset);
    }

    /////////////////////////////////////////////////
    // Add a new preset
    /////////////////////////////////////////////////    
    CameraPlayerView.prototype.ptzByAddPreset = function () {
        var presetname = prompt("Please enter preset name", "Pos");
        if (presetname != null) {

            // Verify the input name. Check the name is available in the list or not.
            var presetname = presetname.replace(/[^a-zA-Z0-9]/g, "").replace(' ', '');

            if (presetList.length > 0) {
                const cond = document.getElementById('preset' + presetname) || false;
                if (cond) {
                    window.alert("The input name is existed!!!");
                    return;
                }
            }

            var data = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"preset\", \"value\" : \"setpreset\", \"pos\" : \"" + presetname + "\" }";

            var ProcessAddPreset = function (view, resdata) {
                var posname = resdata['name'];
                var postoken = resdata['token'];

                if (posname == "" || postoken == "") {
                    window.alert("Response from server contain a null value: Preset Name: " + posname + " Preset Token: " + postoken);
                    return;
                }

                var listitems = $("#" + view.id + "_prestItemsList");
                var item = '<li id="' + 'preset' + posname + '" class="presetitem">' + posname + "</li>";
                listitems.append(item);

                var presetitem = { name: posname, token: postoken };
                presetList.push(presetitem);

                currentPreset = presetList[presetList.length - 1];

                view.UpdatePresetList();
            }

            this.postCommand(this.PTZAPI, data, ProcessAddPreset);
        }
    }

    /////////////////////////////////////////////////
    // Remove an exist preset
    /////////////////////////////////////////////////    
    CameraPlayerView.prototype.ptzByDelPreset = function () {
        // console.log("Dell currentPreset: ", currentPreset);
        var ProcessDeletePreset = function (view, resdata) {
            // console.log("Delete Series button click");
            var listitems = document.getElementsByClassName("presetitem");
            var length = presetList.length;
            var ulElem = document.getElementById(view.id + '_prestItemsList');
            for (var i = 0; i < length; i++) {
                var li = listitems[i];
                if (li.textContent == currentPreset.name) {
                    // remove item on PresetListView
                    ulElem.removeChild(li);

                    // remove item in presetList                
                    var idx = presetList.indexOf(currentPreset);
                    presetList.splice(idx, 1);
                    if (presetList.length > 0) {
                        if (presetList.length > idx) {
                            currentPreset = presetList[idx];
                        }
                        else {
                            currentPreset = presetList[idx - 1];
                        }
                    }
                    else {
                        currentPreset = null;
                    }

                    view.UpdatePresetList();
                    return;
                }
            }
        };

        var command = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"preset\", \"value\" : \"delpreset\", \"pos\" : \"" + currentPreset.token + "\" }";
        this.postCommand(this.PTZAPI, command, ProcessDeletePreset);
    }

    /////////////////////////////////////////////////
    // Goto a preset position
    /////////////////////////////////////////////////    
    CameraPlayerView.prototype.ptzByGotoPreset = function () {
        // console.log("Goto preset !!!");
        // console.log("GOTO currentPreset: ", currentPreset);                    
        var command = "{ \"id\": \"" + this.cameraID + "\", \"command\" : \"preset\", \"value\" : \"gotopreset\", \"pos\" : \"" + currentPreset.token + "\" }";

        this.postCommand(this.PTZAPI, command, null);
    }

    /////////////////////////////////////////////////
    // Click on Preset to select preset
    /////////////////////////////////////////////////    
    CameraPlayerView.prototype.OnPresetClick = function (event) {
        var view = this;
        if (event.target.className == "presetitem") {
            if (presetList.length == 0) return;

            for (var i = 0; i < presetList.length; i++) {
                var val = presetList[i];
                if (val.name == event.target.textContent) {
                    currentPreset = val;
                    break;
                }
            }
            view.UpdatePresetList();
        }
    }

    /////////////////////////////////////////////////
    // DoubleClick on Preset to Goto preset
    /////////////////////////////////////////////////    
    CameraPlayerView.prototype.OnDoubleClickPreset = function (event) {
        var view = this;
        if (event.target.className == "presetitem") {
            if (presetList.length == 0) return;

            for (var i = 0; i < presetList.length; i++) {
                var val = presetList[i];
                if (val.name == event.target.textContent) {
                    currentPreset = val;
                    this.ptzByGotoPreset();
                    break;
                }
            }
            view.UpdatePresetList();
        }
    }

    /////////////////////////////////////////////////
    // Update background color for current Preset 
    /////////////////////////////////////////////////
    CameraPlayerView.prototype.UpdatePresetList = function () {

        if (currentPreset == null) return;

        // set BackgroundColor for all preset item in Preset List View
        var itemlist = document.getElementById(this.id + '_prestItemsList').getElementsByClassName("presetitem");
        for (var i = 0; i < itemlist.length; i++) {
            var li = itemlist[i];
            if (li.textContent == currentPreset.name) {
                var newLocal = "#c0dbfa"; //#c0d1cf
                // set backgroundcolor for selected preset  
                li.style.backgroundColor = newLocal;
            }
            else {
                // clear backgroundcolor for selected preset
                li.style.backgroundColor = "";
            }
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //#endregion    


    /////////////////////////////////////////////////
    // Get all information of server
    /////////////////////////////////////////////////
    CameraPlayerView.prototype.GetServerInformation = function () {
        var ProcssServerInformation = function (view, resData) {
            // print out server information
            // console.log(resData);
        }

        var command = "{ \"command\" : \"serverinfo\", \"value\" : \"\"}";
        this.postCommand(this.InfoAPI, command, ProcssServerInformation);
    }

    /////////////////////////////////////////////////
    // Process camera information callback
    /////////////////////////////////////////////////
    CameraPlayerView.prototype.ProcssCameraInformation = function (view, resData) {
        // Process Information
        view.PTAvailable = resData.ptavailable;
        view.ZoomAvailable = resData.zoomavailable;

        // view.PTZAPI = resData.ptzurl;
        view.PTZPort = resData.ptzport;
        view.PTZAPI = "http://" + view.websocketServerIP + ":" + view.PTZPort + "/ptz";

        // Update preset list
        view.ptzByGetPreset();

        // Show ptz panel if Pan Tilt and Zoom is available
        view.toolbarByPTZBtn();
    }

    /////////////////////////////////////////////////
    // Get information of a camera
    /////////////////////////////////////////////////
    CameraPlayerView.prototype.GetCameraInformation = function (CamID) {
        if (!this.EnablePTZ) return;
        var command = "{ \"command\" : \"camerainfo\", \"value\" : \"" + CamID + "\"}";
        this.postCommand(this.InfoAPI, command, this.ProcssCameraInformation);
    }


    page.createCameraPlayer = function (arg) {
        var view = new CameraPlayerView(arg);

        // Update camera information
        view.GetCameraInformation(arg.cameraID);

        // Init toolbar
        view.initToolbar();

        // Init Panel
        view.initPTZPanel();

        if (arg.tag != "") {
            var tag = scada.getTagByName(arg.tag);
            view.tag = tag;
            tag.addEventListener("change", function (event) {
                view.tagValueChanged(event);
            });
            view.setAutoPlay(false);
            view.setPlay(false);
        }
        if (view.autoPlay) {
            // view.play();
            view.toolbarByPlay();
        }

        page.protoViews[arg.id] = view;
        return view;
    }
})();