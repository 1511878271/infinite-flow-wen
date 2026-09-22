function mu(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var Ps = { exports: {} }, kn = {}, js = { exports: {} }, oe = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var la;
function pu() {
  if (la) return oe;
  la = 1;
  var t = Symbol.for("react.element"), e = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), r = Symbol.for("react.strict_mode"), s = Symbol.for("react.profiler"), i = Symbol.for("react.provider"), a = Symbol.for("react.context"), o = Symbol.for("react.forward_ref"), c = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.iterator;
  function m(g) {
    return g === null || typeof g != "object" ? null : (g = f && g[f] || g["@@iterator"], typeof g == "function" ? g : null);
  }
  var y = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, b = Object.assign, C = {};
  function S(g, R, $) {
    this.props = g, this.context = R, this.refs = C, this.updater = $ || y;
  }
  S.prototype.isReactComponent = {}, S.prototype.setState = function(g, R) {
    if (typeof g != "object" && typeof g != "function" && g != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, g, R, "setState");
  }, S.prototype.forceUpdate = function(g) {
    this.updater.enqueueForceUpdate(this, g, "forceUpdate");
  };
  function k() {
  }
  k.prototype = S.prototype;
  function j(g, R, $) {
    this.props = g, this.context = R, this.refs = C, this.updater = $ || y;
  }
  var E = j.prototype = new k();
  E.constructor = j, b(E, S.prototype), E.isPureReactComponent = !0;
  var D = Array.isArray, M = Object.prototype.hasOwnProperty, B = { current: null }, Q = { key: !0, ref: !0, __self: !0, __source: !0 };
  function V(g, R, $) {
    var re, se = {}, ge = null, Ce = null;
    if (R != null) for (re in R.ref !== void 0 && (Ce = R.ref), R.key !== void 0 && (ge = "" + R.key), R) M.call(R, re) && !Q.hasOwnProperty(re) && (se[re] = R[re]);
    var fe = arguments.length - 2;
    if (fe === 1) se.children = $;
    else if (1 < fe) {
      for (var ye = Array(fe), Pe = 0; Pe < fe; Pe++) ye[Pe] = arguments[Pe + 2];
      se.children = ye;
    }
    if (g && g.defaultProps) for (re in fe = g.defaultProps, fe) se[re] === void 0 && (se[re] = fe[re]);
    return { $$typeof: t, type: g, key: ge, ref: Ce, props: se, _owner: B.current };
  }
  function G(g, R) {
    return { $$typeof: t, type: g.type, key: R, ref: g.ref, props: g.props, _owner: g._owner };
  }
  function F(g) {
    return typeof g == "object" && g !== null && g.$$typeof === t;
  }
  function ie(g) {
    var R = { "=": "=0", ":": "=2" };
    return "$" + g.replace(/[=:]/g, function($) {
      return R[$];
    });
  }
  var xe = /\/+/g;
  function Se(g, R) {
    return typeof g == "object" && g !== null && g.key != null ? ie("" + g.key) : R.toString(36);
  }
  function me(g, R, $, re, se) {
    var ge = typeof g;
    (ge === "undefined" || ge === "boolean") && (g = null);
    var Ce = !1;
    if (g === null) Ce = !0;
    else switch (ge) {
      case "string":
      case "number":
        Ce = !0;
        break;
      case "object":
        switch (g.$$typeof) {
          case t:
          case e:
            Ce = !0;
        }
    }
    if (Ce) return Ce = g, se = se(Ce), g = re === "" ? "." + Se(Ce, 0) : re, D(se) ? ($ = "", g != null && ($ = g.replace(xe, "$&/") + "/"), me(se, R, $, "", function(Pe) {
      return Pe;
    })) : se != null && (F(se) && (se = G(se, $ + (!se.key || Ce && Ce.key === se.key ? "" : ("" + se.key).replace(xe, "$&/") + "/") + g)), R.push(se)), 1;
    if (Ce = 0, re = re === "" ? "." : re + ":", D(g)) for (var fe = 0; fe < g.length; fe++) {
      ge = g[fe];
      var ye = re + Se(ge, fe);
      Ce += me(ge, R, $, ye, se);
    }
    else if (ye = m(g), typeof ye == "function") for (g = ye.call(g), fe = 0; !(ge = g.next()).done; ) ge = ge.value, ye = re + Se(ge, fe++), Ce += me(ge, R, $, ye, se);
    else if (ge === "object") throw R = String(g), Error("Objects are not valid as a React child (found: " + (R === "[object Object]" ? "object with keys {" + Object.keys(g).join(", ") + "}" : R) + "). If you meant to render a collection of children, use an array instead.");
    return Ce;
  }
  function pe(g, R, $) {
    if (g == null) return g;
    var re = [], se = 0;
    return me(g, re, "", "", function(ge) {
      return R.call($, ge, se++);
    }), re;
  }
  function ue(g) {
    if (g._status === -1) {
      var R = g._result;
      R = R(), R.then(function($) {
        (g._status === 0 || g._status === -1) && (g._status = 1, g._result = $);
      }, function($) {
        (g._status === 0 || g._status === -1) && (g._status = 2, g._result = $);
      }), g._status === -1 && (g._status = 0, g._result = R);
    }
    if (g._status === 1) return g._result.default;
    throw g._result;
  }
  var Te = { current: null }, w = { transition: null }, Y = { ReactCurrentDispatcher: Te, ReactCurrentBatchConfig: w, ReactCurrentOwner: B };
  function K() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return oe.Children = { map: pe, forEach: function(g, R, $) {
    pe(g, function() {
      R.apply(this, arguments);
    }, $);
  }, count: function(g) {
    var R = 0;
    return pe(g, function() {
      R++;
    }), R;
  }, toArray: function(g) {
    return pe(g, function(R) {
      return R;
    }) || [];
  }, only: function(g) {
    if (!F(g)) throw Error("React.Children.only expected to receive a single React element child.");
    return g;
  } }, oe.Component = S, oe.Fragment = n, oe.Profiler = s, oe.PureComponent = j, oe.StrictMode = r, oe.Suspense = c, oe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Y, oe.act = K, oe.cloneElement = function(g, R, $) {
    if (g == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + g + ".");
    var re = b({}, g.props), se = g.key, ge = g.ref, Ce = g._owner;
    if (R != null) {
      if (R.ref !== void 0 && (ge = R.ref, Ce = B.current), R.key !== void 0 && (se = "" + R.key), g.type && g.type.defaultProps) var fe = g.type.defaultProps;
      for (ye in R) M.call(R, ye) && !Q.hasOwnProperty(ye) && (re[ye] = R[ye] === void 0 && fe !== void 0 ? fe[ye] : R[ye]);
    }
    var ye = arguments.length - 2;
    if (ye === 1) re.children = $;
    else if (1 < ye) {
      fe = Array(ye);
      for (var Pe = 0; Pe < ye; Pe++) fe[Pe] = arguments[Pe + 2];
      re.children = fe;
    }
    return { $$typeof: t, type: g.type, key: se, ref: ge, props: re, _owner: Ce };
  }, oe.createContext = function(g) {
    return g = { $$typeof: a, _currentValue: g, _currentValue2: g, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, g.Provider = { $$typeof: i, _context: g }, g.Consumer = g;
  }, oe.createElement = V, oe.createFactory = function(g) {
    var R = V.bind(null, g);
    return R.type = g, R;
  }, oe.createRef = function() {
    return { current: null };
  }, oe.forwardRef = function(g) {
    return { $$typeof: o, render: g };
  }, oe.isValidElement = F, oe.lazy = function(g) {
    return { $$typeof: d, _payload: { _status: -1, _result: g }, _init: ue };
  }, oe.memo = function(g, R) {
    return { $$typeof: u, type: g, compare: R === void 0 ? null : R };
  }, oe.startTransition = function(g) {
    var R = w.transition;
    w.transition = {};
    try {
      g();
    } finally {
      w.transition = R;
    }
  }, oe.unstable_act = K, oe.useCallback = function(g, R) {
    return Te.current.useCallback(g, R);
  }, oe.useContext = function(g) {
    return Te.current.useContext(g);
  }, oe.useDebugValue = function() {
  }, oe.useDeferredValue = function(g) {
    return Te.current.useDeferredValue(g);
  }, oe.useEffect = function(g, R) {
    return Te.current.useEffect(g, R);
  }, oe.useId = function() {
    return Te.current.useId();
  }, oe.useImperativeHandle = function(g, R, $) {
    return Te.current.useImperativeHandle(g, R, $);
  }, oe.useInsertionEffect = function(g, R) {
    return Te.current.useInsertionEffect(g, R);
  }, oe.useLayoutEffect = function(g, R) {
    return Te.current.useLayoutEffect(g, R);
  }, oe.useMemo = function(g, R) {
    return Te.current.useMemo(g, R);
  }, oe.useReducer = function(g, R, $) {
    return Te.current.useReducer(g, R, $);
  }, oe.useRef = function(g) {
    return Te.current.useRef(g);
  }, oe.useState = function(g) {
    return Te.current.useState(g);
  }, oe.useSyncExternalStore = function(g, R, $) {
    return Te.current.useSyncExternalStore(g, R, $);
  }, oe.useTransition = function() {
    return Te.current.useTransition();
  }, oe.version = "18.3.1", oe;
}
var Pn = { exports: {} };
Pn.exports;
var ca;
function gu() {
  return ca || (ca = 1, function(t, e) {
    var n = {};
    /**
     * @license React
     * react.development.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    n.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var r = "18.3.1", s = Symbol.for("react.element"), i = Symbol.for("react.portal"), a = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), c = Symbol.for("react.profiler"), u = Symbol.for("react.provider"), d = Symbol.for("react.context"), f = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), y = Symbol.for("react.suspense_list"), b = Symbol.for("react.memo"), C = Symbol.for("react.lazy"), S = Symbol.for("react.offscreen"), k = Symbol.iterator, j = "@@iterator";
      function E(l) {
        if (l === null || typeof l != "object")
          return null;
        var h = k && l[k] || l[j];
        return typeof h == "function" ? h : null;
      }
      var D = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, M = {
        transition: null
      }, B = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, Q = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, V = {}, G = null;
      function F(l) {
        G = l;
      }
      V.setExtraStackFrame = function(l) {
        G = l;
      }, V.getCurrentStack = null, V.getStackAddendum = function() {
        var l = "";
        G && (l += G);
        var h = V.getCurrentStack;
        return h && (l += h() || ""), l;
      };
      var ie = !1, xe = !1, Se = !1, me = !1, pe = !1, ue = {
        ReactCurrentDispatcher: D,
        ReactCurrentBatchConfig: M,
        ReactCurrentOwner: Q
      };
      ue.ReactDebugCurrentFrame = V, ue.ReactCurrentActQueue = B;
      function Te(l) {
        {
          for (var h = arguments.length, x = new Array(h > 1 ? h - 1 : 0), T = 1; T < h; T++)
            x[T - 1] = arguments[T];
          Y("warn", l, x);
        }
      }
      function w(l) {
        {
          for (var h = arguments.length, x = new Array(h > 1 ? h - 1 : 0), T = 1; T < h; T++)
            x[T - 1] = arguments[T];
          Y("error", l, x);
        }
      }
      function Y(l, h, x) {
        {
          var T = ue.ReactDebugCurrentFrame, O = T.getStackAddendum();
          O !== "" && (h += "%s", x = x.concat([O]));
          var X = x.map(function(z) {
            return String(z);
          });
          X.unshift("Warning: " + h), Function.prototype.apply.call(console[l], console, X);
        }
      }
      var K = {};
      function g(l, h) {
        {
          var x = l.constructor, T = x && (x.displayName || x.name) || "ReactClass", O = T + "." + h;
          if (K[O])
            return;
          w("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", h, T), K[O] = !0;
        }
      }
      var R = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function(l) {
          return !1;
        },
        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function(l, h, x) {
          g(l, "forceUpdate");
        },
        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function(l, h, x, T) {
          g(l, "replaceState");
        },
        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function(l, h, x, T) {
          g(l, "setState");
        }
      }, $ = Object.assign, re = {};
      Object.freeze(re);
      function se(l, h, x) {
        this.props = l, this.context = h, this.refs = re, this.updater = x || R;
      }
      se.prototype.isReactComponent = {}, se.prototype.setState = function(l, h) {
        if (typeof l != "object" && typeof l != "function" && l != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, l, h, "setState");
      }, se.prototype.forceUpdate = function(l) {
        this.updater.enqueueForceUpdate(this, l, "forceUpdate");
      };
      {
        var ge = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, Ce = function(l, h) {
          Object.defineProperty(se.prototype, l, {
            get: function() {
              Te("%s(...) is deprecated in plain JavaScript React classes. %s", h[0], h[1]);
            }
          });
        };
        for (var fe in ge)
          ge.hasOwnProperty(fe) && Ce(fe, ge[fe]);
      }
      function ye() {
      }
      ye.prototype = se.prototype;
      function Pe(l, h, x) {
        this.props = l, this.context = h, this.refs = re, this.updater = x || R;
      }
      var qe = Pe.prototype = new ye();
      qe.constructor = Pe, $(qe, se.prototype), qe.isPureReactComponent = !0;
      function ct() {
        var l = {
          current: null
        };
        return Object.seal(l), l;
      }
      var Kt = Array.isArray;
      function xt(l) {
        return Kt(l);
      }
      function yn(l) {
        {
          var h = typeof Symbol == "function" && Symbol.toStringTag, x = h && l[Symbol.toStringTag] || l.constructor.name || "Object";
          return x;
        }
      }
      function pt(l) {
        try {
          return P(l), !1;
        } catch {
          return !0;
        }
      }
      function P(l) {
        return "" + l;
      }
      function ce(l) {
        if (pt(l))
          return w("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", yn(l)), P(l);
      }
      function J(l, h, x) {
        var T = l.displayName;
        if (T)
          return T;
        var O = h.displayName || h.name || "";
        return O !== "" ? x + "(" + O + ")" : x;
      }
      function q(l) {
        return l.displayName || "Context";
      }
      function be(l) {
        if (l == null)
          return null;
        if (typeof l.tag == "number" && w("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof l == "function")
          return l.displayName || l.name || null;
        if (typeof l == "string")
          return l;
        switch (l) {
          case a:
            return "Fragment";
          case i:
            return "Portal";
          case c:
            return "Profiler";
          case o:
            return "StrictMode";
          case m:
            return "Suspense";
          case y:
            return "SuspenseList";
        }
        if (typeof l == "object")
          switch (l.$$typeof) {
            case d:
              var h = l;
              return q(h) + ".Consumer";
            case u:
              var x = l;
              return q(x._context) + ".Provider";
            case f:
              return J(l, l.render, "ForwardRef");
            case b:
              var T = l.displayName || null;
              return T !== null ? T : be(l.type) || "Memo";
            case C: {
              var O = l, X = O._payload, z = O._init;
              try {
                return be(z(X));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var Be = Object.prototype.hasOwnProperty, st = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, Vt, He, et;
      et = {};
      function Nt(l) {
        if (Be.call(l, "ref")) {
          var h = Object.getOwnPropertyDescriptor(l, "ref").get;
          if (h && h.isReactWarning)
            return !1;
        }
        return l.ref !== void 0;
      }
      function vn(l) {
        if (Be.call(l, "key")) {
          var h = Object.getOwnPropertyDescriptor(l, "key").get;
          if (h && h.isReactWarning)
            return !1;
        }
        return l.key !== void 0;
      }
      function Br(l, h) {
        var x = function() {
          Vt || (Vt = !0, w("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", h));
        };
        x.isReactWarning = !0, Object.defineProperty(l, "key", {
          get: x,
          configurable: !0
        });
      }
      function Kn(l, h) {
        var x = function() {
          He || (He = !0, w("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", h));
        };
        x.isReactWarning = !0, Object.defineProperty(l, "ref", {
          get: x,
          configurable: !0
        });
      }
      function Gn(l) {
        if (typeof l.ref == "string" && Q.current && l.__self && Q.current.stateNode !== l.__self) {
          var h = be(Q.current.type);
          et[h] || (w('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', h, l.ref), et[h] = !0);
        }
      }
      var xn = function(l, h, x, T, O, X, z) {
        var ee = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: s,
          // Built-in properties that belong on the element
          type: l,
          key: h,
          ref: x,
          props: z,
          // Record the component responsible for creating this element.
          _owner: X
        };
        return ee._store = {}, Object.defineProperty(ee._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(ee, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: T
        }), Object.defineProperty(ee, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: O
        }), Object.freeze && (Object.freeze(ee.props), Object.freeze(ee)), ee;
      };
      function $r(l, h, x) {
        var T, O = {}, X = null, z = null, ee = null, he = null;
        if (h != null) {
          Nt(h) && (z = h.ref, Gn(h)), vn(h) && (ce(h.key), X = "" + h.key), ee = h.__self === void 0 ? null : h.__self, he = h.__source === void 0 ? null : h.__source;
          for (T in h)
            Be.call(h, T) && !st.hasOwnProperty(T) && (O[T] = h[T]);
        }
        var Ee = arguments.length - 2;
        if (Ee === 1)
          O.children = x;
        else if (Ee > 1) {
          for (var je = Array(Ee), Ie = 0; Ie < Ee; Ie++)
            je[Ie] = arguments[Ie + 2];
          Object.freeze && Object.freeze(je), O.children = je;
        }
        if (l && l.defaultProps) {
          var De = l.defaultProps;
          for (T in De)
            O[T] === void 0 && (O[T] = De[T]);
        }
        if (X || z) {
          var Ne = typeof l == "function" ? l.displayName || l.name || "Unknown" : l;
          X && Br(O, Ne), z && Kn(O, Ne);
        }
        return xn(l, X, z, ee, he, Q.current, O);
      }
      function Wr(l, h) {
        var x = xn(l.type, h, l.ref, l._self, l._source, l._owner, l.props);
        return x;
      }
      function zr(l, h, x) {
        if (l == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + l + ".");
        var T, O = $({}, l.props), X = l.key, z = l.ref, ee = l._self, he = l._source, Ee = l._owner;
        if (h != null) {
          Nt(h) && (z = h.ref, Ee = Q.current), vn(h) && (ce(h.key), X = "" + h.key);
          var je;
          l.type && l.type.defaultProps && (je = l.type.defaultProps);
          for (T in h)
            Be.call(h, T) && !st.hasOwnProperty(T) && (h[T] === void 0 && je !== void 0 ? O[T] = je[T] : O[T] = h[T]);
        }
        var Ie = arguments.length - 2;
        if (Ie === 1)
          O.children = x;
        else if (Ie > 1) {
          for (var De = Array(Ie), Ne = 0; Ne < Ie; Ne++)
            De[Ne] = arguments[Ne + 2];
          O.children = De;
        }
        return xn(l.type, X, z, ee, he, Ee, O);
      }
      function bt(l) {
        return typeof l == "object" && l !== null && l.$$typeof === s;
      }
      var qn = ".", Zr = ":";
      function bn(l) {
        var h = /[=:]/g, x = {
          "=": "=0",
          ":": "=2"
        }, T = l.replace(h, function(O) {
          return x[O];
        });
        return "$" + T;
      }
      var wn = !1, wt = /\/+/g;
      function Gt(l) {
        return l.replace(wt, "$&/");
      }
      function Lt(l, h) {
        return typeof l == "object" && l !== null && l.key != null ? (ce(l.key), bn("" + l.key)) : h.toString(36);
      }
      function Ft(l, h, x, T, O) {
        var X = typeof l;
        (X === "undefined" || X === "boolean") && (l = null);
        var z = !1;
        if (l === null)
          z = !0;
        else
          switch (X) {
            case "string":
            case "number":
              z = !0;
              break;
            case "object":
              switch (l.$$typeof) {
                case s:
                case i:
                  z = !0;
              }
          }
        if (z) {
          var ee = l, he = O(ee), Ee = T === "" ? qn + Lt(ee, 0) : T;
          if (xt(he)) {
            var je = "";
            Ee != null && (je = Gt(Ee) + "/"), Ft(he, h, je, "", function(hu) {
              return hu;
            });
          } else he != null && (bt(he) && (he.key && (!ee || ee.key !== he.key) && ce(he.key), he = Wr(
            he,
            // Keep both the (mapped) and old keys if they differ, just as
            // traverseAllChildren used to do for objects as children
            x + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (he.key && (!ee || ee.key !== he.key) ? (
              // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
              // eslint-disable-next-line react-internal/safe-string-coercion
              Gt("" + he.key) + "/"
            ) : "") + Ee
          )), h.push(he));
          return 1;
        }
        var Ie, De, Ne = 0, We = T === "" ? qn : T + Zr;
        if (xt(l))
          for (var ar = 0; ar < l.length; ar++)
            Ie = l[ar], De = We + Lt(Ie, ar), Ne += Ft(Ie, h, x, De, O);
        else {
          var os = E(l);
          if (typeof os == "function") {
            var ia = l;
            os === ia.entries && (wn || Te("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), wn = !0);
            for (var du = os.call(ia), aa, fu = 0; !(aa = du.next()).done; )
              Ie = aa.value, De = We + Lt(Ie, fu++), Ne += Ft(Ie, h, x, De, O);
          } else if (X === "object") {
            var oa = String(l);
            throw new Error("Objects are not valid as a React child (found: " + (oa === "[object Object]" ? "object with keys {" + Object.keys(l).join(", ") + "}" : oa) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return Ne;
      }
      function qt(l, h, x) {
        if (l == null)
          return l;
        var T = [], O = 0;
        return Ft(l, T, "", "", function(X) {
          return h.call(x, X, O++);
        }), T;
      }
      function Xn(l) {
        var h = 0;
        return qt(l, function() {
          h++;
        }), h;
      }
      function Hr(l, h, x) {
        qt(l, function() {
          h.apply(this, arguments);
        }, x);
      }
      function Jn(l) {
        return qt(l, function(h) {
          return h;
        }) || [];
      }
      function Qn(l) {
        if (!bt(l))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return l;
      }
      function Yr(l) {
        var h = {
          $$typeof: d,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: l,
          _currentValue2: l,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null,
          // Add these to use same hidden class in VM as ServerContext
          _defaultValue: null,
          _globalName: null
        };
        h.Provider = {
          $$typeof: u,
          _context: h
        };
        var x = !1, T = !1, O = !1;
        {
          var X = {
            $$typeof: d,
            _context: h
          };
          Object.defineProperties(X, {
            Provider: {
              get: function() {
                return T || (T = !0, w("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), h.Provider;
              },
              set: function(z) {
                h.Provider = z;
              }
            },
            _currentValue: {
              get: function() {
                return h._currentValue;
              },
              set: function(z) {
                h._currentValue = z;
              }
            },
            _currentValue2: {
              get: function() {
                return h._currentValue2;
              },
              set: function(z) {
                h._currentValue2 = z;
              }
            },
            _threadCount: {
              get: function() {
                return h._threadCount;
              },
              set: function(z) {
                h._threadCount = z;
              }
            },
            Consumer: {
              get: function() {
                return x || (x = !0, w("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), h.Consumer;
              }
            },
            displayName: {
              get: function() {
                return h.displayName;
              },
              set: function(z) {
                O || (Te("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", z), O = !0);
              }
            }
          }), h.Consumer = X;
        }
        return h._currentRenderer = null, h._currentRenderer2 = null, h;
      }
      var Ut = -1, Xt = 0, _n = 1, Kr = 2;
      function Gr(l) {
        if (l._status === Ut) {
          var h = l._result, x = h();
          if (x.then(function(X) {
            if (l._status === Xt || l._status === Ut) {
              var z = l;
              z._status = _n, z._result = X;
            }
          }, function(X) {
            if (l._status === Xt || l._status === Ut) {
              var z = l;
              z._status = Kr, z._result = X;
            }
          }), l._status === Ut) {
            var T = l;
            T._status = Xt, T._result = x;
          }
        }
        if (l._status === _n) {
          var O = l._result;
          return O === void 0 && w(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, O), "default" in O || w(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, O), O.default;
        } else
          throw l._result;
      }
      function qr(l) {
        var h = {
          // We use these fields to store the result.
          _status: Ut,
          _result: l
        }, x = {
          $$typeof: C,
          _payload: h,
          _init: Gr
        };
        {
          var T, O;
          Object.defineProperties(x, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return T;
              },
              set: function(X) {
                w("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), T = X, Object.defineProperty(x, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return O;
              },
              set: function(X) {
                w("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), O = X, Object.defineProperty(x, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return x;
      }
      function Xr(l) {
        l != null && l.$$typeof === b ? w("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof l != "function" ? w("forwardRef requires a render function but was given %s.", l === null ? "null" : typeof l) : l.length !== 0 && l.length !== 2 && w("forwardRef render functions accept exactly two parameters: props and ref. %s", l.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), l != null && (l.defaultProps != null || l.propTypes != null) && w("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var h = {
          $$typeof: f,
          render: l
        };
        {
          var x;
          Object.defineProperty(h, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return x;
            },
            set: function(T) {
              x = T, !l.name && !l.displayName && (l.displayName = T);
            }
          });
        }
        return h;
      }
      var p;
      p = Symbol.for("react.module.reference");
      function A(l) {
        return !!(typeof l == "string" || typeof l == "function" || l === a || l === c || pe || l === o || l === m || l === y || me || l === S || ie || xe || Se || typeof l == "object" && l !== null && (l.$$typeof === C || l.$$typeof === b || l.$$typeof === u || l.$$typeof === d || l.$$typeof === f || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        l.$$typeof === p || l.getModuleId !== void 0));
      }
      function N(l, h) {
        A(l) || w("memo: The first argument must be a component. Instead received: %s", l === null ? "null" : typeof l);
        var x = {
          $$typeof: b,
          type: l,
          compare: h === void 0 ? null : h
        };
        {
          var T;
          Object.defineProperty(x, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return T;
            },
            set: function(O) {
              T = O, !l.name && !l.displayName && (l.displayName = O);
            }
          });
        }
        return x;
      }
      function W() {
        var l = D.current;
        return l === null && w(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), l;
      }
      function we(l) {
        var h = W();
        if (l._context !== void 0) {
          var x = l._context;
          x.Consumer === l ? w("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : x.Provider === l && w("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return h.useContext(l);
      }
      function ke(l) {
        var h = W();
        return h.useState(l);
      }
      function de(l, h, x) {
        var T = W();
        return T.useReducer(l, h, x);
      }
      function ae(l) {
        var h = W();
        return h.useRef(l);
      }
      function $e(l, h) {
        var x = W();
        return x.useEffect(l, h);
      }
      function Oe(l, h) {
        var x = W();
        return x.useInsertionEffect(l, h);
      }
      function Ve(l, h) {
        var x = W();
        return x.useLayoutEffect(l, h);
      }
      function Xe(l, h) {
        var x = W();
        return x.useCallback(l, h);
      }
      function _t(l, h) {
        var x = W();
        return x.useMemo(l, h);
      }
      function gt(l, h, x) {
        var T = W();
        return T.useImperativeHandle(l, h, x);
      }
      function Ye(l, h) {
        {
          var x = W();
          return x.useDebugValue(l, h);
        }
      }
      function Tn() {
        var l = W();
        return l.useTransition();
      }
      function Jr(l) {
        var h = W();
        return h.useDeferredValue(l);
      }
      function Qr() {
        var l = W();
        return l.useId();
      }
      function Hc(l, h, x) {
        var T = W();
        return T.useSyncExternalStore(l, h, x);
      }
      var Sn = 0, Li, Fi, Ui, Bi, $i, Wi, zi;
      function Zi() {
      }
      Zi.__reactDisabledLog = !0;
      function Yc() {
        {
          if (Sn === 0) {
            Li = console.log, Fi = console.info, Ui = console.warn, Bi = console.error, $i = console.group, Wi = console.groupCollapsed, zi = console.groupEnd;
            var l = {
              configurable: !0,
              enumerable: !0,
              value: Zi,
              writable: !0
            };
            Object.defineProperties(console, {
              info: l,
              log: l,
              warn: l,
              error: l,
              group: l,
              groupCollapsed: l,
              groupEnd: l
            });
          }
          Sn++;
        }
      }
      function Kc() {
        {
          if (Sn--, Sn === 0) {
            var l = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: $({}, l, {
                value: Li
              }),
              info: $({}, l, {
                value: Fi
              }),
              warn: $({}, l, {
                value: Ui
              }),
              error: $({}, l, {
                value: Bi
              }),
              group: $({}, l, {
                value: $i
              }),
              groupCollapsed: $({}, l, {
                value: Wi
              }),
              groupEnd: $({}, l, {
                value: zi
              })
            });
          }
          Sn < 0 && w("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var es = ue.ReactCurrentDispatcher, ts;
      function er(l, h, x) {
        {
          if (ts === void 0)
            try {
              throw Error();
            } catch (O) {
              var T = O.stack.trim().match(/\n( *(at )?)/);
              ts = T && T[1] || "";
            }
          return `
` + ts + l;
        }
      }
      var ns = !1, tr;
      {
        var Gc = typeof WeakMap == "function" ? WeakMap : Map;
        tr = new Gc();
      }
      function Hi(l, h) {
        if (!l || ns)
          return "";
        {
          var x = tr.get(l);
          if (x !== void 0)
            return x;
        }
        var T;
        ns = !0;
        var O = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var X;
        X = es.current, es.current = null, Yc();
        try {
          if (h) {
            var z = function() {
              throw Error();
            };
            if (Object.defineProperty(z.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(z, []);
              } catch (We) {
                T = We;
              }
              Reflect.construct(l, [], z);
            } else {
              try {
                z.call();
              } catch (We) {
                T = We;
              }
              l.call(z.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (We) {
              T = We;
            }
            l();
          }
        } catch (We) {
          if (We && T && typeof We.stack == "string") {
            for (var ee = We.stack.split(`
`), he = T.stack.split(`
`), Ee = ee.length - 1, je = he.length - 1; Ee >= 1 && je >= 0 && ee[Ee] !== he[je]; )
              je--;
            for (; Ee >= 1 && je >= 0; Ee--, je--)
              if (ee[Ee] !== he[je]) {
                if (Ee !== 1 || je !== 1)
                  do
                    if (Ee--, je--, je < 0 || ee[Ee] !== he[je]) {
                      var Ie = `
` + ee[Ee].replace(" at new ", " at ");
                      return l.displayName && Ie.includes("<anonymous>") && (Ie = Ie.replace("<anonymous>", l.displayName)), typeof l == "function" && tr.set(l, Ie), Ie;
                    }
                  while (Ee >= 1 && je >= 0);
                break;
              }
          }
        } finally {
          ns = !1, es.current = X, Kc(), Error.prepareStackTrace = O;
        }
        var De = l ? l.displayName || l.name : "", Ne = De ? er(De) : "";
        return typeof l == "function" && tr.set(l, Ne), Ne;
      }
      function qc(l, h, x) {
        return Hi(l, !1);
      }
      function Xc(l) {
        var h = l.prototype;
        return !!(h && h.isReactComponent);
      }
      function nr(l, h, x) {
        if (l == null)
          return "";
        if (typeof l == "function")
          return Hi(l, Xc(l));
        if (typeof l == "string")
          return er(l);
        switch (l) {
          case m:
            return er("Suspense");
          case y:
            return er("SuspenseList");
        }
        if (typeof l == "object")
          switch (l.$$typeof) {
            case f:
              return qc(l.render);
            case b:
              return nr(l.type, h, x);
            case C: {
              var T = l, O = T._payload, X = T._init;
              try {
                return nr(X(O), h, x);
              } catch {
              }
            }
          }
        return "";
      }
      var Yi = {}, Ki = ue.ReactDebugCurrentFrame;
      function rr(l) {
        if (l) {
          var h = l._owner, x = nr(l.type, l._source, h ? h.type : null);
          Ki.setExtraStackFrame(x);
        } else
          Ki.setExtraStackFrame(null);
      }
      function Jc(l, h, x, T, O) {
        {
          var X = Function.call.bind(Be);
          for (var z in l)
            if (X(l, z)) {
              var ee = void 0;
              try {
                if (typeof l[z] != "function") {
                  var he = Error((T || "React class") + ": " + x + " type `" + z + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof l[z] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw he.name = "Invariant Violation", he;
                }
                ee = l[z](h, z, T, x, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (Ee) {
                ee = Ee;
              }
              ee && !(ee instanceof Error) && (rr(O), w("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", T || "React class", x, z, typeof ee), rr(null)), ee instanceof Error && !(ee.message in Yi) && (Yi[ee.message] = !0, rr(O), w("Failed %s type: %s", x, ee.message), rr(null));
            }
        }
      }
      function Jt(l) {
        if (l) {
          var h = l._owner, x = nr(l.type, l._source, h ? h.type : null);
          F(x);
        } else
          F(null);
      }
      var rs;
      rs = !1;
      function Gi() {
        if (Q.current) {
          var l = be(Q.current.type);
          if (l)
            return `

Check the render method of \`` + l + "`.";
        }
        return "";
      }
      function Qc(l) {
        if (l !== void 0) {
          var h = l.fileName.replace(/^.*[\\\/]/, ""), x = l.lineNumber;
          return `

Check your code at ` + h + ":" + x + ".";
        }
        return "";
      }
      function eu(l) {
        return l != null ? Qc(l.__source) : "";
      }
      var qi = {};
      function tu(l) {
        var h = Gi();
        if (!h) {
          var x = typeof l == "string" ? l : l.displayName || l.name;
          x && (h = `

Check the top-level render call using <` + x + ">.");
        }
        return h;
      }
      function Xi(l, h) {
        if (!(!l._store || l._store.validated || l.key != null)) {
          l._store.validated = !0;
          var x = tu(h);
          if (!qi[x]) {
            qi[x] = !0;
            var T = "";
            l && l._owner && l._owner !== Q.current && (T = " It was passed a child from " + be(l._owner.type) + "."), Jt(l), w('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', x, T), Jt(null);
          }
        }
      }
      function Ji(l, h) {
        if (typeof l == "object") {
          if (xt(l))
            for (var x = 0; x < l.length; x++) {
              var T = l[x];
              bt(T) && Xi(T, h);
            }
          else if (bt(l))
            l._store && (l._store.validated = !0);
          else if (l) {
            var O = E(l);
            if (typeof O == "function" && O !== l.entries)
              for (var X = O.call(l), z; !(z = X.next()).done; )
                bt(z.value) && Xi(z.value, h);
          }
        }
      }
      function Qi(l) {
        {
          var h = l.type;
          if (h == null || typeof h == "string")
            return;
          var x;
          if (typeof h == "function")
            x = h.propTypes;
          else if (typeof h == "object" && (h.$$typeof === f || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          h.$$typeof === b))
            x = h.propTypes;
          else
            return;
          if (x) {
            var T = be(h);
            Jc(x, l.props, "prop", T, l);
          } else if (h.PropTypes !== void 0 && !rs) {
            rs = !0;
            var O = be(h);
            w("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", O || "Unknown");
          }
          typeof h.getDefaultProps == "function" && !h.getDefaultProps.isReactClassApproved && w("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function nu(l) {
        {
          for (var h = Object.keys(l.props), x = 0; x < h.length; x++) {
            var T = h[x];
            if (T !== "children" && T !== "key") {
              Jt(l), w("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", T), Jt(null);
              break;
            }
          }
          l.ref !== null && (Jt(l), w("Invalid attribute `ref` supplied to `React.Fragment`."), Jt(null));
        }
      }
      function ea(l, h, x) {
        var T = A(l);
        if (!T) {
          var O = "";
          (l === void 0 || typeof l == "object" && l !== null && Object.keys(l).length === 0) && (O += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var X = eu(h);
          X ? O += X : O += Gi();
          var z;
          l === null ? z = "null" : xt(l) ? z = "array" : l !== void 0 && l.$$typeof === s ? (z = "<" + (be(l.type) || "Unknown") + " />", O = " Did you accidentally export a JSX literal instead of a component?") : z = typeof l, w("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", z, O);
        }
        var ee = $r.apply(this, arguments);
        if (ee == null)
          return ee;
        if (T)
          for (var he = 2; he < arguments.length; he++)
            Ji(arguments[he], l);
        return l === a ? nu(ee) : Qi(ee), ee;
      }
      var ta = !1;
      function ru(l) {
        var h = ea.bind(null, l);
        return h.type = l, ta || (ta = !0, Te("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(h, "type", {
          enumerable: !1,
          get: function() {
            return Te("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: l
            }), l;
          }
        }), h;
      }
      function su(l, h, x) {
        for (var T = zr.apply(this, arguments), O = 2; O < arguments.length; O++)
          Ji(arguments[O], T.type);
        return Qi(T), T;
      }
      function iu(l, h) {
        var x = M.transition;
        M.transition = {};
        var T = M.transition;
        M.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          l();
        } finally {
          if (M.transition = x, x === null && T._updatedFibers) {
            var O = T._updatedFibers.size;
            O > 10 && Te("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), T._updatedFibers.clear();
          }
        }
      }
      var na = !1, sr = null;
      function au(l) {
        if (sr === null)
          try {
            var h = ("require" + Math.random()).slice(0, 7), x = t && t[h];
            sr = x.call(t, "timers").setImmediate;
          } catch {
            sr = function(O) {
              na === !1 && (na = !0, typeof MessageChannel > "u" && w("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var X = new MessageChannel();
              X.port1.onmessage = O, X.port2.postMessage(void 0);
            };
          }
        return sr(l);
      }
      var Qt = 0, ra = !1;
      function sa(l) {
        {
          var h = Qt;
          Qt++, B.current === null && (B.current = []);
          var x = B.isBatchingLegacy, T;
          try {
            if (B.isBatchingLegacy = !0, T = l(), !x && B.didScheduleLegacyUpdate) {
              var O = B.current;
              O !== null && (B.didScheduleLegacyUpdate = !1, as(O));
            }
          } catch (De) {
            throw ir(h), De;
          } finally {
            B.isBatchingLegacy = x;
          }
          if (T !== null && typeof T == "object" && typeof T.then == "function") {
            var X = T, z = !1, ee = {
              then: function(De, Ne) {
                z = !0, X.then(function(We) {
                  ir(h), Qt === 0 ? ss(We, De, Ne) : De(We);
                }, function(We) {
                  ir(h), Ne(We);
                });
              }
            };
            return !ra && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              z || (ra = !0, w("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), ee;
          } else {
            var he = T;
            if (ir(h), Qt === 0) {
              var Ee = B.current;
              Ee !== null && (as(Ee), B.current = null);
              var je = {
                then: function(De, Ne) {
                  B.current === null ? (B.current = [], ss(he, De, Ne)) : De(he);
                }
              };
              return je;
            } else {
              var Ie = {
                then: function(De, Ne) {
                  De(he);
                }
              };
              return Ie;
            }
          }
        }
      }
      function ir(l) {
        l !== Qt - 1 && w("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), Qt = l;
      }
      function ss(l, h, x) {
        {
          var T = B.current;
          if (T !== null)
            try {
              as(T), au(function() {
                T.length === 0 ? (B.current = null, h(l)) : ss(l, h, x);
              });
            } catch (O) {
              x(O);
            }
          else
            h(l);
        }
      }
      var is = !1;
      function as(l) {
        if (!is) {
          is = !0;
          var h = 0;
          try {
            for (; h < l.length; h++) {
              var x = l[h];
              do
                x = x(!0);
              while (x !== null);
            }
            l.length = 0;
          } catch (T) {
            throw l = l.slice(h + 1), T;
          } finally {
            is = !1;
          }
        }
      }
      var ou = ea, lu = su, cu = ru, uu = {
        map: qt,
        forEach: Hr,
        count: Xn,
        toArray: Jn,
        only: Qn
      };
      e.Children = uu, e.Component = se, e.Fragment = a, e.Profiler = c, e.PureComponent = Pe, e.StrictMode = o, e.Suspense = m, e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ue, e.act = sa, e.cloneElement = lu, e.createContext = Yr, e.createElement = ou, e.createFactory = cu, e.createRef = ct, e.forwardRef = Xr, e.isValidElement = bt, e.lazy = qr, e.memo = N, e.startTransition = iu, e.unstable_act = sa, e.useCallback = Xe, e.useContext = we, e.useDebugValue = Ye, e.useDeferredValue = Jr, e.useEffect = $e, e.useId = Qr, e.useImperativeHandle = gt, e.useInsertionEffect = Oe, e.useLayoutEffect = Ve, e.useMemo = _t, e.useReducer = de, e.useRef = ae, e.useState = ke, e.useSyncExternalStore = Hc, e.useTransition = Tn, e.version = r, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(Pn, Pn.exports)), Pn.exports;
}
var yu = {};
yu.NODE_ENV === "production" ? js.exports = pu() : js.exports = gu();
var _ = js.exports;
const vu = /* @__PURE__ */ mu(_);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ua;
function xu() {
  if (ua) return kn;
  ua = 1;
  var t = _, e = Symbol.for("react.element"), n = Symbol.for("react.fragment"), r = Object.prototype.hasOwnProperty, s = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, i = { key: !0, ref: !0, __self: !0, __source: !0 };
  function a(o, c, u) {
    var d, f = {}, m = null, y = null;
    u !== void 0 && (m = "" + u), c.key !== void 0 && (m = "" + c.key), c.ref !== void 0 && (y = c.ref);
    for (d in c) r.call(c, d) && !i.hasOwnProperty(d) && (f[d] = c[d]);
    if (o && o.defaultProps) for (d in c = o.defaultProps, c) f[d] === void 0 && (f[d] = c[d]);
    return { $$typeof: e, type: o, key: m, ref: y, props: f, _owner: s.current };
  }
  return kn.Fragment = n, kn.jsx = a, kn.jsxs = a, kn;
}
var Cn = {}, da;
function bu() {
  if (da) return Cn;
  da = 1;
  var t = {};
  /**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  return t.NODE_ENV !== "production" && function() {
    var e = _, n = Symbol.for("react.element"), r = Symbol.for("react.portal"), s = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.provider"), c = Symbol.for("react.context"), u = Symbol.for("react.forward_ref"), d = Symbol.for("react.suspense"), f = Symbol.for("react.suspense_list"), m = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), b = Symbol.for("react.offscreen"), C = Symbol.iterator, S = "@@iterator";
    function k(p) {
      if (p === null || typeof p != "object")
        return null;
      var A = C && p[C] || p[S];
      return typeof A == "function" ? A : null;
    }
    var j = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function E(p) {
      {
        for (var A = arguments.length, N = new Array(A > 1 ? A - 1 : 0), W = 1; W < A; W++)
          N[W - 1] = arguments[W];
        D("error", p, N);
      }
    }
    function D(p, A, N) {
      {
        var W = j.ReactDebugCurrentFrame, we = W.getStackAddendum();
        we !== "" && (A += "%s", N = N.concat([we]));
        var ke = N.map(function(de) {
          return String(de);
        });
        ke.unshift("Warning: " + A), Function.prototype.apply.call(console[p], console, ke);
      }
    }
    var M = !1, B = !1, Q = !1, V = !1, G = !1, F;
    F = Symbol.for("react.module.reference");
    function ie(p) {
      return !!(typeof p == "string" || typeof p == "function" || p === s || p === a || G || p === i || p === d || p === f || V || p === b || M || B || Q || typeof p == "object" && p !== null && (p.$$typeof === y || p.$$typeof === m || p.$$typeof === o || p.$$typeof === c || p.$$typeof === u || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      p.$$typeof === F || p.getModuleId !== void 0));
    }
    function xe(p, A, N) {
      var W = p.displayName;
      if (W)
        return W;
      var we = A.displayName || A.name || "";
      return we !== "" ? N + "(" + we + ")" : N;
    }
    function Se(p) {
      return p.displayName || "Context";
    }
    function me(p) {
      if (p == null)
        return null;
      if (typeof p.tag == "number" && E("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof p == "function")
        return p.displayName || p.name || null;
      if (typeof p == "string")
        return p;
      switch (p) {
        case s:
          return "Fragment";
        case r:
          return "Portal";
        case a:
          return "Profiler";
        case i:
          return "StrictMode";
        case d:
          return "Suspense";
        case f:
          return "SuspenseList";
      }
      if (typeof p == "object")
        switch (p.$$typeof) {
          case c:
            var A = p;
            return Se(A) + ".Consumer";
          case o:
            var N = p;
            return Se(N._context) + ".Provider";
          case u:
            return xe(p, p.render, "ForwardRef");
          case m:
            var W = p.displayName || null;
            return W !== null ? W : me(p.type) || "Memo";
          case y: {
            var we = p, ke = we._payload, de = we._init;
            try {
              return me(de(ke));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var pe = Object.assign, ue = 0, Te, w, Y, K, g, R, $;
    function re() {
    }
    re.__reactDisabledLog = !0;
    function se() {
      {
        if (ue === 0) {
          Te = console.log, w = console.info, Y = console.warn, K = console.error, g = console.group, R = console.groupCollapsed, $ = console.groupEnd;
          var p = {
            configurable: !0,
            enumerable: !0,
            value: re,
            writable: !0
          };
          Object.defineProperties(console, {
            info: p,
            log: p,
            warn: p,
            error: p,
            group: p,
            groupCollapsed: p,
            groupEnd: p
          });
        }
        ue++;
      }
    }
    function ge() {
      {
        if (ue--, ue === 0) {
          var p = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: pe({}, p, {
              value: Te
            }),
            info: pe({}, p, {
              value: w
            }),
            warn: pe({}, p, {
              value: Y
            }),
            error: pe({}, p, {
              value: K
            }),
            group: pe({}, p, {
              value: g
            }),
            groupCollapsed: pe({}, p, {
              value: R
            }),
            groupEnd: pe({}, p, {
              value: $
            })
          });
        }
        ue < 0 && E("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Ce = j.ReactCurrentDispatcher, fe;
    function ye(p, A, N) {
      {
        if (fe === void 0)
          try {
            throw Error();
          } catch (we) {
            var W = we.stack.trim().match(/\n( *(at )?)/);
            fe = W && W[1] || "";
          }
        return `
` + fe + p;
      }
    }
    var Pe = !1, qe;
    {
      var ct = typeof WeakMap == "function" ? WeakMap : Map;
      qe = new ct();
    }
    function Kt(p, A) {
      if (!p || Pe)
        return "";
      {
        var N = qe.get(p);
        if (N !== void 0)
          return N;
      }
      var W;
      Pe = !0;
      var we = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var ke;
      ke = Ce.current, Ce.current = null, se();
      try {
        if (A) {
          var de = function() {
            throw Error();
          };
          if (Object.defineProperty(de.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(de, []);
            } catch (Ye) {
              W = Ye;
            }
            Reflect.construct(p, [], de);
          } else {
            try {
              de.call();
            } catch (Ye) {
              W = Ye;
            }
            p.call(de.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Ye) {
            W = Ye;
          }
          p();
        }
      } catch (Ye) {
        if (Ye && W && typeof Ye.stack == "string") {
          for (var ae = Ye.stack.split(`
`), $e = W.stack.split(`
`), Oe = ae.length - 1, Ve = $e.length - 1; Oe >= 1 && Ve >= 0 && ae[Oe] !== $e[Ve]; )
            Ve--;
          for (; Oe >= 1 && Ve >= 0; Oe--, Ve--)
            if (ae[Oe] !== $e[Ve]) {
              if (Oe !== 1 || Ve !== 1)
                do
                  if (Oe--, Ve--, Ve < 0 || ae[Oe] !== $e[Ve]) {
                    var Xe = `
` + ae[Oe].replace(" at new ", " at ");
                    return p.displayName && Xe.includes("<anonymous>") && (Xe = Xe.replace("<anonymous>", p.displayName)), typeof p == "function" && qe.set(p, Xe), Xe;
                  }
                while (Oe >= 1 && Ve >= 0);
              break;
            }
        }
      } finally {
        Pe = !1, Ce.current = ke, ge(), Error.prepareStackTrace = we;
      }
      var _t = p ? p.displayName || p.name : "", gt = _t ? ye(_t) : "";
      return typeof p == "function" && qe.set(p, gt), gt;
    }
    function xt(p, A, N) {
      return Kt(p, !1);
    }
    function yn(p) {
      var A = p.prototype;
      return !!(A && A.isReactComponent);
    }
    function pt(p, A, N) {
      if (p == null)
        return "";
      if (typeof p == "function")
        return Kt(p, yn(p));
      if (typeof p == "string")
        return ye(p);
      switch (p) {
        case d:
          return ye("Suspense");
        case f:
          return ye("SuspenseList");
      }
      if (typeof p == "object")
        switch (p.$$typeof) {
          case u:
            return xt(p.render);
          case m:
            return pt(p.type, A, N);
          case y: {
            var W = p, we = W._payload, ke = W._init;
            try {
              return pt(ke(we), A, N);
            } catch {
            }
          }
        }
      return "";
    }
    var P = Object.prototype.hasOwnProperty, ce = {}, J = j.ReactDebugCurrentFrame;
    function q(p) {
      if (p) {
        var A = p._owner, N = pt(p.type, p._source, A ? A.type : null);
        J.setExtraStackFrame(N);
      } else
        J.setExtraStackFrame(null);
    }
    function be(p, A, N, W, we) {
      {
        var ke = Function.call.bind(P);
        for (var de in p)
          if (ke(p, de)) {
            var ae = void 0;
            try {
              if (typeof p[de] != "function") {
                var $e = Error((W || "React class") + ": " + N + " type `" + de + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof p[de] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw $e.name = "Invariant Violation", $e;
              }
              ae = p[de](A, de, W, N, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (Oe) {
              ae = Oe;
            }
            ae && !(ae instanceof Error) && (q(we), E("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", W || "React class", N, de, typeof ae), q(null)), ae instanceof Error && !(ae.message in ce) && (ce[ae.message] = !0, q(we), E("Failed %s type: %s", N, ae.message), q(null));
          }
      }
    }
    var Be = Array.isArray;
    function st(p) {
      return Be(p);
    }
    function Vt(p) {
      {
        var A = typeof Symbol == "function" && Symbol.toStringTag, N = A && p[Symbol.toStringTag] || p.constructor.name || "Object";
        return N;
      }
    }
    function He(p) {
      try {
        return et(p), !1;
      } catch {
        return !0;
      }
    }
    function et(p) {
      return "" + p;
    }
    function Nt(p) {
      if (He(p))
        return E("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Vt(p)), et(p);
    }
    var vn = j.ReactCurrentOwner, Br = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Kn, Gn;
    function xn(p) {
      if (P.call(p, "ref")) {
        var A = Object.getOwnPropertyDescriptor(p, "ref").get;
        if (A && A.isReactWarning)
          return !1;
      }
      return p.ref !== void 0;
    }
    function $r(p) {
      if (P.call(p, "key")) {
        var A = Object.getOwnPropertyDescriptor(p, "key").get;
        if (A && A.isReactWarning)
          return !1;
      }
      return p.key !== void 0;
    }
    function Wr(p, A) {
      typeof p.ref == "string" && vn.current;
    }
    function zr(p, A) {
      {
        var N = function() {
          Kn || (Kn = !0, E("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", A));
        };
        N.isReactWarning = !0, Object.defineProperty(p, "key", {
          get: N,
          configurable: !0
        });
      }
    }
    function bt(p, A) {
      {
        var N = function() {
          Gn || (Gn = !0, E("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", A));
        };
        N.isReactWarning = !0, Object.defineProperty(p, "ref", {
          get: N,
          configurable: !0
        });
      }
    }
    var qn = function(p, A, N, W, we, ke, de) {
      var ae = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: n,
        // Built-in properties that belong on the element
        type: p,
        key: A,
        ref: N,
        props: de,
        // Record the component responsible for creating this element.
        _owner: ke
      };
      return ae._store = {}, Object.defineProperty(ae._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(ae, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: W
      }), Object.defineProperty(ae, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: we
      }), Object.freeze && (Object.freeze(ae.props), Object.freeze(ae)), ae;
    };
    function Zr(p, A, N, W, we) {
      {
        var ke, de = {}, ae = null, $e = null;
        N !== void 0 && (Nt(N), ae = "" + N), $r(A) && (Nt(A.key), ae = "" + A.key), xn(A) && ($e = A.ref, Wr(A, we));
        for (ke in A)
          P.call(A, ke) && !Br.hasOwnProperty(ke) && (de[ke] = A[ke]);
        if (p && p.defaultProps) {
          var Oe = p.defaultProps;
          for (ke in Oe)
            de[ke] === void 0 && (de[ke] = Oe[ke]);
        }
        if (ae || $e) {
          var Ve = typeof p == "function" ? p.displayName || p.name || "Unknown" : p;
          ae && zr(de, Ve), $e && bt(de, Ve);
        }
        return qn(p, ae, $e, we, W, vn.current, de);
      }
    }
    var bn = j.ReactCurrentOwner, wn = j.ReactDebugCurrentFrame;
    function wt(p) {
      if (p) {
        var A = p._owner, N = pt(p.type, p._source, A ? A.type : null);
        wn.setExtraStackFrame(N);
      } else
        wn.setExtraStackFrame(null);
    }
    var Gt;
    Gt = !1;
    function Lt(p) {
      return typeof p == "object" && p !== null && p.$$typeof === n;
    }
    function Ft() {
      {
        if (bn.current) {
          var p = me(bn.current.type);
          if (p)
            return `

Check the render method of \`` + p + "`.";
        }
        return "";
      }
    }
    function qt(p) {
      return "";
    }
    var Xn = {};
    function Hr(p) {
      {
        var A = Ft();
        if (!A) {
          var N = typeof p == "string" ? p : p.displayName || p.name;
          N && (A = `

Check the top-level render call using <` + N + ">.");
        }
        return A;
      }
    }
    function Jn(p, A) {
      {
        if (!p._store || p._store.validated || p.key != null)
          return;
        p._store.validated = !0;
        var N = Hr(A);
        if (Xn[N])
          return;
        Xn[N] = !0;
        var W = "";
        p && p._owner && p._owner !== bn.current && (W = " It was passed a child from " + me(p._owner.type) + "."), wt(p), E('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', N, W), wt(null);
      }
    }
    function Qn(p, A) {
      {
        if (typeof p != "object")
          return;
        if (st(p))
          for (var N = 0; N < p.length; N++) {
            var W = p[N];
            Lt(W) && Jn(W, A);
          }
        else if (Lt(p))
          p._store && (p._store.validated = !0);
        else if (p) {
          var we = k(p);
          if (typeof we == "function" && we !== p.entries)
            for (var ke = we.call(p), de; !(de = ke.next()).done; )
              Lt(de.value) && Jn(de.value, A);
        }
      }
    }
    function Yr(p) {
      {
        var A = p.type;
        if (A == null || typeof A == "string")
          return;
        var N;
        if (typeof A == "function")
          N = A.propTypes;
        else if (typeof A == "object" && (A.$$typeof === u || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        A.$$typeof === m))
          N = A.propTypes;
        else
          return;
        if (N) {
          var W = me(A);
          be(N, p.props, "prop", W, p);
        } else if (A.PropTypes !== void 0 && !Gt) {
          Gt = !0;
          var we = me(A);
          E("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", we || "Unknown");
        }
        typeof A.getDefaultProps == "function" && !A.getDefaultProps.isReactClassApproved && E("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Ut(p) {
      {
        for (var A = Object.keys(p.props), N = 0; N < A.length; N++) {
          var W = A[N];
          if (W !== "children" && W !== "key") {
            wt(p), E("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", W), wt(null);
            break;
          }
        }
        p.ref !== null && (wt(p), E("Invalid attribute `ref` supplied to `React.Fragment`."), wt(null));
      }
    }
    var Xt = {};
    function _n(p, A, N, W, we, ke) {
      {
        var de = ie(p);
        if (!de) {
          var ae = "";
          (p === void 0 || typeof p == "object" && p !== null && Object.keys(p).length === 0) && (ae += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var $e = qt();
          $e ? ae += $e : ae += Ft();
          var Oe;
          p === null ? Oe = "null" : st(p) ? Oe = "array" : p !== void 0 && p.$$typeof === n ? (Oe = "<" + (me(p.type) || "Unknown") + " />", ae = " Did you accidentally export a JSX literal instead of a component?") : Oe = typeof p, E("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Oe, ae);
        }
        var Ve = Zr(p, A, N, we, ke);
        if (Ve == null)
          return Ve;
        if (de) {
          var Xe = A.children;
          if (Xe !== void 0)
            if (W)
              if (st(Xe)) {
                for (var _t = 0; _t < Xe.length; _t++)
                  Qn(Xe[_t], p);
                Object.freeze && Object.freeze(Xe);
              } else
                E("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Qn(Xe, p);
        }
        if (P.call(A, "key")) {
          var gt = me(p), Ye = Object.keys(A).filter(function(Qr) {
            return Qr !== "key";
          }), Tn = Ye.length > 0 ? "{key: someKey, " + Ye.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Xt[gt + Tn]) {
            var Jr = Ye.length > 0 ? "{" + Ye.join(": ..., ") + ": ...}" : "{}";
            E(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Tn, gt, Jr, gt), Xt[gt + Tn] = !0;
          }
        }
        return p === s ? Ut(Ve) : Yr(Ve), Ve;
      }
    }
    function Kr(p, A, N) {
      return _n(p, A, N, !0);
    }
    function Gr(p, A, N) {
      return _n(p, A, N, !1);
    }
    var qr = Gr, Xr = Kr;
    Cn.Fragment = s, Cn.jsx = qr, Cn.jsxs = Xr;
  }(), Cn;
}
var wu = {};
wu.NODE_ENV === "production" ? Ps.exports = xu() : Ps.exports = bu();
var v = Ps.exports, _e;
(function(t) {
  t.assertEqual = (s) => {
  };
  function e(s) {
  }
  t.assertIs = e;
  function n(s) {
    throw new Error();
  }
  t.assertNever = n, t.arrayToEnum = (s) => {
    const i = {};
    for (const a of s)
      i[a] = a;
    return i;
  }, t.getValidEnumValues = (s) => {
    const i = t.objectKeys(s).filter((o) => typeof s[s[o]] != "number"), a = {};
    for (const o of i)
      a[o] = s[o];
    return t.objectValues(a);
  }, t.objectValues = (s) => t.objectKeys(s).map(function(i) {
    return s[i];
  }), t.objectKeys = typeof Object.keys == "function" ? (s) => Object.keys(s) : (s) => {
    const i = [];
    for (const a in s)
      Object.prototype.hasOwnProperty.call(s, a) && i.push(a);
    return i;
  }, t.find = (s, i) => {
    for (const a of s)
      if (i(a))
        return a;
  }, t.isInteger = typeof Number.isInteger == "function" ? (s) => Number.isInteger(s) : (s) => typeof s == "number" && Number.isFinite(s) && Math.floor(s) === s;
  function r(s, i = " | ") {
    return s.map((a) => typeof a == "string" ? `'${a}'` : a).join(i);
  }
  t.joinValues = r, t.jsonStringifyReplacer = (s, i) => typeof i == "bigint" ? i.toString() : i;
})(_e || (_e = {}));
var fa;
(function(t) {
  t.mergeShapes = (e, n) => ({
    ...e,
    ...n
    // second overwrites first
  });
})(fa || (fa = {}));
const Z = _e.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), Ct = (t) => {
  switch (typeof t) {
    case "undefined":
      return Z.undefined;
    case "string":
      return Z.string;
    case "number":
      return Number.isNaN(t) ? Z.nan : Z.number;
    case "boolean":
      return Z.boolean;
    case "function":
      return Z.function;
    case "bigint":
      return Z.bigint;
    case "symbol":
      return Z.symbol;
    case "object":
      return Array.isArray(t) ? Z.array : t === null ? Z.null : t.then && typeof t.then == "function" && t.catch && typeof t.catch == "function" ? Z.promise : typeof Map < "u" && t instanceof Map ? Z.map : typeof Set < "u" && t instanceof Set ? Z.set : typeof Date < "u" && t instanceof Date ? Z.date : Z.object;
    default:
      return Z.unknown;
  }
}, I = _e.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class yt extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (r) => {
      this.issues = [...this.issues, r];
    }, this.addIssues = (r = []) => {
      this.issues = [...this.issues, ...r];
    };
    const n = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, n) : this.__proto__ = n, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const n = e || function(i) {
      return i.message;
    }, r = { _errors: [] }, s = (i) => {
      for (const a of i.issues)
        if (a.code === "invalid_union")
          a.unionErrors.map(s);
        else if (a.code === "invalid_return_type")
          s(a.returnTypeError);
        else if (a.code === "invalid_arguments")
          s(a.argumentsError);
        else if (a.path.length === 0)
          r._errors.push(n(a));
        else {
          let o = r, c = 0;
          for (; c < a.path.length; ) {
            const u = a.path[c];
            c === a.path.length - 1 ? (o[u] = o[u] || { _errors: [] }, o[u]._errors.push(n(a))) : o[u] = o[u] || { _errors: [] }, o = o[u], c++;
          }
        }
    };
    return s(this), r;
  }
  static assert(e) {
    if (!(e instanceof yt))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, _e.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (n) => n.message) {
    const n = {}, r = [];
    for (const s of this.issues)
      if (s.path.length > 0) {
        const i = s.path[0];
        n[i] = n[i] || [], n[i].push(e(s));
      } else
        r.push(e(s));
    return { formErrors: r, fieldErrors: n };
  }
  get formErrors() {
    return this.flatten();
  }
}
yt.create = (t) => new yt(t);
const Is = (t, e) => {
  let n;
  switch (t.code) {
    case I.invalid_type:
      t.received === Z.undefined ? n = "Required" : n = `Expected ${t.expected}, received ${t.received}`;
      break;
    case I.invalid_literal:
      n = `Invalid literal value, expected ${JSON.stringify(t.expected, _e.jsonStringifyReplacer)}`;
      break;
    case I.unrecognized_keys:
      n = `Unrecognized key(s) in object: ${_e.joinValues(t.keys, ", ")}`;
      break;
    case I.invalid_union:
      n = "Invalid input";
      break;
    case I.invalid_union_discriminator:
      n = `Invalid discriminator value. Expected ${_e.joinValues(t.options)}`;
      break;
    case I.invalid_enum_value:
      n = `Invalid enum value. Expected ${_e.joinValues(t.options)}, received '${t.received}'`;
      break;
    case I.invalid_arguments:
      n = "Invalid function arguments";
      break;
    case I.invalid_return_type:
      n = "Invalid function return type";
      break;
    case I.invalid_date:
      n = "Invalid date";
      break;
    case I.invalid_string:
      typeof t.validation == "object" ? "includes" in t.validation ? (n = `Invalid input: must include "${t.validation.includes}"`, typeof t.validation.position == "number" && (n = `${n} at one or more positions greater than or equal to ${t.validation.position}`)) : "startsWith" in t.validation ? n = `Invalid input: must start with "${t.validation.startsWith}"` : "endsWith" in t.validation ? n = `Invalid input: must end with "${t.validation.endsWith}"` : _e.assertNever(t.validation) : t.validation !== "regex" ? n = `Invalid ${t.validation}` : n = "Invalid";
      break;
    case I.too_small:
      t.type === "array" ? n = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "more than"} ${t.minimum} element(s)` : t.type === "string" ? n = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at least" : "over"} ${t.minimum} character(s)` : t.type === "number" ? n = `Number must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${t.minimum}` : t.type === "bigint" ? n = `Number must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${t.minimum}` : t.type === "date" ? n = `Date must be ${t.exact ? "exactly equal to " : t.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(t.minimum))}` : n = "Invalid input";
      break;
    case I.too_big:
      t.type === "array" ? n = `Array must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "less than"} ${t.maximum} element(s)` : t.type === "string" ? n = `String must contain ${t.exact ? "exactly" : t.inclusive ? "at most" : "under"} ${t.maximum} character(s)` : t.type === "number" ? n = `Number must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : t.type === "bigint" ? n = `BigInt must be ${t.exact ? "exactly" : t.inclusive ? "less than or equal to" : "less than"} ${t.maximum}` : t.type === "date" ? n = `Date must be ${t.exact ? "exactly" : t.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(t.maximum))}` : n = "Invalid input";
      break;
    case I.custom:
      n = "Invalid input";
      break;
    case I.invalid_intersection_types:
      n = "Intersection results could not be merged";
      break;
    case I.not_multiple_of:
      n = `Number must be a multiple of ${t.multipleOf}`;
      break;
    case I.not_finite:
      n = "Number must be finite";
      break;
    default:
      n = e.defaultError, _e.assertNever(t);
  }
  return { message: n };
};
let _u = Is;
function Tu() {
  return _u;
}
const Su = (t) => {
  const { data: e, path: n, errorMaps: r, issueData: s } = t, i = [...n, ...s.path || []], a = {
    ...s,
    path: i
  };
  if (s.message !== void 0)
    return {
      ...s,
      path: i,
      message: s.message
    };
  let o = "";
  const c = r.filter((u) => !!u).slice().reverse();
  for (const u of c)
    o = u(a, { data: e, defaultError: o }).message;
  return {
    ...s,
    path: i,
    message: o
  };
};
function L(t, e) {
  const n = Tu(), r = Su({
    issueData: e,
    data: t.data,
    path: t.path,
    errorMaps: [
      t.common.contextualErrorMap,
      // contextual error map is first priority
      t.schemaErrorMap,
      // then schema-bound map if available
      n,
      // then global override map
      n === Is ? void 0 : Is
      // then global default map
    ].filter((s) => !!s)
  });
  t.common.issues.push(r);
}
class Qe {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, n) {
    const r = [];
    for (const s of n) {
      if (s.status === "aborted")
        return te;
      s.status === "dirty" && e.dirty(), r.push(s.value);
    }
    return { status: e.value, value: r };
  }
  static async mergeObjectAsync(e, n) {
    const r = [];
    for (const s of n) {
      const i = await s.key, a = await s.value;
      r.push({
        key: i,
        value: a
      });
    }
    return Qe.mergeObjectSync(e, r);
  }
  static mergeObjectSync(e, n) {
    const r = {};
    for (const s of n) {
      const { key: i, value: a } = s;
      if (i.status === "aborted" || a.status === "aborted")
        return te;
      i.status === "dirty" && e.dirty(), a.status === "dirty" && e.dirty(), i.value !== "__proto__" && (typeof a.value < "u" || s.alwaysSet) && (r[i.value] = a.value);
    }
    return { status: e.value, value: r };
  }
}
const te = Object.freeze({
  status: "aborted"
}), jn = (t) => ({ status: "dirty", value: t }), rt = (t) => ({ status: "valid", value: t }), ha = (t) => t.status === "aborted", ma = (t) => t.status === "dirty", on = (t) => t.status === "valid", _r = (t) => typeof Promise < "u" && t instanceof Promise;
var H;
(function(t) {
  t.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, t.toString = (e) => typeof e == "string" ? e : e == null ? void 0 : e.message;
})(H || (H = {}));
class Pt {
  constructor(e, n, r, s) {
    this._cachedPath = [], this.parent = e, this.data = n, this._path = r, this._key = s;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const pa = (t, e) => {
  if (on(e))
    return { success: !0, data: e.value };
  if (!t.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const n = new yt(t.common.issues);
      return this._error = n, this._error;
    }
  };
};
function le(t) {
  if (!t)
    return {};
  const { errorMap: e, invalid_type_error: n, required_error: r, description: s } = t;
  if (e && (n || r))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: s } : { errorMap: (a, o) => {
    const { message: c } = t;
    return a.code === "invalid_enum_value" ? { message: c ?? o.defaultError } : typeof o.data > "u" ? { message: c ?? r ?? o.defaultError } : a.code !== "invalid_type" ? { message: o.defaultError } : { message: c ?? n ?? o.defaultError };
  }, description: s };
}
class ve {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return Ct(e.data);
  }
  _getOrReturnCtx(e, n) {
    return n || {
      common: e.parent.common,
      data: e.data,
      parsedType: Ct(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new Qe(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: Ct(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const n = this._parse(e);
    if (_r(n))
      throw new Error("Synchronous parse encountered promise.");
    return n;
  }
  _parseAsync(e) {
    const n = this._parse(e);
    return Promise.resolve(n);
  }
  parse(e, n) {
    const r = this.safeParse(e, n);
    if (r.success)
      return r.data;
    throw r.error;
  }
  safeParse(e, n) {
    const r = {
      common: {
        issues: [],
        async: (n == null ? void 0 : n.async) ?? !1,
        contextualErrorMap: n == null ? void 0 : n.errorMap
      },
      path: (n == null ? void 0 : n.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Ct(e)
    }, s = this._parseSync({ data: e, path: r.path, parent: r });
    return pa(r, s);
  }
  "~validate"(e) {
    var r, s;
    const n = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Ct(e)
    };
    if (!this["~standard"].async)
      try {
        const i = this._parseSync({ data: e, path: [], parent: n });
        return on(i) ? {
          value: i.value
        } : {
          issues: n.common.issues
        };
      } catch (i) {
        (s = (r = i == null ? void 0 : i.message) == null ? void 0 : r.toLowerCase()) != null && s.includes("encountered") && (this["~standard"].async = !0), n.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: n }).then((i) => on(i) ? {
      value: i.value
    } : {
      issues: n.common.issues
    });
  }
  async parseAsync(e, n) {
    const r = await this.safeParseAsync(e, n);
    if (r.success)
      return r.data;
    throw r.error;
  }
  async safeParseAsync(e, n) {
    const r = {
      common: {
        issues: [],
        contextualErrorMap: n == null ? void 0 : n.errorMap,
        async: !0
      },
      path: (n == null ? void 0 : n.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: Ct(e)
    }, s = this._parse({ data: e, path: r.path, parent: r }), i = await (_r(s) ? s : Promise.resolve(s));
    return pa(r, i);
  }
  refine(e, n) {
    const r = (s) => typeof n == "string" || typeof n > "u" ? { message: n } : typeof n == "function" ? n(s) : n;
    return this._refinement((s, i) => {
      const a = e(s), o = () => i.addIssue({
        code: I.custom,
        ...r(s)
      });
      return typeof Promise < "u" && a instanceof Promise ? a.then((c) => c ? !0 : (o(), !1)) : a ? !0 : (o(), !1);
    });
  }
  refinement(e, n) {
    return this._refinement((r, s) => e(r) ? !0 : (s.addIssue(typeof n == "function" ? n(r, s) : n), !1));
  }
  _refinement(e) {
    return new cn({
      schema: this,
      typeName: ne.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (n) => this["~validate"](n)
    };
  }
  optional() {
    return At.create(this, this._def);
  }
  nullable() {
    return un.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ft.create(this);
  }
  promise() {
    return Cr.create(this, this._def);
  }
  or(e) {
    return Sr.create([this, e], this._def);
  }
  and(e) {
    return kr.create(this, e, this._def);
  }
  transform(e) {
    return new cn({
      ...le(this._def),
      schema: this,
      typeName: ne.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const n = typeof e == "function" ? e : () => e;
    return new Ds({
      ...le(this._def),
      innerType: this,
      defaultValue: n,
      typeName: ne.ZodDefault
    });
  }
  brand() {
    return new Yu({
      typeName: ne.ZodBranded,
      type: this,
      ...le(this._def)
    });
  }
  catch(e) {
    const n = typeof e == "function" ? e : () => e;
    return new Ms({
      ...le(this._def),
      innerType: this,
      catchValue: n,
      typeName: ne.ZodCatch
    });
  }
  describe(e) {
    const n = this.constructor;
    return new n({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return li.create(this, e);
  }
  readonly() {
    return Vs.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const ku = /^c[^\s-]{8,}$/i, Cu = /^[0-9a-z]+$/, Eu = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Ru = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Au = /^[a-z0-9_-]{21}$/i, Pu = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, ju = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Iu = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Ou = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let ls;
const Du = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Mu = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Vu = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Nu = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Lu = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Fu = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, el = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", Uu = new RegExp(`^${el}$`);
function tl(t) {
  let e = "[0-5]\\d";
  t.precision ? e = `${e}\\.\\d{${t.precision}}` : t.precision == null && (e = `${e}(\\.\\d+)?`);
  const n = t.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${n}`;
}
function Bu(t) {
  return new RegExp(`^${tl(t)}$`);
}
function $u(t) {
  let e = `${el}T${tl(t)}`;
  const n = [];
  return n.push(t.local ? "Z?" : "Z"), t.offset && n.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${n.join("|")})`, new RegExp(`^${e}$`);
}
function Wu(t, e) {
  return !!((e === "v4" || !e) && Du.test(t) || (e === "v6" || !e) && Vu.test(t));
}
function zu(t, e) {
  if (!Pu.test(t))
    return !1;
  try {
    const [n] = t.split(".");
    if (!n)
      return !1;
    const r = n.replace(/-/g, "+").replace(/_/g, "/").padEnd(n.length + (4 - n.length % 4) % 4, "="), s = JSON.parse(atob(r));
    return !(typeof s != "object" || s === null || "typ" in s && (s == null ? void 0 : s.typ) !== "JWT" || !s.alg || e && s.alg !== e);
  } catch {
    return !1;
  }
}
function Zu(t, e) {
  return !!((e === "v4" || !e) && Mu.test(t) || (e === "v6" || !e) && Nu.test(t));
}
class Et extends ve {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== Z.string) {
      const i = this._getOrReturnCtx(e);
      return L(i, {
        code: I.invalid_type,
        expected: Z.string,
        received: i.parsedType
      }), te;
    }
    const r = new Qe();
    let s;
    for (const i of this._def.checks)
      if (i.kind === "min")
        e.data.length < i.value && (s = this._getOrReturnCtx(e, s), L(s, {
          code: I.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), r.dirty());
      else if (i.kind === "max")
        e.data.length > i.value && (s = this._getOrReturnCtx(e, s), L(s, {
          code: I.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), r.dirty());
      else if (i.kind === "length") {
        const a = e.data.length > i.value, o = e.data.length < i.value;
        (a || o) && (s = this._getOrReturnCtx(e, s), a ? L(s, {
          code: I.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }) : o && L(s, {
          code: I.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }), r.dirty());
      } else if (i.kind === "email")
        Iu.test(e.data) || (s = this._getOrReturnCtx(e, s), L(s, {
          validation: "email",
          code: I.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "emoji")
        ls || (ls = new RegExp(Ou, "u")), ls.test(e.data) || (s = this._getOrReturnCtx(e, s), L(s, {
          validation: "emoji",
          code: I.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "uuid")
        Ru.test(e.data) || (s = this._getOrReturnCtx(e, s), L(s, {
          validation: "uuid",
          code: I.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "nanoid")
        Au.test(e.data) || (s = this._getOrReturnCtx(e, s), L(s, {
          validation: "nanoid",
          code: I.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "cuid")
        ku.test(e.data) || (s = this._getOrReturnCtx(e, s), L(s, {
          validation: "cuid",
          code: I.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "cuid2")
        Cu.test(e.data) || (s = this._getOrReturnCtx(e, s), L(s, {
          validation: "cuid2",
          code: I.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "ulid")
        Eu.test(e.data) || (s = this._getOrReturnCtx(e, s), L(s, {
          validation: "ulid",
          code: I.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "url")
        try {
          new URL(e.data);
        } catch {
          s = this._getOrReturnCtx(e, s), L(s, {
            validation: "url",
            code: I.invalid_string,
            message: i.message
          }), r.dirty();
        }
      else i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(e.data) || (s = this._getOrReturnCtx(e, s), L(s, {
        validation: "regex",
        code: I.invalid_string,
        message: i.message
      }), r.dirty())) : i.kind === "trim" ? e.data = e.data.trim() : i.kind === "includes" ? e.data.includes(i.value, i.position) || (s = this._getOrReturnCtx(e, s), L(s, {
        code: I.invalid_string,
        validation: { includes: i.value, position: i.position },
        message: i.message
      }), r.dirty()) : i.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : i.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : i.kind === "startsWith" ? e.data.startsWith(i.value) || (s = this._getOrReturnCtx(e, s), L(s, {
        code: I.invalid_string,
        validation: { startsWith: i.value },
        message: i.message
      }), r.dirty()) : i.kind === "endsWith" ? e.data.endsWith(i.value) || (s = this._getOrReturnCtx(e, s), L(s, {
        code: I.invalid_string,
        validation: { endsWith: i.value },
        message: i.message
      }), r.dirty()) : i.kind === "datetime" ? $u(i).test(e.data) || (s = this._getOrReturnCtx(e, s), L(s, {
        code: I.invalid_string,
        validation: "datetime",
        message: i.message
      }), r.dirty()) : i.kind === "date" ? Uu.test(e.data) || (s = this._getOrReturnCtx(e, s), L(s, {
        code: I.invalid_string,
        validation: "date",
        message: i.message
      }), r.dirty()) : i.kind === "time" ? Bu(i).test(e.data) || (s = this._getOrReturnCtx(e, s), L(s, {
        code: I.invalid_string,
        validation: "time",
        message: i.message
      }), r.dirty()) : i.kind === "duration" ? ju.test(e.data) || (s = this._getOrReturnCtx(e, s), L(s, {
        validation: "duration",
        code: I.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "ip" ? Wu(e.data, i.version) || (s = this._getOrReturnCtx(e, s), L(s, {
        validation: "ip",
        code: I.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "jwt" ? zu(e.data, i.alg) || (s = this._getOrReturnCtx(e, s), L(s, {
        validation: "jwt",
        code: I.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "cidr" ? Zu(e.data, i.version) || (s = this._getOrReturnCtx(e, s), L(s, {
        validation: "cidr",
        code: I.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "base64" ? Lu.test(e.data) || (s = this._getOrReturnCtx(e, s), L(s, {
        validation: "base64",
        code: I.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "base64url" ? Fu.test(e.data) || (s = this._getOrReturnCtx(e, s), L(s, {
        validation: "base64url",
        code: I.invalid_string,
        message: i.message
      }), r.dirty()) : _e.assertNever(i);
    return { status: r.value, value: e.data };
  }
  _regex(e, n, r) {
    return this.refinement((s) => e.test(s), {
      validation: n,
      code: I.invalid_string,
      ...H.errToObj(r)
    });
  }
  _addCheck(e) {
    return new Et({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...H.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...H.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...H.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...H.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...H.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...H.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...H.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...H.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...H.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...H.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...H.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...H.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...H.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      offset: (e == null ? void 0 : e.offset) ?? !1,
      local: (e == null ? void 0 : e.local) ?? !1,
      ...H.errToObj(e == null ? void 0 : e.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof (e == null ? void 0 : e.precision) > "u" ? null : e == null ? void 0 : e.precision,
      ...H.errToObj(e == null ? void 0 : e.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...H.errToObj(e) });
  }
  regex(e, n) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...H.errToObj(n)
    });
  }
  includes(e, n) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: n == null ? void 0 : n.position,
      ...H.errToObj(n == null ? void 0 : n.message)
    });
  }
  startsWith(e, n) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...H.errToObj(n)
    });
  }
  endsWith(e, n) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...H.errToObj(n)
    });
  }
  min(e, n) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...H.errToObj(n)
    });
  }
  max(e, n) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...H.errToObj(n)
    });
  }
  length(e, n) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...H.errToObj(n)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, H.errToObj(e));
  }
  trim() {
    return new Et({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new Et({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new Et({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "min" && (e === null || n.value > e) && (e = n.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    return e;
  }
}
Et.create = (t) => new Et({
  checks: [],
  typeName: ne.ZodString,
  coerce: (t == null ? void 0 : t.coerce) ?? !1,
  ...le(t)
});
function Hu(t, e) {
  const n = (t.toString().split(".")[1] || "").length, r = (e.toString().split(".")[1] || "").length, s = n > r ? n : r, i = Number.parseInt(t.toFixed(s).replace(".", "")), a = Number.parseInt(e.toFixed(s).replace(".", ""));
  return i % a / 10 ** s;
}
class Vn extends ve {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== Z.number) {
      const i = this._getOrReturnCtx(e);
      return L(i, {
        code: I.invalid_type,
        expected: Z.number,
        received: i.parsedType
      }), te;
    }
    let r;
    const s = new Qe();
    for (const i of this._def.checks)
      i.kind === "int" ? _e.isInteger(e.data) || (r = this._getOrReturnCtx(e, r), L(r, {
        code: I.invalid_type,
        expected: "integer",
        received: "float",
        message: i.message
      }), s.dirty()) : i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (r = this._getOrReturnCtx(e, r), L(r, {
        code: I.too_small,
        minimum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), s.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (r = this._getOrReturnCtx(e, r), L(r, {
        code: I.too_big,
        maximum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), s.dirty()) : i.kind === "multipleOf" ? Hu(e.data, i.value) !== 0 && (r = this._getOrReturnCtx(e, r), L(r, {
        code: I.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), s.dirty()) : i.kind === "finite" ? Number.isFinite(e.data) || (r = this._getOrReturnCtx(e, r), L(r, {
        code: I.not_finite,
        message: i.message
      }), s.dirty()) : _e.assertNever(i);
    return { status: s.value, value: e.data };
  }
  gte(e, n) {
    return this.setLimit("min", e, !0, H.toString(n));
  }
  gt(e, n) {
    return this.setLimit("min", e, !1, H.toString(n));
  }
  lte(e, n) {
    return this.setLimit("max", e, !0, H.toString(n));
  }
  lt(e, n) {
    return this.setLimit("max", e, !1, H.toString(n));
  }
  setLimit(e, n, r, s) {
    return new Vn({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: n,
          inclusive: r,
          message: H.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Vn({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: H.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: H.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: H.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: H.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: H.toString(e)
    });
  }
  multipleOf(e, n) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: H.toString(n)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: H.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: H.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: H.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "min" && (e === null || n.value > e) && (e = n.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && _e.isInteger(e.value));
  }
  get isFinite() {
    let e = null, n = null;
    for (const r of this._def.checks) {
      if (r.kind === "finite" || r.kind === "int" || r.kind === "multipleOf")
        return !0;
      r.kind === "min" ? (n === null || r.value > n) && (n = r.value) : r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    }
    return Number.isFinite(n) && Number.isFinite(e);
  }
}
Vn.create = (t) => new Vn({
  checks: [],
  typeName: ne.ZodNumber,
  coerce: (t == null ? void 0 : t.coerce) || !1,
  ...le(t)
});
class Nn extends ve {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce)
      try {
        e.data = BigInt(e.data);
      } catch {
        return this._getInvalidInput(e);
      }
    if (this._getType(e) !== Z.bigint)
      return this._getInvalidInput(e);
    let r;
    const s = new Qe();
    for (const i of this._def.checks)
      i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (r = this._getOrReturnCtx(e, r), L(r, {
        code: I.too_small,
        type: "bigint",
        minimum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), s.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (r = this._getOrReturnCtx(e, r), L(r, {
        code: I.too_big,
        type: "bigint",
        maximum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), s.dirty()) : i.kind === "multipleOf" ? e.data % i.value !== BigInt(0) && (r = this._getOrReturnCtx(e, r), L(r, {
        code: I.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), s.dirty()) : _e.assertNever(i);
    return { status: s.value, value: e.data };
  }
  _getInvalidInput(e) {
    const n = this._getOrReturnCtx(e);
    return L(n, {
      code: I.invalid_type,
      expected: Z.bigint,
      received: n.parsedType
    }), te;
  }
  gte(e, n) {
    return this.setLimit("min", e, !0, H.toString(n));
  }
  gt(e, n) {
    return this.setLimit("min", e, !1, H.toString(n));
  }
  lte(e, n) {
    return this.setLimit("max", e, !0, H.toString(n));
  }
  lt(e, n) {
    return this.setLimit("max", e, !1, H.toString(n));
  }
  setLimit(e, n, r, s) {
    return new Nn({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: n,
          inclusive: r,
          message: H.toString(s)
        }
      ]
    });
  }
  _addCheck(e) {
    return new Nn({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: H.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: H.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: H.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: H.toString(e)
    });
  }
  multipleOf(e, n) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: H.toString(n)
    });
  }
  get minValue() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "min" && (e === null || n.value > e) && (e = n.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    return e;
  }
}
Nn.create = (t) => new Nn({
  checks: [],
  typeName: ne.ZodBigInt,
  coerce: (t == null ? void 0 : t.coerce) ?? !1,
  ...le(t)
});
class ga extends ve {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== Z.boolean) {
      const r = this._getOrReturnCtx(e);
      return L(r, {
        code: I.invalid_type,
        expected: Z.boolean,
        received: r.parsedType
      }), te;
    }
    return rt(e.data);
  }
}
ga.create = (t) => new ga({
  typeName: ne.ZodBoolean,
  coerce: (t == null ? void 0 : t.coerce) || !1,
  ...le(t)
});
class Tr extends ve {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== Z.date) {
      const i = this._getOrReturnCtx(e);
      return L(i, {
        code: I.invalid_type,
        expected: Z.date,
        received: i.parsedType
      }), te;
    }
    if (Number.isNaN(e.data.getTime())) {
      const i = this._getOrReturnCtx(e);
      return L(i, {
        code: I.invalid_date
      }), te;
    }
    const r = new Qe();
    let s;
    for (const i of this._def.checks)
      i.kind === "min" ? e.data.getTime() < i.value && (s = this._getOrReturnCtx(e, s), L(s, {
        code: I.too_small,
        message: i.message,
        inclusive: !0,
        exact: !1,
        minimum: i.value,
        type: "date"
      }), r.dirty()) : i.kind === "max" ? e.data.getTime() > i.value && (s = this._getOrReturnCtx(e, s), L(s, {
        code: I.too_big,
        message: i.message,
        inclusive: !0,
        exact: !1,
        maximum: i.value,
        type: "date"
      }), r.dirty()) : _e.assertNever(i);
    return {
      status: r.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new Tr({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, n) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: H.toString(n)
    });
  }
  max(e, n) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: H.toString(n)
    });
  }
  get minDate() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "min" && (e === null || n.value > e) && (e = n.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const n of this._def.checks)
      n.kind === "max" && (e === null || n.value < e) && (e = n.value);
    return e != null ? new Date(e) : null;
  }
}
Tr.create = (t) => new Tr({
  checks: [],
  coerce: (t == null ? void 0 : t.coerce) || !1,
  typeName: ne.ZodDate,
  ...le(t)
});
class ya extends ve {
  _parse(e) {
    if (this._getType(e) !== Z.symbol) {
      const r = this._getOrReturnCtx(e);
      return L(r, {
        code: I.invalid_type,
        expected: Z.symbol,
        received: r.parsedType
      }), te;
    }
    return rt(e.data);
  }
}
ya.create = (t) => new ya({
  typeName: ne.ZodSymbol,
  ...le(t)
});
class va extends ve {
  _parse(e) {
    if (this._getType(e) !== Z.undefined) {
      const r = this._getOrReturnCtx(e);
      return L(r, {
        code: I.invalid_type,
        expected: Z.undefined,
        received: r.parsedType
      }), te;
    }
    return rt(e.data);
  }
}
va.create = (t) => new va({
  typeName: ne.ZodUndefined,
  ...le(t)
});
class xa extends ve {
  _parse(e) {
    if (this._getType(e) !== Z.null) {
      const r = this._getOrReturnCtx(e);
      return L(r, {
        code: I.invalid_type,
        expected: Z.null,
        received: r.parsedType
      }), te;
    }
    return rt(e.data);
  }
}
xa.create = (t) => new xa({
  typeName: ne.ZodNull,
  ...le(t)
});
class ba extends ve {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return rt(e.data);
  }
}
ba.create = (t) => new ba({
  typeName: ne.ZodAny,
  ...le(t)
});
class wa extends ve {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return rt(e.data);
  }
}
wa.create = (t) => new wa({
  typeName: ne.ZodUnknown,
  ...le(t)
});
class jt extends ve {
  _parse(e) {
    const n = this._getOrReturnCtx(e);
    return L(n, {
      code: I.invalid_type,
      expected: Z.never,
      received: n.parsedType
    }), te;
  }
}
jt.create = (t) => new jt({
  typeName: ne.ZodNever,
  ...le(t)
});
class _a extends ve {
  _parse(e) {
    if (this._getType(e) !== Z.undefined) {
      const r = this._getOrReturnCtx(e);
      return L(r, {
        code: I.invalid_type,
        expected: Z.void,
        received: r.parsedType
      }), te;
    }
    return rt(e.data);
  }
}
_a.create = (t) => new _a({
  typeName: ne.ZodVoid,
  ...le(t)
});
class ft extends ve {
  _parse(e) {
    const { ctx: n, status: r } = this._processInputParams(e), s = this._def;
    if (n.parsedType !== Z.array)
      return L(n, {
        code: I.invalid_type,
        expected: Z.array,
        received: n.parsedType
      }), te;
    if (s.exactLength !== null) {
      const a = n.data.length > s.exactLength.value, o = n.data.length < s.exactLength.value;
      (a || o) && (L(n, {
        code: a ? I.too_big : I.too_small,
        minimum: o ? s.exactLength.value : void 0,
        maximum: a ? s.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: s.exactLength.message
      }), r.dirty());
    }
    if (s.minLength !== null && n.data.length < s.minLength.value && (L(n, {
      code: I.too_small,
      minimum: s.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.minLength.message
    }), r.dirty()), s.maxLength !== null && n.data.length > s.maxLength.value && (L(n, {
      code: I.too_big,
      maximum: s.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: s.maxLength.message
    }), r.dirty()), n.common.async)
      return Promise.all([...n.data].map((a, o) => s.type._parseAsync(new Pt(n, a, n.path, o)))).then((a) => Qe.mergeArray(r, a));
    const i = [...n.data].map((a, o) => s.type._parseSync(new Pt(n, a, n.path, o)));
    return Qe.mergeArray(r, i);
  }
  get element() {
    return this._def.type;
  }
  min(e, n) {
    return new ft({
      ...this._def,
      minLength: { value: e, message: H.toString(n) }
    });
  }
  max(e, n) {
    return new ft({
      ...this._def,
      maxLength: { value: e, message: H.toString(n) }
    });
  }
  length(e, n) {
    return new ft({
      ...this._def,
      exactLength: { value: e, message: H.toString(n) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
ft.create = (t, e) => new ft({
  type: t,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: ne.ZodArray,
  ...le(e)
});
function en(t) {
  if (t instanceof Le) {
    const e = {};
    for (const n in t.shape) {
      const r = t.shape[n];
      e[n] = At.create(en(r));
    }
    return new Le({
      ...t._def,
      shape: () => e
    });
  } else return t instanceof ft ? new ft({
    ...t._def,
    type: en(t.element)
  }) : t instanceof At ? At.create(en(t.unwrap())) : t instanceof un ? un.create(en(t.unwrap())) : t instanceof Yt ? Yt.create(t.items.map((e) => en(e))) : t;
}
class Le extends ve {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), n = _e.objectKeys(e);
    return this._cached = { shape: e, keys: n }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== Z.object) {
      const u = this._getOrReturnCtx(e);
      return L(u, {
        code: I.invalid_type,
        expected: Z.object,
        received: u.parsedType
      }), te;
    }
    const { status: r, ctx: s } = this._processInputParams(e), { shape: i, keys: a } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof jt && this._def.unknownKeys === "strip"))
      for (const u in s.data)
        a.includes(u) || o.push(u);
    const c = [];
    for (const u of a) {
      const d = i[u], f = s.data[u];
      c.push({
        key: { status: "valid", value: u },
        value: d._parse(new Pt(s, f, s.path, u)),
        alwaysSet: u in s.data
      });
    }
    if (this._def.catchall instanceof jt) {
      const u = this._def.unknownKeys;
      if (u === "passthrough")
        for (const d of o)
          c.push({
            key: { status: "valid", value: d },
            value: { status: "valid", value: s.data[d] }
          });
      else if (u === "strict")
        o.length > 0 && (L(s, {
          code: I.unrecognized_keys,
          keys: o
        }), r.dirty());
      else if (u !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const u = this._def.catchall;
      for (const d of o) {
        const f = s.data[d];
        c.push({
          key: { status: "valid", value: d },
          value: u._parse(
            new Pt(s, f, s.path, d)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: d in s.data
        });
      }
    }
    return s.common.async ? Promise.resolve().then(async () => {
      const u = [];
      for (const d of c) {
        const f = await d.key, m = await d.value;
        u.push({
          key: f,
          value: m,
          alwaysSet: d.alwaysSet
        });
      }
      return u;
    }).then((u) => Qe.mergeObjectSync(r, u)) : Qe.mergeObjectSync(r, c);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return H.errToObj, new Le({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (n, r) => {
          var i, a;
          const s = ((a = (i = this._def).errorMap) == null ? void 0 : a.call(i, n, r).message) ?? r.defaultError;
          return n.code === "unrecognized_keys" ? {
            message: H.errToObj(e).message ?? s
          } : {
            message: s
          };
        }
      } : {}
    });
  }
  strip() {
    return new Le({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new Le({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new Le({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new Le({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: ne.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, n) {
    return this.augment({ [e]: n });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new Le({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const n = {};
    for (const r of _e.objectKeys(e))
      e[r] && this.shape[r] && (n[r] = this.shape[r]);
    return new Le({
      ...this._def,
      shape: () => n
    });
  }
  omit(e) {
    const n = {};
    for (const r of _e.objectKeys(this.shape))
      e[r] || (n[r] = this.shape[r]);
    return new Le({
      ...this._def,
      shape: () => n
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return en(this);
  }
  partial(e) {
    const n = {};
    for (const r of _e.objectKeys(this.shape)) {
      const s = this.shape[r];
      e && !e[r] ? n[r] = s : n[r] = s.optional();
    }
    return new Le({
      ...this._def,
      shape: () => n
    });
  }
  required(e) {
    const n = {};
    for (const r of _e.objectKeys(this.shape))
      if (e && !e[r])
        n[r] = this.shape[r];
      else {
        let i = this.shape[r];
        for (; i instanceof At; )
          i = i._def.innerType;
        n[r] = i;
      }
    return new Le({
      ...this._def,
      shape: () => n
    });
  }
  keyof() {
    return nl(_e.objectKeys(this.shape));
  }
}
Le.create = (t, e) => new Le({
  shape: () => t,
  unknownKeys: "strip",
  catchall: jt.create(),
  typeName: ne.ZodObject,
  ...le(e)
});
Le.strictCreate = (t, e) => new Le({
  shape: () => t,
  unknownKeys: "strict",
  catchall: jt.create(),
  typeName: ne.ZodObject,
  ...le(e)
});
Le.lazycreate = (t, e) => new Le({
  shape: t,
  unknownKeys: "strip",
  catchall: jt.create(),
  typeName: ne.ZodObject,
  ...le(e)
});
class Sr extends ve {
  _parse(e) {
    const { ctx: n } = this._processInputParams(e), r = this._def.options;
    function s(i) {
      for (const o of i)
        if (o.result.status === "valid")
          return o.result;
      for (const o of i)
        if (o.result.status === "dirty")
          return n.common.issues.push(...o.ctx.common.issues), o.result;
      const a = i.map((o) => new yt(o.ctx.common.issues));
      return L(n, {
        code: I.invalid_union,
        unionErrors: a
      }), te;
    }
    if (n.common.async)
      return Promise.all(r.map(async (i) => {
        const a = {
          ...n,
          common: {
            ...n.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await i._parseAsync({
            data: n.data,
            path: n.path,
            parent: a
          }),
          ctx: a
        };
      })).then(s);
    {
      let i;
      const a = [];
      for (const c of r) {
        const u = {
          ...n,
          common: {
            ...n.common,
            issues: []
          },
          parent: null
        }, d = c._parseSync({
          data: n.data,
          path: n.path,
          parent: u
        });
        if (d.status === "valid")
          return d;
        d.status === "dirty" && !i && (i = { result: d, ctx: u }), u.common.issues.length && a.push(u.common.issues);
      }
      if (i)
        return n.common.issues.push(...i.ctx.common.issues), i.result;
      const o = a.map((c) => new yt(c));
      return L(n, {
        code: I.invalid_union,
        unionErrors: o
      }), te;
    }
  }
  get options() {
    return this._def.options;
  }
}
Sr.create = (t, e) => new Sr({
  options: t,
  typeName: ne.ZodUnion,
  ...le(e)
});
function Os(t, e) {
  const n = Ct(t), r = Ct(e);
  if (t === e)
    return { valid: !0, data: t };
  if (n === Z.object && r === Z.object) {
    const s = _e.objectKeys(e), i = _e.objectKeys(t).filter((o) => s.indexOf(o) !== -1), a = { ...t, ...e };
    for (const o of i) {
      const c = Os(t[o], e[o]);
      if (!c.valid)
        return { valid: !1 };
      a[o] = c.data;
    }
    return { valid: !0, data: a };
  } else if (n === Z.array && r === Z.array) {
    if (t.length !== e.length)
      return { valid: !1 };
    const s = [];
    for (let i = 0; i < t.length; i++) {
      const a = t[i], o = e[i], c = Os(a, o);
      if (!c.valid)
        return { valid: !1 };
      s.push(c.data);
    }
    return { valid: !0, data: s };
  } else return n === Z.date && r === Z.date && +t == +e ? { valid: !0, data: t } : { valid: !1 };
}
class kr extends ve {
  _parse(e) {
    const { status: n, ctx: r } = this._processInputParams(e), s = (i, a) => {
      if (ha(i) || ha(a))
        return te;
      const o = Os(i.value, a.value);
      return o.valid ? ((ma(i) || ma(a)) && n.dirty(), { status: n.value, value: o.data }) : (L(r, {
        code: I.invalid_intersection_types
      }), te);
    };
    return r.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: r.data,
        path: r.path,
        parent: r
      }),
      this._def.right._parseAsync({
        data: r.data,
        path: r.path,
        parent: r
      })
    ]).then(([i, a]) => s(i, a)) : s(this._def.left._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }), this._def.right._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }));
  }
}
kr.create = (t, e, n) => new kr({
  left: t,
  right: e,
  typeName: ne.ZodIntersection,
  ...le(n)
});
class Yt extends ve {
  _parse(e) {
    const { status: n, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== Z.array)
      return L(r, {
        code: I.invalid_type,
        expected: Z.array,
        received: r.parsedType
      }), te;
    if (r.data.length < this._def.items.length)
      return L(r, {
        code: I.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), te;
    !this._def.rest && r.data.length > this._def.items.length && (L(r, {
      code: I.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), n.dirty());
    const i = [...r.data].map((a, o) => {
      const c = this._def.items[o] || this._def.rest;
      return c ? c._parse(new Pt(r, a, r.path, o)) : null;
    }).filter((a) => !!a);
    return r.common.async ? Promise.all(i).then((a) => Qe.mergeArray(n, a)) : Qe.mergeArray(n, i);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new Yt({
      ...this._def,
      rest: e
    });
  }
}
Yt.create = (t, e) => {
  if (!Array.isArray(t))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new Yt({
    items: t,
    typeName: ne.ZodTuple,
    rest: null,
    ...le(e)
  });
};
class Ta extends ve {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: n, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== Z.map)
      return L(r, {
        code: I.invalid_type,
        expected: Z.map,
        received: r.parsedType
      }), te;
    const s = this._def.keyType, i = this._def.valueType, a = [...r.data.entries()].map(([o, c], u) => ({
      key: s._parse(new Pt(r, o, r.path, [u, "key"])),
      value: i._parse(new Pt(r, c, r.path, [u, "value"]))
    }));
    if (r.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const c of a) {
          const u = await c.key, d = await c.value;
          if (u.status === "aborted" || d.status === "aborted")
            return te;
          (u.status === "dirty" || d.status === "dirty") && n.dirty(), o.set(u.value, d.value);
        }
        return { status: n.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const c of a) {
        const u = c.key, d = c.value;
        if (u.status === "aborted" || d.status === "aborted")
          return te;
        (u.status === "dirty" || d.status === "dirty") && n.dirty(), o.set(u.value, d.value);
      }
      return { status: n.value, value: o };
    }
  }
}
Ta.create = (t, e, n) => new Ta({
  valueType: e,
  keyType: t,
  typeName: ne.ZodMap,
  ...le(n)
});
class Ln extends ve {
  _parse(e) {
    const { status: n, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== Z.set)
      return L(r, {
        code: I.invalid_type,
        expected: Z.set,
        received: r.parsedType
      }), te;
    const s = this._def;
    s.minSize !== null && r.data.size < s.minSize.value && (L(r, {
      code: I.too_small,
      minimum: s.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.minSize.message
    }), n.dirty()), s.maxSize !== null && r.data.size > s.maxSize.value && (L(r, {
      code: I.too_big,
      maximum: s.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: s.maxSize.message
    }), n.dirty());
    const i = this._def.valueType;
    function a(c) {
      const u = /* @__PURE__ */ new Set();
      for (const d of c) {
        if (d.status === "aborted")
          return te;
        d.status === "dirty" && n.dirty(), u.add(d.value);
      }
      return { status: n.value, value: u };
    }
    const o = [...r.data.values()].map((c, u) => i._parse(new Pt(r, c, r.path, u)));
    return r.common.async ? Promise.all(o).then((c) => a(c)) : a(o);
  }
  min(e, n) {
    return new Ln({
      ...this._def,
      minSize: { value: e, message: H.toString(n) }
    });
  }
  max(e, n) {
    return new Ln({
      ...this._def,
      maxSize: { value: e, message: H.toString(n) }
    });
  }
  size(e, n) {
    return this.min(e, n).max(e, n);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
Ln.create = (t, e) => new Ln({
  valueType: t,
  minSize: null,
  maxSize: null,
  typeName: ne.ZodSet,
  ...le(e)
});
class Sa extends ve {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: n } = this._processInputParams(e);
    return this._def.getter()._parse({ data: n.data, path: n.path, parent: n });
  }
}
Sa.create = (t, e) => new Sa({
  getter: t,
  typeName: ne.ZodLazy,
  ...le(e)
});
class ka extends ve {
  _parse(e) {
    if (e.data !== this._def.value) {
      const n = this._getOrReturnCtx(e);
      return L(n, {
        received: n.data,
        code: I.invalid_literal,
        expected: this._def.value
      }), te;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
ka.create = (t, e) => new ka({
  value: t,
  typeName: ne.ZodLiteral,
  ...le(e)
});
function nl(t, e) {
  return new ln({
    values: t,
    typeName: ne.ZodEnum,
    ...le(e)
  });
}
class ln extends ve {
  _parse(e) {
    if (typeof e.data != "string") {
      const n = this._getOrReturnCtx(e), r = this._def.values;
      return L(n, {
        expected: _e.joinValues(r),
        received: n.parsedType,
        code: I.invalid_type
      }), te;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const n = this._getOrReturnCtx(e), r = this._def.values;
      return L(n, {
        received: n.data,
        code: I.invalid_enum_value,
        options: r
      }), te;
    }
    return rt(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const n of this._def.values)
      e[n] = n;
    return e;
  }
  get Values() {
    const e = {};
    for (const n of this._def.values)
      e[n] = n;
    return e;
  }
  get Enum() {
    const e = {};
    for (const n of this._def.values)
      e[n] = n;
    return e;
  }
  extract(e, n = this._def) {
    return ln.create(e, {
      ...this._def,
      ...n
    });
  }
  exclude(e, n = this._def) {
    return ln.create(this.options.filter((r) => !e.includes(r)), {
      ...this._def,
      ...n
    });
  }
}
ln.create = nl;
class Ca extends ve {
  _parse(e) {
    const n = _e.getValidEnumValues(this._def.values), r = this._getOrReturnCtx(e);
    if (r.parsedType !== Z.string && r.parsedType !== Z.number) {
      const s = _e.objectValues(n);
      return L(r, {
        expected: _e.joinValues(s),
        received: r.parsedType,
        code: I.invalid_type
      }), te;
    }
    if (this._cache || (this._cache = new Set(_e.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const s = _e.objectValues(n);
      return L(r, {
        received: r.data,
        code: I.invalid_enum_value,
        options: s
      }), te;
    }
    return rt(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
Ca.create = (t, e) => new Ca({
  values: t,
  typeName: ne.ZodNativeEnum,
  ...le(e)
});
class Cr extends ve {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: n } = this._processInputParams(e);
    if (n.parsedType !== Z.promise && n.common.async === !1)
      return L(n, {
        code: I.invalid_type,
        expected: Z.promise,
        received: n.parsedType
      }), te;
    const r = n.parsedType === Z.promise ? n.data : Promise.resolve(n.data);
    return rt(r.then((s) => this._def.type.parseAsync(s, {
      path: n.path,
      errorMap: n.common.contextualErrorMap
    })));
  }
}
Cr.create = (t, e) => new Cr({
  type: t,
  typeName: ne.ZodPromise,
  ...le(e)
});
class cn extends ve {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ne.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: n, ctx: r } = this._processInputParams(e), s = this._def.effect || null, i = {
      addIssue: (a) => {
        L(r, a), a.fatal ? n.abort() : n.dirty();
      },
      get path() {
        return r.path;
      }
    };
    if (i.addIssue = i.addIssue.bind(i), s.type === "preprocess") {
      const a = s.transform(r.data, i);
      if (r.common.async)
        return Promise.resolve(a).then(async (o) => {
          if (n.value === "aborted")
            return te;
          const c = await this._def.schema._parseAsync({
            data: o,
            path: r.path,
            parent: r
          });
          return c.status === "aborted" ? te : c.status === "dirty" || n.value === "dirty" ? jn(c.value) : c;
        });
      {
        if (n.value === "aborted")
          return te;
        const o = this._def.schema._parseSync({
          data: a,
          path: r.path,
          parent: r
        });
        return o.status === "aborted" ? te : o.status === "dirty" || n.value === "dirty" ? jn(o.value) : o;
      }
    }
    if (s.type === "refinement") {
      const a = (o) => {
        const c = s.refinement(o, i);
        if (r.common.async)
          return Promise.resolve(c);
        if (c instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (r.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: r.data,
          path: r.path,
          parent: r
        });
        return o.status === "aborted" ? te : (o.status === "dirty" && n.dirty(), a(o.value), { status: n.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: r.data, path: r.path, parent: r }).then((o) => o.status === "aborted" ? te : (o.status === "dirty" && n.dirty(), a(o.value).then(() => ({ status: n.value, value: o.value }))));
    }
    if (s.type === "transform")
      if (r.common.async === !1) {
        const a = this._def.schema._parseSync({
          data: r.data,
          path: r.path,
          parent: r
        });
        if (!on(a))
          return te;
        const o = s.transform(a.value, i);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: n.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: r.data, path: r.path, parent: r }).then((a) => on(a) ? Promise.resolve(s.transform(a.value, i)).then((o) => ({
          status: n.value,
          value: o
        })) : te);
    _e.assertNever(s);
  }
}
cn.create = (t, e, n) => new cn({
  schema: t,
  typeName: ne.ZodEffects,
  effect: e,
  ...le(n)
});
cn.createWithPreprocess = (t, e, n) => new cn({
  schema: e,
  effect: { type: "preprocess", transform: t },
  typeName: ne.ZodEffects,
  ...le(n)
});
class At extends ve {
  _parse(e) {
    return this._getType(e) === Z.undefined ? rt(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
At.create = (t, e) => new At({
  innerType: t,
  typeName: ne.ZodOptional,
  ...le(e)
});
class un extends ve {
  _parse(e) {
    return this._getType(e) === Z.null ? rt(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
un.create = (t, e) => new un({
  innerType: t,
  typeName: ne.ZodNullable,
  ...le(e)
});
class Ds extends ve {
  _parse(e) {
    const { ctx: n } = this._processInputParams(e);
    let r = n.data;
    return n.parsedType === Z.undefined && (r = this._def.defaultValue()), this._def.innerType._parse({
      data: r,
      path: n.path,
      parent: n
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
Ds.create = (t, e) => new Ds({
  innerType: t,
  typeName: ne.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...le(e)
});
class Ms extends ve {
  _parse(e) {
    const { ctx: n } = this._processInputParams(e), r = {
      ...n,
      common: {
        ...n.common,
        issues: []
      }
    }, s = this._def.innerType._parse({
      data: r.data,
      path: r.path,
      parent: {
        ...r
      }
    });
    return _r(s) ? s.then((i) => ({
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new yt(r.common.issues);
        },
        input: r.data
      })
    })) : {
      status: "valid",
      value: s.status === "valid" ? s.value : this._def.catchValue({
        get error() {
          return new yt(r.common.issues);
        },
        input: r.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
Ms.create = (t, e) => new Ms({
  innerType: t,
  typeName: ne.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...le(e)
});
class Ea extends ve {
  _parse(e) {
    if (this._getType(e) !== Z.nan) {
      const r = this._getOrReturnCtx(e);
      return L(r, {
        code: I.invalid_type,
        expected: Z.nan,
        received: r.parsedType
      }), te;
    }
    return { status: "valid", value: e.data };
  }
}
Ea.create = (t) => new Ea({
  typeName: ne.ZodNaN,
  ...le(t)
});
class Yu extends ve {
  _parse(e) {
    const { ctx: n } = this._processInputParams(e), r = n.data;
    return this._def.type._parse({
      data: r,
      path: n.path,
      parent: n
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class li extends ve {
  _parse(e) {
    const { status: n, ctx: r } = this._processInputParams(e);
    if (r.common.async)
      return (async () => {
        const i = await this._def.in._parseAsync({
          data: r.data,
          path: r.path,
          parent: r
        });
        return i.status === "aborted" ? te : i.status === "dirty" ? (n.dirty(), jn(i.value)) : this._def.out._parseAsync({
          data: i.value,
          path: r.path,
          parent: r
        });
      })();
    {
      const s = this._def.in._parseSync({
        data: r.data,
        path: r.path,
        parent: r
      });
      return s.status === "aborted" ? te : s.status === "dirty" ? (n.dirty(), {
        status: "dirty",
        value: s.value
      }) : this._def.out._parseSync({
        data: s.value,
        path: r.path,
        parent: r
      });
    }
  }
  static create(e, n) {
    return new li({
      in: e,
      out: n,
      typeName: ne.ZodPipeline
    });
  }
}
class Vs extends ve {
  _parse(e) {
    const n = this._def.innerType._parse(e), r = (s) => (on(s) && (s.value = Object.freeze(s.value)), s);
    return _r(n) ? n.then((s) => r(s)) : r(n);
  }
  unwrap() {
    return this._def.innerType;
  }
}
Vs.create = (t, e) => new Vs({
  innerType: t,
  typeName: ne.ZodReadonly,
  ...le(e)
});
var ne;
(function(t) {
  t.ZodString = "ZodString", t.ZodNumber = "ZodNumber", t.ZodNaN = "ZodNaN", t.ZodBigInt = "ZodBigInt", t.ZodBoolean = "ZodBoolean", t.ZodDate = "ZodDate", t.ZodSymbol = "ZodSymbol", t.ZodUndefined = "ZodUndefined", t.ZodNull = "ZodNull", t.ZodAny = "ZodAny", t.ZodUnknown = "ZodUnknown", t.ZodNever = "ZodNever", t.ZodVoid = "ZodVoid", t.ZodArray = "ZodArray", t.ZodObject = "ZodObject", t.ZodUnion = "ZodUnion", t.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", t.ZodIntersection = "ZodIntersection", t.ZodTuple = "ZodTuple", t.ZodRecord = "ZodRecord", t.ZodMap = "ZodMap", t.ZodSet = "ZodSet", t.ZodFunction = "ZodFunction", t.ZodLazy = "ZodLazy", t.ZodLiteral = "ZodLiteral", t.ZodEnum = "ZodEnum", t.ZodEffects = "ZodEffects", t.ZodNativeEnum = "ZodNativeEnum", t.ZodOptional = "ZodOptional", t.ZodNullable = "ZodNullable", t.ZodDefault = "ZodDefault", t.ZodCatch = "ZodCatch", t.ZodPromise = "ZodPromise", t.ZodBranded = "ZodBranded", t.ZodPipeline = "ZodPipeline", t.ZodReadonly = "ZodReadonly";
})(ne || (ne = {}));
const ot = Et.create;
jt.create;
const Ku = ft.create, Wn = Le.create;
Sr.create;
kr.create;
Yt.create;
ln.create;
Cr.create;
At.create;
un.create;
const Gu = Wn({ images: Ku(ot()) }), qu = Wn({ taskId: ot(), status: ot() }), Xu = Wn({
  taskId: ot(),
  status: ot(),
  modelUrl: ot().optional(),
  error: ot().optional()
}), Ju = Wn({ url: ot(), key: ot() }), Qu = Wn({ taskId: ot(), status: ot() });
function ed(t) {
  const e = t.apiBaseUrl.replace(/\/$/, ""), n = {};
  return t.token && (n["x-plugin-token"] = t.token), {
    async t2i(r) {
      const s = await fetch(`${e}/api/doubao/t2i`, {
        method: "POST",
        headers: { "content-type": "application/json", ...n },
        body: JSON.stringify(r)
      }), i = await s.json().catch(() => ({}));
      if (!s.ok) throw new Error((i == null ? void 0 : i.message) || `HTTP ${s.status}`);
      return Gu.parse(i);
    },
    async create3d(r) {
      const s = new FormData();
      s.append("image", r, "input.png");
      const i = await fetch(`${e}/api/hunyuan3d/i2t`, {
        method: "POST",
        headers: n,
        body: s
      }), a = await i.json().catch(() => ({}));
      if (!i.ok) throw new Error((a == null ? void 0 : a.message) || `HTTP ${i.status}`);
      const o = qu.parse(a);
      return { taskId: o.taskId, status: cs(o.status) };
    },
    async create3dFromUrl(r, s) {
      const i = await fetch(`${e}/api/hunyuan3d/i2t-url`, {
        method: "POST",
        headers: { "content-type": "application/json", ...n },
        body: JSON.stringify({ imageUrl: r, prompt: s })
      }), a = await i.json().catch(() => ({}));
      if (!i.ok) throw new Error((a == null ? void 0 : a.message) || `HTTP ${i.status}`);
      const o = Qu.parse(a);
      return { taskId: o.taskId, status: cs(o.status) };
    },
    async get3d(r) {
      const s = await fetch(`${e}/api/hunyuan3d/tasks/${encodeURIComponent(r)}`, {
        method: "GET",
        headers: n
      }), i = await s.json().catch(() => ({}));
      if (!s.ok) throw new Error((i == null ? void 0 : i.message) || `HTTP ${s.status}`);
      const a = Xu.parse(i);
      return {
        taskId: a.taskId,
        status: cs(a.status),
        modelUrl: a.modelUrl,
        error: a.error
      };
    },
    async uploadToCosFromUrl(r) {
      const s = await fetch(`${e}/api/cos/upload-from-url`, {
        method: "POST",
        headers: { "content-type": "application/json", ...n },
        body: JSON.stringify({ imageUrl: r })
      }), i = await s.json().catch(() => ({}));
      if (!s.ok) throw new Error((i == null ? void 0 : i.message) || `HTTP ${s.status}`);
      return Ju.parse(i);
    }
  };
}
function cs(t) {
  return t === "queued" || t === "running" || t === "succeeded" || t === "failed" ? t : "running";
}
function td(t) {
  return typeof t == "object" && t !== null && t.type === "AI_PLUGIN_INIT" && typeof t.payload == "object";
}
function nd(t, e) {
  t.postMessage(e, "*");
}
const us = {}, rl = "ai-plugin-panel-state:v1", sl = "ai-plugin-history:v1";
function Bg(t) {
  const e = _.useMemo(() => ld(), []), n = _.useMemo(() => ud(), []), [r, s] = _.useState(() => (e == null ? void 0 : e.tab) === "i23d" ? "i23d" : "t2i"), [i, a] = _.useState(() => t.initialPrompt ?? (e == null ? void 0 : e.prompt) ?? ""), [o, c] = _.useState(() => (e == null ? void 0 : e.size) ?? "2K"), [u, d] = _.useState(() => (e == null ? void 0 : e.n) ?? 1), [f, m] = _.useState(() => (e == null ? void 0 : e.images) ?? []), [y, b] = _.useState(
    () => (e == null ? void 0 : e.cosUrlByImageUrl) ?? {}
  ), [C, S] = _.useState({}), [k, j] = _.useState(
    () => {
      const P = t.initialImageUrl ?? (e == null ? void 0 : e.selectedImageUrl);
      if (!(P && P.startsWith("blob:")))
        return P;
    }
  ), [E, D] = _.useState(!1), [M, B] = _.useState(!1), [Q, V] = _.useState(), [G, F] = _.useState(() => e == null ? void 0 : e.taskId), [ie, xe] = _.useState(() => e == null ? void 0 : e.taskStatus), [Se, me] = _.useState(() => e == null ? void 0 : e.modelUrl), [pe, ue] = _.useState(() => e == null ? void 0 : e.activeHistoryId), [Te, w] = _.useState(!1), [Y, K] = _.useState(() => n), [g, R] = _.useState(0), $ = _.useRef({}), re = _.useRef(void 0), se = _.useRef(0), ge = t.apiBaseUrl || $.current.apiBaseUrl || od(), Ce = t.token || $.current.token, fe = _.useMemo(
    () => ed({ apiBaseUrl: ge, token: Ce }),
    [ge, Ce, g]
  );
  _.useEffect(() => {
    t.initialPrompt && a(t.initialPrompt);
  }, [t.initialPrompt]), _.useEffect(() => {
    t.initialImageUrl && j(t.initialImageUrl);
  }, [t.initialImageUrl]), _.useEffect(() => {
    const P = (ce) => {
      if (!td(ce.data)) return;
      const J = ce.data;
      $.current.apiBaseUrl = J.payload.apiBaseUrl || $.current.apiBaseUrl, $.current.token = J.payload.token || $.current.token, $.current.theme = J.payload.theme || $.current.theme, typeof J.payload.initialPrompt == "string" && a(J.payload.initialPrompt), typeof J.payload.initialImageUrl == "string" && j(J.payload.initialImageUrl), typeof J.payload.theme == "string" && Aa(J.payload.theme), R((q) => q + 1);
    };
    return window.addEventListener("message", P), () => window.removeEventListener("message", P);
  }, []), _.useEffect(() => {
    t.theme && Aa(t.theme);
  }, [t.theme]), _.useEffect(() => {
    k && s("i23d");
  }, [k]);
  function ye() {
    return se.current += 1, se.current;
  }
  function Pe(P) {
    K(P), Pa(P);
  }
  function qe() {
    if (pe) return pe;
    const P = ja({
      prompt: i,
      size: o,
      n: u,
      images: f,
      cosUrlByImageUrl: y,
      selectedImageUrl: k,
      taskId: G,
      taskStatus: ie,
      modelUrl: Se
    }), ce = [P, ...Y].slice(0, 30);
    return Pe(ce), ue(P.id), P.id;
  }
  function ct(P, ce) {
    if (!P) return;
    const J = Y.map((q) => q.id === P ? ce(q) : q);
    Pe(J);
  }
  _.useEffect(() => (re.current && window.clearTimeout(re.current), re.current = window.setTimeout(() => {
    cd({
      v: 1,
      tab: r,
      prompt: i,
      size: o,
      n: u,
      images: f,
      cosUrlByImageUrl: y,
      selectedImageUrl: k,
      taskId: G,
      taskStatus: ie,
      modelUrl: Se,
      activeHistoryId: pe
    });
  }, 200), () => {
    re.current && window.clearTimeout(re.current);
  }), [
    r,
    i,
    o,
    u,
    f,
    y,
    k,
    G,
    ie,
    Se,
    pe
  ]);
  async function Kt() {
    var P, ce;
    V(void 0), D(!0), m([]);
    try {
      const J = await fe.t2i({ prompt: i, size: o, n: u });
      m(J.images);
      const q = ja({
        prompt: i,
        size: o,
        n: u,
        images: J.images,
        cosUrlByImageUrl: {}
      });
      K((be) => {
        const Be = [q, ...be].slice(0, 30);
        return Pa(Be), Be;
      }), ue(q.id), (P = t.onImageGenerated) == null || P.call(t, J.images), Tt({ type: "AI_PLUGIN_IMAGE_GENERATED", payload: { images: J.images } }, t);
    } catch (J) {
      const q = J instanceof Error ? J.message : "生成失败";
      V(q), (ce = t.onError) == null || ce.call(t, { message: q }), Tt({ type: "AI_PLUGIN_ERROR", payload: { message: q } }, t);
    } finally {
      D(!1);
    }
  }
  async function xt(P) {
    var ce;
    V(void 0), S((J) => ({ ...J, [P]: !0 }));
    try {
      const J = await fe.uploadToCosFromUrl(P);
      b((be) => ({ ...be, [P]: J.url }));
      const q = qe();
      ct(q, (be) => ({
        ...be,
        cosUrlByImageUrl: { ...be.cosUrlByImageUrl, [P]: J.url }
      }));
    } catch (J) {
      const q = J instanceof Error ? J.message : "上传失败";
      V(q), (ce = t.onError) == null || ce.call(t, { message: q }), Tt({ type: "AI_PLUGIN_ERROR", payload: { message: q } }, t);
    } finally {
      S((J) => ({ ...J, [P]: !1 }));
    }
  }
  async function yn() {
    var ce, J;
    if (!k) return;
    const P = k.startsWith("blob:");
    if (!P && !ad(k)) {
      const q = "请先将图片上传到 COS，再进行图生3D";
      V(q), (ce = t.onError) == null || ce.call(t, { message: q }), Tt({ type: "AI_PLUGIN_ERROR", payload: { message: q } }, t);
      return;
    }
    V(void 0), B(!0), F(void 0), xe(void 0), me(void 0);
    try {
      let q;
      if (P) {
        const st = await (await fetch(k)).blob();
        q = await fe.create3d(st);
      } else
        q = await fe.create3dFromUrl(k);
      F(q.taskId), xe(q.status);
      const be = qe();
      ct(be, (Be) => ({
        ...Be,
        selectedImageUrl: k,
        taskId: q.taskId,
        taskStatus: q.status
      })), await pt(q.taskId, ye(), be);
    } catch (q) {
      const be = q instanceof Error ? q.message : "生成失败";
      V(be), (J = t.onError) == null || J.call(t, { message: be }), Tt({ type: "AI_PLUGIN_ERROR", payload: { message: be } }, t);
    } finally {
      B(!1);
    }
  }
  async function pt(P, ce, J) {
    var be, Be, st;
    for (let Vt = 0; Vt < 180; Vt++) {
      if (ce !== se.current) return;
      const He = await fe.get3d(P);
      if (ce !== se.current) return;
      if (xe(He.status), He.status === "succeeded" && He.modelUrl) {
        me(He.modelUrl), ct(J, (et) => ({ ...et, taskStatus: He.status, modelUrl: He.modelUrl })), (be = t.onModelGenerated) == null || be.call(t, { taskId: P, modelUrl: He.modelUrl }), Tt({ type: "AI_PLUGIN_MODEL_GENERATED", payload: { taskId: P, modelUrl: He.modelUrl } }, t);
        return;
      }
      if (He.status === "failed") {
        const et = He.error || "任务失败";
        V(et), ct(J, (Nt) => ({ ...Nt, taskStatus: He.status })), (Be = t.onError) == null || Be.call(t, { message: et }), Tt({ type: "AI_PLUGIN_ERROR", payload: { message: et } }, t);
        return;
      }
      await id(2e3);
    }
    const q = "任务超时（任务可能仍在后台运行，可稍后点“刷新状态”继续查询）";
    V(q), (st = t.onError) == null || st.call(t, { message: q }), Tt({ type: "AI_PLUGIN_ERROR", payload: { message: q } }, t);
  }
  return /* @__PURE__ */ v.jsxs("div", { className: "ai-plugin-root w-full max-w-[520px] mx-auto h-full flex flex-col text-slate-100 bg-transparent", children: [
    /* @__PURE__ */ v.jsxs("div", { className: "sticky top-0 z-10 border-b border-slate-800 bg-transparent backdrop-blur", children: [
      /* @__PURE__ */ v.jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [
        /* @__PURE__ */ v.jsx("div", { className: "text-sm font-semibold", children: "AI 插件面板" }),
        /* @__PURE__ */ v.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ v.jsx(
            "a",
            {
              className: "text-xs text-[#4DA6FF] hover:text-[#007AFF] font-semibold",
              href: "/resonance-demo",
              target: "_blank",
              rel: "noreferrer",
              children: "聊天"
            }
          ),
          /* @__PURE__ */ v.jsx(
            "button",
            {
              type: "button",
              onClick: () => w(!0),
              className: "text-xs text-slate-300 hover:text-white",
              children: "历史"
            }
          ),
          /* @__PURE__ */ v.jsx(
            "a",
            {
              className: "text-xs text-slate-300 hover:text-white",
              href: "/settings",
              target: "_blank",
              rel: "noreferrer",
              children: "设置"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ v.jsxs("div", { className: "flex gap-1 px-2 pb-2", children: [
        /* @__PURE__ */ v.jsx(Ra, { active: r === "t2i", onClick: () => s("t2i"), children: "文生图" }),
        /* @__PURE__ */ v.jsx(Ra, { active: r === "i23d", onClick: () => s("i23d"), children: "图生3D" })
      ] })
    ] }),
    /* @__PURE__ */ v.jsxs("div", { className: "p-4 flex-1 overflow-y-auto custom-scrollbar", children: [
      Q ? /* @__PURE__ */ v.jsx("div", { className: "mb-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200", children: Q }) : null,
      r === "t2i" ? /* @__PURE__ */ v.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ v.jsxs("div", { children: [
          /* @__PURE__ */ v.jsx("label", { className: "mb-1 block text-xs text-slate-300", children: "提示词" }),
          /* @__PURE__ */ v.jsx(
            "textarea",
            {
              value: i,
              onChange: (P) => a(P.target.value),
              rows: 5,
              className: "w-full resize-none rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]",
              placeholder: "输入你想生成的卡通人物/人格卡片描述"
            }
          )
        ] }),
        /* @__PURE__ */ v.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ v.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ v.jsx("label", { className: "mb-1 block text-xs text-slate-300", children: "尺寸" }),
            /* @__PURE__ */ v.jsxs(
              "select",
              {
                value: o,
                onChange: (P) => c(P.target.value),
                className: "w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]",
                disabled: E,
                children: [
                  /* @__PURE__ */ v.jsx("option", { value: "2K", children: "2K" }),
                  /* @__PURE__ */ v.jsx("option", { value: "1920x1920", children: "1920x1920" }),
                  /* @__PURE__ */ v.jsx("option", { value: "1920x1080", children: "1920x1080" }),
                  /* @__PURE__ */ v.jsx("option", { value: "1080x1920", children: "1080x1920" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ v.jsxs("div", { className: "w-28", children: [
            /* @__PURE__ */ v.jsx("label", { className: "mb-1 block text-xs text-slate-300", children: "张数" }),
            /* @__PURE__ */ v.jsx(
              "input",
              {
                value: u,
                onChange: (P) => d(Math.max(1, Math.min(4, Number(P.target.value) || 1))),
                type: "number",
                min: 1,
                max: 4,
                className: "w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ v.jsx(
          "button",
          {
            disabled: E || !i.trim(),
            onClick: Kt,
            className: "w-full rounded-md bg-[#007AFF] px-3 py-2 text-sm font-semibold text-white hover:bg-[#005BB5] disabled:opacity-50",
            children: E ? "生成中..." : "生成图片"
          }
        ),
        f.length ? /* @__PURE__ */ v.jsx("div", { className: "grid grid-cols-2 gap-2", children: f.map((P) => /* @__PURE__ */ v.jsx(
          rd,
          {
            url: P.startsWith("http") ? or(ge, P) : P,
            rawUrl: P,
            cosUrl: y[P],
            uploading: !!C[P],
            onUpload: () => xt(P),
            onUse: () => {
              const ce = y[P] || P;
              j(ce);
              const J = qe();
              ct(J, (q) => ({ ...q, selectedImageUrl: ce }));
            },
            selected: k === P
          },
          P
        )) }) : null
      ] }) : /* @__PURE__ */ v.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ v.jsxs("div", { className: "rounded-md border border-slate-800 bg-slate-900 p-3", children: [
          /* @__PURE__ */ v.jsx("div", { className: "mb-2 flex items-center justify-between", children: /* @__PURE__ */ v.jsx("span", { className: "text-xs text-slate-300", children: "输入图片" }) }),
          k ? /* @__PURE__ */ v.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ v.jsx(
              "img",
              {
                src: k.startsWith("http") ? or(ge, k) : k,
                className: "h-24 w-24 rounded-md border border-slate-800 object-cover"
              }
            ),
            /* @__PURE__ */ v.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ v.jsx(
                "button",
                {
                  className: "rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800",
                  onClick: () => s("t2i"),
                  children: "更换图片"
                }
              ),
              /* @__PURE__ */ v.jsx(
                "button",
                {
                  className: "rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800",
                  onClick: () => {
                    var P;
                    return (P = document.getElementById("local-img-upload")) == null ? void 0 : P.click();
                  },
                  children: "本地上传"
                }
              )
            ] })
          ] }) : /* @__PURE__ */ v.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ v.jsx("div", { className: "text-sm text-slate-400", children: "先在“文生图”生成并选择一张图片，或者：" }),
            /* @__PURE__ */ v.jsx(
              "button",
              {
                className: "w-fit rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800",
                onClick: () => {
                  var P;
                  return (P = document.getElementById("local-img-upload")) == null ? void 0 : P.click();
                },
                children: "上传本地图片"
              }
            )
          ] }),
          /* @__PURE__ */ v.jsx(
            "input",
            {
              id: "local-img-upload",
              type: "file",
              accept: "image/*",
              className: "hidden",
              onChange: (P) => {
                var be;
                const ce = (be = P.target.files) == null ? void 0 : be[0];
                if (!ce) return;
                const J = URL.createObjectURL(ce);
                j(J);
                const q = qe();
                ct(q, (Be) => ({ ...Be, selectedImageUrl: J })), P.target.value = "";
              }
            }
          )
        ] }),
        /* @__PURE__ */ v.jsx(
          "button",
          {
            disabled: M || !k,
            onClick: yn,
            className: "w-full rounded-md bg-[#007AFF] px-3 py-2 text-sm font-semibold text-white hover:bg-[#005BB5] disabled:opacity-50",
            children: M ? "提交中..." : "生成3D"
          }
        ),
        /* @__PURE__ */ v.jsxs("div", { className: "rounded-md border border-slate-800 bg-slate-900 p-3", children: [
          /* @__PURE__ */ v.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ v.jsx("div", { className: "text-xs text-slate-300", children: "任务状态" }),
            /* @__PURE__ */ v.jsx("div", { className: "text-xs text-slate-100", children: ie || "-" })
          ] }),
          G ? /* @__PURE__ */ v.jsx("div", { className: "mt-1 text-[11px] text-slate-400", children: G }) : null,
          G && !Se ? /* @__PURE__ */ v.jsxs("div", { className: "mt-2 flex gap-2", children: [
            /* @__PURE__ */ v.jsx(
              "button",
              {
                disabled: M,
                onClick: async () => {
                  V(void 0), B(!0);
                  try {
                    const P = qe();
                    await pt(G, ye(), P);
                  } finally {
                    B(!1);
                  }
                },
                className: "rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 disabled:opacity-50",
                children: M ? "查询中..." : "刷新状态"
              }
            ),
            /* @__PURE__ */ v.jsx(
              "button",
              {
                onClick: async () => {
                  try {
                    await navigator.clipboard.writeText(G);
                  } catch {
                  }
                },
                className: "rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800",
                children: "复制任务ID"
              }
            )
          ] }) : null
        ] }),
        Se ? /* @__PURE__ */ v.jsx(sd, { url: or(ge, Se), rawUrl: Se }) : null
      ] })
    ] }),
    Te ? /* @__PURE__ */ v.jsxs("div", { className: "fixed inset-0 z-50", children: [
      /* @__PURE__ */ v.jsx(
        "button",
        {
          type: "button",
          className: "absolute inset-0 bg-black/60",
          onClick: () => w(!1)
        }
      ),
      /* @__PURE__ */ v.jsxs("div", { className: "absolute left-1/2 top-1/2 w-[92vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-xl", children: [
        /* @__PURE__ */ v.jsxs("div", { className: "flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3", children: [
          /* @__PURE__ */ v.jsx("div", { className: "text-sm font-semibold", children: "历史记录" }),
          /* @__PURE__ */ v.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ v.jsx(
              "button",
              {
                type: "button",
                className: "rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800",
                onClick: () => {
                  Pe([]), ue(void 0);
                },
                children: "清空历史"
              }
            ),
            /* @__PURE__ */ v.jsx(
              "button",
              {
                type: "button",
                className: "rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800",
                onClick: () => w(!1),
                children: "关闭"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ v.jsx("div", { className: "max-h-[70vh] overflow-auto p-3", children: Y.length ? /* @__PURE__ */ v.jsx("div", { className: "space-y-2", children: Y.map((P) => {
          const ce = P.selectedImageUrl || P.images[0], J = P.id === pe;
          return /* @__PURE__ */ v.jsxs(
            "div",
            {
              className: `flex gap-3 rounded-md border px-3 py-2 ${J ? "border-[#007AFF]/80 bg-[#007AFF]/10" : "border-slate-800 bg-slate-900"}`,
              children: [
                /* @__PURE__ */ v.jsx("div", { className: "h-14 w-14 shrink-0 overflow-hidden rounded-md border border-slate-800 bg-slate-950", children: ce ? /* @__PURE__ */ v.jsx("img", { src: ce.startsWith("http") ? or(ge, ce) : ce, className: "h-full w-full object-cover" }) : null }),
                /* @__PURE__ */ v.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ v.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ v.jsx("div", { className: "text-xs text-slate-400", children: fd(P.createdAt) }),
                    /* @__PURE__ */ v.jsx("div", { className: "text-[11px] text-slate-300", children: P.modelUrl ? "已生成3D" : P.taskId ? `3D:${P.taskStatus || "-"}` : `图片:${P.images.length}` })
                  ] }),
                  /* @__PURE__ */ v.jsx("div", { className: "mt-1 truncate text-sm text-slate-100", children: P.prompt || "-" })
                ] }),
                /* @__PURE__ */ v.jsxs("div", { className: "flex shrink-0 flex-col gap-2", children: [
                  /* @__PURE__ */ v.jsx(
                    "button",
                    {
                      type: "button",
                      className: "rounded-md bg-[#007AFF] px-2 py-1 text-xs font-semibold text-white hover:bg-[#005BB5]",
                      onClick: () => {
                        ye(), V(void 0), D(!1), B(!1), a(P.prompt), c(P.size), d(P.n), m(P.images), b(P.cosUrlByImageUrl || {}), S({}), j(P.selectedImageUrl), F(P.taskId), xe(P.taskStatus), me(P.modelUrl), ue(P.id), s(P.selectedImageUrl || P.modelUrl || P.taskId ? "i23d" : "t2i"), w(!1);
                      },
                      children: "恢复"
                    }
                  ),
                  /* @__PURE__ */ v.jsx(
                    "button",
                    {
                      type: "button",
                      className: "rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800",
                      onClick: () => {
                        const q = Y.filter((be) => be.id !== P.id);
                        Pe(q), pe === P.id && ue(void 0);
                      },
                      children: "删除"
                    }
                  )
                ] })
              ]
            },
            P.id
          );
        }) }) : /* @__PURE__ */ v.jsx("div", { className: "p-6 text-center text-sm text-slate-400", children: "暂无历史记录" }) })
      ] })
    ] }) : null
  ] });
}
function Ra(t) {
  return /* @__PURE__ */ v.jsx(
    "button",
    {
      onClick: t.onClick,
      className: `flex-1 rounded-md px-3 py-2 text-sm ${t.active ? "bg-[#007AFF]/10 text-[#4DA6FF] font-semibold border border-[#007AFF]/30" : "bg-transparent text-slate-400 hover:bg-slate-800/50 border border-transparent"}`,
      children: t.children
    }
  );
}
function rd(t) {
  return /* @__PURE__ */ v.jsxs("div", { className: `rounded-md border ${t.selected ? "border-[#007AFF] shadow-[0_0_8px_rgba(0,122,255,0.4)]" : "border-slate-800"}`, children: [
    /* @__PURE__ */ v.jsx("img", { src: t.url, className: "h-36 w-full rounded-t-md object-cover" }),
    /* @__PURE__ */ v.jsxs("div", { className: "flex items-center justify-between gap-2 p-2", children: [
      /* @__PURE__ */ v.jsx(
        "button",
        {
          onClick: t.onUse,
          className: "rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-100 hover:bg-slate-700",
          children: "用于图生3D"
        }
      ),
      /* @__PURE__ */ v.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ v.jsx(
          "button",
          {
            onClick: t.onUpload,
            disabled: t.uploading,
            className: "rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 disabled:opacity-50",
            children: t.uploading ? "上传中..." : t.cosUrl ? "已上传" : "上传COS"
          }
        ),
        /* @__PURE__ */ v.jsx("a", { className: "text-xs text-slate-300 hover:text-white", href: t.rawUrl || t.url, target: "_blank", rel: "noreferrer", children: "原图" }),
        t.cosUrl ? /* @__PURE__ */ v.jsx("a", { className: "text-xs text-[#4DA6FF] hover:text-white", href: t.cosUrl, target: "_blank", rel: "noreferrer", children: "COS" }) : null
      ] })
    ] })
  ] });
}
function sd(t) {
  return _.useEffect(() => {
    import("./model-viewer-BFXOgO29.js");
  }, []), /* @__PURE__ */ v.jsxs("div", { className: "overflow-hidden rounded-md border border-slate-800 bg-slate-900", children: [
    /* @__PURE__ */ v.jsxs("div", { className: "flex items-center justify-between gap-2 px-3 py-2 text-xs text-slate-300", children: [
      /* @__PURE__ */ v.jsx("div", { children: "3D 预览" }),
      /* @__PURE__ */ v.jsx("a", { className: "text-[#4DA6FF] hover:text-white", href: t.rawUrl, target: "_blank", rel: "noreferrer", children: "下载模型" })
    ] }),
    /* @__PURE__ */ v.jsx(
      "model-viewer",
      {
        src: t.url,
        class: "h-[320px] w-full bg-slate-900",
        "camera-controls": !0,
        "auto-rotate": !0,
        exposure: "1"
      }
    )
  ] });
}
function id(t) {
  return new Promise((e) => setTimeout(e, t));
}
function ad(t) {
  try {
    const e = new URL(t);
    if (e.protocol !== "http:" && e.protocol !== "https:") return !1;
    const n = e.hostname.toLowerCase();
    return n === "localhost" ? !1 : (n.endsWith(".myqcloud.com"), !0);
  } catch {
    return !1;
  }
}
function od() {
  const e = new URLSearchParams(location.search).get("apiBaseUrl");
  if (e) return e;
  const n = us == null ? void 0 : us.VITE_API_BASE_URL;
  return n ? String(n) : "http://localhost:8787";
}
function or(t, e) {
  return `${t.replace(/\/$/, "")}/api/proxy?url=${encodeURIComponent(e)}`;
}
function Aa(t) {
  const e = document.documentElement;
  if (t === "light") {
    e.style.colorScheme = "light";
    return;
  }
  e.style.colorScheme = "dark";
}
function Tt(t, e) {
  e.onImageGenerated || e.onModelGenerated || e.onError || window.parent && window.parent !== window && nd(window.parent, t);
}
function ld() {
  try {
    const t = localStorage.getItem(rl);
    if (!t) return;
    const e = JSON.parse(t);
    return !e || typeof e != "object" || e.v !== 1 ? void 0 : e;
  } catch {
    return;
  }
}
function cd(t) {
  try {
    localStorage.setItem(rl, JSON.stringify(t));
  } catch {
  }
}
function ud() {
  try {
    const t = localStorage.getItem(sl);
    if (!t) return [];
    const e = JSON.parse(t);
    return !e || typeof e != "object" ? [] : e.v !== 1 ? [] : Array.isArray(e.items) ? e.items.filter((n) => n && typeof n == "object" && typeof n.id == "string").map((n) => {
      var r;
      return (r = n.selectedImageUrl) != null && r.startsWith("blob:") ? { ...n, selectedImageUrl: void 0 } : n;
    }).slice(0, 30) : [];
  } catch {
    return [];
  }
}
function Pa(t) {
  try {
    const e = { v: 1, items: t };
    localStorage.setItem(sl, JSON.stringify(e));
  } catch {
  }
}
function ja(t) {
  return {
    id: dd(),
    createdAt: Date.now(),
    prompt: t.prompt ?? "",
    size: t.size ?? "2K",
    n: t.n ?? 1,
    images: t.images ?? [],
    cosUrlByImageUrl: t.cosUrlByImageUrl ?? {},
    selectedImageUrl: t.selectedImageUrl,
    taskId: t.taskId,
    taskStatus: t.taskStatus,
    modelUrl: t.modelUrl
  };
}
function dd() {
  try {
    const t = globalThis.crypto;
    if (t != null && t.randomUUID) return t.randomUUID();
  } catch {
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function fd(t) {
  try {
    return new Date(t).toLocaleString();
  } catch {
    return String(t);
  }
}
const ci = _.createContext({});
function ui(t) {
  const e = _.useRef(null);
  return e.current === null && (e.current = t()), e.current;
}
const hd = typeof window < "u", il = hd ? _.useLayoutEffect : _.useEffect, Vr = /* @__PURE__ */ _.createContext(null);
function di(t, e) {
  t.indexOf(e) === -1 && t.push(e);
}
function Er(t, e) {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
const mt = (t, e, n) => n > e ? e : n < t ? t : n;
function Ns(t, e) {
  return e ? `${t}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${e}` : t;
}
var ds = {};
let hn = () => {
}, vt = () => {
};
typeof process < "u" && (ds == null ? void 0 : ds.NODE_ENV) !== "production" && (hn = (t, e, n) => {
  !t && typeof console < "u" && console.warn(Ns(e, n));
}, vt = (t, e, n) => {
  if (!t)
    throw new Error(Ns(e, n));
});
const It = {}, al = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t);
function ol(t) {
  return typeof t == "object" && t !== null;
}
const ll = (t) => /^0[^.\s]+$/u.test(t);
// @__NO_SIDE_EFFECTS__
function cl(t) {
  let e;
  return () => (e === void 0 && (e = t()), e);
}
const nt = /* @__NO_SIDE_EFFECTS__ */ (t) => t, md = (t, e) => (n) => e(t(n)), zn = (...t) => t.reduce(md), Fn = /* @__NO_SIDE_EFFECTS__ */ (t, e, n) => {
  const r = e - t;
  return r === 0 ? 1 : (n - t) / r;
};
class fi {
  constructor() {
    this.subscriptions = [];
  }
  add(e) {
    return di(this.subscriptions, e), () => Er(this.subscriptions, e);
  }
  notify(e, n, r) {
    const s = this.subscriptions.length;
    if (s)
      if (s === 1)
        this.subscriptions[0](e, n, r);
      else
        for (let i = 0; i < s; i++) {
          const a = this.subscriptions[i];
          a && a(e, n, r);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const Je = /* @__NO_SIDE_EFFECTS__ */ (t) => t * 1e3, tt = /* @__NO_SIDE_EFFECTS__ */ (t) => t / 1e3;
function ul(t, e) {
  return e ? t * (1e3 / e) : 0;
}
const Ia = /* @__PURE__ */ new Set();
function hi(t, e, n) {
  t || Ia.has(e) || (console.warn(Ns(e, n)), Ia.add(e));
}
const dl = (t, e, n) => (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t, pd = 1e-7, gd = 12;
function yd(t, e, n, r, s) {
  let i, a, o = 0;
  do
    a = e + (n - e) / 2, i = dl(a, r, s) - t, i > 0 ? n = a : e = a;
  while (Math.abs(i) > pd && ++o < gd);
  return a;
}
function Zn(t, e, n, r) {
  if (t === e && n === r)
    return nt;
  const s = (i) => yd(i, 0, 1, t, n);
  return (i) => i === 0 || i === 1 ? i : dl(s(i), e, r);
}
const fl = (t) => (e) => e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2, hl = (t) => (e) => 1 - t(1 - e), ml = /* @__PURE__ */ Zn(0.33, 1.53, 0.69, 0.99), mi = /* @__PURE__ */ hl(ml), pl = /* @__PURE__ */ fl(mi), gl = (t) => t >= 1 ? 1 : (t *= 2) < 1 ? 0.5 * mi(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))), pi = (t) => 1 - Math.sin(Math.acos(t)), yl = hl(pi), vl = fl(pi), vd = /* @__PURE__ */ Zn(0.42, 0, 1, 1), xd = /* @__PURE__ */ Zn(0, 0, 0.58, 1), xl = /* @__PURE__ */ Zn(0.42, 0, 0.58, 1), bd = (t) => Array.isArray(t) && typeof t[0] != "number", bl = (t) => Array.isArray(t) && typeof t[0] == "number", Oa = {
  linear: nt,
  easeIn: vd,
  easeInOut: xl,
  easeOut: xd,
  circIn: pi,
  circInOut: vl,
  circOut: yl,
  backIn: mi,
  backInOut: pl,
  backOut: ml,
  anticipate: gl
}, wd = (t) => typeof t == "string", Da = (t) => {
  if (bl(t)) {
    vt(t.length === 4, "Cubic bezier arrays must contain four numerical values.", "cubic-bezier-length");
    const [e, n, r, s] = t;
    return Zn(e, n, r, s);
  } else if (wd(t))
    return vt(Oa[t] !== void 0, `Invalid easing type '${t}'`, "invalid-easing-type"), Oa[t];
  return t;
}, lr = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function _d(t, e) {
  let n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), s = !1, i = !1;
  const a = /* @__PURE__ */ new WeakSet();
  let o = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function c(d) {
    a.has(d) && (u.schedule(d), t()), d(o);
  }
  const u = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (d, f = !1, m = !1) => {
      const b = m && s ? n : r;
      return f && a.add(d), b.add(d), d;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (d) => {
      r.delete(d), a.delete(d);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (d) => {
      if (o = d, s) {
        i = !0;
        return;
      }
      s = !0;
      const f = n;
      n = r, r = f, n.forEach(c), n.clear(), s = !1, i && (i = !1, u.process(d));
    }
  };
  return u;
}
const Td = 40;
function wl(t, e) {
  let n = !1, r = !0;
  const s = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, i = () => n = !0, a = lr.reduce((E, D) => (E[D] = _d(i), E), {}), { setup: o, read: c, resolveKeyframes: u, preUpdate: d, update: f, preRender: m, render: y, postRender: b } = a, C = () => {
    const E = It.useManualTiming, D = E ? s.timestamp : performance.now();
    n = !1, E || (s.delta = r ? 1e3 / 60 : Math.max(Math.min(D - s.timestamp, Td), 1)), s.timestamp = D, s.isProcessing = !0, o.process(s), c.process(s), u.process(s), d.process(s), f.process(s), m.process(s), y.process(s), b.process(s), s.isProcessing = !1, n && e && (r = !1, t(C));
  }, S = () => {
    n = !0, r = !0, s.isProcessing || t(C);
  };
  return { schedule: lr.reduce((E, D) => {
    const M = a[D];
    return E[D] = (B, Q = !1, V = !1) => (n || S(), M.schedule(B, Q, V)), E;
  }, {}), cancel: (E) => {
    for (let D = 0; D < lr.length; D++)
      a[lr[D]].cancel(E);
  }, state: s, steps: a };
}
const { schedule: Re, cancel: Ot, state: ze, steps: fs } = /* @__PURE__ */ wl(typeof requestAnimationFrame < "u" ? requestAnimationFrame : nt, !0);
let mr;
function Sd() {
  mr = void 0;
}
const Ke = {
  now: () => (mr === void 0 && Ke.set(ze.isProcessing || It.useManualTiming ? ze.timestamp : performance.now()), mr),
  set: (t) => {
    mr = t, queueMicrotask(Sd);
  }
}, _l = (t) => (e) => typeof e == "string" && e.startsWith(t), Tl = /* @__PURE__ */ _l("--"), kd = /* @__PURE__ */ _l("var(--"), gi = (t) => kd(t) ? Cd.test(t.split("/*")[0].trim()) : !1, Cd = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function Ma(t) {
  return typeof t != "string" ? !1 : t.split("/*")[0].includes("var(--");
}
const mn = {
  test: (t) => typeof t == "number",
  parse: parseFloat,
  transform: (t) => t
}, Un = {
  ...mn,
  transform: (t) => mt(0, 1, t)
}, cr = {
  ...mn,
  default: 1
}, On = (t) => Math.round(t * 1e5) / 1e5, yi = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function Ed(t) {
  return t == null;
}
const Rd = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, vi = (t, e) => (n) => !!(typeof n == "string" && Rd.test(n) && n.startsWith(t) || e && !Ed(n) && Object.prototype.hasOwnProperty.call(n, e)), Sl = (t, e, n) => (r) => {
  if (typeof r != "string")
    return r;
  const [s, i, a, o] = r.match(yi);
  return {
    [t]: parseFloat(s),
    [e]: parseFloat(i),
    [n]: parseFloat(a),
    alpha: o !== void 0 ? parseFloat(o) : 1
  };
}, Ad = (t) => mt(0, 255, t), hs = {
  ...mn,
  transform: (t) => Math.round(Ad(t))
}, Wt = {
  test: /* @__PURE__ */ vi("rgb", "red"),
  parse: /* @__PURE__ */ Sl("red", "green", "blue"),
  transform: ({ red: t, green: e, blue: n, alpha: r = 1 }) => "rgba(" + hs.transform(t) + ", " + hs.transform(e) + ", " + hs.transform(n) + ", " + On(Un.transform(r)) + ")"
};
function Pd(t) {
  let e = "", n = "", r = "", s = "";
  return t.length > 5 ? (e = t.substring(1, 3), n = t.substring(3, 5), r = t.substring(5, 7), s = t.substring(7, 9)) : (e = t.substring(1, 2), n = t.substring(2, 3), r = t.substring(3, 4), s = t.substring(4, 5), e += e, n += n, r += r, s += s), {
    red: parseInt(e, 16),
    green: parseInt(n, 16),
    blue: parseInt(r, 16),
    alpha: s ? parseInt(s, 16) / 255 : 1
  };
}
const Ls = {
  test: /* @__PURE__ */ vi("#"),
  parse: Pd,
  transform: Wt.transform
}, Hn = /* @__NO_SIDE_EFFECTS__ */ (t) => ({
  test: (e) => typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1,
  parse: parseFloat,
  transform: (e) => `${e}${t}`
}), St = /* @__PURE__ */ Hn("deg"), ht = /* @__PURE__ */ Hn("%"), U = /* @__PURE__ */ Hn("px"), jd = /* @__PURE__ */ Hn("vh"), Id = /* @__PURE__ */ Hn("vw"), Va = {
  ...ht,
  parse: (t) => ht.parse(t) / 100,
  transform: (t) => ht.transform(t * 100)
}, nn = {
  test: /* @__PURE__ */ vi("hsl", "hue"),
  parse: /* @__PURE__ */ Sl("hue", "saturation", "lightness"),
  transform: ({ hue: t, saturation: e, lightness: n, alpha: r = 1 }) => "hsla(" + Math.round(t) + ", " + ht.transform(On(e)) + ", " + ht.transform(On(n)) + ", " + On(Un.transform(r)) + ")"
}, Fe = {
  test: (t) => Wt.test(t) || Ls.test(t) || nn.test(t),
  parse: (t) => Wt.test(t) ? Wt.parse(t) : nn.test(t) ? nn.parse(t) : Ls.parse(t),
  transform: (t) => typeof t == "string" ? t : t.hasOwnProperty("red") ? Wt.transform(t) : nn.transform(t),
  getAnimatableNone: (t) => {
    const e = Fe.parse(t);
    return e.alpha = 0, Fe.transform(e);
  }
}, Od = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function Dd(t) {
  var e, n;
  return isNaN(t) && typeof t == "string" && (((e = t.match(yi)) == null ? void 0 : e.length) || 0) + (((n = t.match(Od)) == null ? void 0 : n.length) || 0) > 0;
}
const kl = "number", Cl = "color", Md = "var", Vd = "var(", Na = "${}", Nd = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function dn(t) {
  const e = t.toString(), n = [], r = {
    color: [],
    number: [],
    var: []
  }, s = [];
  let i = 0;
  const o = e.replace(Nd, (c) => (Fe.test(c) ? (r.color.push(i), s.push(Cl), n.push(Fe.parse(c))) : c.startsWith(Vd) ? (r.var.push(i), s.push(Md), n.push(c)) : (r.number.push(i), s.push(kl), n.push(parseFloat(c))), ++i, Na)).split(Na);
  return { values: n, split: o, indexes: r, types: s };
}
function Ld(t) {
  return dn(t).values;
}
function El({ split: t, types: e }) {
  const n = t.length;
  return (r) => {
    let s = "";
    for (let i = 0; i < n; i++)
      if (s += t[i], r[i] !== void 0) {
        const a = e[i];
        a === kl ? s += On(r[i]) : a === Cl ? s += Fe.transform(r[i]) : s += r[i];
      }
    return s;
  };
}
function Fd(t) {
  return El(dn(t));
}
const Ud = (t) => typeof t == "number" ? 0 : Fe.test(t) ? Fe.getAnimatableNone(t) : t, Bd = (t, e) => typeof t == "number" ? e != null && e.trim().endsWith("/") ? t : 0 : Ud(t);
function $d(t) {
  const e = dn(t);
  return El(e)(e.values.map((r, s) => Bd(r, e.split[s])));
}
const lt = {
  test: Dd,
  parse: Ld,
  createTransformer: Fd,
  getAnimatableNone: $d
};
function ms(t, e, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t;
}
function Wd({ hue: t, saturation: e, lightness: n, alpha: r }) {
  t /= 360, e /= 100, n /= 100;
  let s = 0, i = 0, a = 0;
  if (!e)
    s = i = a = n;
  else {
    const o = n < 0.5 ? n * (1 + e) : n + e - n * e, c = 2 * n - o;
    s = ms(c, o, t + 1 / 3), i = ms(c, o, t), a = ms(c, o, t - 1 / 3);
  }
  return {
    red: Math.round(s * 255),
    green: Math.round(i * 255),
    blue: Math.round(a * 255),
    alpha: r
  };
}
function Rr(t, e) {
  return (n) => n > 0 ? e : t;
}
const Ae = (t, e, n) => t + (e - t) * n, ps = (t, e, n) => {
  const r = t * t, s = n * (e * e - r) + r;
  return s < 0 ? 0 : Math.sqrt(s);
}, zd = [Ls, Wt, nn], Zd = (t) => zd.find((e) => e.test(t));
function La(t) {
  const e = Zd(t);
  if (hn(!!e, `'${t}' is not an animatable color. Use the equivalent color code instead.`, "color-not-animatable"), !e)
    return !1;
  let n = e.parse(t);
  return e === nn && (n = Wd(n)), n;
}
const Fa = (t, e) => {
  const n = La(t), r = La(e);
  if (!n || !r)
    return Rr(t, e);
  const s = { ...n };
  return (i) => (s.red = ps(n.red, r.red, i), s.green = ps(n.green, r.green, i), s.blue = ps(n.blue, r.blue, i), s.alpha = Ae(n.alpha, r.alpha, i), Wt.transform(s));
}, Fs = /* @__PURE__ */ new Set(["none", "hidden"]);
function Hd(t, e) {
  return Fs.has(t) ? (n) => n <= 0 ? t : e : (n) => n >= 1 ? e : t;
}
function Yd(t, e) {
  return (n) => Ae(t, e, n);
}
function xi(t) {
  return typeof t == "number" ? Yd : typeof t == "string" ? gi(t) ? Rr : Fe.test(t) ? Fa : qd : Array.isArray(t) ? Rl : typeof t == "object" ? Fe.test(t) ? Fa : Kd : Rr;
}
function Rl(t, e) {
  const n = [...t], r = n.length, s = t.map((i, a) => xi(i)(i, e[a]));
  return (i) => {
    for (let a = 0; a < r; a++)
      n[a] = s[a](i);
    return n;
  };
}
function Kd(t, e) {
  const n = { ...t, ...e }, r = {};
  for (const s in n)
    t[s] !== void 0 && e[s] !== void 0 && (r[s] = xi(t[s])(t[s], e[s]));
  return (s) => {
    for (const i in r)
      n[i] = r[i](s);
    return n;
  };
}
function Gd(t, e) {
  const n = [], r = { color: 0, var: 0, number: 0 };
  for (let s = 0; s < e.values.length; s++) {
    const i = e.types[s], a = t.indexes[i][r[i]], o = t.values[a] ?? 0;
    n[s] = o, r[i]++;
  }
  return n;
}
const qd = (t, e) => {
  const n = lt.createTransformer(e), r = dn(t), s = dn(e);
  return r.indexes.var.length === s.indexes.var.length && r.indexes.color.length === s.indexes.color.length && r.indexes.number.length >= s.indexes.number.length ? Fs.has(t) && !s.values.length || Fs.has(e) && !r.values.length ? Hd(t, e) : zn(Rl(Gd(r, s), s.values), n) : (hn(!0, `Complex values '${t}' and '${e}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`, "complex-values-different"), Rr(t, e));
};
function Al(t, e, n) {
  return typeof t == "number" && typeof e == "number" && typeof n == "number" ? Ae(t, e, n) : xi(t)(t, e);
}
const Xd = (t) => {
  const e = ({ timestamp: n }) => t(n);
  return {
    start: (n = !0) => Re.update(e, n),
    stop: () => Ot(e),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => ze.isProcessing ? ze.timestamp : Ke.now()
  };
}, Pl = (t, e, n = 10) => {
  let r = "";
  const s = Math.max(Math.round(e / n), 2);
  for (let i = 0; i < s; i++)
    r += Math.round(t(i / (s - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${r.substring(0, r.length - 2)})`;
}, Ar = 2e4;
function bi(t) {
  let e = 0;
  const n = 50;
  let r = t.next(e);
  for (; !r.done && e < Ar; )
    e += n, r = t.next(e);
  return e >= Ar ? 1 / 0 : e;
}
function Jd(t, e = 100, n) {
  const r = n({ ...t, keyframes: [0, e] }), s = Math.min(bi(r), Ar);
  return {
    type: "keyframes",
    ease: (i) => r.next(s * i).value / e,
    duration: /* @__PURE__ */ tt(s)
  };
}
const Me = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
};
function Us(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const Qd = 12;
function ef(t, e, n) {
  let r = n;
  for (let s = 1; s < Qd; s++)
    r = r - t(r) / e(r);
  return r;
}
const gs = 1e-3;
function tf({ duration: t = Me.duration, bounce: e = Me.bounce, velocity: n = Me.velocity, mass: r = Me.mass }) {
  let s, i;
  hn(t <= /* @__PURE__ */ Je(Me.maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit");
  let a = 1 - e;
  a = mt(Me.minDamping, Me.maxDamping, a), t = mt(Me.minDuration, Me.maxDuration, /* @__PURE__ */ tt(t)), a < 1 ? (s = (u) => {
    const d = u * a, f = d * t, m = d - n, y = Us(u, a), b = Math.exp(-f);
    return gs - m / y * b;
  }, i = (u) => {
    const f = u * a * t, m = f * n + n, y = Math.pow(a, 2) * Math.pow(u, 2) * t, b = Math.exp(-f), C = Us(Math.pow(u, 2), a);
    return (-s(u) + gs > 0 ? -1 : 1) * ((m - y) * b) / C;
  }) : (s = (u) => {
    const d = Math.exp(-u * t), f = (u - n) * t + 1;
    return -gs + d * f;
  }, i = (u) => {
    const d = Math.exp(-u * t), f = (n - u) * (t * t);
    return d * f;
  });
  const o = 5 / t, c = ef(s, i, o);
  if (t = /* @__PURE__ */ Je(t), isNaN(c))
    return {
      stiffness: Me.stiffness,
      damping: Me.damping,
      duration: t
    };
  {
    const u = Math.pow(c, 2) * r;
    return {
      stiffness: u,
      damping: a * 2 * Math.sqrt(r * u),
      duration: t
    };
  }
}
const nf = ["duration", "bounce"], rf = ["stiffness", "damping", "mass"];
function Ua(t, e) {
  return e.some((n) => t[n] !== void 0);
}
function sf(t) {
  let e = {
    velocity: Me.velocity,
    stiffness: Me.stiffness,
    damping: Me.damping,
    mass: Me.mass,
    isResolvedFromDuration: !1,
    ...t
  };
  if (!Ua(t, rf) && Ua(t, nf))
    if (e.velocity = 0, t.visualDuration) {
      const n = t.visualDuration, r = 2 * Math.PI / (n * 1.2), s = r * r, i = 2 * mt(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(s);
      e = {
        ...e,
        mass: Me.mass,
        stiffness: s,
        damping: i
      };
    } else {
      const n = tf({ ...t, velocity: 0 });
      e = {
        ...e,
        ...n,
        mass: Me.mass
      }, e.isResolvedFromDuration = !0;
    }
  return e;
}
function Pr(t = Me.visualDuration, e = Me.bounce) {
  const n = typeof t != "object" ? {
    visualDuration: t,
    keyframes: [0, 1],
    bounce: e
  } : t;
  let { restSpeed: r, restDelta: s } = n;
  const i = n.keyframes[0], a = n.keyframes[n.keyframes.length - 1], o = { done: !1, value: i }, { stiffness: c, damping: u, mass: d, duration: f, velocity: m, isResolvedFromDuration: y } = sf({
    ...n,
    velocity: -/* @__PURE__ */ tt(n.velocity || 0)
  }), b = m || 0, C = u / (2 * Math.sqrt(c * d)), S = a - i, k = /* @__PURE__ */ tt(Math.sqrt(c / d)), j = Math.abs(S) < 5;
  r || (r = j ? Me.restSpeed.granular : Me.restSpeed.default), s || (s = j ? Me.restDelta.granular : Me.restDelta.default);
  let E, D, M, B, Q, V;
  if (C < 1)
    M = Us(k, C), B = (b + C * k * S) / M, E = (F) => {
      const ie = Math.exp(-C * k * F);
      return a - ie * (B * Math.sin(M * F) + S * Math.cos(M * F));
    }, Q = C * k * B + S * M, V = C * k * S - B * M, D = (F) => Math.exp(-C * k * F) * (Q * Math.sin(M * F) + V * Math.cos(M * F));
  else if (C === 1) {
    E = (ie) => a - Math.exp(-k * ie) * (S + (b + k * S) * ie);
    const F = b + k * S;
    D = (ie) => Math.exp(-k * ie) * (k * F * ie - b);
  } else {
    const F = k * Math.sqrt(C * C - 1);
    E = (me) => {
      const pe = Math.exp(-C * k * me), ue = Math.min(F * me, 300);
      return a - pe * ((b + C * k * S) * Math.sinh(ue) + F * S * Math.cosh(ue)) / F;
    };
    const ie = (b + C * k * S) / F, xe = C * k * ie - S * F, Se = C * k * S - ie * F;
    D = (me) => {
      const pe = Math.exp(-C * k * me), ue = Math.min(F * me, 300);
      return pe * (xe * Math.sinh(ue) + Se * Math.cosh(ue));
    };
  }
  const G = {
    calculatedDuration: y && f || null,
    velocity: (F) => /* @__PURE__ */ Je(D(F)),
    next: (F) => {
      if (!y && C < 1) {
        const xe = Math.exp(-C * k * F), Se = Math.sin(M * F), me = Math.cos(M * F), pe = a - xe * (B * Se + S * me), ue = /* @__PURE__ */ Je(xe * (Q * Se + V * me));
        return o.done = Math.abs(ue) <= r && Math.abs(a - pe) <= s, o.value = o.done ? a : pe, o;
      }
      const ie = E(F);
      if (y)
        o.done = F >= f;
      else {
        const xe = /* @__PURE__ */ Je(D(F));
        o.done = Math.abs(xe) <= r && Math.abs(a - ie) <= s;
      }
      return o.value = o.done ? a : ie, o;
    },
    toString: () => {
      const F = Math.min(bi(G), Ar), ie = Pl((xe) => G.next(F * xe).value, F, 30);
      return F + "ms " + ie;
    },
    toTransition: () => {
    }
  };
  return G;
}
Pr.applyToOptions = (t) => {
  const e = Jd(t, 100, Pr);
  return t.ease = e.ease, t.duration = /* @__PURE__ */ Je(e.duration), t.type = "keyframes", t;
};
const af = 5;
function jl(t, e, n) {
  const r = Math.max(e - af, 0);
  return ul(n - t(r), e - r);
}
function Bs({ keyframes: t, velocity: e = 0, power: n = 0.8, timeConstant: r = 325, bounceDamping: s = 10, bounceStiffness: i = 500, modifyTarget: a, min: o, max: c, restDelta: u = 0.5, restSpeed: d }) {
  const f = t[0], m = {
    done: !1,
    value: f
  }, y = (V) => o !== void 0 && V < o || c !== void 0 && V > c, b = (V) => o === void 0 ? c : c === void 0 || Math.abs(o - V) < Math.abs(c - V) ? o : c;
  let C = n * e;
  const S = f + C, k = a === void 0 ? S : a(S);
  k !== S && (C = k - f);
  const j = (V) => -C * Math.exp(-V / r), E = (V) => k + j(V), D = (V) => {
    const G = j(V), F = E(V);
    m.done = Math.abs(G) <= u, m.value = m.done ? k : F;
  };
  let M, B;
  const Q = (V) => {
    y(m.value) && (M = V, B = Pr({
      keyframes: [m.value, b(m.value)],
      velocity: jl(E, V, m.value),
      // TODO: This should be passing * 1000
      damping: s,
      stiffness: i,
      restDelta: u,
      restSpeed: d
    }));
  };
  return Q(0), {
    calculatedDuration: null,
    next: (V) => {
      let G = !1;
      return !B && M === void 0 && (G = !0, D(V), Q(V)), M !== void 0 && V >= M ? B.next(V - M) : (!G && D(V), m);
    }
  };
}
function of(t, e, n) {
  const r = [], s = n || It.mix || Al, i = t.length - 1;
  for (let a = 0; a < i; a++) {
    let o = s(t[a], t[a + 1]);
    if (e) {
      const c = Array.isArray(e) ? e[a] || nt : e;
      o = zn(c, o);
    }
    r.push(o);
  }
  return r;
}
function lf(t, e, { clamp: n = !0, ease: r, mixer: s } = {}) {
  const i = t.length;
  if (vt(i === e.length, "Both input and output ranges must be the same length", "range-length"), i === 1)
    return () => e[0];
  if (i === 2 && e[0] === e[1])
    return () => e[1];
  const a = t[0] === t[1];
  t[0] > t[i - 1] && (t = [...t].reverse(), e = [...e].reverse());
  const o = of(e, r, s), c = o.length, u = (d) => {
    if (a && d < t[0])
      return e[0];
    let f = 0;
    if (c > 1)
      for (; f < t.length - 2 && !(d < t[f + 1]); f++)
        ;
    const m = /* @__PURE__ */ Fn(t[f], t[f + 1], d);
    return o[f](m);
  };
  return n ? (d) => u(mt(t[0], t[i - 1], d)) : u;
}
function cf(t, e) {
  const n = t[t.length - 1];
  for (let r = 1; r <= e; r++) {
    const s = /* @__PURE__ */ Fn(0, e, r);
    t.push(Ae(n, 1, s));
  }
}
function uf(t) {
  const e = [0];
  return cf(e, t.length - 1), e;
}
function df(t, e) {
  return t.map((n) => n * e);
}
function ff(t, e) {
  return t.map(() => e || xl).splice(0, t.length - 1);
}
function rn({ duration: t = 300, keyframes: e, times: n, ease: r = "easeInOut" }) {
  const s = bd(r) ? r.map(Da) : Da(r), i = {
    done: !1,
    value: e[0]
  }, a = df(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    n && n.length === e.length ? n : uf(e),
    t
  ), o = lf(a, e, {
    ease: Array.isArray(s) ? s : ff(e, s)
  });
  return {
    calculatedDuration: t,
    next: (c) => (i.value = o(c), i.done = c >= t, i)
  };
}
const hf = (t) => t !== null;
function Nr(t, { repeat: e, repeatType: n = "loop" }, r, s = 1) {
  const i = t.filter(hf), o = s < 0 || e && n !== "loop" && e % 2 === 1 ? 0 : i.length - 1;
  return !o || r === void 0 ? i[o] : r;
}
const mf = {
  decay: Bs,
  inertia: Bs,
  tween: rn,
  keyframes: rn,
  spring: Pr
};
function Il(t) {
  typeof t.type == "string" && (t.type = mf[t.type]);
}
class wi {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((e) => {
      this.resolve = e;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(e, n) {
    return this.finished.then(e, n);
  }
}
var pf = {};
const gf = (t) => t / 100;
class jr extends wi {
  constructor(e) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
      done: !1,
      value: void 0
    }, this.stop = () => {
      var r, s;
      const { motionValue: n } = this.options;
      n && n.updatedAt !== Ke.now() && this.tick(Ke.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), (s = (r = this.options).onStop) == null || s.call(r));
    }, this.options = e, this.initAnimation(), this.play(), e.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options: e } = this;
    Il(e);
    const { type: n = rn, repeat: r = 0, repeatDelay: s = 0, repeatType: i, velocity: a = 0 } = e;
    let { keyframes: o } = e;
    const c = n || rn;
    pf.NODE_ENV !== "production" && c !== rn && vt(o.length <= 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${o}`, "spring-two-frames"), c !== rn && typeof o[0] != "number" && (this.mixKeyframes = zn(gf, Al(o[0], o[1])), o = [0, 100]);
    const u = c({ ...e, keyframes: o });
    i === "mirror" && (this.mirroredGenerator = c({
      ...e,
      keyframes: [...o].reverse(),
      velocity: -a
    })), u.calculatedDuration === null && (u.calculatedDuration = bi(u));
    const { calculatedDuration: d } = u;
    this.calculatedDuration = d, this.resolvedDuration = d + s, this.totalDuration = this.resolvedDuration * (r + 1) - s, this.generator = u;
  }
  updateTime(e) {
    const n = Math.round(e - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = n;
  }
  tick(e, n = !1) {
    const { generator: r, totalDuration: s, mixKeyframes: i, mirroredGenerator: a, resolvedDuration: o, calculatedDuration: c } = this;
    if (this.startTime === null)
      return r.next(0);
    const { delay: u = 0, keyframes: d, repeat: f, repeatType: m, repeatDelay: y, type: b, onUpdate: C, finalKeyframe: S } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - s / this.speed, this.startTime)), n ? this.currentTime = e : this.updateTime(e);
    const k = this.currentTime - u * (this.playbackSpeed >= 0 ? 1 : -1), j = this.playbackSpeed >= 0 ? k < 0 : k > s;
    this.currentTime = Math.max(k, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = s);
    let E = this.currentTime, D = r;
    if (f) {
      const V = Math.min(this.currentTime, s) / o;
      let G = Math.floor(V), F = V % 1;
      !F && V >= 1 && (F = 1), F === 1 && G--, G = Math.min(G, f + 1), !!(G % 2) && (m === "reverse" ? (F = 1 - F, y && (F -= y / o)) : m === "mirror" && (D = a)), E = mt(0, 1, F) * o;
    }
    let M;
    j ? (this.delayState.value = d[0], M = this.delayState) : M = D.next(E), i && !j && (M.value = i(M.value));
    let { done: B } = M;
    !j && c !== null && (B = this.playbackSpeed >= 0 ? this.currentTime >= s : this.currentTime <= 0);
    const Q = this.holdTime === null && (this.state === "finished" || this.state === "running" && B);
    return Q && b !== Bs && (M.value = Nr(d, this.options, S, this.speed)), C && C(M.value), Q && this.finish(), M;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(e, n) {
    return this.finished.then(e, n);
  }
  get duration() {
    return /* @__PURE__ */ tt(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: e = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ tt(e);
  }
  get time() {
    return /* @__PURE__ */ tt(this.currentTime);
  }
  set time(e) {
    e = /* @__PURE__ */ Je(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), this.driver ? this.driver.start(!1) : (this.startTime = 0, this.state = "paused", this.holdTime = e, this.tick(e));
  }
  /**
   * Returns the generator's velocity at the current time in units/second.
   * Uses the analytical derivative when available (springs), avoiding
   * the MotionValue's frame-dependent velocity estimation.
   */
  getGeneratorVelocity() {
    const e = this.currentTime;
    if (e <= 0)
      return this.options.velocity || 0;
    if (this.generator.velocity)
      return this.generator.velocity(e);
    const n = this.generator.next(e).value;
    return jl((r) => this.generator.next(r).value, e, n);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(e) {
    const n = this.playbackSpeed !== e;
    n && this.driver && this.updateTime(Ke.now()), this.playbackSpeed = e, n && this.driver && (this.time = /* @__PURE__ */ tt(this.currentTime));
  }
  play() {
    var s, i;
    if (this.isStopped)
      return;
    const { driver: e = Xd, startTime: n } = this.options;
    this.driver || (this.driver = e((a) => this.tick(a))), (i = (s = this.options).onPlay) == null || i.call(s);
    const r = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = r) : this.holdTime !== null ? this.startTime = r - this.holdTime : this.startTime || (this.startTime = n ?? r), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(Ke.now()), this.holdTime = this.currentTime;
  }
  complete() {
    this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
  }
  finish() {
    var e, n;
    this.notifyFinished(), this.teardown(), this.state = "finished", (n = (e = this.options).onComplete) == null || n.call(e);
  }
  cancel() {
    var e, n;
    this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), (n = (e = this.options).onCancel) == null || n.call(e);
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(e) {
    return this.startTime = 0, this.tick(e, !0);
  }
  attachTimeline(e) {
    var n;
    return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), (n = this.driver) == null || n.stop(), e.observe(this);
  }
}
function yf(t) {
  for (let e = 1; e < t.length; e++)
    t[e] ?? (t[e] = t[e - 1]);
}
const zt = (t) => t * 180 / Math.PI, $s = (t) => {
  const e = zt(Math.atan2(t[1], t[0]));
  return Ws(e);
}, vf = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (t) => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
  rotate: $s,
  rotateZ: $s,
  skewX: (t) => zt(Math.atan(t[1])),
  skewY: (t) => zt(Math.atan(t[2])),
  skew: (t) => (Math.abs(t[1]) + Math.abs(t[2])) / 2
}, Ws = (t) => (t = t % 360, t < 0 && (t += 360), t), Ba = $s, $a = (t) => Math.sqrt(t[0] * t[0] + t[1] * t[1]), Wa = (t) => Math.sqrt(t[4] * t[4] + t[5] * t[5]), xf = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: $a,
  scaleY: Wa,
  scale: (t) => ($a(t) + Wa(t)) / 2,
  rotateX: (t) => Ws(zt(Math.atan2(t[6], t[5]))),
  rotateY: (t) => Ws(zt(Math.atan2(-t[2], t[0]))),
  rotateZ: Ba,
  rotate: Ba,
  skewX: (t) => zt(Math.atan(t[4])),
  skewY: (t) => zt(Math.atan(t[1])),
  skew: (t) => (Math.abs(t[1]) + Math.abs(t[4])) / 2
};
function zs(t) {
  return t.includes("scale") ? 1 : 0;
}
function Zs(t, e) {
  if (!t || t === "none")
    return zs(e);
  const n = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let r, s;
  if (n)
    r = xf, s = n;
  else {
    const o = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    r = vf, s = o;
  }
  if (!s)
    return zs(e);
  const i = r[e], a = s[1].split(",").map(wf);
  return typeof i == "function" ? i(a) : a[i];
}
const bf = (t, e) => {
  const { transform: n = "none" } = getComputedStyle(t);
  return Zs(n, e);
};
function wf(t) {
  return parseFloat(t.trim());
}
const pn = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], gn = new Set(pn), za = (t) => t === mn || t === U, _f = /* @__PURE__ */ new Set(["x", "y", "z"]), Tf = pn.filter((t) => !_f.has(t));
function Sf(t) {
  const e = [];
  return Tf.forEach((n) => {
    const r = t.getValue(n);
    r !== void 0 && (e.push([n, r.get()]), r.set(n.startsWith("scale") ? 1 : 0));
  }), e;
}
const Rt = {
  // Dimensions
  width: ({ x: t }, { paddingLeft: e = "0", paddingRight: n = "0", boxSizing: r }) => {
    const s = t.max - t.min;
    return r === "border-box" ? s : s - parseFloat(e) - parseFloat(n);
  },
  height: ({ y: t }, { paddingTop: e = "0", paddingBottom: n = "0", boxSizing: r }) => {
    const s = t.max - t.min;
    return r === "border-box" ? s : s - parseFloat(e) - parseFloat(n);
  },
  top: (t, { top: e }) => parseFloat(e),
  left: (t, { left: e }) => parseFloat(e),
  bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
  right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
  // Transform
  x: (t, { transform: e }) => Zs(e, "x"),
  y: (t, { transform: e }) => Zs(e, "y")
};
Rt.translateX = Rt.x;
Rt.translateY = Rt.y;
const Zt = /* @__PURE__ */ new Set();
let Hs = !1, Ys = !1, Ks = !1;
function Ol() {
  if (Ys) {
    const t = Array.from(Zt).filter((r) => r.needsMeasurement), e = new Set(t.map((r) => r.element)), n = /* @__PURE__ */ new Map();
    e.forEach((r) => {
      const s = Sf(r);
      s.length && (n.set(r, s), r.render());
    }), t.forEach((r) => r.measureInitialState()), e.forEach((r) => {
      r.render();
      const s = n.get(r);
      s && s.forEach(([i, a]) => {
        var o;
        (o = r.getValue(i)) == null || o.set(a);
      });
    }), t.forEach((r) => r.measureEndState()), t.forEach((r) => {
      r.suspendedScrollY !== void 0 && window.scrollTo(0, r.suspendedScrollY);
    });
  }
  Ys = !1, Hs = !1, Zt.forEach((t) => t.complete(Ks)), Zt.clear();
}
function Dl() {
  Zt.forEach((t) => {
    t.readKeyframes(), t.needsMeasurement && (Ys = !0);
  });
}
function kf() {
  Ks = !0, Dl(), Ol(), Ks = !1;
}
class _i {
  constructor(e, n, r, s, i, a = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...e], this.onComplete = n, this.name = r, this.motionValue = s, this.element = i, this.isAsync = a;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (Zt.add(this), Hs || (Hs = !0, Re.read(Dl), Re.resolveKeyframes(Ol))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, name: n, element: r, motionValue: s } = this;
    if (e[0] === null) {
      const i = s == null ? void 0 : s.get(), a = e[e.length - 1];
      if (i !== void 0)
        e[0] = i;
      else if (r && n) {
        const o = r.readValue(n, a);
        o != null && (e[0] = o);
      }
      e[0] === void 0 && (e[0] = a), s && i === void 0 && s.set(e[0]);
    }
    yf(e);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(e = !1) {
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), Zt.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (Zt.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const Cf = (t) => t.startsWith("--");
function Ml(t, e, n) {
  Cf(e) ? t.style.setProperty(e, n) : t.style[e] = n;
}
const Ef = {};
function Vl(t, e) {
  const n = /* @__PURE__ */ cl(t);
  return () => Ef[e] ?? n();
}
const Rf = /* @__PURE__ */ Vl(() => window.ScrollTimeline !== void 0, "scrollTimeline"), Nl = /* @__PURE__ */ Vl(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), In = ([t, e, n, r]) => `cubic-bezier(${t}, ${e}, ${n}, ${r})`, Za = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ In([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ In([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ In([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ In([0.33, 1.53, 0.69, 0.99])
};
function Ll(t, e) {
  if (t)
    return typeof t == "function" ? Nl() ? Pl(t, e) : "ease-out" : bl(t) ? In(t) : Array.isArray(t) ? t.map((n) => Ll(n, e) || Za.easeOut) : Za[t];
}
function Af(t, e, n, { delay: r = 0, duration: s = 300, repeat: i = 0, repeatType: a = "loop", ease: o = "easeOut", times: c } = {}, u = void 0) {
  const d = {
    [e]: n
  };
  c && (d.offset = c);
  const f = Ll(o, s);
  Array.isArray(f) && (d.easing = f);
  const m = {
    delay: r,
    duration: s,
    easing: Array.isArray(f) ? "linear" : f,
    fill: "both",
    iterations: i + 1,
    direction: a === "reverse" ? "alternate" : "normal"
  };
  return u && (m.pseudoElement = u), t.animate(d, m);
}
function Fl(t) {
  return typeof t == "function" && "applyToOptions" in t;
}
function Pf({ type: t, ...e }) {
  return Fl(t) && Nl() ? t.applyToOptions(e) : (e.duration ?? (e.duration = 300), e.ease ?? (e.ease = "easeOut"), e);
}
class Ul extends wi {
  constructor(e) {
    if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !e)
      return;
    const { element: n, name: r, keyframes: s, pseudoElement: i, allowFlatten: a = !1, finalKeyframe: o, onComplete: c } = e;
    this.isPseudoElement = !!i, this.allowFlatten = a, this.options = e, vt(typeof e.type != "string", `Mini animate() doesn't support "type" as a string.`, "mini-spring");
    const u = Pf(e);
    this.animation = Af(n, r, s, u, i), u.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !i) {
        const d = Nr(s, this.options, o, this.speed);
        this.updateMotionValue && this.updateMotionValue(d), Ml(n, r, d), this.animation.cancel();
      }
      c == null || c(), this.notifyFinished();
    };
  }
  play() {
    this.isStopped || (this.manualStartTime = null, this.animation.play(), this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    var e, n;
    (n = (e = this.animation).finish) == null || n.call(e);
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = !0;
    const { state: e } = this;
    e === "idle" || e === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    var n, r, s;
    const e = (n = this.options) == null ? void 0 : n.element;
    !this.isPseudoElement && (e != null && e.isConnected) && ((s = (r = this.animation).commitStyles) == null || s.call(r));
  }
  get duration() {
    var n, r;
    const e = ((r = (n = this.animation.effect) == null ? void 0 : n.getComputedTiming) == null ? void 0 : r.call(n).duration) || 0;
    return /* @__PURE__ */ tt(Number(e));
  }
  get iterationDuration() {
    const { delay: e = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ tt(e);
  }
  get time() {
    return /* @__PURE__ */ tt(Number(this.animation.currentTime) || 0);
  }
  set time(e) {
    const n = this.finishedTime !== null;
    this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ Je(e), n && this.animation.pause();
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(e) {
    e < 0 && (this.finishedTime = null), this.animation.playbackRate = e;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return this.manualStartTime ?? Number(this.animation.startTime);
  }
  set startTime(e) {
    this.manualStartTime = this.animation.startTime = e;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline: e, rangeStart: n, rangeEnd: r, observe: s }) {
    var i;
    return this.allowFlatten && ((i = this.animation.effect) == null || i.updateTiming({ easing: "linear" })), this.animation.onfinish = null, e && Rf() ? (this.animation.timeline = e, n && (this.animation.rangeStart = n), r && (this.animation.rangeEnd = r), nt) : s(this);
  }
}
const Bl = {
  anticipate: gl,
  backInOut: pl,
  circInOut: vl
};
function jf(t) {
  return t in Bl;
}
function If(t) {
  typeof t.ease == "string" && jf(t.ease) && (t.ease = Bl[t.ease]);
}
const ys = 10;
class Of extends Ul {
  constructor(e) {
    If(e), Il(e), super(e), e.startTime !== void 0 && e.autoplay !== !1 && (this.startTime = e.startTime), this.options = e;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read committed styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(e) {
    const { motionValue: n, onUpdate: r, onComplete: s, element: i, ...a } = this.options;
    if (!n)
      return;
    if (e !== void 0) {
      n.set(e);
      return;
    }
    const o = new jr({
      ...a,
      autoplay: !1
    }), c = Math.max(ys, Ke.now() - this.startTime), u = mt(0, ys, c - ys), d = o.sample(c).value, { name: f } = this.options;
    i && f && Ml(i, f, d), n.setWithVelocity(o.sample(Math.max(0, c - u)).value, d, u), o.stop();
  }
}
const Ha = (t, e) => e === "zIndex" ? !1 : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && // It's animatable if we have a string
(lt.test(t) || t === "0") && // And it contains numbers and/or colors
!t.startsWith("url("));
function Df(t) {
  const e = t[0];
  if (t.length === 1)
    return !0;
  for (let n = 0; n < t.length; n++)
    if (t[n] !== e)
      return !0;
}
function Mf(t, e, n, r) {
  const s = t[0];
  if (s === null)
    return !1;
  if (e === "display" || e === "visibility")
    return !0;
  const i = t[t.length - 1], a = Ha(s, e), o = Ha(i, e);
  return hn(a === o, `You are trying to animate ${e} from "${s}" to "${i}". "${a ? i : s}" is not an animatable value.`, "value-not-animatable"), !a || !o ? !1 : Df(t) || (n === "spring" || Fl(n)) && r;
}
function Gs(t) {
  t.duration = 0, t.type = "keyframes";
}
const $l = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
  // or until we implement support for linear() easing.
  // "background-color"
]), Vf = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function Nf(t) {
  for (let e = 0; e < t.length; e++)
    if (typeof t[e] == "string" && Vf.test(t[e]))
      return !0;
  return !1;
}
const Lf = /* @__PURE__ */ new Set([
  "color",
  "backgroundColor",
  "outlineColor",
  "fill",
  "stroke",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor"
]), Ff = /* @__PURE__ */ cl(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function Uf(t) {
  var f;
  const { motionValue: e, name: n, repeatDelay: r, repeatType: s, damping: i, type: a, keyframes: o } = t;
  if (!(((f = e == null ? void 0 : e.owner) == null ? void 0 : f.current) instanceof HTMLElement))
    return !1;
  const { onUpdate: u, transformTemplate: d } = e.owner.getProps();
  return Ff() && n && /**
   * Force WAAPI for color properties with browser-only color formats
   * (oklch, oklab, lab, lch, etc.) that the JS animation path can't parse.
   */
  ($l.has(n) || Lf.has(n) && Nf(o)) && (n !== "transform" || !d) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !u && !r && s !== "mirror" && i !== 0 && a !== "inertia";
}
const Bf = 40;
class $f extends wi {
  constructor({ autoplay: e = !0, delay: n = 0, type: r = "keyframes", repeat: s = 0, repeatDelay: i = 0, repeatType: a = "loop", keyframes: o, name: c, motionValue: u, element: d, ...f }) {
    var b;
    super(), this.stop = () => {
      var C, S;
      this._animation && (this._animation.stop(), (C = this.stopTimeline) == null || C.call(this)), (S = this.keyframeResolver) == null || S.cancel();
    }, this.createdAt = Ke.now();
    const m = {
      autoplay: e,
      delay: n,
      type: r,
      repeat: s,
      repeatDelay: i,
      repeatType: a,
      name: c,
      motionValue: u,
      element: d,
      ...f
    }, y = (d == null ? void 0 : d.KeyframeResolver) || _i;
    this.keyframeResolver = new y(o, (C, S, k) => this.onKeyframesResolved(C, S, m, !k), c, u, d), (b = this.keyframeResolver) == null || b.scheduleResolve();
  }
  onKeyframesResolved(e, n, r, s) {
    var k, j;
    this.keyframeResolver = void 0;
    const { name: i, type: a, velocity: o, delay: c, isHandoff: u, onUpdate: d } = r;
    this.resolvedAt = Ke.now();
    let f = !0;
    Mf(e, i, a, o) || (f = !1, (It.instantAnimations || !c) && (d == null || d(Nr(e, r, n))), e[0] = e[e.length - 1], Gs(r), r.repeat = 0);
    const y = {
      startTime: s ? this.resolvedAt ? this.resolvedAt - this.createdAt > Bf ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe: n,
      ...r,
      keyframes: e
    }, b = f && !u && Uf(y), C = (j = (k = y.motionValue) == null ? void 0 : k.owner) == null ? void 0 : j.current;
    let S;
    if (b)
      try {
        S = new Of({
          ...y,
          element: C
        });
      } catch {
        S = new jr(y);
      }
    else
      S = new jr(y);
    S.finished.then(() => {
      this.notifyFinished();
    }).catch(nt), this.pendingTimeline && (this.stopTimeline = S.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = S;
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(e, n) {
    return this.finished.finally(e).then(() => {
    });
  }
  get animation() {
    var e;
    return this._animation || ((e = this.keyframeResolver) == null || e.resume(), kf()), this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(e) {
    this.animation.time = e;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(e) {
    this.animation.speed = e;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(e) {
    return this._animation ? this.stopTimeline = this.animation.attachTimeline(e) : this.pendingTimeline = e, () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    var e;
    this._animation && this.animation.cancel(), (e = this.keyframeResolver) == null || e.cancel();
  }
}
function Wl(t, e, n, r = 0, s = 1) {
  const i = Array.from(t).sort((u, d) => u.sortNodePosition(d)).indexOf(e), a = t.size, o = (a - 1) * r;
  return typeof n == "function" ? n(i, a) : s === 1 ? i * r : o - i * r;
}
const Wf = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function zf(t) {
  const e = Wf.exec(t);
  if (!e)
    return [,];
  const [, n, r, s] = e;
  return [`--${n ?? r}`, s];
}
const Zf = 4;
function zl(t, e, n = 1) {
  vt(n <= Zf, `Max CSS variable fallback depth detected in property "${t}". This may indicate a circular fallback dependency.`, "max-css-var-depth");
  const [r, s] = zf(t);
  if (!r)
    return;
  const i = window.getComputedStyle(e).getPropertyValue(r);
  if (i) {
    const a = i.trim();
    return al(a) ? parseFloat(a) : a;
  }
  return gi(s) ? zl(s, e, n + 1) : s;
}
const Hf = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, Yf = (t) => ({
  type: "spring",
  stiffness: 550,
  damping: t === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), Kf = {
  type: "keyframes",
  duration: 0.8
}, Gf = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, qf = (t, { keyframes: e }) => e.length > 2 ? Kf : gn.has(t) ? t.startsWith("scale") ? Yf(e[1]) : Hf : Gf;
function Zl(t, e) {
  if (t != null && t.inherit && e) {
    const { inherit: n, ...r } = t;
    return { ...e, ...r };
  }
  return t;
}
function Ti(t, e) {
  const n = (t == null ? void 0 : t[e]) ?? (t == null ? void 0 : t.default) ?? t;
  return n !== t ? Zl(n, t) : n;
}
const Xf = /* @__PURE__ */ new Set([
  "when",
  "delay",
  "delayChildren",
  "staggerChildren",
  "staggerDirection",
  "repeat",
  "repeatType",
  "repeatDelay",
  "from",
  "elapsed"
]);
function Jf(t) {
  for (const e in t)
    if (!Xf.has(e))
      return !0;
  return !1;
}
const Si = (t, e, n, r = {}, s, i) => (a) => {
  const o = Ti(r, t) || {}, c = o.delay || r.delay || 0;
  let { elapsed: u = 0 } = r;
  u = u - /* @__PURE__ */ Je(c);
  const d = {
    keyframes: Array.isArray(n) ? n : [null, n],
    ease: "easeOut",
    velocity: e.getVelocity(),
    ...o,
    delay: -u,
    onUpdate: (m) => {
      e.set(m), o.onUpdate && o.onUpdate(m);
    },
    onComplete: () => {
      a(), o.onComplete && o.onComplete();
    },
    name: t,
    motionValue: e,
    element: i ? void 0 : s
  };
  Jf(o) || Object.assign(d, qf(t, d)), d.duration && (d.duration = /* @__PURE__ */ Je(d.duration)), d.repeatDelay && (d.repeatDelay = /* @__PURE__ */ Je(d.repeatDelay)), d.from !== void 0 && (d.keyframes[0] = d.from);
  let f = !1;
  if ((d.type === !1 || d.duration === 0 && !d.repeatDelay) && (Gs(d), d.delay === 0 && (f = !0)), (It.instantAnimations || It.skipAnimations || s != null && s.shouldSkipAnimations) && (f = !0, Gs(d), d.delay = 0), d.allowFlatten = !o.type && !o.ease, f && !i && e.get() !== void 0) {
    const m = Nr(d.keyframes, o);
    if (m !== void 0) {
      Re.update(() => {
        d.onUpdate(m), d.onComplete();
      });
      return;
    }
  }
  return o.isSync ? new jr(d) : new $f(d);
};
function Ya(t) {
  const e = [{}, {}];
  return t == null || t.values.forEach((n, r) => {
    e[0][r] = n.get(), e[1][r] = n.getVelocity();
  }), e;
}
function ki(t, e, n, r) {
  if (typeof e == "function") {
    const [s, i] = Ya(r);
    e = e(n !== void 0 ? n : t.custom, s, i);
  }
  if (typeof e == "string" && (e = t.variants && t.variants[e]), typeof e == "function") {
    const [s, i] = Ya(r);
    e = e(n !== void 0 ? n : t.custom, s, i);
  }
  return e;
}
function Ht(t, e, n) {
  const r = t.getProps();
  return ki(r, e, n !== void 0 ? n : r.custom, t);
}
const Hl = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...pn
]);
var Qf = {};
const Ka = 30, eh = (t) => !isNaN(parseFloat(t));
class th {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(e, n = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (r) => {
      var i;
      const s = Ke.now();
      if (this.updatedAt !== s && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(r), this.current !== this.prev && ((i = this.events.change) == null || i.notify(this.current), this.dependents))
        for (const a of this.dependents)
          a.dirty();
    }, this.hasAnimated = !1, this.setCurrent(e), this.owner = n.owner;
  }
  setCurrent(e) {
    this.current = e, this.updatedAt = Ke.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = eh(this.current));
  }
  setPrevFrameValue(e = this.current) {
    this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(e) {
    return Qf.NODE_ENV !== "production" && hi(!1, 'value.onChange(callback) is deprecated. Switch to value.on("change", callback).'), this.on("change", e);
  }
  on(e, n) {
    this.events[e] || (this.events[e] = new fi());
    const r = this.events[e].add(n);
    return e === "change" ? () => {
      r(), Re.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : r;
  }
  clearListeners() {
    for (const e in this.events)
      this.events[e].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(e, n) {
    this.passiveEffect = e, this.stopPassiveEffect = n;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(e) {
    this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e);
  }
  setWithVelocity(e, n, r) {
    this.set(n), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - r;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(e, n = !0) {
    this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, n && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  dirty() {
    var e;
    (e = this.events.change) == null || e.notify(this.current);
  }
  addDependent(e) {
    this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(e);
  }
  removeDependent(e) {
    this.dependents && this.dependents.delete(e);
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const e = Ke.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > Ka)
      return 0;
    const n = Math.min(this.updatedAt - this.prevUpdatedAt, Ka);
    return ul(parseFloat(this.current) - parseFloat(this.prevFrameValue), n);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(e) {
    return this.stop(), new Promise((n) => {
      this.hasAnimated = !0, this.animation = e(n), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    var e, n;
    (e = this.dependents) == null || e.clear(), (n = this.events.destroy) == null || n.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function fn(t, e) {
  return new th(t, e);
}
const qs = (t) => Array.isArray(t);
function nh(t, e, n) {
  t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, fn(n));
}
function rh(t) {
  return qs(t) ? t[t.length - 1] || 0 : t;
}
function sh(t, e) {
  const n = Ht(t, e);
  let { transitionEnd: r = {}, transition: s = {}, ...i } = n || {};
  i = { ...i, ...r };
  for (const a in i) {
    const o = rh(i[a]);
    nh(t, a, o);
  }
}
const Ze = (t) => !!(t && t.getVelocity);
function ih(t) {
  return !!(Ze(t) && t.add);
}
function Xs(t, e) {
  const n = t.getValue("willChange");
  if (ih(n))
    return n.add(e);
  if (!n && It.WillChange) {
    const r = new It.WillChange("auto");
    t.addValue("willChange", r), r.add(e);
  }
}
function Ci(t) {
  return t.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
}
const ah = "framerAppearId", Yl = "data-" + Ci(ah);
function Kl(t) {
  return t.props[Yl];
}
function oh({ protectedKeys: t, needsAnimating: e }, n) {
  const r = t.hasOwnProperty(n) && e[n] !== !0;
  return e[n] = !1, r;
}
function Gl(t, e, { delay: n = 0, transitionOverride: r, type: s } = {}) {
  let { transition: i, transitionEnd: a, ...o } = e;
  const c = t.getDefaultTransition();
  i = i ? Zl(i, c) : c;
  const u = i == null ? void 0 : i.reduceMotion;
  r && (i = r);
  const d = [], f = s && t.animationState && t.animationState.getState()[s];
  for (const m in o) {
    const y = t.getValue(m, t.latestValues[m] ?? null), b = o[m];
    if (b === void 0 || f && oh(f, m))
      continue;
    const C = {
      delay: n,
      ...Ti(i || {}, m)
    }, S = y.get();
    if (S !== void 0 && !y.isAnimating() && !Array.isArray(b) && b === S && !C.velocity) {
      Re.update(() => y.set(b));
      continue;
    }
    let k = !1;
    if (window.MotionHandoffAnimation) {
      const D = Kl(t);
      if (D) {
        const M = window.MotionHandoffAnimation(D, m, Re);
        M !== null && (C.startTime = M, k = !0);
      }
    }
    Xs(t, m);
    const j = u ?? t.shouldReduceMotion;
    y.start(Si(m, y, b, j && Hl.has(m) ? { type: !1 } : C, t, k));
    const E = y.animation;
    E && d.push(E);
  }
  if (a) {
    const m = () => Re.update(() => {
      a && sh(t, a);
    });
    d.length ? Promise.all(d).then(m) : m();
  }
  return d;
}
function Js(t, e, n = {}) {
  var c;
  const r = Ht(t, e, n.type === "exit" ? (c = t.presenceContext) == null ? void 0 : c.custom : void 0);
  let { transition: s = t.getDefaultTransition() || {} } = r || {};
  n.transitionOverride && (s = n.transitionOverride);
  const i = r ? () => Promise.all(Gl(t, r, n)) : () => Promise.resolve(), a = t.variantChildren && t.variantChildren.size ? (u = 0) => {
    const { delayChildren: d = 0, staggerChildren: f, staggerDirection: m } = s;
    return lh(t, e, u, d, f, m, n);
  } : () => Promise.resolve(), { when: o } = s;
  if (o) {
    const [u, d] = o === "beforeChildren" ? [i, a] : [a, i];
    return u().then(() => d());
  } else
    return Promise.all([i(), a(n.delay)]);
}
function lh(t, e, n = 0, r = 0, s = 0, i = 1, a) {
  const o = [];
  for (const c of t.variantChildren)
    c.notify("AnimationStart", e), o.push(Js(c, e, {
      ...a,
      delay: n + (typeof r == "function" ? 0 : r) + Wl(t.variantChildren, c, r, s, i)
    }).then(() => c.notify("AnimationComplete", e)));
  return Promise.all(o);
}
function ch(t, e, n = {}) {
  t.notify("AnimationStart", e);
  let r;
  if (Array.isArray(e)) {
    const s = e.map((i) => Js(t, i, n));
    r = Promise.all(s);
  } else if (typeof e == "string")
    r = Js(t, e, n);
  else {
    const s = typeof e == "function" ? Ht(t, e, n.custom) : e;
    r = Promise.all(Gl(t, s, n));
  }
  return r.then(() => {
    t.notify("AnimationComplete", e);
  });
}
const uh = {
  test: (t) => t === "auto",
  parse: (t) => t
}, ql = (t) => (e) => e.test(t), Xl = [mn, U, ht, St, Id, jd, uh], Ga = (t) => Xl.find(ql(t));
function dh(t) {
  return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || ll(t) : !0;
}
const fh = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function hh(t) {
  const [e, n] = t.slice(0, -1).split("(");
  if (e === "drop-shadow")
    return t;
  const [r] = n.match(yi) || [];
  if (!r)
    return t;
  const s = n.replace(r, "");
  let i = fh.has(e) ? 1 : 0;
  return r !== n && (i *= 100), e + "(" + i + s + ")";
}
const mh = /\b([a-z-]*)\(.*?\)/gu, Qs = {
  ...lt,
  getAnimatableNone: (t) => {
    const e = t.match(mh);
    return e ? e.map(hh).join(" ") : t;
  }
}, ei = {
  ...lt,
  getAnimatableNone: (t) => {
    const e = lt.parse(t);
    return lt.createTransformer(t)(e.map((r) => typeof r == "number" ? 0 : typeof r == "object" ? { ...r, alpha: 1 } : r));
  }
}, qa = {
  ...mn,
  transform: Math.round
}, ph = {
  rotate: St,
  rotateX: St,
  rotateY: St,
  rotateZ: St,
  scale: cr,
  scaleX: cr,
  scaleY: cr,
  scaleZ: cr,
  skew: St,
  skewX: St,
  skewY: St,
  distance: U,
  translateX: U,
  translateY: U,
  translateZ: U,
  x: U,
  y: U,
  z: U,
  perspective: U,
  transformPerspective: U,
  opacity: Un,
  originX: Va,
  originY: Va,
  originZ: U
}, Ei = {
  // Border props
  borderWidth: U,
  borderTopWidth: U,
  borderRightWidth: U,
  borderBottomWidth: U,
  borderLeftWidth: U,
  borderRadius: U,
  borderTopLeftRadius: U,
  borderTopRightRadius: U,
  borderBottomRightRadius: U,
  borderBottomLeftRadius: U,
  // Positioning props
  width: U,
  maxWidth: U,
  height: U,
  maxHeight: U,
  top: U,
  right: U,
  bottom: U,
  left: U,
  inset: U,
  insetBlock: U,
  insetBlockStart: U,
  insetBlockEnd: U,
  insetInline: U,
  insetInlineStart: U,
  insetInlineEnd: U,
  // Spacing props
  padding: U,
  paddingTop: U,
  paddingRight: U,
  paddingBottom: U,
  paddingLeft: U,
  paddingBlock: U,
  paddingBlockStart: U,
  paddingBlockEnd: U,
  paddingInline: U,
  paddingInlineStart: U,
  paddingInlineEnd: U,
  margin: U,
  marginTop: U,
  marginRight: U,
  marginBottom: U,
  marginLeft: U,
  marginBlock: U,
  marginBlockStart: U,
  marginBlockEnd: U,
  marginInline: U,
  marginInlineStart: U,
  marginInlineEnd: U,
  // Typography
  fontSize: U,
  // Misc
  backgroundPositionX: U,
  backgroundPositionY: U,
  ...ph,
  zIndex: qa,
  // SVG
  fillOpacity: Un,
  strokeOpacity: Un,
  numOctaves: qa
}, gh = {
  ...Ei,
  // Color props
  color: Fe,
  backgroundColor: Fe,
  outlineColor: Fe,
  fill: Fe,
  stroke: Fe,
  // Border props
  borderColor: Fe,
  borderTopColor: Fe,
  borderRightColor: Fe,
  borderBottomColor: Fe,
  borderLeftColor: Fe,
  filter: Qs,
  WebkitFilter: Qs,
  mask: ei,
  WebkitMask: ei
}, Jl = (t) => gh[t], yh = /* @__PURE__ */ new Set([Qs, ei]);
function Ql(t, e) {
  let n = Jl(t);
  return yh.has(n) || (n = lt), n.getAnimatableNone ? n.getAnimatableNone(e) : void 0;
}
const vh = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function xh(t, e, n) {
  let r = 0, s;
  for (; r < t.length && !s; ) {
    const i = t[r];
    typeof i == "string" && !vh.has(i) && dn(i).values.length && (s = t[r]), r++;
  }
  if (s && n)
    for (const i of e)
      t[i] = Ql(n, s);
}
class bh extends _i {
  constructor(e, n, r, s, i) {
    super(e, n, r, s, i, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: e, element: n, name: r } = this;
    if (!n || !n.current)
      return;
    super.readKeyframes();
    for (let d = 0; d < e.length; d++) {
      let f = e[d];
      if (typeof f == "string" && (f = f.trim(), gi(f))) {
        const m = zl(f, n.current);
        m !== void 0 && (e[d] = m), d === e.length - 1 && (this.finalKeyframe = f);
      }
    }
    if (this.resolveNoneKeyframes(), !Hl.has(r) || e.length !== 2)
      return;
    const [s, i] = e, a = Ga(s), o = Ga(i), c = Ma(s), u = Ma(i);
    if (c !== u && Rt[r]) {
      this.needsMeasurement = !0;
      return;
    }
    if (a !== o)
      if (za(a) && za(o))
        for (let d = 0; d < e.length; d++) {
          const f = e[d];
          typeof f == "string" && (e[d] = parseFloat(f));
        }
      else Rt[r] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: e, name: n } = this, r = [];
    for (let s = 0; s < e.length; s++)
      (e[s] === null || dh(e[s])) && r.push(s);
    r.length && xh(e, r, n);
  }
  measureInitialState() {
    const { element: e, unresolvedKeyframes: n, name: r } = this;
    if (!e || !e.current)
      return;
    r === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = Rt[r](e.measureViewportBox(), window.getComputedStyle(e.current)), n[0] = this.measuredOrigin;
    const s = n[n.length - 1];
    s !== void 0 && e.getValue(r, s).jump(s, !1);
  }
  measureEndState() {
    var o;
    const { element: e, name: n, unresolvedKeyframes: r } = this;
    if (!e || !e.current)
      return;
    const s = e.getValue(n);
    s && s.jump(this.measuredOrigin, !1);
    const i = r.length - 1, a = r[i];
    r[i] = Rt[n](e.measureViewportBox(), window.getComputedStyle(e.current)), a !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = a), (o = this.removedTransforms) != null && o.length && this.removedTransforms.forEach(([c, u]) => {
      e.getValue(c).set(u);
    }), this.resolveNoneKeyframes();
  }
}
function ec(t, e, n) {
  if (t == null)
    return [];
  if (t instanceof EventTarget)
    return [t];
  if (typeof t == "string") {
    let r = document;
    const s = (n == null ? void 0 : n[t]) ?? r.querySelectorAll(t);
    return s ? Array.from(s) : [];
  }
  return Array.from(t).filter((r) => r != null);
}
const tc = (t, e) => e && typeof t == "number" ? e.transform(t) : t;
function pr(t) {
  return ol(t) && "offsetHeight" in t && !("ownerSVGElement" in t);
}
const { schedule: Ri } = /* @__PURE__ */ wl(queueMicrotask, !1), at = {
  x: !1,
  y: !1
};
function nc() {
  return at.x || at.y;
}
function wh(t) {
  return t === "x" || t === "y" ? at[t] ? null : (at[t] = !0, () => {
    at[t] = !1;
  }) : at.x || at.y ? null : (at.x = at.y = !0, () => {
    at.x = at.y = !1;
  });
}
function rc(t, e) {
  const n = ec(t), r = new AbortController(), s = {
    passive: !0,
    ...e,
    signal: r.signal
  };
  return [n, s, () => r.abort()];
}
function _h(t) {
  return !(t.pointerType === "touch" || nc());
}
function Th(t, e, n = {}) {
  const [r, s, i] = rc(t, n);
  return r.forEach((a) => {
    let o = !1, c = !1, u;
    const d = () => {
      a.removeEventListener("pointerleave", b);
    }, f = (S) => {
      u && (u(S), u = void 0), d();
    }, m = (S) => {
      o = !1, window.removeEventListener("pointerup", m), window.removeEventListener("pointercancel", m), c && (c = !1, f(S));
    }, y = () => {
      o = !0, window.addEventListener("pointerup", m, s), window.addEventListener("pointercancel", m, s);
    }, b = (S) => {
      if (S.pointerType !== "touch") {
        if (o) {
          c = !0;
          return;
        }
        f(S);
      }
    }, C = (S) => {
      if (!_h(S))
        return;
      c = !1;
      const k = e(a, S);
      typeof k == "function" && (u = k, a.addEventListener("pointerleave", b, s));
    };
    a.addEventListener("pointerenter", C, s), a.addEventListener("pointerdown", y, s);
  }), i;
}
const sc = (t, e) => e ? t === e ? !0 : sc(t, e.parentElement) : !1, Ai = (t) => t.pointerType === "mouse" ? typeof t.button != "number" || t.button <= 0 : t.isPrimary !== !1, Sh = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function kh(t) {
  return Sh.has(t.tagName) || t.isContentEditable === !0;
}
const Ch = /* @__PURE__ */ new Set(["INPUT", "SELECT", "TEXTAREA"]);
function Eh(t) {
  return Ch.has(t.tagName) || t.isContentEditable === !0;
}
const gr = /* @__PURE__ */ new WeakSet();
function Xa(t) {
  return (e) => {
    e.key === "Enter" && t(e);
  };
}
function vs(t, e) {
  t.dispatchEvent(new PointerEvent("pointer" + e, { isPrimary: !0, bubbles: !0 }));
}
const Rh = (t, e) => {
  const n = t.currentTarget;
  if (!n)
    return;
  const r = Xa(() => {
    if (gr.has(n))
      return;
    vs(n, "down");
    const s = Xa(() => {
      vs(n, "up");
    }), i = () => vs(n, "cancel");
    n.addEventListener("keyup", s, e), n.addEventListener("blur", i, e);
  });
  n.addEventListener("keydown", r, e), n.addEventListener("blur", () => n.removeEventListener("keydown", r), e);
};
function Ja(t) {
  return Ai(t) && !nc();
}
const Qa = /* @__PURE__ */ new WeakSet();
function Ah(t, e, n = {}) {
  const [r, s, i] = rc(t, n), a = (o) => {
    const c = o.currentTarget;
    if (!Ja(o) || Qa.has(o))
      return;
    gr.add(c), n.stopPropagation && Qa.add(o);
    const u = e(c, o), d = (y, b) => {
      window.removeEventListener("pointerup", f), window.removeEventListener("pointercancel", m), gr.has(c) && gr.delete(c), Ja(y) && typeof u == "function" && u(y, { success: b });
    }, f = (y) => {
      d(y, c === window || c === document || n.useGlobalTarget || sc(c, y.target));
    }, m = (y) => {
      d(y, !1);
    };
    window.addEventListener("pointerup", f, s), window.addEventListener("pointercancel", m, s);
  };
  return r.forEach((o) => {
    (n.useGlobalTarget ? window : o).addEventListener("pointerdown", a, s), pr(o) && (o.addEventListener("focus", (u) => Rh(u, s)), !kh(o) && !o.hasAttribute("tabindex") && (o.tabIndex = 0));
  }), i;
}
function Pi(t) {
  return ol(t) && "ownerSVGElement" in t;
}
const yr = /* @__PURE__ */ new WeakMap();
let kt;
const ic = (t, e, n) => (r, s) => s && s[0] ? s[0][t + "Size"] : Pi(r) && "getBBox" in r ? r.getBBox()[e] : r[n], Ph = /* @__PURE__ */ ic("inline", "width", "offsetWidth"), jh = /* @__PURE__ */ ic("block", "height", "offsetHeight");
function Ih({ target: t, borderBoxSize: e }) {
  var n;
  (n = yr.get(t)) == null || n.forEach((r) => {
    r(t, {
      get width() {
        return Ph(t, e);
      },
      get height() {
        return jh(t, e);
      }
    });
  });
}
function Oh(t) {
  t.forEach(Ih);
}
function Dh() {
  typeof ResizeObserver > "u" || (kt = new ResizeObserver(Oh));
}
function Mh(t, e) {
  kt || Dh();
  const n = ec(t);
  return n.forEach((r) => {
    let s = yr.get(r);
    s || (s = /* @__PURE__ */ new Set(), yr.set(r, s)), s.add(e), kt == null || kt.observe(r);
  }), () => {
    n.forEach((r) => {
      const s = yr.get(r);
      s == null || s.delete(e), s != null && s.size || kt == null || kt.unobserve(r);
    });
  };
}
const vr = /* @__PURE__ */ new Set();
let sn;
function Vh() {
  sn = () => {
    const t = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      }
    };
    vr.forEach((e) => e(t));
  }, window.addEventListener("resize", sn);
}
function Nh(t) {
  return vr.add(t), sn || Vh(), () => {
    vr.delete(t), !vr.size && typeof sn == "function" && (window.removeEventListener("resize", sn), sn = void 0);
  };
}
function eo(t, e) {
  return typeof t == "function" ? Nh(t) : Mh(t, e);
}
function Lh(t) {
  return Pi(t) && t.tagName === "svg";
}
const Fh = [...Xl, Fe, lt], Uh = (t) => Fh.find(ql(t)), to = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), an = () => ({
  x: to(),
  y: to()
}), no = () => ({ min: 0, max: 0 }), Ue = () => ({
  x: no(),
  y: no()
}), Bh = /* @__PURE__ */ new WeakMap();
function Lr(t) {
  return t !== null && typeof t == "object" && typeof t.start == "function";
}
function Bn(t) {
  return typeof t == "string" || Array.isArray(t);
}
const ji = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], Ii = ["initial", ...ji];
function Fr(t) {
  return Lr(t.animate) || Ii.some((e) => Bn(t[e]));
}
function ac(t) {
  return !!(Fr(t) || t.variants);
}
function $h(t, e, n) {
  for (const r in e) {
    const s = e[r], i = n[r];
    if (Ze(s))
      t.addValue(r, s);
    else if (Ze(i))
      t.addValue(r, fn(s, { owner: t }));
    else if (i !== s)
      if (t.hasValue(r)) {
        const a = t.getValue(r);
        a.liveStyle === !0 ? a.jump(s) : a.hasAnimated || a.set(s);
      } else {
        const a = t.getStaticValue(r);
        t.addValue(r, fn(a !== void 0 ? a : s, { owner: t }));
      }
  }
  for (const r in n)
    e[r] === void 0 && t.removeValue(r);
  return e;
}
const ti = { current: null }, oc = { current: !1 }, Wh = typeof window < "u";
function zh() {
  if (oc.current = !0, !!Wh)
    if (window.matchMedia) {
      const t = window.matchMedia("(prefers-reduced-motion)"), e = () => ti.current = t.matches;
      t.addEventListener("change", e), e();
    } else
      ti.current = !1;
}
var Zh = {};
const ro = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
let Ir = {};
function lc(t) {
  Ir = t;
}
function Hh() {
  return Ir;
}
class Yh {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(e, n, r) {
    return {};
  }
  constructor({ parent: e, props: n, presenceContext: r, reducedMotionConfig: s, skipAnimations: i, blockInitialAnimation: a, visualState: o }, c = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.shouldSkipAnimations = !1, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = _i, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = !1, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const y = Ke.now();
      this.renderScheduledAt < y && (this.renderScheduledAt = y, Re.render(this.render, !1, !0));
    };
    const { latestValues: u, renderState: d } = o;
    this.latestValues = u, this.baseTarget = { ...u }, this.initialValues = n.initial ? { ...u } : {}, this.renderState = d, this.parent = e, this.props = n, this.presenceContext = r, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = s, this.skipAnimationsConfig = i, this.options = c, this.blockInitialAnimation = !!a, this.isControllingVariants = Fr(n), this.isVariantNode = ac(n), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
    const { willChange: f, ...m } = this.scrapeMotionValuesFromProps(n, {}, this);
    for (const y in m) {
      const b = m[y];
      u[y] !== void 0 && Ze(b) && b.set(u[y]);
    }
  }
  mount(e) {
    var n, r;
    if (this.hasBeenMounted)
      for (const s in this.initialValues)
        (n = this.values.get(s)) == null || n.jump(this.initialValues[s]), this.latestValues[s] = this.initialValues[s];
    this.current = e, Bh.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((s, i) => this.bindToMotionValue(i, s)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = !1 : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = !0 : (oc.current || zh(), this.shouldReduceMotion = ti.current), Zh.NODE_ENV !== "production" && hi(this.shouldReduceMotion !== !0, "You have Reduced Motion enabled on your device. Animations may not appear as expected.", "reduced-motion-disabled"), this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1, (r = this.parent) == null || r.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = !0;
  }
  unmount() {
    var e;
    this.projection && this.projection.unmount(), Ot(this.notifyUpdate), Ot(this.render), this.valueSubscriptions.forEach((n) => n()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), (e = this.parent) == null || e.removeChild(this);
    for (const n in this.events)
      this.events[n].clear();
    for (const n in this.features) {
      const r = this.features[n];
      r && (r.unmount(), r.isMounted = !1);
    }
    this.current = null;
  }
  addChild(e) {
    this.children.add(e), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(e);
  }
  removeChild(e) {
    this.children.delete(e), this.enteringChildren && this.enteringChildren.delete(e);
  }
  bindToMotionValue(e, n) {
    if (this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)(), n.accelerate && $l.has(e) && this.current instanceof HTMLElement) {
      const { factory: a, keyframes: o, times: c, ease: u, duration: d } = n.accelerate, f = new Ul({
        element: this.current,
        name: e,
        keyframes: o,
        times: c,
        ease: u,
        duration: /* @__PURE__ */ Je(d)
      }), m = a(f);
      this.valueSubscriptions.set(e, () => {
        m(), f.cancel();
      });
      return;
    }
    const r = gn.has(e);
    r && this.onBindTransform && this.onBindTransform();
    const s = n.on("change", (a) => {
      this.latestValues[e] = a, this.props.onUpdate && Re.preRender(this.notifyUpdate), r && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
    });
    let i;
    typeof window < "u" && window.MotionCheckAppearSync && (i = window.MotionCheckAppearSync(this, e, n)), this.valueSubscriptions.set(e, () => {
      s(), i && i(), n.owner && n.stop();
    });
  }
  sortNodePosition(e) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current);
  }
  updateFeatures() {
    let e = "animation";
    for (e in Ir) {
      const n = Ir[e];
      if (!n)
        continue;
      const { isEnabled: r, Feature: s } = n;
      if (!this.features[e] && s && r(this.props) && (this.features[e] = new s(this)), this.features[e]) {
        const i = this.features[e];
        i.isMounted ? i.update() : (i.mount(), i.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : Ue();
  }
  getStaticValue(e) {
    return this.latestValues[e];
  }
  setStaticValue(e, n) {
    this.latestValues[e] = n;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(e, n) {
    (e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = n;
    for (let r = 0; r < ro.length; r++) {
      const s = ro[r];
      this.propEventSubscriptions[s] && (this.propEventSubscriptions[s](), delete this.propEventSubscriptions[s]);
      const i = "on" + s, a = e[i];
      a && (this.propEventSubscriptions[s] = this.on(s, a));
    }
    this.prevMotionValues = $h(this, this.scrapeMotionValuesFromProps(e, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(e) {
    return this.props.variants ? this.props.variants[e] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(e) {
    const n = this.getClosestVariantNode();
    if (n)
      return n.variantChildren && n.variantChildren.add(e), () => n.variantChildren.delete(e);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(e, n) {
    const r = this.values.get(e);
    n !== r && (r && this.removeValue(e), this.bindToMotionValue(e, n), this.values.set(e, n), this.latestValues[e] = n.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(e) {
    this.values.delete(e);
    const n = this.valueSubscriptions.get(e);
    n && (n(), this.valueSubscriptions.delete(e)), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(e) {
    return this.values.has(e);
  }
  getValue(e, n) {
    if (this.props.values && this.props.values[e])
      return this.props.values[e];
    let r = this.values.get(e);
    return r === void 0 && n !== void 0 && (r = fn(n === null ? void 0 : n, { owner: this }), this.addValue(e, r)), r;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(e, n) {
    let r = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
    return r != null && (typeof r == "string" && (al(r) || ll(r)) ? r = parseFloat(r) : !Uh(r) && lt.test(n) && (r = Ql(e, n)), this.setBaseTarget(e, Ze(r) ? r.get() : r)), Ze(r) ? r.get() : r;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(e, n) {
    this.baseTarget[e] = n;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(e) {
    var i;
    const { initial: n } = this.props;
    let r;
    if (typeof n == "string" || typeof n == "object") {
      const a = ki(this.props, n, (i = this.presenceContext) == null ? void 0 : i.custom);
      a && (r = a[e]);
    }
    if (n && r !== void 0)
      return r;
    const s = this.getBaseTargetFromProps(this.props, e);
    return s !== void 0 && !Ze(s) ? s : this.initialValues[e] !== void 0 && r === void 0 ? void 0 : this.baseTarget[e];
  }
  on(e, n) {
    return this.events[e] || (this.events[e] = new fi()), this.events[e].add(n);
  }
  notify(e, ...n) {
    this.events[e] && this.events[e].notify(...n);
  }
  scheduleRenderMicrotask() {
    Ri.render(this.render);
  }
}
class cc extends Yh {
  constructor() {
    super(...arguments), this.KeyframeResolver = bh;
  }
  sortInstanceNodePosition(e, n) {
    return e.compareDocumentPosition(n) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(e, n) {
    const r = e.style;
    return r ? r[n] : void 0;
  }
  removeValueFromRenderState(e, { vars: n, style: r }) {
    delete n[e], delete r[e];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: e } = this.props;
    Ze(e) && (this.childSubscription = e.on("change", (n) => {
      this.current && (this.current.textContent = `${n}`);
    }));
  }
}
class Dt {
  constructor(e) {
    this.isMounted = !1, this.node = e;
  }
  update() {
  }
}
function uc({ top: t, left: e, right: n, bottom: r }) {
  return {
    x: { min: e, max: n },
    y: { min: t, max: r }
  };
}
function Kh({ x: t, y: e }) {
  return { top: e.min, right: t.max, bottom: e.max, left: t.min };
}
function Gh(t, e) {
  if (!e)
    return t;
  const n = e({ x: t.left, y: t.top }), r = e({ x: t.right, y: t.bottom });
  return {
    top: n.y,
    left: n.x,
    bottom: r.y,
    right: r.x
  };
}
function xs(t) {
  return t === void 0 || t === 1;
}
function ni({ scale: t, scaleX: e, scaleY: n }) {
  return !xs(t) || !xs(e) || !xs(n);
}
function $t(t) {
  return ni(t) || dc(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY;
}
function dc(t) {
  return so(t.x) || so(t.y);
}
function so(t) {
  return t && t !== "0%";
}
function Or(t, e, n) {
  const r = t - n, s = e * r;
  return n + s;
}
function io(t, e, n, r, s) {
  return s !== void 0 && (t = Or(t, s, r)), Or(t, n, r) + e;
}
function ri(t, e = 0, n = 1, r, s) {
  t.min = io(t.min, e, n, r, s), t.max = io(t.max, e, n, r, s);
}
function fc(t, { x: e, y: n }) {
  ri(t.x, e.translate, e.scale, e.originPoint), ri(t.y, n.translate, n.scale, n.originPoint);
}
const ao = 0.999999999999, oo = 1.0000000000001;
function qh(t, e, n, r = !1) {
  var o;
  const s = n.length;
  if (!s)
    return;
  e.x = e.y = 1;
  let i, a;
  for (let c = 0; c < s; c++) {
    i = n[c], a = i.projectionDelta;
    const { visualElement: u } = i.options;
    u && u.props.style && u.props.style.display === "contents" || (r && i.options.layoutScroll && i.scroll && i !== i.root && (dt(t.x, -i.scroll.offset.x), dt(t.y, -i.scroll.offset.y)), a && (e.x *= a.x.scale, e.y *= a.y.scale, fc(t, a)), r && $t(i.latestValues) && xr(t, i.latestValues, (o = i.layout) == null ? void 0 : o.layoutBox));
  }
  e.x < oo && e.x > ao && (e.x = 1), e.y < oo && e.y > ao && (e.y = 1);
}
function dt(t, e) {
  t.min += e, t.max += e;
}
function lo(t, e, n, r, s = 0.5) {
  const i = Ae(t.min, t.max, s);
  ri(t, e, n, i, r);
}
function co(t, e) {
  return typeof t == "string" ? parseFloat(t) / 100 * (e.max - e.min) : t;
}
function xr(t, e, n) {
  const r = n ?? t;
  lo(t.x, co(e.x, r.x), e.scaleX, e.scale, e.originX), lo(t.y, co(e.y, r.y), e.scaleY, e.scale, e.originY);
}
function hc(t, e) {
  return uc(Gh(t.getBoundingClientRect(), e));
}
function Xh(t, e, n) {
  const r = hc(t, n), { scroll: s } = e;
  return s && (dt(r.x, s.offset.x), dt(r.y, s.offset.y)), r;
}
const Jh = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, Qh = pn.length;
function em(t, e, n) {
  let r = "", s = !0;
  for (let i = 0; i < Qh; i++) {
    const a = pn[i], o = t[a];
    if (o === void 0)
      continue;
    let c = !0;
    if (typeof o == "number")
      c = o === (a.startsWith("scale") ? 1 : 0);
    else {
      const u = parseFloat(o);
      c = a.startsWith("scale") ? u === 1 : u === 0;
    }
    if (!c || n) {
      const u = tc(o, Ei[a]);
      if (!c) {
        s = !1;
        const d = Jh[a] || a;
        r += `${d}(${u}) `;
      }
      n && (e[a] = u);
    }
  }
  return r = r.trim(), n ? r = n(e, s ? "" : r) : s && (r = "none"), r;
}
function Oi(t, e, n) {
  const { style: r, vars: s, transformOrigin: i } = t;
  let a = !1, o = !1;
  for (const c in e) {
    const u = e[c];
    if (gn.has(c)) {
      a = !0;
      continue;
    } else if (Tl(c)) {
      s[c] = u;
      continue;
    } else {
      const d = tc(u, Ei[c]);
      c.startsWith("origin") ? (o = !0, i[c] = d) : r[c] = d;
    }
  }
  if (e.transform || (a || n ? r.transform = em(e, t.transform, n) : r.transform && (r.transform = "none")), o) {
    const { originX: c = "50%", originY: u = "50%", originZ: d = 0 } = i;
    r.transformOrigin = `${c} ${u} ${d}`;
  }
}
function mc(t, { style: e, vars: n }, r, s) {
  const i = t.style;
  let a;
  for (a in e)
    i[a] = e[a];
  s == null || s.applyProjectionStyles(i, r);
  for (a in n)
    i.setProperty(a, n[a]);
}
function uo(t, e) {
  return e.max === e.min ? 0 : t / (e.max - e.min) * 100;
}
const En = {
  correct: (t, e) => {
    if (!e.target)
      return t;
    if (typeof t == "string")
      if (U.test(t))
        t = parseFloat(t);
      else
        return t;
    const n = uo(t, e.target.x), r = uo(t, e.target.y);
    return `${n}% ${r}%`;
  }
}, tm = {
  correct: (t, { treeScale: e, projectionDelta: n }) => {
    const r = t, s = lt.parse(t);
    if (s.length > 5)
      return r;
    const i = lt.createTransformer(t), a = typeof s[0] != "number" ? 1 : 0, o = n.x.scale * e.x, c = n.y.scale * e.y;
    s[0 + a] /= o, s[1 + a] /= c;
    const u = Ae(o, c, 0.5);
    return typeof s[2 + a] == "number" && (s[2 + a] /= u), typeof s[3 + a] == "number" && (s[3 + a] /= u), i(s);
  }
}, si = {
  borderRadius: {
    ...En,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: En,
  borderTopRightRadius: En,
  borderBottomLeftRadius: En,
  borderBottomRightRadius: En,
  boxShadow: tm
};
function pc(t, { layout: e, layoutId: n }) {
  return gn.has(t) || t.startsWith("origin") || (e || n !== void 0) && (!!si[t] || t === "opacity");
}
function Di(t, e, n) {
  var a;
  const r = t.style, s = e == null ? void 0 : e.style, i = {};
  if (!r)
    return i;
  for (const o in r)
    (Ze(r[o]) || s && Ze(s[o]) || pc(o, t) || ((a = n == null ? void 0 : n.getValue(o)) == null ? void 0 : a.liveStyle) !== void 0) && (i[o] = r[o]);
  return i;
}
function nm(t) {
  return window.getComputedStyle(t);
}
class rm extends cc {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = mc;
  }
  readValueFromInstance(e, n) {
    var r;
    if (gn.has(n))
      return (r = this.projection) != null && r.isProjecting ? zs(n) : bf(e, n);
    {
      const s = nm(e), i = (Tl(n) ? s.getPropertyValue(n) : s[n]) || 0;
      return typeof i == "string" ? i.trim() : i;
    }
  }
  measureInstanceViewportBox(e, { transformPagePoint: n }) {
    return hc(e, n);
  }
  build(e, n, r) {
    Oi(e, n, r.transformTemplate);
  }
  scrapeMotionValuesFromProps(e, n, r) {
    return Di(e, n, r);
  }
}
const sm = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, im = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function am(t, e, n = 1, r = 0, s = !0) {
  t.pathLength = 1;
  const i = s ? sm : im;
  t[i.offset] = `${-r}`, t[i.array] = `${e} ${n}`;
}
const om = [
  "offsetDistance",
  "offsetPath",
  "offsetRotate",
  "offsetAnchor"
];
function gc(t, {
  attrX: e,
  attrY: n,
  attrScale: r,
  pathLength: s,
  pathSpacing: i = 1,
  pathOffset: a = 0,
  // This is object creation, which we try to avoid per-frame.
  ...o
}, c, u, d) {
  if (Oi(t, o, u), c) {
    t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
    return;
  }
  t.attrs = t.style, t.style = {};
  const { attrs: f, style: m } = t;
  f.transform && (m.transform = f.transform, delete f.transform), (m.transform || f.transformOrigin) && (m.transformOrigin = f.transformOrigin ?? "50% 50%", delete f.transformOrigin), m.transform && (m.transformBox = (d == null ? void 0 : d.transformBox) ?? "fill-box", delete f.transformBox);
  for (const y of om)
    f[y] !== void 0 && (m[y] = f[y], delete f[y]);
  e !== void 0 && (f.x = e), n !== void 0 && (f.y = n), r !== void 0 && (f.scale = r), s !== void 0 && am(f, s, i, a, !1);
}
const yc = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]), vc = (t) => typeof t == "string" && t.toLowerCase() === "svg";
function lm(t, e, n, r) {
  mc(t, e, void 0, r);
  for (const s in e.attrs)
    t.setAttribute(yc.has(s) ? s : Ci(s), e.attrs[s]);
}
function xc(t, e, n) {
  const r = Di(t, e, n);
  for (const s in t)
    if (Ze(t[s]) || Ze(e[s])) {
      const i = pn.indexOf(s) !== -1 ? "attr" + s.charAt(0).toUpperCase() + s.substring(1) : s;
      r[i] = t[s];
    }
  return r;
}
class cm extends cc {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = Ue;
  }
  getBaseTargetFromProps(e, n) {
    return e[n];
  }
  readValueFromInstance(e, n) {
    if (gn.has(n)) {
      const r = Jl(n);
      return r && r.default || 0;
    }
    return n = yc.has(n) ? n : Ci(n), e.getAttribute(n);
  }
  scrapeMotionValuesFromProps(e, n, r) {
    return xc(e, n, r);
  }
  build(e, n, r) {
    gc(e, n, this.isSVGTag, r.transformTemplate, r.style);
  }
  renderInstance(e, n, r, s) {
    lm(e, n, r, s);
  }
  mount(e) {
    this.isSVGTag = vc(e.tagName), super.mount(e);
  }
}
const um = Ii.length;
function bc(t) {
  if (!t)
    return;
  if (!t.isControllingVariants) {
    const n = t.parent ? bc(t.parent) || {} : {};
    return t.props.initial !== void 0 && (n.initial = t.props.initial), n;
  }
  const e = {};
  for (let n = 0; n < um; n++) {
    const r = Ii[n], s = t.props[r];
    (Bn(s) || s === !1) && (e[r] = s);
  }
  return e;
}
function wc(t, e) {
  if (!Array.isArray(e))
    return !1;
  const n = e.length;
  if (n !== t.length)
    return !1;
  for (let r = 0; r < n; r++)
    if (e[r] !== t[r])
      return !1;
  return !0;
}
const dm = [...ji].reverse(), fm = ji.length;
function hm(t) {
  return (e) => Promise.all(e.map(({ animation: n, options: r }) => ch(t, n, r)));
}
function mm(t) {
  let e = hm(t), n = fo(), r = !0, s = !1;
  const i = (u) => (d, f) => {
    var y;
    const m = Ht(t, f, u === "exit" ? (y = t.presenceContext) == null ? void 0 : y.custom : void 0);
    if (m) {
      const { transition: b, transitionEnd: C, ...S } = m;
      d = { ...d, ...S, ...C };
    }
    return d;
  };
  function a(u) {
    e = u(t);
  }
  function o(u) {
    const { props: d } = t, f = bc(t.parent) || {}, m = [], y = /* @__PURE__ */ new Set();
    let b = {}, C = 1 / 0;
    for (let k = 0; k < fm; k++) {
      const j = dm[k], E = n[j], D = d[j] !== void 0 ? d[j] : f[j], M = Bn(D), B = j === u ? E.isActive : null;
      B === !1 && (C = k);
      let Q = D === f[j] && D !== d[j] && M;
      if (Q && (r || s) && t.manuallyAnimateOnMount && (Q = !1), E.protectedKeys = { ...b }, // If it isn't active and hasn't *just* been set as inactive
      !E.isActive && B === null || // If we didn't and don't have any defined prop for this animation type
      !D && !E.prevProp || // Or if the prop doesn't define an animation
      Lr(D) || typeof D == "boolean")
        continue;
      if (j === "exit" && E.isActive && B !== !0) {
        E.prevResolvedValues && (b = {
          ...b,
          ...E.prevResolvedValues
        });
        continue;
      }
      const V = pm(E.prevProp, D);
      let G = V || // If we're making this variant active, we want to always make it active
      j === u && E.isActive && !Q && M || // If we removed a higher-priority variant (i is in reverse order)
      k > C && M, F = !1;
      const ie = Array.isArray(D) ? D : [D];
      let xe = ie.reduce(i(j), {});
      B === !1 && (xe = {});
      const { prevResolvedValues: Se = {} } = E, me = {
        ...Se,
        ...xe
      }, pe = (w) => {
        G = !0, y.has(w) && (F = !0, y.delete(w)), E.needsAnimating[w] = !0;
        const Y = t.getValue(w);
        Y && (Y.liveStyle = !1);
      };
      for (const w in me) {
        const Y = xe[w], K = Se[w];
        if (b.hasOwnProperty(w))
          continue;
        let g = !1;
        qs(Y) && qs(K) ? g = !wc(Y, K) : g = Y !== K, g ? Y != null ? pe(w) : y.add(w) : Y !== void 0 && y.has(w) ? pe(w) : E.protectedKeys[w] = !0;
      }
      E.prevProp = D, E.prevResolvedValues = xe, E.isActive && (b = { ...b, ...xe }), (r || s) && t.blockInitialAnimation && (G = !1);
      const ue = Q && V;
      G && (!ue || F) && m.push(...ie.map((w) => {
        const Y = { type: j };
        if (typeof w == "string" && (r || s) && !ue && t.manuallyAnimateOnMount && t.parent) {
          const { parent: K } = t, g = Ht(K, w);
          if (K.enteringChildren && g) {
            const { delayChildren: R } = g.transition || {};
            Y.delay = Wl(K.enteringChildren, t, R);
          }
        }
        return {
          animation: w,
          options: Y
        };
      }));
    }
    if (y.size) {
      const k = {};
      if (typeof d.initial != "boolean") {
        const j = Ht(t, Array.isArray(d.initial) ? d.initial[0] : d.initial);
        j && j.transition && (k.transition = j.transition);
      }
      y.forEach((j) => {
        const E = t.getBaseTarget(j), D = t.getValue(j);
        D && (D.liveStyle = !0), k[j] = E ?? null;
      }), m.push({ animation: k });
    }
    let S = !!m.length;
    return r && (d.initial === !1 || d.initial === d.animate) && !t.manuallyAnimateOnMount && (S = !1), r = !1, s = !1, S ? e(m) : Promise.resolve();
  }
  function c(u, d) {
    var m;
    if (n[u].isActive === d)
      return Promise.resolve();
    (m = t.variantChildren) == null || m.forEach((y) => {
      var b;
      return (b = y.animationState) == null ? void 0 : b.setActive(u, d);
    }), n[u].isActive = d;
    const f = o(u);
    for (const y in n)
      n[y].protectedKeys = {};
    return f;
  }
  return {
    animateChanges: o,
    setActive: c,
    setAnimateFunction: a,
    getState: () => n,
    reset: () => {
      n = fo(), s = !0;
    }
  };
}
function pm(t, e) {
  return typeof e == "string" ? e !== t : Array.isArray(e) ? !wc(e, t) : !1;
}
function Bt(t = !1) {
  return {
    isActive: t,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function fo() {
  return {
    animate: Bt(!0),
    whileInView: Bt(),
    whileHover: Bt(),
    whileTap: Bt(),
    whileDrag: Bt(),
    whileFocus: Bt(),
    exit: Bt()
  };
}
function ii(t, e) {
  t.min = e.min, t.max = e.max;
}
function it(t, e) {
  ii(t.x, e.x), ii(t.y, e.y);
}
function ho(t, e) {
  t.translate = e.translate, t.scale = e.scale, t.originPoint = e.originPoint, t.origin = e.origin;
}
const _c = 1e-4, gm = 1 - _c, ym = 1 + _c, Tc = 0.01, vm = 0 - Tc, xm = 0 + Tc;
function Ge(t) {
  return t.max - t.min;
}
function bm(t, e, n) {
  return Math.abs(t - e) <= n;
}
function mo(t, e, n, r = 0.5) {
  t.origin = r, t.originPoint = Ae(e.min, e.max, t.origin), t.scale = Ge(n) / Ge(e), t.translate = Ae(n.min, n.max, t.origin) - t.originPoint, (t.scale >= gm && t.scale <= ym || isNaN(t.scale)) && (t.scale = 1), (t.translate >= vm && t.translate <= xm || isNaN(t.translate)) && (t.translate = 0);
}
function Dn(t, e, n, r) {
  mo(t.x, e.x, n.x, r ? r.originX : void 0), mo(t.y, e.y, n.y, r ? r.originY : void 0);
}
function po(t, e, n, r = 0) {
  const s = r ? Ae(n.min, n.max, r) : n.min;
  t.min = s + e.min, t.max = t.min + Ge(e);
}
function wm(t, e, n, r) {
  po(t.x, e.x, n.x, r == null ? void 0 : r.x), po(t.y, e.y, n.y, r == null ? void 0 : r.y);
}
function go(t, e, n, r = 0) {
  const s = r ? Ae(n.min, n.max, r) : n.min;
  t.min = e.min - s, t.max = t.min + Ge(e);
}
function Dr(t, e, n, r) {
  go(t.x, e.x, n.x, r == null ? void 0 : r.x), go(t.y, e.y, n.y, r == null ? void 0 : r.y);
}
function yo(t, e, n, r, s) {
  return t -= e, t = Or(t, 1 / n, r), s !== void 0 && (t = Or(t, 1 / s, r)), t;
}
function _m(t, e = 0, n = 1, r = 0.5, s, i = t, a = t) {
  if (ht.test(e) && (e = parseFloat(e), e = Ae(a.min, a.max, e / 100) - a.min), typeof e != "number")
    return;
  let o = Ae(i.min, i.max, r);
  t === i && (o -= e), t.min = yo(t.min, e, n, o, s), t.max = yo(t.max, e, n, o, s);
}
function vo(t, e, [n, r, s], i, a) {
  _m(t, e[n], e[r], e[s], e.scale, i, a);
}
const Tm = ["x", "scaleX", "originX"], Sm = ["y", "scaleY", "originY"];
function xo(t, e, n, r) {
  vo(t.x, e, Tm, n ? n.x : void 0, r ? r.x : void 0), vo(t.y, e, Sm, n ? n.y : void 0, r ? r.y : void 0);
}
function bo(t) {
  return t.translate === 0 && t.scale === 1;
}
function Sc(t) {
  return bo(t.x) && bo(t.y);
}
function wo(t, e) {
  return t.min === e.min && t.max === e.max;
}
function km(t, e) {
  return wo(t.x, e.x) && wo(t.y, e.y);
}
function _o(t, e) {
  return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max);
}
function kc(t, e) {
  return _o(t.x, e.x) && _o(t.y, e.y);
}
function To(t) {
  return Ge(t.x) / Ge(t.y);
}
function So(t, e) {
  return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint;
}
function ut(t) {
  return [t("x"), t("y")];
}
function Cm(t, e, n) {
  let r = "";
  const s = t.x.translate / e.x, i = t.y.translate / e.y, a = (n == null ? void 0 : n.z) || 0;
  if ((s || i || a) && (r = `translate3d(${s}px, ${i}px, ${a}px) `), (e.x !== 1 || e.y !== 1) && (r += `scale(${1 / e.x}, ${1 / e.y}) `), n) {
    const { transformPerspective: u, rotate: d, rotateX: f, rotateY: m, skewX: y, skewY: b } = n;
    u && (r = `perspective(${u}px) ${r}`), d && (r += `rotate(${d}deg) `), f && (r += `rotateX(${f}deg) `), m && (r += `rotateY(${m}deg) `), y && (r += `skewX(${y}deg) `), b && (r += `skewY(${b}deg) `);
  }
  const o = t.x.scale * e.x, c = t.y.scale * e.y;
  return (o !== 1 || c !== 1) && (r += `scale(${o}, ${c})`), r || "none";
}
const Cc = [
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius"
], Em = Cc.length, ko = (t) => typeof t == "string" ? parseFloat(t) : t, Co = (t) => typeof t == "number" || U.test(t);
function Rm(t, e, n, r, s, i) {
  s ? (t.opacity = Ae(0, n.opacity ?? 1, Am(r)), t.opacityExit = Ae(e.opacity ?? 1, 0, Pm(r))) : i && (t.opacity = Ae(e.opacity ?? 1, n.opacity ?? 1, r));
  for (let a = 0; a < Em; a++) {
    const o = Cc[a];
    let c = Eo(e, o), u = Eo(n, o);
    if (c === void 0 && u === void 0)
      continue;
    c || (c = 0), u || (u = 0), c === 0 || u === 0 || Co(c) === Co(u) ? (t[o] = Math.max(Ae(ko(c), ko(u), r), 0), (ht.test(u) || ht.test(c)) && (t[o] += "%")) : t[o] = u;
  }
  (e.rotate || n.rotate) && (t.rotate = Ae(e.rotate || 0, n.rotate || 0, r));
}
function Eo(t, e) {
  return t[e] !== void 0 ? t[e] : t.borderRadius;
}
const Am = /* @__PURE__ */ Ec(0, 0.5, yl), Pm = /* @__PURE__ */ Ec(0.5, 0.95, nt);
function Ec(t, e, n) {
  return (r) => r < t ? 0 : r > e ? 1 : n(/* @__PURE__ */ Fn(t, e, r));
}
function jm(t, e, n) {
  const r = Ze(t) ? t : fn(t);
  return r.start(Si("", r, e, n)), r.animation;
}
function $n(t, e, n, r = { passive: !0 }) {
  return t.addEventListener(e, n, r), () => t.removeEventListener(e, n);
}
const Im = (t, e) => t.depth - e.depth;
class Om {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(e) {
    di(this.children, e), this.isDirty = !0;
  }
  remove(e) {
    Er(this.children, e), this.isDirty = !0;
  }
  forEach(e) {
    this.isDirty && this.children.sort(Im), this.isDirty = !1, this.children.forEach(e);
  }
}
function Dm(t, e) {
  const n = Ke.now(), r = ({ timestamp: s }) => {
    const i = s - n;
    i >= e && (Ot(r), t(i - e));
  };
  return Re.setup(r, !0), () => Ot(r);
}
function br(t) {
  return Ze(t) ? t.get() : t;
}
class Mm {
  constructor() {
    this.members = [];
  }
  add(e) {
    di(this.members, e);
    for (let n = this.members.length - 1; n >= 0; n--) {
      const r = this.members[n];
      if (r === e || r === this.lead || r === this.prevLead)
        continue;
      const s = r.instance;
      (!s || s.isConnected === !1) && !r.snapshot && (Er(this.members, r), r.unmount());
    }
    e.scheduleRender();
  }
  remove(e) {
    if (Er(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
      const n = this.members[this.members.length - 1];
      n && this.promote(n);
    }
  }
  relegate(e) {
    var n;
    for (let r = this.members.indexOf(e) - 1; r >= 0; r--) {
      const s = this.members[r];
      if (s.isPresent !== !1 && ((n = s.instance) == null ? void 0 : n.isConnected) !== !1)
        return this.promote(s), !0;
    }
    return !1;
  }
  promote(e, n) {
    var s;
    const r = this.lead;
    if (e !== r && (this.prevLead = r, this.lead = e, e.show(), r)) {
      r.updateSnapshot(), e.scheduleRender();
      const { layoutDependency: i } = r.options, { layoutDependency: a } = e.options;
      (i === void 0 || i !== a) && (e.resumeFrom = r, n && (r.preserveOpacity = !0), r.snapshot && (e.snapshot = r.snapshot, e.snapshot.latestValues = r.animationValues || r.latestValues), (s = e.root) != null && s.isUpdating && (e.isLayoutDirty = !0)), e.options.crossfade === !1 && r.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((e) => {
      var n, r, s, i, a;
      (r = (n = e.options).onExitComplete) == null || r.call(n), (a = (s = e.resumingFrom) == null ? void 0 : (i = s.options).onExitComplete) == null || a.call(i);
    });
  }
  scheduleRender() {
    this.members.forEach((e) => e.instance && e.scheduleRender(!1));
  }
  removeLeadSnapshot() {
    var e;
    (e = this.lead) != null && e.snapshot && (this.lead.snapshot = void 0);
  }
}
const wr = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
}, bs = ["", "X", "Y", "Z"], Vm = 1e3;
let Nm = 0;
function ws(t, e, n, r) {
  const { latestValues: s } = e;
  s[t] && (n[t] = s[t], e.setStaticValue(t, 0), r && (r[t] = 0));
}
function Rc(t) {
  if (t.hasCheckedOptimisedAppear = !0, t.root === t)
    return;
  const { visualElement: e } = t.options;
  if (!e)
    return;
  const n = Kl(e);
  if (window.MotionHasOptimisedAnimation(n, "transform")) {
    const { layout: s, layoutId: i } = t.options;
    window.MotionCancelOptimisedAnimation(n, "transform", Re, !(s || i));
  }
  const { parent: r } = t;
  r && !r.hasCheckedOptimisedAppear && Rc(r);
}
function Ac({ attachResizeListener: t, defaultParent: e, measureScroll: n, checkIsScrollRoot: r, resetTransform: s }) {
  return class {
    constructor(a = {}, o = e == null ? void 0 : e()) {
      this.id = Nm++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.layoutVersion = 0, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(Um), this.nodes.forEach(Hm), this.nodes.forEach(Ym), this.nodes.forEach(Bm);
      }, this.resolvedRelativeTargetAt = 0, this.linkedParentVersion = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = a, this.root = o ? o.root || o : this, this.path = o ? [...o.path, o] : [], this.parent = o, this.depth = o ? o.depth + 1 : 0;
      for (let c = 0; c < this.path.length; c++)
        this.path[c].shouldResetTransform = !0;
      this.root === this && (this.nodes = new Om());
    }
    addEventListener(a, o) {
      return this.eventHandlers.has(a) || this.eventHandlers.set(a, new fi()), this.eventHandlers.get(a).add(o);
    }
    notifyListeners(a, ...o) {
      const c = this.eventHandlers.get(a);
      c && c.notify(...o);
    }
    hasListeners(a) {
      return this.eventHandlers.has(a);
    }
    /**
     * Lifecycles
     */
    mount(a) {
      if (this.instance)
        return;
      this.isSVG = Pi(a) && !Lh(a), this.instance = a;
      const { layoutId: o, layout: c, visualElement: u } = this.options;
      if (u && !u.current && u.mount(a), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (c || o) && (this.isLayoutDirty = !0), t) {
        let d, f = 0;
        const m = () => this.root.updateBlockedByResize = !1;
        Re.read(() => {
          f = window.innerWidth;
        }), t(a, () => {
          const y = window.innerWidth;
          y !== f && (f = y, this.root.updateBlockedByResize = !0, d && d(), d = Dm(m, 250), wr.hasAnimatedSinceResize && (wr.hasAnimatedSinceResize = !1, this.nodes.forEach(Po)));
        });
      }
      o && this.root.registerSharedNode(o, this), this.options.animate !== !1 && u && (o || c) && this.addEventListener("didUpdate", ({ delta: d, hasLayoutChanged: f, hasRelativeLayoutChanged: m, layout: y }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const b = this.options.transition || u.getDefaultTransition() || Jm, { onLayoutAnimationStart: C, onLayoutAnimationComplete: S } = u.getProps(), k = !this.targetLayout || !kc(this.targetLayout, y), j = !f && m;
        if (this.options.layoutRoot || this.resumeFrom || j || f && (k || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const E = {
            ...Ti(b, "layout"),
            onPlay: C,
            onComplete: S
          };
          (u.shouldReduceMotion || this.options.layoutRoot) && (E.delay = 0, E.type = !1), this.startAnimation(E), this.setAnimationOrigin(d, j);
        } else
          f || Po(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = y;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const a = this.getStack();
      a && a.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), Ot(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(Km), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: a } = this.options;
      return a && a.getProps().transformTemplate;
    }
    willUpdate(a = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && Rc(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let d = 0; d < this.path.length; d++) {
        const f = this.path[d];
        f.shouldResetTransform = !0, (typeof f.latestValues.x == "string" || typeof f.latestValues.y == "string") && (f.isLayoutDirty = !0), f.updateScroll("snapshot"), f.options.layoutRoot && f.willUpdate(!1);
      }
      const { layoutId: o, layout: c } = this.options;
      if (o === void 0 && !c)
        return;
      const u = this.getTransformTemplate();
      this.prevTransformTemplateValue = u ? u(this.latestValues, "") : void 0, this.updateSnapshot(), a && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        const c = this.updateBlockedByResize;
        this.unblockUpdate(), this.updateBlockedByResize = !1, this.clearAllSnapshots(), c && this.nodes.forEach(Wm), this.nodes.forEach(Ro);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(Ao);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(zm), this.nodes.forEach(Zm), this.nodes.forEach(Lm), this.nodes.forEach(Fm)) : this.nodes.forEach(Ao), this.clearAllSnapshots();
      const o = Ke.now();
      ze.delta = mt(0, 1e3 / 60, o - ze.timestamp), ze.timestamp = o, ze.isProcessing = !0, fs.update.process(ze), fs.preRender.process(ze), fs.render.process(ze), ze.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, Ri.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach($m), this.sharedNodes.forEach(Gm);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, Re.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      Re.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !Ge(this.snapshot.measuredBox.x) && !Ge(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let c = 0; c < this.path.length; c++)
          this.path[c].updateScroll();
      const a = this.layout;
      this.layout = this.measure(!1), this.layoutVersion++, this.layoutCorrected || (this.layoutCorrected = Ue()), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: o } = this.options;
      o && o.notify("LayoutMeasure", this.layout.layoutBox, a ? a.layoutBox : void 0);
    }
    updateScroll(a = "measure") {
      let o = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === a && (o = !1), o && this.instance) {
        const c = r(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: a,
          isRoot: c,
          offset: n(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : c
        };
      }
    }
    resetTransform() {
      if (!s)
        return;
      const a = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, o = this.projectionDelta && !Sc(this.projectionDelta), c = this.getTransformTemplate(), u = c ? c(this.latestValues, "") : void 0, d = u !== this.prevTransformTemplateValue;
      a && this.instance && (o || $t(this.latestValues) || d) && (s(this.instance, u), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(a = !0) {
      const o = this.measurePageBox();
      let c = this.removeElementScroll(o);
      return a && (c = this.removeTransform(c)), Qm(c), {
        animationId: this.root.animationId,
        measuredBox: o,
        layoutBox: c,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var u;
      const { visualElement: a } = this.options;
      if (!a)
        return Ue();
      const o = a.measureViewportBox();
      if (!(((u = this.scroll) == null ? void 0 : u.wasRoot) || this.path.some(ep))) {
        const { scroll: d } = this.root;
        d && (dt(o.x, d.offset.x), dt(o.y, d.offset.y));
      }
      return o;
    }
    removeElementScroll(a) {
      var c;
      const o = Ue();
      if (it(o, a), (c = this.scroll) != null && c.wasRoot)
        return o;
      for (let u = 0; u < this.path.length; u++) {
        const d = this.path[u], { scroll: f, options: m } = d;
        d !== this.root && f && m.layoutScroll && (f.wasRoot && it(o, a), dt(o.x, f.offset.x), dt(o.y, f.offset.y));
      }
      return o;
    }
    applyTransform(a, o = !1, c) {
      var d, f;
      const u = c || Ue();
      it(u, a);
      for (let m = 0; m < this.path.length; m++) {
        const y = this.path[m];
        !o && y.options.layoutScroll && y.scroll && y !== y.root && (dt(u.x, -y.scroll.offset.x), dt(u.y, -y.scroll.offset.y)), $t(y.latestValues) && xr(u, y.latestValues, (d = y.layout) == null ? void 0 : d.layoutBox);
      }
      return $t(this.latestValues) && xr(u, this.latestValues, (f = this.layout) == null ? void 0 : f.layoutBox), u;
    }
    removeTransform(a) {
      var c;
      const o = Ue();
      it(o, a);
      for (let u = 0; u < this.path.length; u++) {
        const d = this.path[u];
        if (!$t(d.latestValues))
          continue;
        let f;
        d.instance && (ni(d.latestValues) && d.updateSnapshot(), f = Ue(), it(f, d.measurePageBox())), xo(o, d.latestValues, (c = d.snapshot) == null ? void 0 : c.layoutBox, f);
      }
      return $t(this.latestValues) && xo(o, this.latestValues), o;
    }
    setTargetDelta(a) {
      this.targetDelta = a, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(a) {
      this.options = {
        ...this.options,
        ...a,
        crossfade: a.crossfade !== void 0 ? a.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== ze.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(a = !1) {
      var y;
      const o = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = o.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = o.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = o.isSharedProjectionDirty);
      const c = !!this.resumingFrom || this !== o;
      if (!(a || c && this.isSharedProjectionDirty || this.isProjectionDirty || (y = this.parent) != null && y.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: d, layoutId: f } = this.options;
      if (!this.layout || !(d || f))
        return;
      this.resolvedRelativeTargetAt = ze.timestamp;
      const m = this.getClosestProjectingParent();
      m && this.linkedParentVersion !== m.layoutVersion && !m.options.layoutRoot && this.removeRelativeTarget(), !this.targetDelta && !this.relativeTarget && (this.options.layoutAnchor !== !1 && m && m.layout ? this.createRelativeTarget(m, this.layout.layoutBox, m.layout.layoutBox) : this.removeRelativeTarget()), !(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = Ue(), this.targetWithTransforms = Ue()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), wm(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0)) : this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, !1, this.target) : it(this.target, this.layout.layoutBox), fc(this.target, this.targetDelta)) : it(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, this.options.layoutAnchor !== !1 && m && !!m.resumingFrom == !!this.resumingFrom && !m.options.layoutScroll && m.target && this.animationProgress !== 1 ? this.createRelativeTarget(m, this.target, m.target) : this.relativeParent = this.relativeTarget = void 0));
    }
    getClosestProjectingParent() {
      if (!(!this.parent || ni(this.parent.latestValues) || dc(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    createRelativeTarget(a, o, c) {
      this.relativeParent = a, this.linkedParentVersion = a.layoutVersion, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Ue(), this.relativeTargetOrigin = Ue(), Dr(this.relativeTargetOrigin, o, c, this.options.layoutAnchor || void 0), it(this.relativeTarget, this.relativeTargetOrigin);
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      var b;
      const a = this.getLead(), o = !!this.resumingFrom || this !== a;
      let c = !0;
      if ((this.isProjectionDirty || (b = this.parent) != null && b.isProjectionDirty) && (c = !1), o && (this.isSharedProjectionDirty || this.isTransformDirty) && (c = !1), this.resolvedRelativeTargetAt === ze.timestamp && (c = !1), c)
        return;
      const { layout: u, layoutId: d } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(u || d))
        return;
      it(this.layoutCorrected, this.layout.layoutBox);
      const f = this.treeScale.x, m = this.treeScale.y;
      qh(this.layoutCorrected, this.treeScale, this.path, o), a.layout && !a.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (a.target = a.layout.layoutBox, a.targetWithTransforms = Ue());
      const { target: y } = a;
      if (!y) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (ho(this.prevProjectionDelta.x, this.projectionDelta.x), ho(this.prevProjectionDelta.y, this.projectionDelta.y)), Dn(this.projectionDelta, this.layoutCorrected, y, this.latestValues), (this.treeScale.x !== f || this.treeScale.y !== m || !So(this.projectionDelta.x, this.prevProjectionDelta.x) || !So(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", y));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(a = !0) {
      var o;
      if ((o = this.options.visualElement) == null || o.scheduleRender(), a) {
        const c = this.getStack();
        c && c.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = an(), this.projectionDelta = an(), this.projectionDeltaWithTransform = an();
    }
    setAnimationOrigin(a, o = !1) {
      const c = this.snapshot, u = c ? c.latestValues : {}, d = { ...this.latestValues }, f = an();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !o;
      const m = Ue(), y = c ? c.source : void 0, b = this.layout ? this.layout.source : void 0, C = y !== b, S = this.getStack(), k = !S || S.members.length <= 1, j = !!(C && !k && this.options.crossfade === !0 && !this.path.some(Xm));
      this.animationProgress = 0;
      let E;
      this.mixTargetDelta = (D) => {
        const M = D / 1e3;
        jo(f.x, a.x, M), jo(f.y, a.y, M), this.setTargetDelta(f), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Dr(m, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0), qm(this.relativeTarget, this.relativeTargetOrigin, m, M), E && km(this.relativeTarget, E) && (this.isProjectionDirty = !1), E || (E = Ue()), it(E, this.relativeTarget)), C && (this.animationValues = d, Rm(d, u, this.latestValues, M, j, k)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = M;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(a) {
      var o, c, u;
      this.notifyListeners("animationStart"), (o = this.currentAnimation) == null || o.stop(), (u = (c = this.resumingFrom) == null ? void 0 : c.currentAnimation) == null || u.stop(), this.pendingAnimation && (Ot(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = Re.update(() => {
        wr.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = fn(0)), this.motionValue.jump(0, !1), this.currentAnimation = jm(this.motionValue, [0, 1e3], {
          ...a,
          velocity: 0,
          isSync: !0,
          onUpdate: (d) => {
            this.mixTargetDelta(d), a.onUpdate && a.onUpdate(d);
          },
          onStop: () => {
          },
          onComplete: () => {
            a.onComplete && a.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const a = this.getStack();
      a && a.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(Vm), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const a = this.getLead();
      let { targetWithTransforms: o, target: c, layout: u, latestValues: d } = a;
      if (!(!o || !c || !u)) {
        if (this !== a && this.layout && u && Pc(this.options.animationType, this.layout.layoutBox, u.layoutBox)) {
          c = this.target || Ue();
          const f = Ge(this.layout.layoutBox.x);
          c.x.min = a.target.x.min, c.x.max = c.x.min + f;
          const m = Ge(this.layout.layoutBox.y);
          c.y.min = a.target.y.min, c.y.max = c.y.min + m;
        }
        it(o, c), xr(o, d), Dn(this.projectionDeltaWithTransform, this.layoutCorrected, o, d);
      }
    }
    registerSharedNode(a, o) {
      this.sharedNodes.has(a) || this.sharedNodes.set(a, new Mm()), this.sharedNodes.get(a).add(o);
      const u = o.options.initialPromotionConfig;
      o.promote({
        transition: u ? u.transition : void 0,
        preserveFollowOpacity: u && u.shouldPreserveFollowOpacity ? u.shouldPreserveFollowOpacity(o) : void 0
      });
    }
    isLead() {
      const a = this.getStack();
      return a ? a.lead === this : !0;
    }
    getLead() {
      var o;
      const { layoutId: a } = this.options;
      return a ? ((o = this.getStack()) == null ? void 0 : o.lead) || this : this;
    }
    getPrevLead() {
      var o;
      const { layoutId: a } = this.options;
      return a ? (o = this.getStack()) == null ? void 0 : o.prevLead : void 0;
    }
    getStack() {
      const { layoutId: a } = this.options;
      if (a)
        return this.root.sharedNodes.get(a);
    }
    promote({ needsReset: a, transition: o, preserveFollowOpacity: c } = {}) {
      const u = this.getStack();
      u && u.promote(this, c), a && (this.projectionDelta = void 0, this.needsReset = !0), o && this.setOptions({ transition: o });
    }
    relegate() {
      const a = this.getStack();
      return a ? a.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: a } = this.options;
      if (!a)
        return;
      let o = !1;
      const { latestValues: c } = a;
      if ((c.z || c.rotate || c.rotateX || c.rotateY || c.rotateZ || c.skewX || c.skewY) && (o = !0), !o)
        return;
      const u = {};
      c.z && ws("z", a, u, this.animationValues);
      for (let d = 0; d < bs.length; d++)
        ws(`rotate${bs[d]}`, a, u, this.animationValues), ws(`skew${bs[d]}`, a, u, this.animationValues);
      a.render();
      for (const d in u)
        a.setStaticValue(d, u[d]), this.animationValues && (this.animationValues[d] = u[d]);
      a.scheduleRender();
    }
    applyProjectionStyles(a, o) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        a.visibility = "hidden";
        return;
      }
      const c = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = !1, a.visibility = "", a.opacity = "", a.pointerEvents = br(o == null ? void 0 : o.pointerEvents) || "", a.transform = c ? c(this.latestValues, "") : "none";
        return;
      }
      const u = this.getLead();
      if (!this.projectionDelta || !this.layout || !u.target) {
        this.options.layoutId && (a.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, a.pointerEvents = br(o == null ? void 0 : o.pointerEvents) || ""), this.hasProjected && !$t(this.latestValues) && (a.transform = c ? c({}, "") : "none", this.hasProjected = !1);
        return;
      }
      a.visibility = "";
      const d = u.animationValues || u.latestValues;
      this.applyTransformsToTarget();
      let f = Cm(this.projectionDeltaWithTransform, this.treeScale, d);
      c && (f = c(d, f)), a.transform = f;
      const { x: m, y } = this.projectionDelta;
      a.transformOrigin = `${m.origin * 100}% ${y.origin * 100}% 0`, u.animationValues ? a.opacity = u === this ? d.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : d.opacityExit : a.opacity = u === this ? d.opacity !== void 0 ? d.opacity : "" : d.opacityExit !== void 0 ? d.opacityExit : 0;
      for (const b in si) {
        if (d[b] === void 0)
          continue;
        const { correct: C, applyTo: S, isCSSVariable: k } = si[b], j = f === "none" ? d[b] : C(d[b], u);
        if (S) {
          const E = S.length;
          for (let D = 0; D < E; D++)
            a[S[D]] = j;
        } else
          k ? this.options.visualElement.renderState.vars[b] = j : a[b] = j;
      }
      this.options.layoutId && (a.pointerEvents = u === this ? br(o == null ? void 0 : o.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((a) => {
        var o;
        return (o = a.currentAnimation) == null ? void 0 : o.stop();
      }), this.root.nodes.forEach(Ro), this.root.sharedNodes.clear();
    }
  };
}
function Lm(t) {
  t.updateLayout();
}
function Fm(t) {
  var n;
  const e = ((n = t.resumeFrom) == null ? void 0 : n.snapshot) || t.snapshot;
  if (t.isLead() && t.layout && e && t.hasListeners("didUpdate")) {
    const { layoutBox: r, measuredBox: s } = t.layout, { animationType: i } = t.options, a = e.source !== t.layout.source;
    if (i === "size")
      ut((f) => {
        const m = a ? e.measuredBox[f] : e.layoutBox[f], y = Ge(m);
        m.min = r[f].min, m.max = m.min + y;
      });
    else if (i === "x" || i === "y") {
      const f = i === "x" ? "y" : "x";
      ii(a ? e.measuredBox[f] : e.layoutBox[f], r[f]);
    } else Pc(i, e.layoutBox, r) && ut((f) => {
      const m = a ? e.measuredBox[f] : e.layoutBox[f], y = Ge(r[f]);
      m.max = m.min + y, t.relativeTarget && !t.currentAnimation && (t.isProjectionDirty = !0, t.relativeTarget[f].max = t.relativeTarget[f].min + y);
    });
    const o = an();
    Dn(o, r, e.layoutBox);
    const c = an();
    a ? Dn(c, t.applyTransform(s, !0), e.measuredBox) : Dn(c, r, e.layoutBox);
    const u = !Sc(o);
    let d = !1;
    if (!t.resumeFrom) {
      const f = t.getClosestProjectingParent();
      if (f && !f.resumeFrom) {
        const { snapshot: m, layout: y } = f;
        if (m && y) {
          const b = t.options.layoutAnchor || void 0, C = Ue();
          Dr(C, e.layoutBox, m.layoutBox, b);
          const S = Ue();
          Dr(S, r, y.layoutBox, b), kc(C, S) || (d = !0), f.options.layoutRoot && (t.relativeTarget = S, t.relativeTargetOrigin = C, t.relativeParent = f);
        }
      }
    }
    t.notifyListeners("didUpdate", {
      layout: r,
      snapshot: e,
      delta: c,
      layoutDelta: o,
      hasLayoutChanged: u,
      hasRelativeLayoutChanged: d
    });
  } else if (t.isLead()) {
    const { onExitComplete: r } = t.options;
    r && r();
  }
  t.options.transition = void 0;
}
function Um(t) {
  t.parent && (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty), t.isSharedProjectionDirty || (t.isSharedProjectionDirty = !!(t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty)), t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty));
}
function Bm(t) {
  t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1;
}
function $m(t) {
  t.clearSnapshot();
}
function Ro(t) {
  t.clearMeasurements();
}
function Wm(t) {
  t.isLayoutDirty = !0, t.updateLayout();
}
function Ao(t) {
  t.isLayoutDirty = !1;
}
function zm(t) {
  t.isAnimationBlocked && t.layout && !t.isLayoutDirty && (t.snapshot = t.layout, t.isLayoutDirty = !0);
}
function Zm(t) {
  const { visualElement: e } = t.options;
  e && e.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"), t.resetTransform();
}
function Po(t) {
  t.finishAnimation(), t.targetDelta = t.relativeTarget = t.target = void 0, t.isProjectionDirty = !0;
}
function Hm(t) {
  t.resolveTargetDelta();
}
function Ym(t) {
  t.calcProjection();
}
function Km(t) {
  t.resetSkewAndRotation();
}
function Gm(t) {
  t.removeLeadSnapshot();
}
function jo(t, e, n) {
  t.translate = Ae(e.translate, 0, n), t.scale = Ae(e.scale, 1, n), t.origin = e.origin, t.originPoint = e.originPoint;
}
function Io(t, e, n, r) {
  t.min = Ae(e.min, n.min, r), t.max = Ae(e.max, n.max, r);
}
function qm(t, e, n, r) {
  Io(t.x, e.x, n.x, r), Io(t.y, e.y, n.y, r);
}
function Xm(t) {
  return t.animationValues && t.animationValues.opacityExit !== void 0;
}
const Jm = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, Oo = (t) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(t), Do = Oo("applewebkit/") && !Oo("chrome/") ? Math.round : nt;
function Mo(t) {
  t.min = Do(t.min), t.max = Do(t.max);
}
function Qm(t) {
  Mo(t.x), Mo(t.y);
}
function Pc(t, e, n) {
  return t === "position" || t === "preserve-aspect" && !bm(To(e), To(n), 0.2);
}
function ep(t) {
  var e;
  return t !== t.root && ((e = t.scroll) == null ? void 0 : e.wasRoot);
}
const tp = Ac({
  attachResizeListener: (t, e) => $n(t, "resize", e),
  measureScroll: () => {
    var t, e;
    return {
      x: document.documentElement.scrollLeft || ((t = document.body) == null ? void 0 : t.scrollLeft) || 0,
      y: document.documentElement.scrollTop || ((e = document.body) == null ? void 0 : e.scrollTop) || 0
    };
  },
  checkIsScrollRoot: () => !0
}), _s = {
  current: void 0
}, jc = Ac({
  measureScroll: (t) => ({
    x: t.scrollLeft,
    y: t.scrollTop
  }),
  defaultParent: () => {
    if (!_s.current) {
      const t = new tp({});
      t.mount(window), t.setOptions({ layoutScroll: !0 }), _s.current = t;
    }
    return _s.current;
  },
  resetTransform: (t, e) => {
    t.style.transform = e !== void 0 ? e : "none";
  },
  checkIsScrollRoot: (t) => window.getComputedStyle(t).position === "fixed"
}), Mi = _.createContext({
  transformPagePoint: (t) => t,
  isStatic: !1,
  reducedMotion: "never"
});
function Vo(t, e) {
  if (typeof t == "function")
    return t(e);
  t != null && (t.current = e);
}
function np(...t) {
  return (e) => {
    let n = !1;
    const r = t.map((s) => {
      const i = Vo(s, e);
      return !n && typeof i == "function" && (n = !0), i;
    });
    if (n)
      return () => {
        for (let s = 0; s < r.length; s++) {
          const i = r[s];
          typeof i == "function" ? i() : Vo(t[s], null);
        }
      };
  };
}
function rp(...t) {
  return _.useCallback(np(...t), t);
}
class sp extends _.Component {
  getSnapshotBeforeUpdate(e) {
    const n = this.props.childRef.current;
    if (pr(n) && e.isPresent && !this.props.isPresent && this.props.pop !== !1) {
      const r = n.offsetParent, s = pr(r) && r.offsetWidth || 0, i = pr(r) && r.offsetHeight || 0, a = getComputedStyle(n), o = this.props.sizeRef.current;
      o.height = parseFloat(a.height), o.width = parseFloat(a.width), o.top = n.offsetTop, o.left = n.offsetLeft, o.right = s - o.width - o.left, o.bottom = i - o.height - o.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function ip({ children: t, isPresent: e, anchorX: n, anchorY: r, root: s, pop: i }) {
  var m;
  const a = _.useId(), o = _.useRef(null), c = _.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }), { nonce: u } = _.useContext(Mi), d = ((m = t.props) == null ? void 0 : m.ref) ?? (t == null ? void 0 : t.ref), f = rp(o, d);
  return _.useInsertionEffect(() => {
    const { width: y, height: b, top: C, left: S, right: k, bottom: j } = c.current;
    if (e || i === !1 || !o.current || !y || !b)
      return;
    const E = n === "left" ? `left: ${S}` : `right: ${k}`, D = r === "bottom" ? `bottom: ${j}` : `top: ${C}`;
    o.current.dataset.motionPopId = a;
    const M = document.createElement("style");
    u && (M.nonce = u);
    const B = s ?? document.head;
    return B.appendChild(M), M.sheet && M.sheet.insertRule(`
          [data-motion-pop-id="${a}"] {
            position: absolute !important;
            width: ${y}px !important;
            height: ${b}px !important;
            ${E}px !important;
            ${D}px !important;
          }
        `), () => {
      var Q;
      (Q = o.current) == null || Q.removeAttribute("data-motion-pop-id"), B.contains(M) && B.removeChild(M);
    };
  }, [e]), v.jsx(sp, { isPresent: e, childRef: o, sizeRef: c, pop: i, children: i === !1 ? t : _.cloneElement(t, { ref: f }) });
}
const ap = ({ children: t, initial: e, isPresent: n, onExitComplete: r, custom: s, presenceAffectsLayout: i, mode: a, anchorX: o, anchorY: c, root: u }) => {
  const d = ui(op), f = _.useId();
  let m = !0, y = _.useMemo(() => (m = !1, {
    id: f,
    initial: e,
    isPresent: n,
    custom: s,
    onExitComplete: (b) => {
      d.set(b, !0);
      for (const C of d.values())
        if (!C)
          return;
      r && r();
    },
    register: (b) => (d.set(b, !1), () => d.delete(b))
  }), [n, d, r]);
  return i && m && (y = { ...y }), _.useMemo(() => {
    d.forEach((b, C) => d.set(C, !1));
  }, [n]), _.useEffect(() => {
    !n && !d.size && r && r();
  }, [n]), t = v.jsx(ip, { pop: a === "popLayout", isPresent: n, anchorX: o, anchorY: c, root: u, children: t }), v.jsx(Vr.Provider, { value: y, children: t });
};
function op() {
  return /* @__PURE__ */ new Map();
}
function Ic(t = !0) {
  const e = _.useContext(Vr);
  if (e === null)
    return [!0, null];
  const { isPresent: n, onExitComplete: r, register: s } = e, i = _.useId();
  _.useEffect(() => {
    if (t)
      return s(i);
  }, [t]);
  const a = _.useCallback(() => t && r && r(i), [i, r, t]);
  return !n && r ? [!1, a] : [!0];
}
const ur = (t) => t.key || "";
function No(t) {
  const e = [];
  return _.Children.forEach(t, (n) => {
    _.isValidElement(n) && e.push(n);
  }), e;
}
var lp = {};
const Lo = ({ children: t, custom: e, initial: n = !0, onExitComplete: r, presenceAffectsLayout: s = !0, mode: i = "sync", propagate: a = !1, anchorX: o = "left", anchorY: c = "top", root: u }) => {
  const [d, f] = Ic(a), m = _.useMemo(() => No(t), [t]), y = a && !d ? [] : m.map(ur), b = _.useRef(!0), C = _.useRef(m), S = ui(() => /* @__PURE__ */ new Map()), k = _.useRef(/* @__PURE__ */ new Set()), [j, E] = _.useState(m), [D, M] = _.useState(m);
  il(() => {
    b.current = !1, C.current = m;
    for (let V = 0; V < D.length; V++) {
      const G = ur(D[V]);
      y.includes(G) ? (S.delete(G), k.current.delete(G)) : S.get(G) !== !0 && S.set(G, !1);
    }
  }, [D, y.length, y.join("-")]);
  const B = [];
  if (m !== j) {
    let V = [...m];
    for (let G = 0; G < D.length; G++) {
      const F = D[G], ie = ur(F);
      y.includes(ie) || (V.splice(G, 0, F), B.push(F));
    }
    return i === "wait" && B.length && (V = B), M(No(V)), E(m), null;
  }
  lp.NODE_ENV !== "production" && i === "wait" && D.length > 1 && console.warn(`You're attempting to animate multiple children within AnimatePresence, but its mode is set to "wait". This will lead to odd visual behaviour.`);
  const { forceRender: Q } = _.useContext(ci);
  return v.jsx(v.Fragment, { children: D.map((V) => {
    const G = ur(V), F = a && !d ? !1 : m === D || y.includes(G), ie = () => {
      if (k.current.has(G))
        return;
      if (S.has(G))
        k.current.add(G), S.set(G, !0);
      else
        return;
      let xe = !0;
      S.forEach((Se) => {
        Se || (xe = !1);
      }), xe && (Q == null || Q(), M(C.current), a && (f == null || f()), r && r());
    };
    return v.jsx(ap, { isPresent: F, initial: !b.current || n ? void 0 : !1, custom: e, presenceAffectsLayout: s, mode: i, root: u, onExitComplete: F ? void 0 : ie, anchorX: o, anchorY: c, children: V }, G);
  }) });
}, Oc = _.createContext({ strict: !1 }), Fo = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
};
let Uo = !1;
function cp() {
  if (Uo)
    return;
  const t = {};
  for (const e in Fo)
    t[e] = {
      isEnabled: (n) => Fo[e].some((r) => !!n[r])
    };
  lc(t), Uo = !0;
}
function Dc() {
  return cp(), Hh();
}
function up(t) {
  const e = Dc();
  for (const n in t)
    e[n] = {
      ...e[n],
      ...t[n]
    };
  lc(e);
}
const dp = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "propagate",
  "ignoreStrict",
  "viewport"
]);
function Mr(t) {
  return t.startsWith("while") || t.startsWith("drag") && t !== "draggable" || t.startsWith("layout") || t.startsWith("onTap") || t.startsWith("onPan") || t.startsWith("onLayout") || dp.has(t);
}
let Mc = (t) => !Mr(t);
function fp(t) {
  typeof t == "function" && (Mc = (e) => e.startsWith("on") ? !Mr(e) : t(e));
}
try {
  fp(require("@emotion/is-prop-valid").default);
} catch {
}
function hp(t, e, n) {
  const r = {};
  for (const s in t)
    s === "values" && typeof t.values == "object" || Ze(t[s]) || (Mc(s) || n === !0 && Mr(s) || !e && !Mr(s) || // If trying to use native HTML drag events, forward drag listeners
    t.draggable && s.startsWith("onDrag")) && (r[s] = t[s]);
  return r;
}
const Ur = /* @__PURE__ */ _.createContext({});
function mp(t, e) {
  if (Fr(t)) {
    const { initial: n, animate: r } = t;
    return {
      initial: n === !1 || Bn(n) ? n : void 0,
      animate: Bn(r) ? r : void 0
    };
  }
  return t.inherit !== !1 ? e : {};
}
function pp(t) {
  const { initial: e, animate: n } = mp(t, _.useContext(Ur));
  return _.useMemo(() => ({ initial: e, animate: n }), [Bo(e), Bo(n)]);
}
function Bo(t) {
  return Array.isArray(t) ? t.join(" ") : t;
}
const Vi = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function Vc(t, e, n) {
  for (const r in e)
    !Ze(e[r]) && !pc(r, n) && (t[r] = e[r]);
}
function gp({ transformTemplate: t }, e) {
  return _.useMemo(() => {
    const n = Vi();
    return Oi(n, e, t), Object.assign({}, n.vars, n.style);
  }, [e]);
}
function yp(t, e) {
  const n = t.style || {}, r = {};
  return Vc(r, n, t), Object.assign(r, gp(t, e)), r;
}
function vp(t, e) {
  const n = {}, r = yp(t, e);
  return t.drag && t.dragListener !== !1 && (n.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = t.drag === !0 ? "none" : `pan-${t.drag === "x" ? "y" : "x"}`), t.tabIndex === void 0 && (t.onTap || t.onTapStart || t.whileTap) && (n.tabIndex = 0), n.style = r, n;
}
const Nc = () => ({
  ...Vi(),
  attrs: {}
});
function xp(t, e, n, r) {
  const s = _.useMemo(() => {
    const i = Nc();
    return gc(i, e, vc(r), t.transformTemplate, t.style), {
      ...i.attrs,
      style: { ...i.style }
    };
  }, [e]);
  if (t.style) {
    const i = {};
    Vc(i, t.style, t), s.style = { ...i, ...s.style };
  }
  return s;
}
const bp = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function Ni(t) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof t != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    t.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(bp.indexOf(t) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(t))
    )
  );
}
function wp(t, e, n, { latestValues: r }, s, i = !1, a) {
  const c = (a ?? Ni(t) ? xp : vp)(e, r, s, t), u = hp(e, typeof t == "string", i), d = t !== _.Fragment ? { ...u, ...c, ref: n } : {}, { children: f } = e, m = _.useMemo(() => Ze(f) ? f.get() : f, [f]);
  return _.createElement(t, {
    ...d,
    children: m
  });
}
function _p({ scrapeMotionValuesFromProps: t, createRenderState: e }, n, r, s) {
  return {
    latestValues: Tp(n, r, s, t),
    renderState: e()
  };
}
function Tp(t, e, n, r) {
  const s = {}, i = r(t, {});
  for (const m in i)
    s[m] = br(i[m]);
  let { initial: a, animate: o } = t;
  const c = Fr(t), u = ac(t);
  e && u && !c && t.inherit !== !1 && (a === void 0 && (a = e.initial), o === void 0 && (o = e.animate));
  let d = n ? n.initial === !1 : !1;
  d = d || a === !1;
  const f = d ? o : a;
  if (f && typeof f != "boolean" && !Lr(f)) {
    const m = Array.isArray(f) ? f : [f];
    for (let y = 0; y < m.length; y++) {
      const b = ki(t, m[y]);
      if (b) {
        const { transitionEnd: C, transition: S, ...k } = b;
        for (const j in k) {
          let E = k[j];
          if (Array.isArray(E)) {
            const D = d ? E.length - 1 : 0;
            E = E[D];
          }
          E !== null && (s[j] = E);
        }
        for (const j in C)
          s[j] = C[j];
      }
    }
  }
  return s;
}
const Lc = (t) => (e, n) => {
  const r = _.useContext(Ur), s = _.useContext(Vr), i = () => _p(t, e, r, s);
  return n ? i() : ui(i);
}, Sp = /* @__PURE__ */ Lc({
  scrapeMotionValuesFromProps: Di,
  createRenderState: Vi
}), kp = /* @__PURE__ */ Lc({
  scrapeMotionValuesFromProps: xc,
  createRenderState: Nc
}), Cp = Symbol.for("motionComponentSymbol");
function Ep(t, e, n) {
  const r = _.useRef(n);
  _.useInsertionEffect(() => {
    r.current = n;
  });
  const s = _.useRef(null);
  return _.useCallback((i) => {
    var o;
    i && ((o = t.onMount) == null || o.call(t, i));
    const a = r.current;
    if (typeof a == "function")
      if (i) {
        const c = a(i);
        typeof c == "function" && (s.current = c);
      } else s.current ? (s.current(), s.current = null) : a(i);
    else a && (a.current = i);
    e && (i ? e.mount(i) : e.unmount());
  }, [e]);
}
const Fc = _.createContext({});
function tn(t) {
  return t && typeof t == "object" && Object.prototype.hasOwnProperty.call(t, "current");
}
function Rp(t, e, n, r, s, i) {
  var E, D;
  const { visualElement: a } = _.useContext(Ur), o = _.useContext(Oc), c = _.useContext(Vr), u = _.useContext(Mi), d = u.reducedMotion, f = u.skipAnimations, m = _.useRef(null), y = _.useRef(!1);
  r = r || o.renderer, !m.current && r && (m.current = r(t, {
    visualState: e,
    parent: a,
    props: n,
    presenceContext: c,
    blockInitialAnimation: c ? c.initial === !1 : !1,
    reducedMotionConfig: d,
    skipAnimations: f,
    isSVG: i
  }), y.current && m.current && (m.current.manuallyAnimateOnMount = !0));
  const b = m.current, C = _.useContext(Fc);
  b && !b.projection && s && (b.type === "html" || b.type === "svg") && Ap(m.current, n, s, C);
  const S = _.useRef(!1);
  _.useInsertionEffect(() => {
    b && S.current && b.update(n, c);
  });
  const k = n[Yl], j = _.useRef(!!k && typeof window < "u" && !((E = window.MotionHandoffIsComplete) != null && E.call(window, k)) && ((D = window.MotionHasOptimisedAnimation) == null ? void 0 : D.call(window, k)));
  return il(() => {
    y.current = !0, b && (S.current = !0, window.MotionIsMounted = !0, b.updateFeatures(), b.scheduleRenderMicrotask(), j.current && b.animationState && b.animationState.animateChanges());
  }), _.useEffect(() => {
    b && (!j.current && b.animationState && b.animationState.animateChanges(), j.current && (queueMicrotask(() => {
      var M;
      (M = window.MotionHandoffMarkAsComplete) == null || M.call(window, k);
    }), j.current = !1), b.enteringChildren = void 0);
  }), b;
}
function Ap(t, e, n, r) {
  const { layoutId: s, layout: i, drag: a, dragConstraints: o, layoutScroll: c, layoutRoot: u, layoutAnchor: d, layoutCrossfade: f } = e;
  t.projection = new n(t.latestValues, e["data-framer-portal-id"] ? void 0 : Uc(t.parent)), t.projection.setOptions({
    layoutId: s,
    layout: i,
    alwaysMeasureLayout: !!a || o && tn(o),
    visualElement: t,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof i == "string" ? i : "both",
    initialPromotionConfig: r,
    crossfade: f,
    layoutScroll: c,
    layoutRoot: u,
    layoutAnchor: d
  });
}
function Uc(t) {
  if (t)
    return t.options.allowProjection !== !1 ? t.projection : Uc(t.parent);
}
var Pp = {};
function Ts(t, { forwardMotionProps: e = !1, type: n } = {}, r, s) {
  r && up(r);
  const i = n ? n === "svg" : Ni(t), a = i ? kp : Sp;
  function o(u, d) {
    let f;
    const m = {
      ..._.useContext(Mi),
      ...u,
      layoutId: jp(u)
    }, { isStatic: y } = m, b = pp(u), C = a(u, y);
    if (!y && typeof window < "u") {
      Ip(m, r);
      const S = Op(m);
      f = S.MeasureLayout, b.visualElement = Rp(t, C, m, s, S.ProjectionNode, i);
    }
    return v.jsxs(Ur.Provider, { value: b, children: [f && b.visualElement ? v.jsx(f, { visualElement: b.visualElement, ...m }) : null, wp(t, u, Ep(C, b.visualElement, d), C, y, e, i)] });
  }
  o.displayName = `motion.${typeof t == "string" ? t : `create(${t.displayName ?? t.name ?? ""})`}`;
  const c = _.forwardRef(o);
  return c[Cp] = t, c;
}
function jp({ layoutId: t }) {
  const e = _.useContext(ci).id;
  return e && t !== void 0 ? e + "-" + t : t;
}
function Ip(t, e) {
  const n = _.useContext(Oc).strict;
  if (Pp.NODE_ENV !== "production" && e && n) {
    const r = "You have rendered a `motion` component within a `LazyMotion` component. This will break tree shaking. Import and render a `m` component instead.";
    t.ignoreStrict ? hn(!1, r, "lazy-strict-mode") : vt(!1, r, "lazy-strict-mode");
  }
}
function Op(t) {
  const e = Dc(), { drag: n, layout: r } = e;
  if (!n && !r)
    return {};
  const s = { ...n, ...r };
  return {
    MeasureLayout: n != null && n.isEnabled(t) || r != null && r.isEnabled(t) ? s.MeasureLayout : void 0,
    ProjectionNode: s.ProjectionNode
  };
}
var Dp = {};
function Mp(t, e) {
  if (typeof Proxy > "u")
    return Ts;
  const n = /* @__PURE__ */ new Map(), r = (i, a) => Ts(i, a, t, e), s = (i, a) => (Dp.NODE_ENV !== "production" && hi(!1, "motion() is deprecated. Use motion.create() instead."), r(i, a));
  return new Proxy(s, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (i, a) => a === "create" ? r : (n.has(a) || n.set(a, Ts(a, void 0, t, e)), n.get(a))
  });
}
const Vp = (t, e) => e.isSVG ?? Ni(t) ? new cm(e) : new rm(e, {
  allowProjection: t !== _.Fragment
});
class Np extends Dt {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(e) {
    super(e), e.animationState || (e.animationState = mm(e));
  }
  updateAnimationControlsSubscription() {
    const { animate: e } = this.node.getProps();
    Lr(e) && (this.unmountControls = e.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: e } = this.node.getProps(), { animate: n } = this.node.prevProps || {};
    e !== n && this.updateAnimationControlsSubscription();
  }
  unmount() {
    var e;
    this.node.animationState.reset(), (e = this.unmountControls) == null || e.call(this);
  }
}
let Lp = 0;
class Fp extends Dt {
  constructor() {
    super(...arguments), this.id = Lp++, this.isExitComplete = !1;
  }
  update() {
    var i;
    if (!this.node.presenceContext)
      return;
    const { isPresent: e, onExitComplete: n } = this.node.presenceContext, { isPresent: r } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || e === r)
      return;
    if (e && r === !1) {
      if (this.isExitComplete) {
        const { initial: a, custom: o } = this.node.getProps();
        if (typeof a == "string") {
          const c = Ht(this.node, a, o);
          if (c) {
            const { transition: u, transitionEnd: d, ...f } = c;
            for (const m in f)
              (i = this.node.getValue(m)) == null || i.jump(f[m]);
          }
        }
        this.node.animationState.reset(), this.node.animationState.animateChanges();
      } else
        this.node.animationState.setActive("exit", !1);
      this.isExitComplete = !1;
      return;
    }
    const s = this.node.animationState.setActive("exit", !e);
    n && !e && s.then(() => {
      this.isExitComplete = !0, n(this.id);
    });
  }
  mount() {
    const { register: e, onExitComplete: n } = this.node.presenceContext || {};
    n && n(this.id), e && (this.unmount = e(this.id));
  }
  unmount() {
  }
}
const Up = {
  animation: {
    Feature: Np
  },
  exit: {
    Feature: Fp
  }
};
function Yn(t) {
  return {
    point: {
      x: t.pageX,
      y: t.pageY
    }
  };
}
const Bp = (t) => (e) => Ai(e) && t(e, Yn(e));
function Mn(t, e, n, r) {
  return $n(t, e, Bp(n), r);
}
const Bc = ({ current: t }) => t ? t.ownerDocument.defaultView : null, $o = (t, e) => Math.abs(t - e);
function $p(t, e) {
  const n = $o(t.x, e.x), r = $o(t.y, e.y);
  return Math.sqrt(n ** 2 + r ** 2);
}
const Wo = /* @__PURE__ */ new Set(["auto", "scroll"]);
class $c {
  constructor(e, n, { transformPagePoint: r, contextWindow: s = window, dragSnapToOrigin: i = !1, distanceThreshold: a = 3, element: o } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.removeScrollListeners = null, this.onElementScroll = (y) => {
      this.handleScroll(y.target);
    }, this.onWindowScroll = () => {
      this.handleScroll(window);
    }, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      this.lastRawMoveEventInfo && (this.lastMoveEventInfo = dr(this.lastRawMoveEventInfo, this.transformPagePoint));
      const y = Ss(this.lastMoveEventInfo, this.history), b = this.startEvent !== null, C = $p(y.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!b && !C)
        return;
      const { point: S } = y, { timestamp: k } = ze;
      this.history.push({ ...S, timestamp: k });
      const { onStart: j, onMove: E } = this.handlers;
      b || (j && j(this.lastMoveEvent, y), this.startEvent = this.lastMoveEvent), E && E(this.lastMoveEvent, y);
    }, this.handlePointerMove = (y, b) => {
      this.lastMoveEvent = y, this.lastRawMoveEventInfo = b, this.lastMoveEventInfo = dr(b, this.transformPagePoint), Re.update(this.updatePoint, !0);
    }, this.handlePointerUp = (y, b) => {
      this.end();
      const { onEnd: C, onSessionEnd: S, resumeAnimation: k } = this.handlers;
      if ((this.dragSnapToOrigin || !this.startEvent) && k && k(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const j = Ss(y.type === "pointercancel" ? this.lastMoveEventInfo : dr(b, this.transformPagePoint), this.history);
      this.startEvent && C && C(y, j), S && S(y, j);
    }, !Ai(e))
      return;
    this.dragSnapToOrigin = i, this.handlers = n, this.transformPagePoint = r, this.distanceThreshold = a, this.contextWindow = s || window;
    const c = Yn(e), u = dr(c, this.transformPagePoint), { point: d } = u, { timestamp: f } = ze;
    this.history = [{ ...d, timestamp: f }];
    const { onSessionStart: m } = n;
    m && m(e, Ss(u, this.history)), this.removeListeners = zn(Mn(this.contextWindow, "pointermove", this.handlePointerMove), Mn(this.contextWindow, "pointerup", this.handlePointerUp), Mn(this.contextWindow, "pointercancel", this.handlePointerUp)), o && this.startScrollTracking(o);
  }
  /**
   * Start tracking scroll on ancestors and window.
   */
  startScrollTracking(e) {
    let n = e.parentElement;
    for (; n; ) {
      const r = getComputedStyle(n);
      (Wo.has(r.overflowX) || Wo.has(r.overflowY)) && this.scrollPositions.set(n, {
        x: n.scrollLeft,
        y: n.scrollTop
      }), n = n.parentElement;
    }
    this.scrollPositions.set(window, {
      x: window.scrollX,
      y: window.scrollY
    }), window.addEventListener("scroll", this.onElementScroll, {
      capture: !0
    }), window.addEventListener("scroll", this.onWindowScroll), this.removeScrollListeners = () => {
      window.removeEventListener("scroll", this.onElementScroll, {
        capture: !0
      }), window.removeEventListener("scroll", this.onWindowScroll);
    };
  }
  /**
   * Handle scroll compensation during drag.
   *
   * For element scroll: adjusts history origin since pageX/pageY doesn't change.
   * For window scroll: adjusts lastMoveEventInfo since pageX/pageY would change.
   */
  handleScroll(e) {
    const n = this.scrollPositions.get(e);
    if (!n)
      return;
    const r = e === window, s = r ? { x: window.scrollX, y: window.scrollY } : {
      x: e.scrollLeft,
      y: e.scrollTop
    }, i = { x: s.x - n.x, y: s.y - n.y };
    i.x === 0 && i.y === 0 || (r ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += i.x, this.lastMoveEventInfo.point.y += i.y) : this.history.length > 0 && (this.history[0].x -= i.x, this.history[0].y -= i.y), this.scrollPositions.set(e, s), Re.update(this.updatePoint, !0));
  }
  updateHandlers(e) {
    this.handlers = e;
  }
  end() {
    this.removeListeners && this.removeListeners(), this.removeScrollListeners && this.removeScrollListeners(), this.scrollPositions.clear(), Ot(this.updatePoint);
  }
}
function dr(t, e) {
  return e ? { point: e(t.point) } : t;
}
function zo(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function Ss({ point: t }, e) {
  return {
    point: t,
    delta: zo(t, Wc(e)),
    offset: zo(t, Wp(e)),
    velocity: zp(e, 0.1)
  };
}
function Wp(t) {
  return t[0];
}
function Wc(t) {
  return t[t.length - 1];
}
function zp(t, e) {
  if (t.length < 2)
    return { x: 0, y: 0 };
  let n = t.length - 1, r = null;
  const s = Wc(t);
  for (; n >= 0 && (r = t[n], !(s.timestamp - r.timestamp > /* @__PURE__ */ Je(e))); )
    n--;
  if (!r)
    return { x: 0, y: 0 };
  r === t[0] && t.length > 2 && s.timestamp - r.timestamp > /* @__PURE__ */ Je(e) * 2 && (r = t[1]);
  const i = /* @__PURE__ */ tt(s.timestamp - r.timestamp);
  if (i === 0)
    return { x: 0, y: 0 };
  const a = {
    x: (s.x - r.x) / i,
    y: (s.y - r.y) / i
  };
  return a.x === 1 / 0 && (a.x = 0), a.y === 1 / 0 && (a.y = 0), a;
}
function Zp(t, { min: e, max: n }, r) {
  return e !== void 0 && t < e ? t = r ? Ae(e, t, r.min) : Math.max(t, e) : n !== void 0 && t > n && (t = r ? Ae(n, t, r.max) : Math.min(t, n)), t;
}
function Zo(t, e, n) {
  return {
    min: e !== void 0 ? t.min + e : void 0,
    max: n !== void 0 ? t.max + n - (t.max - t.min) : void 0
  };
}
function Hp(t, { top: e, left: n, bottom: r, right: s }) {
  return {
    x: Zo(t.x, n, s),
    y: Zo(t.y, e, r)
  };
}
function Ho(t, e) {
  let n = e.min - t.min, r = e.max - t.max;
  return e.max - e.min < t.max - t.min && ([n, r] = [r, n]), { min: n, max: r };
}
function Yp(t, e) {
  return {
    x: Ho(t.x, e.x),
    y: Ho(t.y, e.y)
  };
}
function Kp(t, e) {
  let n = 0.5;
  const r = Ge(t), s = Ge(e);
  return s > r ? n = /* @__PURE__ */ Fn(e.min, e.max - r, t.min) : r > s && (n = /* @__PURE__ */ Fn(t.min, t.max - s, e.min)), mt(0, 1, n);
}
function Gp(t, e) {
  const n = {};
  return e.min !== void 0 && (n.min = e.min - t.min), e.max !== void 0 && (n.max = e.max - t.min), n;
}
const ai = 0.35;
function qp(t = ai) {
  return t === !1 ? t = 0 : t === !0 && (t = ai), {
    x: Yo(t, "left", "right"),
    y: Yo(t, "top", "bottom")
  };
}
function Yo(t, e, n) {
  return {
    min: Ko(t, e),
    max: Ko(t, n)
  };
}
function Ko(t, e) {
  return typeof t == "number" ? t : t[e] || 0;
}
const Xp = /* @__PURE__ */ new WeakMap();
class Jp {
  constructor(e) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = Ue(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e;
  }
  start(e, { snapToCursor: n = !1, distanceThreshold: r } = {}) {
    const { presenceContext: s } = this.visualElement;
    if (s && s.isPresent === !1)
      return;
    const i = (f) => {
      n && this.snapToCursor(Yn(f).point), this.stopAnimation();
    }, a = (f, m) => {
      const { drag: y, dragPropagation: b, onDragStart: C } = this.getProps();
      if (y && !b && (this.openDragLock && this.openDragLock(), this.openDragLock = wh(y), !this.openDragLock))
        return;
      this.latestPointerEvent = f, this.latestPanInfo = m, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), ut((k) => {
        let j = this.getAxisMotionValue(k).get() || 0;
        if (ht.test(j)) {
          const { projection: E } = this.visualElement;
          if (E && E.layout) {
            const D = E.layout.layoutBox[k];
            D && (j = Ge(D) * (parseFloat(j) / 100));
          }
        }
        this.originPoint[k] = j;
      }), C && Re.update(() => C(f, m), !1, !0), Xs(this.visualElement, "transform");
      const { animationState: S } = this.visualElement;
      S && S.setActive("whileDrag", !0);
    }, o = (f, m) => {
      this.latestPointerEvent = f, this.latestPanInfo = m;
      const { dragPropagation: y, dragDirectionLock: b, onDirectionLock: C, onDrag: S } = this.getProps();
      if (!y && !this.openDragLock)
        return;
      const { offset: k } = m;
      if (b && this.currentDirection === null) {
        this.currentDirection = eg(k), this.currentDirection !== null && C && C(this.currentDirection);
        return;
      }
      this.updateAxis("x", m.point, k), this.updateAxis("y", m.point, k), this.visualElement.render(), S && Re.update(() => S(f, m), !1, !0);
    }, c = (f, m) => {
      this.latestPointerEvent = f, this.latestPanInfo = m, this.stop(f, m), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, u = () => {
      const { dragSnapToOrigin: f } = this.getProps();
      (f || this.constraints) && this.startAnimation({ x: 0, y: 0 });
    }, { dragSnapToOrigin: d } = this.getProps();
    this.panSession = new $c(e, {
      onSessionStart: i,
      onStart: a,
      onMove: o,
      onSessionEnd: c,
      resumeAnimation: u
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: d,
      distanceThreshold: r,
      contextWindow: Bc(this.visualElement),
      element: this.visualElement.current
    });
  }
  /**
   * @internal
   */
  stop(e, n) {
    const r = e || this.latestPointerEvent, s = n || this.latestPanInfo, i = this.isDragging;
    if (this.cancel(), !i || !s || !r)
      return;
    const { velocity: a } = s;
    this.startAnimation(a);
    const { onDragEnd: o } = this.getProps();
    o && Re.postRender(() => o(r, s));
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = !1;
    const { projection: e, animationState: n } = this.visualElement;
    e && (e.isAnimationBlocked = !1), this.endPanSession();
    const { dragPropagation: r } = this.getProps();
    !r && this.openDragLock && (this.openDragLock(), this.openDragLock = null), n && n.setActive("whileDrag", !1);
  }
  /**
   * Clean up the pan session without modifying other drag state.
   * This is used during unmount to ensure event listeners are removed
   * without affecting projection animations or drag locks.
   * @internal
   */
  endPanSession() {
    this.panSession && this.panSession.end(), this.panSession = void 0;
  }
  updateAxis(e, n, r) {
    const { drag: s } = this.getProps();
    if (!r || !fr(e, s, this.currentDirection))
      return;
    const i = this.getAxisMotionValue(e);
    let a = this.originPoint[e] + r[e];
    this.constraints && this.constraints[e] && (a = Zp(a, this.constraints[e], this.elastic[e])), i.set(a);
  }
  resolveConstraints() {
    var i;
    const { dragConstraints: e, dragElastic: n } = this.getProps(), r = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (i = this.visualElement.projection) == null ? void 0 : i.layout, s = this.constraints;
    e && tn(e) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : e && r ? this.constraints = Hp(r.layoutBox, e) : this.constraints = !1, this.elastic = qp(n), s !== this.constraints && !tn(e) && r && this.constraints && !this.hasMutatedConstraints && ut((a) => {
      this.constraints !== !1 && this.getAxisMotionValue(a) && (this.constraints[a] = Gp(r.layoutBox[a], this.constraints[a]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: e, onMeasureDragConstraints: n } = this.getProps();
    if (!e || !tn(e))
      return !1;
    const r = e.current;
    vt(r !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.", "drag-constraints-ref");
    const { projection: s } = this.visualElement;
    if (!s || !s.layout)
      return !1;
    const i = Xh(r, s.root, this.visualElement.getTransformPagePoint());
    let a = Yp(s.layout.layoutBox, i);
    if (n) {
      const o = n(Kh(a));
      this.hasMutatedConstraints = !!o, o && (a = uc(o));
    }
    return a;
  }
  startAnimation(e) {
    const { drag: n, dragMomentum: r, dragElastic: s, dragTransition: i, dragSnapToOrigin: a, onDragTransitionEnd: o } = this.getProps(), c = this.constraints || {}, u = ut((d) => {
      if (!fr(d, n, this.currentDirection))
        return;
      let f = c && c[d] || {};
      (a === !0 || a === d) && (f = { min: 0, max: 0 });
      const m = s ? 200 : 1e6, y = s ? 40 : 1e7, b = {
        type: "inertia",
        velocity: r ? e[d] : 0,
        bounceStiffness: m,
        bounceDamping: y,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...i,
        ...f
      };
      return this.startAxisValueAnimation(d, b);
    });
    return Promise.all(u).then(o);
  }
  startAxisValueAnimation(e, n) {
    const r = this.getAxisMotionValue(e);
    return Xs(this.visualElement, e), r.start(Si(e, r, 0, n, this.visualElement, !1));
  }
  stopAnimation() {
    ut((e) => this.getAxisMotionValue(e).stop());
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(e) {
    const n = `_drag${e.toUpperCase()}`, r = this.visualElement.getProps(), s = r[n];
    return s || this.visualElement.getValue(e, (r.initial ? r.initial[e] : void 0) || 0);
  }
  snapToCursor(e) {
    ut((n) => {
      const { drag: r } = this.getProps();
      if (!fr(n, r, this.currentDirection))
        return;
      const { projection: s } = this.visualElement, i = this.getAxisMotionValue(n);
      if (s && s.layout) {
        const { min: a, max: o } = s.layout.layoutBox[n], c = i.get() || 0;
        i.set(e[n] - Ae(a, o, 0.5) + c);
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: e, dragConstraints: n } = this.getProps(), { projection: r } = this.visualElement;
    if (!tn(n) || !r || !this.constraints)
      return;
    this.stopAnimation();
    const s = { x: 0, y: 0 };
    ut((a) => {
      const o = this.getAxisMotionValue(a);
      if (o && this.constraints !== !1) {
        const c = o.get();
        s[a] = Kp({ min: c, max: c }, this.constraints[a]);
      }
    });
    const { transformTemplate: i } = this.visualElement.getProps();
    this.visualElement.current.style.transform = i ? i({}, "") : "none", r.root && r.root.updateScroll(), r.updateLayout(), this.constraints = !1, this.resolveConstraints(), ut((a) => {
      if (!fr(a, e, null))
        return;
      const o = this.getAxisMotionValue(a), { min: c, max: u } = this.constraints[a];
      o.set(Ae(c, u, s[a]));
    }), this.visualElement.render();
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    Xp.set(this.visualElement, this);
    const e = this.visualElement.current, n = Mn(e, "pointerdown", (u) => {
      const { drag: d, dragListener: f = !0 } = this.getProps(), m = u.target, y = m !== e && Eh(m);
      d && f && !y && this.start(u);
    });
    let r;
    const s = () => {
      const { dragConstraints: u } = this.getProps();
      tn(u) && u.current && (this.constraints = this.resolveRefConstraints(), r || (r = Qp(e, u.current, () => this.scalePositionWithinConstraints())));
    }, { projection: i } = this.visualElement, a = i.addEventListener("measure", s);
    i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), Re.read(s);
    const o = $n(window, "resize", () => this.scalePositionWithinConstraints()), c = i.addEventListener("didUpdate", ({ delta: u, hasLayoutChanged: d }) => {
      this.isDragging && d && (ut((f) => {
        const m = this.getAxisMotionValue(f);
        m && (this.originPoint[f] += u[f].translate, m.set(m.get() + u[f].translate));
      }), this.visualElement.render());
    });
    return () => {
      o(), n(), a(), c && c(), r && r();
    };
  }
  getProps() {
    const e = this.visualElement.getProps(), { drag: n = !1, dragDirectionLock: r = !1, dragPropagation: s = !1, dragConstraints: i = !1, dragElastic: a = ai, dragMomentum: o = !0 } = e;
    return {
      ...e,
      drag: n,
      dragDirectionLock: r,
      dragPropagation: s,
      dragConstraints: i,
      dragElastic: a,
      dragMomentum: o
    };
  }
}
function Go(t) {
  let e = !0;
  return () => {
    if (e) {
      e = !1;
      return;
    }
    t();
  };
}
function Qp(t, e, n) {
  const r = eo(t, Go(n)), s = eo(e, Go(n));
  return () => {
    r(), s();
  };
}
function fr(t, e, n) {
  return (e === !0 || e === t) && (n === null || n === t);
}
function eg(t, e = 10) {
  let n = null;
  return Math.abs(t.y) > e ? n = "y" : Math.abs(t.x) > e && (n = "x"), n;
}
class tg extends Dt {
  constructor(e) {
    super(e), this.removeGroupControls = nt, this.removeListeners = nt, this.controls = new Jp(e);
  }
  mount() {
    const { dragControls: e } = this.node.getProps();
    e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || nt;
  }
  update() {
    const { dragControls: e } = this.node.getProps(), { dragControls: n } = this.node.prevProps || {};
    e !== n && (this.removeGroupControls(), e && (this.removeGroupControls = e.subscribe(this.controls)));
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners(), this.controls.isDragging || this.controls.endPanSession();
  }
}
const ks = (t) => (e, n) => {
  t && Re.update(() => t(e, n), !1, !0);
};
class ng extends Dt {
  constructor() {
    super(...arguments), this.removePointerDownListener = nt;
  }
  onPointerDown(e) {
    this.session = new $c(e, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: Bc(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: e, onPanStart: n, onPan: r, onPanEnd: s } = this.node.getProps();
    return {
      onSessionStart: ks(e),
      onStart: ks(n),
      onMove: ks(r),
      onEnd: (i, a) => {
        delete this.session, s && Re.postRender(() => s(i, a));
      }
    };
  }
  mount() {
    this.removePointerDownListener = Mn(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
let Cs = !1;
class rg extends _.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: r, layoutId: s } = this.props, { projection: i } = e;
    i && (n.group && n.group.add(i), r && r.register && s && r.register(i), Cs && i.root.didUpdate(), i.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), i.setOptions({
      ...i.options,
      layoutDependency: this.props.layoutDependency,
      onExitComplete: () => this.safeToRemove()
    })), wr.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(e) {
    const { layoutDependency: n, visualElement: r, drag: s, isPresent: i } = this.props, { projection: a } = r;
    return a && (a.isPresent = i, e.layoutDependency !== n && a.setOptions({
      ...a.options,
      layoutDependency: n
    }), Cs = !0, s || e.layoutDependency !== n || n === void 0 || e.isPresent !== i ? a.willUpdate() : this.safeToRemove(), e.isPresent !== i && (i ? a.promote() : a.relegate() || Re.postRender(() => {
      const o = a.getStack();
      (!o || !o.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { visualElement: e, layoutAnchor: n } = this.props, { projection: r } = e;
    r && (r.options.layoutAnchor = n, r.root.didUpdate(), Ri.postRender(() => {
      !r.currentAnimation && r.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: e, layoutGroup: n, switchLayoutGroup: r } = this.props, { projection: s } = e;
    Cs = !0, s && (s.scheduleCheckAfterUnmount(), n && n.group && n.group.remove(s), r && r.deregister && r.deregister(s));
  }
  safeToRemove() {
    const { safeToRemove: e } = this.props;
    e && e();
  }
  render() {
    return null;
  }
}
function zc(t) {
  const [e, n] = Ic(), r = _.useContext(ci);
  return v.jsx(rg, { ...t, layoutGroup: r, switchLayoutGroup: _.useContext(Fc), isPresent: e, safeToRemove: n });
}
const sg = {
  pan: {
    Feature: ng
  },
  drag: {
    Feature: tg,
    ProjectionNode: jc,
    MeasureLayout: zc
  }
};
function qo(t, e, n) {
  const { props: r } = t;
  t.animationState && r.whileHover && t.animationState.setActive("whileHover", n === "Start");
  const s = "onHover" + n, i = r[s];
  i && Re.postRender(() => i(e, Yn(e)));
}
class ig extends Dt {
  mount() {
    const { current: e } = this.node;
    e && (this.unmount = Th(e, (n, r) => (qo(this.node, r, "Start"), (s) => qo(this.node, s, "End"))));
  }
  unmount() {
  }
}
class ag extends Dt {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let e = !1;
    try {
      e = this.node.current.matches(":focus-visible");
    } catch {
      e = !0;
    }
    !e || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = zn($n(this.node.current, "focus", () => this.onFocus()), $n(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function Xo(t, e, n) {
  const { props: r } = t;
  if (t.current instanceof HTMLButtonElement && t.current.disabled)
    return;
  t.animationState && r.whileTap && t.animationState.setActive("whileTap", n === "Start");
  const s = "onTap" + (n === "End" ? "" : n), i = r[s];
  i && Re.postRender(() => i(e, Yn(e)));
}
class og extends Dt {
  mount() {
    const { current: e } = this.node;
    if (!e)
      return;
    const { globalTapTarget: n, propagate: r } = this.node.props;
    this.unmount = Ah(e, (s, i) => (Xo(this.node, i, "Start"), (a, { success: o }) => Xo(this.node, a, o ? "End" : "Cancel")), {
      useGlobalTarget: n,
      stopPropagation: (r == null ? void 0 : r.tap) === !1
    });
  }
  unmount() {
  }
}
const oi = /* @__PURE__ */ new WeakMap(), Es = /* @__PURE__ */ new WeakMap(), lg = (t) => {
  const e = oi.get(t.target);
  e && e(t);
}, cg = (t) => {
  t.forEach(lg);
};
function ug({ root: t, ...e }) {
  const n = t || document;
  Es.has(n) || Es.set(n, {});
  const r = Es.get(n), s = JSON.stringify(e);
  return r[s] || (r[s] = new IntersectionObserver(cg, { root: t, ...e })), r[s];
}
function dg(t, e, n) {
  const r = ug(e);
  return oi.set(t, n), r.observe(t), () => {
    oi.delete(t), r.unobserve(t);
  };
}
const fg = {
  some: 0,
  all: 1
};
class hg extends Dt {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    var c;
    (c = this.stopObserver) == null || c.call(this);
    const { viewport: e = {} } = this.node.getProps(), { root: n, margin: r, amount: s = "some", once: i } = e, a = {
      root: n ? n.current : void 0,
      rootMargin: r,
      threshold: typeof s == "number" ? s : fg[s]
    }, o = (u) => {
      const { isIntersecting: d } = u;
      if (this.isInView === d || (this.isInView = d, i && !d && this.hasEnteredView))
        return;
      d && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", d);
      const { onViewportEnter: f, onViewportLeave: m } = this.node.getProps(), y = d ? f : m;
      y && y(u);
    };
    this.stopObserver = dg(this.node.current, a, o);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: e, prevProps: n } = this.node;
    ["amount", "margin", "root"].some(mg(e, n)) && this.startObserver();
  }
  unmount() {
    var e;
    (e = this.stopObserver) == null || e.call(this), this.hasEnteredView = !1, this.isInView = !1;
  }
}
function mg({ viewport: t = {} }, { viewport: e = {} } = {}) {
  return (n) => t[n] !== e[n];
}
const pg = {
  inView: {
    Feature: hg
  },
  tap: {
    Feature: og
  },
  focus: {
    Feature: ag
  },
  hover: {
    Feature: ig
  }
}, gg = {
  layout: {
    ProjectionNode: jc,
    MeasureLayout: zc
  }
}, yg = {
  ...Up,
  ...pg,
  ...sg,
  ...gg
}, Rn = /* @__PURE__ */ Mp(yg, Vp);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zc = (...t) => t.filter((e, n, r) => !!e && e.trim() !== "" && r.indexOf(e) === n).join(" ").trim();
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const vg = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xg = (t) => t.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, n, r) => r ? r.toUpperCase() : n.toLowerCase()
);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Jo = (t) => {
  const e = xg(t);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Rs = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const bg = (t) => {
  for (const e in t)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
}, wg = _.createContext({}), _g = () => _.useContext(wg), Tg = _.forwardRef(
  ({ color: t, size: e, strokeWidth: n, absoluteStrokeWidth: r, className: s = "", children: i, iconNode: a, ...o }, c) => {
    const {
      size: u = 24,
      strokeWidth: d = 2,
      absoluteStrokeWidth: f = !1,
      color: m = "currentColor",
      className: y = ""
    } = _g() ?? {}, b = r ?? f ? Number(n ?? d) * 24 / Number(e ?? u) : n ?? d;
    return _.createElement(
      "svg",
      {
        ref: c,
        ...Rs,
        width: e ?? u ?? Rs.width,
        height: e ?? u ?? Rs.height,
        stroke: t ?? m,
        strokeWidth: b,
        className: Zc("lucide", y, s),
        ...!i && !bg(o) && { "aria-hidden": "true" },
        ...o
      },
      [
        ...a.map(([C, S]) => _.createElement(C, S)),
        ...Array.isArray(i) ? i : [i]
      ]
    );
  }
);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mt = (t, e) => {
  const n = _.forwardRef(
    ({ className: r, ...s }, i) => _.createElement(Tg, {
      ref: i,
      iconNode: e,
      className: Zc(
        `lucide-${vg(Jo(t))}`,
        `lucide-${t}`,
        r
      ),
      ...s
    })
  );
  return n.displayName = Jo(t), n;
};
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sg = [
  [
    "path",
    {
      d: "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",
      key: "1slcih"
    }
  ]
], kg = Mt("flame", Sg);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cg = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M16 16s-1.5-2-4-2-4 2-4 2", key: "epbg0q" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }]
], Eg = Mt("frown", Cg);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rg = [
  [
    "path",
    {
      d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
      key: "mvr1a0"
    }
  ]
], Ag = Mt("heart", Rg);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pg = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2", key: "1y1vjs" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }]
], jg = Mt("smile", Pg);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ig = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
], Og = Mt("sparkles", Ig);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dg = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
], hr = Mt("upload", Dg);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mg = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], Vg = Mt("x", Mg);
/**
 * @license lucide-react v1.8.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ng = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
], Lg = Mt("zap", Ng), As = {}, Fg = "/glb/537750f783bfeaf24d4e77f9330794f2.glb", Ug = "/glb/80.glb", Qo = vu.memo(({ url: t, role: e, apiBaseUrl: n }) => {
  const r = t.toLowerCase().includes(".glb") || t.endsWith("#glb");
  let s = t.replace("#glb", "");
  return (t.includes("tencentcos.cn") || t.includes("volces.com")) && (s = `${n}/api/proxy?url=${encodeURIComponent(s)}`), r ? /* @__PURE__ */ v.jsxs("div", { className: "relative h-full w-full flex items-center justify-center", children: [
    /* @__PURE__ */ v.jsxs("div", { className: "absolute top-6 left-1/2 -translate-x-1/2 flex gap-3 rounded-full bg-black/40 border border-white/10 px-4 py-1.5 text-[11px] text-white/60 backdrop-blur pointer-events-none z-10", children: [
      /* @__PURE__ */ v.jsx("span", { children: "🖱️ 左键: 旋转" }),
      /* @__PURE__ */ v.jsx("span", { children: "🖱️ 右键: 平移" }),
      /* @__PURE__ */ v.jsx("span", { children: "↕️ 滚轮: 缩放" })
    ] }),
    /* @__PURE__ */ v.jsx(
      "model-viewer",
      {
        src: s,
        class: "h-full w-full cursor-grab active:cursor-grabbing",
        "camera-controls": !0,
        "min-camera-orbit": "auto auto 5%",
        "max-camera-orbit": "auto auto 500%",
        "interaction-prompt": "none",
        "shadow-intensity": "1",
        "environment-image": "neutral",
        ar: !0,
        "ar-modes": "webxr scene-viewer quick-look",
        alt: "3D Model",
        children: /* @__PURE__ */ v.jsx("div", { slot: "poster", className: "flex h-full w-full items-center justify-center text-white/50", children: "加载模型中..." })
      }
    )
  ] }) : /* @__PURE__ */ v.jsx("div", { className: "h-full w-full flex items-center justify-center", children: /* @__PURE__ */ v.jsx(
    "img",
    {
      src: s,
      alt: e,
      className: "max-h-[80%] max-w-[80%] object-contain drop-shadow-2xl"
    }
  ) });
});
function Wg(t) {
  const [e, n] = _.useState([]), [r, s] = _.useState(""), [i, a] = _.useState("neutral"), [o, c] = _.useState("user"), u = _.useRef(null);
  _.useEffect(() => {
    let w;
    if (o === "auto") {
      let Y = !0;
      const K = () => {
        if (!Y) return;
        t.onSend && t.onSend({ text: "ping", role: "system_auto_ping" });
        const g = 8e3 + Math.random() * 4e3;
        w = setTimeout(K, g);
      };
      return w = setTimeout(K, 2e3), () => {
        Y = !1, clearTimeout(w);
      };
    }
  }, [o, t.onSend]);
  const f = (t.apiBaseUrl || function() {
    const Y = new URLSearchParams(location.search).get("apiBaseUrl");
    if (Y) return Y;
    const K = As == null ? void 0 : As.VITE_API_BASE_URL;
    return K ? String(K) : "http://localhost:8787";
  }()).replace(/\/$/, "");
  _.useEffect(() => {
    import("./model-viewer-BFXOgO29.js");
  }, []), _.useEffect(() => {
    if (t.chatHistory)
      try {
        const w = JSON.parse(t.chatHistory);
        if (Array.isArray(w)) {
          const Y = w.map((K, g) => ({
            id: `history-${g}`,
            sender: K.role === "user" ? "me" : "other",
            text: K.content || "",
            emotion: "neutral"
            // 默认情绪
          }));
          n((K) => {
            const g = K.map(($) => $.text).join("|"), R = Y.map(($) => $.text).join("|");
            return g !== R ? Y : K;
          });
        }
      } catch (w) {
        console.error("Failed to parse chatHistory", w);
      }
  }, [t.chatHistory]);
  const [m, y] = _.useState(() => {
    try {
      const w = localStorage.getItem("resonance-me-image");
      if (w && !w.startsWith("blob:")) return w;
    } catch {
    }
    return `${Fg}#glb`;
  }), [b, C] = _.useState(() => {
    try {
      const w = localStorage.getItem("resonance-other-image");
      if (w && !w.startsWith("blob:")) return w;
    } catch {
    }
    return `${Ug}#glb`;
  }), [S, k] = _.useState(() => {
    try {
      const w = localStorage.getItem("resonance-bg-video");
      if (w && !w.startsWith("blob:")) return w;
    } catch {
    }
    return "/video/bg.mp4";
  }), j = _.useRef(null);
  _.useEffect(() => {
    try {
      S && localStorage.setItem("resonance-bg-video", S);
    } catch {
    }
  }, [S]);
  const E = _.useRef(null), D = _.useRef(null), [M, B] = _.useState(null), [Q, V] = _.useState([]), [G, F] = _.useState([]);
  _.useEffect(() => {
    var K;
    const w = /* @__PURE__ */ new Set(), Y = /* @__PURE__ */ new Set();
    try {
      const g = localStorage.getItem("ai-plugin-history:v1");
      g && ((K = JSON.parse(g).items) == null || K.forEach((R) => {
        R.images && R.images.forEach(($) => w.add($)), R.modelUrl && Y.add(R.modelUrl);
      }));
    } catch {
    }
    try {
      const g = localStorage.getItem("ai-plugin-panel-state:v1");
      if (g) {
        const R = JSON.parse(g);
        R.images && R.images.forEach(($) => w.add($)), R.modelUrl && Y.add(R.modelUrl);
      }
    } catch {
    }
    V(Array.from(w)), F(Array.from(Y));
  }, []), _.useEffect(() => {
    try {
      localStorage.setItem("resonance-me-image", m);
    } catch {
    }
  }, [m]), _.useEffect(() => {
    try {
      localStorage.setItem("resonance-other-image", b);
    } catch {
    }
  }, [b]);
  const ie = (w, Y) => {
    var re;
    const K = (re = Y.target.files) == null ? void 0 : re[0];
    if (!K) return;
    const g = K.name.toLowerCase().endsWith(".glb"), R = URL.createObjectURL(K), $ = g ? `${R}#glb` : R;
    w === "me" ? y($) : C($), Y.target.value = "", B(null);
  }, xe = {
    neutral: "from-slate-900 to-slate-950",
    happy: "from-pink-900/40 to-slate-950",
    angry: "from-red-900/60 to-slate-950",
    sad: "from-blue-900/50 to-slate-950",
    mock: "from-purple-900/50 to-slate-950"
  }, Se = (w, Y) => {
    if (!Y) return { scale: 1, x: 0, filter: "brightness(1)", y: 0 };
    const K = Y.sender === w, g = Y.emotion;
    return g === "angry" ? K ? { scale: 1.2, y: [0, -10, 10, -10, 0], filter: "brightness(1.2) drop-shadow(0 0 10px red)" } : { scale: 0.9, x: w === "me" ? -20 : 20, filter: "brightness(0.5)" } : g === "happy" ? { scale: 1.1, x: w === "me" ? 30 : -30, filter: "brightness(1.1) drop-shadow(0 0 10px pink)" } : g === "sad" ? K ? { scale: 0.95, y: 10, filter: "brightness(0.7) drop-shadow(0 0 10px blue)" } : { scale: 1, x: 0, filter: "brightness(0.9)" } : g === "mock" ? K ? { scale: 1.05, rotate: w === "me" ? 5 : -5, filter: "brightness(1.1) drop-shadow(0 0 10px purple)" } : { scale: 0.95, filter: "brightness(0.8)" } : { scale: 1, x: 0, filter: "brightness(1)", y: 0 };
  }, me = () => {
    if (!r.trim() && i === "neutral") return;
    if (t.onSend) {
      const K = {
        id: Date.now().toString(),
        sender: o === "user" ? "me" : "other",
        text: r,
        emotion: i
      };
      if (o === "user") {
        t.onSend({ text: r, role: "user" });
        const g = {
          id: (Date.now() + 1).toString(),
          sender: "other",
          text: "...",
          emotion: "neutral"
        };
        n((R) => [...R, K, g]);
      } else
        t.onSend({ text: r, role: "assistant" }), n((g) => [...g, K]);
      s("");
      return;
    }
    const w = {
      id: Date.now().toString(),
      sender: "me",
      text: r,
      emotion: i
    };
    n((K) => [...K, w]), s("");
    const Y = {
      angry: [
        { text: "对不起嘛，别生气了...", emotion: "sad" },
        { text: "消消气，给你买好吃的~", emotion: "happy" },
        { text: "哼，你凶我！", emotion: "angry" }
      ],
      happy: [
        { text: "我也想你！", emotion: "happy" },
        { text: "看你开心我也开心~", emotion: "happy" },
        { text: "贴贴！", emotion: "happy" }
      ],
      sad: [
        { text: "抱抱，我在呢...", emotion: "sad" },
        { text: "摸摸头，一切都会好起来的", emotion: "neutral" },
        { text: "别难过啦，给你讲个笑话？", emotion: "happy" }
      ],
      mock: [
        { text: "略略略，就不听！", emotion: "mock" },
        { text: "你厉害行了吧！", emotion: "angry" },
        { text: "哼，不理你了！", emotion: "angry" }
      ],
      neutral: [
        { text: "嗯嗯，在听呢。", emotion: "neutral" },
        { text: "原来是这样呀。", emotion: "neutral" },
        { text: "然后呢？", emotion: "neutral" }
      ]
    };
    setTimeout(() => {
      const K = Y[i] || Y.neutral, g = K[Math.floor(Math.random() * K.length)];
      n((R) => [...R, {
        id: (Date.now() + 1).toString(),
        sender: "other",
        text: g.text,
        emotion: g.emotion
      }]);
    }, 2e3);
  }, pe = (w) => {
    var g;
    const Y = (g = w.target.files) == null ? void 0 : g[0];
    if (!Y) return;
    const K = URL.createObjectURL(Y);
    k(K), w.target.value = "";
  }, ue = e[e.length - 1], Te = ue ? xe[ue.emotion] : xe.neutral;
  return _.useEffect(() => {
    u.current && u.current.scrollIntoView({ behavior: "smooth" });
  }, [e]), /* @__PURE__ */ v.jsxs("div", { className: `relative flex h-screen w-full flex-col overflow-hidden bg-gradient-to-b ${Te} text-white transition-colors duration-1000`, children: [
    S && /* @__PURE__ */ v.jsx(
      "video",
      {
        src: S,
        autoPlay: !0,
        loop: !0,
        muted: !0,
        playsInline: !0,
        className: "absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-screen pointer-events-none"
      }
    ),
    /* @__PURE__ */ v.jsxs("div", { className: "absolute left-4 right-4 top-4 z-50 flex justify-between", children: [
      /* @__PURE__ */ v.jsx("a", { href: "/", className: "rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur hover:bg-white/20 border border-white/10", children: "← 返回普通插件" }),
      /* @__PURE__ */ v.jsxs("button", { onClick: () => {
        var w;
        return (w = j.current) == null ? void 0 : w.click();
      }, className: "flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur hover:bg-white/20 border border-white/10 transition-colors", children: [
        /* @__PURE__ */ v.jsx(hr, { className: "h-4 w-4" }),
        "更换背景视频"
      ] })
    ] }),
    /* @__PURE__ */ v.jsx("input", { type: "file", accept: "video/mp4,video/webm", className: "hidden", ref: j, onChange: pe }),
    /* @__PURE__ */ v.jsx(Lo, { children: M && /* @__PURE__ */ v.jsx(
      Rn.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm",
        children: /* @__PURE__ */ v.jsxs(
          Rn.div,
          {
            initial: { scale: 0.9, y: 20 },
            animate: { scale: 1, y: 0 },
            exit: { scale: 0.9, y: 20 },
            className: "w-full max-w-md rounded-2xl bg-slate-900 p-6 border border-slate-700 shadow-2xl",
            children: [
              /* @__PURE__ */ v.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ v.jsxs("h3", { className: "text-lg font-bold text-white", children: [
                  "更换 ",
                  M === "me" ? "我" : "对方",
                  " 的头像"
                ] }),
                /* @__PURE__ */ v.jsx("button", { onClick: () => B(null), className: "text-slate-400 hover:text-white", children: /* @__PURE__ */ v.jsx(Vg, { className: "h-5 w-5" }) })
              ] }),
              G.length > 0 && /* @__PURE__ */ v.jsxs("div", { className: "mb-4", children: [
                /* @__PURE__ */ v.jsx("p", { className: "mb-2 text-sm text-slate-400", children: "从最近生成的 3D 模型中选择：" }),
                /* @__PURE__ */ v.jsx("div", { className: "grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar", children: G.map((w, Y) => {
                  let K = w;
                  return (w.includes("tencentcos.cn") || w.includes("volces.com")) && (K = `${f}/api/proxy?url=${encodeURIComponent(w)}`), /* @__PURE__ */ v.jsx(
                    "div",
                    {
                      className: "group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-transparent hover:border-indigo-500 hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all bg-slate-800",
                      onClick: () => {
                        const g = `${w}#glb`;
                        M === "me" ? y(g) : C(g), B(null);
                      },
                      children: /* @__PURE__ */ v.jsx(
                        "model-viewer",
                        {
                          src: K,
                          class: "h-full w-full pointer-events-none",
                          "interaction-prompt": "none",
                          "disable-zoom": !0
                        }
                      )
                    },
                    Y
                  );
                }) })
              ] }),
              Q.length > 0 && /* @__PURE__ */ v.jsxs("div", { className: "mb-4", children: [
                /* @__PURE__ */ v.jsx("p", { className: "mb-2 text-sm text-slate-400", children: "从最近生成的图片中选择：" }),
                /* @__PURE__ */ v.jsx("div", { className: "grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar", children: Q.map((w, Y) => {
                  let K = w;
                  return (w.includes("tencentcos.cn") || w.includes("volces.com")) && (K = `${f}/api/proxy?url=${encodeURIComponent(w)}`), /* @__PURE__ */ v.jsx(
                    "img",
                    {
                      src: K,
                      alt: "history",
                      className: "aspect-square w-full rounded-lg object-cover cursor-pointer border border-transparent hover:border-indigo-500 hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all",
                      onClick: () => {
                        M === "me" ? y(w) : C(w), B(null);
                      }
                    },
                    Y
                  );
                }) })
              ] }),
              /* @__PURE__ */ v.jsxs(
                "button",
                {
                  onClick: () => {
                    var w, Y;
                    M === "me" ? (w = E.current) == null || w.click() : (Y = D.current) == null || Y.click(), B(null);
                  },
                  className: "w-full rounded-lg bg-slate-800 py-3 text-sm font-medium text-white hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-2 transition-colors",
                  children: [
                    /* @__PURE__ */ v.jsx(hr, { className: "h-4 w-4" }),
                    "上传本地图片或模型 (.glb)"
                  ]
                }
              )
            ]
          }
        )
      }
    ) }),
    /* @__PURE__ */ v.jsx(
      "input",
      {
        type: "file",
        accept: "image/*,.glb",
        className: "hidden",
        ref: D,
        onChange: (w) => ie("other", w)
      }
    ),
    /* @__PURE__ */ v.jsx(
      "input",
      {
        type: "file",
        accept: "image/*,.glb",
        className: "hidden",
        ref: E,
        onChange: (w) => ie("me", w)
      }
    ),
    /* @__PURE__ */ v.jsxs("div", { className: "relative flex flex-1 w-full h-full", children: [
      /* @__PURE__ */ v.jsx("div", { className: "relative flex-1 h-full", children: /* @__PURE__ */ v.jsxs(
        Rn.div,
        {
          className: "group relative z-10 flex flex-col items-center justify-center h-full w-full",
          animate: Se("other", ue),
          transition: { type: "spring", stiffness: 200, damping: 20 },
          children: [
            /* @__PURE__ */ v.jsx(Qo, { url: b, role: "other", apiBaseUrl: f }),
            /* @__PURE__ */ v.jsxs(
              "button",
              {
                onClick: () => B("other"),
                className: "absolute bottom-10 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white/90 opacity-0 backdrop-blur transition-all hover:bg-black/80 hover:text-white group-hover:opacity-100 z-50 shadow-lg border border-white/20",
                children: [
                  /* @__PURE__ */ v.jsx(hr, { className: "h-3 w-3" }),
                  " 更换对方化身"
                ]
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ v.jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center z-20", children: /* @__PURE__ */ v.jsx("div", { className: "pointer-events-auto w-full max-w-md h-3/4 flex flex-col overflow-hidden rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 shadow-2xl", children: /* @__PURE__ */ v.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar flex flex-col", children: [
        /* @__PURE__ */ v.jsx(Lo, { initial: !1, children: e.map((w) => /* @__PURE__ */ v.jsx(
          Rn.div,
          {
            initial: { opacity: 0, y: 20, scale: 0.9 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
            transition: { type: "spring", stiffness: 200, damping: 20 },
            className: `flex ${w.sender === "me" ? "justify-end" : "justify-start"} w-full`,
            children: /* @__PURE__ */ v.jsx(
              "div",
              {
                className: `max-w-[80%] rounded-2xl px-4 py-2.5 text-sm md:text-base ${w.sender === "me" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-md" : "bg-white/10 text-slate-100 rounded-tl-sm border border-white/5 shadow-md"}`,
                children: w.text
              }
            )
          },
          w.id
        )) }),
        /* @__PURE__ */ v.jsx("div", { ref: u })
      ] }) }) }),
      /* @__PURE__ */ v.jsx("div", { className: "relative flex-1 h-full", children: /* @__PURE__ */ v.jsxs(
        Rn.div,
        {
          className: "group relative z-10 flex flex-col items-center justify-center h-full w-full",
          animate: Se("me", ue),
          transition: { type: "spring", stiffness: 200, damping: 20 },
          children: [
            /* @__PURE__ */ v.jsx(Qo, { url: m, role: "me", apiBaseUrl: f }),
            /* @__PURE__ */ v.jsxs(
              "button",
              {
                onClick: () => B("me"),
                className: "absolute bottom-10 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white/90 opacity-0 backdrop-blur transition-all hover:bg-black/80 hover:text-white group-hover:opacity-100 z-50 shadow-lg border border-white/20",
                children: [
                  /* @__PURE__ */ v.jsx(hr, { className: "h-3 w-3" }),
                  " 更换我的化身"
                ]
              }
            )
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ v.jsxs("div", { className: "relative z-20 flex flex-col gap-4 border-t border-white/10 bg-black/40 p-6 backdrop-blur-xl", children: [
      /* @__PURE__ */ v.jsxs("div", { className: "flex justify-between items-center w-full max-w-2xl mx-auto", children: [
        /* @__PURE__ */ v.jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ v.jsx(An, { icon: /* @__PURE__ */ v.jsx(jg, {}), label: "开心", active: i === "happy", color: "text-pink-400", onClick: () => a("happy") }),
          /* @__PURE__ */ v.jsx(An, { icon: /* @__PURE__ */ v.jsx(kg, {}), label: "愤怒", active: i === "angry", color: "text-red-500", onClick: () => a("angry") }),
          /* @__PURE__ */ v.jsx(An, { icon: /* @__PURE__ */ v.jsx(Eg, {}), label: "难过", active: i === "sad", color: "text-blue-400", onClick: () => a("sad") }),
          /* @__PURE__ */ v.jsx(An, { icon: /* @__PURE__ */ v.jsx(Og, {}), label: "嘲讽", active: i === "mock", color: "text-purple-400", onClick: () => a("mock") }),
          /* @__PURE__ */ v.jsx(An, { icon: /* @__PURE__ */ v.jsx(Ag, {}), label: "平静", active: i === "neutral", color: "text-slate-300", onClick: () => a("neutral") })
        ] }),
        /* @__PURE__ */ v.jsxs("div", { className: "flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10", children: [
          /* @__PURE__ */ v.jsx(
            "button",
            {
              onClick: () => {
                c("ai"), t.onSend && o === "auto" && t.onSend({ text: "停止挂机", role: "system_auto_stop" });
              },
              className: `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${o === "ai" ? "bg-pink-500/20 text-pink-400 border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]" : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"}`,
              children: "❤️ 接管"
            }
          ),
          /* @__PURE__ */ v.jsx(
            "button",
            {
              onClick: () => {
                c("auto"), t.onSend && t.onSend({ text: "开始挂机", role: "system_auto_start" });
              },
              className: `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${o === "auto" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"}`,
              children: "🤖 挂机"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ v.jsxs("div", { className: "mx-auto flex w-full max-w-2xl items-center gap-3 rounded-full bg-white/5 p-2 pl-4 shadow-inner ring-1 ring-white/10 focus-within:ring-white/30", children: [
        /* @__PURE__ */ v.jsx(
          "input",
          {
            type: "text",
            value: r,
            onChange: (w) => s(w.target.value),
            onKeyDown: (w) => w.key === "Enter" && me(),
            placeholder: o === "auto" ? "当前为挂机模式，AI 正在自由交谈..." : o === "ai" ? "输入文字，你将作为右侧 AI 进行回复..." : "输入文字，结合上面的情绪一起发送...",
            disabled: o === "auto",
            className: "flex-1 bg-transparent text-white placeholder-white/30 outline-none disabled:opacity-50"
          }
        ),
        /* @__PURE__ */ v.jsx(
          "button",
          {
            onClick: () => {
              o === "auto" ? (c("user"), t.onSend && t.onSend({ text: "停止挂机", role: "system_auto_stop" })) : me();
            },
            className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r ${o === "auto" ? "from-slate-600 to-slate-500" : i === "angry" ? "from-red-600 to-orange-500" : i === "happy" ? "from-pink-500 to-rose-400" : "from-indigo-500 to-blue-500"} transition-transform hover:scale-105 active:scale-95`,
            children: o === "auto" ? /* @__PURE__ */ v.jsx("span", { className: "text-white text-xs font-bold", children: "停止" }) : /* @__PURE__ */ v.jsx(Lg, { className: "h-5 w-5 text-white" })
          }
        )
      ] })
    ] })
  ] });
}
function An({ icon: t, label: e, active: n, color: r, onClick: s }) {
  return /* @__PURE__ */ v.jsxs(
    "button",
    {
      onClick: s,
      className: `flex flex-col items-center gap-1 rounded-xl p-3 transition-all ${n ? `bg-white/10 ${r} scale-110 shadow-[0_0_15px_rgba(255,255,255,0.1)]` : "text-white/50 hover:bg-white/5 hover:text-white/80"}`,
      children: [
        t,
        /* @__PURE__ */ v.jsx("span", { className: "text-xs", children: e })
      ]
    }
  );
}
export {
  Bg as A,
  vu as R,
  Wg as a,
  v as j,
  _ as r
};
