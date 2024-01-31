'use strict';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

// Polyfill for element.matches, to support Internet Explorer. It's a relatively
// simple polyfill, so we'll just include it rather than require the user to
// include the polyfill themselves. Adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
var matches = function matches(element, selector) {
  return element.matches ? element.matches(selector) : element.msMatchesSelector ? element.msMatchesSelector(selector) : element.webkitMatchesSelector ? element.webkitMatchesSelector(selector) : null;
};

// Polyfill for element.closest, to support Internet Explorer. It's a relatively
var closestPolyfill = function closestPolyfill(el, selector) {
  var element = el;
  while (element && element.nodeType === 1) {
    if (matches(element, selector)) {
      return element;
    }
    element = element.parentNode;
  }
  return null;
};
var closest = function closest(element, selector) {
  return element.closest ? element.closest(selector) : closestPolyfill(element, selector);
};

// Returns true if the value has a "then" function. Adapted from
// https://github.com/graphql/graphql-js/blob/499a75939f70c4863d44149371d6a99d57ff7c35/src/jsutils/isPromise.js
var isPromise = function isPromise(value) {
  return Boolean(value && typeof value.then === 'function');
};

var AutocompleteCore = /*#__PURE__*/_createClass(function AutocompleteCore() {
  var _this = this;
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    search = _ref.search,
    _ref$autoSelect = _ref.autoSelect,
    autoSelect = _ref$autoSelect === void 0 ? false : _ref$autoSelect,
    _ref$setValue = _ref.setValue,
    setValue = _ref$setValue === void 0 ? function () {} : _ref$setValue,
    _ref$setAttribute = _ref.setAttribute,
    setAttribute = _ref$setAttribute === void 0 ? function () {} : _ref$setAttribute,
    _ref$onUpdate = _ref.onUpdate,
    onUpdate = _ref$onUpdate === void 0 ? function () {} : _ref$onUpdate,
    _ref$onSubmit = _ref.onSubmit,
    onSubmit = _ref$onSubmit === void 0 ? function () {} : _ref$onSubmit,
    _ref$onShow = _ref.onShow,
    onShow = _ref$onShow === void 0 ? function () {} : _ref$onShow,
    _ref$autocorrect = _ref.autocorrect,
    autocorrect = _ref$autocorrect === void 0 ? false : _ref$autocorrect,
    _ref$onHide = _ref.onHide,
    onHide = _ref$onHide === void 0 ? function () {} : _ref$onHide,
    _ref$onLoading = _ref.onLoading,
    onLoading = _ref$onLoading === void 0 ? function () {} : _ref$onLoading,
    _ref$onLoaded = _ref.onLoaded,
    onLoaded = _ref$onLoaded === void 0 ? function () {} : _ref$onLoaded,
    _ref$submitOnEnter = _ref.submitOnEnter,
    submitOnEnter = _ref$submitOnEnter === void 0 ? false : _ref$submitOnEnter;
  _classCallCheck(this, AutocompleteCore);
  _defineProperty(this, "value", '');
  _defineProperty(this, "searchCounter", 0);
  _defineProperty(this, "results", []);
  _defineProperty(this, "selectedIndex", -1);
  _defineProperty(this, "selectedResult", null);
  _defineProperty(this, "destroy", function () {
    _this.search = null;
    _this.setValue = null;
    _this.setAttribute = null;
    _this.onUpdate = null;
    _this.onSubmit = null;
    _this.autocorrect = null;
    _this.onShow = null;
    _this.onHide = null;
    _this.onLoading = null;
    _this.onLoaded = null;
  });
  _defineProperty(this, "handleInput", function (event) {
    var value = event.target.value;
    _this.updateResults(value);
    _this.value = value;
  });
  _defineProperty(this, "handleKeyDown", function (event) {
    var key = event.key;
    switch (key) {
      case 'Up': // IE/Edge
      case 'Down': // IE/Edge
      case 'ArrowUp':
      case 'ArrowDown':
        {
          var selectedIndex = key === 'ArrowUp' || key === 'Up' ? _this.selectedIndex - 1 : _this.selectedIndex + 1;
          event.preventDefault();
          _this.handleArrows(selectedIndex);
          break;
        }
      case 'Tab':
        {
          _this.selectResult();
          break;
        }
      case 'Enter':
        {
          var isListItemSelected = event.target.getAttribute('aria-activedescendant').length > 0;
          _this.selectedResult = _this.results[_this.selectedIndex] || _this.selectedResult;
          _this.selectResult();
          if (_this.submitOnEnter) {
            _this.selectedResult && _this.onSubmit(_this.selectedResult);
          } else {
            if (isListItemSelected) {
              event.preventDefault();
            } else {
              _this.selectedResult && _this.onSubmit(_this.selectedResult);
              _this.selectedResult = null;
            }
          }
          break;
        }
      case 'Esc': // IE/Edge
      case 'Escape':
        {
          _this.hideResults();
          _this.setValue();
          break;
        }
      default:
        return;
    }
  });
  _defineProperty(this, "handleFocus", function (event) {
    var value = event.target.value;
    _this.updateResults(value);
    _this.value = value;
  });
  _defineProperty(this, "handleBlur", function () {
    _this.hideResults();
  });
  _defineProperty(this, "handleResultMouseDown", function (event) {
    event.preventDefault();
  });
  _defineProperty(this, "handleResultClick", function (event) {
    var target = event.target;
    var result = closest(target, '[data-result-index]');
    if (result) {
      _this.selectedIndex = parseInt(result.dataset.resultIndex, 10);
      var selectedResult = _this.results[_this.selectedIndex];
      _this.selectResult();
      _this.onSubmit(selectedResult);
    }
  });
  _defineProperty(this, "handleArrows", function (selectedIndex) {
    // Loop selectedIndex back to first or last result if out of bounds
    var resultsCount = _this.results.length;
    _this.selectedIndex = (selectedIndex % resultsCount + resultsCount) % resultsCount;

    // Update results and aria attributes
    _this.onUpdate(_this.results, _this.selectedIndex);
  });
  _defineProperty(this, "selectResult", function () {
    var selectedResult = _this.results[_this.selectedIndex];
    if (selectedResult) {
      _this.setValue(selectedResult);
    }
    _this.hideResults();
  });
  _defineProperty(this, "updateResults", function (value) {
    var currentSearch = ++_this.searchCounter;
    _this.onLoading();
    _this.search(value).then(function (results) {
      if (currentSearch !== _this.searchCounter) {
        return;
      }
      _this.results = results;
      _this.onLoaded();
      if (_this.results.length === 0) {
        _this.hideResults();
        return;
      }
      _this.selectedIndex = _this.autoSelect ? 0 : -1;
      _this.onUpdate(_this.results, _this.selectedIndex);
      _this.showResults();
    });
  });
  _defineProperty(this, "showResults", function () {
    _this.setAttribute('aria-expanded', true);
    _this.onShow();
  });
  _defineProperty(this, "hideResults", function () {
    _this.selectedIndex = -1;
    _this.results = [];
    _this.setAttribute('aria-expanded', false);
    _this.setAttribute('aria-activedescendant', '');
    _this.onUpdate(_this.results, _this.selectedIndex);
    _this.onHide();
  });
  _defineProperty(this, "checkSelectedResultVisible", function (resultsElement) {
    var selectedResultElement = resultsElement.querySelector("[data-result-index=\"".concat(_this.selectedIndex, "\"]"));
    if (!selectedResultElement) {
      return;
    }
    var resultsPosition = resultsElement.getBoundingClientRect();
    var selectedPosition = selectedResultElement.getBoundingClientRect();
    if (selectedPosition.top < resultsPosition.top) {
      // Element is above viewable area
      resultsElement.scrollTop -= resultsPosition.top - selectedPosition.top;
    } else if (selectedPosition.bottom > resultsPosition.bottom) {
      // Element is below viewable area
      resultsElement.scrollTop += selectedPosition.bottom - resultsPosition.bottom;
    }
  });
  this.search = isPromise(search) ? search : function (value) {
    return Promise.resolve(search(value));
  };
  this.autoSelect = autoSelect;
  this.setValue = setValue;
  this.setAttribute = setAttribute;
  this.onUpdate = onUpdate;
  this.onSubmit = onSubmit;
  this.autocorrect = autocorrect;
  this.onShow = onShow;
  this.onHide = onHide;
  this.onLoading = onLoading;
  this.onLoaded = onLoaded;
  this.submitOnEnter = submitOnEnter;
});

// Generates a unique ID, with optional prefix. Adapted from
// https://github.com/lodash/lodash/blob/61acdd0c295e4447c9c10da04e287b1ebffe452c/uniqueId.js
var idCounter = 0;
var uniqueId = function uniqueId() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return "".concat(prefix).concat(++idCounter);
};

// Calculates whether element2 should be above or below element1. Always
// places element2 below unless all of the following:
// 1. There isn't enough visible viewport below to fit element2
// 2. There is more room above element1 than there is below
// 3. Placing elemen2 above 1 won't overflow window
var getRelativePosition = function getRelativePosition(element1, element2) {
  var position1 = element1.getBoundingClientRect();
  var position2 = element2.getBoundingClientRect();
  var positionAbove = /* 1 */position1.bottom + position2.height > window.innerHeight && /* 2 */window.innerHeight - position1.bottom < position1.top && /* 3 */window.pageYOffset + position1.top - position2.height > 0;
  return positionAbove ? 'above' : 'below';
};

// Credit David Walsh (https://davidwalsh.name/javascript-debounce-function)

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
var debounce = function debounce(func, wait, immediate) {
  var timeout;
  return function executedFunction() {
    var context = this;
    var args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

/**
 * @typedef {Object} LabelObj
 * @property {string} attribute - `aria-label` | `aria-labelledby`
 * @property {string} content - content of attribute
 */

/**
 * @param {string} labelStr - content for `aria-label` or – if it starts with `#` – ID for `aria-labelledby`
 * @returns {LabelObj} Object with label attribute and its content
 */
var getAriaLabel = function getAriaLabel(labelStr) {
  if (labelStr !== null && labelStr !== void 0 && labelStr.length) {
    var isLabelId = labelStr.startsWith('#');
    return {
      attribute: isLabelId ? 'aria-labelledby' : 'aria-label',
      content: isLabelId ? labelStr.substring(1) : labelStr
    };
  }
};

var script = {
  name: 'Autocomplete',
  inheritAttrs: false,
  props: {
    search: {
      type: Function,
      required: true
    },
    baseClass: {
      type: String,
      "default": 'autocomplete'
    },
    autoSelect: {
      type: Boolean,
      "default": false
    },
    getResultValue: {
      type: Function,
      "default": function _default(result) {
        return result;
      }
    },
    defaultValue: {
      type: String,
      "default": ''
    },
    debounceTime: {
      type: Number,
      "default": 0
    },
    resultListLabel: {
      type: String,
      "default": undefined
    },
    submitOnEnter: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    var core = new AutocompleteCore({
      search: this.search,
      autoSelect: this.autoSelect,
      setValue: this.setValue,
      onUpdate: this.handleUpdate,
      onSubmit: this.handleSubmit,
      onShow: this.handleShow,
      onHide: this.handleHide,
      onLoading: this.handleLoading,
      onLoaded: this.handleLoaded,
      submitOnEnter: this.submitOnEnter
    });
    if (this.debounceTime > 0) {
      core.handleInput = debounce(core.handleInput, this.debounceTime);
    }
    return {
      core: core,
      value: this.defaultValue,
      resultListId: uniqueId("".concat(this.baseClass, "-result-list-")),
      results: [],
      selectedIndex: -1,
      expanded: false,
      loading: false,
      position: 'below',
      resetPosition: true
    };
  },
  computed: {
    rootProps: function rootProps() {
      return {
        "class": this.baseClass,
        style: {
          position: 'relative'
        },
        'data-expanded': this.expanded,
        'data-loading': this.loading,
        'data-position': this.position
      };
    },
    inputProps: function inputProps() {
      return _objectSpread2({
        "class": "".concat(this.baseClass, "-input"),
        value: this.value,
        role: 'combobox',
        autocomplete: 'off',
        autocapitalize: 'off',
        autocorrect: 'off',
        spellcheck: 'false',
        'aria-autocomplete': 'list',
        'aria-haspopup': 'listbox',
        'aria-owns': this.resultListId,
        'aria-expanded': this.expanded ? 'true' : 'false',
        'aria-activedescendant': this.selectedIndex > -1 ? this.resultProps[this.selectedIndex].id : ''
      }, this.$attrs);
    },
    inputListeners: function inputListeners() {
      return {
        input: this.handleInput,
        keydown: this.core.handleKeyDown,
        focus: this.core.handleFocus,
        blur: this.core.handleBlur
      };
    },
    resultListProps: function resultListProps() {
      var _ref;
      var yPosition = this.position === 'below' ? 'top' : 'bottom';
      var ariaLabel = getAriaLabel(this.resultListLabel);
      return _ref = {
        id: this.resultListId,
        "class": "".concat(this.baseClass, "-result-list"),
        role: 'listbox'
      }, _defineProperty(_ref, ariaLabel === null || ariaLabel === void 0 ? void 0 : ariaLabel.attribute, ariaLabel === null || ariaLabel === void 0 ? void 0 : ariaLabel.content), _defineProperty(_ref, "style", _defineProperty({
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        visibility: this.expanded ? 'visible' : 'hidden',
        pointerEvents: this.expanded ? 'auto' : 'none'
      }, yPosition, '100%')), _ref;
    },
    resultListListeners: function resultListListeners() {
      return {
        mousedown: this.core.handleResultMouseDown,
        click: this.core.handleResultClick
      };
    },
    resultProps: function resultProps() {
      var _this = this;
      return this.results.map(function (result, index) {
        return _objectSpread2({
          id: "".concat(_this.baseClass, "-result-").concat(index),
          "class": "".concat(_this.baseClass, "-result"),
          'data-result-index': index,
          role: 'option'
        }, _this.selectedIndex === index ? {
          'aria-selected': 'true'
        } : {});
      });
    }
  },
  mounted: function mounted() {
    document.body.addEventListener('click', this.handleDocumentClick);
  },
  beforeUnmount: function beforeUnmount() {
    document.body.removeEventListener('click', this.handleDocumentClick);
  },
  updated: function updated() {
    if (!this.$refs.input || !this.$refs.resultList) {
      return;
    }
    if (this.resetPosition && this.results.length > 0) {
      this.resetPosition = false;
      this.position = getRelativePosition(this.$refs.input, this.$refs.resultList);
    }
    this.core.checkSelectedResultVisible(this.$refs.resultList);
  },
  methods: {
    setValue: function setValue(result) {
      this.value = result ? this.getResultValue(result) : '';
    },
    handleUpdate: function handleUpdate(results, selectedIndex) {
      this.results = results;
      this.selectedIndex = selectedIndex;
      this.$emit('update', results, selectedIndex);
    },
    handleShow: function handleShow() {
      this.expanded = true;
    },
    handleHide: function handleHide() {
      this.expanded = false;
      this.resetPosition = true;
    },
    handleLoading: function handleLoading() {
      this.loading = true;
    },
    handleLoaded: function handleLoaded() {
      this.loading = false;
    },
    handleInput: function handleInput(event) {
      this.value = event.target.value;
      this.core.handleInput(event);
    },
    handleSubmit: function handleSubmit(selectedResult) {
      this.$emit('submit', selectedResult);
    },
    handleDocumentClick: function handleDocumentClick(event) {
      if (this.$refs.root.contains(event.target)) {
        return;
      }
      this.core.hideResults();
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"root"},[_vm._t("default",function(){return [_c('div',_vm._b({},'div',_vm.rootProps,false),[_c('input',_vm._g(_vm._b({ref:"input",on:{"input":_vm.handleInput,"keydown":_vm.core.handleKeyDown,"focus":_vm.core.handleFocus,"blur":_vm.core.handleBlur}},'input',_vm.inputProps,false),_vm.$listeners)),_vm._v(" "),_c('ul',_vm._g(_vm._b({ref:"resultList"},'ul',_vm.resultListProps,false),_vm.resultListListeners),[_vm._l((_vm.results),function(result,index){return [_vm._t("result",function(){return [_c('li',_vm._b({key:_vm.resultProps[index].id},'li',_vm.resultProps[index],false),[_vm._v("\n              "+_vm._s(_vm.getResultValue(result))+"\n            ")])]},{"result":result,"props":_vm.resultProps[index]})]})],2)])]},{"rootProps":_vm.rootProps,"inputProps":_vm.inputProps,"inputListeners":_vm.inputListeners,"resultListProps":_vm.resultListProps,"resultListListeners":_vm.resultListListeners,"results":_vm.results,"resultProps":_vm.resultProps})],2)};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

function install(Vue) {
  if (install.installed) {
    return;
  }
  install.installed = true;
  Vue.component('Autocomplete', __vue_component__);
}
var plugin = {
  install: install
};

// Auto install if Vue is found
var GlobalVue;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

// Inject install function into component. Allows component to be registered via
// Vue.use() as well as Vue.component()
__vue_component__.install = install;

module.exports = __vue_component__;
