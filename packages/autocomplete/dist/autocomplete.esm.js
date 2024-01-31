function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  Object.defineProperty(Constructor, 'prototype', {
    writable: false,
  })
  return Constructor
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  } else {
    obj[key] = value
  }
  return obj
}

// Polyfill for element.matches, to support Internet Explorer. It's a relatively
// simple polyfill, so we'll just include it rather than require the user to
// include the polyfill themselves. Adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
var matches = function matches(element, selector) {
  return element.matches
    ? element.matches(selector)
    : element.msMatchesSelector
    ? element.msMatchesSelector(selector)
    : element.webkitMatchesSelector
    ? element.webkitMatchesSelector(selector)
    : null
}

// Polyfill for element.closest, to support Internet Explorer. It's a relatively
var closestPolyfill = function closestPolyfill(el, selector) {
  var element = el
  while (element && element.nodeType === 1) {
    if (matches(element, selector)) {
      return element
    }
    element = element.parentNode
  }
  return null
}
var closest = function closest(element, selector) {
  return element.closest
    ? element.closest(selector)
    : closestPolyfill(element, selector)
}

// Returns true if the value has a "then" function. Adapted from
// https://github.com/graphql/graphql-js/blob/499a75939f70c4863d44149371d6a99d57ff7c35/src/jsutils/isPromise.js
var isPromise = function isPromise(value) {
  return Boolean(value && typeof value.then === 'function')
}

var AutocompleteCore = /*#__PURE__*/ _createClass(function AutocompleteCore() {
  var _this = this
  var _ref =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    search = _ref.search,
    _ref$autoSelect = _ref.autoSelect,
    autoSelect = _ref$autoSelect === void 0 ? false : _ref$autoSelect,
    _ref$setValue = _ref.setValue,
    setValue = _ref$setValue === void 0 ? function() {} : _ref$setValue,
    _ref$setAttribute = _ref.setAttribute,
    setAttribute =
      _ref$setAttribute === void 0 ? function() {} : _ref$setAttribute,
    _ref$onUpdate = _ref.onUpdate,
    onUpdate = _ref$onUpdate === void 0 ? function() {} : _ref$onUpdate,
    _ref$onSubmit = _ref.onSubmit,
    onSubmit = _ref$onSubmit === void 0 ? function() {} : _ref$onSubmit,
    _ref$onShow = _ref.onShow,
    onShow = _ref$onShow === void 0 ? function() {} : _ref$onShow,
    _ref$autocorrect = _ref.autocorrect,
    autocorrect = _ref$autocorrect === void 0 ? false : _ref$autocorrect,
    _ref$onHide = _ref.onHide,
    onHide = _ref$onHide === void 0 ? function() {} : _ref$onHide,
    _ref$onLoading = _ref.onLoading,
    onLoading = _ref$onLoading === void 0 ? function() {} : _ref$onLoading,
    _ref$onLoaded = _ref.onLoaded,
    onLoaded = _ref$onLoaded === void 0 ? function() {} : _ref$onLoaded,
    _ref$submitOnEnter = _ref.submitOnEnter,
    submitOnEnter = _ref$submitOnEnter === void 0 ? false : _ref$submitOnEnter
  _classCallCheck(this, AutocompleteCore)
  _defineProperty(this, 'value', '')
  _defineProperty(this, 'searchCounter', 0)
  _defineProperty(this, 'results', [])
  _defineProperty(this, 'selectedIndex', -1)
  _defineProperty(this, 'selectedResult', null)
  _defineProperty(this, 'destroy', function() {
    _this.search = null
    _this.setValue = null
    _this.setAttribute = null
    _this.onUpdate = null
    _this.onSubmit = null
    _this.autocorrect = null
    _this.onShow = null
    _this.onHide = null
    _this.onLoading = null
    _this.onLoaded = null
  })
  _defineProperty(this, 'handleInput', function(event) {
    var value = event.target.value
    _this.updateResults(value)
    _this.value = value
  })
  _defineProperty(this, 'handleKeyDown', function(event) {
    var key = event.key
    switch (key) {
      case 'Up': // IE/Edge
      case 'Down': // IE/Edge
      case 'ArrowUp':
      case 'ArrowDown': {
        var selectedIndex =
          key === 'ArrowUp' || key === 'Up'
            ? _this.selectedIndex - 1
            : _this.selectedIndex + 1
        event.preventDefault()
        _this.handleArrows(selectedIndex)
        break
      }
      case 'Tab': {
        _this.selectResult()
        break
      }
      case 'Enter': {
        var isListItemSelected =
          event.target.getAttribute('aria-activedescendant').length > 0
        _this.selectedResult =
          _this.results[_this.selectedIndex] || _this.selectedResult
        _this.selectResult()
        if (_this.submitOnEnter) {
          _this.selectedResult && _this.onSubmit(_this.selectedResult)
        } else {
          if (isListItemSelected) {
            event.preventDefault()
          } else {
            _this.selectedResult && _this.onSubmit(_this.selectedResult)
            _this.selectedResult = null
          }
        }
        break
      }
      case 'Esc': // IE/Edge
      case 'Escape': {
        _this.hideResults()
        _this.setValue()
        break
      }
      default:
        return
    }
  })
  _defineProperty(this, 'handleFocus', function(event) {
    var value = event.target.value
    _this.updateResults(value)
    _this.value = value
  })
  _defineProperty(this, 'handleBlur', function() {
    _this.hideResults()
  })
  _defineProperty(this, 'handleResultMouseDown', function(event) {
    event.preventDefault()
  })
  _defineProperty(this, 'handleResultClick', function(event) {
    var target = event.target
    var result = closest(target, '[data-result-index]')
    if (result) {
      _this.selectedIndex = parseInt(result.dataset.resultIndex, 10)
      var selectedResult = _this.results[_this.selectedIndex]
      _this.selectResult()
      _this.onSubmit(selectedResult)
    }
  })
  _defineProperty(this, 'handleArrows', function(selectedIndex) {
    // Loop selectedIndex back to first or last result if out of bounds
    var resultsCount = _this.results.length
    _this.selectedIndex =
      ((selectedIndex % resultsCount) + resultsCount) % resultsCount

    // Update results and aria attributes
    _this.onUpdate(_this.results, _this.selectedIndex)
  })
  _defineProperty(this, 'selectResult', function() {
    var selectedResult = _this.results[_this.selectedIndex]
    if (selectedResult) {
      _this.setValue(selectedResult)
    }
    _this.hideResults()
  })
  _defineProperty(this, 'updateResults', function(value) {
    var currentSearch = ++_this.searchCounter
    _this.onLoading()
    _this.search(value).then(function(results) {
      if (currentSearch !== _this.searchCounter) {
        return
      }
      _this.results = results
      _this.onLoaded()
      if (_this.results.length === 0) {
        _this.hideResults()
        return
      }
      _this.selectedIndex = _this.autoSelect ? 0 : -1
      _this.onUpdate(_this.results, _this.selectedIndex)
      _this.showResults()
    })
  })
  _defineProperty(this, 'showResults', function() {
    _this.setAttribute('aria-expanded', true)
    _this.onShow()
  })
  _defineProperty(this, 'hideResults', function() {
    _this.selectedIndex = -1
    _this.results = []
    _this.setAttribute('aria-expanded', false)
    _this.setAttribute('aria-activedescendant', '')
    _this.onUpdate(_this.results, _this.selectedIndex)
    _this.onHide()
  })
  _defineProperty(this, 'checkSelectedResultVisible', function(resultsElement) {
    var selectedResultElement = resultsElement.querySelector(
      '[data-result-index="'.concat(_this.selectedIndex, '"]')
    )
    if (!selectedResultElement) {
      return
    }
    var resultsPosition = resultsElement.getBoundingClientRect()
    var selectedPosition = selectedResultElement.getBoundingClientRect()
    if (selectedPosition.top < resultsPosition.top) {
      // Element is above viewable area
      resultsElement.scrollTop -= resultsPosition.top - selectedPosition.top
    } else if (selectedPosition.bottom > resultsPosition.bottom) {
      // Element is below viewable area
      resultsElement.scrollTop +=
        selectedPosition.bottom - resultsPosition.bottom
    }
  })
  this.search = isPromise(search)
    ? search
    : function(value) {
        return Promise.resolve(search(value))
      }
  this.autoSelect = autoSelect
  this.setValue = setValue
  this.setAttribute = setAttribute
  this.onUpdate = onUpdate
  this.onSubmit = onSubmit
  this.autocorrect = autocorrect
  this.onShow = onShow
  this.onHide = onHide
  this.onLoading = onLoading
  this.onLoaded = onLoaded
  this.submitOnEnter = submitOnEnter
})

export default AutocompleteCore
