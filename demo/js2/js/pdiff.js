(function($) {
    $.widget('my.pdiff', {
        _create: function() {
            var self = this;
            
            this.form  = this.element.find('.controls');
            this.view  = this.element.find('.result');
            if (!this.view.length) {
                this.view = $('<div class="result">').appendTo(this.element);
            }
            
            this.form.on('submit', function() {
                self._showResults();
                return false;
            });
            
        },
        _showResults: function() {
            // очистить
            this.view.empty();
            // показать
            var self = this,
                leftQuery = this.form.find(':input[name="left[query]"]').val(),
                rightQuery = this.form.find(':input[name="right[query]"]').val(),
                cmp = this._getCmp(
                    HttpParams.fromQuery(leftQuery).toArray(),
                    HttpParams.fromQuery(rightQuery).toArray()
                ),
                filtered = [];
            
            filtered = $.map(cmp, function (value, name) {
                var rightUndefined = value.right === undefined;
                if ((value.left === undefined ? !rightUndefined : rightUndefined) || value.left !== value.right) {
                    return { name: name, value: value };
                }
            });
            
            if (filtered.length) {
                var $table = $('<table>')
                    .append($('<tr>')
                        .append($('<th>', { text: 'name' }))
                        .append($('<th>', { text: 'left' }))
                        .append($('<th>', { text: 'right' }))
                    )
                    .appendTo(this.view);
                
                $.each(filtered, function (i, data) {
                    
                    var $tr = $('<tr>', { 'class': 'param' })
                            .append($('<td>', { 'class': 'name', text: data.name }));
                    
                    $.each(['left', 'right'], function () {
                        var props = { 'class': 'value' },
                            text = data.value[this],
                            wrapText = false;
                        
                        
                        if (text === undefined) {
                            props['class'] += ' undefined';
                            text = '[отстутствует]';
                        }
                        else if (text === "") {
                            props['class'] += ' empty';
                            text = '[пустая строка]';
                        }
                        else {
                            wrapText = true;
                        }
                        
                        var $td = $('<td>', props);
                        if (wrapText) {
                            $td.append($('<pre>', { 'class': 'pre', text: text }));
                        }
                        else {
                            $td.text(text);
                        }
                        
                        $td.appendTo($tr);
                    });
                    
                    $tr.appendTo($table);
                });
            }
        },
        _getCmp: function (left, right) {
            var cmp = {},
                appendToCmp = function (a, isLeft) {
                    for (var i = 0; i < a.length; i++) {
                        var pair = a[i],
                            key = isLeft ? 'left' : 'right';

                        if (!('name' in pair) && !('value' in pair)) {
                            continue;
                        }

                        if (!Object.prototype.hasOwnProperty.call(cmp, pair.name)) {
                            cmp[pair.name] = { left: undefined, right: undefined };
                        }
                        cmp[pair.name][key] = pair.value;
                    }
                };
            
            appendToCmp(left, true);
            appendToCmp(right, false);

            return cmp;
        }
    });
})(jQuery);
