function getUrl(url, obj) {

    var self = this,
        callee = arguments.callee,
        keys = arguments[2] || [],
        type = Object.prototype.toString.call(obj).slice(8, -1),
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
            if (!Object.prototype.hasOwnProperty.call(obj, i)) {
                return;
            }
            var query = callee(null, obj[i], keys.concat(i));
            if (query !== '') {
                pairs.push(query);
            }
        });
        
        if (url !== null) {
            var parts = url.match(/^([^?#]+)?(\?[^#]*)?(#.*)?$/);
            parts[2] = parts[2] !== undefined ? parts[2] + '&' + pairs.join('&') : '?' + pairs.join('&');
            return parts.slice(1).join('');
        }
        return pairs.join('&');
    }
    else if (type == 'Function') {
        // Можно что-нибудь сделать с функциями
    }
    else if (keys.length) {
        var expr = keys[0];
        if (keys.length > 1) {
            expr += '[' + keys.slice(1).join('][') + ']';
        }
        return encodeURIComponent(expr) + '=' + encodeURIComponent(obj);
    }
    return '';
};

