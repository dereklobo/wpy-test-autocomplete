var y = Object.defineProperty;
var P = (t, e, s) => e in t ? y(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var o = (t, e, s) => (P(t, typeof e != "symbol" ? e + "" : e, s), s);
import { openBlock as c, createElementBlock as p, renderSlot as m, createElementVNode as f, normalizeProps as v, guardReactiveProps as S, mergeProps as b, toHandlers as C, Fragment as k, renderList as A, toDisplayString as V } from "vue";
const D = (t, e) => t.matches ? t.matches(e) : t.msMatchesSelector ? t.msMatchesSelector(e) : t.webkitMatchesSelector ? t.webkitMatchesSelector(e) : null, B = (t, e) => {
  let s = t;
  for (; s && s.nodeType === 1; ) {
    if (D(s, e))
      return s;
    s = s.parentNode;
  }
  return null;
}, U = (t, e) => t.closest ? t.closest(e) : B(t, e), E = (t) => !!(t && typeof t.then == "function");
class F {
  constructor({
    search: e,
    autoSelect: s = !1,
    setValue: i = () => {
    },
    setAttribute: l = () => {
    },
    onUpdate: n = () => {
    },
    onSubmit: u = () => {
    },
    onShow: r = () => {
    },
    autocorrect: h = !1,
    onHide: w = () => {
    },
    onLoading: L = () => {
    },
    onLoaded: R = () => {
    },
    submitOnEnter: x = !1
  } = {}) {
    o(this, "value", "");
    o(this, "searchCounter", 0);
    o(this, "results", []);
    o(this, "selectedIndex", -1);
    o(this, "selectedResult", null);
    o(this, "destroy", () => {
      this.search = null, this.setValue = null, this.setAttribute = null, this.onUpdate = null, this.onSubmit = null, this.autocorrect = null, this.onShow = null, this.onHide = null, this.onLoading = null, this.onLoaded = null;
    });
    o(this, "handleInput", (e) => {
      const { value: s } = e.target;
      this.updateResults(s), this.value = s;
    });
    o(this, "handleKeyDown", (e) => {
      const { key: s } = e;
      switch (s) {
        case "Up":
        case "Down":
        case "ArrowUp":
        case "ArrowDown": {
          const i = s === "ArrowUp" || s === "Up" ? this.selectedIndex - 1 : this.selectedIndex + 1;
          e.preventDefault(), this.handleArrows(i);
          break;
        }
        case "Tab": {
          this.selectResult();
          break;
        }
        case "Enter": {
          const i = e.target.getAttribute("aria-activedescendant").length > 0;
          this.selectedResult = this.results[this.selectedIndex] || this.selectedResult, this.selectResult(), this.submitOnEnter ? this.selectedResult && this.onSubmit(this.selectedResult) : i ? e.preventDefault() : (this.selectedResult && this.onSubmit(this.selectedResult), this.selectedResult = null);
          break;
        }
        case "Esc":
        case "Escape": {
          this.hideResults(), this.setValue();
          break;
        }
        default:
          return;
      }
    });
    o(this, "handleFocus", (e) => {
      const { value: s } = e.target;
      this.updateResults(s), this.value = s;
    });
    o(this, "handleBlur", () => {
      this.hideResults();
    });
    // The mousedown event fires before the blur event. Calling preventDefault() when
    // the results list is clicked will prevent it from taking focus, firing the
    // blur event on the input element, and closing the results list before click fires.
    o(this, "handleResultMouseDown", (e) => {
      e.preventDefault();
    });
    o(this, "handleResultClick", (e) => {
      const { target: s } = e, i = U(s, "[data-result-index]");
      if (i) {
        this.selectedIndex = parseInt(i.dataset.resultIndex, 10);
        const l = this.results[this.selectedIndex];
        this.selectResult(), this.onSubmit(l);
      }
    });
    o(this, "handleArrows", (e) => {
      const s = this.results.length;
      this.selectedIndex = (e % s + s) % s, this.onUpdate(this.results, this.selectedIndex);
    });
    o(this, "selectResult", () => {
      const e = this.results[this.selectedIndex];
      e && this.setValue(e), this.hideResults();
    });
    o(this, "updateResults", (e) => {
      const s = ++this.searchCounter;
      this.onLoading(), this.search(e).then((i) => {
        if (s === this.searchCounter) {
          if (this.results = i, this.onLoaded(), this.results.length === 0) {
            this.hideResults();
            return;
          }
          this.selectedIndex = this.autoSelect ? 0 : -1, this.onUpdate(this.results, this.selectedIndex), this.showResults();
        }
      });
    });
    o(this, "showResults", () => {
      this.setAttribute("aria-expanded", !0), this.onShow();
    });
    o(this, "hideResults", () => {
      this.selectedIndex = -1, this.results = [], this.setAttribute("aria-expanded", !1), this.setAttribute("aria-activedescendant", ""), this.onUpdate(this.results, this.selectedIndex), this.onHide();
    });
    // Make sure selected result isn't scrolled out of view
    o(this, "checkSelectedResultVisible", (e) => {
      const s = e.querySelector(
        `[data-result-index="${this.selectedIndex}"]`
      );
      if (!s)
        return;
      const i = e.getBoundingClientRect(), l = s.getBoundingClientRect();
      l.top < i.top ? e.scrollTop -= i.top - l.top : l.bottom > i.bottom && (e.scrollTop += l.bottom - i.bottom);
    });
    this.search = E(e) ? e : (I) => Promise.resolve(e(I)), this.autoSelect = s, this.setValue = i, this.setAttribute = l, this.onUpdate = n, this.onSubmit = u, this.autocorrect = h, this.onShow = r, this.onHide = w, this.onLoading = L, this.onLoaded = R, this.submitOnEnter = x;
  }
}
let H = 0;
const T = (t = "") => `${t}${++H}`, O = (t, e) => {
  const s = t.getBoundingClientRect(), i = e.getBoundingClientRect();
  return /* 1 */ s.bottom + i.height > window.innerHeight && /* 2 */
  window.innerHeight - s.bottom < s.top && /* 3 */
  window.pageYOffset + s.top - i.height > 0 ? "above" : "below";
}, M = (t, e, s) => {
  let i;
  return function() {
    const n = this, u = arguments, r = function() {
      i = null, s || t.apply(n, u);
    }, h = s && !i;
    clearTimeout(i), i = setTimeout(r, e), h && t.apply(n, u);
  };
}, K = (t) => {
  if (t != null && t.length) {
    const e = t.startsWith("#");
    return {
      attribute: e ? "aria-labelledby" : "aria-label",
      content: e ? t.substring(1) : t
    };
  }
}, N = (t, e) => {
  const s = t.__vccOpts || t;
  for (const [i, l] of e)
    s[i] = l;
  return s;
}, q = {
  name: "AutoComplete",
  inheritAttrs: !1,
  props: {
    search: {
      type: Function,
      required: !0
    },
    baseClass: {
      type: String,
      default: "autocomplete"
    },
    autoSelect: {
      type: Boolean,
      default: !1
    },
    getResultValue: {
      type: Function,
      default: (t) => t
    },
    defaultValue: {
      type: String,
      default: ""
    },
    debounceTime: {
      type: Number,
      default: 0
    },
    resultListLabel: {
      type: String,
      default: void 0
    },
    submitOnEnter: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["update", "submit"],
  data() {
    const t = new F({
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
    return this.debounceTime > 0 && (t.handleInput = M(t.handleInput, this.debounceTime)), {
      core: t,
      value: this.defaultValue,
      resultListId: T(`${this.baseClass}-result-list-`),
      results: [],
      selectedIndex: -1,
      expanded: !1,
      loading: !1,
      position: "below",
      resetPosition: !0
    };
  },
  computed: {
    rootProps() {
      return {
        class: this.baseClass,
        style: { position: "relative" },
        "data-expanded": this.expanded,
        "data-loading": this.loading,
        "data-position": this.position
      };
    },
    inputProps() {
      return {
        class: `${this.baseClass}-input`,
        value: this.value,
        role: "combobox",
        autocomplete: "off",
        autocapitalize: "off",
        autocorrect: "off",
        spellcheck: null,
        "aria-autocomplete": "list",
        "aria-haspopup": "listbox",
        "aria-owns": this.resultListId,
        "aria-expanded": this.expanded ? "true" : "false",
        "aria-activedescendant": this.selectedIndex > -1 ? this.resultProps[this.selectedIndex].id : "",
        ...this.$attrs
      };
    },
    inputListeners() {
      return {
        input: this.handleInput,
        keydown: this.core.handleKeyDown,
        focus: this.core.handleFocus,
        blur: this.core.handleBlur
      };
    },
    resultListProps() {
      const t = this.position === "below" ? "top" : "bottom", e = K(this.resultListLabel);
      return {
        id: this.resultListId,
        class: `${this.baseClass}-result-list`,
        role: "listbox",
        [e == null ? void 0 : e.attribute]: e == null ? void 0 : e.content,
        style: {
          position: "absolute",
          zIndex: 1,
          width: "100%",
          visibility: this.expanded ? "visible" : "hidden",
          pointerEvents: this.expanded ? "auto" : "none",
          [t]: "100%"
        }
      };
    },
    resultListListeners() {
      return {
        mousedown: this.core.handleResultMouseDown,
        click: this.core.handleResultClick
      };
    },
    resultProps() {
      return this.results.map((t, e) => ({
        id: `${this.baseClass}-result-${e}`,
        class: `${this.baseClass}-result`,
        "data-result-index": e,
        role: "option",
        ...this.selectedIndex === e ? { "aria-selected": "true" } : {}
      }));
    }
  },
  mounted() {
    document.body.addEventListener("click", this.handleDocumentClick);
  },
  beforeUnmount() {
    document.body.removeEventListener("click", this.handleDocumentClick);
  },
  updated() {
    !this.$refs.input || !this.$refs.resultList || (this.resetPosition && this.results.length > 0 && (this.resetPosition = !1, this.position = O(
      this.$refs.input,
      this.$refs.resultList
    )), this.core.checkSelectedResultVisible(this.$refs.resultList));
  },
  methods: {
    setValue(t) {
      this.value = t ? this.getResultValue(t) : "";
    },
    handleUpdate(t, e) {
      this.results = t, this.selectedIndex = e, this.$emit("update", t, e);
    },
    handleShow() {
      this.expanded = !0;
    },
    handleHide() {
      this.expanded = !1, this.resetPosition = !0;
    },
    handleLoading() {
      this.loading = !0;
    },
    handleLoaded() {
      this.loading = !1;
    },
    handleInput(t) {
      this.value = t.target.value, this.core.handleInput(t);
    },
    handleSubmit(t) {
      this.$emit("submit", t);
    },
    handleDocumentClick(t) {
      this.$refs.root.contains(t.target) || this.core.hideResults();
    }
  }
}, z = { ref: "root" };
function _(t, e, s, i, l, n) {
  return c(), p("div", z, [
    m(t.$slots, "default", {
      rootProps: n.rootProps,
      inputProps: n.inputProps,
      inputListeners: n.inputListeners,
      resultListProps: n.resultListProps,
      resultListListeners: n.resultListListeners,
      results: l.results,
      resultProps: n.resultProps
    }, () => [
      f("div", v(S(n.rootProps)), [
        f("input", b({ ref: "input" }, n.inputProps, {
          onInput: e[0] || (e[0] = (...u) => n.handleInput && n.handleInput(...u)),
          onKeydown: e[1] || (e[1] = (...u) => l.core.handleKeyDown && l.core.handleKeyDown(...u)),
          onFocus: e[2] || (e[2] = (...u) => l.core.handleFocus && l.core.handleFocus(...u)),
          onBlur: e[3] || (e[3] = (...u) => l.core.handleBlur && l.core.handleBlur(...u))
        }), null, 16),
        f("ul", b({ ref: "resultList" }, n.resultListProps, C(n.resultListListeners, !0)), [
          (c(!0), p(k, null, A(l.results, (u, r) => m(t.$slots, "result", {
            result: u,
            props: n.resultProps[r]
          }, () => [
            (c(), p("li", b({
              key: n.resultProps[r].id
            }, n.resultProps[r]), V(s.getResultValue(u)), 17))
          ])), 256))
        ], 16)
      ], 16)
    ])
  ], 512);
}
const g = /* @__PURE__ */ N(q, [["render", _]]);
function a(t) {
  a.installed || (a.installed = !0, t.component("AutoComplete", g));
}
const G = { install: a };
let d;
typeof window < "u" ? d = window.Vue : typeof global < "u" && (d = global.Vue);
d && d.use(G);
g.install = a;
export {
  g as default
};
