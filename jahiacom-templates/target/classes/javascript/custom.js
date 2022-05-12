/*!
 * fastshell
 * Fiercely quick and opinionated front-ends
 * https://HosseinKarami.github.io/fastshell
 * @author Hossein Karami
 * @version 1.0.5
 * Copyright 2019. MIT licensed.
 */
/* CUSTOM SCRIPTS BY GÉODE */
(function ($) {
    $(document).ready(function () {

        $('.tab-multi-targets .tab-pane:first-child').find('img').clone().detach().appendTo($('.tab-img-target'));
        $('.tab-multi-targets .tab-pane:first-child').find('img').hide();
        $('.tab-multi .nav-link').click(function () {
            var tab = $(this).attr('data-target');
            console.log("tab clicked: " + tab)
            $(tab).find('img').show();
            var imgTab = $(tab).find('img').clone().detach();
            var target = $('.tab-img-target');
            target.empty();
            $($(imgTab)).appendTo(target);
            $(tab).find('img').hide();
        });

        /* JOBS EXPENDER */
        var expanded = false;
        $('.job-full').hide();

        $('.expand-job').click(function (e) {
            $(this).text($(this).text() == 'Expand' ? 'See less' : 'Expand');
            e.preventDefault();
            $(this).parent().find('.job-full').toggle("medium");
        });

        /* SLICK CAROUSEL */
        if ($('.carousel-multiple-items').length) {
            $('.carousel-multiple-items').slick({
                dots: true,
                arrows: true,
                infinite: true,
                speed: 300,
                slidesToShow: 3,
                slidesToScroll: 3,
                autoplay: true,
                autoplaySpeed: 5000,
                focusOnSelect: true,
                pauseOnHover: false,
                centerPadding: '10px',

                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                            infinite: true,
                            dots: true,
                            autoplaySpeed: 5000,
                            arrows: false
                        }
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            arrows: false,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            autoplaySpeed: 3000
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            autoplaySpeed: 3000,
                            arrows: false
                        }
                    }
                ]
            });


            $('.slick-next, .slick-prev').addClass('fa');
        }

        function do_squares() {
            $('.square').each(function () {
                var w = $(this).width();
                $(this).css('height', w);
            });
        }

        do_squares();

        $(window).resize(function () {
            do_squares();
        });


        // Create a clone of the #wrapper-navbar, right next to original.
        $('header .navbar').addClass('original').clone().insertAfter('header .navbar').addClass('cloned').css('position', 'fixed').css('top', '0').css('margin-top', '0').css('z-index', '1000').removeClass('original').hide();

        scrollIntervalID = setInterval(stickIt, 10);


        function stickIt() {

            var orgElementPos = $('.original').offset();
            orgElementTop = orgElementPos.top;

            if ($(window).scrollTop() >= (orgElementTop)) {
                // scrolled past the original position; now only show the cloned, sticky element.

                // Cloned element should always have same left position and width as original element.
                orgElement = $('.original');
                coordsOrgElement = orgElement.offset();
                leftOrgElement = coordsOrgElement.left;
                widthOrgElement = orgElement.css('width');
                $('.cloned').css('left', leftOrgElement + 'px').css('top', 0).css('width', widthOrgElement).slideDown();
                $('.original').css('visibility', 'hidden');
            } else {
                // not scrolled past the#wrapper-navbar; only show the original#wrapper-navbar.
                $('.cloned').hide();
                $('.original').css('visibility', 'visible');
            }
        }

    });

    /*
    Carousel
*/

    $('#carousel-about').on('slide.bs.carousel', function (e) {
        var $e = $(e.relatedTarget);
        var idx = $e.index();
        var itemsPerSlide = 3;
        var totalItems = $('.carousel-item').length;

        if (idx >= totalItems - (itemsPerSlide - 1)) {
            var it = itemsPerSlide - (totalItems - idx);
            for (var i = 0; i < it; i++) {
                // append slides to end
                if (e.direction == "left") {
                    $('.carousel-item').eq(i).appendTo('.carousel-inner');
                } else {
                    $('.carousel-item').eq(0).appendTo('.carousel-inner');
                }
            }
        }
    });

    $(document).ready(function () {

        /* Every time the window is scrolled ... */
        $(window).scroll(function () {
            /* Check the location of each desired element */
            $('.hideme').each(function (i) {

                var bottom_of_object = $(this).position().top + $(this).outerHeight()/3;
                var bottom_of_window = $(window).scrollTop() + $(window).height();

                /* If the object is completely visible in the window, fade it it */
                if (bottom_of_window > bottom_of_object) {
                    $(this).animate({'opacity': '1'}, 1500);
                    $(this).find('.row').animate({'marginTop': '0px'}, 800);
                }

            });

            $('.zoom-in').each(function (i) {

                var bottom_of_object = $(this).position().top + $(this).outerHeight() / 3;
                var bottom_of_window = $(window).scrollTop() + $(window).height();

                /* If the object is completely visible in the window, fade it it */
                if (bottom_of_window > bottom_of_object) {
                    $(this).addClass('zoomed');
                }

            });

        });
        $('[data-toggle="tooltip"]').tooltip();
    });
})(jQuery);


/*!
 * fastshell
 * Fiercely quick and opinionated front-ends
 * https://HosseinKarami.github.io/fastshell
 * @author Hossein Karami
 * @version 1.0.5
 * Copyright 2019. MIT licensed.
 */
/*!
 * parallax.js v1.5.0 (http://pixelcog.github.io/parallax.js/)
 * @copyright 2016 PixelCog, Inc.
 * @license MIT (https://github.com/pixelcog/parallax.js/blob/master/LICENSE)
 */
!function (t, i, e, s) {
    function o(i, e) {
        var h = this;
        "object" == typeof e && (delete e.refresh, delete e.render, t.extend(this, e)), this.$element = t(i), !this.imageSrc && this.$element.is("img") && (this.imageSrc = this.$element.attr("src"));
        var r = (this.position + "").toLowerCase().match(/\S+/g) || [];
        if (r.length < 1 && r.push("center"), 1 == r.length && r.push(r[0]), "top" != r[0] && "bottom" != r[0] && "left" != r[1] && "right" != r[1] || (r = [r[1], r[0]]), this.positionX !== s && (r[0] = this.positionX.toLowerCase()), this.positionY !== s && (r[1] = this.positionY.toLowerCase()), h.positionX = r[0], h.positionY = r[1], "left" != this.positionX && "right" != this.positionX && (isNaN(parseInt(this.positionX)) ? this.positionX = "center" : this.positionX = parseInt(this.positionX)), "top" != this.positionY && "bottom" != this.positionY && (isNaN(parseInt(this.positionY)) ? this.positionY = "center" : this.positionY = parseInt(this.positionY)), this.position = this.positionX + (isNaN(this.positionX) ? "" : "px") + " " + this.positionY + (isNaN(this.positionY) ? "" : "px"), navigator.userAgent.match(/(iPod|iPhone|iPad)/)) return this.imageSrc && this.iosFix && !this.$element.is("img") && this.$element.css({
            backgroundImage: "url(" + this.imageSrc + ")",
            backgroundSize: "cover",
            backgroundPosition: this.position
        }), this;
        if (navigator.userAgent.match(/(Android)/)) return this.imageSrc && this.androidFix && !this.$element.is("img") && this.$element.css({
            backgroundImage: "url(" + this.imageSrc + ")",
            backgroundSize: "cover",
            backgroundPosition: this.position
        }), this;
        this.$mirror = t("<div />").prependTo(this.mirrorContainer);
        var a = this.$element.find(">.parallax-slider"), n = !1;
        0 == a.length ? this.$slider = t("<img />").prependTo(this.$mirror) : (this.$slider = a.prependTo(this.$mirror), n = !0), this.$mirror.addClass("parallax-mirror").css({
            visibility: "hidden",
            zIndex: this.zIndex,
            position: "fixed",
            top: 0,
            left: 0,
            overflow: "hidden"
        }), this.$slider.addClass("parallax-slider").one("load", function () {
            h.naturalHeight && h.naturalWidth || (h.naturalHeight = this.naturalHeight || this.height || 1, h.naturalWidth = this.naturalWidth || this.width || 1), h.aspectRatio = h.naturalWidth / h.naturalHeight, o.isSetup || o.setup(), o.sliders.push(h), o.isFresh = !1, o.requestRender()
        }), n || (this.$slider[0].src = this.imageSrc), (this.naturalHeight && this.naturalWidth || this.$slider[0].complete || a.length > 0) && this.$slider.trigger("load")
    }

    !function () {
        for (var t = 0, e = ["ms", "moz", "webkit", "o"], s = 0; s < e.length && !i.requestAnimationFrame; ++s) i.requestAnimationFrame = i[e[s] + "RequestAnimationFrame"], i.cancelAnimationFrame = i[e[s] + "CancelAnimationFrame"] || i[e[s] + "CancelRequestAnimationFrame"];
        i.requestAnimationFrame || (i.requestAnimationFrame = function (e) {
            var s = (new Date).getTime(), o = Math.max(0, 16 - (s - t)), h = i.setTimeout(function () {
                e(s + o)
            }, o);
            return t = s + o, h
        }), i.cancelAnimationFrame || (i.cancelAnimationFrame = function (t) {
            clearTimeout(t)
        })
    }(), t.extend(o.prototype, {
        speed: .2,
        bleed: 0,
        zIndex: -100,
        iosFix: !0,
        androidFix: !0,
        position: "center",
        overScrollFix: !1,
        mirrorContainer: "body",
        refresh: function () {
            this.boxWidth = this.$element.outerWidth(), this.boxHeight = this.$element.outerHeight() + 2 * this.bleed, this.boxOffsetTop = this.$element.offset().top - this.bleed, this.boxOffsetLeft = this.$element.offset().left, this.boxOffsetBottom = this.boxOffsetTop + this.boxHeight;
            var t, i = o.winHeight, e = o.docHeight, s = Math.min(this.boxOffsetTop, e - i),
                h = Math.max(this.boxOffsetTop + this.boxHeight - i, 0),
                r = this.boxHeight + (s - h) * (1 - this.speed) | 0, a = (this.boxOffsetTop - s) * (1 - this.speed) | 0;
            r * this.aspectRatio >= this.boxWidth ? (this.imageWidth = r * this.aspectRatio | 0, this.imageHeight = r, this.offsetBaseTop = a, t = this.imageWidth - this.boxWidth, "left" == this.positionX ? this.offsetLeft = 0 : "right" == this.positionX ? this.offsetLeft = -t : isNaN(this.positionX) ? this.offsetLeft = -t / 2 | 0 : this.offsetLeft = Math.max(this.positionX, -t)) : (this.imageWidth = this.boxWidth, this.imageHeight = this.boxWidth / this.aspectRatio | 0, this.offsetLeft = 0, t = this.imageHeight - r, "top" == this.positionY ? this.offsetBaseTop = a : "bottom" == this.positionY ? this.offsetBaseTop = a - t : isNaN(this.positionY) ? this.offsetBaseTop = a - t / 2 | 0 : this.offsetBaseTop = a + Math.max(this.positionY, -t))
        },
        render: function () {
            var t = o.scrollTop, i = o.scrollLeft, e = this.overScrollFix ? o.overScroll : 0, s = t + o.winHeight;
            this.boxOffsetBottom > t && this.boxOffsetTop <= s ? (this.visibility = "visible", this.mirrorTop = this.boxOffsetTop - t, this.mirrorLeft = this.boxOffsetLeft - i, this.offsetTop = this.offsetBaseTop - this.mirrorTop * (1 - this.speed)) : this.visibility = "hidden", this.$mirror.css({
                transform: "translate3d(" + this.mirrorLeft + "px, " + (this.mirrorTop - e) + "px, 0px)",
                visibility: this.visibility,
                height: this.boxHeight,
                width: this.boxWidth
            }), this.$slider.css({
                transform: "translate3d(" + this.offsetLeft + "px, " + this.offsetTop + "px, 0px)",
                position: "absolute",
                height: this.imageHeight,
                width: this.imageWidth,
                maxWidth: "none"
            })
        }
    }), t.extend(o, {
        scrollTop: 0,
        scrollLeft: 0,
        winHeight: 0,
        winWidth: 0,
        docHeight: 1 << 30,
        docWidth: 1 << 30,
        sliders: [],
        isReady: !1,
        isFresh: !1,
        isBusy: !1,
        setup: function () {
            function s() {
                if (p == i.pageYOffset) return i.requestAnimationFrame(s), !1;
                p = i.pageYOffset, h.render(), i.requestAnimationFrame(s)
            }

            if (!this.isReady) {
                var h = this, r = t(e), a = t(i), n = function () {
                    o.winHeight = a.height(), o.winWidth = a.width(), o.docHeight = r.height(), o.docWidth = r.width()
                }, l = function () {
                    var t = a.scrollTop(), i = o.docHeight - o.winHeight, e = o.docWidth - o.winWidth;
                    o.scrollTop = Math.max(0, Math.min(i, t)), o.scrollLeft = Math.max(0, Math.min(e, a.scrollLeft())), o.overScroll = Math.max(t - i, Math.min(t, 0))
                };
                a.on("resize.px.parallax load.px.parallax", function () {
                    n(), h.refresh(), o.isFresh = !1, o.requestRender()
                }).on("scroll.px.parallax load.px.parallax", function () {
                    l(), o.requestRender()
                }), n(), l(), this.isReady = !0;
                var p = -1;
                s()
            }
        },
        configure: function (i) {
            "object" == typeof i && (delete i.refresh, delete i.render, t.extend(this.prototype, i))
        },
        refresh: function () {
            t.each(this.sliders, function () {
                this.refresh()
            }), this.isFresh = !0
        },
        render: function () {
            this.isFresh || this.refresh(), t.each(this.sliders, function () {
                this.render()
            })
        },
        requestRender: function () {
            var t = this;
            t.render(), t.isBusy = !1
        },
        destroy: function (e) {
            var s, h = t(e).data("px.parallax");
            for (h.$mirror.remove(), s = 0; s < this.sliders.length; s += 1) this.sliders[s] == h && this.sliders.splice(s, 1);
            t(e).data("px.parallax", !1), 0 === this.sliders.length && (t(i).off("scroll.px.parallax resize.px.parallax load.px.parallax"), this.isReady = !1, o.isSetup = !1)
        }
    });
    var h = t.fn.parallax;
    t.fn.parallax = function (s) {
        return this.each(function () {
            var h = t(this), r = "object" == typeof s && s;
            this == i || this == e || h.is("body") ? o.configure(r) : h.data("px.parallax") ? "object" == typeof s && t.extend(h.data("px.parallax"), r) : (r = t.extend({}, h.data(), r), h.data("px.parallax", new o(this, r))), "string" == typeof s && ("destroy" == s ? o.destroy(this) : o[s]())
        })
    }, t.fn.parallax.Constructor = o, t.fn.parallax.noConflict = function () {
        return t.fn.parallax = h, this
    }, t(function () {
        t('[data-parallax="scroll"]').parallax()
    })
}(jQuery, window, document);
$( document ).ready(function() {
    $('a[href^="http://"]').attr('target', '_blank');
    $('a[href^="https://"]').attr('target', '_blank');
    $("a[href$='.pdf']").attr("target", "_blank");
    $('.tooltip').tooltip();
})