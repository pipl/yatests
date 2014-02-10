(function($) {
    $.widget('my.pslider', {
        options: {
            url: 'data',
            contents: 'contents.xml'
        },
        _create: function () {
            this._load(this.element.toggleClass('inactive', true).data('name'));
        },
        _load: function (name) {
            
            this.data = {};
            this.data.location = this.options.url + '/' + name + '/';
            
            $.ajax(this.data.location + this.options.contents, {
                context: this,
                success: function (data, status, xhr) {
                    var self = this;
                    this.data.presentation = $(data).find('presentation[title][cover]:has(slide[image])');
                    this.viewport = this._initViewport();
                    if (this.data.presentation.length) {
                        var promise = this.viewport.toggleSlide(this.data.location + this.data.presentation.attr('cover'));
                        $.when(promise).done(function () {
                            // установить стартовое состояние
                            self.viewport.mask(
                                $('<div>', {
                                    'class': 'control start',
                                    click: $.proxy(self._activate, self)
                                })
                            );
                        }).fail(function () {
                            self.viewport.alert('Не удалось загрузить обложку презентации');
                        });
                    }
                    else {
                        this.viewport.alert('Битые данные презентации');
                    }
                }
            });
        },
        _activate: function () {
            
            this.viewport.setLoading();
            
            // progressbar
            this.progress = $('<div class="progress">').appendTo(
                this.element.append(
                    $('<div class="back">')
                )
            );
            this._setProgress(0);
            // bbar
            this.element.append(
                $('<div class="bbar">').append(
                    $('<div class="control fullscreen">')
                )
                .append(
                    $('<div class="control menu">')
                )
            );
            // frame
            this.frame = $('<div class="frame">').append($('<ol class="tube">')).appendTo(this.element)
            
            $.when(this._initFrame()).done($.proxy(function () {
                this._initControls();
                this.element.toggleClass('inactive', false);
                this.viewport.unmask();
            }, this));
        },
        _initFrame: function () {
            
            var self = this,
                $tube = $('.tube', this.frame),
                dd = [],
                brokenImgSrc = 'css/images/broken.png',
                $slides = this.data.presentation.find('slide'),
                slidesLoaded = 0;
                
            this.data.slidesTotal = $slides.length;
            
            // наполнить фрейм картинками картинками
            this.data.presentation.find('slide').each(function (k, slide) {
                var d = $.Deferred();
                $tube.append(
                    $('<li>').append(
                        $('<div class="inner">')
                        .append(
                            $('<img>', {
                                src: self.data.location +  $(this).attr('image') + '?w=40',
                                load: d.resolve,
                                error: function () {
                                    if ($(this).attr('src') === brokenImgSrc) {
                                        d.reject();
                                    }
                                    else {
                                        $(this).attr('src', brokenImgSrc).closest('li').toggleClass('broken', true);
                                    }
                                }
                            })
                        )
                        .append(
                            $('<div>', { "class": 'title', text: $(this).text() })
                        )
                    )
                    .data('slide', slide)
                );
                dd.push(d.done(function () {
                    self._setProgress(++slidesLoaded / self.data.slidesTotal);
                }));
            });
            
            var promise = $.when.apply($, dd).fail(function () {
                self.viewport.alert('Просмотр невозможен. <br> Не удалось загрузить большую часть слайдов.');
            });
            
            this.data.frameHeight = this.frame.outerHeight();
            
            // Detect if not touch device
            if (!('ontouchstart' in document)) {
            
                var offsetY = this.frame.offset().top;
                
                // Remove scrollbars
                this.frame.css({overflow: 'hidden'});
                
                /* Скроллинг при нажатой мышке
                this.frame.on('mousedown', 'img', false);
                
                this.frame.on('mousemove', function (e) {
                    if (e.buttons != 1) return;
                    var margin = 30,
                        y = e.pageY - self.frame.offset().top - margin,
                        h = self.data.frameHeight - margin * 2,
                        top = y * ($tube.height() - h) / h;
                    
                    $(this).scrollTop(top);
                });
                */
                this.frame.on('mousemove', function (e) {
                    var margin = 30,
                        y = e.pageY - self.frame.offset().top - margin,
                        h = self.data.frameHeight - margin * 2,
                        top = y * ($tube.height() - h) / h;
                    
                    $(this).scrollTop(top);
                });
            }
            
            return promise;
        },
        _initControls: function () {
            
            var self = this;
            this.controls = $('.bbar .control', this.element);
            
            // fullscreen
            if (typeof document.fullscreenEnabled !== 'undefined') {
                
                $(document).on('fullscreenchange', function () {
                    var q = self;
                    self.element.toggleClass('fullscreen', document.fullscreenElement);
                    // fix bad height detection after change fullscreen
                    setTimeout(function () {
                        q.data.frameHeight = q.frame.outerHeight();
                    }, 1000);
                });
            
                this.controls.filter('.fullscreen').on('click', function() {
                    // Toggle fullscreen
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        self.element.get(0).requestFullscreen();
                    }
                });
            }
            else {
                this.controls.filter('.fullscreen').hide();
            }
            
            // menu
            this.controls.filter('.menu').on('click', function() {
                if (!self.frame.is(':visible')) {
                    self.frame.toggleClass('expanded', false).show();
                }
                else if (self.frame.is('.expanded')) {
                    self.frame.toggleClass('expanded', false).hide();
                }
                else {
                    self.frame.toggleClass('expanded', true);
                }
            });
            
            // 
            this.frame.find('li').on('click', function () {
                var d = self.viewport.toggleSlide(self.data.location + $($(this).data('slide')).attr('image'));
                d.done($.proxy(self._onSlideChange, self, [this]));
            });
            // 
            this.viewport.element.on('click', function (e) {
                if ($(this).is('.masked')) {
                    return;
                }
                var x = e.pageX - $(this).offset().left,
                    k = x / $(this).width(),
                    fwd = k > .15,
                    $targetSlide;
                if (!self.data.activeSlide) {
                    $targetSlide = self.frame.find('li:first-child');
                }
                else {
                    $targetSlide = self.data.activeSlide[fwd ? 'nextAll' : 'prevAll'](':not(.broken)').first();
                }
                if ($targetSlide.length) {
                    var d = self.viewport.toggleSlide(self.data.location + $($targetSlide.data('slide')).attr('image'));
                    d.done($.proxy(self._onSlideChange, self, [$targetSlide[0]]));
                }
            });
        },
        _onSlideChange: function (element) {
        
            var $slide = $(element).toggleClass('inactive', false);
            
            var $prevAll = $slide.prevAll().toggleClass('inactive', true);
            $slide.nextAll().toggleClass('inactive', false);
            this.data.activeSlide = $(element);
            
            this._setProgress($prevAll.length / this.data.slidesTotal);
        },
        _initViewport: function () {
            
            return {
                create: function (element) {
                    this.element = element;
                    this.box = this.element.find('.box');
                    this.messagebox = this.box.find('.message');
                    return this;
                },
                alert: function (str) {
                    this.mask();
                    this.messagebox.html(str);
                    this.box.toggleClass('message', true);
                },
                mask: function () {
                    this.element.toggleClass('masked', true);
                    this.box.removeClass('message loading');
                    this.box.find(':not(.message):not(.loading)').remove();
                    if (arguments.length) {
                        this.box.append(arguments[0]);
                    }
                },
                unmask: function () {
                    this.box.removeClass('message loading');
                    this.element.toggleClass('masked', false);
                    this.box.find(':not(.message):not(.loading)').remove();
                },
                setLoading: function () {
                    this.mask();
                    this.box.toggleClass('loading', true);
                },
                toggleSlide: function (src) {
                    var self = this,
                        slide,
                        d = $.Deferred();
                    
                    if (this.element.is('.masked')) {
                        return d.reject();
                    }
                    this.setLoading();
                    
                    slide = $('<img>', {
                        "class": 'slide',
                        src: src,
                        load: d.resolve,
                        error: d.reject
                    });
                    return d
                        .done(function () {
                            self.element.find('.slide').remove();
                            $(this).prependTo(self.element);
                        }).always(function () {
                            self.unmask();
                        }).promise();
                },
                clearBox: function() {
                    this.box.empty();
                }
            }.create(
                $('<div class="viewport control">').prependTo(this.element)
                    .append($('<div class="mask">')
                        .append($('<div class="box">')
                            .append($('<div class="message">'))
                            .append($('<div class="loading">'))
                            .append($('<div class="control start">'))
                        )
                    )
            );
        },
        _setProgress: function (value) {
            this.progress.stop().animate({
                width: value * 100 + '%'
            }, 100);
        }
    });
})(jQuery);