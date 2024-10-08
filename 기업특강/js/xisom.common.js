var DEBUG = function (_) { window.console && console.log(_); };
var $HashMap = function () {
    /*
    var map = new $HashMap();
    map.put("key", "value");
    map.get("key");
    map.length; 길이 반환
    map.keys(); 모든 키 객체반환
    map.values(); 모든 값 객체반환 
    map.toQuaryString([option]); key = value[option] 문자열반환 
    map.clear(); 초기화
    map.next(); 다음 객체 반환
    map.indexValue(index); 위치로 값 찾기
    map.splice(key); key 삭제
    map.point(key); key 의 위치반환
    */

    this.obj = [];
    this.length = 0;

    this.put = function (key, value) {
        if (this.obj[key] == null) this.length++;
        this.obj[key] = value;
    };

    this.get = function (key) {
        return this.obj[key];
    };

    this.keys = function () {
        var keys = [];
        for (var property in this.obj) keys.push(property);
        return keys;
    };

    this.values = function () {
        var values = [];
        for (var property in this.obj) values.push(this.obj[property]);
        return values;
    };

    this.toQueryString = function (divMark) {
        var divMark = (typeof divMark == "undefined") ? "&" : divMark;
        var quaryString = "";
        var key = this.keys();
        var value = this.values();
        if (this.length < 1) return "";

        for (var i = 0; i < this.length; i++) {
            if (quaryString != "")
                quaryString += divMark;
            quaryString += key[i] + "=" + value[i];
        }
        return quaryString;
    };

    this.remove = function (index) {
        var keys = this.keys();
        keys.splice(index, 1);
        var temp = [];
        for (var i = 0; i < keys.length; i++) {
            temp[keys[i]] = this.obj[keys[i]];
        }
        this.obj = temp;
        this.length = keys.length;
        index--;
    };

    this.indexOf = function (key) {
        var cnt = 0;
        for (var i in this.obj) {
            if (key == i) return cnt;
            cnt++;
        }
    };

    this.splice = function (spliceIndex) {
        var keys = this.keys();
        keys.splice(spliceIndex, 1);
        var temp = [];
        for (var i = 0; i < keys.length; i++) {
            temp[keys[i]] = this.obj[keys[i]];
        }
        this.obj = temp;
        this.length = keys.length;
        index--;
    };


    this.point = function (key) {
        var cnt = 0;
        for (var i in this.obj) {
            if (key == i) return cnt;
            cnt++;
        }
    };

    this.clear = function () {
        this.obj = [];
        this.length = 0;
    };

    var index = 0;
    this.next = function () {
        if (index == this.length) {
            index = 0;
            return -1;
        }
        var values = this.values();
        var currentValue = values[index];
        index++;
        return currentValue;
    };

    this.indexValue = function (Idx) {
        var keys = this.keys();
        return this.obj[keys[Idx]];
    };
};
var $Common = {
    getMeta: function (name) {
        return document.getElementsByTagName('meta')[name].getAttribute('content');
    },
    getUrl: function () {
        var location = window.location;
        var pathname = location.pathname.replace("\/", "").replace("#", "");
        var item = {
            href: location.href, //http://localhost/alarm.html
            hostname: location.hostname, //localhost
            pathfullname: pathname, //alarm.html
            pathname: pathname.split('.').shift().split(/\#|\?/)[0], //alarm
            pathext: pathname.split('.').pop().split(/\#|\?/)[0], //html
            protocol: location.protocol, //http:
            param: this.getUrlParam()
        }
        return item;
    },
    getUrlParam: function () {
        var params = {};
        window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) { params[decodeURIComponent(key)] = decodeURIComponent(value); });
        return params;
    },
    detectIE: function () {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }
        return false;
    },
    detectLanguage: function () {
        var lang = "un"; //un은 undefined 의 앞 2글자.
        if (navigator.language != null) {
            //크롬/파폭
            lang = navigator.language;
        } else if (navigator.userLanguage != null) {
            //IE
            lang = navigator.userLanguage;
        } else if (navigator.systemLanguage != null) {
            lang = navigator.systemLanguage;
        } else { //이도저도 아니면
            lang = "un";
        }

        lang = lang.toLowerCase();
        lang = lang.substring(0, 2);//ko,cn,zh
        return lang;
    },
    detectMobile: function () {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    },
    convertToCSV: function (objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    },
    exportCSV: function (headers, items, filename) {
        if (headers) {
            items.unshift(headers);
        }
        var jsonObject = JSON.stringify(items);
        var csv = this.convertToCSV(jsonObject);
        var exportedFilenmae = filename || 'export.csv';
        var blob = new Blob(["\ufeff", csv], {
            type: 'text/csv;charset=utf-8;'
        });
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, exportedFilenmae);
        } else {
            this.SaveBlob(blob, exportedFilenmae);
        }
    },
    SaveBlob: function (blob, filename) {
        var link = document.createElement("a");
        if (link.download !== undefined) {
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },
    openCenter: function (url, target, features) {
        var featureTokens = features == null ? "" : features.split(",");
        var w = 0;
        var h = 0;
        for (var i = 0; i < featureTokens.length; i++) {
            if (featureTokens[i].indexOf("width") != -1) {
                w = Number(featureTokens[i].substring(featureTokens[i].indexOf('=') + 1));
            }
            if (featureTokens[i].indexOf("height") != -1) {
                h = Number(featureTokens[i].substring(featureTokens[i].indexOf('=') + 1));
            }
        }

        // Fixes dual-screen position                             Most browsers      Firefox
        var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
        var dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        //var systemZoom = width / window.screen.availWidth;
        var left = (width - w) / 2 + dualScreenLeft;
        var top = (height - h) / 2 + dualScreenTop;

        var newTokens = [];
        newTokens.push("width=" + w);
        newTokens.push("height=" + (h + 1));
        newTokens.push("top=" + top);
        newTokens.push("left=" + left);
        for (var i = 0; i < featureTokens.length; i++) {
            if (featureTokens[i].indexOf("centerparent") != -1) continue;
            if (featureTokens[i].indexOf("width") != -1) continue;
            if (featureTokens[i].indexOf("height") != -1) continue;
            if (featureTokens[i].indexOf("top") != -1) continue;
            if (featureTokens[i].indexOf("left") != -1) continue;
            newTokens.push(featureTokens[i]);
        }
        var newWindow = window.open(url, target, newTokens.join(","));
        if (window.focus) newWindow.focus();
    },
    SHA256: function (s) {

        var chrsz = 8;
        var hexcase = 0;

        function safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        function S(X, n) { return (X >>> n) | (X << (32 - n)); }
        function R(X, n) { return (X >>> n); }
        function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
        function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
        function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
        function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
        function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
        function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

        function core_sha256(m, l) {

            var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1,
                0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
                0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786,
                0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
                0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147,
                0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
                0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B,
                0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
                0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A,
                0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
                0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);

            var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);

            var W = new Array(64);
            var a, b, c, d, e, f, g, h, i, j;
            var T1, T2;

            m[l >> 5] |= 0x80 << (24 - l % 32);
            m[((l + 64 >> 9) << 4) + 15] = l;

            for (var i = 0; i < m.length; i += 16) {
                a = HASH[0];
                b = HASH[1];
                c = HASH[2];
                d = HASH[3];
                e = HASH[4];
                f = HASH[5];
                g = HASH[6];
                h = HASH[7];

                for (var j = 0; j < 64; j++) {
                    if (j < 16) W[j] = m[j + i];
                    else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

                    T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                    T2 = safe_add(Sigma0256(a), Maj(a, b, c));

                    h = g;
                    g = f;
                    f = e;
                    e = safe_add(d, T1);
                    d = c;
                    c = b;
                    b = a;
                    a = safe_add(T1, T2);
                }

                HASH[0] = safe_add(a, HASH[0]);
                HASH[1] = safe_add(b, HASH[1]);
                HASH[2] = safe_add(c, HASH[2]);
                HASH[3] = safe_add(d, HASH[3]);
                HASH[4] = safe_add(e, HASH[4]);
                HASH[5] = safe_add(f, HASH[5]);
                HASH[6] = safe_add(g, HASH[6]);
                HASH[7] = safe_add(h, HASH[7]);
            }
            return HASH;
        }

        function str2binb(str) {
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < str.length * chrsz; i += chrsz) {
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
            }
            return bin;
        }

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        }

        function binb2hex(binarray) {
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                    hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
            }
            return str;
        }

        s = Utf8Encode(s);
        return binb2hex(core_sha256(str2binb(s), s.length * chrsz)).toUpperCase();

    },
    getTextFormatFromText : function (str) {
        if (!str || !str.trim()) {
            return null;
        }

        try {
            format = {category: "", decimals: 0, unit: "", format: "" };
            var tokens = str.split(',');
            for (var i = 0; i < tokens.length; i++) {
                tokens[i] = tokens[i].trim();
            }

            format.category = tokens[0];
            switch (format.category) {
                case "Number":
                case "Currency":
                    if (tokens.length == 1) {
                        return format;

                    } else if (tokens.length == 2) {
                        format.decimals = Number([1]);
                        return format;

                    } else {
                        format.decimals = Number(tokens[1]);
                        if (tokens[2].startsWith("'") && tokens[2].endsWith("'")) {
                            format.unit = tokens[2].substr(1, tokens[2].length - 2);
                        } else {
                            format.unit = tokens[2];
                        }
                        return format;
                    }

                case "Percentage":
                case "Scientific":
                    format.decimals = Number(tokens[1]);
                    return format;

                case "DateTime":
                    format.format = tokens[1];
                    return format;

                case "Custom":
                    if (tokens.length == 2) {
                        format.format = tokens[1];
                    } else {
                        format.format = tokens[1];
                        format.unit = tokens[2];
                    }
                    return format;

                default:
                    return null;
            }
        } catch {
            return null;;
        }
    }    
}

Date.prototype.format = function (f) {
	if (!this.valueOf()) return " ";
	var weekName;
	var am;
	var pm;

	if (navigator.language == "ko") {
		weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
		ap = "오전";
		pm = "오후";
	} else if (navigator.language == "ja") {
		weekName = ["日", "月", "火", "水", "首", "金", "土"];
		ap = "午前";
		pm = "午後";
	} else if (navigator.language == "zh") {
		weekName = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
		ap = "上午";
		pm = "下午";
	} else if (navigator.language == "vi") {
		weekName = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ Bảy"];
		ap = "Sáng";
		pm = "Chiều";
	} else {
		weekName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		ap = "AM";
		pm = "PM";
	}
    var d = this;
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|fff|a\/p)/gi, function ($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "YYYY": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "YY": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "DD": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
			case "fff": return d.getMilliseconds().zf(3);
            case "a/p": return d.getHours() < 12 ? am : pm;
            default: return $1;
        }
    });
};

String.prototype.string = function (len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
Number.prototype.zf = function (len) { return this.toString().zf(len); };
String.prototype.repeat = function (num) { return new Array(num + 1).join(this); }
String.Format = function (fmt, ...args) {
    if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
        throw new Error('invalid format string.');
    }
    return fmt.replace(/((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g, (m, str, index) => {
        if (str) {
            return str.replace(/(?:{{)|(?:}})/g, m => m[0]);
        } else {
            if (index >= args.length) {
                throw new Error('argument index is out of range in format');
            }
            return args[index];
        }
    });
}