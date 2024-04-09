/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/autosize/dist/autosize.js":
/*!************************************************!*\
  !*** ./node_modules/autosize/dist/autosize.js ***!
  \************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	autosize 4.0.4
	license: MIT
	http://www.jacklmoore.com/autosize
*/
(function (global, factory) {
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else { var mod; }
})(this, function (module, exports) {
	'use strict';

	var map = typeof Map === "function" ? new Map() : function () {
		var keys = [];
		var values = [];

		return {
			has: function has(key) {
				return keys.indexOf(key) > -1;
			},
			get: function get(key) {
				return values[keys.indexOf(key)];
			},
			set: function set(key, value) {
				if (keys.indexOf(key) === -1) {
					keys.push(key);
					values.push(value);
				}
			},
			delete: function _delete(key) {
				var index = keys.indexOf(key);
				if (index > -1) {
					keys.splice(index, 1);
					values.splice(index, 1);
				}
			}
		};
	}();

	var createEvent = function createEvent(name) {
		return new Event(name, { bubbles: true });
	};
	try {
		new Event('test');
	} catch (e) {
		// IE does not support `new Event()`
		createEvent = function createEvent(name) {
			var evt = document.createEvent('Event');
			evt.initEvent(name, true, false);
			return evt;
		};
	}

	function assign(ta) {
		if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || map.has(ta)) return;

		var heightOffset = null;
		var clientWidth = null;
		var cachedHeight = null;

		function init() {
			var style = window.getComputedStyle(ta, null);

			if (style.resize === 'vertical') {
				ta.style.resize = 'none';
			} else if (style.resize === 'both') {
				ta.style.resize = 'horizontal';
			}

			if (style.boxSizing === 'content-box') {
				heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
			} else {
				heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
			}
			// Fix when a textarea is not on document body and heightOffset is Not a Number
			if (isNaN(heightOffset)) {
				heightOffset = 0;
			}

			update();
		}

		function changeOverflow(value) {
			{
				// Chrome/Safari-specific fix:
				// When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
				// made available by removing the scrollbar. The following forces the necessary text reflow.
				var width = ta.style.width;
				ta.style.width = '0px';
				// Force reflow:
				/* jshint ignore:start */
				ta.offsetWidth;
				/* jshint ignore:end */
				ta.style.width = width;
			}

			ta.style.overflowY = value;
		}

		function getParentOverflows(el) {
			var arr = [];

			while (el && el.parentNode && el.parentNode instanceof Element) {
				if (el.parentNode.scrollTop) {
					arr.push({
						node: el.parentNode,
						scrollTop: el.parentNode.scrollTop
					});
				}
				el = el.parentNode;
			}

			return arr;
		}

		function resize() {
			if (ta.scrollHeight === 0) {
				// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
				return;
			}

			var overflows = getParentOverflows(ta);
			var docTop = document.documentElement && document.documentElement.scrollTop; // Needed for Mobile IE (ticket #240)

			ta.style.height = '';
			ta.style.height = ta.scrollHeight + heightOffset + 'px';

			// used to check if an update is actually necessary on window.resize
			clientWidth = ta.clientWidth;

			// prevents scroll-position jumping
			overflows.forEach(function (el) {
				el.node.scrollTop = el.scrollTop;
			});

			if (docTop) {
				document.documentElement.scrollTop = docTop;
			}
		}

		function update() {
			resize();

			var styleHeight = Math.round(parseFloat(ta.style.height));
			var computed = window.getComputedStyle(ta, null);

			// Using offsetHeight as a replacement for computed.height in IE, because IE does not account use of border-box
			var actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(computed.height)) : ta.offsetHeight;

			// The actual height not matching the style height (set via the resize method) indicates that 
			// the max-height has been exceeded, in which case the overflow should be allowed.
			if (actualHeight < styleHeight) {
				if (computed.overflowY === 'hidden') {
					changeOverflow('scroll');
					resize();
					actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
				}
			} else {
				// Normally keep overflow set to hidden, to avoid flash of scrollbar as the textarea expands.
				if (computed.overflowY !== 'hidden') {
					changeOverflow('hidden');
					resize();
					actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
				}
			}

			if (cachedHeight !== actualHeight) {
				cachedHeight = actualHeight;
				var evt = createEvent('autosize:resized');
				try {
					ta.dispatchEvent(evt);
				} catch (err) {
					// Firefox will throw an error on dispatchEvent for a detached element
					// https://bugzilla.mozilla.org/show_bug.cgi?id=889376
				}
			}
		}

		var pageResize = function pageResize() {
			if (ta.clientWidth !== clientWidth) {
				update();
			}
		};

		var destroy = function (style) {
			window.removeEventListener('resize', pageResize, false);
			ta.removeEventListener('input', update, false);
			ta.removeEventListener('keyup', update, false);
			ta.removeEventListener('autosize:destroy', destroy, false);
			ta.removeEventListener('autosize:update', update, false);

			Object.keys(style).forEach(function (key) {
				ta.style[key] = style[key];
			});

			map.delete(ta);
		}.bind(ta, {
			height: ta.style.height,
			resize: ta.style.resize,
			overflowY: ta.style.overflowY,
			overflowX: ta.style.overflowX,
			wordWrap: ta.style.wordWrap
		});

		ta.addEventListener('autosize:destroy', destroy, false);

		// IE9 does not fire onpropertychange or oninput for deletions,
		// so binding to onkeyup to catch most of those events.
		// There is no way that I know of to detect something like 'cut' in IE9.
		if ('onpropertychange' in ta && 'oninput' in ta) {
			ta.addEventListener('keyup', update, false);
		}

		window.addEventListener('resize', pageResize, false);
		ta.addEventListener('input', update, false);
		ta.addEventListener('autosize:update', update, false);
		ta.style.overflowX = 'hidden';
		ta.style.wordWrap = 'break-word';

		map.set(ta, {
			destroy: destroy,
			update: update
		});

		init();
	}

	function destroy(ta) {
		var methods = map.get(ta);
		if (methods) {
			methods.destroy();
		}
	}

	function update(ta) {
		var methods = map.get(ta);
		if (methods) {
			methods.update();
		}
	}

	var autosize = null;

	// Do nothing in Node.js environment and IE8 (or lower)
	if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
		autosize = function autosize(el) {
			return el;
		};
		autosize.destroy = function (el) {
			return el;
		};
		autosize.update = function (el) {
			return el;
		};
	} else {
		autosize = function autosize(el, options) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], function (x) {
					return assign(x, options);
				});
			}
			return el;
		};
		autosize.destroy = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], destroy);
			}
			return el;
		};
		autosize.update = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], update);
			}
			return el;
		};
	}

	exports.default = autosize;
	module.exports = exports['default'];
});

/***/ }),

/***/ "./src/js/textarea.js":
/*!****************************!*\
  !*** ./src/js/textarea.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var autosize = __webpack_require__(/*! autosize */ "./node_modules/autosize/dist/autosize.js");
(function ($) {
    var textareas;
    if (ACFAutosize.enabledByDefault) {
        textareas = $('.acf-field:not(.no-autosize) textarea');
    }
    else {
        textareas = $('.acf-field.autosize textarea');
    }
    autosize(textareas);
    // auto size text-areas on various occasions
    acf.addAction('ready load resize', function () {
        autosize.update(textareas);
    });
    acf.addAction('show_field', function () {
        // wait a moment until the field is really open
        setTimeout(function () {
            autosize.update(textareas);
        }, 750);
    });
    // init autosize on newly created repeater/flexcontent fields
    acf.addAction('append', function ($el) {
        var textarea = null;
        if (ACFAutosize.enabledByDefault) {
            textarea = $el.find('.acf-field:not(.no-autosize) textarea');
        }
        else {
            textarea = $el.find('.acf-field.autosize textarea');
        }
        if (textarea.length > 0) {
            autosize(textarea);
        }
    });
})(window.jQuery);


/***/ }),

/***/ "./src/js/wysiwyg.js":
/*!***************************!*\
  !*** ./src/js/wysiwyg.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var autosize = __webpack_require__(/*! autosize */ "./node_modules/autosize/dist/autosize.js");
(function ($) {
    /**
     * set the editor wrapper height to it's content height
     * @param {[object]} editor tinymce editor object
     * @param  {Number} minHeight minimal height for the editor
     * @return void
     */
    function editorAutoHeight(editor, minHeight) {
        if (minHeight === void 0) { minHeight = 200; }
        // do not resize on fullscreen editors
        if (!editor.plugins.fullscreen.isFullscreen()) {
            var height = $(editor.iframeElement)
                .contents()
                .find('html')
                .height() || minHeight;
            height = height < minHeight ? minHeight : height;
            $(editor.iframeElement).css({
                height: height,
                minHeight: minHeight
            });
        }
    }
    /**
     * add the acf field's name slug a data-attribute to the iframe body
     * @param {object} field the acf field as a jQuery object
     */
    function addSlugAttr(field) {
        var name = field.attr('data-name');
        var body = $('iframe', field)
            .contents()
            .find('body');
        body.attr('data-wysiwyg-slug', name);
    }
    /**
     * acf.tinymce hook
     */
    acf.addAction('wysiwyg_quicktags_init', function (ed, id, mceInit, field) {
        autosize(field.$el.find('textarea.wp-editor-area'));
    });
    acf.addAction('wysiwyg_tinymce_init', function (ed, id, mceInit, field) {
        var setAutoHeight = function () {
            editorAutoHeight(ed, ACFAutosize.wysiwyg.minHeight);
        };
        // add a slug class on all wysiwyg fiulds (for editor-styles.css)
        ed.on('init', function () {
            addSlugAttr(field.$el);
        });
        // check for "autosize" class on the field
        var doAutosize = false;
        if (ACFAutosize.enabledByDefault) {
            doAutosize = !field.$el.hasClass('no-autosize');
        }
        else {
            doAutosize = field.$el.hasClass('autosize');
        }
        if (!doAutosize) {
            return;
        }
        /**
         * set height on various occasions
         */
        ed.on('init', setAutoHeight);
        ed.on('change', setAutoHeight);
        ed.on('FullscreenStateChanged', function (e) {
            setAutoHeight();
        });
        acf.addAction('load', function () {
            setAutoHeight();
        });
        acf.addAction('resize', function () {
            setAutoHeight();
        });
        acf.addAction('show_field', function (field) {
            // wait a moment until the field is really open
            setTimeout(function () {
                setAutoHeight();
            }, 750);
        });
        // wait a moment until all controls are loaded, fonts are loaded and resize again
        setTimeout(function () {
            setAutoHeight();
        }, 1000);
    });
})(window.jQuery);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
if (typeof acf !== 'undefined') {
    __webpack_require__(/*! ./textarea */ "./src/js/textarea.js");
    __webpack_require__(/*! ./wysiwyg */ "./src/js/wysiwyg.js");
    if (typeof ACFAutosize !== 'undefined' && ACFAutosize.enabledByDefault) {
        window.jQuery('body').addClass('acf-autosize-enabled');
    }
}

}();
/******/ })()
;
//# sourceMappingURL=acf-autosize.js.map