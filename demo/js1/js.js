function parseQuery(query) {
    var parts = query.split('&'),
        map = {},
        data = {},
        getRealKeys = function (keys, map) {
            if (keys[0] === '') {
                return null;
            }
            var realKeys = [];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                // empty key
                if (key === '') {
                    key = map[key]++;
                }
                else if (i && /^(0|[1-9]\d*)$/.test(key) && key >= map['']) {
                    map[''] = +key + 1;
                }
                if (!Object.prototype.hasOwnProperty.call(map, key) || i == keys.length - 1) {
                    map[key] = {"": 0};
                }
                map = map[key];
                realKeys.push(key + '');
            }
            return realKeys;
        },
        appendValue = function (obj, keys, value) {
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (i < keys.length - 1) {
                    if (
                        !Object.prototype.hasOwnProperty.call(obj, key)
                        || Object.prototype.toString.call(obj[key]) !== '[object Object]'
                    ) {
                        obj[key] = {};
                    }
                    obj = obj[key];
                }
                else {
                    obj[key] = value;
                }
            }
        };
        
    for (var i = 0; i < parts.length; i++) {
        var matches = parts[i].match(/^([^=]+)(=(.*))?$/);
        if (matches) {
            var raw = {name: decodeURIComponent(matches[1]), value: decodeURIComponent(matches[3] || '')};
            var keys = raw.name.match(/^[^[]+/);
            if (keys) {
                var index = keys[0].length;
                var re = /(?:\[)([^\]]*)(?=\])/g;
                while ((matches = re.exec(raw.name)) !== null && matches.index == index) {
                    keys.push(matches[1]);
                    index += matches[1].length + 2;
                }
                keys = getRealKeys(keys, map);
                if (keys) {
                    appendValue(data, keys, raw.value);
                }
            }
        }
    }
    return data;
}


