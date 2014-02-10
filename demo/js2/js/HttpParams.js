function HttpParams(obj) {

    var params = {},
        pairs = [];
    
    function reset() {
        params = {};
        pairs = [];
    }
    
    function getType(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1);
    }
    
    function isset(key, obj) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }
    
    this.fromQuery = function (query) {
    
        reset();
        
        var parts = query.split('&'),
            map = {},
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
                    if (!isset(key, map) || i == keys.length - 1) {
                        map[key] = { "": 0 };
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
                        if (!isset(key, obj) || getType(obj[key]) !== 'Object') {
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
                        appendValue(params, keys, raw.value);
                    }
                }
            }
        }
        return this;
    };
    
    this.fromObject = function (obj) {
        reset();
        
        
    };
    
    this.toString = function () {
        var pairs = this.toArray(),
            strings = [];
        for (var i = 0; i < pairs.length; ++i) {
            strings.push(encodeURIComponent(pairs[i].name) + '=' + encodeURIComponent(pairs[i].value));
        }
        return strings.join('&');
    };
    
    this.toArray = function () {
        if (!pairs.length) {
            pairs = getPairs(params);
        }
        return pairs;
    }
    
    function getPairs(obj) {
    
        var self = this,
            callee = arguments.callee,
            keys = arguments[1] || [],
            type = getType(obj),
            iterators = {
                'Array': function(obj, fn) {
                    for (var i = 0; i < obj.length; i++) {
                        fn.call(self, i, obj);
                    }
                },
                'Object': function(obj, fn) {
                    for (var i in obj) {
                        fn.call(self, i, obj);
                    }
                }
            };
        if (type in iterators) {
            var pairs = [];
            iterators[type](obj, function(i, obj) {
                if (!isset(i, obj)) {
                    return;
                }
                var pair = callee(obj[i], keys.concat(i));
                if (pair) {
                    pairs = pairs.concat(pair);
                }
            });
            return pairs;
        }
        else if (type == 'Function') {
            // Можно что-нибудь сделать с функциями
        }
        else if (keys.length) {
            var expr = keys[0];
            if (keys.length > 1) {
                expr += '[' + keys.slice(1).join('][') + ']';
            }
            return { name: expr, value: obj };
        }
        return null;
    };
    
    this.toObject = function () {
        return params;
    };
}

HttpParams.fromQuery = function (query) {
    return (new HttpParams).fromQuery(query);
};


