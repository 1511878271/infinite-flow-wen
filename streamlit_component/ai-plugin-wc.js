var rE = (B) => {
  throw TypeError(B);
};
var hS = (B, he, k) => he.has(B) || rE("Cannot " + k);
var ca = (B, he, k) => (hS(B, he, "read from private field"), k ? k.call(B) : he.get(B)), ps = (B, he, k) => he.has(B) ? rE("Cannot add the same private member more than once") : he instanceof WeakSet ? he.add(B) : he.set(B, k), Rl = (B, he, k, ke) => (hS(B, he, "write to private field"), ke ? ke.call(B, k) : he.set(B, k), k), mf = (B, he, k) => (hS(B, he, "access private method"), k);
import { r as cE, R as CS, j as Fi, A as rD, a as aD } from "./react-DPAyRAb1.js";
var gS = { exports: {} }, Qr = {}, Fm = { exports: {} }, mS = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aE;
function iD() {
  return aE || (aE = 1, function(B) {
    function he(W, ue) {
      var Z = W.length;
      W.push(ue);
      e: for (; 0 < Z; ) {
        var Qe = Z - 1 >>> 1, Xe = W[Qe];
        if (0 < Xt(Xe, ue)) W[Qe] = ue, W[Z] = Xe, Z = Qe;
        else break e;
      }
    }
    function k(W) {
      return W.length === 0 ? null : W[0];
    }
    function ke(W) {
      if (W.length === 0) return null;
      var ue = W[0], Z = W.pop();
      if (Z !== ue) {
        W[0] = Z;
        e: for (var Qe = 0, Xe = W.length, xr = Xe >>> 1; Qe < xr; ) {
          var Pn = 2 * (Qe + 1) - 1, za = W[Pn], lr = Pn + 1, Oa = W[lr];
          if (0 > Xt(za, Z)) lr < Xe && 0 > Xt(Oa, za) ? (W[Qe] = Oa, W[lr] = Z, Qe = lr) : (W[Qe] = za, W[Pn] = Z, Qe = Pn);
          else if (lr < Xe && 0 > Xt(Oa, Z)) W[Qe] = Oa, W[lr] = Z, Qe = lr;
          else break e;
        }
      }
      return ue;
    }
    function Xt(W, ue) {
      var Z = W.sortIndex - ue.sortIndex;
      return Z !== 0 ? Z : W.id - ue.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var Et = performance;
      B.unstable_now = function() {
        return Et.now();
      };
    } else {
      var zt = Date, S = zt.now();
      B.unstable_now = function() {
        return zt.now() - S;
      };
    }
    var nn = [], be = [], me = 1, Je = null, ee = 3, Ve = !1, ae = !1, ge = !1, rt = typeof setTimeout == "function" ? setTimeout : null, $r = typeof clearTimeout == "function" ? clearTimeout : null, Cr = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function yn(W) {
      for (var ue = k(be); ue !== null; ) {
        if (ue.callback === null) ke(be);
        else if (ue.startTime <= W) ke(be), ue.sortIndex = ue.expirationTime, he(nn, ue);
        else break;
        ue = k(be);
      }
    }
    function Te(W) {
      if (ge = !1, yn(W), !ae) if (k(nn) !== null) ae = !0, mt(Ot);
      else {
        var ue = k(be);
        ue !== null && Bn(Te, ue.startTime - W);
      }
    }
    function Ot(W, ue) {
      ae = !1, ge && (ge = !1, $r(Ue), Ue = -1), Ve = !0;
      var Z = ee;
      try {
        for (yn(ue), Je = k(nn); Je !== null && (!(Je.expirationTime > ue) || W && !qt()); ) {
          var Qe = Je.callback;
          if (typeof Qe == "function") {
            Je.callback = null, ee = Je.priorityLevel;
            var Xe = Qe(Je.expirationTime <= ue);
            ue = B.unstable_now(), typeof Xe == "function" ? Je.callback = Xe : Je === k(nn) && ke(nn), yn(ue);
          } else ke(nn);
          Je = k(nn);
        }
        if (Je !== null) var xr = !0;
        else {
          var Pn = k(be);
          Pn !== null && Bn(Te, Pn.startTime - ue), xr = !1;
        }
        return xr;
      } finally {
        Je = null, ee = Z, Ve = !1;
      }
    }
    var _e = !1, vt = null, Ue = -1, Er = 5, xt = -1;
    function qt() {
      return !(B.unstable_now() - xt < Er);
    }
    function bt() {
      if (vt !== null) {
        var W = B.unstable_now();
        xt = W;
        var ue = !0;
        try {
          ue = vt(!0, W);
        } finally {
          ue ? at() : (_e = !1, vt = null);
        }
      } else _e = !1;
    }
    var at;
    if (typeof Cr == "function") at = function() {
      Cr(bt);
    };
    else if (typeof MessageChannel < "u") {
      var Ae = new MessageChannel(), kn = Ae.port2;
      Ae.port1.onmessage = bt, at = function() {
        kn.postMessage(null);
      };
    } else at = function() {
      rt(bt, 0);
    };
    function mt(W) {
      vt = W, _e || (_e = !0, at());
    }
    function Bn(W, ue) {
      Ue = rt(function() {
        W(B.unstable_now());
      }, ue);
    }
    B.unstable_IdlePriority = 5, B.unstable_ImmediatePriority = 1, B.unstable_LowPriority = 4, B.unstable_NormalPriority = 3, B.unstable_Profiling = null, B.unstable_UserBlockingPriority = 2, B.unstable_cancelCallback = function(W) {
      W.callback = null;
    }, B.unstable_continueExecution = function() {
      ae || Ve || (ae = !0, mt(Ot));
    }, B.unstable_forceFrameRate = function(W) {
      0 > W || 125 < W ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Er = 0 < W ? Math.floor(1e3 / W) : 5;
    }, B.unstable_getCurrentPriorityLevel = function() {
      return ee;
    }, B.unstable_getFirstCallbackNode = function() {
      return k(nn);
    }, B.unstable_next = function(W) {
      switch (ee) {
        case 1:
        case 2:
        case 3:
          var ue = 3;
          break;
        default:
          ue = ee;
      }
      var Z = ee;
      ee = ue;
      try {
        return W();
      } finally {
        ee = Z;
      }
    }, B.unstable_pauseExecution = function() {
    }, B.unstable_requestPaint = function() {
    }, B.unstable_runWithPriority = function(W, ue) {
      switch (W) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          W = 3;
      }
      var Z = ee;
      ee = W;
      try {
        return ue();
      } finally {
        ee = Z;
      }
    }, B.unstable_scheduleCallback = function(W, ue, Z) {
      var Qe = B.unstable_now();
      switch (typeof Z == "object" && Z !== null ? (Z = Z.delay, Z = typeof Z == "number" && 0 < Z ? Qe + Z : Qe) : Z = Qe, W) {
        case 1:
          var Xe = -1;
          break;
        case 2:
          Xe = 250;
          break;
        case 5:
          Xe = 1073741823;
          break;
        case 4:
          Xe = 1e4;
          break;
        default:
          Xe = 5e3;
      }
      return Xe = Z + Xe, W = { id: me++, callback: ue, priorityLevel: W, startTime: Z, expirationTime: Xe, sortIndex: -1 }, Z > Qe ? (W.sortIndex = Z, he(be, W), k(nn) === null && W === k(be) && (ge ? ($r(Ue), Ue = -1) : ge = !0, Bn(Te, Z - Qe))) : (W.sortIndex = Xe, he(nn, W), ae || Ve || (ae = !0, mt(Ot))), W;
    }, B.unstable_shouldYield = qt, B.unstable_wrapCallback = function(W) {
      var ue = ee;
      return function() {
        var Z = ee;
        ee = ue;
        try {
          return W.apply(this, arguments);
        } finally {
          ee = Z;
        }
      };
    };
  }(mS)), mS;
}
var yS = {}, iE;
function lD() {
  return iE || (iE = 1, function(B) {
    var he = {};
    /**
     * @license React
     * scheduler.development.js
     *
     * Copyright (c) Facebook, Inc. and its affiliates.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    he.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var k = !1, ke = 5;
      function Xt(Y, pe) {
        var Me = Y.length;
        Y.push(pe), S(Y, pe, Me);
      }
      function Et(Y) {
        return Y.length === 0 ? null : Y[0];
      }
      function zt(Y) {
        if (Y.length === 0)
          return null;
        var pe = Y[0], Me = Y.pop();
        return Me !== pe && (Y[0] = Me, nn(Y, Me, 0)), pe;
      }
      function S(Y, pe, Me) {
        for (var it = Me; it > 0; ) {
          var Tt = it - 1 >>> 1, Sn = Y[Tt];
          if (be(Sn, pe) > 0)
            Y[Tt] = pe, Y[it] = Sn, it = Tt;
          else
            return;
        }
      }
      function nn(Y, pe, Me) {
        for (var it = Me, Tt = Y.length, Sn = Tt >>> 1; it < Sn; ) {
          var Nt = (it + 1) * 2 - 1, Qn = Y[Nt], Ut = Nt + 1, yt = Y[Ut];
          if (be(Qn, pe) < 0)
            Ut < Tt && be(yt, Qn) < 0 ? (Y[it] = yt, Y[Ut] = pe, it = Ut) : (Y[it] = Qn, Y[Nt] = pe, it = Nt);
          else if (Ut < Tt && be(yt, pe) < 0)
            Y[it] = yt, Y[Ut] = pe, it = Ut;
          else
            return;
        }
      }
      function be(Y, pe) {
        var Me = Y.sortIndex - pe.sortIndex;
        return Me !== 0 ? Me : Y.id - pe.id;
      }
      var me = 1, Je = 2, ee = 3, Ve = 4, ae = 5;
      function ge(Y, pe) {
      }
      var rt = typeof performance == "object" && typeof performance.now == "function";
      if (rt) {
        var $r = performance;
        B.unstable_now = function() {
          return $r.now();
        };
      } else {
        var Cr = Date, yn = Cr.now();
        B.unstable_now = function() {
          return Cr.now() - yn;
        };
      }
      var Te = 1073741823, Ot = -1, _e = 250, vt = 5e3, Ue = 1e4, Er = Te, xt = [], qt = [], bt = 1, at = null, Ae = ee, kn = !1, mt = !1, Bn = !1, W = typeof setTimeout == "function" ? setTimeout : null, ue = typeof clearTimeout == "function" ? clearTimeout : null, Z = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function Qe(Y) {
        for (var pe = Et(qt); pe !== null; ) {
          if (pe.callback === null)
            zt(qt);
          else if (pe.startTime <= Y)
            zt(qt), pe.sortIndex = pe.expirationTime, Xt(xt, pe);
          else
            return;
          pe = Et(qt);
        }
      }
      function Xe(Y) {
        if (Bn = !1, Qe(Y), !mt)
          if (Et(xt) !== null)
            mt = !0, ur(xr);
          else {
            var pe = Et(qt);
            pe !== null && Kr(Xe, pe.startTime - Y);
          }
      }
      function xr(Y, pe) {
        mt = !1, Bn && (Bn = !1, ni()), kn = !0;
        var Me = Ae;
        try {
          var it;
          if (!k) return Pn(Y, pe);
        } finally {
          at = null, Ae = Me, kn = !1;
        }
      }
      function Pn(Y, pe) {
        var Me = pe;
        for (Qe(Me), at = Et(xt); at !== null && !(at.expirationTime > Me && (!Y || Ml())); ) {
          var it = at.callback;
          if (typeof it == "function") {
            at.callback = null, Ae = at.priorityLevel;
            var Tt = at.expirationTime <= Me, Sn = it(Tt);
            Me = B.unstable_now(), typeof Sn == "function" ? at.callback = Sn : at === Et(xt) && zt(xt), Qe(Me);
          } else
            zt(xt);
          at = Et(xt);
        }
        if (at !== null)
          return !0;
        var Nt = Et(qt);
        return Nt !== null && Kr(Xe, Nt.startTime - Me), !1;
      }
      function za(Y, pe) {
        switch (Y) {
          case me:
          case Je:
          case ee:
          case Ve:
          case ae:
            break;
          default:
            Y = ee;
        }
        var Me = Ae;
        Ae = Y;
        try {
          return pe();
        } finally {
          Ae = Me;
        }
      }
      function lr(Y) {
        var pe;
        switch (Ae) {
          case me:
          case Je:
          case ee:
            pe = ee;
            break;
          default:
            pe = Ae;
            break;
        }
        var Me = Ae;
        Ae = pe;
        try {
          return Y();
        } finally {
          Ae = Me;
        }
      }
      function Oa(Y) {
        var pe = Ae;
        return function() {
          var Me = Ae;
          Ae = pe;
          try {
            return Y.apply(this, arguments);
          } finally {
            Ae = Me;
          }
        };
      }
      function gn(Y, pe, Me) {
        var it = B.unstable_now(), Tt;
        if (typeof Me == "object" && Me !== null) {
          var Sn = Me.delay;
          typeof Sn == "number" && Sn > 0 ? Tt = it + Sn : Tt = it;
        } else
          Tt = it;
        var Nt;
        switch (Y) {
          case me:
            Nt = Ot;
            break;
          case Je:
            Nt = _e;
            break;
          case ae:
            Nt = Er;
            break;
          case Ve:
            Nt = Ue;
            break;
          case ee:
          default:
            Nt = vt;
            break;
        }
        var Qn = Tt + Nt, Ut = {
          id: bt++,
          callback: pe,
          priorityLevel: Y,
          startTime: Tt,
          expirationTime: Qn,
          sortIndex: -1
        };
        return Tt > it ? (Ut.sortIndex = Tt, Xt(qt, Ut), Et(xt) === null && Ut === Et(qt) && (Bn ? ni() : Bn = !0, Kr(Xe, Tt - it))) : (Ut.sortIndex = Qn, Xt(xt, Ut), !mt && !kn && (mt = !0, ur(xr))), Ut;
      }
      function _l() {
      }
      function Na() {
        !mt && !kn && (mt = !0, ur(xr));
      }
      function Gr() {
        return Et(xt);
      }
      function Yn(Y) {
        Y.callback = null;
      }
      function br() {
        return Ae;
      }
      var or = !1, Tr = null, Rr = -1, Wr = ke, Bo = -1;
      function Ml() {
        var Y = B.unstable_now() - Bo;
        return !(Y < Wr);
      }
      function ji() {
      }
      function ti(Y) {
        if (Y < 0 || Y > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        Y > 0 ? Wr = Math.floor(1e3 / Y) : Wr = ke;
      }
      var fa = function() {
        if (Tr !== null) {
          var Y = B.unstable_now();
          Bo = Y;
          var pe = !0, Me = !0;
          try {
            Me = Tr(pe, Y);
          } finally {
            Me ? Xr() : (or = !1, Tr = null);
          }
        } else
          or = !1;
      }, Xr;
      if (typeof Z == "function")
        Xr = function() {
          Z(fa);
        };
      else if (typeof MessageChannel < "u") {
        var qr = new MessageChannel(), Ll = qr.port2;
        qr.port1.onmessage = fa, Xr = function() {
          Ll.postMessage(null);
        };
      } else
        Xr = function() {
          W(fa, 0);
        };
      function ur(Y) {
        Tr = Y, or || (or = !0, Xr());
      }
      function Kr(Y, pe) {
        Rr = W(function() {
          Y(B.unstable_now());
        }, pe);
      }
      function ni() {
        ue(Rr), Rr = -1;
      }
      var Po = ji, ri = null;
      B.unstable_IdlePriority = ae, B.unstable_ImmediatePriority = me, B.unstable_LowPriority = Ve, B.unstable_NormalPriority = ee, B.unstable_Profiling = ri, B.unstable_UserBlockingPriority = Je, B.unstable_cancelCallback = Yn, B.unstable_continueExecution = Na, B.unstable_forceFrameRate = ti, B.unstable_getCurrentPriorityLevel = br, B.unstable_getFirstCallbackNode = Gr, B.unstable_next = lr, B.unstable_pauseExecution = _l, B.unstable_requestPaint = Po, B.unstable_runWithPriority = za, B.unstable_scheduleCallback = gn, B.unstable_shouldYield = Ml, B.unstable_wrapCallback = Oa, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(yS)), yS;
}
var lE;
function fE() {
  if (lE) return Fm.exports;
  lE = 1;
  var B = {};
  return B.NODE_ENV === "production" ? Fm.exports = iD() : Fm.exports = lD(), Fm.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var oE;
function oD() {
  if (oE) return Qr;
  oE = 1;
  var B = cE, he = fE();
  function k(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++) r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var ke = /* @__PURE__ */ new Set(), Xt = {};
  function Et(n, r) {
    zt(n, r), zt(n + "Capture", r);
  }
  function zt(n, r) {
    for (Xt[n] = r, n = 0; n < r.length; n++) ke.add(r[n]);
  }
  var S = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), nn = Object.prototype.hasOwnProperty, be = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, me = {}, Je = {};
  function ee(n) {
    return nn.call(Je, n) ? !0 : nn.call(me, n) ? !1 : be.test(n) ? Je[n] = !0 : (me[n] = !0, !1);
  }
  function Ve(n, r, l, u) {
    if (l !== null && l.type === 0) return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return u ? !1 : l !== null ? !l.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function ae(n, r, l, u) {
    if (r === null || typeof r > "u" || Ve(n, r, l, u)) return !0;
    if (u) return !1;
    if (l !== null) switch (l.type) {
      case 3:
        return !r;
      case 4:
        return r === !1;
      case 5:
        return isNaN(r);
      case 6:
        return isNaN(r) || 1 > r;
    }
    return !1;
  }
  function ge(n, r, l, u, c, d, h) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = u, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = h;
  }
  var rt = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    rt[n] = new ge(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    rt[r] = new ge(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    rt[n] = new ge(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    rt[n] = new ge(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    rt[n] = new ge(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    rt[n] = new ge(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    rt[n] = new ge(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    rt[n] = new ge(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    rt[n] = new ge(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var $r = /[\-:]([a-z])/g;
  function Cr(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      $r,
      Cr
    );
    rt[r] = new ge(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace($r, Cr);
    rt[r] = new ge(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace($r, Cr);
    rt[r] = new ge(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    rt[n] = new ge(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), rt.xlinkHref = new ge("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    rt[n] = new ge(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function yn(n, r, l, u) {
    var c = rt.hasOwnProperty(r) ? rt[r] : null;
    (c !== null ? c.type !== 0 : u || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (ae(r, l, c, u) && (l = null), u || c === null ? ee(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, u = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, u ? n.setAttributeNS(u, r, l) : n.setAttribute(r, l))));
  }
  var Te = B.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Ot = Symbol.for("react.element"), _e = Symbol.for("react.portal"), vt = Symbol.for("react.fragment"), Ue = Symbol.for("react.strict_mode"), Er = Symbol.for("react.profiler"), xt = Symbol.for("react.provider"), qt = Symbol.for("react.context"), bt = Symbol.for("react.forward_ref"), at = Symbol.for("react.suspense"), Ae = Symbol.for("react.suspense_list"), kn = Symbol.for("react.memo"), mt = Symbol.for("react.lazy"), Bn = Symbol.for("react.offscreen"), W = Symbol.iterator;
  function ue(n) {
    return n === null || typeof n != "object" ? null : (n = W && n[W] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var Z = Object.assign, Qe;
  function Xe(n) {
    if (Qe === void 0) try {
      throw Error();
    } catch (l) {
      var r = l.stack.trim().match(/\n( *(at )?)/);
      Qe = r && r[1] || "";
    }
    return `
` + Qe + n;
  }
  var xr = !1;
  function Pn(n, r) {
    if (!n || xr) return "";
    xr = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r) if (r = function() {
        throw Error();
      }, Object.defineProperty(r.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(r, []);
        } catch (M) {
          var u = M;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (M) {
          u = M;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (M) {
          u = M;
        }
        n();
      }
    } catch (M) {
      if (M && u && typeof M.stack == "string") {
        for (var c = M.stack.split(`
`), d = u.stack.split(`
`), h = c.length - 1, g = d.length - 1; 1 <= h && 0 <= g && c[h] !== d[g]; ) g--;
        for (; 1 <= h && 0 <= g; h--, g--) if (c[h] !== d[g]) {
          if (h !== 1 || g !== 1)
            do
              if (h--, g--, 0 > g || c[h] !== d[g]) {
                var w = `
` + c[h].replace(" at new ", " at ");
                return n.displayName && w.includes("<anonymous>") && (w = w.replace("<anonymous>", n.displayName)), w;
              }
            while (1 <= h && 0 <= g);
          break;
        }
      }
    } finally {
      xr = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? Xe(n) : "";
  }
  function za(n) {
    switch (n.tag) {
      case 5:
        return Xe(n.type);
      case 16:
        return Xe("Lazy");
      case 13:
        return Xe("Suspense");
      case 19:
        return Xe("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = Pn(n.type, !1), n;
      case 11:
        return n = Pn(n.type.render, !1), n;
      case 1:
        return n = Pn(n.type, !0), n;
      default:
        return "";
    }
  }
  function lr(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case vt:
        return "Fragment";
      case _e:
        return "Portal";
      case Er:
        return "Profiler";
      case Ue:
        return "StrictMode";
      case at:
        return "Suspense";
      case Ae:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case qt:
        return (n.displayName || "Context") + ".Consumer";
      case xt:
        return (n._context.displayName || "Context") + ".Provider";
      case bt:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case kn:
        return r = n.displayName || null, r !== null ? r : lr(n.type) || "Memo";
      case mt:
        r = n._payload, n = n._init;
        try {
          return lr(n(r));
        } catch {
        }
    }
    return null;
  }
  function Oa(n) {
    var r = n.type;
    switch (n.tag) {
      case 24:
        return "Cache";
      case 9:
        return (r.displayName || "Context") + ".Consumer";
      case 10:
        return (r._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return n = r.render, n = n.displayName || n.name || "", r.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return r;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return lr(r);
      case 8:
        return r === Ue ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof r == "function") return r.displayName || r.name || null;
        if (typeof r == "string") return r;
    }
    return null;
  }
  function gn(n) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return n;
      case "object":
        return n;
      default:
        return "";
    }
  }
  function _l(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function Na(n) {
    var r = _l(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), u = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var c = l.get, d = l.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return c.call(this);
      }, set: function(h) {
        u = "" + h, d.call(this, h);
      } }), Object.defineProperty(n, r, { enumerable: l.enumerable }), { getValue: function() {
        return u;
      }, setValue: function(h) {
        u = "" + h;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function Gr(n) {
    n._valueTracker || (n._valueTracker = Na(n));
  }
  function Yn(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var l = r.getValue(), u = "";
    return n && (u = _l(n) ? n.checked ? "true" : "false" : n.value), n = u, n !== l ? (r.setValue(n), !0) : !1;
  }
  function br(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function or(n, r) {
    var l = r.checked;
    return Z({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function Tr(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, u = r.checked != null ? r.checked : r.defaultChecked;
    l = gn(r.value != null ? r.value : l), n._wrapperState = { initialChecked: u, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function Rr(n, r) {
    r = r.checked, r != null && yn(n, "checked", r, !1);
  }
  function Wr(n, r) {
    Rr(n, r);
    var l = gn(r.value), u = r.type;
    if (l != null) u === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (u === "submit" || u === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? Ml(n, r.type, l) : r.hasOwnProperty("defaultValue") && Ml(n, r.type, gn(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function Bo(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var u = r.type;
      if (!(u !== "submit" && u !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function Ml(n, r, l) {
    (r !== "number" || br(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var ji = Array.isArray;
  function ti(n, r, l, u) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++) r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++) c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && u && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + gn(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, u && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function fa(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(k(91));
    return Z({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function Xr(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null) throw Error(k(92));
        if (ji(l)) {
          if (1 < l.length) throw Error(k(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: gn(l) };
  }
  function qr(n, r) {
    var l = gn(r.value), u = gn(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), u != null && (n.defaultValue = "" + u);
  }
  function Ll(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function ur(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Kr(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? ur(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var ni, Po = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, u, c) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, u, c);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for (ni = ni || document.createElement("div"), ni.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = ni.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function ri(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var Y = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, pe = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Y).forEach(function(n) {
    pe.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), Y[r] = Y[n];
    });
  });
  function Me(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || Y.hasOwnProperty(n) && Y[n] ? ("" + r).trim() : r + "px";
  }
  function it(n, r) {
    n = n.style;
    for (var l in r) if (r.hasOwnProperty(l)) {
      var u = l.indexOf("--") === 0, c = Me(l, r[l], u);
      l === "float" && (l = "cssFloat"), u ? n.setProperty(l, c) : n[l] = c;
    }
  }
  var Tt = Z({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Sn(n, r) {
    if (r) {
      if (Tt[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(k(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(k(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(k(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(k(62));
    }
  }
  function Nt(n, r) {
    if (n.indexOf("-") === -1) return typeof r.is == "string";
    switch (n) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Qn = null;
  function Ut(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var yt = null, gt = null, zl = null;
  function ys(n) {
    if (n = yu(n)) {
      if (typeof yt != "function") throw Error(k(280));
      var r = n.stateNode;
      r && (r = ja(r), yt(n.stateNode, n.type, r));
    }
  }
  function gs(n) {
    gt ? zl ? zl.push(n) : zl = [n] : gt = n;
  }
  function _p() {
    if (gt) {
      var n = gt, r = zl;
      if (zl = gt = null, ys(n), r) for (n = 0; n < r.length; n++) ys(r[n]);
    }
  }
  function Mp(n, r) {
    return n(r);
  }
  function yf() {
  }
  var Ss = !1;
  function Lp(n, r, l) {
    if (Ss) return n(r, l);
    Ss = !0;
    try {
      return Mp(n, r, l);
    } finally {
      Ss = !1, (gt !== null || zl !== null) && (yf(), _p());
    }
  }
  function Ol(n, r) {
    var l = n.stateNode;
    if (l === null) return null;
    var u = ja(l);
    if (u === null) return null;
    l = u[r];
    e: switch (r) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (u = !u.disabled) || (n = n.type, u = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !u;
        break e;
      default:
        n = !1;
    }
    if (n) return null;
    if (l && typeof l != "function") throw Error(k(231, r, typeof l));
    return l;
  }
  var Yo = !1;
  if (S) try {
    var da = {};
    Object.defineProperty(da, "passive", { get: function() {
      Yo = !0;
    } }), window.addEventListener("test", da, da), window.removeEventListener("test", da, da);
  } catch {
    Yo = !1;
  }
  function Vi(n, r, l, u, c, d, h, g, w) {
    var M = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, M);
    } catch (H) {
      this.onError(H);
    }
  }
  var pa = !1, Nl = null, Ul = !1, Qo = null, gf = { onError: function(n) {
    pa = !0, Nl = n;
  } };
  function Al(n, r, l, u, c, d, h, g, w) {
    pa = !1, Nl = null, Vi.apply(gf, arguments);
  }
  function ws(n, r, l, u, c, d, h, g, w) {
    if (Al.apply(this, arguments), pa) {
      if (pa) {
        var M = Nl;
        pa = !1, Nl = null;
      } else throw Error(k(198));
      Ul || (Ul = !0, Qo = M);
    }
  }
  function va(n) {
    var r = n, l = n;
    if (n.alternate) for (; r.return; ) r = r.return;
    else {
      n = r;
      do
        r = n, r.flags & 4098 && (l = r.return), n = r.return;
      while (n);
    }
    return r.tag === 3 ? l : null;
  }
  function Hl(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function wn(n) {
    if (va(n) !== n) throw Error(k(188));
  }
  function Bm(n) {
    var r = n.alternate;
    if (!r) {
      if (r = va(n), r === null) throw Error(k(188));
      return r !== n ? null : n;
    }
    for (var l = n, u = r; ; ) {
      var c = l.return;
      if (c === null) break;
      var d = c.alternate;
      if (d === null) {
        if (u = c.return, u !== null) {
          l = u;
          continue;
        }
        break;
      }
      if (c.child === d.child) {
        for (d = c.child; d; ) {
          if (d === l) return wn(c), n;
          if (d === u) return wn(c), r;
          d = d.sibling;
        }
        throw Error(k(188));
      }
      if (l.return !== u.return) l = c, u = d;
      else {
        for (var h = !1, g = c.child; g; ) {
          if (g === l) {
            h = !0, l = c, u = d;
            break;
          }
          if (g === u) {
            h = !0, u = c, l = d;
            break;
          }
          g = g.sibling;
        }
        if (!h) {
          for (g = d.child; g; ) {
            if (g === l) {
              h = !0, l = d, u = c;
              break;
            }
            if (g === u) {
              h = !0, u = d, l = c;
              break;
            }
            g = g.sibling;
          }
          if (!h) throw Error(k(189));
        }
      }
      if (l.alternate !== u) throw Error(k(190));
    }
    if (l.tag !== 3) throw Error(k(188));
    return l.stateNode.current === l ? n : r;
  }
  function zp(n) {
    return n = Bm(n), n !== null ? Sf(n) : null;
  }
  function Sf(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = Sf(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var Op = he.unstable_scheduleCallback, Np = he.unstable_cancelCallback, Pm = he.unstable_shouldYield, Up = he.unstable_requestPaint, Rt = he.unstable_now, Bi = he.unstable_getCurrentPriorityLevel, Le = he.unstable_ImmediatePriority, Fl = he.unstable_UserBlockingPriority, Io = he.unstable_NormalPriority, Ap = he.unstable_LowPriority, wf = he.unstable_IdlePriority, $o = null, Zr = null;
  function Hp(n) {
    if (Zr && typeof Zr.onCommitFiberRoot == "function") try {
      Zr.onCommitFiberRoot($o, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var kr = Math.clz32 ? Math.clz32 : Qm, Fp = Math.log, Ym = Math.LN2;
  function Qm(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (Fp(n) / Ym | 0) | 0;
  }
  var jl = 64, Vl = 4194304;
  function Dr(n) {
    switch (n & -n) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return n & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return n;
    }
  }
  function Bl(n, r) {
    var l = n.pendingLanes;
    if (l === 0) return 0;
    var u = 0, c = n.suspendedLanes, d = n.pingedLanes, h = l & 268435455;
    if (h !== 0) {
      var g = h & ~c;
      g !== 0 ? u = Dr(g) : (d &= h, d !== 0 && (u = Dr(d)));
    } else h = l & ~c, h !== 0 ? u = Dr(h) : d !== 0 && (u = Dr(d));
    if (u === 0) return 0;
    if (r !== 0 && r !== u && !(r & c) && (c = u & -u, d = r & -r, c >= d || c === 16 && (d & 4194240) !== 0)) return r;
    if (u & 4 && (u |= l & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= u; 0 < r; ) l = 31 - kr(r), c = 1 << l, u |= n[l], r &= ~c;
    return u;
  }
  function Cs(n, r) {
    switch (n) {
      case 1:
      case 2:
      case 4:
        return r + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return r + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Im(n, r) {
    for (var l = n.suspendedLanes, u = n.pingedLanes, c = n.expirationTimes, d = n.pendingLanes; 0 < d; ) {
      var h = 31 - kr(d), g = 1 << h, w = c[h];
      w === -1 ? (!(g & l) || g & u) && (c[h] = Cs(g, r)) : w <= r && (n.expiredLanes |= g), d &= ~g;
    }
  }
  function Go(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function jp() {
    var n = jl;
    return jl <<= 1, !(jl & 4194240) && (jl = 64), n;
  }
  function Wo(n) {
    for (var r = [], l = 0; 31 > l; l++) r.push(n);
    return r;
  }
  function Xo(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - kr(r), n[r] = l;
  }
  function Cf(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var u = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - kr(l), d = 1 << c;
      r[c] = 0, u[c] = -1, n[c] = -1, l &= ~d;
    }
  }
  function Ef(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var u = 31 - kr(l), c = 1 << u;
      c & r | n[u] & r && (n[u] |= r), l &= ~c;
    }
  }
  var Ie = 0;
  function Vp(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var xf, $e, Bp, bf, Ee, Es = !1, Cn = [], _r = null, Mr = null, ai = null, Pt = /* @__PURE__ */ new Map(), ut = /* @__PURE__ */ new Map(), ii = [], ha = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function sr(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        _r = null;
        break;
      case "dragenter":
      case "dragleave":
        Mr = null;
        break;
      case "mouseover":
      case "mouseout":
        ai = null;
        break;
      case "pointerover":
      case "pointerout":
        Pt.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ut.delete(r.pointerId);
    }
  }
  function Lr(n, r, l, u, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: u, nativeEvent: d, targetContainers: [c] }, r !== null && (r = yu(r), r !== null && $e(r)), n) : (n.eventSystemFlags |= u, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function $m(n, r, l, u, c) {
    switch (r) {
      case "focusin":
        return _r = Lr(_r, n, r, l, u, c), !0;
      case "dragenter":
        return Mr = Lr(Mr, n, r, l, u, c), !0;
      case "mouseover":
        return ai = Lr(ai, n, r, l, u, c), !0;
      case "pointerover":
        var d = c.pointerId;
        return Pt.set(d, Lr(Pt.get(d) || null, n, r, l, u, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, ut.set(d, Lr(ut.get(d) || null, n, r, l, u, c)), !0;
    }
    return !1;
  }
  function xs(n) {
    var r = Gi(n.target);
    if (r !== null) {
      var l = va(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = Hl(l), r !== null) {
            n.blockedOn = r, Ee(n.priority, function() {
              Bp(l);
            });
            return;
          }
        } else if (r === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          n.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    n.blockedOn = null;
  }
  function qo(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = Rs(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var u = new l.constructor(l.type, l);
        Qn = u, l.target.dispatchEvent(u), Qn = null;
      } else return r = yu(l), r !== null && $e(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function Tf(n, r, l) {
    qo(n) && l.delete(r);
  }
  function Gm() {
    Es = !1, _r !== null && qo(_r) && (_r = null), Mr !== null && qo(Mr) && (Mr = null), ai !== null && qo(ai) && (ai = null), Pt.forEach(Tf), ut.forEach(Tf);
  }
  function Ko(n, r) {
    n.blockedOn === r && (n.blockedOn = null, Es || (Es = !0, he.unstable_scheduleCallback(he.unstable_NormalPriority, Gm)));
  }
  function Zo(n) {
    function r(c) {
      return Ko(c, n);
    }
    if (0 < Cn.length) {
      Ko(Cn[0], n);
      for (var l = 1; l < Cn.length; l++) {
        var u = Cn[l];
        u.blockedOn === n && (u.blockedOn = null);
      }
    }
    for (_r !== null && Ko(_r, n), Mr !== null && Ko(Mr, n), ai !== null && Ko(ai, n), Pt.forEach(r), ut.forEach(r), l = 0; l < ii.length; l++) u = ii[l], u.blockedOn === n && (u.blockedOn = null);
    for (; 0 < ii.length && (l = ii[0], l.blockedOn === null); ) xs(l), l.blockedOn === null && ii.shift();
  }
  var Ua = Te.ReactCurrentBatchConfig, Jo = !0;
  function bs(n, r, l, u) {
    var c = Ie, d = Ua.transition;
    Ua.transition = null;
    try {
      Ie = 1, Ts(n, r, l, u);
    } finally {
      Ie = c, Ua.transition = d;
    }
  }
  function Pp(n, r, l, u) {
    var c = Ie, d = Ua.transition;
    Ua.transition = null;
    try {
      Ie = 4, Ts(n, r, l, u);
    } finally {
      Ie = c, Ua.transition = d;
    }
  }
  function Ts(n, r, l, u) {
    if (Jo) {
      var c = Rs(n, r, l, u);
      if (c === null) Vf(n, r, u, eu, l), sr(n, u);
      else if ($m(c, n, r, l, u)) u.stopPropagation();
      else if (sr(n, u), r & 4 && -1 < ha.indexOf(n)) {
        for (; c !== null; ) {
          var d = yu(c);
          if (d !== null && xf(d), d = Rs(n, r, l, u), d === null && Vf(n, r, u, eu, l), d === c) break;
          c = d;
        }
        c !== null && u.stopPropagation();
      } else Vf(n, r, u, null, l);
    }
  }
  var eu = null;
  function Rs(n, r, l, u) {
    if (eu = null, n = Ut(u), n = Gi(n), n !== null) if (r = va(n), r === null) n = null;
    else if (l = r.tag, l === 13) {
      if (n = Hl(r), n !== null) return n;
      n = null;
    } else if (l === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return eu = n, null;
  }
  function Rf(n) {
    switch (n) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (Bi()) {
          case Le:
            return 1;
          case Fl:
            return 4;
          case Io:
          case Ap:
            return 16;
          case wf:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var ma = null, ks = null, tu = null;
  function Ds() {
    if (tu) return tu;
    var n, r = ks, l = r.length, u, c = "value" in ma ? ma.value : ma.textContent, d = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++) ;
    var h = l - n;
    for (u = 1; u <= h && r[l - u] === c[d - u]; u++) ;
    return tu = c.slice(n, 1 < u ? 1 - u : void 0);
  }
  function nu(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function _s() {
    return !0;
  }
  function Yp() {
    return !1;
  }
  function Dn(n) {
    function r(l, u, c, d, h) {
      this._reactName = l, this._targetInst = c, this.type = u, this.nativeEvent = d, this.target = h, this.currentTarget = null;
      for (var g in n) n.hasOwnProperty(g) && (l = n[g], this[g] = l ? l(d) : d[g]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? _s : Yp, this.isPropagationStopped = Yp, this;
    }
    return Z(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = _s);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = _s);
    }, persist: function() {
    }, isPersistent: _s }), r;
  }
  var Pi = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Ms = Dn(Pi), Pl = Z({}, Pi, { view: 0, detail: 0 }), Qp = Dn(Pl), kf, Df, Yt, Yl = Z({}, Pl, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Jr, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Yt && (Yt && n.type === "mousemove" ? (kf = n.screenX - Yt.screenX, Df = n.screenY - Yt.screenY) : Df = kf = 0, Yt = n), kf);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : Df;
  } }), _f = Dn(Yl), Ip = Z({}, Yl, { dataTransfer: 0 }), Wm = Dn(Ip), Ql = Z({}, Pl, { relatedTarget: 0 }), ru = Dn(Ql), $p = Z({}, Pi, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Xm = Dn($p), qm = Z({}, Pi, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), Km = Dn(qm), Gp = Z({}, Pi, { data: 0 }), Ls = Dn(Gp), Wp = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Xp = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, qp = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Zm(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = qp[n]) ? !!r[n] : !1;
  }
  function Jr() {
    return Zm;
  }
  var Jm = Z({}, Pl, { key: function(n) {
    if (n.key) {
      var r = Wp[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = nu(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? Xp[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Jr, charCode: function(n) {
    return n.type === "keypress" ? nu(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? nu(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), Mf = Dn(Jm), Lf = Z({}, Yl, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), zs = Dn(Lf), ey = Z({}, Pl, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Jr }), Os = Dn(ey), Kp = Z({}, Pi, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), In = Dn(Kp), Aa = Z({}, Yl, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), At = Dn(Aa), Ha = [9, 13, 27, 32], au = S && "CompositionEvent" in window, li = null;
  S && "documentMode" in document && (li = document.documentMode);
  var ty = S && "TextEvent" in window && !li, Il = S && (!au || li && 8 < li && 11 >= li), Zp = " ", Jp = !1;
  function Ns(n, r) {
    switch (n) {
      case "keyup":
        return Ha.indexOf(r.keyCode) !== -1;
      case "keydown":
        return r.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function ev(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var $l = !1;
  function ny(n, r) {
    switch (n) {
      case "compositionend":
        return ev(r);
      case "keypress":
        return r.which !== 32 ? null : (Jp = !0, Zp);
      case "textInput":
        return n = r.data, n === Zp && Jp ? null : n;
      default:
        return null;
    }
  }
  function tv(n, r) {
    if ($l) return n === "compositionend" || !au && Ns(n, r) ? (n = Ds(), tu = ks = ma = null, $l = !1, n) : null;
    switch (n) {
      case "paste":
        return null;
      case "keypress":
        if (!(r.ctrlKey || r.altKey || r.metaKey) || r.ctrlKey && r.altKey) {
          if (r.char && 1 < r.char.length) return r.char;
          if (r.which) return String.fromCharCode(r.which);
        }
        return null;
      case "compositionend":
        return Il && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var ry = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function nv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!ry[n.type] : r === "textarea";
  }
  function rv(n, r, l, u) {
    gs(u), r = vu(r, "onChange"), 0 < r.length && (l = new Ms("onChange", "change", null, l, u), n.push({ event: l, listeners: r }));
  }
  var Gl = null, ya = null;
  function zf(n) {
    Fs(n, 0);
  }
  function iu(n) {
    var r = le(n);
    if (Yn(r)) return n;
  }
  function av(n, r) {
    if (n === "change") return r;
  }
  var iv = !1;
  if (S) {
    var Of;
    if (S) {
      var Nf = "oninput" in document;
      if (!Nf) {
        var lv = document.createElement("div");
        lv.setAttribute("oninput", "return;"), Nf = typeof lv.oninput == "function";
      }
      Of = Nf;
    } else Of = !1;
    iv = Of && (!document.documentMode || 9 < document.documentMode);
  }
  function ov() {
    Gl && (Gl.detachEvent("onpropertychange", uv), ya = Gl = null);
  }
  function uv(n) {
    if (n.propertyName === "value" && iu(ya)) {
      var r = [];
      rv(r, ya, n, Ut(n)), Lp(zf, r);
    }
  }
  function ay(n, r, l) {
    n === "focusin" ? (ov(), Gl = r, ya = l, Gl.attachEvent("onpropertychange", uv)) : n === "focusout" && ov();
  }
  function iy(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return iu(ya);
  }
  function sv(n, r) {
    if (n === "click") return iu(r);
  }
  function ly(n, r) {
    if (n === "input" || n === "change") return iu(r);
  }
  function cv(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ea = typeof Object.is == "function" ? Object.is : cv;
  function lu(n, r) {
    if (ea(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var l = Object.keys(n), u = Object.keys(r);
    if (l.length !== u.length) return !1;
    for (u = 0; u < l.length; u++) {
      var c = l[u];
      if (!nn.call(r, c) || !ea(n[c], r[c])) return !1;
    }
    return !0;
  }
  function fv(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function dv(n, r) {
    var l = fv(n);
    n = 0;
    for (var u; l; ) {
      if (l.nodeType === 3) {
        if (u = n + l.textContent.length, n <= r && u >= r) return { node: l, offset: r - n };
        n = u;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = fv(l);
    }
  }
  function Us(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? Us(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function oi() {
    for (var n = window, r = br(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) n = r.contentWindow;
      else break;
      r = br(n.document);
    }
    return r;
  }
  function Wl(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function pv(n) {
    var r = oi(), l = n.focusedElem, u = n.selectionRange;
    if (r !== l && l && l.ownerDocument && Us(l.ownerDocument.documentElement, l)) {
      if (u !== null && Wl(l)) {
        if (r = u.start, n = u.end, n === void 0 && (n = r), "selectionStart" in l) l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var c = l.textContent.length, d = Math.min(u.start, c);
          u = u.end === void 0 ? d : Math.min(u.end, c), !n.extend && d > u && (c = u, u = d, d = c), c = dv(l, d);
          var h = dv(
            l,
            u
          );
          c && h && (n.rangeCount !== 1 || n.anchorNode !== c.node || n.anchorOffset !== c.offset || n.focusNode !== h.node || n.focusOffset !== h.offset) && (r = r.createRange(), r.setStart(c.node, c.offset), n.removeAllRanges(), d > u ? (n.addRange(r), n.extend(h.node, h.offset)) : (r.setEnd(h.node, h.offset), n.addRange(r)));
        }
      }
      for (r = [], n = l; n = n.parentNode; ) n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof l.focus == "function" && l.focus(), l = 0; l < r.length; l++) n = r[l], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var Xl = S && "documentMode" in document && 11 >= document.documentMode, ql = null, Uf = null, ou = null, Af = !1;
  function vv(n, r, l) {
    var u = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Af || ql == null || ql !== br(u) || (u = ql, "selectionStart" in u && Wl(u) ? u = { start: u.selectionStart, end: u.selectionEnd } : (u = (u.ownerDocument && u.ownerDocument.defaultView || window).getSelection(), u = { anchorNode: u.anchorNode, anchorOffset: u.anchorOffset, focusNode: u.focusNode, focusOffset: u.focusOffset }), ou && lu(ou, u) || (ou = u, u = vu(Uf, "onSelect"), 0 < u.length && (r = new Ms("onSelect", "select", null, r, l), n.push({ event: r, listeners: u }), r.target = ql)));
  }
  function uu(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var Kl = { animationend: uu("Animation", "AnimationEnd"), animationiteration: uu("Animation", "AnimationIteration"), animationstart: uu("Animation", "AnimationStart"), transitionend: uu("Transition", "TransitionEnd") }, As = {}, En = {};
  S && (En = document.createElement("div").style, "AnimationEvent" in window || (delete Kl.animationend.animation, delete Kl.animationiteration.animation, delete Kl.animationstart.animation), "TransitionEvent" in window || delete Kl.transitionend.transition);
  function su(n) {
    if (As[n]) return As[n];
    if (!Kl[n]) return n;
    var r = Kl[n], l;
    for (l in r) if (r.hasOwnProperty(l) && l in En) return As[n] = r[l];
    return n;
  }
  var hv = su("animationend"), mv = su("animationiteration"), yv = su("animationstart"), gv = su("transitionend"), Sv = /* @__PURE__ */ new Map(), Hf = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function ga(n, r) {
    Sv.set(n, r), Et(r, [n]);
  }
  for (var Yi = 0; Yi < Hf.length; Yi++) {
    var Ff = Hf[Yi], cu = Ff.toLowerCase(), oy = Ff[0].toUpperCase() + Ff.slice(1);
    ga(cu, "on" + oy);
  }
  ga(hv, "onAnimationEnd"), ga(mv, "onAnimationIteration"), ga(yv, "onAnimationStart"), ga("dblclick", "onDoubleClick"), ga("focusin", "onFocus"), ga("focusout", "onBlur"), ga(gv, "onTransitionEnd"), zt("onMouseEnter", ["mouseout", "mouseover"]), zt("onMouseLeave", ["mouseout", "mouseover"]), zt("onPointerEnter", ["pointerout", "pointerover"]), zt("onPointerLeave", ["pointerout", "pointerover"]), Et("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Et("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Et("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), Et("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Et("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Et("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var fu = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), uy = new Set("cancel close invalid load scroll toggle".split(" ").concat(fu));
  function Hs(n, r, l) {
    var u = n.type || "unknown-event";
    n.currentTarget = l, ws(u, r, void 0, n), n.currentTarget = null;
  }
  function Fs(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var u = n[l], c = u.event;
      u = u.listeners;
      e: {
        var d = void 0;
        if (r) for (var h = u.length - 1; 0 <= h; h--) {
          var g = u[h], w = g.instance, M = g.currentTarget;
          if (g = g.listener, w !== d && c.isPropagationStopped()) break e;
          Hs(c, g, M), d = w;
        }
        else for (h = 0; h < u.length; h++) {
          if (g = u[h], w = g.instance, M = g.currentTarget, g = g.listener, w !== d && c.isPropagationStopped()) break e;
          Hs(c, g, M), d = w;
        }
      }
    }
    if (Ul) throw n = Qo, Ul = !1, Qo = null, n;
  }
  function Ge(n, r) {
    var l = r[Bf];
    l === void 0 && (l = r[Bf] = /* @__PURE__ */ new Set());
    var u = n + "__bubble";
    l.has(u) || (jf(r, n, 2, !1), l.add(u));
  }
  function ui(n, r, l) {
    var u = 0;
    r && (u |= 4), jf(l, n, u, r);
  }
  var du = "_reactListening" + Math.random().toString(36).slice(2);
  function pu(n) {
    if (!n[du]) {
      n[du] = !0, ke.forEach(function(l) {
        l !== "selectionchange" && (uy.has(l) || ui(l, !1, n), ui(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[du] || (r[du] = !0, ui("selectionchange", !1, r));
    }
  }
  function jf(n, r, l, u) {
    switch (Rf(r)) {
      case 1:
        var c = bs;
        break;
      case 4:
        c = Pp;
        break;
      default:
        c = Ts;
    }
    l = c.bind(null, r, l, n), c = void 0, !Yo || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), u ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
  }
  function Vf(n, r, l, u, c) {
    var d = u;
    if (!(r & 1) && !(r & 2) && u !== null) e: for (; ; ) {
      if (u === null) return;
      var h = u.tag;
      if (h === 3 || h === 4) {
        var g = u.stateNode.containerInfo;
        if (g === c || g.nodeType === 8 && g.parentNode === c) break;
        if (h === 4) for (h = u.return; h !== null; ) {
          var w = h.tag;
          if ((w === 3 || w === 4) && (w = h.stateNode.containerInfo, w === c || w.nodeType === 8 && w.parentNode === c)) return;
          h = h.return;
        }
        for (; g !== null; ) {
          if (h = Gi(g), h === null) return;
          if (w = h.tag, w === 5 || w === 6) {
            u = d = h;
            continue e;
          }
          g = g.parentNode;
        }
      }
      u = u.return;
    }
    Lp(function() {
      var M = d, H = Ut(l), F = [];
      e: {
        var A = Sv.get(n);
        if (A !== void 0) {
          var X = Ms, te = n;
          switch (n) {
            case "keypress":
              if (nu(l) === 0) break e;
            case "keydown":
            case "keyup":
              X = Mf;
              break;
            case "focusin":
              te = "focus", X = ru;
              break;
            case "focusout":
              te = "blur", X = ru;
              break;
            case "beforeblur":
            case "afterblur":
              X = ru;
              break;
            case "click":
              if (l.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              X = _f;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              X = Wm;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              X = Os;
              break;
            case hv:
            case mv:
            case yv:
              X = Xm;
              break;
            case gv:
              X = In;
              break;
            case "scroll":
              X = Qp;
              break;
            case "wheel":
              X = At;
              break;
            case "copy":
            case "cut":
            case "paste":
              X = Km;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              X = zs;
          }
          var re = (r & 4) !== 0, Mt = !re && n === "scroll", b = re ? A !== null ? A + "Capture" : null : A;
          re = [];
          for (var E = M, D; E !== null; ) {
            D = E;
            var V = D.stateNode;
            if (D.tag === 5 && V !== null && (D = V, b !== null && (V = Ol(E, b), V != null && re.push(Zl(E, V, D)))), Mt) break;
            E = E.return;
          }
          0 < re.length && (A = new X(A, te, null, l, H), F.push({ event: A, listeners: re }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (A = n === "mouseover" || n === "pointerover", X = n === "mouseout" || n === "pointerout", A && l !== Qn && (te = l.relatedTarget || l.fromElement) && (Gi(te) || te[Fa])) break e;
          if ((X || A) && (A = H.window === H ? H : (A = H.ownerDocument) ? A.defaultView || A.parentWindow : window, X ? (te = l.relatedTarget || l.toElement, X = M, te = te ? Gi(te) : null, te !== null && (Mt = va(te), te !== Mt || te.tag !== 5 && te.tag !== 6) && (te = null)) : (X = null, te = M), X !== te)) {
            if (re = _f, V = "onMouseLeave", b = "onMouseEnter", E = "mouse", (n === "pointerout" || n === "pointerover") && (re = zs, V = "onPointerLeave", b = "onPointerEnter", E = "pointer"), Mt = X == null ? A : le(X), D = te == null ? A : le(te), A = new re(V, E + "leave", X, l, H), A.target = Mt, A.relatedTarget = D, V = null, Gi(H) === M && (re = new re(b, E + "enter", te, l, H), re.target = D, re.relatedTarget = Mt, V = re), Mt = V, X && te) t: {
              for (re = X, b = te, E = 0, D = re; D; D = Qi(D)) E++;
              for (D = 0, V = b; V; V = Qi(V)) D++;
              for (; 0 < E - D; ) re = Qi(re), E--;
              for (; 0 < D - E; ) b = Qi(b), D--;
              for (; E--; ) {
                if (re === b || b !== null && re === b.alternate) break t;
                re = Qi(re), b = Qi(b);
              }
              re = null;
            }
            else re = null;
            X !== null && js(F, A, X, re, !1), te !== null && Mt !== null && js(F, Mt, te, re, !0);
          }
        }
        e: {
          if (A = M ? le(M) : window, X = A.nodeName && A.nodeName.toLowerCase(), X === "select" || X === "input" && A.type === "file") var $ = av;
          else if (nv(A)) if (iv) $ = ly;
          else {
            $ = iy;
            var se = ay;
          }
          else (X = A.nodeName) && X.toLowerCase() === "input" && (A.type === "checkbox" || A.type === "radio") && ($ = sv);
          if ($ && ($ = $(n, M))) {
            rv(F, $, l, H);
            break e;
          }
          se && se(n, A, M), n === "focusout" && (se = A._wrapperState) && se.controlled && A.type === "number" && Ml(A, "number", A.value);
        }
        switch (se = M ? le(M) : window, n) {
          case "focusin":
            (nv(se) || se.contentEditable === "true") && (ql = se, Uf = M, ou = null);
            break;
          case "focusout":
            ou = Uf = ql = null;
            break;
          case "mousedown":
            Af = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Af = !1, vv(F, l, H);
            break;
          case "selectionchange":
            if (Xl) break;
          case "keydown":
          case "keyup":
            vv(F, l, H);
        }
        var fe;
        if (au) e: {
          switch (n) {
            case "compositionstart":
              var ye = "onCompositionStart";
              break e;
            case "compositionend":
              ye = "onCompositionEnd";
              break e;
            case "compositionupdate":
              ye = "onCompositionUpdate";
              break e;
          }
          ye = void 0;
        }
        else $l ? Ns(n, l) && (ye = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (ye = "onCompositionStart");
        ye && (Il && l.locale !== "ko" && ($l || ye !== "onCompositionStart" ? ye === "onCompositionEnd" && $l && (fe = Ds()) : (ma = H, ks = "value" in ma ? ma.value : ma.textContent, $l = !0)), se = vu(M, ye), 0 < se.length && (ye = new Ls(ye, n, null, l, H), F.push({ event: ye, listeners: se }), fe ? ye.data = fe : (fe = ev(l), fe !== null && (ye.data = fe)))), (fe = ty ? ny(n, l) : tv(n, l)) && (M = vu(M, "onBeforeInput"), 0 < M.length && (H = new Ls("onBeforeInput", "beforeinput", null, l, H), F.push({ event: H, listeners: M }), H.data = fe));
      }
      Fs(F, r);
    });
  }
  function Zl(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function vu(n, r) {
    for (var l = r + "Capture", u = []; n !== null; ) {
      var c = n, d = c.stateNode;
      c.tag === 5 && d !== null && (c = d, d = Ol(n, l), d != null && u.unshift(Zl(n, d, c)), d = Ol(n, r), d != null && u.push(Zl(n, d, c))), n = n.return;
    }
    return u;
  }
  function Qi(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function js(n, r, l, u, c) {
    for (var d = r._reactName, h = []; l !== null && l !== u; ) {
      var g = l, w = g.alternate, M = g.stateNode;
      if (w !== null && w === u) break;
      g.tag === 5 && M !== null && (g = M, c ? (w = Ol(l, d), w != null && h.unshift(Zl(l, w, g))) : c || (w = Ol(l, d), w != null && h.push(Zl(l, w, g)))), l = l.return;
    }
    h.length !== 0 && n.push({ event: r, listeners: h });
  }
  var sy = /\r\n?/g, wv = /\u0000|\uFFFD/g;
  function Cv(n) {
    return (typeof n == "string" ? n : "" + n).replace(sy, `
`).replace(wv, "");
  }
  function Vs(n, r, l) {
    if (r = Cv(r), Cv(n) !== r && l) throw Error(k(425));
  }
  function Bs() {
  }
  var Ii = null, hu = null;
  function $i(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var Ps = typeof setTimeout == "function" ? setTimeout : void 0, Ev = typeof clearTimeout == "function" ? clearTimeout : void 0, Ys = typeof Promise == "function" ? Promise : void 0, cy = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ys < "u" ? function(n) {
    return Ys.resolve(null).then(n).catch(Jl);
  } : Ps;
  function Jl(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function eo(n, r) {
    var l = r, u = 0;
    do {
      var c = l.nextSibling;
      if (n.removeChild(l), c && c.nodeType === 8) if (l = c.data, l === "/$") {
        if (u === 0) {
          n.removeChild(c), Zo(r);
          return;
        }
        u--;
      } else l !== "$" && l !== "$?" && l !== "$!" || u++;
      l = c;
    } while (l);
    Zo(r);
  }
  function ta(n) {
    for (; n != null; n = n.nextSibling) {
      var r = n.nodeType;
      if (r === 1 || r === 3) break;
      if (r === 8) {
        if (r = n.data, r === "$" || r === "$!" || r === "$?") break;
        if (r === "/$") return null;
      }
    }
    return n;
  }
  function Qs(n) {
    n = n.previousSibling;
    for (var r = 0; n; ) {
      if (n.nodeType === 8) {
        var l = n.data;
        if (l === "$" || l === "$!" || l === "$?") {
          if (r === 0) return n;
          r--;
        } else l === "/$" && r++;
      }
      n = n.previousSibling;
    }
    return null;
  }
  var to = Math.random().toString(36).slice(2), zr = "__reactFiber$" + to, mu = "__reactProps$" + to, Fa = "__reactContainer$" + to, Bf = "__reactEvents$" + to, Pf = "__reactListeners$" + to, no = "__reactHandles$" + to;
  function Gi(n) {
    var r = n[zr];
    if (r) return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[Fa] || l[zr]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null) for (n = Qs(n); n !== null; ) {
          if (l = n[zr]) return l;
          n = Qs(n);
        }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function yu(n) {
    return n = n[zr] || n[Fa], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function le(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(k(33));
  }
  function ja(n) {
    return n[mu] || null;
  }
  var St = [], ze = -1;
  function $n(n) {
    return { current: n };
  }
  function qe(n) {
    0 > ze || (n.current = St[ze], St[ze] = null, ze--);
  }
  function lt(n, r) {
    ze++, St[ze] = n.current, n.current = r;
  }
  var Re = {}, ft = $n(Re), Ht = $n(!1), Or = Re;
  function cr(n, r) {
    var l = n.type.contextTypes;
    if (!l) return Re;
    var u = n.stateNode;
    if (u && u.__reactInternalMemoizedUnmaskedChildContext === r) return u.__reactInternalMemoizedMaskedChildContext;
    var c = {}, d;
    for (d in l) c[d] = r[d];
    return u && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function wt(n) {
    return n = n.childContextTypes, n != null;
  }
  function Sa() {
    qe(Ht), qe(ft);
  }
  function Is(n, r, l) {
    if (ft.current !== Re) throw Error(k(168));
    lt(ft, r), lt(Ht, l);
  }
  function xv(n, r, l) {
    var u = n.stateNode;
    if (r = r.childContextTypes, typeof u.getChildContext != "function") return l;
    u = u.getChildContext();
    for (var c in u) if (!(c in r)) throw Error(k(108, Oa(n) || "Unknown", c));
    return Z({}, l, u);
  }
  function Wi(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Re, Or = ft.current, lt(ft, n), lt(Ht, Ht.current), !0;
  }
  function xn(n, r, l) {
    var u = n.stateNode;
    if (!u) throw Error(k(169));
    l ? (n = xv(n, r, Or), u.__reactInternalMemoizedMergedChildContext = n, qe(Ht), qe(ft), lt(ft, n)) : qe(Ht), lt(Ht, l);
  }
  var na = null, gu = !1, Su = !1;
  function si(n) {
    na === null ? na = [n] : na.push(n);
  }
  function Yf(n) {
    gu = !0, si(n);
  }
  function _n() {
    if (!Su && na !== null) {
      Su = !0;
      var n = 0, r = Ie;
      try {
        var l = na;
        for (Ie = 1; n < l.length; n++) {
          var u = l[n];
          do
            u = u(!0);
          while (u !== null);
        }
        na = null, gu = !1;
      } catch (c) {
        throw na !== null && (na = na.slice(n + 1)), Op(Le, _n), c;
      } finally {
        Ie = r, Su = !1;
      }
    }
    return null;
  }
  var ci = [], fi = 0, ro = null, di = 0, rn = [], Ft = 0, Xi = null, Mn = 1, wa = "";
  function pi(n, r) {
    ci[fi++] = di, ci[fi++] = ro, ro = n, di = r;
  }
  function bv(n, r, l) {
    rn[Ft++] = Mn, rn[Ft++] = wa, rn[Ft++] = Xi, Xi = n;
    var u = Mn;
    n = wa;
    var c = 32 - kr(u) - 1;
    u &= ~(1 << c), l += 1;
    var d = 32 - kr(r) + c;
    if (30 < d) {
      var h = c - c % 5;
      d = (u & (1 << h) - 1).toString(32), u >>= h, c -= h, Mn = 1 << 32 - kr(r) + c | l << c | u, wa = d + n;
    } else Mn = 1 << d | l << c | u, wa = n;
  }
  function Qf(n) {
    n.return !== null && (pi(n, 1), bv(n, 1, 0));
  }
  function $s(n) {
    for (; n === ro; ) ro = ci[--fi], ci[fi] = null, di = ci[--fi], ci[fi] = null;
    for (; n === Xi; ) Xi = rn[--Ft], rn[Ft] = null, wa = rn[--Ft], rn[Ft] = null, Mn = rn[--Ft], rn[Ft] = null;
  }
  var Gn = null, Wn = null, st = !1, ra = null;
  function If(n, r) {
    var l = Fr(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function $f(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, Gn = n, Wn = ta(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, Gn = n, Wn = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = Xi !== null ? { id: Mn, overflow: wa } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = Fr(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, Gn = n, Wn = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Gf(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function Wf(n) {
    if (st) {
      var r = Wn;
      if (r) {
        var l = r;
        if (!$f(n, r)) {
          if (Gf(n)) throw Error(k(418));
          r = ta(l.nextSibling);
          var u = Gn;
          r && $f(n, r) ? If(u, l) : (n.flags = n.flags & -4097 | 2, st = !1, Gn = n);
        }
      } else {
        if (Gf(n)) throw Error(k(418));
        n.flags = n.flags & -4097 | 2, st = !1, Gn = n;
      }
    }
  }
  function Tv(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    Gn = n;
  }
  function kt(n) {
    if (n !== Gn) return !1;
    if (!st) return Tv(n), st = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !$i(n.type, n.memoizedProps)), r && (r = Wn)) {
      if (Gf(n)) throw Rv(), Error(k(418));
      for (; r; ) If(n, r), r = ta(r.nextSibling);
    }
    if (Tv(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(k(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                Wn = ta(n.nextSibling);
                break e;
              }
              r--;
            } else l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        Wn = null;
      }
    } else Wn = Gn ? ta(n.stateNode.nextSibling) : null;
    return !0;
  }
  function Rv() {
    for (var n = Wn; n; ) n = ta(n.nextSibling);
  }
  function Va() {
    Wn = Gn = null, st = !1;
  }
  function wu(n) {
    ra === null ? ra = [n] : ra.push(n);
  }
  var qi = Te.ReactCurrentBatchConfig;
  function Cu(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1) throw Error(k(309));
          var u = l.stateNode;
        }
        if (!u) throw Error(k(147, n));
        var c = u, d = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === d ? r.ref : (r = function(h) {
          var g = c.refs;
          h === null ? delete g[d] : g[d] = h;
        }, r._stringRef = d, r);
      }
      if (typeof n != "string") throw Error(k(284));
      if (!l._owner) throw Error(k(290, n));
    }
    return n;
  }
  function ao(n, r) {
    throw n = Object.prototype.toString.call(r), Error(k(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function kv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function Dv(n) {
    function r(b, E) {
      if (n) {
        var D = b.deletions;
        D === null ? (b.deletions = [E], b.flags |= 16) : D.push(E);
      }
    }
    function l(b, E) {
      if (!n) return null;
      for (; E !== null; ) r(b, E), E = E.sibling;
      return null;
    }
    function u(b, E) {
      for (b = /* @__PURE__ */ new Map(); E !== null; ) E.key !== null ? b.set(E.key, E) : b.set(E.index, E), E = E.sibling;
      return b;
    }
    function c(b, E) {
      return b = bi(b, E), b.index = 0, b.sibling = null, b;
    }
    function d(b, E, D) {
      return b.index = D, n ? (D = b.alternate, D !== null ? (D = D.index, D < E ? (b.flags |= 2, E) : D) : (b.flags |= 2, E)) : (b.flags |= 1048576, E);
    }
    function h(b) {
      return n && b.alternate === null && (b.flags |= 2), b;
    }
    function g(b, E, D, V) {
      return E === null || E.tag !== 6 ? (E = pl(D, b.mode, V), E.return = b, E) : (E = c(E, D), E.return = b, E);
    }
    function w(b, E, D, V) {
      var $ = D.type;
      return $ === vt ? H(b, E, D.props.children, V, D.key) : E !== null && (E.elementType === $ || typeof $ == "object" && $ !== null && $.$$typeof === mt && kv($) === E.type) ? (V = c(E, D.props), V.ref = Cu(b, E, D), V.return = b, V) : (V = Lc(D.type, D.key, D.props, null, b.mode, V), V.ref = Cu(b, E, D), V.return = b, V);
    }
    function M(b, E, D, V) {
      return E === null || E.tag !== 4 || E.stateNode.containerInfo !== D.containerInfo || E.stateNode.implementation !== D.implementation ? (E = Td(D, b.mode, V), E.return = b, E) : (E = c(E, D.children || []), E.return = b, E);
    }
    function H(b, E, D, V, $) {
      return E === null || E.tag !== 7 ? (E = Ti(D, b.mode, V, $), E.return = b, E) : (E = c(E, D), E.return = b, E);
    }
    function F(b, E, D) {
      if (typeof E == "string" && E !== "" || typeof E == "number") return E = pl("" + E, b.mode, D), E.return = b, E;
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case Ot:
            return D = Lc(E.type, E.key, E.props, null, b.mode, D), D.ref = Cu(b, null, E), D.return = b, D;
          case _e:
            return E = Td(E, b.mode, D), E.return = b, E;
          case mt:
            var V = E._init;
            return F(b, V(E._payload), D);
        }
        if (ji(E) || ue(E)) return E = Ti(E, b.mode, D, null), E.return = b, E;
        ao(b, E);
      }
      return null;
    }
    function A(b, E, D, V) {
      var $ = E !== null ? E.key : null;
      if (typeof D == "string" && D !== "" || typeof D == "number") return $ !== null ? null : g(b, E, "" + D, V);
      if (typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case Ot:
            return D.key === $ ? w(b, E, D, V) : null;
          case _e:
            return D.key === $ ? M(b, E, D, V) : null;
          case mt:
            return $ = D._init, A(
              b,
              E,
              $(D._payload),
              V
            );
        }
        if (ji(D) || ue(D)) return $ !== null ? null : H(b, E, D, V, null);
        ao(b, D);
      }
      return null;
    }
    function X(b, E, D, V, $) {
      if (typeof V == "string" && V !== "" || typeof V == "number") return b = b.get(D) || null, g(E, b, "" + V, $);
      if (typeof V == "object" && V !== null) {
        switch (V.$$typeof) {
          case Ot:
            return b = b.get(V.key === null ? D : V.key) || null, w(E, b, V, $);
          case _e:
            return b = b.get(V.key === null ? D : V.key) || null, M(E, b, V, $);
          case mt:
            var se = V._init;
            return X(b, E, D, se(V._payload), $);
        }
        if (ji(V) || ue(V)) return b = b.get(D) || null, H(E, b, V, $, null);
        ao(E, V);
      }
      return null;
    }
    function te(b, E, D, V) {
      for (var $ = null, se = null, fe = E, ye = E = 0, Gt = null; fe !== null && ye < D.length; ye++) {
        fe.index > ye ? (Gt = fe, fe = null) : Gt = fe.sibling;
        var Be = A(b, fe, D[ye], V);
        if (Be === null) {
          fe === null && (fe = Gt);
          break;
        }
        n && fe && Be.alternate === null && r(b, fe), E = d(Be, E, ye), se === null ? $ = Be : se.sibling = Be, se = Be, fe = Gt;
      }
      if (ye === D.length) return l(b, fe), st && pi(b, ye), $;
      if (fe === null) {
        for (; ye < D.length; ye++) fe = F(b, D[ye], V), fe !== null && (E = d(fe, E, ye), se === null ? $ = fe : se.sibling = fe, se = fe);
        return st && pi(b, ye), $;
      }
      for (fe = u(b, fe); ye < D.length; ye++) Gt = X(fe, b, ye, D[ye], V), Gt !== null && (n && Gt.alternate !== null && fe.delete(Gt.key === null ? ye : Gt.key), E = d(Gt, E, ye), se === null ? $ = Gt : se.sibling = Gt, se = Gt);
      return n && fe.forEach(function(ki) {
        return r(b, ki);
      }), st && pi(b, ye), $;
    }
    function re(b, E, D, V) {
      var $ = ue(D);
      if (typeof $ != "function") throw Error(k(150));
      if (D = $.call(D), D == null) throw Error(k(151));
      for (var se = $ = null, fe = E, ye = E = 0, Gt = null, Be = D.next(); fe !== null && !Be.done; ye++, Be = D.next()) {
        fe.index > ye ? (Gt = fe, fe = null) : Gt = fe.sibling;
        var ki = A(b, fe, Be.value, V);
        if (ki === null) {
          fe === null && (fe = Gt);
          break;
        }
        n && fe && ki.alternate === null && r(b, fe), E = d(ki, E, ye), se === null ? $ = ki : se.sibling = ki, se = ki, fe = Gt;
      }
      if (Be.done) return l(
        b,
        fe
      ), st && pi(b, ye), $;
      if (fe === null) {
        for (; !Be.done; ye++, Be = D.next()) Be = F(b, Be.value, V), Be !== null && (E = d(Be, E, ye), se === null ? $ = Be : se.sibling = Be, se = Be);
        return st && pi(b, ye), $;
      }
      for (fe = u(b, fe); !Be.done; ye++, Be = D.next()) Be = X(fe, b, ye, Be.value, V), Be !== null && (n && Be.alternate !== null && fe.delete(Be.key === null ? ye : Be.key), E = d(Be, E, ye), se === null ? $ = Be : se.sibling = Be, se = Be);
      return n && fe.forEach(function(by) {
        return r(b, by);
      }), st && pi(b, ye), $;
    }
    function Mt(b, E, D, V) {
      if (typeof D == "object" && D !== null && D.type === vt && D.key === null && (D = D.props.children), typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case Ot:
            e: {
              for (var $ = D.key, se = E; se !== null; ) {
                if (se.key === $) {
                  if ($ = D.type, $ === vt) {
                    if (se.tag === 7) {
                      l(b, se.sibling), E = c(se, D.props.children), E.return = b, b = E;
                      break e;
                    }
                  } else if (se.elementType === $ || typeof $ == "object" && $ !== null && $.$$typeof === mt && kv($) === se.type) {
                    l(b, se.sibling), E = c(se, D.props), E.ref = Cu(b, se, D), E.return = b, b = E;
                    break e;
                  }
                  l(b, se);
                  break;
                } else r(b, se);
                se = se.sibling;
              }
              D.type === vt ? (E = Ti(D.props.children, b.mode, V, D.key), E.return = b, b = E) : (V = Lc(D.type, D.key, D.props, null, b.mode, V), V.ref = Cu(b, E, D), V.return = b, b = V);
            }
            return h(b);
          case _e:
            e: {
              for (se = D.key; E !== null; ) {
                if (E.key === se) if (E.tag === 4 && E.stateNode.containerInfo === D.containerInfo && E.stateNode.implementation === D.implementation) {
                  l(b, E.sibling), E = c(E, D.children || []), E.return = b, b = E;
                  break e;
                } else {
                  l(b, E);
                  break;
                }
                else r(b, E);
                E = E.sibling;
              }
              E = Td(D, b.mode, V), E.return = b, b = E;
            }
            return h(b);
          case mt:
            return se = D._init, Mt(b, E, se(D._payload), V);
        }
        if (ji(D)) return te(b, E, D, V);
        if (ue(D)) return re(b, E, D, V);
        ao(b, D);
      }
      return typeof D == "string" && D !== "" || typeof D == "number" ? (D = "" + D, E !== null && E.tag === 6 ? (l(b, E.sibling), E = c(E, D), E.return = b, b = E) : (l(b, E), E = pl(D, b.mode, V), E.return = b, b = E), h(b)) : l(b, E);
    }
    return Mt;
  }
  var aa = Dv(!0), an = Dv(!1), Q = $n(null), fr = null, bn = null, Xf = null;
  function qf() {
    Xf = bn = fr = null;
  }
  function Kf(n) {
    var r = Q.current;
    qe(Q), n._currentValue = r;
  }
  function Zf(n, r, l) {
    for (; n !== null; ) {
      var u = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, u !== null && (u.childLanes |= r)) : u !== null && (u.childLanes & r) !== r && (u.childLanes |= r), n === l) break;
      n = n.return;
    }
  }
  function io(n, r) {
    fr = n, Xf = bn = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (Jt = !0), n.firstContext = null);
  }
  function Ke(n) {
    var r = n._currentValue;
    if (Xf !== n) if (n = { context: n, memoizedValue: r, next: null }, bn === null) {
      if (fr === null) throw Error(k(308));
      bn = n, fr.dependencies = { lanes: 0, firstContext: n };
    } else bn = bn.next = n;
    return r;
  }
  var Ki = null;
  function Jf(n) {
    Ki === null ? Ki = [n] : Ki.push(n);
  }
  function _v(n, r, l, u) {
    var c = r.interleaved;
    return c === null ? (l.next = l, Jf(r)) : (l.next = c.next, c.next = l), r.interleaved = l, Ca(n, u);
  }
  function Ca(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; ) n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var Nr = !1;
  function vi(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Mv(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Ba(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function hi(n, r, l) {
    var u = n.updateQueue;
    if (u === null) return null;
    if (u = u.shared, Oe & 2) {
      var c = u.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), u.pending = r, Ca(n, l);
    }
    return c = u.interleaved, c === null ? (r.next = r, Jf(u)) : (r.next = c.next, c.next = r), u.interleaved = r, Ca(n, l);
  }
  function Gs(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var u = r.lanes;
      u &= n.pendingLanes, l |= u, r.lanes = l, Ef(n, l);
    }
  }
  function Lv(n, r) {
    var l = n.updateQueue, u = n.alternate;
    if (u !== null && (u = u.updateQueue, l === u)) {
      var c = null, d = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var h = { eventTime: l.eventTime, lane: l.lane, tag: l.tag, payload: l.payload, callback: l.callback, next: null };
          d === null ? c = d = h : d = d.next = h, l = l.next;
        } while (l !== null);
        d === null ? c = d = r : d = d.next = r;
      } else c = d = r;
      l = { baseState: u.baseState, firstBaseUpdate: c, lastBaseUpdate: d, shared: u.shared, effects: u.effects }, n.updateQueue = l;
      return;
    }
    n = l.lastBaseUpdate, n === null ? l.firstBaseUpdate = r : n.next = r, l.lastBaseUpdate = r;
  }
  function Ws(n, r, l, u) {
    var c = n.updateQueue;
    Nr = !1;
    var d = c.firstBaseUpdate, h = c.lastBaseUpdate, g = c.shared.pending;
    if (g !== null) {
      c.shared.pending = null;
      var w = g, M = w.next;
      w.next = null, h === null ? d = M : h.next = M, h = w;
      var H = n.alternate;
      H !== null && (H = H.updateQueue, g = H.lastBaseUpdate, g !== h && (g === null ? H.firstBaseUpdate = M : g.next = M, H.lastBaseUpdate = w));
    }
    if (d !== null) {
      var F = c.baseState;
      h = 0, H = M = w = null, g = d;
      do {
        var A = g.lane, X = g.eventTime;
        if ((u & A) === A) {
          H !== null && (H = H.next = {
            eventTime: X,
            lane: 0,
            tag: g.tag,
            payload: g.payload,
            callback: g.callback,
            next: null
          });
          e: {
            var te = n, re = g;
            switch (A = r, X = l, re.tag) {
              case 1:
                if (te = re.payload, typeof te == "function") {
                  F = te.call(X, F, A);
                  break e;
                }
                F = te;
                break e;
              case 3:
                te.flags = te.flags & -65537 | 128;
              case 0:
                if (te = re.payload, A = typeof te == "function" ? te.call(X, F, A) : te, A == null) break e;
                F = Z({}, F, A);
                break e;
              case 2:
                Nr = !0;
            }
          }
          g.callback !== null && g.lane !== 0 && (n.flags |= 64, A = c.effects, A === null ? c.effects = [g] : A.push(g));
        } else X = { eventTime: X, lane: A, tag: g.tag, payload: g.payload, callback: g.callback, next: null }, H === null ? (M = H = X, w = F) : H = H.next = X, h |= A;
        if (g = g.next, g === null) {
          if (g = c.shared.pending, g === null) break;
          A = g, g = A.next, A.next = null, c.lastBaseUpdate = A, c.shared.pending = null;
        }
      } while (!0);
      if (H === null && (w = F), c.baseState = w, c.firstBaseUpdate = M, c.lastBaseUpdate = H, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          h |= c.lane, c = c.next;
        while (c !== r);
      } else d === null && (c.shared.lanes = 0);
      ol |= h, n.lanes = h, n.memoizedState = F;
    }
  }
  function ed(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var u = n[r], c = u.callback;
      if (c !== null) {
        if (u.callback = null, u = l, typeof c != "function") throw Error(k(191, c));
        c.call(u);
      }
    }
  }
  var lo = {}, Ea = $n(lo), Eu = $n(lo), xu = $n(lo);
  function Zi(n) {
    if (n === lo) throw Error(k(174));
    return n;
  }
  function td(n, r) {
    switch (lt(xu, r), lt(Eu, n), lt(Ea, lo), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : Kr(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = Kr(r, n);
    }
    qe(Ea), lt(Ea, r);
  }
  function oo() {
    qe(Ea), qe(Eu), qe(xu);
  }
  function nd(n) {
    Zi(xu.current);
    var r = Zi(Ea.current), l = Kr(r, n.type);
    r !== l && (lt(Eu, n), lt(Ea, l));
  }
  function rd(n) {
    Eu.current === n && (qe(Ea), qe(Eu));
  }
  var dt = $n(0);
  function Xs(n) {
    for (var r = n; r !== null; ) {
      if (r.tag === 13) {
        var l = r.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || l.data === "$!")) return r;
      } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
        if (r.flags & 128) return r;
      } else if (r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === n) break;
      for (; r.sibling === null; ) {
        if (r.return === null || r.return === n) return null;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
    return null;
  }
  var ad = [];
  function bu() {
    for (var n = 0; n < ad.length; n++) ad[n]._workInProgressVersionPrimary = null;
    ad.length = 0;
  }
  var oe = Te.ReactCurrentDispatcher, De = Te.ReactCurrentBatchConfig, He = 0, Ce = null, et = null, Qt = null, qs = !1, Tu = !1, Ru = 0, id = 0;
  function N() {
    throw Error(k(321));
  }
  function jt(n, r) {
    if (r === null) return !1;
    for (var l = 0; l < r.length && l < n.length; l++) if (!ea(n[l], r[l])) return !1;
    return !0;
  }
  function de(n, r, l, u, c, d) {
    if (He = d, Ce = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, oe.current = n === null || n.memoizedState === null ? fc : dc, n = l(u, c), Tu) {
      d = 0;
      do {
        if (Tu = !1, Ru = 0, 25 <= d) throw Error(k(301));
        d += 1, Qt = et = null, r.updateQueue = null, oe.current = Lu, n = l(u, c);
      } while (Tu);
    }
    if (oe.current = Ze, r = et !== null && et.next !== null, He = 0, Qt = et = Ce = null, qs = !1, r) throw Error(k(300));
    return n;
  }
  function mi() {
    var n = Ru !== 0;
    return Ru = 0, n;
  }
  function Kt() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Qt === null ? Ce.memoizedState = Qt = n : Qt = Qt.next = n, Qt;
  }
  function Zt() {
    if (et === null) {
      var n = Ce.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = et.next;
    var r = Qt === null ? Ce.memoizedState : Qt.next;
    if (r !== null) Qt = r, et = n;
    else {
      if (n === null) throw Error(k(310));
      et = n, n = { memoizedState: et.memoizedState, baseState: et.baseState, baseQueue: et.baseQueue, queue: et.queue, next: null }, Qt === null ? Ce.memoizedState = Qt = n : Qt = Qt.next = n;
    }
    return Qt;
  }
  function Xn(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Ji(n) {
    var r = Zt(), l = r.queue;
    if (l === null) throw Error(k(311));
    l.lastRenderedReducer = n;
    var u = et, c = u.baseQueue, d = l.pending;
    if (d !== null) {
      if (c !== null) {
        var h = c.next;
        c.next = d.next, d.next = h;
      }
      u.baseQueue = c = d, l.pending = null;
    }
    if (c !== null) {
      d = c.next, u = u.baseState;
      var g = h = null, w = null, M = d;
      do {
        var H = M.lane;
        if ((He & H) === H) w !== null && (w = w.next = { lane: 0, action: M.action, hasEagerState: M.hasEagerState, eagerState: M.eagerState, next: null }), u = M.hasEagerState ? M.eagerState : n(u, M.action);
        else {
          var F = {
            lane: H,
            action: M.action,
            hasEagerState: M.hasEagerState,
            eagerState: M.eagerState,
            next: null
          };
          w === null ? (g = w = F, h = u) : w = w.next = F, Ce.lanes |= H, ol |= H;
        }
        M = M.next;
      } while (M !== null && M !== d);
      w === null ? h = u : w.next = g, ea(u, r.memoizedState) || (Jt = !0), r.memoizedState = u, r.baseState = h, r.baseQueue = w, l.lastRenderedState = u;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, Ce.lanes |= d, ol |= d, c = c.next;
      while (c !== n);
    } else c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function yi(n) {
    var r = Zt(), l = r.queue;
    if (l === null) throw Error(k(311));
    l.lastRenderedReducer = n;
    var u = l.dispatch, c = l.pending, d = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var h = c = c.next;
      do
        d = n(d, h.action), h = h.next;
      while (h !== c);
      ea(d, r.memoizedState) || (Jt = !0), r.memoizedState = d, r.baseQueue === null && (r.baseState = d), l.lastRenderedState = d;
    }
    return [d, u];
  }
  function uo() {
  }
  function Ks(n, r) {
    var l = Ce, u = Zt(), c = r(), d = !ea(u.memoizedState, c);
    if (d && (u.memoizedState = c, Jt = !0), u = u.queue, ku(ec.bind(null, l, u, n), [n]), u.getSnapshot !== r || d || Qt !== null && Qt.memoizedState.tag & 1) {
      if (l.flags |= 2048, el(9, Js.bind(null, l, u, c, r), void 0, null), Vt === null) throw Error(k(349));
      He & 30 || Zs(l, r, c);
    }
    return c;
  }
  function Zs(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = Ce.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Ce.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function Js(n, r, l, u) {
    r.value = l, r.getSnapshot = u, tc(r) && nc(n);
  }
  function ec(n, r, l) {
    return l(function() {
      tc(r) && nc(n);
    });
  }
  function tc(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !ea(n, l);
    } catch {
      return !0;
    }
  }
  function nc(n) {
    var r = Ca(n, 1);
    r !== null && hr(r, n, 1, -1);
  }
  function rc(n) {
    var r = Kt();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Xn, lastRenderedState: n }, r.queue = n, n = n.dispatch = Mu.bind(null, Ce, n), [r.memoizedState, n];
  }
  function el(n, r, l, u) {
    return n = { tag: n, create: r, destroy: l, deps: u, next: null }, r = Ce.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Ce.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (u = l.next, l.next = n, n.next = u, r.lastEffect = n)), n;
  }
  function ac() {
    return Zt().memoizedState;
  }
  function so(n, r, l, u) {
    var c = Kt();
    Ce.flags |= n, c.memoizedState = el(1 | r, l, void 0, u === void 0 ? null : u);
  }
  function co(n, r, l, u) {
    var c = Zt();
    u = u === void 0 ? null : u;
    var d = void 0;
    if (et !== null) {
      var h = et.memoizedState;
      if (d = h.destroy, u !== null && jt(u, h.deps)) {
        c.memoizedState = el(r, l, d, u);
        return;
      }
    }
    Ce.flags |= n, c.memoizedState = el(1 | r, l, d, u);
  }
  function ic(n, r) {
    return so(8390656, 8, n, r);
  }
  function ku(n, r) {
    return co(2048, 8, n, r);
  }
  function lc(n, r) {
    return co(4, 2, n, r);
  }
  function oc(n, r) {
    return co(4, 4, n, r);
  }
  function Du(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function tl(n, r, l) {
    return l = l != null ? l.concat([n]) : null, co(4, 4, Du.bind(null, r, n), l);
  }
  function _u() {
  }
  function uc(n, r) {
    var l = Zt();
    r = r === void 0 ? null : r;
    var u = l.memoizedState;
    return u !== null && r !== null && jt(r, u[1]) ? u[0] : (l.memoizedState = [n, r], n);
  }
  function sc(n, r) {
    var l = Zt();
    r = r === void 0 ? null : r;
    var u = l.memoizedState;
    return u !== null && r !== null && jt(r, u[1]) ? u[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function cc(n, r, l) {
    return He & 21 ? (ea(l, r) || (l = jp(), Ce.lanes |= l, ol |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, Jt = !0), n.memoizedState = l);
  }
  function zv(n, r) {
    var l = Ie;
    Ie = l !== 0 && 4 > l ? l : 4, n(!0);
    var u = De.transition;
    De.transition = {};
    try {
      n(!1), r();
    } finally {
      Ie = l, De.transition = u;
    }
  }
  function fo() {
    return Zt().memoizedState;
  }
  function Ov(n, r, l) {
    var u = vr(n);
    if (l = { lane: u, action: l, hasEagerState: !1, eagerState: null, next: null }, gi(n)) qn(r, l);
    else if (l = _v(n, r, l, u), l !== null) {
      var c = ot();
      hr(l, n, u, c), Nv(l, r, u);
    }
  }
  function Mu(n, r, l) {
    var u = vr(n), c = { lane: u, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (gi(n)) qn(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null)) try {
        var h = r.lastRenderedState, g = d(h, l);
        if (c.hasEagerState = !0, c.eagerState = g, ea(g, h)) {
          var w = r.interleaved;
          w === null ? (c.next = c, Jf(r)) : (c.next = w.next, w.next = c), r.interleaved = c;
          return;
        }
      } catch {
      } finally {
      }
      l = _v(n, r, c, u), l !== null && (c = ot(), hr(l, n, u, c), Nv(l, r, u));
    }
  }
  function gi(n) {
    var r = n.alternate;
    return n === Ce || r !== null && r === Ce;
  }
  function qn(n, r) {
    Tu = qs = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function Nv(n, r, l) {
    if (l & 4194240) {
      var u = r.lanes;
      u &= n.pendingLanes, l |= u, r.lanes = l, Ef(n, l);
    }
  }
  var Ze = { readContext: Ke, useCallback: N, useContext: N, useEffect: N, useImperativeHandle: N, useInsertionEffect: N, useLayoutEffect: N, useMemo: N, useReducer: N, useRef: N, useState: N, useDebugValue: N, useDeferredValue: N, useTransition: N, useMutableSource: N, useSyncExternalStore: N, useId: N, unstable_isNewReconciler: !1 }, fc = { readContext: Ke, useCallback: function(n, r) {
    return Kt().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Ke, useEffect: ic, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, so(
      4194308,
      4,
      Du.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return so(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return so(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = Kt();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var u = Kt();
    return r = l !== void 0 ? l(r) : r, u.memoizedState = u.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, u.queue = n, n = n.dispatch = Ov.bind(null, Ce, n), [u.memoizedState, n];
  }, useRef: function(n) {
    var r = Kt();
    return n = { current: n }, r.memoizedState = n;
  }, useState: rc, useDebugValue: _u, useDeferredValue: function(n) {
    return Kt().memoizedState = n;
  }, useTransition: function() {
    var n = rc(!1), r = n[0];
    return n = zv.bind(null, n[1]), Kt().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var u = Ce, c = Kt();
    if (st) {
      if (l === void 0) throw Error(k(407));
      l = l();
    } else {
      if (l = r(), Vt === null) throw Error(k(349));
      He & 30 || Zs(u, r, l);
    }
    c.memoizedState = l;
    var d = { value: l, getSnapshot: r };
    return c.queue = d, ic(ec.bind(
      null,
      u,
      d,
      n
    ), [n]), u.flags |= 2048, el(9, Js.bind(null, u, d, l, r), void 0, null), l;
  }, useId: function() {
    var n = Kt(), r = Vt.identifierPrefix;
    if (st) {
      var l = wa, u = Mn;
      l = (u & ~(1 << 32 - kr(u) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = Ru++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else l = id++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, dc = {
    readContext: Ke,
    useCallback: uc,
    useContext: Ke,
    useEffect: ku,
    useImperativeHandle: tl,
    useInsertionEffect: lc,
    useLayoutEffect: oc,
    useMemo: sc,
    useReducer: Ji,
    useRef: ac,
    useState: function() {
      return Ji(Xn);
    },
    useDebugValue: _u,
    useDeferredValue: function(n) {
      var r = Zt();
      return cc(r, et.memoizedState, n);
    },
    useTransition: function() {
      var n = Ji(Xn)[0], r = Zt().memoizedState;
      return [n, r];
    },
    useMutableSource: uo,
    useSyncExternalStore: Ks,
    useId: fo,
    unstable_isNewReconciler: !1
  }, Lu = { readContext: Ke, useCallback: uc, useContext: Ke, useEffect: ku, useImperativeHandle: tl, useInsertionEffect: lc, useLayoutEffect: oc, useMemo: sc, useReducer: yi, useRef: ac, useState: function() {
    return yi(Xn);
  }, useDebugValue: _u, useDeferredValue: function(n) {
    var r = Zt();
    return et === null ? r.memoizedState = n : cc(r, et.memoizedState, n);
  }, useTransition: function() {
    var n = yi(Xn)[0], r = Zt().memoizedState;
    return [n, r];
  }, useMutableSource: uo, useSyncExternalStore: Ks, useId: fo, unstable_isNewReconciler: !1 };
  function Kn(n, r) {
    if (n && n.defaultProps) {
      r = Z({}, r), n = n.defaultProps;
      for (var l in n) r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  function ld(n, r, l, u) {
    r = n.memoizedState, l = l(u, r), l = l == null ? r : Z({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var pc = { isMounted: function(n) {
    return (n = n._reactInternals) ? va(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var u = ot(), c = vr(n), d = Ba(u, c);
    d.payload = r, l != null && (d.callback = l), r = hi(n, d, c), r !== null && (hr(r, n, c, u), Gs(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var u = ot(), c = vr(n), d = Ba(u, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = hi(n, d, c), r !== null && (hr(r, n, c, u), Gs(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = ot(), u = vr(n), c = Ba(l, u);
    c.tag = 2, r != null && (c.callback = r), r = hi(n, c, u), r !== null && (hr(r, n, u, l), Gs(r, n, u));
  } };
  function Uv(n, r, l, u, c, d, h) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(u, d, h) : r.prototype && r.prototype.isPureReactComponent ? !lu(l, u) || !lu(c, d) : !0;
  }
  function Av(n, r, l) {
    var u = !1, c = Re, d = r.contextType;
    return typeof d == "object" && d !== null ? d = Ke(d) : (c = wt(r) ? Or : ft.current, u = r.contextTypes, d = (u = u != null) ? cr(n, c) : Re), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = pc, n.stateNode = r, r._reactInternals = n, u && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function vc(n, r, l, u) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, u), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, u), r.state !== n && pc.enqueueReplaceState(r, r.state, null);
  }
  function od(n, r, l, u) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = {}, vi(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = Ke(d) : (d = wt(r) ? Or : ft.current, c.context = cr(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (ld(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && pc.enqueueReplaceState(c, c.state, null), Ws(n, l, c, u), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function Si(n, r) {
    try {
      var l = "", u = r;
      do
        l += za(u), u = u.return;
      while (u);
      var c = l;
    } catch (d) {
      c = `
Error generating stack: ` + d.message + `
` + d.stack;
    }
    return { value: n, source: r, stack: c, digest: null };
  }
  function hc(n, r, l) {
    return { value: n, source: null, stack: l ?? null, digest: r ?? null };
  }
  function ud(n, r) {
    try {
      console.error(r.value);
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  var fy = typeof WeakMap == "function" ? WeakMap : Map;
  function zu(n, r, l) {
    l = Ba(-1, l), l.tag = 3, l.payload = { element: null };
    var u = r.value;
    return l.callback = function() {
      Ci || (Ci = !0, Vu = u), ud(n, r);
    }, l;
  }
  function Hv(n, r, l) {
    l = Ba(-1, l), l.tag = 3;
    var u = n.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var c = r.value;
      l.payload = function() {
        return u(c);
      }, l.callback = function() {
        ud(n, r);
      };
    }
    var d = n.stateNode;
    return d !== null && typeof d.componentDidCatch == "function" && (l.callback = function() {
      ud(n, r), typeof u != "function" && (Hr === null ? Hr = /* @__PURE__ */ new Set([this]) : Hr.add(this));
      var h = r.stack;
      this.componentDidCatch(r.value, { componentStack: h !== null ? h : "" });
    }), l;
  }
  function sd(n, r, l) {
    var u = n.pingCache;
    if (u === null) {
      u = n.pingCache = new fy();
      var c = /* @__PURE__ */ new Set();
      u.set(r, c);
    } else c = u.get(r), c === void 0 && (c = /* @__PURE__ */ new Set(), u.set(r, c));
    c.has(l) || (c.add(l), n = Ed.bind(null, n, r, l), r.then(n, n));
  }
  function cd(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function Fv(n, r, l, u, c) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = c, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = Ba(-1, 1), r.tag = 2, hi(l, r, 1))), l.lanes |= 1), n);
  }
  var nl = Te.ReactCurrentOwner, Jt = !1;
  function Dt(n, r, l, u) {
    r.child = n === null ? an(r, null, l, u) : aa(r, n.child, l, u);
  }
  function mc(n, r, l, u, c) {
    l = l.render;
    var d = r.ref;
    return io(r, c), u = de(n, r, l, u, d, c), l = mi(), n !== null && !Jt ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, ln(n, r, c)) : (st && l && Qf(r), r.flags |= 1, Dt(n, r, u, c), r.child);
  }
  function Zn(n, r, l, u, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !bd(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, rl(n, r, d, u, c)) : (n = Lc(l.type, null, u, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, !(n.lanes & c)) {
      var h = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : lu, l(h, u) && n.ref === r.ref) return ln(n, r, c);
    }
    return r.flags |= 1, n = bi(d, u), n.ref = r.ref, n.return = r, r.child = n;
  }
  function rl(n, r, l, u, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (lu(d, u) && n.ref === r.ref) if (Jt = !1, r.pendingProps = u = d, (n.lanes & c) !== 0) n.flags & 131072 && (Jt = !0);
      else return r.lanes = n.lanes, ln(n, r, c);
    }
    return yc(n, r, l, u, c);
  }
  function xe(n, r, l) {
    var u = r.pendingProps, c = u.children, d = n !== null ? n.memoizedState : null;
    if (u.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, lt(mo, pr), pr |= l;
    else {
      if (!(l & 1073741824)) return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, lt(mo, pr), pr |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, u = d !== null ? d.baseLanes : l, lt(mo, pr), pr |= u;
    }
    else d !== null ? (u = d.baseLanes | l, r.memoizedState = null) : u = l, lt(mo, pr), pr |= u;
    return Dt(n, r, c, l), r.child;
  }
  function Ou(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function yc(n, r, l, u, c) {
    var d = wt(l) ? Or : ft.current;
    return d = cr(r, d), io(r, c), l = de(n, r, l, u, d, c), u = mi(), n !== null && !Jt ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, ln(n, r, c)) : (st && u && Qf(r), r.flags |= 1, Dt(n, r, l, c), r.child);
  }
  function dy(n, r, l, u, c) {
    if (wt(l)) {
      var d = !0;
      Wi(r);
    } else d = !1;
    if (io(r, c), r.stateNode === null) Ur(n, r), Av(r, l, u), od(r, l, u, c), u = !0;
    else if (n === null) {
      var h = r.stateNode, g = r.memoizedProps;
      h.props = g;
      var w = h.context, M = l.contextType;
      typeof M == "object" && M !== null ? M = Ke(M) : (M = wt(l) ? Or : ft.current, M = cr(r, M));
      var H = l.getDerivedStateFromProps, F = typeof H == "function" || typeof h.getSnapshotBeforeUpdate == "function";
      F || typeof h.UNSAFE_componentWillReceiveProps != "function" && typeof h.componentWillReceiveProps != "function" || (g !== u || w !== M) && vc(r, h, u, M), Nr = !1;
      var A = r.memoizedState;
      h.state = A, Ws(r, u, h, c), w = r.memoizedState, g !== u || A !== w || Ht.current || Nr ? (typeof H == "function" && (ld(r, l, H, u), w = r.memoizedState), (g = Nr || Uv(r, l, g, u, A, w, M)) ? (F || typeof h.UNSAFE_componentWillMount != "function" && typeof h.componentWillMount != "function" || (typeof h.componentWillMount == "function" && h.componentWillMount(), typeof h.UNSAFE_componentWillMount == "function" && h.UNSAFE_componentWillMount()), typeof h.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof h.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = u, r.memoizedState = w), h.props = u, h.state = w, h.context = M, u = g) : (typeof h.componentDidMount == "function" && (r.flags |= 4194308), u = !1);
    } else {
      h = r.stateNode, Mv(n, r), g = r.memoizedProps, M = r.type === r.elementType ? g : Kn(r.type, g), h.props = M, F = r.pendingProps, A = h.context, w = l.contextType, typeof w == "object" && w !== null ? w = Ke(w) : (w = wt(l) ? Or : ft.current, w = cr(r, w));
      var X = l.getDerivedStateFromProps;
      (H = typeof X == "function" || typeof h.getSnapshotBeforeUpdate == "function") || typeof h.UNSAFE_componentWillReceiveProps != "function" && typeof h.componentWillReceiveProps != "function" || (g !== F || A !== w) && vc(r, h, u, w), Nr = !1, A = r.memoizedState, h.state = A, Ws(r, u, h, c);
      var te = r.memoizedState;
      g !== F || A !== te || Ht.current || Nr ? (typeof X == "function" && (ld(r, l, X, u), te = r.memoizedState), (M = Nr || Uv(r, l, M, u, A, te, w) || !1) ? (H || typeof h.UNSAFE_componentWillUpdate != "function" && typeof h.componentWillUpdate != "function" || (typeof h.componentWillUpdate == "function" && h.componentWillUpdate(u, te, w), typeof h.UNSAFE_componentWillUpdate == "function" && h.UNSAFE_componentWillUpdate(u, te, w)), typeof h.componentDidUpdate == "function" && (r.flags |= 4), typeof h.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof h.componentDidUpdate != "function" || g === n.memoizedProps && A === n.memoizedState || (r.flags |= 4), typeof h.getSnapshotBeforeUpdate != "function" || g === n.memoizedProps && A === n.memoizedState || (r.flags |= 1024), r.memoizedProps = u, r.memoizedState = te), h.props = u, h.state = te, h.context = w, u = M) : (typeof h.componentDidUpdate != "function" || g === n.memoizedProps && A === n.memoizedState || (r.flags |= 4), typeof h.getSnapshotBeforeUpdate != "function" || g === n.memoizedProps && A === n.memoizedState || (r.flags |= 1024), u = !1);
    }
    return fd(n, r, l, u, d, c);
  }
  function fd(n, r, l, u, c, d) {
    Ou(n, r);
    var h = (r.flags & 128) !== 0;
    if (!u && !h) return c && xn(r, l, !1), ln(n, r, d);
    u = r.stateNode, nl.current = r;
    var g = h && typeof l.getDerivedStateFromError != "function" ? null : u.render();
    return r.flags |= 1, n !== null && h ? (r.child = aa(r, n.child, null, d), r.child = aa(r, null, g, d)) : Dt(n, r, g, d), r.memoizedState = u.state, c && xn(r, l, !0), r.child;
  }
  function gc(n) {
    var r = n.stateNode;
    r.pendingContext ? Is(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Is(n, r.context, !1), td(n, r.containerInfo);
  }
  function po(n, r, l, u, c) {
    return Va(), wu(c), r.flags |= 256, Dt(n, r, l, u), r.child;
  }
  var dd = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Sc(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function jv(n, r, l) {
    var u = r.pendingProps, c = dt.current, d = !1, h = (r.flags & 128) !== 0, g;
    if ((g = h) || (g = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), g ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), lt(dt, c & 1), n === null)
      return Wf(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (h = u.children, n = u.fallback, d ? (u = r.mode, d = r.child, h = { mode: "hidden", children: h }, !(u & 1) && d !== null ? (d.childLanes = 0, d.pendingProps = h) : d = Eo(h, u, 0, null), n = Ti(n, u, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = Sc(l), r.memoizedState = dd, n) : Nu(r, h));
    if (c = n.memoizedState, c !== null && (g = c.dehydrated, g !== null)) return Vv(n, r, h, u, g, c, l);
    if (d) {
      d = u.fallback, h = r.mode, c = n.child, g = c.sibling;
      var w = { mode: "hidden", children: u.children };
      return !(h & 1) && r.child !== c ? (u = r.child, u.childLanes = 0, u.pendingProps = w, r.deletions = null) : (u = bi(c, w), u.subtreeFlags = c.subtreeFlags & 14680064), g !== null ? d = bi(g, d) : (d = Ti(d, h, l, null), d.flags |= 2), d.return = r, u.return = r, u.sibling = d, r.child = u, u = d, d = r.child, h = n.child.memoizedState, h = h === null ? Sc(l) : { baseLanes: h.baseLanes | l, cachePool: null, transitions: h.transitions }, d.memoizedState = h, d.childLanes = n.childLanes & ~l, r.memoizedState = dd, u;
    }
    return d = n.child, n = d.sibling, u = bi(d, { mode: "visible", children: u.children }), !(r.mode & 1) && (u.lanes = l), u.return = r, u.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = u, r.memoizedState = null, u;
  }
  function Nu(n, r) {
    return r = Eo({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function wc(n, r, l, u) {
    return u !== null && wu(u), aa(r, n.child, null, l), n = Nu(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function Vv(n, r, l, u, c, d, h) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, u = hc(Error(k(422))), wc(n, r, h, u)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = u.fallback, c = r.mode, u = Eo({ mode: "visible", children: u.children }, c, 0, null), d = Ti(d, c, h, null), d.flags |= 2, u.return = r, d.return = r, u.sibling = d, r.child = u, r.mode & 1 && aa(r, n.child, null, h), r.child.memoizedState = Sc(h), r.memoizedState = dd, d);
    if (!(r.mode & 1)) return wc(n, r, h, null);
    if (c.data === "$!") {
      if (u = c.nextSibling && c.nextSibling.dataset, u) var g = u.dgst;
      return u = g, d = Error(k(419)), u = hc(d, u, void 0), wc(n, r, h, u);
    }
    if (g = (h & n.childLanes) !== 0, Jt || g) {
      if (u = Vt, u !== null) {
        switch (h & -h) {
          case 4:
            c = 2;
            break;
          case 16:
            c = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            c = 32;
            break;
          case 536870912:
            c = 268435456;
            break;
          default:
            c = 0;
        }
        c = c & (u.suspendedLanes | h) ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, Ca(n, c), hr(u, n, c, -1));
      }
      return wd(), u = hc(Error(k(421))), wc(n, r, h, u);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = gy.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, Wn = ta(c.nextSibling), Gn = r, st = !0, ra = null, n !== null && (rn[Ft++] = Mn, rn[Ft++] = wa, rn[Ft++] = Xi, Mn = n.id, wa = n.overflow, Xi = r), r = Nu(r, u.children), r.flags |= 4096, r);
  }
  function pd(n, r, l) {
    n.lanes |= r;
    var u = n.alternate;
    u !== null && (u.lanes |= r), Zf(n.return, r, l);
  }
  function Cc(n, r, l, u, c) {
    var d = n.memoizedState;
    d === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: u, tail: l, tailMode: c } : (d.isBackwards = r, d.rendering = null, d.renderingStartTime = 0, d.last = u, d.tail = l, d.tailMode = c);
  }
  function Jn(n, r, l) {
    var u = r.pendingProps, c = u.revealOrder, d = u.tail;
    if (Dt(n, r, u.children, l), u = dt.current, u & 2) u = u & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && pd(n, l, r);
        else if (n.tag === 19) pd(n, l, r);
        else if (n.child !== null) {
          n.child.return = n, n = n.child;
          continue;
        }
        if (n === r) break e;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === r) break e;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
      u &= 1;
    }
    if (lt(dt, u), !(r.mode & 1)) r.memoizedState = null;
    else switch (c) {
      case "forwards":
        for (l = r.child, c = null; l !== null; ) n = l.alternate, n !== null && Xs(n) === null && (c = l), l = l.sibling;
        l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), Cc(r, !1, c, l, d);
        break;
      case "backwards":
        for (l = null, c = r.child, r.child = null; c !== null; ) {
          if (n = c.alternate, n !== null && Xs(n) === null) {
            r.child = c;
            break;
          }
          n = c.sibling, c.sibling = l, l = c, c = n;
        }
        Cc(r, !0, l, null, d);
        break;
      case "together":
        Cc(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function Ur(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function ln(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), ol |= r.lanes, !(l & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(k(153));
    if (r.child !== null) {
      for (n = r.child, l = bi(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; ) n = n.sibling, l = l.sibling = bi(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function Ec(n, r, l) {
    switch (r.tag) {
      case 3:
        gc(r), Va();
        break;
      case 5:
        nd(r);
        break;
      case 1:
        wt(r.type) && Wi(r);
        break;
      case 4:
        td(r, r.stateNode.containerInfo);
        break;
      case 10:
        var u = r.type._context, c = r.memoizedProps.value;
        lt(Q, u._currentValue), u._currentValue = c;
        break;
      case 13:
        if (u = r.memoizedState, u !== null)
          return u.dehydrated !== null ? (lt(dt, dt.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? jv(n, r, l) : (lt(dt, dt.current & 1), n = ln(n, r, l), n !== null ? n.sibling : null);
        lt(dt, dt.current & 1);
        break;
      case 19:
        if (u = (l & r.childLanes) !== 0, n.flags & 128) {
          if (u) return Jn(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), lt(dt, dt.current), u) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, xe(n, r, l);
    }
    return ln(n, r, l);
  }
  var vo, dr, It, Bv;
  vo = function(n, r) {
    for (var l = r.child; l !== null; ) {
      if (l.tag === 5 || l.tag === 6) n.appendChild(l.stateNode);
      else if (l.tag !== 4 && l.child !== null) {
        l.child.return = l, l = l.child;
        continue;
      }
      if (l === r) break;
      for (; l.sibling === null; ) {
        if (l.return === null || l.return === r) return;
        l = l.return;
      }
      l.sibling.return = l.return, l = l.sibling;
    }
  }, dr = function() {
  }, It = function(n, r, l, u) {
    var c = n.memoizedProps;
    if (c !== u) {
      n = r.stateNode, Zi(Ea.current);
      var d = null;
      switch (l) {
        case "input":
          c = or(n, c), u = or(n, u), d = [];
          break;
        case "select":
          c = Z({}, c, { value: void 0 }), u = Z({}, u, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = fa(n, c), u = fa(n, u), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof u.onClick == "function" && (n.onclick = Bs);
      }
      Sn(l, u);
      var h;
      l = null;
      for (M in c) if (!u.hasOwnProperty(M) && c.hasOwnProperty(M) && c[M] != null) if (M === "style") {
        var g = c[M];
        for (h in g) g.hasOwnProperty(h) && (l || (l = {}), l[h] = "");
      } else M !== "dangerouslySetInnerHTML" && M !== "children" && M !== "suppressContentEditableWarning" && M !== "suppressHydrationWarning" && M !== "autoFocus" && (Xt.hasOwnProperty(M) ? d || (d = []) : (d = d || []).push(M, null));
      for (M in u) {
        var w = u[M];
        if (g = c != null ? c[M] : void 0, u.hasOwnProperty(M) && w !== g && (w != null || g != null)) if (M === "style") if (g) {
          for (h in g) !g.hasOwnProperty(h) || w && w.hasOwnProperty(h) || (l || (l = {}), l[h] = "");
          for (h in w) w.hasOwnProperty(h) && g[h] !== w[h] && (l || (l = {}), l[h] = w[h]);
        } else l || (d || (d = []), d.push(
          M,
          l
        )), l = w;
        else M === "dangerouslySetInnerHTML" ? (w = w ? w.__html : void 0, g = g ? g.__html : void 0, w != null && g !== w && (d = d || []).push(M, w)) : M === "children" ? typeof w != "string" && typeof w != "number" || (d = d || []).push(M, "" + w) : M !== "suppressContentEditableWarning" && M !== "suppressHydrationWarning" && (Xt.hasOwnProperty(M) ? (w != null && M === "onScroll" && Ge("scroll", n), d || g === w || (d = [])) : (d = d || []).push(M, w));
      }
      l && (d = d || []).push("style", l);
      var M = d;
      (r.updateQueue = M) && (r.flags |= 4);
    }
  }, Bv = function(n, r, l, u) {
    l !== u && (r.flags |= 4);
  };
  function Uu(n, r) {
    if (!st) switch (n.tailMode) {
      case "hidden":
        r = n.tail;
        for (var l = null; r !== null; ) r.alternate !== null && (l = r), r = r.sibling;
        l === null ? n.tail = null : l.sibling = null;
        break;
      case "collapsed":
        l = n.tail;
        for (var u = null; l !== null; ) l.alternate !== null && (u = l), l = l.sibling;
        u === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : u.sibling = null;
    }
  }
  function Tn(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, l = 0, u = 0;
    if (r) for (var c = n.child; c !== null; ) l |= c.lanes | c.childLanes, u |= c.subtreeFlags & 14680064, u |= c.flags & 14680064, c.return = n, c = c.sibling;
    else for (c = n.child; c !== null; ) l |= c.lanes | c.childLanes, u |= c.subtreeFlags, u |= c.flags, c.return = n, c = c.sibling;
    return n.subtreeFlags |= u, n.childLanes = l, r;
  }
  function vd(n, r, l) {
    var u = r.pendingProps;
    switch ($s(r), r.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Tn(r), null;
      case 1:
        return wt(r.type) && Sa(), Tn(r), null;
      case 3:
        return u = r.stateNode, oo(), qe(Ht), qe(ft), bu(), u.pendingContext && (u.context = u.pendingContext, u.pendingContext = null), (n === null || n.child === null) && (kt(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, ra !== null && (Qu(ra), ra = null))), dr(n, r), Tn(r), null;
      case 5:
        rd(r);
        var c = Zi(xu.current);
        if (l = r.type, n !== null && r.stateNode != null) It(n, r, l, u, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!u) {
            if (r.stateNode === null) throw Error(k(166));
            return Tn(r), null;
          }
          if (n = Zi(Ea.current), kt(r)) {
            u = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (u[zr] = r, u[mu] = d, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                Ge("cancel", u), Ge("close", u);
                break;
              case "iframe":
              case "object":
              case "embed":
                Ge("load", u);
                break;
              case "video":
              case "audio":
                for (c = 0; c < fu.length; c++) Ge(fu[c], u);
                break;
              case "source":
                Ge("error", u);
                break;
              case "img":
              case "image":
              case "link":
                Ge(
                  "error",
                  u
                ), Ge("load", u);
                break;
              case "details":
                Ge("toggle", u);
                break;
              case "input":
                Tr(u, d), Ge("invalid", u);
                break;
              case "select":
                u._wrapperState = { wasMultiple: !!d.multiple }, Ge("invalid", u);
                break;
              case "textarea":
                Xr(u, d), Ge("invalid", u);
            }
            Sn(l, d), c = null;
            for (var h in d) if (d.hasOwnProperty(h)) {
              var g = d[h];
              h === "children" ? typeof g == "string" ? u.textContent !== g && (d.suppressHydrationWarning !== !0 && Vs(u.textContent, g, n), c = ["children", g]) : typeof g == "number" && u.textContent !== "" + g && (d.suppressHydrationWarning !== !0 && Vs(
                u.textContent,
                g,
                n
              ), c = ["children", "" + g]) : Xt.hasOwnProperty(h) && g != null && h === "onScroll" && Ge("scroll", u);
            }
            switch (l) {
              case "input":
                Gr(u), Bo(u, d, !0);
                break;
              case "textarea":
                Gr(u), Ll(u);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (u.onclick = Bs);
            }
            u = c, r.updateQueue = u, u !== null && (r.flags |= 4);
          } else {
            h = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = ur(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = h.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof u.is == "string" ? n = h.createElement(l, { is: u.is }) : (n = h.createElement(l), l === "select" && (h = n, u.multiple ? h.multiple = !0 : u.size && (h.size = u.size))) : n = h.createElementNS(n, l), n[zr] = r, n[mu] = u, vo(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (h = Nt(l, u), l) {
                case "dialog":
                  Ge("cancel", n), Ge("close", n), c = u;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Ge("load", n), c = u;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < fu.length; c++) Ge(fu[c], n);
                  c = u;
                  break;
                case "source":
                  Ge("error", n), c = u;
                  break;
                case "img":
                case "image":
                case "link":
                  Ge(
                    "error",
                    n
                  ), Ge("load", n), c = u;
                  break;
                case "details":
                  Ge("toggle", n), c = u;
                  break;
                case "input":
                  Tr(n, u), c = or(n, u), Ge("invalid", n);
                  break;
                case "option":
                  c = u;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!u.multiple }, c = Z({}, u, { value: void 0 }), Ge("invalid", n);
                  break;
                case "textarea":
                  Xr(n, u), c = fa(n, u), Ge("invalid", n);
                  break;
                default:
                  c = u;
              }
              Sn(l, c), g = c;
              for (d in g) if (g.hasOwnProperty(d)) {
                var w = g[d];
                d === "style" ? it(n, w) : d === "dangerouslySetInnerHTML" ? (w = w ? w.__html : void 0, w != null && Po(n, w)) : d === "children" ? typeof w == "string" ? (l !== "textarea" || w !== "") && ri(n, w) : typeof w == "number" && ri(n, "" + w) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (Xt.hasOwnProperty(d) ? w != null && d === "onScroll" && Ge("scroll", n) : w != null && yn(n, d, w, h));
              }
              switch (l) {
                case "input":
                  Gr(n), Bo(n, u, !1);
                  break;
                case "textarea":
                  Gr(n), Ll(n);
                  break;
                case "option":
                  u.value != null && n.setAttribute("value", "" + gn(u.value));
                  break;
                case "select":
                  n.multiple = !!u.multiple, d = u.value, d != null ? ti(n, !!u.multiple, d, !1) : u.defaultValue != null && ti(
                    n,
                    !!u.multiple,
                    u.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof c.onClick == "function" && (n.onclick = Bs);
              }
              switch (l) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  u = !!u.autoFocus;
                  break e;
                case "img":
                  u = !0;
                  break e;
                default:
                  u = !1;
              }
            }
            u && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return Tn(r), null;
      case 6:
        if (n && r.stateNode != null) Bv(n, r, n.memoizedProps, u);
        else {
          if (typeof u != "string" && r.stateNode === null) throw Error(k(166));
          if (l = Zi(xu.current), Zi(Ea.current), kt(r)) {
            if (u = r.stateNode, l = r.memoizedProps, u[zr] = r, (d = u.nodeValue !== l) && (n = Gn, n !== null)) switch (n.tag) {
              case 3:
                Vs(u.nodeValue, l, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && Vs(u.nodeValue, l, (n.mode & 1) !== 0);
            }
            d && (r.flags |= 4);
          } else u = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(u), u[zr] = r, r.stateNode = u;
        }
        return Tn(r), null;
      case 13:
        if (qe(dt), u = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (st && Wn !== null && r.mode & 1 && !(r.flags & 128)) Rv(), Va(), r.flags |= 98560, d = !1;
          else if (d = kt(r), u !== null && u.dehydrated !== null) {
            if (n === null) {
              if (!d) throw Error(k(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d) throw Error(k(317));
              d[zr] = r;
            } else Va(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            Tn(r), d = !1;
          } else ra !== null && (Qu(ra), ra = null), d = !0;
          if (!d) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (u = u !== null, u !== (n !== null && n.memoizedState !== null) && u && (r.child.flags |= 8192, r.mode & 1 && (n === null || dt.current & 1 ? $t === 0 && ($t = 3) : wd())), r.updateQueue !== null && (r.flags |= 4), Tn(r), null);
      case 4:
        return oo(), dr(n, r), n === null && pu(r.stateNode.containerInfo), Tn(r), null;
      case 10:
        return Kf(r.type._context), Tn(r), null;
      case 17:
        return wt(r.type) && Sa(), Tn(r), null;
      case 19:
        if (qe(dt), d = r.memoizedState, d === null) return Tn(r), null;
        if (u = (r.flags & 128) !== 0, h = d.rendering, h === null) if (u) Uu(d, !1);
        else {
          if ($t !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (h = Xs(n), h !== null) {
              for (r.flags |= 128, Uu(d, !1), u = h.updateQueue, u !== null && (r.updateQueue = u, r.flags |= 4), r.subtreeFlags = 0, u = l, l = r.child; l !== null; ) d = l, n = u, d.flags &= 14680066, h = d.alternate, h === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = h.childLanes, d.lanes = h.lanes, d.child = h.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = h.memoizedProps, d.memoizedState = h.memoizedState, d.updateQueue = h.updateQueue, d.type = h.type, n = h.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
              return lt(dt, dt.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          d.tail !== null && Rt() > go && (r.flags |= 128, u = !0, Uu(d, !1), r.lanes = 4194304);
        }
        else {
          if (!u) if (n = Xs(h), n !== null) {
            if (r.flags |= 128, u = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), Uu(d, !0), d.tail === null && d.tailMode === "hidden" && !h.alternate && !st) return Tn(r), null;
          } else 2 * Rt() - d.renderingStartTime > go && l !== 1073741824 && (r.flags |= 128, u = !0, Uu(d, !1), r.lanes = 4194304);
          d.isBackwards ? (h.sibling = r.child, r.child = h) : (l = d.last, l !== null ? l.sibling = h : r.child = h, d.last = h);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = Rt(), r.sibling = null, l = dt.current, lt(dt, u ? l & 1 | 2 : l & 1), r) : (Tn(r), null);
      case 22:
      case 23:
        return Sd(), u = r.memoizedState !== null, n !== null && n.memoizedState !== null !== u && (r.flags |= 8192), u && r.mode & 1 ? pr & 1073741824 && (Tn(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : Tn(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(k(156, r.tag));
  }
  function Pv(n, r) {
    switch ($s(r), r.tag) {
      case 1:
        return wt(r.type) && Sa(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return oo(), qe(Ht), qe(ft), bu(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return rd(r), null;
      case 13:
        if (qe(dt), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(k(340));
          Va();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return qe(dt), null;
      case 4:
        return oo(), null;
      case 10:
        return Kf(r.type._context), null;
      case 22:
      case 23:
        return Sd(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var al = !1, on = !1, py = typeof WeakSet == "function" ? WeakSet : Set, J = null;
  function wi(n, r) {
    var l = n.ref;
    if (l !== null) if (typeof l == "function") try {
      l(null);
    } catch (u) {
      Ct(n, r, u);
    }
    else l.current = null;
  }
  function hd(n, r, l) {
    try {
      l();
    } catch (u) {
      Ct(n, r, u);
    }
  }
  var md = !1;
  function vy(n, r) {
    if (Ii = Jo, n = oi(), Wl(n)) {
      if ("selectionStart" in n) var l = { start: n.selectionStart, end: n.selectionEnd };
      else e: {
        l = (l = n.ownerDocument) && l.defaultView || window;
        var u = l.getSelection && l.getSelection();
        if (u && u.rangeCount !== 0) {
          l = u.anchorNode;
          var c = u.anchorOffset, d = u.focusNode;
          u = u.focusOffset;
          try {
            l.nodeType, d.nodeType;
          } catch {
            l = null;
            break e;
          }
          var h = 0, g = -1, w = -1, M = 0, H = 0, F = n, A = null;
          t: for (; ; ) {
            for (var X; F !== l || c !== 0 && F.nodeType !== 3 || (g = h + c), F !== d || u !== 0 && F.nodeType !== 3 || (w = h + u), F.nodeType === 3 && (h += F.nodeValue.length), (X = F.firstChild) !== null; )
              A = F, F = X;
            for (; ; ) {
              if (F === n) break t;
              if (A === l && ++M === c && (g = h), A === d && ++H === u && (w = h), (X = F.nextSibling) !== null) break;
              F = A, A = F.parentNode;
            }
            F = X;
          }
          l = g === -1 || w === -1 ? null : { start: g, end: w };
        } else l = null;
      }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (hu = { focusedElem: n, selectionRange: l }, Jo = !1, J = r; J !== null; ) if (r = J, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, J = n;
    else for (; J !== null; ) {
      r = J;
      try {
        var te = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (te !== null) {
              var re = te.memoizedProps, Mt = te.memoizedState, b = r.stateNode, E = b.getSnapshotBeforeUpdate(r.elementType === r.type ? re : Kn(r.type, re), Mt);
              b.__reactInternalSnapshotBeforeUpdate = E;
            }
            break;
          case 3:
            var D = r.stateNode.containerInfo;
            D.nodeType === 1 ? D.textContent = "" : D.nodeType === 9 && D.documentElement && D.removeChild(D.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(k(163));
        }
      } catch (V) {
        Ct(r, r.return, V);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, J = n;
        break;
      }
      J = r.return;
    }
    return te = md, md = !1, te;
  }
  function ho(n, r, l) {
    var u = r.updateQueue;
    if (u = u !== null ? u.lastEffect : null, u !== null) {
      var c = u = u.next;
      do {
        if ((c.tag & n) === n) {
          var d = c.destroy;
          c.destroy = void 0, d !== void 0 && hd(r, l, d);
        }
        c = c.next;
      } while (c !== u);
    }
  }
  function xc(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & n) === n) {
          var u = l.create;
          l.destroy = u();
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function bc(n) {
    var r = n.ref;
    if (r !== null) {
      var l = n.stateNode;
      switch (n.tag) {
        case 5:
          n = l;
          break;
        default:
          n = l;
      }
      typeof r == "function" ? r(n) : r.current = n;
    }
  }
  function Yv(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, Yv(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[zr], delete r[mu], delete r[Bf], delete r[Pf], delete r[no])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Tc(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Au(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || Tc(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function xa(n, r, l) {
    var u = n.tag;
    if (u === 5 || u === 6) n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = Bs));
    else if (u !== 4 && (n = n.child, n !== null)) for (xa(n, r, l), n = n.sibling; n !== null; ) xa(n, r, l), n = n.sibling;
  }
  function ba(n, r, l) {
    var u = n.tag;
    if (u === 5 || u === 6) n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (u !== 4 && (n = n.child, n !== null)) for (ba(n, r, l), n = n.sibling; n !== null; ) ba(n, r, l), n = n.sibling;
  }
  var pt = null, Ln = !1;
  function Ar(n, r, l) {
    for (l = l.child; l !== null; ) Pa(n, r, l), l = l.sibling;
  }
  function Pa(n, r, l) {
    if (Zr && typeof Zr.onCommitFiberUnmount == "function") try {
      Zr.onCommitFiberUnmount($o, l);
    } catch {
    }
    switch (l.tag) {
      case 5:
        on || wi(l, r);
      case 6:
        var u = pt, c = Ln;
        pt = null, Ar(n, r, l), pt = u, Ln = c, pt !== null && (Ln ? (n = pt, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : pt.removeChild(l.stateNode));
        break;
      case 18:
        pt !== null && (Ln ? (n = pt, l = l.stateNode, n.nodeType === 8 ? eo(n.parentNode, l) : n.nodeType === 1 && eo(n, l), Zo(n)) : eo(pt, l.stateNode));
        break;
      case 4:
        u = pt, c = Ln, pt = l.stateNode.containerInfo, Ln = !0, Ar(n, r, l), pt = u, Ln = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!on && (u = l.updateQueue, u !== null && (u = u.lastEffect, u !== null))) {
          c = u = u.next;
          do {
            var d = c, h = d.destroy;
            d = d.tag, h !== void 0 && (d & 2 || d & 4) && hd(l, r, h), c = c.next;
          } while (c !== u);
        }
        Ar(n, r, l);
        break;
      case 1:
        if (!on && (wi(l, r), u = l.stateNode, typeof u.componentWillUnmount == "function")) try {
          u.props = l.memoizedProps, u.state = l.memoizedState, u.componentWillUnmount();
        } catch (g) {
          Ct(l, r, g);
        }
        Ar(n, r, l);
        break;
      case 21:
        Ar(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (on = (u = on) || l.memoizedState !== null, Ar(n, r, l), on = u) : Ar(n, r, l);
        break;
      default:
        Ar(n, r, l);
    }
  }
  function Qv(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new py()), r.forEach(function(u) {
        var c = Sy.bind(null, n, u);
        l.has(u) || (l.add(u), u.then(c, c));
      });
    }
  }
  function ia(n, r) {
    var l = r.deletions;
    if (l !== null) for (var u = 0; u < l.length; u++) {
      var c = l[u];
      try {
        var d = n, h = r, g = h;
        e: for (; g !== null; ) {
          switch (g.tag) {
            case 5:
              pt = g.stateNode, Ln = !1;
              break e;
            case 3:
              pt = g.stateNode.containerInfo, Ln = !0;
              break e;
            case 4:
              pt = g.stateNode.containerInfo, Ln = !0;
              break e;
          }
          g = g.return;
        }
        if (pt === null) throw Error(k(160));
        Pa(d, h, c), pt = null, Ln = !1;
        var w = c.alternate;
        w !== null && (w.return = null), c.return = null;
      } catch (M) {
        Ct(c, r, M);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) Iv(r, n), r = r.sibling;
  }
  function Iv(n, r) {
    var l = n.alternate, u = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ia(r, n), la(n), u & 4) {
          try {
            ho(3, n, n.return), xc(3, n);
          } catch (re) {
            Ct(n, n.return, re);
          }
          try {
            ho(5, n, n.return);
          } catch (re) {
            Ct(n, n.return, re);
          }
        }
        break;
      case 1:
        ia(r, n), la(n), u & 512 && l !== null && wi(l, l.return);
        break;
      case 5:
        if (ia(r, n), la(n), u & 512 && l !== null && wi(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            ri(c, "");
          } catch (re) {
            Ct(n, n.return, re);
          }
        }
        if (u & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, h = l !== null ? l.memoizedProps : d, g = n.type, w = n.updateQueue;
          if (n.updateQueue = null, w !== null) try {
            g === "input" && d.type === "radio" && d.name != null && Rr(c, d), Nt(g, h);
            var M = Nt(g, d);
            for (h = 0; h < w.length; h += 2) {
              var H = w[h], F = w[h + 1];
              H === "style" ? it(c, F) : H === "dangerouslySetInnerHTML" ? Po(c, F) : H === "children" ? ri(c, F) : yn(c, H, F, M);
            }
            switch (g) {
              case "input":
                Wr(c, d);
                break;
              case "textarea":
                qr(c, d);
                break;
              case "select":
                var A = c._wrapperState.wasMultiple;
                c._wrapperState.wasMultiple = !!d.multiple;
                var X = d.value;
                X != null ? ti(c, !!d.multiple, X, !1) : A !== !!d.multiple && (d.defaultValue != null ? ti(
                  c,
                  !!d.multiple,
                  d.defaultValue,
                  !0
                ) : ti(c, !!d.multiple, d.multiple ? [] : "", !1));
            }
            c[mu] = d;
          } catch (re) {
            Ct(n, n.return, re);
          }
        }
        break;
      case 6:
        if (ia(r, n), la(n), u & 4) {
          if (n.stateNode === null) throw Error(k(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (re) {
            Ct(n, n.return, re);
          }
        }
        break;
      case 3:
        if (ia(r, n), la(n), u & 4 && l !== null && l.memoizedState.isDehydrated) try {
          Zo(r.containerInfo);
        } catch (re) {
          Ct(n, n.return, re);
        }
        break;
      case 4:
        ia(r, n), la(n);
        break;
      case 13:
        ia(r, n), la(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (gd = Rt())), u & 4 && Qv(n);
        break;
      case 22:
        if (H = l !== null && l.memoizedState !== null, n.mode & 1 ? (on = (M = on) || H, ia(r, n), on = M) : ia(r, n), la(n), u & 8192) {
          if (M = n.memoizedState !== null, (n.stateNode.isHidden = M) && !H && n.mode & 1) for (J = n, H = n.child; H !== null; ) {
            for (F = J = H; J !== null; ) {
              switch (A = J, X = A.child, A.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  ho(4, A, A.return);
                  break;
                case 1:
                  wi(A, A.return);
                  var te = A.stateNode;
                  if (typeof te.componentWillUnmount == "function") {
                    u = A, l = A.return;
                    try {
                      r = u, te.props = r.memoizedProps, te.state = r.memoizedState, te.componentWillUnmount();
                    } catch (re) {
                      Ct(u, l, re);
                    }
                  }
                  break;
                case 5:
                  wi(A, A.return);
                  break;
                case 22:
                  if (A.memoizedState !== null) {
                    Gv(F);
                    continue;
                  }
              }
              X !== null ? (X.return = A, J = X) : Gv(F);
            }
            H = H.sibling;
          }
          e: for (H = null, F = n; ; ) {
            if (F.tag === 5) {
              if (H === null) {
                H = F;
                try {
                  c = F.stateNode, M ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (g = F.stateNode, w = F.memoizedProps.style, h = w != null && w.hasOwnProperty("display") ? w.display : null, g.style.display = Me("display", h));
                } catch (re) {
                  Ct(n, n.return, re);
                }
              }
            } else if (F.tag === 6) {
              if (H === null) try {
                F.stateNode.nodeValue = M ? "" : F.memoizedProps;
              } catch (re) {
                Ct(n, n.return, re);
              }
            } else if ((F.tag !== 22 && F.tag !== 23 || F.memoizedState === null || F === n) && F.child !== null) {
              F.child.return = F, F = F.child;
              continue;
            }
            if (F === n) break e;
            for (; F.sibling === null; ) {
              if (F.return === null || F.return === n) break e;
              H === F && (H = null), F = F.return;
            }
            H === F && (H = null), F.sibling.return = F.return, F = F.sibling;
          }
        }
        break;
      case 19:
        ia(r, n), la(n), u & 4 && Qv(n);
        break;
      case 21:
        break;
      default:
        ia(
          r,
          n
        ), la(n);
    }
  }
  function la(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var l = n.return; l !== null; ) {
            if (Tc(l)) {
              var u = l;
              break e;
            }
            l = l.return;
          }
          throw Error(k(160));
        }
        switch (u.tag) {
          case 5:
            var c = u.stateNode;
            u.flags & 32 && (ri(c, ""), u.flags &= -33);
            var d = Au(n);
            ba(n, d, c);
            break;
          case 3:
          case 4:
            var h = u.stateNode.containerInfo, g = Au(n);
            xa(n, g, h);
            break;
          default:
            throw Error(k(161));
        }
      } catch (w) {
        Ct(n, n.return, w);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function Hu(n, r, l) {
    J = n, $v(n);
  }
  function $v(n, r, l) {
    for (var u = (n.mode & 1) !== 0; J !== null; ) {
      var c = J, d = c.child;
      if (c.tag === 22 && u) {
        var h = c.memoizedState !== null || al;
        if (!h) {
          var g = c.alternate, w = g !== null && g.memoizedState !== null || on;
          g = al;
          var M = on;
          if (al = h, (on = w) && !M) for (J = c; J !== null; ) h = J, w = h.child, h.tag === 22 && h.memoizedState !== null ? Fu(c) : w !== null ? (w.return = h, J = w) : Fu(c);
          for (; d !== null; ) J = d, $v(d), d = d.sibling;
          J = c, al = g, on = M;
        }
        yd(n);
      } else c.subtreeFlags & 8772 && d !== null ? (d.return = c, J = d) : yd(n);
    }
  }
  function yd(n) {
    for (; J !== null; ) {
      var r = J;
      if (r.flags & 8772) {
        var l = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              on || xc(5, r);
              break;
            case 1:
              var u = r.stateNode;
              if (r.flags & 4 && !on) if (l === null) u.componentDidMount();
              else {
                var c = r.elementType === r.type ? l.memoizedProps : Kn(r.type, l.memoizedProps);
                u.componentDidUpdate(c, l.memoizedState, u.__reactInternalSnapshotBeforeUpdate);
              }
              var d = r.updateQueue;
              d !== null && ed(r, d, u);
              break;
            case 3:
              var h = r.updateQueue;
              if (h !== null) {
                if (l = null, r.child !== null) switch (r.child.tag) {
                  case 5:
                    l = r.child.stateNode;
                    break;
                  case 1:
                    l = r.child.stateNode;
                }
                ed(r, h, l);
              }
              break;
            case 5:
              var g = r.stateNode;
              if (l === null && r.flags & 4) {
                l = g;
                var w = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    w.autoFocus && l.focus();
                    break;
                  case "img":
                    w.src && (l.src = w.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (r.memoizedState === null) {
                var M = r.alternate;
                if (M !== null) {
                  var H = M.memoizedState;
                  if (H !== null) {
                    var F = H.dehydrated;
                    F !== null && Zo(F);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(k(163));
          }
          on || r.flags & 512 && bc(r);
        } catch (A) {
          Ct(r, r.return, A);
        }
      }
      if (r === n) {
        J = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, J = l;
        break;
      }
      J = r.return;
    }
  }
  function Gv(n) {
    for (; J !== null; ) {
      var r = J;
      if (r === n) {
        J = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, J = l;
        break;
      }
      J = r.return;
    }
  }
  function Fu(n) {
    for (; J !== null; ) {
      var r = J;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              xc(4, r);
            } catch (w) {
              Ct(r, l, w);
            }
            break;
          case 1:
            var u = r.stateNode;
            if (typeof u.componentDidMount == "function") {
              var c = r.return;
              try {
                u.componentDidMount();
              } catch (w) {
                Ct(r, c, w);
              }
            }
            var d = r.return;
            try {
              bc(r);
            } catch (w) {
              Ct(r, d, w);
            }
            break;
          case 5:
            var h = r.return;
            try {
              bc(r);
            } catch (w) {
              Ct(r, h, w);
            }
        }
      } catch (w) {
        Ct(r, r.return, w);
      }
      if (r === n) {
        J = null;
        break;
      }
      var g = r.sibling;
      if (g !== null) {
        g.return = r.return, J = g;
        break;
      }
      J = r.return;
    }
  }
  var Wv = Math.ceil, Rc = Te.ReactCurrentDispatcher, il = Te.ReactCurrentOwner, Rn = Te.ReactCurrentBatchConfig, Oe = 0, Vt = null, _t = null, un = 0, pr = 0, mo = $n(0), $t = 0, ll = null, ol = 0, ul = 0, ju = 0, yo = null, er = null, gd = 0, go = 1 / 0, Ya = null, Ci = !1, Vu = null, Hr = null, kc = !1, Ei = null, Bu = 0, So = 0, wo = null, sl = -1, Pu = 0;
  function ot() {
    return Oe & 6 ? Rt() : sl !== -1 ? sl : sl = Rt();
  }
  function vr(n) {
    return n.mode & 1 ? Oe & 2 && un !== 0 ? un & -un : qi.transition !== null ? (Pu === 0 && (Pu = jp()), Pu) : (n = Ie, n !== 0 || (n = window.event, n = n === void 0 ? 16 : Rf(n.type)), n) : 1;
  }
  function hr(n, r, l, u) {
    if (50 < So) throw So = 0, wo = null, Error(k(185));
    Xo(n, l, u), (!(Oe & 2) || n !== Vt) && (n === Vt && (!(Oe & 2) && (ul |= l), $t === 4 && xi(n, un)), en(n, u), l === 1 && Oe === 0 && !(r.mode & 1) && (go = Rt() + 500, gu && _n()));
  }
  function en(n, r) {
    var l = n.callbackNode;
    Im(n, r);
    var u = Bl(n, n === Vt ? un : 0);
    if (u === 0) l !== null && Np(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = u & -u, n.callbackPriority !== r) {
      if (l != null && Np(l), r === 1) n.tag === 0 ? Yf($u.bind(null, n)) : si($u.bind(null, n)), cy(function() {
        !(Oe & 6) && _n();
      }), l = null;
      else {
        switch (Vp(u)) {
          case 1:
            l = Le;
            break;
          case 4:
            l = Fl;
            break;
          case 16:
            l = Io;
            break;
          case 536870912:
            l = wf;
            break;
          default:
            l = Io;
        }
        l = eh(l, Xv.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function Xv(n, r) {
    if (sl = -1, Pu = 0, Oe & 6) throw Error(k(327));
    var l = n.callbackNode;
    if (Co() && n.callbackNode !== l) return null;
    var u = Bl(n, n === Vt ? un : 0);
    if (u === 0) return null;
    if (u & 30 || u & n.expiredLanes || r) r = Mc(n, u);
    else {
      r = u;
      var c = Oe;
      Oe |= 2;
      var d = qv();
      (Vt !== n || un !== r) && (Ya = null, go = Rt() + 500, fl(n, r));
      do
        try {
          my();
          break;
        } catch (g) {
          _c(n, g);
        }
      while (!0);
      qf(), Rc.current = d, Oe = c, _t !== null ? r = 0 : (Vt = null, un = 0, r = $t);
    }
    if (r !== 0) {
      if (r === 2 && (c = Go(n), c !== 0 && (u = c, r = Yu(n, c))), r === 1) throw l = ll, fl(n, 0), xi(n, u), en(n, Rt()), l;
      if (r === 6) xi(n, u);
      else {
        if (c = n.current.alternate, !(u & 30) && !Iu(c) && (r = Mc(n, u), r === 2 && (d = Go(n), d !== 0 && (u = d, r = Yu(n, d))), r === 1)) throw l = ll, fl(n, 0), xi(n, u), en(n, Rt()), l;
        switch (n.finishedWork = c, n.finishedLanes = u, r) {
          case 0:
          case 1:
            throw Error(k(345));
          case 2:
            dl(n, er, Ya);
            break;
          case 3:
            if (xi(n, u), (u & 130023424) === u && (r = gd + 500 - Rt(), 10 < r)) {
              if (Bl(n, 0) !== 0) break;
              if (c = n.suspendedLanes, (c & u) !== u) {
                ot(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = Ps(dl.bind(null, n, er, Ya), r);
              break;
            }
            dl(n, er, Ya);
            break;
          case 4:
            if (xi(n, u), (u & 4194240) === u) break;
            for (r = n.eventTimes, c = -1; 0 < u; ) {
              var h = 31 - kr(u);
              d = 1 << h, h = r[h], h > c && (c = h), u &= ~d;
            }
            if (u = c, u = Rt() - u, u = (120 > u ? 120 : 480 > u ? 480 : 1080 > u ? 1080 : 1920 > u ? 1920 : 3e3 > u ? 3e3 : 4320 > u ? 4320 : 1960 * Wv(u / 1960)) - u, 10 < u) {
              n.timeoutHandle = Ps(dl.bind(null, n, er, Ya), u);
              break;
            }
            dl(n, er, Ya);
            break;
          case 5:
            dl(n, er, Ya);
            break;
          default:
            throw Error(k(329));
        }
      }
    }
    return en(n, Rt()), n.callbackNode === l ? Xv.bind(null, n) : null;
  }
  function Yu(n, r) {
    var l = yo;
    return n.current.memoizedState.isDehydrated && (fl(n, r).flags |= 256), n = Mc(n, r), n !== 2 && (r = er, er = l, r !== null && Qu(r)), n;
  }
  function Qu(n) {
    er === null ? er = n : er.push.apply(er, n);
  }
  function Iu(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null)) for (var u = 0; u < l.length; u++) {
          var c = l[u], d = c.getSnapshot;
          c = c.value;
          try {
            if (!ea(d(), c)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (l = r.child, r.subtreeFlags & 16384 && l !== null) l.return = r, r = l;
      else {
        if (r === n) break;
        for (; r.sibling === null; ) {
          if (r.return === null || r.return === n) return !0;
          r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
      }
    }
    return !0;
  }
  function xi(n, r) {
    for (r &= ~ju, r &= ~ul, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - kr(r), u = 1 << l;
      n[l] = -1, r &= ~u;
    }
  }
  function $u(n) {
    if (Oe & 6) throw Error(k(327));
    Co();
    var r = Bl(n, 0);
    if (!(r & 1)) return en(n, Rt()), null;
    var l = Mc(n, r);
    if (n.tag !== 0 && l === 2) {
      var u = Go(n);
      u !== 0 && (r = u, l = Yu(n, u));
    }
    if (l === 1) throw l = ll, fl(n, 0), xi(n, r), en(n, Rt()), l;
    if (l === 6) throw Error(k(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, dl(n, er, Ya), en(n, Rt()), null;
  }
  function Dc(n, r) {
    var l = Oe;
    Oe |= 1;
    try {
      return n(r);
    } finally {
      Oe = l, Oe === 0 && (go = Rt() + 500, gu && _n());
    }
  }
  function cl(n) {
    Ei !== null && Ei.tag === 0 && !(Oe & 6) && Co();
    var r = Oe;
    Oe |= 1;
    var l = Rn.transition, u = Ie;
    try {
      if (Rn.transition = null, Ie = 1, n) return n();
    } finally {
      Ie = u, Rn.transition = l, Oe = r, !(Oe & 6) && _n();
    }
  }
  function Sd() {
    pr = mo.current, qe(mo);
  }
  function fl(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, Ev(l)), _t !== null) for (l = _t.return; l !== null; ) {
      var u = l;
      switch ($s(u), u.tag) {
        case 1:
          u = u.type.childContextTypes, u != null && Sa();
          break;
        case 3:
          oo(), qe(Ht), qe(ft), bu();
          break;
        case 5:
          rd(u);
          break;
        case 4:
          oo();
          break;
        case 13:
          qe(dt);
          break;
        case 19:
          qe(dt);
          break;
        case 10:
          Kf(u.type._context);
          break;
        case 22:
        case 23:
          Sd();
      }
      l = l.return;
    }
    if (Vt = n, _t = n = bi(n.current, null), un = pr = r, $t = 0, ll = null, ju = ul = ol = 0, er = yo = null, Ki !== null) {
      for (r = 0; r < Ki.length; r++) if (l = Ki[r], u = l.interleaved, u !== null) {
        l.interleaved = null;
        var c = u.next, d = l.pending;
        if (d !== null) {
          var h = d.next;
          d.next = c, u.next = h;
        }
        l.pending = u;
      }
      Ki = null;
    }
    return n;
  }
  function _c(n, r) {
    do {
      var l = _t;
      try {
        if (qf(), oe.current = Ze, qs) {
          for (var u = Ce.memoizedState; u !== null; ) {
            var c = u.queue;
            c !== null && (c.pending = null), u = u.next;
          }
          qs = !1;
        }
        if (He = 0, Qt = et = Ce = null, Tu = !1, Ru = 0, il.current = null, l === null || l.return === null) {
          $t = 1, ll = r, _t = null;
          break;
        }
        e: {
          var d = n, h = l.return, g = l, w = r;
          if (r = un, g.flags |= 32768, w !== null && typeof w == "object" && typeof w.then == "function") {
            var M = w, H = g, F = H.tag;
            if (!(H.mode & 1) && (F === 0 || F === 11 || F === 15)) {
              var A = H.alternate;
              A ? (H.updateQueue = A.updateQueue, H.memoizedState = A.memoizedState, H.lanes = A.lanes) : (H.updateQueue = null, H.memoizedState = null);
            }
            var X = cd(h);
            if (X !== null) {
              X.flags &= -257, Fv(X, h, g, d, r), X.mode & 1 && sd(d, M, r), r = X, w = M;
              var te = r.updateQueue;
              if (te === null) {
                var re = /* @__PURE__ */ new Set();
                re.add(w), r.updateQueue = re;
              } else te.add(w);
              break e;
            } else {
              if (!(r & 1)) {
                sd(d, M, r), wd();
                break e;
              }
              w = Error(k(426));
            }
          } else if (st && g.mode & 1) {
            var Mt = cd(h);
            if (Mt !== null) {
              !(Mt.flags & 65536) && (Mt.flags |= 256), Fv(Mt, h, g, d, r), wu(Si(w, g));
              break e;
            }
          }
          d = w = Si(w, g), $t !== 4 && ($t = 2), yo === null ? yo = [d] : yo.push(d), d = h;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var b = zu(d, w, r);
                Lv(d, b);
                break e;
              case 1:
                g = w;
                var E = d.type, D = d.stateNode;
                if (!(d.flags & 128) && (typeof E.getDerivedStateFromError == "function" || D !== null && typeof D.componentDidCatch == "function" && (Hr === null || !Hr.has(D)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var V = Hv(d, g, r);
                  Lv(d, V);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        Kv(l);
      } catch ($) {
        r = $, _t === l && l !== null && (_t = l = l.return);
        continue;
      }
      break;
    } while (!0);
  }
  function qv() {
    var n = Rc.current;
    return Rc.current = Ze, n === null ? Ze : n;
  }
  function wd() {
    ($t === 0 || $t === 3 || $t === 2) && ($t = 4), Vt === null || !(ol & 268435455) && !(ul & 268435455) || xi(Vt, un);
  }
  function Mc(n, r) {
    var l = Oe;
    Oe |= 2;
    var u = qv();
    (Vt !== n || un !== r) && (Ya = null, fl(n, r));
    do
      try {
        hy();
        break;
      } catch (c) {
        _c(n, c);
      }
    while (!0);
    if (qf(), Oe = l, Rc.current = u, _t !== null) throw Error(k(261));
    return Vt = null, un = 0, $t;
  }
  function hy() {
    for (; _t !== null; ) Cd(_t);
  }
  function my() {
    for (; _t !== null && !Pm(); ) Cd(_t);
  }
  function Cd(n) {
    var r = xd(n.alternate, n, pr);
    n.memoizedProps = n.pendingProps, r === null ? Kv(n) : _t = r, il.current = null;
  }
  function Kv(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (l = Pv(l, r), l !== null) {
          l.flags &= 32767, _t = l;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          $t = 6, _t = null;
          return;
        }
      } else if (l = vd(l, r, pr), l !== null) {
        _t = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        _t = r;
        return;
      }
      _t = r = n;
    } while (r !== null);
    $t === 0 && ($t = 5);
  }
  function dl(n, r, l) {
    var u = Ie, c = Rn.transition;
    try {
      Rn.transition = null, Ie = 1, yy(n, r, l, u);
    } finally {
      Rn.transition = c, Ie = u;
    }
    return null;
  }
  function yy(n, r, l, u) {
    do
      Co();
    while (Ei !== null);
    if (Oe & 6) throw Error(k(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current) throw Error(k(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (Cf(n, d), n === Vt && (_t = Vt = null, un = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || kc || (kc = !0, eh(Io, function() {
      return Co(), null;
    })), d = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || d) {
      d = Rn.transition, Rn.transition = null;
      var h = Ie;
      Ie = 1;
      var g = Oe;
      Oe |= 4, il.current = null, vy(n, l), Iv(l, n), pv(hu), Jo = !!Ii, hu = Ii = null, n.current = l, Hu(l), Up(), Oe = g, Ie = h, Rn.transition = d;
    } else n.current = l;
    if (kc && (kc = !1, Ei = n, Bu = c), d = n.pendingLanes, d === 0 && (Hr = null), Hp(l.stateNode), en(n, Rt()), r !== null) for (u = n.onRecoverableError, l = 0; l < r.length; l++) c = r[l], u(c.value, { componentStack: c.stack, digest: c.digest });
    if (Ci) throw Ci = !1, n = Vu, Vu = null, n;
    return Bu & 1 && n.tag !== 0 && Co(), d = n.pendingLanes, d & 1 ? n === wo ? So++ : (So = 0, wo = n) : So = 0, _n(), null;
  }
  function Co() {
    if (Ei !== null) {
      var n = Vp(Bu), r = Rn.transition, l = Ie;
      try {
        if (Rn.transition = null, Ie = 16 > n ? 16 : n, Ei === null) var u = !1;
        else {
          if (n = Ei, Ei = null, Bu = 0, Oe & 6) throw Error(k(331));
          var c = Oe;
          for (Oe |= 4, J = n.current; J !== null; ) {
            var d = J, h = d.child;
            if (J.flags & 16) {
              var g = d.deletions;
              if (g !== null) {
                for (var w = 0; w < g.length; w++) {
                  var M = g[w];
                  for (J = M; J !== null; ) {
                    var H = J;
                    switch (H.tag) {
                      case 0:
                      case 11:
                      case 15:
                        ho(8, H, d);
                    }
                    var F = H.child;
                    if (F !== null) F.return = H, J = F;
                    else for (; J !== null; ) {
                      H = J;
                      var A = H.sibling, X = H.return;
                      if (Yv(H), H === M) {
                        J = null;
                        break;
                      }
                      if (A !== null) {
                        A.return = X, J = A;
                        break;
                      }
                      J = X;
                    }
                  }
                }
                var te = d.alternate;
                if (te !== null) {
                  var re = te.child;
                  if (re !== null) {
                    te.child = null;
                    do {
                      var Mt = re.sibling;
                      re.sibling = null, re = Mt;
                    } while (re !== null);
                  }
                }
                J = d;
              }
            }
            if (d.subtreeFlags & 2064 && h !== null) h.return = d, J = h;
            else e: for (; J !== null; ) {
              if (d = J, d.flags & 2048) switch (d.tag) {
                case 0:
                case 11:
                case 15:
                  ho(9, d, d.return);
              }
              var b = d.sibling;
              if (b !== null) {
                b.return = d.return, J = b;
                break e;
              }
              J = d.return;
            }
          }
          var E = n.current;
          for (J = E; J !== null; ) {
            h = J;
            var D = h.child;
            if (h.subtreeFlags & 2064 && D !== null) D.return = h, J = D;
            else e: for (h = E; J !== null; ) {
              if (g = J, g.flags & 2048) try {
                switch (g.tag) {
                  case 0:
                  case 11:
                  case 15:
                    xc(9, g);
                }
              } catch ($) {
                Ct(g, g.return, $);
              }
              if (g === h) {
                J = null;
                break e;
              }
              var V = g.sibling;
              if (V !== null) {
                V.return = g.return, J = V;
                break e;
              }
              J = g.return;
            }
          }
          if (Oe = c, _n(), Zr && typeof Zr.onPostCommitFiberRoot == "function") try {
            Zr.onPostCommitFiberRoot($o, n);
          } catch {
          }
          u = !0;
        }
        return u;
      } finally {
        Ie = l, Rn.transition = r;
      }
    }
    return !1;
  }
  function Zv(n, r, l) {
    r = Si(l, r), r = zu(n, r, 1), n = hi(n, r, 1), r = ot(), n !== null && (Xo(n, 1, r), en(n, r));
  }
  function Ct(n, r, l) {
    if (n.tag === 3) Zv(n, n, l);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        Zv(r, n, l);
        break;
      } else if (r.tag === 1) {
        var u = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof u.componentDidCatch == "function" && (Hr === null || !Hr.has(u))) {
          n = Si(l, n), n = Hv(r, n, 1), r = hi(r, n, 1), n = ot(), r !== null && (Xo(r, 1, n), en(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function Ed(n, r, l) {
    var u = n.pingCache;
    u !== null && u.delete(r), r = ot(), n.pingedLanes |= n.suspendedLanes & l, Vt === n && (un & l) === l && ($t === 4 || $t === 3 && (un & 130023424) === un && 500 > Rt() - gd ? fl(n, 0) : ju |= l), en(n, r);
  }
  function Jv(n, r) {
    r === 0 && (n.mode & 1 ? (r = Vl, Vl <<= 1, !(Vl & 130023424) && (Vl = 4194304)) : r = 1);
    var l = ot();
    n = Ca(n, r), n !== null && (Xo(n, r, l), en(n, l));
  }
  function gy(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), Jv(n, l);
  }
  function Sy(n, r) {
    var l = 0;
    switch (n.tag) {
      case 13:
        var u = n.stateNode, c = n.memoizedState;
        c !== null && (l = c.retryLane);
        break;
      case 19:
        u = n.stateNode;
        break;
      default:
        throw Error(k(314));
    }
    u !== null && u.delete(r), Jv(n, l);
  }
  var xd;
  xd = function(n, r, l) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || Ht.current) Jt = !0;
    else {
      if (!(n.lanes & l) && !(r.flags & 128)) return Jt = !1, Ec(n, r, l);
      Jt = !!(n.flags & 131072);
    }
    else Jt = !1, st && r.flags & 1048576 && bv(r, di, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var u = r.type;
        Ur(n, r), n = r.pendingProps;
        var c = cr(r, ft.current);
        io(r, l), c = de(null, r, u, n, c, l);
        var d = mi();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, wt(u) ? (d = !0, Wi(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, vi(r), c.updater = pc, r.stateNode = c, c._reactInternals = r, od(r, u, n, l), r = fd(null, r, u, !0, d, l)) : (r.tag = 0, st && d && Qf(r), Dt(null, r, c, l), r = r.child), r;
      case 16:
        u = r.elementType;
        e: {
          switch (Ur(n, r), n = r.pendingProps, c = u._init, u = c(u._payload), r.type = u, c = r.tag = Cy(u), n = Kn(u, n), c) {
            case 0:
              r = yc(null, r, u, n, l);
              break e;
            case 1:
              r = dy(null, r, u, n, l);
              break e;
            case 11:
              r = mc(null, r, u, n, l);
              break e;
            case 14:
              r = Zn(null, r, u, Kn(u.type, n), l);
              break e;
          }
          throw Error(k(
            306,
            u,
            ""
          ));
        }
        return r;
      case 0:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : Kn(u, c), yc(n, r, u, c, l);
      case 1:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : Kn(u, c), dy(n, r, u, c, l);
      case 3:
        e: {
          if (gc(r), n === null) throw Error(k(387));
          u = r.pendingProps, d = r.memoizedState, c = d.element, Mv(n, r), Ws(r, u, null, l);
          var h = r.memoizedState;
          if (u = h.element, d.isDehydrated) if (d = { element: u, isDehydrated: !1, cache: h.cache, pendingSuspenseBoundaries: h.pendingSuspenseBoundaries, transitions: h.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
            c = Si(Error(k(423)), r), r = po(n, r, u, l, c);
            break e;
          } else if (u !== c) {
            c = Si(Error(k(424)), r), r = po(n, r, u, l, c);
            break e;
          } else for (Wn = ta(r.stateNode.containerInfo.firstChild), Gn = r, st = !0, ra = null, l = an(r, null, u, l), r.child = l; l; ) l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (Va(), u === c) {
              r = ln(n, r, l);
              break e;
            }
            Dt(n, r, u, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return nd(r), n === null && Wf(r), u = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, h = c.children, $i(u, c) ? h = null : d !== null && $i(u, d) && (r.flags |= 32), Ou(n, r), Dt(n, r, h, l), r.child;
      case 6:
        return n === null && Wf(r), null;
      case 13:
        return jv(n, r, l);
      case 4:
        return td(r, r.stateNode.containerInfo), u = r.pendingProps, n === null ? r.child = aa(r, null, u, l) : Dt(n, r, u, l), r.child;
      case 11:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : Kn(u, c), mc(n, r, u, c, l);
      case 7:
        return Dt(n, r, r.pendingProps, l), r.child;
      case 8:
        return Dt(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return Dt(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (u = r.type._context, c = r.pendingProps, d = r.memoizedProps, h = c.value, lt(Q, u._currentValue), u._currentValue = h, d !== null) if (ea(d.value, h)) {
            if (d.children === c.children && !Ht.current) {
              r = ln(n, r, l);
              break e;
            }
          } else for (d = r.child, d !== null && (d.return = r); d !== null; ) {
            var g = d.dependencies;
            if (g !== null) {
              h = d.child;
              for (var w = g.firstContext; w !== null; ) {
                if (w.context === u) {
                  if (d.tag === 1) {
                    w = Ba(-1, l & -l), w.tag = 2;
                    var M = d.updateQueue;
                    if (M !== null) {
                      M = M.shared;
                      var H = M.pending;
                      H === null ? w.next = w : (w.next = H.next, H.next = w), M.pending = w;
                    }
                  }
                  d.lanes |= l, w = d.alternate, w !== null && (w.lanes |= l), Zf(
                    d.return,
                    l,
                    r
                  ), g.lanes |= l;
                  break;
                }
                w = w.next;
              }
            } else if (d.tag === 10) h = d.type === r.type ? null : d.child;
            else if (d.tag === 18) {
              if (h = d.return, h === null) throw Error(k(341));
              h.lanes |= l, g = h.alternate, g !== null && (g.lanes |= l), Zf(h, l, r), h = d.sibling;
            } else h = d.child;
            if (h !== null) h.return = d;
            else for (h = d; h !== null; ) {
              if (h === r) {
                h = null;
                break;
              }
              if (d = h.sibling, d !== null) {
                d.return = h.return, h = d;
                break;
              }
              h = h.return;
            }
            d = h;
          }
          Dt(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, u = r.pendingProps.children, io(r, l), c = Ke(c), u = u(c), r.flags |= 1, Dt(n, r, u, l), r.child;
      case 14:
        return u = r.type, c = Kn(u, r.pendingProps), c = Kn(u.type, c), Zn(n, r, u, c, l);
      case 15:
        return rl(n, r, r.type, r.pendingProps, l);
      case 17:
        return u = r.type, c = r.pendingProps, c = r.elementType === u ? c : Kn(u, c), Ur(n, r), r.tag = 1, wt(u) ? (n = !0, Wi(r)) : n = !1, io(r, l), Av(r, u, c), od(r, u, c, l), fd(null, r, u, !0, n, l);
      case 19:
        return Jn(n, r, l);
      case 22:
        return xe(n, r, l);
    }
    throw Error(k(156, r.tag));
  };
  function eh(n, r) {
    return Op(n, r);
  }
  function wy(n, r, l, u) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = u, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Fr(n, r, l, u) {
    return new wy(n, r, l, u);
  }
  function bd(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function Cy(n) {
    if (typeof n == "function") return bd(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === bt) return 11;
      if (n === kn) return 14;
    }
    return 2;
  }
  function bi(n, r) {
    var l = n.alternate;
    return l === null ? (l = Fr(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Lc(n, r, l, u, c, d) {
    var h = 2;
    if (u = n, typeof n == "function") bd(n) && (h = 1);
    else if (typeof n == "string") h = 5;
    else e: switch (n) {
      case vt:
        return Ti(l.children, c, d, r);
      case Ue:
        h = 8, c |= 8;
        break;
      case Er:
        return n = Fr(12, l, r, c | 2), n.elementType = Er, n.lanes = d, n;
      case at:
        return n = Fr(13, l, r, c), n.elementType = at, n.lanes = d, n;
      case Ae:
        return n = Fr(19, l, r, c), n.elementType = Ae, n.lanes = d, n;
      case Bn:
        return Eo(l, c, d, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case xt:
            h = 10;
            break e;
          case qt:
            h = 9;
            break e;
          case bt:
            h = 11;
            break e;
          case kn:
            h = 14;
            break e;
          case mt:
            h = 16, u = null;
            break e;
        }
        throw Error(k(130, n == null ? n : typeof n, ""));
    }
    return r = Fr(h, l, r, c), r.elementType = n, r.type = u, r.lanes = d, r;
  }
  function Ti(n, r, l, u) {
    return n = Fr(7, n, u, r), n.lanes = l, n;
  }
  function Eo(n, r, l, u) {
    return n = Fr(22, n, u, r), n.elementType = Bn, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function pl(n, r, l) {
    return n = Fr(6, n, null, r), n.lanes = l, n;
  }
  function Td(n, r, l) {
    return r = Fr(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function th(n, r, l, u, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Wo(0), this.expirationTimes = Wo(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Wo(0), this.identifierPrefix = u, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function zc(n, r, l, u, c, d, h, g, w) {
    return n = new th(n, r, l, g, w), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = Fr(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: u, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, vi(d), n;
  }
  function nh(n, r, l) {
    var u = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: _e, key: u == null ? null : "" + u, children: n, containerInfo: r, implementation: l };
  }
  function rh(n) {
    if (!n) return Re;
    n = n._reactInternals;
    e: {
      if (va(n) !== n || n.tag !== 1) throw Error(k(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (wt(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(k(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (wt(l)) return xv(n, l, r);
    }
    return r;
  }
  function Rd(n, r, l, u, c, d, h, g, w) {
    return n = zc(l, u, !0, n, c, d, h, g, w), n.context = rh(null), l = n.current, u = ot(), c = vr(l), d = Ba(u, c), d.callback = r ?? null, hi(l, d, c), n.current.lanes = c, Xo(n, c, u), en(n, u), n;
  }
  function Oc(n, r, l, u) {
    var c = r.current, d = ot(), h = vr(c);
    return l = rh(l), r.context === null ? r.context = l : r.pendingContext = l, r = Ba(d, h), r.payload = { element: n }, u = u === void 0 ? null : u, u !== null && (r.callback = u), n = hi(c, r, h), n !== null && (hr(n, c, h, d), Gs(n, c, h)), h;
  }
  function Nc(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function ah(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function Uc(n, r) {
    ah(n, r), (n = n.alternate) && ah(n, r);
  }
  function ih() {
    return null;
  }
  var kd = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Ri(n) {
    this._internalRoot = n;
  }
  Ac.prototype.render = Ri.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(k(409));
    Oc(n, r, null, null);
  }, Ac.prototype.unmount = Ri.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      cl(function() {
        Oc(null, n, null, null);
      }), r[Fa] = null;
    }
  };
  function Ac(n) {
    this._internalRoot = n;
  }
  Ac.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = bf();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < ii.length && r !== 0 && r < ii[l].priority; l++) ;
      ii.splice(l, 0, n), l === 0 && xs(n);
    }
  };
  function Dd(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function Hc(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function lh() {
  }
  function Ey(n, r, l, u, c) {
    if (c) {
      if (typeof u == "function") {
        var d = u;
        u = function() {
          var M = Nc(h);
          d.call(M);
        };
      }
      var h = Rd(r, u, n, 0, null, !1, !1, "", lh);
      return n._reactRootContainer = h, n[Fa] = h.current, pu(n.nodeType === 8 ? n.parentNode : n), cl(), h;
    }
    for (; c = n.lastChild; ) n.removeChild(c);
    if (typeof u == "function") {
      var g = u;
      u = function() {
        var M = Nc(w);
        g.call(M);
      };
    }
    var w = zc(n, 0, !1, null, null, !1, !1, "", lh);
    return n._reactRootContainer = w, n[Fa] = w.current, pu(n.nodeType === 8 ? n.parentNode : n), cl(function() {
      Oc(r, w, l, u);
    }), w;
  }
  function Fc(n, r, l, u, c) {
    var d = l._reactRootContainer;
    if (d) {
      var h = d;
      if (typeof c == "function") {
        var g = c;
        c = function() {
          var w = Nc(h);
          g.call(w);
        };
      }
      Oc(r, h, n, c);
    } else h = Ey(l, r, n, c, u);
    return Nc(h);
  }
  xf = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = Dr(r.pendingLanes);
          l !== 0 && (Ef(r, l | 1), en(r, Rt()), !(Oe & 6) && (go = Rt() + 500, _n()));
        }
        break;
      case 13:
        cl(function() {
          var u = Ca(n, 1);
          if (u !== null) {
            var c = ot();
            hr(u, n, 1, c);
          }
        }), Uc(n, 1);
    }
  }, $e = function(n) {
    if (n.tag === 13) {
      var r = Ca(n, 134217728);
      if (r !== null) {
        var l = ot();
        hr(r, n, 134217728, l);
      }
      Uc(n, 134217728);
    }
  }, Bp = function(n) {
    if (n.tag === 13) {
      var r = vr(n), l = Ca(n, r);
      if (l !== null) {
        var u = ot();
        hr(l, n, r, u);
      }
      Uc(n, r);
    }
  }, bf = function() {
    return Ie;
  }, Ee = function(n, r) {
    var l = Ie;
    try {
      return Ie = n, r();
    } finally {
      Ie = l;
    }
  }, yt = function(n, r, l) {
    switch (r) {
      case "input":
        if (Wr(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; ) l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var u = l[r];
            if (u !== n && u.form === n.form) {
              var c = ja(u);
              if (!c) throw Error(k(90));
              Yn(u), Wr(u, c);
            }
          }
        }
        break;
      case "textarea":
        qr(n, l);
        break;
      case "select":
        r = l.value, r != null && ti(n, !!l.multiple, r, !1);
    }
  }, Mp = Dc, yf = cl;
  var oh = { usingClientEntryPoint: !1, Events: [yu, le, ja, gs, _p, Dc] }, Gu = { findFiberByHostInstance: Gi, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, xy = { bundleType: Gu.bundleType, version: Gu.version, rendererPackageName: Gu.rendererPackageName, rendererConfig: Gu.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: Te.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = zp(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: Gu.findFiberByHostInstance || ih, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Wu = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Wu.isDisabled && Wu.supportsFiber) try {
      $o = Wu.inject(xy), Zr = Wu;
    } catch {
    }
  }
  return Qr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = oh, Qr.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Dd(r)) throw Error(k(200));
    return nh(n, r, null, l);
  }, Qr.createRoot = function(n, r) {
    if (!Dd(n)) throw Error(k(299));
    var l = !1, u = "", c = kd;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (u = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = zc(n, 1, !1, null, null, l, !1, u, c), n[Fa] = r.current, pu(n.nodeType === 8 ? n.parentNode : n), new Ri(r);
  }, Qr.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(k(188)) : (n = Object.keys(n).join(","), Error(k(268, n)));
    return n = zp(r), n = n === null ? null : n.stateNode, n;
  }, Qr.flushSync = function(n) {
    return cl(n);
  }, Qr.hydrate = function(n, r, l) {
    if (!Hc(r)) throw Error(k(200));
    return Fc(null, n, r, !0, l);
  }, Qr.hydrateRoot = function(n, r, l) {
    if (!Dd(n)) throw Error(k(405));
    var u = l != null && l.hydratedSources || null, c = !1, d = "", h = kd;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (h = l.onRecoverableError)), r = Rd(r, null, n, 1, l ?? null, c, !1, d, h), n[Fa] = r.current, pu(n), u) for (n = 0; n < u.length; n++) l = u[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
      l,
      c
    );
    return new Ac(r);
  }, Qr.render = function(n, r, l) {
    if (!Hc(r)) throw Error(k(200));
    return Fc(null, n, r, !1, l);
  }, Qr.unmountComponentAtNode = function(n) {
    if (!Hc(n)) throw Error(k(40));
    return n._reactRootContainer ? (cl(function() {
      Fc(null, null, n, !1, function() {
        n._reactRootContainer = null, n[Fa] = null;
      });
    }), !0) : !1;
  }, Qr.unstable_batchedUpdates = Dc, Qr.unstable_renderSubtreeIntoContainer = function(n, r, l, u) {
    if (!Hc(l)) throw Error(k(200));
    if (n == null || n._reactInternals === void 0) throw Error(k(38));
    return Fc(n, r, l, !1, u);
  }, Qr.version = "18.3.1-next-f1338f8080-20240426", Qr;
}
var Ir = {}, uE;
function uD() {
  if (uE) return Ir;
  uE = 1;
  var B = {};
  /**
   * @license React
   * react-dom.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  return B.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var he = cE, k = fE(), ke = he.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Xt = !1;
    function Et(e) {
      Xt = e;
    }
    function zt(e) {
      if (!Xt) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        nn("warn", e, a);
      }
    }
    function S(e) {
      if (!Xt) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        nn("error", e, a);
      }
    }
    function nn(e, t, a) {
      {
        var i = ke.ReactDebugCurrentFrame, o = i.getStackAddendum();
        o !== "" && (t += "%s", a = a.concat([o]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var be = 0, me = 1, Je = 2, ee = 3, Ve = 4, ae = 5, ge = 6, rt = 7, $r = 8, Cr = 9, yn = 10, Te = 11, Ot = 12, _e = 13, vt = 14, Ue = 15, Er = 16, xt = 17, qt = 18, bt = 19, at = 21, Ae = 22, kn = 23, mt = 24, Bn = 25, W = !0, ue = !1, Z = !1, Qe = !1, Xe = !1, xr = !0, Pn = !0, za = !0, lr = !0, Oa = /* @__PURE__ */ new Set(), gn = {}, _l = {};
    function Na(e, t) {
      Gr(e, t), Gr(e + "Capture", t);
    }
    function Gr(e, t) {
      gn[e] && S("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), gn[e] = t;
      {
        var a = e.toLowerCase();
        _l[a] = e, e === "onDoubleClick" && (_l.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        Oa.add(t[i]);
    }
    var Yn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", br = Object.prototype.hasOwnProperty;
    function or(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function Tr(e) {
      try {
        return Rr(e), !1;
      } catch {
        return !0;
      }
    }
    function Rr(e) {
      return "" + e;
    }
    function Wr(e, t) {
      if (Tr(e))
        return S("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, or(e)), Rr(e);
    }
    function Bo(e) {
      if (Tr(e))
        return S("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", or(e)), Rr(e);
    }
    function Ml(e, t) {
      if (Tr(e))
        return S("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, or(e)), Rr(e);
    }
    function ji(e, t) {
      if (Tr(e))
        return S("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, or(e)), Rr(e);
    }
    function ti(e) {
      if (Tr(e))
        return S("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", or(e)), Rr(e);
    }
    function fa(e) {
      if (Tr(e))
        return S("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", or(e)), Rr(e);
    }
    var Xr = 0, qr = 1, Ll = 2, ur = 3, Kr = 4, ni = 5, Po = 6, ri = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", Y = ri + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", pe = new RegExp("^[" + ri + "][" + Y + "]*$"), Me = {}, it = {};
    function Tt(e) {
      return br.call(it, e) ? !0 : br.call(Me, e) ? !1 : pe.test(e) ? (it[e] = !0, !0) : (Me[e] = !0, S("Invalid attribute name: `%s`", e), !1);
    }
    function Sn(e, t, a) {
      return t !== null ? t.type === Xr : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function Nt(e, t, a, i) {
      if (a !== null && a.type === Xr)
        return !1;
      switch (typeof t) {
        case "function":
        case "symbol":
          return !0;
        case "boolean": {
          if (i)
            return !1;
          if (a !== null)
            return !a.acceptsBooleans;
          var o = e.toLowerCase().slice(0, 5);
          return o !== "data-" && o !== "aria-";
        }
        default:
          return !1;
      }
    }
    function Qn(e, t, a, i) {
      if (t === null || typeof t > "u" || Nt(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case ur:
            return !t;
          case Kr:
            return t === !1;
          case ni:
            return isNaN(t);
          case Po:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function Ut(e) {
      return gt.hasOwnProperty(e) ? gt[e] : null;
    }
    function yt(e, t, a, i, o, s, f) {
      this.acceptsBooleans = t === Ll || t === ur || t === Kr, this.attributeName = i, this.attributeNamespace = o, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var gt = {}, zl = [
      "children",
      "dangerouslySetInnerHTML",
      // TODO: This prevents the assignment of defaultValue to regular
      // elements (not just inputs). Now that ReactDOMInput assigns to the
      // defaultValue property -- do we need this?
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style"
    ];
    zl.forEach(function(e) {
      gt[e] = new yt(
        e,
        Xr,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
      var t = e[0], a = e[1];
      gt[t] = new yt(
        t,
        qr,
        !1,
        // mustUseProperty
        a,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
      gt[e] = new yt(
        e,
        Ll,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
      gt[e] = new yt(
        e,
        Ll,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "allowFullScreen",
      "async",
      // Note: there is a special case that prevents it from being written to the DOM
      // on the client side because the browsers are inconsistent. Instead we call focus().
      "autoFocus",
      "autoPlay",
      "controls",
      "default",
      "defer",
      "disabled",
      "disablePictureInPicture",
      "disableRemotePlayback",
      "formNoValidate",
      "hidden",
      "loop",
      "noModule",
      "noValidate",
      "open",
      "playsInline",
      "readOnly",
      "required",
      "reversed",
      "scoped",
      "seamless",
      // Microdata
      "itemScope"
    ].forEach(function(e) {
      gt[e] = new yt(
        e,
        ur,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "checked",
      // Note: `option.selected` is not updated if `select.multiple` is
      // disabled with `removeAttribute`. We have special logic for handling this.
      "multiple",
      "muted",
      "selected"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      gt[e] = new yt(
        e,
        ur,
        !0,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "capture",
      "download"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      gt[e] = new yt(
        e,
        Kr,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "cols",
      "rows",
      "size",
      "span"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      gt[e] = new yt(
        e,
        Po,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["rowSpan", "start"].forEach(function(e) {
      gt[e] = new yt(
        e,
        ni,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var ys = /[\-\:]([a-z])/g, gs = function(e) {
      return e[1].toUpperCase();
    };
    [
      "accent-height",
      "alignment-baseline",
      "arabic-form",
      "baseline-shift",
      "cap-height",
      "clip-path",
      "clip-rule",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "dominant-baseline",
      "enable-background",
      "fill-opacity",
      "fill-rule",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "glyph-name",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "horiz-adv-x",
      "horiz-origin-x",
      "image-rendering",
      "letter-spacing",
      "lighting-color",
      "marker-end",
      "marker-mid",
      "marker-start",
      "overline-position",
      "overline-thickness",
      "paint-order",
      "panose-1",
      "pointer-events",
      "rendering-intent",
      "shape-rendering",
      "stop-color",
      "stop-opacity",
      "strikethrough-position",
      "strikethrough-thickness",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "underline-position",
      "underline-thickness",
      "unicode-bidi",
      "unicode-range",
      "units-per-em",
      "v-alphabetic",
      "v-hanging",
      "v-ideographic",
      "v-mathematical",
      "vector-effect",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "word-spacing",
      "writing-mode",
      "xmlns:xlink",
      "x-height"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(ys, gs);
      gt[t] = new yt(
        t,
        qr,
        !1,
        // mustUseProperty
        e,
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xlink:actuate",
      "xlink:arcrole",
      "xlink:role",
      "xlink:show",
      "xlink:title",
      "xlink:type"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(ys, gs);
      gt[t] = new yt(
        t,
        qr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/1999/xlink",
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xml:base",
      "xml:lang",
      "xml:space"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(ys, gs);
      gt[t] = new yt(
        t,
        qr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      gt[e] = new yt(
        e,
        qr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var _p = "xlinkHref";
    gt[_p] = new yt(
      "xlinkHref",
      qr,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      gt[e] = new yt(
        e,
        qr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !0,
        // sanitizeURL
        !0
      );
    });
    var Mp = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, yf = !1;
    function Ss(e) {
      !yf && Mp.test(e) && (yf = !0, S("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function Lp(e, t, a, i) {
      if (i.mustUseProperty) {
        var o = i.propertyName;
        return e[o];
      } else {
        Wr(a, t), i.sanitizeURL && Ss("" + a);
        var s = i.attributeName, f = null;
        if (i.type === Kr) {
          if (e.hasAttribute(s)) {
            var p = e.getAttribute(s);
            return p === "" ? !0 : Qn(t, a, i, !1) ? p : p === "" + a ? a : p;
          }
        } else if (e.hasAttribute(s)) {
          if (Qn(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === ur)
            return a;
          f = e.getAttribute(s);
        }
        return Qn(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function Ol(e, t, a, i) {
      {
        if (!Tt(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var o = e.getAttribute(t);
        return Wr(a, t), o === "" + a ? a : o;
      }
    }
    function Yo(e, t, a, i) {
      var o = Ut(t);
      if (!Sn(t, o, i)) {
        if (Qn(t, a, o, i) && (a = null), i || o === null) {
          if (Tt(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : (Wr(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var f = o.mustUseProperty;
        if (f) {
          var p = o.propertyName;
          if (a === null) {
            var v = o.type;
            e[p] = v === ur ? !1 : "";
          } else
            e[p] = a;
          return;
        }
        var m = o.attributeName, y = o.attributeNamespace;
        if (a === null)
          e.removeAttribute(m);
        else {
          var x = o.type, C;
          x === ur || x === Kr && a === !0 ? C = "" : (Wr(a, m), C = "" + a, o.sanitizeURL && Ss(C.toString())), y ? e.setAttributeNS(y, m, C) : e.setAttribute(m, C);
        }
      }
    }
    var da = Symbol.for("react.element"), Vi = Symbol.for("react.portal"), pa = Symbol.for("react.fragment"), Nl = Symbol.for("react.strict_mode"), Ul = Symbol.for("react.profiler"), Qo = Symbol.for("react.provider"), gf = Symbol.for("react.context"), Al = Symbol.for("react.forward_ref"), ws = Symbol.for("react.suspense"), va = Symbol.for("react.suspense_list"), Hl = Symbol.for("react.memo"), wn = Symbol.for("react.lazy"), Bm = Symbol.for("react.scope"), zp = Symbol.for("react.debug_trace_mode"), Sf = Symbol.for("react.offscreen"), Op = Symbol.for("react.legacy_hidden"), Np = Symbol.for("react.cache"), Pm = Symbol.for("react.tracing_marker"), Up = Symbol.iterator, Rt = "@@iterator";
    function Bi(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Up && e[Up] || e[Rt];
      return typeof t == "function" ? t : null;
    }
    var Le = Object.assign, Fl = 0, Io, Ap, wf, $o, Zr, Hp, kr;
    function Fp() {
    }
    Fp.__reactDisabledLog = !0;
    function Ym() {
      {
        if (Fl === 0) {
          Io = console.log, Ap = console.info, wf = console.warn, $o = console.error, Zr = console.group, Hp = console.groupCollapsed, kr = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Fp,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        Fl++;
      }
    }
    function Qm() {
      {
        if (Fl--, Fl === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Le({}, e, {
              value: Io
            }),
            info: Le({}, e, {
              value: Ap
            }),
            warn: Le({}, e, {
              value: wf
            }),
            error: Le({}, e, {
              value: $o
            }),
            group: Le({}, e, {
              value: Zr
            }),
            groupCollapsed: Le({}, e, {
              value: Hp
            }),
            groupEnd: Le({}, e, {
              value: kr
            })
          });
        }
        Fl < 0 && S("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var jl = ke.ReactCurrentDispatcher, Vl;
    function Dr(e, t, a) {
      {
        if (Vl === void 0)
          try {
            throw Error();
          } catch (o) {
            var i = o.stack.trim().match(/\n( *(at )?)/);
            Vl = i && i[1] || "";
          }
        return `
` + Vl + e;
      }
    }
    var Bl = !1, Cs;
    {
      var Im = typeof WeakMap == "function" ? WeakMap : Map;
      Cs = new Im();
    }
    function Go(e, t) {
      if (!e || Bl)
        return "";
      {
        var a = Cs.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      Bl = !0;
      var o = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = jl.current, jl.current = null, Ym();
      try {
        if (t) {
          var f = function() {
            throw Error();
          };
          if (Object.defineProperty(f.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(f, []);
            } catch (L) {
              i = L;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (L) {
              i = L;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (L) {
            i = L;
          }
          e();
        }
      } catch (L) {
        if (L && i && typeof L.stack == "string") {
          for (var p = L.stack.split(`
`), v = i.stack.split(`
`), m = p.length - 1, y = v.length - 1; m >= 1 && y >= 0 && p[m] !== v[y]; )
            y--;
          for (; m >= 1 && y >= 0; m--, y--)
            if (p[m] !== v[y]) {
              if (m !== 1 || y !== 1)
                do
                  if (m--, y--, y < 0 || p[m] !== v[y]) {
                    var x = `
` + p[m].replace(" at new ", " at ");
                    return e.displayName && x.includes("<anonymous>") && (x = x.replace("<anonymous>", e.displayName)), typeof e == "function" && Cs.set(e, x), x;
                  }
                while (m >= 1 && y >= 0);
              break;
            }
        }
      } finally {
        Bl = !1, jl.current = s, Qm(), Error.prepareStackTrace = o;
      }
      var C = e ? e.displayName || e.name : "", _ = C ? Dr(C) : "";
      return typeof e == "function" && Cs.set(e, _), _;
    }
    function jp(e, t, a) {
      return Go(e, !0);
    }
    function Wo(e, t, a) {
      return Go(e, !1);
    }
    function Xo(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function Cf(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return Go(e, Xo(e));
      if (typeof e == "string")
        return Dr(e);
      switch (e) {
        case ws:
          return Dr("Suspense");
        case va:
          return Dr("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case Al:
            return Wo(e.render);
          case Hl:
            return Cf(e.type, t, a);
          case wn: {
            var i = e, o = i._payload, s = i._init;
            try {
              return Cf(s(o), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function Ef(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case ae:
          return Dr(e.type);
        case Er:
          return Dr("Lazy");
        case _e:
          return Dr("Suspense");
        case bt:
          return Dr("SuspenseList");
        case be:
        case Je:
        case Ue:
          return Wo(e.type);
        case Te:
          return Wo(e.type.render);
        case me:
          return jp(e.type);
        default:
          return "";
      }
    }
    function Ie(e) {
      try {
        var t = "", a = e;
        do
          t += Ef(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function Vp(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var o = t.displayName || t.name || "";
      return o !== "" ? a + "(" + o + ")" : a;
    }
    function xf(e) {
      return e.displayName || "Context";
    }
    function $e(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && S("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case pa:
          return "Fragment";
        case Vi:
          return "Portal";
        case Ul:
          return "Profiler";
        case Nl:
          return "StrictMode";
        case ws:
          return "Suspense";
        case va:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case gf:
            var t = e;
            return xf(t) + ".Consumer";
          case Qo:
            var a = e;
            return xf(a._context) + ".Provider";
          case Al:
            return Vp(e, e.render, "ForwardRef");
          case Hl:
            var i = e.displayName || null;
            return i !== null ? i : $e(e.type) || "Memo";
          case wn: {
            var o = e, s = o._payload, f = o._init;
            try {
              return $e(f(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Bp(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function bf(e) {
      return e.displayName || "Context";
    }
    function Ee(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case mt:
          return "Cache";
        case Cr:
          var i = a;
          return bf(i) + ".Consumer";
        case yn:
          var o = a;
          return bf(o._context) + ".Provider";
        case qt:
          return "DehydratedFragment";
        case Te:
          return Bp(a, a.render, "ForwardRef");
        case rt:
          return "Fragment";
        case ae:
          return a;
        case Ve:
          return "Portal";
        case ee:
          return "Root";
        case ge:
          return "Text";
        case Er:
          return $e(a);
        case $r:
          return a === Nl ? "StrictMode" : "Mode";
        case Ae:
          return "Offscreen";
        case Ot:
          return "Profiler";
        case at:
          return "Scope";
        case _e:
          return "Suspense";
        case bt:
          return "SuspenseList";
        case Bn:
          return "TracingMarker";
        case me:
        case be:
        case xt:
        case Je:
        case vt:
        case Ue:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var Es = ke.ReactDebugCurrentFrame, Cn = null, _r = !1;
    function Mr() {
      {
        if (Cn === null)
          return null;
        var e = Cn._debugOwner;
        if (e !== null && typeof e < "u")
          return Ee(e);
      }
      return null;
    }
    function ai() {
      return Cn === null ? "" : Ie(Cn);
    }
    function Pt() {
      Es.getCurrentStack = null, Cn = null, _r = !1;
    }
    function ut(e) {
      Es.getCurrentStack = e === null ? null : ai, Cn = e, _r = !1;
    }
    function ii() {
      return Cn;
    }
    function ha(e) {
      _r = e;
    }
    function sr(e) {
      return "" + e;
    }
    function Lr(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return fa(e), e;
        default:
          return "";
      }
    }
    var $m = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function xs(e, t) {
      $m[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || S("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || S("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function qo(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function Tf(e) {
      return e._valueTracker;
    }
    function Gm(e) {
      e._valueTracker = null;
    }
    function Ko(e) {
      var t = "";
      return e && (qo(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function Zo(e) {
      var t = qo(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      fa(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var o = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return o.call(this);
          },
          set: function(p) {
            fa(p), i = "" + p, s.call(this, p);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(p) {
            fa(p), i = "" + p;
          },
          stopTracking: function() {
            Gm(e), delete e[t];
          }
        };
        return f;
      }
    }
    function Ua(e) {
      Tf(e) || (e._valueTracker = Zo(e));
    }
    function Jo(e) {
      if (!e)
        return !1;
      var t = Tf(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = Ko(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function bs(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var Pp = !1, Ts = !1, eu = !1, Rs = !1;
    function Rf(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function ma(e, t) {
      var a = e, i = t.checked, o = Le({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return o;
    }
    function ks(e, t) {
      xs("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !Ts && (S("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Mr() || "A component", t.type), Ts = !0), t.value !== void 0 && t.defaultValue !== void 0 && !Pp && (S("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Mr() || "A component", t.type), Pp = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: Lr(t.value != null ? t.value : i),
        controlled: Rf(t)
      };
    }
    function tu(e, t) {
      var a = e, i = t.checked;
      i != null && Yo(a, "checked", i, !1);
    }
    function Ds(e, t) {
      var a = e;
      {
        var i = Rf(t);
        !a._wrapperState.controlled && i && !Rs && (S("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Rs = !0), a._wrapperState.controlled && !i && !eu && (S("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), eu = !0);
      }
      tu(e, t);
      var o = Lr(t.value), s = t.type;
      if (o != null)
        s === "number" ? (o === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != o) && (a.value = sr(o)) : a.value !== sr(o) && (a.value = sr(o));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Dn(a, t.type, o) : t.hasOwnProperty("defaultValue") && Dn(a, t.type, Lr(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function nu(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var o = t.type, s = o === "submit" || o === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = sr(i._wrapperState.initialValue);
        a || f !== i.value && (i.value = f), i.defaultValue = f;
      }
      var p = i.name;
      p !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, p !== "" && (i.name = p);
    }
    function _s(e, t) {
      var a = e;
      Ds(a, t), Yp(a, t);
    }
    function Yp(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        Wr(a, "name");
        for (var o = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < o.length; s++) {
          var f = o[s];
          if (!(f === e || f.form !== e.form)) {
            var p = bh(f);
            if (!p)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            Jo(f), Ds(f, p);
          }
        }
      }
    }
    function Dn(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || bs(e.ownerDocument) !== e) && (a == null ? e.defaultValue = sr(e._wrapperState.initialValue) : e.defaultValue !== sr(a) && (e.defaultValue = sr(a)));
    }
    var Pi = !1, Ms = !1, Pl = !1;
    function Qp(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? he.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || Ms || (Ms = !0, S("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (Pl || (Pl = !0, S("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !Pi && (S("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), Pi = !0);
    }
    function kf(e, t) {
      t.value != null && e.setAttribute("value", sr(Lr(t.value)));
    }
    var Df = Array.isArray;
    function Yt(e) {
      return Df(e);
    }
    var Yl;
    Yl = !1;
    function _f() {
      var e = Mr();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var Ip = ["value", "defaultValue"];
    function Wm(e) {
      {
        xs("select", e);
        for (var t = 0; t < Ip.length; t++) {
          var a = Ip[t];
          if (e[a] != null) {
            var i = Yt(e[a]);
            e.multiple && !i ? S("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, _f()) : !e.multiple && i && S("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, _f());
          }
        }
      }
    }
    function Ql(e, t, a, i) {
      var o = e.options;
      if (t) {
        for (var s = a, f = {}, p = 0; p < s.length; p++)
          f["$" + s[p]] = !0;
        for (var v = 0; v < o.length; v++) {
          var m = f.hasOwnProperty("$" + o[v].value);
          o[v].selected !== m && (o[v].selected = m), m && i && (o[v].defaultSelected = !0);
        }
      } else {
        for (var y = sr(Lr(a)), x = null, C = 0; C < o.length; C++) {
          if (o[C].value === y) {
            o[C].selected = !0, i && (o[C].defaultSelected = !0);
            return;
          }
          x === null && !o[C].disabled && (x = o[C]);
        }
        x !== null && (x.selected = !0);
      }
    }
    function ru(e, t) {
      return Le({}, t, {
        value: void 0
      });
    }
    function $p(e, t) {
      var a = e;
      Wm(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Yl && (S("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Yl = !0);
    }
    function Xm(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? Ql(a, !!t.multiple, i, !1) : t.defaultValue != null && Ql(a, !!t.multiple, t.defaultValue, !0);
    }
    function qm(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var o = t.value;
      o != null ? Ql(a, !!t.multiple, o, !1) : i !== !!t.multiple && (t.defaultValue != null ? Ql(a, !!t.multiple, t.defaultValue, !0) : Ql(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function Km(e, t) {
      var a = e, i = t.value;
      i != null && Ql(a, !!t.multiple, i, !1);
    }
    var Gp = !1;
    function Ls(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = Le({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: sr(a._wrapperState.initialValue)
      });
      return i;
    }
    function Wp(e, t) {
      var a = e;
      xs("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !Gp && (S("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Mr() || "A component"), Gp = !0);
      var i = t.value;
      if (i == null) {
        var o = t.children, s = t.defaultValue;
        if (o != null) {
          S("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (Yt(o)) {
              if (o.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              o = o[0];
            }
            s = o;
          }
        }
        s == null && (s = ""), i = s;
      }
      a._wrapperState = {
        initialValue: Lr(i)
      };
    }
    function Xp(e, t) {
      var a = e, i = Lr(t.value), o = Lr(t.defaultValue);
      if (i != null) {
        var s = sr(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      o != null && (a.defaultValue = sr(o));
    }
    function qp(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function Zm(e, t) {
      Xp(e, t);
    }
    var Jr = "http://www.w3.org/1999/xhtml", Jm = "http://www.w3.org/1998/Math/MathML", Mf = "http://www.w3.org/2000/svg";
    function Lf(e) {
      switch (e) {
        case "svg":
          return Mf;
        case "math":
          return Jm;
        default:
          return Jr;
      }
    }
    function zs(e, t) {
      return e == null || e === Jr ? Lf(t) : e === Mf && t === "foreignObject" ? Jr : e;
    }
    var ey = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, o) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, o);
        });
      } : e;
    }, Os, Kp = ey(function(e, t) {
      if (e.namespaceURI === Mf && !("innerHTML" in e)) {
        Os = Os || document.createElement("div"), Os.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = Os.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), In = 1, Aa = 3, At = 8, Ha = 9, au = 11, li = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Aa) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, ty = {
      animation: ["animationDelay", "animationDirection", "animationDuration", "animationFillMode", "animationIterationCount", "animationName", "animationPlayState", "animationTimingFunction"],
      background: ["backgroundAttachment", "backgroundClip", "backgroundColor", "backgroundImage", "backgroundOrigin", "backgroundPositionX", "backgroundPositionY", "backgroundRepeat", "backgroundSize"],
      backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
      border: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderBlockEnd: ["borderBlockEndColor", "borderBlockEndStyle", "borderBlockEndWidth"],
      borderBlockStart: ["borderBlockStartColor", "borderBlockStartStyle", "borderBlockStartWidth"],
      borderBottom: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth"],
      borderColor: ["borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor"],
      borderImage: ["borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth"],
      borderInlineEnd: ["borderInlineEndColor", "borderInlineEndStyle", "borderInlineEndWidth"],
      borderInlineStart: ["borderInlineStartColor", "borderInlineStartStyle", "borderInlineStartWidth"],
      borderLeft: ["borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
      borderRadius: ["borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"],
      borderRight: ["borderRightColor", "borderRightStyle", "borderRightWidth"],
      borderStyle: ["borderBottomStyle", "borderLeftStyle", "borderRightStyle", "borderTopStyle"],
      borderTop: ["borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderWidth: ["borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth"],
      columnRule: ["columnRuleColor", "columnRuleStyle", "columnRuleWidth"],
      columns: ["columnCount", "columnWidth"],
      flex: ["flexBasis", "flexGrow", "flexShrink"],
      flexFlow: ["flexDirection", "flexWrap"],
      font: ["fontFamily", "fontFeatureSettings", "fontKerning", "fontLanguageOverride", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition", "fontWeight", "lineHeight"],
      fontVariant: ["fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition"],
      gap: ["columnGap", "rowGap"],
      grid: ["gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      gridArea: ["gridColumnEnd", "gridColumnStart", "gridRowEnd", "gridRowStart"],
      gridColumn: ["gridColumnEnd", "gridColumnStart"],
      gridColumnGap: ["columnGap"],
      gridGap: ["columnGap", "rowGap"],
      gridRow: ["gridRowEnd", "gridRowStart"],
      gridRowGap: ["rowGap"],
      gridTemplate: ["gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      listStyle: ["listStyleImage", "listStylePosition", "listStyleType"],
      margin: ["marginBottom", "marginLeft", "marginRight", "marginTop"],
      marker: ["markerEnd", "markerMid", "markerStart"],
      mask: ["maskClip", "maskComposite", "maskImage", "maskMode", "maskOrigin", "maskPositionX", "maskPositionY", "maskRepeat", "maskSize"],
      maskPosition: ["maskPositionX", "maskPositionY"],
      outline: ["outlineColor", "outlineStyle", "outlineWidth"],
      overflow: ["overflowX", "overflowY"],
      padding: ["paddingBottom", "paddingLeft", "paddingRight", "paddingTop"],
      placeContent: ["alignContent", "justifyContent"],
      placeItems: ["alignItems", "justifyItems"],
      placeSelf: ["alignSelf", "justifySelf"],
      textDecoration: ["textDecorationColor", "textDecorationLine", "textDecorationStyle"],
      textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
      transition: ["transitionDelay", "transitionDuration", "transitionProperty", "transitionTimingFunction"],
      wordWrap: ["overflowWrap"]
    }, Il = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      // SVG-related properties
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0
    };
    function Zp(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var Jp = ["Webkit", "ms", "Moz", "O"];
    Object.keys(Il).forEach(function(e) {
      Jp.forEach(function(t) {
        Il[Zp(t, e)] = Il[e];
      });
    });
    function Ns(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(Il.hasOwnProperty(e) && Il[e]) ? t + "px" : (ji(t, e), ("" + t).trim());
    }
    var ev = /([A-Z])/g, $l = /^ms-/;
    function ny(e) {
      return e.replace(ev, "-$1").toLowerCase().replace($l, "-ms-");
    }
    var tv = function() {
    };
    {
      var ry = /^(?:webkit|moz|o)[A-Z]/, nv = /^-ms-/, rv = /-(.)/g, Gl = /;\s*$/, ya = {}, zf = {}, iu = !1, av = !1, iv = function(e) {
        return e.replace(rv, function(t, a) {
          return a.toUpperCase();
        });
      }, Of = function(e) {
        ya.hasOwnProperty(e) && ya[e] || (ya[e] = !0, S(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          iv(e.replace(nv, "ms-"))
        ));
      }, Nf = function(e) {
        ya.hasOwnProperty(e) && ya[e] || (ya[e] = !0, S("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, lv = function(e, t) {
        zf.hasOwnProperty(t) && zf[t] || (zf[t] = !0, S(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(Gl, "")));
      }, ov = function(e, t) {
        iu || (iu = !0, S("`NaN` is an invalid value for the `%s` css style property.", e));
      }, uv = function(e, t) {
        av || (av = !0, S("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      tv = function(e, t) {
        e.indexOf("-") > -1 ? Of(e) : ry.test(e) ? Nf(e) : Gl.test(t) && lv(e, t), typeof t == "number" && (isNaN(t) ? ov(e, t) : isFinite(t) || uv(e, t));
      };
    }
    var ay = tv;
    function iy(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var o = e[i];
            if (o != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : ny(i)) + ":", t += Ns(i, o, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function sv(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var o = i.indexOf("--") === 0;
          o || ay(i, t[i]);
          var s = Ns(i, t[i], o);
          i === "float" && (i = "cssFloat"), o ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function ly(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function cv(e) {
      var t = {};
      for (var a in e)
        for (var i = ty[a] || [a], o = 0; o < i.length; o++)
          t[i[o]] = a;
      return t;
    }
    function ea(e, t) {
      {
        if (!t)
          return;
        var a = cv(e), i = cv(t), o = {};
        for (var s in a) {
          var f = a[s], p = i[s];
          if (p && f !== p) {
            var v = f + "," + p;
            if (o[v])
              continue;
            o[v] = !0, S("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", ly(e[f]) ? "Removing" : "Updating", f, p);
          }
        }
      }
    }
    var lu = {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
      // NOTE: menuitem's close tag should be omitted, but that causes problems.
    }, fv = Le({
      menuitem: !0
    }, lu), dv = "__html";
    function Us(e, t) {
      if (t) {
        if (fv[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(dv in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && S("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function oi(e, t) {
      if (e.indexOf("-") === -1)
        return typeof t.is == "string";
      switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var Wl = {
      // HTML
      accept: "accept",
      acceptcharset: "acceptCharset",
      "accept-charset": "acceptCharset",
      accesskey: "accessKey",
      action: "action",
      allowfullscreen: "allowFullScreen",
      alt: "alt",
      as: "as",
      async: "async",
      autocapitalize: "autoCapitalize",
      autocomplete: "autoComplete",
      autocorrect: "autoCorrect",
      autofocus: "autoFocus",
      autoplay: "autoPlay",
      autosave: "autoSave",
      capture: "capture",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      challenge: "challenge",
      charset: "charSet",
      checked: "checked",
      children: "children",
      cite: "cite",
      class: "className",
      classid: "classID",
      classname: "className",
      cols: "cols",
      colspan: "colSpan",
      content: "content",
      contenteditable: "contentEditable",
      contextmenu: "contextMenu",
      controls: "controls",
      controlslist: "controlsList",
      coords: "coords",
      crossorigin: "crossOrigin",
      dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
      data: "data",
      datetime: "dateTime",
      default: "default",
      defaultchecked: "defaultChecked",
      defaultvalue: "defaultValue",
      defer: "defer",
      dir: "dir",
      disabled: "disabled",
      disablepictureinpicture: "disablePictureInPicture",
      disableremoteplayback: "disableRemotePlayback",
      download: "download",
      draggable: "draggable",
      enctype: "encType",
      enterkeyhint: "enterKeyHint",
      for: "htmlFor",
      form: "form",
      formmethod: "formMethod",
      formaction: "formAction",
      formenctype: "formEncType",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      frameborder: "frameBorder",
      headers: "headers",
      height: "height",
      hidden: "hidden",
      high: "high",
      href: "href",
      hreflang: "hrefLang",
      htmlfor: "htmlFor",
      httpequiv: "httpEquiv",
      "http-equiv": "httpEquiv",
      icon: "icon",
      id: "id",
      imagesizes: "imageSizes",
      imagesrcset: "imageSrcSet",
      innerhtml: "innerHTML",
      inputmode: "inputMode",
      integrity: "integrity",
      is: "is",
      itemid: "itemID",
      itemprop: "itemProp",
      itemref: "itemRef",
      itemscope: "itemScope",
      itemtype: "itemType",
      keyparams: "keyParams",
      keytype: "keyType",
      kind: "kind",
      label: "label",
      lang: "lang",
      list: "list",
      loop: "loop",
      low: "low",
      manifest: "manifest",
      marginwidth: "marginWidth",
      marginheight: "marginHeight",
      max: "max",
      maxlength: "maxLength",
      media: "media",
      mediagroup: "mediaGroup",
      method: "method",
      min: "min",
      minlength: "minLength",
      multiple: "multiple",
      muted: "muted",
      name: "name",
      nomodule: "noModule",
      nonce: "nonce",
      novalidate: "noValidate",
      open: "open",
      optimum: "optimum",
      pattern: "pattern",
      placeholder: "placeholder",
      playsinline: "playsInline",
      poster: "poster",
      preload: "preload",
      profile: "profile",
      radiogroup: "radioGroup",
      readonly: "readOnly",
      referrerpolicy: "referrerPolicy",
      rel: "rel",
      required: "required",
      reversed: "reversed",
      role: "role",
      rows: "rows",
      rowspan: "rowSpan",
      sandbox: "sandbox",
      scope: "scope",
      scoped: "scoped",
      scrolling: "scrolling",
      seamless: "seamless",
      selected: "selected",
      shape: "shape",
      size: "size",
      sizes: "sizes",
      span: "span",
      spellcheck: "spellCheck",
      src: "src",
      srcdoc: "srcDoc",
      srclang: "srcLang",
      srcset: "srcSet",
      start: "start",
      step: "step",
      style: "style",
      summary: "summary",
      tabindex: "tabIndex",
      target: "target",
      title: "title",
      type: "type",
      usemap: "useMap",
      value: "value",
      width: "width",
      wmode: "wmode",
      wrap: "wrap",
      // SVG
      about: "about",
      accentheight: "accentHeight",
      "accent-height": "accentHeight",
      accumulate: "accumulate",
      additive: "additive",
      alignmentbaseline: "alignmentBaseline",
      "alignment-baseline": "alignmentBaseline",
      allowreorder: "allowReorder",
      alphabetic: "alphabetic",
      amplitude: "amplitude",
      arabicform: "arabicForm",
      "arabic-form": "arabicForm",
      ascent: "ascent",
      attributename: "attributeName",
      attributetype: "attributeType",
      autoreverse: "autoReverse",
      azimuth: "azimuth",
      basefrequency: "baseFrequency",
      baselineshift: "baselineShift",
      "baseline-shift": "baselineShift",
      baseprofile: "baseProfile",
      bbox: "bbox",
      begin: "begin",
      bias: "bias",
      by: "by",
      calcmode: "calcMode",
      capheight: "capHeight",
      "cap-height": "capHeight",
      clip: "clip",
      clippath: "clipPath",
      "clip-path": "clipPath",
      clippathunits: "clipPathUnits",
      cliprule: "clipRule",
      "clip-rule": "clipRule",
      color: "color",
      colorinterpolation: "colorInterpolation",
      "color-interpolation": "colorInterpolation",
      colorinterpolationfilters: "colorInterpolationFilters",
      "color-interpolation-filters": "colorInterpolationFilters",
      colorprofile: "colorProfile",
      "color-profile": "colorProfile",
      colorrendering: "colorRendering",
      "color-rendering": "colorRendering",
      contentscripttype: "contentScriptType",
      contentstyletype: "contentStyleType",
      cursor: "cursor",
      cx: "cx",
      cy: "cy",
      d: "d",
      datatype: "datatype",
      decelerate: "decelerate",
      descent: "descent",
      diffuseconstant: "diffuseConstant",
      direction: "direction",
      display: "display",
      divisor: "divisor",
      dominantbaseline: "dominantBaseline",
      "dominant-baseline": "dominantBaseline",
      dur: "dur",
      dx: "dx",
      dy: "dy",
      edgemode: "edgeMode",
      elevation: "elevation",
      enablebackground: "enableBackground",
      "enable-background": "enableBackground",
      end: "end",
      exponent: "exponent",
      externalresourcesrequired: "externalResourcesRequired",
      fill: "fill",
      fillopacity: "fillOpacity",
      "fill-opacity": "fillOpacity",
      fillrule: "fillRule",
      "fill-rule": "fillRule",
      filter: "filter",
      filterres: "filterRes",
      filterunits: "filterUnits",
      floodopacity: "floodOpacity",
      "flood-opacity": "floodOpacity",
      floodcolor: "floodColor",
      "flood-color": "floodColor",
      focusable: "focusable",
      fontfamily: "fontFamily",
      "font-family": "fontFamily",
      fontsize: "fontSize",
      "font-size": "fontSize",
      fontsizeadjust: "fontSizeAdjust",
      "font-size-adjust": "fontSizeAdjust",
      fontstretch: "fontStretch",
      "font-stretch": "fontStretch",
      fontstyle: "fontStyle",
      "font-style": "fontStyle",
      fontvariant: "fontVariant",
      "font-variant": "fontVariant",
      fontweight: "fontWeight",
      "font-weight": "fontWeight",
      format: "format",
      from: "from",
      fx: "fx",
      fy: "fy",
      g1: "g1",
      g2: "g2",
      glyphname: "glyphName",
      "glyph-name": "glyphName",
      glyphorientationhorizontal: "glyphOrientationHorizontal",
      "glyph-orientation-horizontal": "glyphOrientationHorizontal",
      glyphorientationvertical: "glyphOrientationVertical",
      "glyph-orientation-vertical": "glyphOrientationVertical",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      hanging: "hanging",
      horizadvx: "horizAdvX",
      "horiz-adv-x": "horizAdvX",
      horizoriginx: "horizOriginX",
      "horiz-origin-x": "horizOriginX",
      ideographic: "ideographic",
      imagerendering: "imageRendering",
      "image-rendering": "imageRendering",
      in2: "in2",
      in: "in",
      inlist: "inlist",
      intercept: "intercept",
      k1: "k1",
      k2: "k2",
      k3: "k3",
      k4: "k4",
      k: "k",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      kerning: "kerning",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      letterspacing: "letterSpacing",
      "letter-spacing": "letterSpacing",
      lightingcolor: "lightingColor",
      "lighting-color": "lightingColor",
      limitingconeangle: "limitingConeAngle",
      local: "local",
      markerend: "markerEnd",
      "marker-end": "markerEnd",
      markerheight: "markerHeight",
      markermid: "markerMid",
      "marker-mid": "markerMid",
      markerstart: "markerStart",
      "marker-start": "markerStart",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      mask: "mask",
      maskcontentunits: "maskContentUnits",
      maskunits: "maskUnits",
      mathematical: "mathematical",
      mode: "mode",
      numoctaves: "numOctaves",
      offset: "offset",
      opacity: "opacity",
      operator: "operator",
      order: "order",
      orient: "orient",
      orientation: "orientation",
      origin: "origin",
      overflow: "overflow",
      overlineposition: "overlinePosition",
      "overline-position": "overlinePosition",
      overlinethickness: "overlineThickness",
      "overline-thickness": "overlineThickness",
      paintorder: "paintOrder",
      "paint-order": "paintOrder",
      panose1: "panose1",
      "panose-1": "panose1",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointerevents: "pointerEvents",
      "pointer-events": "pointerEvents",
      points: "points",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      prefix: "prefix",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      property: "property",
      r: "r",
      radius: "radius",
      refx: "refX",
      refy: "refY",
      renderingintent: "renderingIntent",
      "rendering-intent": "renderingIntent",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      resource: "resource",
      restart: "restart",
      result: "result",
      results: "results",
      rotate: "rotate",
      rx: "rx",
      ry: "ry",
      scale: "scale",
      security: "security",
      seed: "seed",
      shaperendering: "shapeRendering",
      "shape-rendering": "shapeRendering",
      slope: "slope",
      spacing: "spacing",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      speed: "speed",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stemh: "stemh",
      stemv: "stemv",
      stitchtiles: "stitchTiles",
      stopcolor: "stopColor",
      "stop-color": "stopColor",
      stopopacity: "stopOpacity",
      "stop-opacity": "stopOpacity",
      strikethroughposition: "strikethroughPosition",
      "strikethrough-position": "strikethroughPosition",
      strikethroughthickness: "strikethroughThickness",
      "strikethrough-thickness": "strikethroughThickness",
      string: "string",
      stroke: "stroke",
      strokedasharray: "strokeDasharray",
      "stroke-dasharray": "strokeDasharray",
      strokedashoffset: "strokeDashoffset",
      "stroke-dashoffset": "strokeDashoffset",
      strokelinecap: "strokeLinecap",
      "stroke-linecap": "strokeLinecap",
      strokelinejoin: "strokeLinejoin",
      "stroke-linejoin": "strokeLinejoin",
      strokemiterlimit: "strokeMiterlimit",
      "stroke-miterlimit": "strokeMiterlimit",
      strokewidth: "strokeWidth",
      "stroke-width": "strokeWidth",
      strokeopacity: "strokeOpacity",
      "stroke-opacity": "strokeOpacity",
      suppresscontenteditablewarning: "suppressContentEditableWarning",
      suppresshydrationwarning: "suppressHydrationWarning",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textanchor: "textAnchor",
      "text-anchor": "textAnchor",
      textdecoration: "textDecoration",
      "text-decoration": "textDecoration",
      textlength: "textLength",
      textrendering: "textRendering",
      "text-rendering": "textRendering",
      to: "to",
      transform: "transform",
      typeof: "typeof",
      u1: "u1",
      u2: "u2",
      underlineposition: "underlinePosition",
      "underline-position": "underlinePosition",
      underlinethickness: "underlineThickness",
      "underline-thickness": "underlineThickness",
      unicode: "unicode",
      unicodebidi: "unicodeBidi",
      "unicode-bidi": "unicodeBidi",
      unicoderange: "unicodeRange",
      "unicode-range": "unicodeRange",
      unitsperem: "unitsPerEm",
      "units-per-em": "unitsPerEm",
      unselectable: "unselectable",
      valphabetic: "vAlphabetic",
      "v-alphabetic": "vAlphabetic",
      values: "values",
      vectoreffect: "vectorEffect",
      "vector-effect": "vectorEffect",
      version: "version",
      vertadvy: "vertAdvY",
      "vert-adv-y": "vertAdvY",
      vertoriginx: "vertOriginX",
      "vert-origin-x": "vertOriginX",
      vertoriginy: "vertOriginY",
      "vert-origin-y": "vertOriginY",
      vhanging: "vHanging",
      "v-hanging": "vHanging",
      videographic: "vIdeographic",
      "v-ideographic": "vIdeographic",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      visibility: "visibility",
      vmathematical: "vMathematical",
      "v-mathematical": "vMathematical",
      vocab: "vocab",
      widths: "widths",
      wordspacing: "wordSpacing",
      "word-spacing": "wordSpacing",
      writingmode: "writingMode",
      "writing-mode": "writingMode",
      x1: "x1",
      x2: "x2",
      x: "x",
      xchannelselector: "xChannelSelector",
      xheight: "xHeight",
      "x-height": "xHeight",
      xlinkactuate: "xlinkActuate",
      "xlink:actuate": "xlinkActuate",
      xlinkarcrole: "xlinkArcrole",
      "xlink:arcrole": "xlinkArcrole",
      xlinkhref: "xlinkHref",
      "xlink:href": "xlinkHref",
      xlinkrole: "xlinkRole",
      "xlink:role": "xlinkRole",
      xlinkshow: "xlinkShow",
      "xlink:show": "xlinkShow",
      xlinktitle: "xlinkTitle",
      "xlink:title": "xlinkTitle",
      xlinktype: "xlinkType",
      "xlink:type": "xlinkType",
      xmlbase: "xmlBase",
      "xml:base": "xmlBase",
      xmllang: "xmlLang",
      "xml:lang": "xmlLang",
      xmlns: "xmlns",
      "xml:space": "xmlSpace",
      xmlnsxlink: "xmlnsXlink",
      "xmlns:xlink": "xmlnsXlink",
      xmlspace: "xmlSpace",
      y1: "y1",
      y2: "y2",
      y: "y",
      ychannelselector: "yChannelSelector",
      z: "z",
      zoomandpan: "zoomAndPan"
    }, pv = {
      "aria-current": 0,
      // state
      "aria-description": 0,
      "aria-details": 0,
      "aria-disabled": 0,
      // state
      "aria-hidden": 0,
      // state
      "aria-invalid": 0,
      // state
      "aria-keyshortcuts": 0,
      "aria-label": 0,
      "aria-roledescription": 0,
      // Widget Attributes
      "aria-autocomplete": 0,
      "aria-checked": 0,
      "aria-expanded": 0,
      "aria-haspopup": 0,
      "aria-level": 0,
      "aria-modal": 0,
      "aria-multiline": 0,
      "aria-multiselectable": 0,
      "aria-orientation": 0,
      "aria-placeholder": 0,
      "aria-pressed": 0,
      "aria-readonly": 0,
      "aria-required": 0,
      "aria-selected": 0,
      "aria-sort": 0,
      "aria-valuemax": 0,
      "aria-valuemin": 0,
      "aria-valuenow": 0,
      "aria-valuetext": 0,
      // Live Region Attributes
      "aria-atomic": 0,
      "aria-busy": 0,
      "aria-live": 0,
      "aria-relevant": 0,
      // Drag-and-Drop Attributes
      "aria-dropeffect": 0,
      "aria-grabbed": 0,
      // Relationship Attributes
      "aria-activedescendant": 0,
      "aria-colcount": 0,
      "aria-colindex": 0,
      "aria-colspan": 0,
      "aria-controls": 0,
      "aria-describedby": 0,
      "aria-errormessage": 0,
      "aria-flowto": 0,
      "aria-labelledby": 0,
      "aria-owns": 0,
      "aria-posinset": 0,
      "aria-rowcount": 0,
      "aria-rowindex": 0,
      "aria-rowspan": 0,
      "aria-setsize": 0
    }, Xl = {}, ql = new RegExp("^(aria)-[" + Y + "]*$"), Uf = new RegExp("^(aria)[A-Z][" + Y + "]*$");
    function ou(e, t) {
      {
        if (br.call(Xl, t) && Xl[t])
          return !0;
        if (Uf.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = pv.hasOwnProperty(a) ? a : null;
          if (i == null)
            return S("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), Xl[t] = !0, !0;
          if (t !== i)
            return S("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), Xl[t] = !0, !0;
        }
        if (ql.test(t)) {
          var o = t.toLowerCase(), s = pv.hasOwnProperty(o) ? o : null;
          if (s == null)
            return Xl[t] = !0, !1;
          if (t !== s)
            return S("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), Xl[t] = !0, !0;
        }
      }
      return !0;
    }
    function Af(e, t) {
      {
        var a = [];
        for (var i in t) {
          var o = ou(e, i);
          o || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? S("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && S("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function vv(e, t) {
      oi(e, t) || Af(e, t);
    }
    var uu = !1;
    function Kl(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !uu && (uu = !0, e === "select" && t.multiple ? S("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : S("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var As = function() {
    };
    {
      var En = {}, su = /^on./, hv = /^on[^A-Z]/, mv = new RegExp("^(aria)-[" + Y + "]*$"), yv = new RegExp("^(aria)[A-Z][" + Y + "]*$");
      As = function(e, t, a, i) {
        if (br.call(En, t) && En[t])
          return !0;
        var o = t.toLowerCase();
        if (o === "onfocusin" || o === "onfocusout")
          return S("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), En[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, f = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var p = f.hasOwnProperty(o) ? f[o] : null;
          if (p != null)
            return S("Invalid event handler property `%s`. Did you mean `%s`?", t, p), En[t] = !0, !0;
          if (su.test(t))
            return S("Unknown event handler property `%s`. It will be ignored.", t), En[t] = !0, !0;
        } else if (su.test(t))
          return hv.test(t) && S("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), En[t] = !0, !0;
        if (mv.test(t) || yv.test(t))
          return !0;
        if (o === "innerhtml")
          return S("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), En[t] = !0, !0;
        if (o === "aria")
          return S("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), En[t] = !0, !0;
        if (o === "is" && a !== null && a !== void 0 && typeof a != "string")
          return S("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), En[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return S("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), En[t] = !0, !0;
        var v = Ut(t), m = v !== null && v.type === Xr;
        if (Wl.hasOwnProperty(o)) {
          var y = Wl[o];
          if (y !== t)
            return S("Invalid DOM property `%s`. Did you mean `%s`?", t, y), En[t] = !0, !0;
        } else if (!m && t !== o)
          return S("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, o), En[t] = !0, !0;
        return typeof a == "boolean" && Nt(t, a, v, !1) ? (a ? S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), En[t] = !0, !0) : m ? !0 : Nt(t, a, v, !1) ? (En[t] = !0, !1) : ((a === "false" || a === "true") && v !== null && v.type === ur && (S("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), En[t] = !0), !0);
      };
    }
    var gv = function(e, t, a) {
      {
        var i = [];
        for (var o in t) {
          var s = As(e, o, t[o], a);
          s || i.push(o);
        }
        var f = i.map(function(p) {
          return "`" + p + "`";
        }).join(", ");
        i.length === 1 ? S("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e) : i.length > 1 && S("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e);
      }
    };
    function Sv(e, t, a) {
      oi(e, t) || gv(e, t, a);
    }
    var Hf = 1, ga = 2, Yi = 4, Ff = Hf | ga | Yi, cu = null;
    function oy(e) {
      cu !== null && S("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), cu = e;
    }
    function fu() {
      cu === null && S("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), cu = null;
    }
    function uy(e) {
      return e === cu;
    }
    function Hs(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Aa ? t.parentNode : t;
    }
    var Fs = null, Ge = null, ui = null;
    function du(e) {
      var t = To(e);
      if (t) {
        if (typeof Fs != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = bh(a);
          Fs(t.stateNode, t.type, i);
        }
      }
    }
    function pu(e) {
      Fs = e;
    }
    function jf(e) {
      Ge ? ui ? ui.push(e) : ui = [e] : Ge = e;
    }
    function Vf() {
      return Ge !== null || ui !== null;
    }
    function Zl() {
      if (Ge) {
        var e = Ge, t = ui;
        if (Ge = null, ui = null, du(e), t)
          for (var a = 0; a < t.length; a++)
            du(t[a]);
      }
    }
    var vu = function(e, t) {
      return e(t);
    }, Qi = function() {
    }, js = !1;
    function sy() {
      var e = Vf();
      e && (Qi(), Zl());
    }
    function wv(e, t, a) {
      if (js)
        return e(t, a);
      js = !0;
      try {
        return vu(e, t, a);
      } finally {
        js = !1, sy();
      }
    }
    function Cv(e, t, a) {
      vu = e, Qi = a;
    }
    function Vs(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function Bs(e, t, a) {
      switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          return !!(a.disabled && Vs(t));
        default:
          return !1;
      }
    }
    function Ii(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = bh(a);
      if (i === null)
        return null;
      var o = i[t];
      if (Bs(t, e.type, i))
        return null;
      if (o && typeof o != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof o + "` type.");
      return o;
    }
    var hu = !1;
    if (Yn)
      try {
        var $i = {};
        Object.defineProperty($i, "passive", {
          get: function() {
            hu = !0;
          }
        }), window.addEventListener("test", $i, $i), window.removeEventListener("test", $i, $i);
      } catch {
        hu = !1;
      }
    function Ps(e, t, a, i, o, s, f, p, v) {
      var m = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, m);
      } catch (y) {
        this.onError(y);
      }
    }
    var Ev = Ps;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var Ys = document.createElement("react");
      Ev = function(t, a, i, o, s, f, p, v, m) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var y = document.createEvent("Event"), x = !1, C = !0, _ = window.event, L = Object.getOwnPropertyDescriptor(window, "event");
        function z() {
          Ys.removeEventListener(O, ce, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = _);
        }
        var I = Array.prototype.slice.call(arguments, 3);
        function ce() {
          x = !0, z(), a.apply(i, I), C = !1;
        }
        var ie, je = !1, Ne = !1;
        function T(R) {
          if (ie = R.error, je = !0, ie === null && R.colno === 0 && R.lineno === 0 && (Ne = !0), R.defaultPrevented && ie != null && typeof ie == "object")
            try {
              ie._suppressLogging = !0;
            } catch {
            }
        }
        var O = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", T), Ys.addEventListener(O, ce, !1), y.initEvent(O, !1, !1), Ys.dispatchEvent(y), L && Object.defineProperty(window, "event", L), x && C && (je ? Ne && (ie = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : ie = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(ie)), window.removeEventListener("error", T), !x)
          return z(), Ps.apply(this, arguments);
      };
    }
    var cy = Ev, Jl = !1, eo = null, ta = !1, Qs = null, to = {
      onError: function(e) {
        Jl = !0, eo = e;
      }
    };
    function zr(e, t, a, i, o, s, f, p, v) {
      Jl = !1, eo = null, cy.apply(to, arguments);
    }
    function mu(e, t, a, i, o, s, f, p, v) {
      if (zr.apply(this, arguments), Jl) {
        var m = Pf();
        ta || (ta = !0, Qs = m);
      }
    }
    function Fa() {
      if (ta) {
        var e = Qs;
        throw ta = !1, Qs = null, e;
      }
    }
    function Bf() {
      return Jl;
    }
    function Pf() {
      if (Jl) {
        var e = eo;
        return Jl = !1, eo = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function no(e) {
      return e._reactInternals;
    }
    function Gi(e) {
      return e._reactInternals !== void 0;
    }
    function yu(e, t) {
      e._reactInternals = t;
    }
    var le = (
      /*                      */
      0
    ), ja = (
      /*                */
      1
    ), St = (
      /*                    */
      2
    ), ze = (
      /*                       */
      4
    ), $n = (
      /*                */
      16
    ), qe = (
      /*                 */
      32
    ), lt = (
      /*                     */
      64
    ), Re = (
      /*                   */
      128
    ), ft = (
      /*            */
      256
    ), Ht = (
      /*                          */
      512
    ), Or = (
      /*                     */
      1024
    ), cr = (
      /*                      */
      2048
    ), wt = (
      /*                    */
      4096
    ), Sa = (
      /*                   */
      8192
    ), Is = (
      /*             */
      16384
    ), xv = (
      /*               */
      32767
    ), Wi = (
      /*                   */
      32768
    ), xn = (
      /*                */
      65536
    ), na = (
      /* */
      131072
    ), gu = (
      /*                       */
      1048576
    ), Su = (
      /*                    */
      2097152
    ), si = (
      /*                 */
      4194304
    ), Yf = (
      /*                */
      8388608
    ), _n = (
      /*               */
      16777216
    ), ci = (
      /*              */
      33554432
    ), fi = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      ze | Or | 0
    ), ro = St | ze | $n | qe | Ht | wt | Sa, di = ze | lt | Ht | Sa, rn = cr | $n, Ft = si | Yf | Su, Xi = ke.ReactCurrentOwner;
    function Mn(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (St | wt)) !== le && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === ee ? a : null;
    }
    function wa(e) {
      if (e.tag === _e) {
        var t = e.memoizedState;
        if (t === null) {
          var a = e.alternate;
          a !== null && (t = a.memoizedState);
        }
        if (t !== null)
          return t.dehydrated;
      }
      return null;
    }
    function pi(e) {
      return e.tag === ee ? e.stateNode.containerInfo : null;
    }
    function bv(e) {
      return Mn(e) === e;
    }
    function Qf(e) {
      {
        var t = Xi.current;
        if (t !== null && t.tag === me) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || S("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Ee(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var o = no(e);
      return o ? Mn(o) === o : !1;
    }
    function $s(e) {
      if (Mn(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function Gn(e) {
      var t = e.alternate;
      if (!t) {
        var a = Mn(e);
        if (a === null)
          throw new Error("Unable to find node on an unmounted component.");
        return a !== e ? null : e;
      }
      for (var i = e, o = t; ; ) {
        var s = i.return;
        if (s === null)
          break;
        var f = s.alternate;
        if (f === null) {
          var p = s.return;
          if (p !== null) {
            i = o = p;
            continue;
          }
          break;
        }
        if (s.child === f.child) {
          for (var v = s.child; v; ) {
            if (v === i)
              return $s(s), e;
            if (v === o)
              return $s(s), t;
            v = v.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (i.return !== o.return)
          i = s, o = f;
        else {
          for (var m = !1, y = s.child; y; ) {
            if (y === i) {
              m = !0, i = s, o = f;
              break;
            }
            if (y === o) {
              m = !0, o = s, i = f;
              break;
            }
            y = y.sibling;
          }
          if (!m) {
            for (y = f.child; y; ) {
              if (y === i) {
                m = !0, i = f, o = s;
                break;
              }
              if (y === o) {
                m = !0, o = f, i = s;
                break;
              }
              y = y.sibling;
            }
            if (!m)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (i.alternate !== o)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (i.tag !== ee)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function Wn(e) {
      var t = Gn(e);
      return t !== null ? st(t) : null;
    }
    function st(e) {
      if (e.tag === ae || e.tag === ge)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = st(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function ra(e) {
      var t = Gn(e);
      return t !== null ? If(t) : null;
    }
    function If(e) {
      if (e.tag === ae || e.tag === ge)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== Ve) {
          var a = If(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var $f = k.unstable_scheduleCallback, Gf = k.unstable_cancelCallback, Wf = k.unstable_shouldYield, Tv = k.unstable_requestPaint, kt = k.unstable_now, Rv = k.unstable_getCurrentPriorityLevel, Va = k.unstable_ImmediatePriority, wu = k.unstable_UserBlockingPriority, qi = k.unstable_NormalPriority, Cu = k.unstable_LowPriority, ao = k.unstable_IdlePriority, kv = k.unstable_yieldValue, Dv = k.unstable_setDisableYieldValue, aa = null, an = null, Q = null, fr = !1, bn = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function Xf(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return S("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        Pn && (e = Le({}, e, {
          getLaneLabelMap: Jf,
          injectProfilingHooks: Ki
        })), aa = t.inject(e), an = t;
      } catch (a) {
        S("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function qf(e, t) {
      if (an && typeof an.onScheduleFiberRoot == "function")
        try {
          an.onScheduleFiberRoot(aa, e, t);
        } catch (a) {
          fr || (fr = !0, S("React instrumentation encountered an error: %s", a));
        }
    }
    function Kf(e, t) {
      if (an && typeof an.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & Re) === Re;
          if (za) {
            var i;
            switch (t) {
              case Jn:
                i = Va;
                break;
              case Ur:
                i = wu;
                break;
              case ln:
                i = qi;
                break;
              case Ec:
                i = ao;
                break;
              default:
                i = qi;
                break;
            }
            an.onCommitFiberRoot(aa, e, i, a);
          }
        } catch (o) {
          fr || (fr = !0, S("React instrumentation encountered an error: %s", o));
        }
    }
    function Zf(e) {
      if (an && typeof an.onPostCommitFiberRoot == "function")
        try {
          an.onPostCommitFiberRoot(aa, e);
        } catch (t) {
          fr || (fr = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function io(e) {
      if (an && typeof an.onCommitFiberUnmount == "function")
        try {
          an.onCommitFiberUnmount(aa, e);
        } catch (t) {
          fr || (fr = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Ke(e) {
      if (typeof kv == "function" && (Dv(e), Et(e)), an && typeof an.setStrictMode == "function")
        try {
          an.setStrictMode(aa, e);
        } catch (t) {
          fr || (fr = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Ki(e) {
      Q = e;
    }
    function Jf() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < id; a++) {
          var i = Nv(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function _v(e) {
      Q !== null && typeof Q.markCommitStarted == "function" && Q.markCommitStarted(e);
    }
    function Ca() {
      Q !== null && typeof Q.markCommitStopped == "function" && Q.markCommitStopped();
    }
    function Nr(e) {
      Q !== null && typeof Q.markComponentRenderStarted == "function" && Q.markComponentRenderStarted(e);
    }
    function vi() {
      Q !== null && typeof Q.markComponentRenderStopped == "function" && Q.markComponentRenderStopped();
    }
    function Mv(e) {
      Q !== null && typeof Q.markComponentPassiveEffectMountStarted == "function" && Q.markComponentPassiveEffectMountStarted(e);
    }
    function Ba() {
      Q !== null && typeof Q.markComponentPassiveEffectMountStopped == "function" && Q.markComponentPassiveEffectMountStopped();
    }
    function hi(e) {
      Q !== null && typeof Q.markComponentPassiveEffectUnmountStarted == "function" && Q.markComponentPassiveEffectUnmountStarted(e);
    }
    function Gs() {
      Q !== null && typeof Q.markComponentPassiveEffectUnmountStopped == "function" && Q.markComponentPassiveEffectUnmountStopped();
    }
    function Lv(e) {
      Q !== null && typeof Q.markComponentLayoutEffectMountStarted == "function" && Q.markComponentLayoutEffectMountStarted(e);
    }
    function Ws() {
      Q !== null && typeof Q.markComponentLayoutEffectMountStopped == "function" && Q.markComponentLayoutEffectMountStopped();
    }
    function ed(e) {
      Q !== null && typeof Q.markComponentLayoutEffectUnmountStarted == "function" && Q.markComponentLayoutEffectUnmountStarted(e);
    }
    function lo() {
      Q !== null && typeof Q.markComponentLayoutEffectUnmountStopped == "function" && Q.markComponentLayoutEffectUnmountStopped();
    }
    function Ea(e, t, a) {
      Q !== null && typeof Q.markComponentErrored == "function" && Q.markComponentErrored(e, t, a);
    }
    function Eu(e, t, a) {
      Q !== null && typeof Q.markComponentSuspended == "function" && Q.markComponentSuspended(e, t, a);
    }
    function xu(e) {
      Q !== null && typeof Q.markLayoutEffectsStarted == "function" && Q.markLayoutEffectsStarted(e);
    }
    function Zi() {
      Q !== null && typeof Q.markLayoutEffectsStopped == "function" && Q.markLayoutEffectsStopped();
    }
    function td(e) {
      Q !== null && typeof Q.markPassiveEffectsStarted == "function" && Q.markPassiveEffectsStarted(e);
    }
    function oo() {
      Q !== null && typeof Q.markPassiveEffectsStopped == "function" && Q.markPassiveEffectsStopped();
    }
    function nd(e) {
      Q !== null && typeof Q.markRenderStarted == "function" && Q.markRenderStarted(e);
    }
    function rd() {
      Q !== null && typeof Q.markRenderYielded == "function" && Q.markRenderYielded();
    }
    function dt() {
      Q !== null && typeof Q.markRenderStopped == "function" && Q.markRenderStopped();
    }
    function Xs(e) {
      Q !== null && typeof Q.markRenderScheduled == "function" && Q.markRenderScheduled(e);
    }
    function ad(e, t) {
      Q !== null && typeof Q.markForceUpdateScheduled == "function" && Q.markForceUpdateScheduled(e, t);
    }
    function bu(e, t) {
      Q !== null && typeof Q.markStateUpdateScheduled == "function" && Q.markStateUpdateScheduled(e, t);
    }
    var oe = (
      /*                         */
      0
    ), De = (
      /*                 */
      1
    ), He = (
      /*                    */
      2
    ), Ce = (
      /*               */
      8
    ), et = (
      /*              */
      16
    ), Qt = Math.clz32 ? Math.clz32 : Ru, qs = Math.log, Tu = Math.LN2;
    function Ru(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (qs(t) / Tu | 0) | 0;
    }
    var id = 31, N = (
      /*                        */
      0
    ), jt = (
      /*                          */
      0
    ), de = (
      /*                        */
      1
    ), mi = (
      /*    */
      2
    ), Kt = (
      /*             */
      4
    ), Zt = (
      /*            */
      8
    ), Xn = (
      /*                     */
      16
    ), Ji = (
      /*                */
      32
    ), yi = (
      /*                       */
      4194240
    ), uo = (
      /*                        */
      64
    ), Ks = (
      /*                        */
      128
    ), Zs = (
      /*                        */
      256
    ), Js = (
      /*                        */
      512
    ), ec = (
      /*                        */
      1024
    ), tc = (
      /*                        */
      2048
    ), nc = (
      /*                        */
      4096
    ), rc = (
      /*                        */
      8192
    ), el = (
      /*                        */
      16384
    ), ac = (
      /*                       */
      32768
    ), so = (
      /*                       */
      65536
    ), co = (
      /*                       */
      131072
    ), ic = (
      /*                       */
      262144
    ), ku = (
      /*                       */
      524288
    ), lc = (
      /*                       */
      1048576
    ), oc = (
      /*                       */
      2097152
    ), Du = (
      /*                            */
      130023424
    ), tl = (
      /*                             */
      4194304
    ), _u = (
      /*                             */
      8388608
    ), uc = (
      /*                             */
      16777216
    ), sc = (
      /*                             */
      33554432
    ), cc = (
      /*                             */
      67108864
    ), zv = tl, fo = (
      /*          */
      134217728
    ), Ov = (
      /*                          */
      268435455
    ), Mu = (
      /*               */
      268435456
    ), gi = (
      /*                        */
      536870912
    ), qn = (
      /*                   */
      1073741824
    );
    function Nv(e) {
      {
        if (e & de)
          return "Sync";
        if (e & mi)
          return "InputContinuousHydration";
        if (e & Kt)
          return "InputContinuous";
        if (e & Zt)
          return "DefaultHydration";
        if (e & Xn)
          return "Default";
        if (e & Ji)
          return "TransitionHydration";
        if (e & yi)
          return "Transition";
        if (e & Du)
          return "Retry";
        if (e & fo)
          return "SelectiveHydration";
        if (e & Mu)
          return "IdleHydration";
        if (e & gi)
          return "Idle";
        if (e & qn)
          return "Offscreen";
      }
    }
    var Ze = -1, fc = uo, dc = tl;
    function Lu(e) {
      switch (nl(e)) {
        case de:
          return de;
        case mi:
          return mi;
        case Kt:
          return Kt;
        case Zt:
          return Zt;
        case Xn:
          return Xn;
        case Ji:
          return Ji;
        case uo:
        case Ks:
        case Zs:
        case Js:
        case ec:
        case tc:
        case nc:
        case rc:
        case el:
        case ac:
        case so:
        case co:
        case ic:
        case ku:
        case lc:
        case oc:
          return e & yi;
        case tl:
        case _u:
        case uc:
        case sc:
        case cc:
          return e & Du;
        case fo:
          return fo;
        case Mu:
          return Mu;
        case gi:
          return gi;
        case qn:
          return qn;
        default:
          return S("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Kn(e, t) {
      var a = e.pendingLanes;
      if (a === N)
        return N;
      var i = N, o = e.suspendedLanes, s = e.pingedLanes, f = a & Ov;
      if (f !== N) {
        var p = f & ~o;
        if (p !== N)
          i = Lu(p);
        else {
          var v = f & s;
          v !== N && (i = Lu(v));
        }
      } else {
        var m = a & ~o;
        m !== N ? i = Lu(m) : s !== N && (i = Lu(s));
      }
      if (i === N)
        return N;
      if (t !== N && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & o) === N) {
        var y = nl(i), x = nl(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          y >= x || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          y === Xn && (x & yi) !== N
        )
          return t;
      }
      (i & Kt) !== N && (i |= a & Xn);
      var C = e.entangledLanes;
      if (C !== N)
        for (var _ = e.entanglements, L = i & C; L > 0; ) {
          var z = Dt(L), I = 1 << z;
          i |= _[z], L &= ~I;
        }
      return i;
    }
    function ld(e, t) {
      for (var a = e.eventTimes, i = Ze; t > 0; ) {
        var o = Dt(t), s = 1 << o, f = a[o];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function pc(e, t) {
      switch (e) {
        case de:
        case mi:
        case Kt:
          return t + 250;
        case Zt:
        case Xn:
        case Ji:
        case uo:
        case Ks:
        case Zs:
        case Js:
        case ec:
        case tc:
        case nc:
        case rc:
        case el:
        case ac:
        case so:
        case co:
        case ic:
        case ku:
        case lc:
        case oc:
          return t + 5e3;
        case tl:
        case _u:
        case uc:
        case sc:
        case cc:
          return Ze;
        case fo:
        case Mu:
        case gi:
        case qn:
          return Ze;
        default:
          return S("Should have found matching lanes. This is a bug in React."), Ze;
      }
    }
    function Uv(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, o = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = Dt(f), v = 1 << p, m = s[p];
        m === Ze ? ((v & i) === N || (v & o) !== N) && (s[p] = pc(v, t)) : m <= t && (e.expiredLanes |= v), f &= ~v;
      }
    }
    function Av(e) {
      return Lu(e.pendingLanes);
    }
    function vc(e) {
      var t = e.pendingLanes & ~qn;
      return t !== N ? t : t & qn ? qn : N;
    }
    function od(e) {
      return (e & de) !== N;
    }
    function Si(e) {
      return (e & Ov) !== N;
    }
    function hc(e) {
      return (e & Du) === e;
    }
    function ud(e) {
      var t = de | Kt | Xn;
      return (e & t) === N;
    }
    function fy(e) {
      return (e & yi) === e;
    }
    function zu(e, t) {
      var a = mi | Kt | Zt | Xn;
      return (t & a) !== N;
    }
    function Hv(e, t) {
      return (t & e.expiredLanes) !== N;
    }
    function sd(e) {
      return (e & yi) !== N;
    }
    function cd() {
      var e = fc;
      return fc <<= 1, (fc & yi) === N && (fc = uo), e;
    }
    function Fv() {
      var e = dc;
      return dc <<= 1, (dc & Du) === N && (dc = tl), e;
    }
    function nl(e) {
      return e & -e;
    }
    function Jt(e) {
      return nl(e);
    }
    function Dt(e) {
      return 31 - Qt(e);
    }
    function mc(e) {
      return Dt(e);
    }
    function Zn(e, t) {
      return (e & t) !== N;
    }
    function rl(e, t) {
      return (e & t) === t;
    }
    function xe(e, t) {
      return e | t;
    }
    function Ou(e, t) {
      return e & ~t;
    }
    function yc(e, t) {
      return e & t;
    }
    function dy(e) {
      return e;
    }
    function fd(e, t) {
      return e !== jt && e < t ? e : t;
    }
    function gc(e) {
      for (var t = [], a = 0; a < id; a++)
        t.push(e);
      return t;
    }
    function po(e, t, a) {
      e.pendingLanes |= t, t !== gi && (e.suspendedLanes = N, e.pingedLanes = N);
      var i = e.eventTimes, o = mc(t);
      i[o] = a;
    }
    function dd(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var o = Dt(i), s = 1 << o;
        a[o] = Ze, i &= ~s;
      }
    }
    function Sc(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function jv(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = N, e.pingedLanes = N, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, o = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = Dt(f), v = 1 << p;
        i[p] = N, o[p] = Ze, s[p] = Ze, f &= ~v;
      }
    }
    function Nu(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, o = a; o; ) {
        var s = Dt(o), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), o &= ~f;
      }
    }
    function wc(e, t) {
      var a = nl(t), i;
      switch (a) {
        case Kt:
          i = mi;
          break;
        case Xn:
          i = Zt;
          break;
        case uo:
        case Ks:
        case Zs:
        case Js:
        case ec:
        case tc:
        case nc:
        case rc:
        case el:
        case ac:
        case so:
        case co:
        case ic:
        case ku:
        case lc:
        case oc:
        case tl:
        case _u:
        case uc:
        case sc:
        case cc:
          i = Ji;
          break;
        case gi:
          i = Mu;
          break;
        default:
          i = jt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== jt ? jt : i;
    }
    function Vv(e, t, a) {
      if (bn)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var o = mc(a), s = 1 << o, f = i[o];
          f.add(t), a &= ~s;
        }
    }
    function pd(e, t) {
      if (bn)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var o = mc(t), s = 1 << o, f = a[o];
          f.size > 0 && (f.forEach(function(p) {
            var v = p.alternate;
            (v === null || !i.has(v)) && i.add(p);
          }), f.clear()), t &= ~s;
        }
    }
    function Cc(e, t) {
      return null;
    }
    var Jn = de, Ur = Kt, ln = Xn, Ec = gi, vo = jt;
    function dr() {
      return vo;
    }
    function It(e) {
      vo = e;
    }
    function Bv(e, t) {
      var a = vo;
      try {
        return vo = e, t();
      } finally {
        vo = a;
      }
    }
    function Uu(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function Tn(e, t) {
      return e > t ? e : t;
    }
    function vd(e, t) {
      return e !== 0 && e < t;
    }
    function Pv(e) {
      var t = nl(e);
      return vd(Jn, t) ? vd(Ur, t) ? Si(t) ? ln : Ec : Ur : Jn;
    }
    function al(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var on;
    function py(e) {
      on = e;
    }
    function J(e) {
      on(e);
    }
    var wi;
    function hd(e) {
      wi = e;
    }
    var md;
    function vy(e) {
      md = e;
    }
    var ho;
    function xc(e) {
      ho = e;
    }
    var bc;
    function Yv(e) {
      bc = e;
    }
    var Tc = !1, Au = [], xa = null, ba = null, pt = null, Ln = /* @__PURE__ */ new Map(), Ar = /* @__PURE__ */ new Map(), Pa = [], Qv = [
      "mousedown",
      "mouseup",
      "touchcancel",
      "touchend",
      "touchstart",
      "auxclick",
      "dblclick",
      "pointercancel",
      "pointerdown",
      "pointerup",
      "dragend",
      "dragstart",
      "drop",
      "compositionend",
      "compositionstart",
      "keydown",
      "keypress",
      "keyup",
      "input",
      "textInput",
      // Intentionally camelCase
      "copy",
      "cut",
      "paste",
      "click",
      "change",
      "contextmenu",
      "reset",
      "submit"
    ];
    function ia(e) {
      return Qv.indexOf(e) > -1;
    }
    function Iv(e, t, a, i, o) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: o,
        targetContainers: [i]
      };
    }
    function la(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          xa = null;
          break;
        case "dragenter":
        case "dragleave":
          ba = null;
          break;
        case "mouseover":
        case "mouseout":
          pt = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          Ln.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          Ar.delete(i);
          break;
        }
      }
    }
    function Hu(e, t, a, i, o, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = Iv(t, a, i, o, s);
        if (t !== null) {
          var p = To(t);
          p !== null && wi(p);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var v = e.targetContainers;
      return o !== null && v.indexOf(o) === -1 && v.push(o), e;
    }
    function $v(e, t, a, i, o) {
      switch (t) {
        case "focusin": {
          var s = o;
          return xa = Hu(xa, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var f = o;
          return ba = Hu(ba, e, t, a, i, f), !0;
        }
        case "mouseover": {
          var p = o;
          return pt = Hu(pt, e, t, a, i, p), !0;
        }
        case "pointerover": {
          var v = o, m = v.pointerId;
          return Ln.set(m, Hu(Ln.get(m) || null, e, t, a, i, v)), !0;
        }
        case "gotpointercapture": {
          var y = o, x = y.pointerId;
          return Ar.set(x, Hu(Ar.get(x) || null, e, t, a, i, y)), !0;
        }
      }
      return !1;
    }
    function yd(e) {
      var t = Ku(e.target);
      if (t !== null) {
        var a = Mn(t);
        if (a !== null) {
          var i = a.tag;
          if (i === _e) {
            var o = wa(a);
            if (o !== null) {
              e.blockedOn = o, bc(e.priority, function() {
                md(a);
              });
              return;
            }
          } else if (i === ee) {
            var s = a.stateNode;
            if (al(s)) {
              e.blockedOn = pi(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function Gv(e) {
      for (var t = ho(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < Pa.length && vd(t, Pa[i].priority); i++)
        ;
      Pa.splice(i, 0, a), i === 0 && yd(a);
    }
    function Fu(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = ju(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var o = e.nativeEvent, s = new o.constructor(o.type, o);
          oy(s), o.target.dispatchEvent(s), fu();
        } else {
          var f = To(i);
          return f !== null && wi(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Wv(e, t, a) {
      Fu(e) && a.delete(t);
    }
    function Rc() {
      Tc = !1, xa !== null && Fu(xa) && (xa = null), ba !== null && Fu(ba) && (ba = null), pt !== null && Fu(pt) && (pt = null), Ln.forEach(Wv), Ar.forEach(Wv);
    }
    function il(e, t) {
      e.blockedOn === t && (e.blockedOn = null, Tc || (Tc = !0, k.unstable_scheduleCallback(k.unstable_NormalPriority, Rc)));
    }
    function Rn(e) {
      if (Au.length > 0) {
        il(Au[0], e);
        for (var t = 1; t < Au.length; t++) {
          var a = Au[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      xa !== null && il(xa, e), ba !== null && il(ba, e), pt !== null && il(pt, e);
      var i = function(p) {
        return il(p, e);
      };
      Ln.forEach(i), Ar.forEach(i);
      for (var o = 0; o < Pa.length; o++) {
        var s = Pa[o];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; Pa.length > 0; ) {
        var f = Pa[0];
        if (f.blockedOn !== null)
          break;
        yd(f), f.blockedOn === null && Pa.shift();
      }
    }
    var Oe = ke.ReactCurrentBatchConfig, Vt = !0;
    function _t(e) {
      Vt = !!e;
    }
    function un() {
      return Vt;
    }
    function pr(e, t, a) {
      var i = yo(t), o;
      switch (i) {
        case Jn:
          o = mo;
          break;
        case Ur:
          o = $t;
          break;
        case ln:
        default:
          o = ll;
          break;
      }
      return o.bind(null, t, a, e);
    }
    function mo(e, t, a, i) {
      var o = dr(), s = Oe.transition;
      Oe.transition = null;
      try {
        It(Jn), ll(e, t, a, i);
      } finally {
        It(o), Oe.transition = s;
      }
    }
    function $t(e, t, a, i) {
      var o = dr(), s = Oe.transition;
      Oe.transition = null;
      try {
        It(Ur), ll(e, t, a, i);
      } finally {
        It(o), Oe.transition = s;
      }
    }
    function ll(e, t, a, i) {
      Vt && ol(e, t, a, i);
    }
    function ol(e, t, a, i) {
      var o = ju(e, t, a, i);
      if (o === null) {
        Ly(e, t, i, ul, a), la(e, i);
        return;
      }
      if ($v(o, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (la(e, i), t & Yi && ia(e)) {
        for (; o !== null; ) {
          var s = To(o);
          s !== null && J(s);
          var f = ju(e, t, a, i);
          if (f === null && Ly(e, t, i, ul, a), f === o)
            break;
          o = f;
        }
        o !== null && i.stopPropagation();
        return;
      }
      Ly(e, t, i, null, a);
    }
    var ul = null;
    function ju(e, t, a, i) {
      ul = null;
      var o = Hs(i), s = Ku(o);
      if (s !== null) {
        var f = Mn(s);
        if (f === null)
          s = null;
        else {
          var p = f.tag;
          if (p === _e) {
            var v = wa(f);
            if (v !== null)
              return v;
            s = null;
          } else if (p === ee) {
            var m = f.stateNode;
            if (al(m))
              return pi(f);
            s = null;
          } else f !== s && (s = null);
        }
      }
      return ul = s, null;
    }
    function yo(e) {
      switch (e) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return Jn;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return Ur;
        case "message": {
          var t = Rv();
          switch (t) {
            case Va:
              return Jn;
            case wu:
              return Ur;
            case qi:
            case Cu:
              return ln;
            case ao:
              return Ec;
            default:
              return ln;
          }
        }
        default:
          return ln;
      }
    }
    function er(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function gd(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function go(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function Ya(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var Ci = null, Vu = null, Hr = null;
    function kc(e) {
      return Ci = e, Vu = So(), !0;
    }
    function Ei() {
      Ci = null, Vu = null, Hr = null;
    }
    function Bu() {
      if (Hr)
        return Hr;
      var e, t = Vu, a = t.length, i, o = So(), s = o.length;
      for (e = 0; e < a && t[e] === o[e]; e++)
        ;
      var f = a - e;
      for (i = 1; i <= f && t[a - i] === o[s - i]; i++)
        ;
      var p = i > 1 ? 1 - i : void 0;
      return Hr = o.slice(e, p), Hr;
    }
    function So() {
      return "value" in Ci ? Ci.value : Ci.textContent;
    }
    function wo(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function sl() {
      return !0;
    }
    function Pu() {
      return !1;
    }
    function ot(e) {
      function t(a, i, o, s, f) {
        this._reactName = a, this._targetInst = o, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
        for (var p in e)
          if (e.hasOwnProperty(p)) {
            var v = e[p];
            v ? this[p] = v(s) : this[p] = s[p];
          }
        var m = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return m ? this.isDefaultPrevented = sl : this.isDefaultPrevented = Pu, this.isPropagationStopped = Pu, this;
      }
      return Le(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = sl);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = sl);
        },
        /**
         * We release all dispatched `SyntheticEvent`s after each event loop, adding
         * them back into the pool. This allows a way to hold onto a reference that
         * won't be added back into the pool.
         */
        persist: function() {
        },
        /**
         * Checks if this event should be released back into the pool.
         *
         * @return {boolean} True if this should not be released, false otherwise.
         */
        isPersistent: sl
      }), t;
    }
    var vr = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, hr = ot(vr), en = Le({}, vr, {
      view: 0,
      detail: 0
    }), Xv = ot(en), Yu, Qu, Iu;
    function xi(e) {
      e !== Iu && (Iu && e.type === "mousemove" ? (Yu = e.screenX - Iu.screenX, Qu = e.screenY - Iu.screenY) : (Yu = 0, Qu = 0), Iu = e);
    }
    var $u = Le({}, en, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Ed,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (xi(e), Yu);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Qu;
      }
    }), Dc = ot($u), cl = Le({}, $u, {
      dataTransfer: 0
    }), Sd = ot(cl), fl = Le({}, en, {
      relatedTarget: 0
    }), _c = ot(fl), qv = Le({}, vr, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), wd = ot(qv), Mc = Le({}, vr, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), hy = ot(Mc), my = Le({}, vr, {
      data: 0
    }), Cd = ot(my), Kv = Cd, dl = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, yy = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    function Co(e) {
      if (e.key) {
        var t = dl[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = wo(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? yy[e.keyCode] || "Unidentified" : "";
    }
    var Zv = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function Ct(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = Zv[e];
      return i ? !!a[i] : !1;
    }
    function Ed(e) {
      return Ct;
    }
    var Jv = Le({}, en, {
      key: Co,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Ed,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? wo(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? wo(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), gy = ot(Jv), Sy = Le({}, $u, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), xd = ot(Sy), eh = Le({}, en, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Ed
    }), wy = ot(eh), Fr = Le({}, vr, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), bd = ot(Fr), Cy = Le({}, $u, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : (
          // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
          "wheelDeltaX" in e ? -e.wheelDeltaX : 0
        );
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : (
          // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
          "wheelDeltaY" in e ? -e.wheelDeltaY : (
            // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
            "wheelDelta" in e ? -e.wheelDelta : 0
          )
        );
      },
      deltaZ: 0,
      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: 0
    }), bi = ot(Cy), Lc = [9, 13, 27, 32], Ti = 229, Eo = Yn && "CompositionEvent" in window, pl = null;
    Yn && "documentMode" in document && (pl = document.documentMode);
    var Td = Yn && "TextEvent" in window && !pl, th = Yn && (!Eo || pl && pl > 8 && pl <= 11), zc = 32, nh = String.fromCharCode(zc);
    function rh() {
      Na("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), Na("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), Na("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), Na("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var Rd = !1;
    function Oc(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function Nc(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function ah(e, t) {
      return e === "keydown" && t.keyCode === Ti;
    }
    function Uc(e, t) {
      switch (e) {
        case "keyup":
          return Lc.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== Ti;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function ih(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function kd(e) {
      return e.locale === "ko";
    }
    var Ri = !1;
    function Ac(e, t, a, i, o) {
      var s, f;
      if (Eo ? s = Nc(t) : Ri ? Uc(t, i) && (s = "onCompositionEnd") : ah(t, i) && (s = "onCompositionStart"), !s)
        return null;
      th && !kd(i) && (!Ri && s === "onCompositionStart" ? Ri = kc(o) : s === "onCompositionEnd" && Ri && (f = Bu()));
      var p = fh(a, s);
      if (p.length > 0) {
        var v = new Cd(s, t, null, i, o);
        if (e.push({
          event: v,
          listeners: p
        }), f)
          v.data = f;
        else {
          var m = ih(i);
          m !== null && (v.data = m);
        }
      }
    }
    function Dd(e, t) {
      switch (e) {
        case "compositionend":
          return ih(t);
        case "keypress":
          var a = t.which;
          return a !== zc ? null : (Rd = !0, nh);
        case "textInput":
          var i = t.data;
          return i === nh && Rd ? null : i;
        default:
          return null;
      }
    }
    function Hc(e, t) {
      if (Ri) {
        if (e === "compositionend" || !Eo && Uc(e, t)) {
          var a = Bu();
          return Ei(), Ri = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!Oc(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return th && !kd(t) ? null : t.data;
        default:
          return null;
      }
    }
    function lh(e, t, a, i, o) {
      var s;
      if (Td ? s = Dd(t, i) : s = Hc(t, i), !s)
        return null;
      var f = fh(a, "onBeforeInput");
      if (f.length > 0) {
        var p = new Kv("onBeforeInput", "beforeinput", null, i, o);
        e.push({
          event: p,
          listeners: f
        }), p.data = s;
      }
    }
    function Ey(e, t, a, i, o, s, f) {
      Ac(e, t, a, i, o), lh(e, t, a, i, o);
    }
    var Fc = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0
    };
    function oh(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!Fc[e.type] : t === "textarea";
    }
    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
    function Gu(e) {
      if (!Yn)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function xy() {
      Na("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function Wu(e, t, a, i) {
      jf(i);
      var o = fh(t, "onChange");
      if (o.length > 0) {
        var s = new hr("onChange", "change", null, a, i);
        e.push({
          event: s,
          listeners: o
        });
      }
    }
    var n = null, r = null;
    function l(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function u(e) {
      var t = [];
      Wu(t, r, e, Hs(e)), wv(c, t);
    }
    function c(e) {
      NS(e, 0);
    }
    function d(e) {
      var t = Qc(e);
      if (Jo(t))
        return e;
    }
    function h(e, t) {
      if (e === "change")
        return t;
    }
    var g = !1;
    Yn && (g = Gu("input") && (!document.documentMode || document.documentMode > 9));
    function w(e, t) {
      n = e, r = t, n.attachEvent("onpropertychange", H);
    }
    function M() {
      n && (n.detachEvent("onpropertychange", H), n = null, r = null);
    }
    function H(e) {
      e.propertyName === "value" && d(r) && u(e);
    }
    function F(e, t, a) {
      e === "focusin" ? (M(), w(t, a)) : e === "focusout" && M();
    }
    function A(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return d(r);
    }
    function X(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function te(e, t) {
      if (e === "click")
        return d(t);
    }
    function re(e, t) {
      if (e === "input" || e === "change")
        return d(t);
    }
    function Mt(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Dn(e, "number", e.value);
    }
    function b(e, t, a, i, o, s, f) {
      var p = a ? Qc(a) : window, v, m;
      if (l(p) ? v = h : oh(p) ? g ? v = re : (v = A, m = F) : X(p) && (v = te), v) {
        var y = v(t, a);
        if (y) {
          Wu(e, y, i, o);
          return;
        }
      }
      m && m(t, p, a), t === "focusout" && Mt(p);
    }
    function E() {
      Gr("onMouseEnter", ["mouseout", "mouseover"]), Gr("onMouseLeave", ["mouseout", "mouseover"]), Gr("onPointerEnter", ["pointerout", "pointerover"]), Gr("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function D(e, t, a, i, o, s, f) {
      var p = t === "mouseover" || t === "pointerover", v = t === "mouseout" || t === "pointerout";
      if (p && !uy(i)) {
        var m = i.relatedTarget || i.fromElement;
        if (m && (Ku(m) || Pd(m)))
          return;
      }
      if (!(!v && !p)) {
        var y;
        if (o.window === o)
          y = o;
        else {
          var x = o.ownerDocument;
          x ? y = x.defaultView || x.parentWindow : y = window;
        }
        var C, _;
        if (v) {
          var L = i.relatedTarget || i.toElement;
          if (C = a, _ = L ? Ku(L) : null, _ !== null) {
            var z = Mn(_);
            (_ !== z || _.tag !== ae && _.tag !== ge) && (_ = null);
          }
        } else
          C = null, _ = a;
        if (C !== _) {
          var I = Dc, ce = "onMouseLeave", ie = "onMouseEnter", je = "mouse";
          (t === "pointerout" || t === "pointerover") && (I = xd, ce = "onPointerLeave", ie = "onPointerEnter", je = "pointer");
          var Ne = C == null ? y : Qc(C), T = _ == null ? y : Qc(_), O = new I(ce, je + "leave", C, i, o);
          O.target = Ne, O.relatedTarget = T;
          var R = null, j = Ku(o);
          if (j === a) {
            var K = new I(ie, je + "enter", _, i, o);
            K.target = T, K.relatedTarget = Ne, R = K;
          }
          UE(e, O, R, C, _);
        }
      }
    }
    function V(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var $ = typeof Object.is == "function" ? Object.is : V;
    function se(e, t) {
      if ($(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var o = 0; o < a.length; o++) {
        var s = a[o];
        if (!br.call(t, s) || !$(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function fe(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function ye(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function Gt(e, t) {
      for (var a = fe(e), i = 0, o = 0; a; ) {
        if (a.nodeType === Aa) {
          if (o = i + a.textContent.length, i <= t && o >= t)
            return {
              node: a,
              offset: t - i
            };
          i = o;
        }
        a = fe(ye(a));
      }
    }
    function Be(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var o = i.anchorNode, s = i.anchorOffset, f = i.focusNode, p = i.focusOffset;
      try {
        o.nodeType, f.nodeType;
      } catch {
        return null;
      }
      return ki(e, o, s, f, p);
    }
    function ki(e, t, a, i, o) {
      var s = 0, f = -1, p = -1, v = 0, m = 0, y = e, x = null;
      e: for (; ; ) {
        for (var C = null; y === t && (a === 0 || y.nodeType === Aa) && (f = s + a), y === i && (o === 0 || y.nodeType === Aa) && (p = s + o), y.nodeType === Aa && (s += y.nodeValue.length), (C = y.firstChild) !== null; )
          x = y, y = C;
        for (; ; ) {
          if (y === e)
            break e;
          if (x === t && ++v === a && (f = s), x === i && ++m === o && (p = s), (C = y.nextSibling) !== null)
            break;
          y = x, x = y.parentNode;
        }
        y = C;
      }
      return f === -1 || p === -1 ? null : {
        start: f,
        end: p
      };
    }
    function by(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var o = i.getSelection(), s = e.textContent.length, f = Math.min(t.start, s), p = t.end === void 0 ? f : Math.min(t.end, s);
        if (!o.extend && f > p) {
          var v = p;
          p = f, f = v;
        }
        var m = Gt(e, f), y = Gt(e, p);
        if (m && y) {
          if (o.rangeCount === 1 && o.anchorNode === m.node && o.anchorOffset === m.offset && o.focusNode === y.node && o.focusOffset === y.offset)
            return;
          var x = a.createRange();
          x.setStart(m.node, m.offset), o.removeAllRanges(), f > p ? (o.addRange(x), o.extend(y.node, y.offset)) : (x.setEnd(y.node, y.offset), o.addRange(x));
        }
      }
    }
    function ES(e) {
      return e && e.nodeType === Aa;
    }
    function xS(e, t) {
      return !e || !t ? !1 : e === t ? !0 : ES(e) ? !1 : ES(t) ? xS(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function yE(e) {
      return e && e.ownerDocument && xS(e.ownerDocument.documentElement, e);
    }
    function gE(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function bS() {
      for (var e = window, t = bs(); t instanceof e.HTMLIFrameElement; ) {
        if (gE(t))
          e = t.contentWindow;
        else
          return t;
        t = bs(e.document);
      }
      return t;
    }
    function Ty(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function SE() {
      var e = bS();
      return {
        focusedElem: e,
        selectionRange: Ty(e) ? CE(e) : null
      };
    }
    function wE(e) {
      var t = bS(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && yE(a)) {
        i !== null && Ty(a) && EE(a, i);
        for (var o = [], s = a; s = s.parentNode; )
          s.nodeType === In && o.push({
            element: s,
            left: s.scrollLeft,
            top: s.scrollTop
          });
        typeof a.focus == "function" && a.focus();
        for (var f = 0; f < o.length; f++) {
          var p = o[f];
          p.element.scrollLeft = p.left, p.element.scrollTop = p.top;
        }
      }
    }
    function CE(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = Be(e), t || {
        start: 0,
        end: 0
      };
    }
    function EE(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : by(e, t);
    }
    var xE = Yn && "documentMode" in document && document.documentMode <= 11;
    function bE() {
      Na("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var jc = null, Ry = null, _d = null, ky = !1;
    function TE(e) {
      if ("selectionStart" in e && Ty(e))
        return {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      var t = e.ownerDocument && e.ownerDocument.defaultView || window, a = t.getSelection();
      return {
        anchorNode: a.anchorNode,
        anchorOffset: a.anchorOffset,
        focusNode: a.focusNode,
        focusOffset: a.focusOffset
      };
    }
    function RE(e) {
      return e.window === e ? e.document : e.nodeType === Ha ? e : e.ownerDocument;
    }
    function TS(e, t, a) {
      var i = RE(a);
      if (!(ky || jc == null || jc !== bs(i))) {
        var o = TE(jc);
        if (!_d || !se(_d, o)) {
          _d = o;
          var s = fh(Ry, "onSelect");
          if (s.length > 0) {
            var f = new hr("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = jc;
          }
        }
      }
    }
    function kE(e, t, a, i, o, s, f) {
      var p = a ? Qc(a) : window;
      switch (t) {
        case "focusin":
          (oh(p) || p.contentEditable === "true") && (jc = p, Ry = a, _d = null);
          break;
        case "focusout":
          jc = null, Ry = null, _d = null;
          break;
        case "mousedown":
          ky = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          ky = !1, TS(e, i, o);
          break;
        case "selectionchange":
          if (xE)
            break;
        case "keydown":
        case "keyup":
          TS(e, i, o);
      }
    }
    function uh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var Vc = {
      animationend: uh("Animation", "AnimationEnd"),
      animationiteration: uh("Animation", "AnimationIteration"),
      animationstart: uh("Animation", "AnimationStart"),
      transitionend: uh("Transition", "TransitionEnd")
    }, Dy = {}, RS = {};
    Yn && (RS = document.createElement("div").style, "AnimationEvent" in window || (delete Vc.animationend.animation, delete Vc.animationiteration.animation, delete Vc.animationstart.animation), "TransitionEvent" in window || delete Vc.transitionend.transition);
    function sh(e) {
      if (Dy[e])
        return Dy[e];
      if (!Vc[e])
        return e;
      var t = Vc[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in RS)
          return Dy[e] = t[a];
      return e;
    }
    var kS = sh("animationend"), DS = sh("animationiteration"), _S = sh("animationstart"), MS = sh("transitionend"), LS = /* @__PURE__ */ new Map(), zS = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function xo(e, t) {
      LS.set(e, t), Na(t, [e]);
    }
    function DE() {
      for (var e = 0; e < zS.length; e++) {
        var t = zS[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        xo(a, "on" + i);
      }
      xo(kS, "onAnimationEnd"), xo(DS, "onAnimationIteration"), xo(_S, "onAnimationStart"), xo("dblclick", "onDoubleClick"), xo("focusin", "onFocus"), xo("focusout", "onBlur"), xo(MS, "onTransitionEnd");
    }
    function _E(e, t, a, i, o, s, f) {
      var p = LS.get(t);
      if (p !== void 0) {
        var v = hr, m = t;
        switch (t) {
          case "keypress":
            if (wo(i) === 0)
              return;
          case "keydown":
          case "keyup":
            v = gy;
            break;
          case "focusin":
            m = "focus", v = _c;
            break;
          case "focusout":
            m = "blur", v = _c;
            break;
          case "beforeblur":
          case "afterblur":
            v = _c;
            break;
          case "click":
            if (i.button === 2)
              return;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            v = Dc;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            v = Sd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            v = wy;
            break;
          case kS:
          case DS:
          case _S:
            v = wd;
            break;
          case MS:
            v = bd;
            break;
          case "scroll":
            v = Xv;
            break;
          case "wheel":
            v = bi;
            break;
          case "copy":
          case "cut":
          case "paste":
            v = hy;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            v = xd;
            break;
        }
        var y = (s & Yi) !== 0;
        {
          var x = !y && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", C = OE(a, p, i.type, y, x);
          if (C.length > 0) {
            var _ = new v(p, m, null, i, o);
            e.push({
              event: _,
              listeners: C
            });
          }
        }
      }
    }
    DE(), E(), xy(), bE(), rh();
    function ME(e, t, a, i, o, s, f) {
      _E(e, t, a, i, o, s);
      var p = (s & Ff) === 0;
      p && (D(e, t, a, i, o), b(e, t, a, i, o), kE(e, t, a, i, o), Ey(e, t, a, i, o));
    }
    var Md = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], _y = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(Md));
    function OS(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, mu(i, t, void 0, e), e.currentTarget = null;
    }
    function LE(e, t, a) {
      var i;
      if (a)
        for (var o = t.length - 1; o >= 0; o--) {
          var s = t[o], f = s.instance, p = s.currentTarget, v = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          OS(e, v, p), i = f;
        }
      else
        for (var m = 0; m < t.length; m++) {
          var y = t[m], x = y.instance, C = y.currentTarget, _ = y.listener;
          if (x !== i && e.isPropagationStopped())
            return;
          OS(e, _, C), i = x;
        }
    }
    function NS(e, t) {
      for (var a = (t & Yi) !== 0, i = 0; i < e.length; i++) {
        var o = e[i], s = o.event, f = o.listeners;
        LE(s, f, a);
      }
      Fa();
    }
    function zE(e, t, a, i, o) {
      var s = Hs(a), f = [];
      ME(f, e, i, a, s, t), NS(f, t);
    }
    function ht(e, t) {
      _y.has(e) || S('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = ub(t), o = AE(e);
      i.has(o) || (US(t, e, ga, a), i.add(o));
    }
    function My(e, t, a) {
      _y.has(e) && !t && S('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= Yi), US(a, e, i, t);
    }
    var ch = "_reactListening" + Math.random().toString(36).slice(2);
    function Ld(e) {
      if (!e[ch]) {
        e[ch] = !0, Oa.forEach(function(a) {
          a !== "selectionchange" && (_y.has(a) || My(a, !1, e), My(a, !0, e));
        });
        var t = e.nodeType === Ha ? e : e.ownerDocument;
        t !== null && (t[ch] || (t[ch] = !0, My("selectionchange", !1, t)));
      }
    }
    function US(e, t, a, i, o) {
      var s = pr(e, t, a), f = void 0;
      hu && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? go(e, t, s, f) : gd(e, t, s) : f !== void 0 ? Ya(e, t, s, f) : er(e, t, s);
    }
    function AS(e, t) {
      return e === t || e.nodeType === At && e.parentNode === t;
    }
    function Ly(e, t, a, i, o) {
      var s = i;
      if (!(t & Hf) && !(t & ga)) {
        var f = o;
        if (i !== null) {
          var p = i;
          e: for (; ; ) {
            if (p === null)
              return;
            var v = p.tag;
            if (v === ee || v === Ve) {
              var m = p.stateNode.containerInfo;
              if (AS(m, f))
                break;
              if (v === Ve)
                for (var y = p.return; y !== null; ) {
                  var x = y.tag;
                  if (x === ee || x === Ve) {
                    var C = y.stateNode.containerInfo;
                    if (AS(C, f))
                      return;
                  }
                  y = y.return;
                }
              for (; m !== null; ) {
                var _ = Ku(m);
                if (_ === null)
                  return;
                var L = _.tag;
                if (L === ae || L === ge) {
                  p = s = _;
                  continue e;
                }
                m = m.parentNode;
              }
            }
            p = p.return;
          }
        }
      }
      wv(function() {
        return zE(e, t, a, s);
      });
    }
    function zd(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function OE(e, t, a, i, o, s) {
      for (var f = t !== null ? t + "Capture" : null, p = i ? f : t, v = [], m = e, y = null; m !== null; ) {
        var x = m, C = x.stateNode, _ = x.tag;
        if (_ === ae && C !== null && (y = C, p !== null)) {
          var L = Ii(m, p);
          L != null && v.push(zd(m, L, y));
        }
        if (o)
          break;
        m = m.return;
      }
      return v;
    }
    function fh(e, t) {
      for (var a = t + "Capture", i = [], o = e; o !== null; ) {
        var s = o, f = s.stateNode, p = s.tag;
        if (p === ae && f !== null) {
          var v = f, m = Ii(o, a);
          m != null && i.unshift(zd(o, m, v));
          var y = Ii(o, t);
          y != null && i.push(zd(o, y, v));
        }
        o = o.return;
      }
      return i;
    }
    function Bc(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== ae);
      return e || null;
    }
    function NE(e, t) {
      for (var a = e, i = t, o = 0, s = a; s; s = Bc(s))
        o++;
      for (var f = 0, p = i; p; p = Bc(p))
        f++;
      for (; o - f > 0; )
        a = Bc(a), o--;
      for (; f - o > 0; )
        i = Bc(i), f--;
      for (var v = o; v--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = Bc(a), i = Bc(i);
      }
      return null;
    }
    function HS(e, t, a, i, o) {
      for (var s = t._reactName, f = [], p = a; p !== null && p !== i; ) {
        var v = p, m = v.alternate, y = v.stateNode, x = v.tag;
        if (m !== null && m === i)
          break;
        if (x === ae && y !== null) {
          var C = y;
          if (o) {
            var _ = Ii(p, s);
            _ != null && f.unshift(zd(p, _, C));
          } else if (!o) {
            var L = Ii(p, s);
            L != null && f.push(zd(p, L, C));
          }
        }
        p = p.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function UE(e, t, a, i, o) {
      var s = i && o ? NE(i, o) : null;
      i !== null && HS(e, t, i, s, !1), o !== null && a !== null && HS(e, a, o, s, !0);
    }
    function AE(e, t) {
      return e + "__bubble";
    }
    var jr = !1, Od = "dangerouslySetInnerHTML", dh = "suppressContentEditableWarning", bo = "suppressHydrationWarning", FS = "autoFocus", Xu = "children", qu = "style", ph = "__html", zy, vh, Nd, jS, hh, VS, BS;
    zy = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, vh = function(e, t) {
      vv(e, t), Kl(e, t), Sv(e, t, {
        registrationNameDependencies: gn,
        possibleRegistrationNames: _l
      });
    }, VS = Yn && !document.documentMode, Nd = function(e, t, a) {
      if (!jr) {
        var i = mh(a), o = mh(t);
        o !== i && (jr = !0, S("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(o), JSON.stringify(i)));
      }
    }, jS = function(e) {
      if (!jr) {
        jr = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), S("Extra attributes from the server: %s", t);
      }
    }, hh = function(e, t) {
      t === !1 ? S("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : S("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, BS = function(e, t) {
      var a = e.namespaceURI === Jr ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var HE = /\r\n?/g, FE = /\u0000|\uFFFD/g;
    function mh(e) {
      ti(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(HE, `
`).replace(FE, "");
    }
    function yh(e, t, a, i) {
      var o = mh(t), s = mh(e);
      if (s !== o && (i && (jr || (jr = !0, S('Text content did not match. Server: "%s" Client: "%s"', s, o))), a && W))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function PS(e) {
      return e.nodeType === Ha ? e : e.ownerDocument;
    }
    function jE() {
    }
    function gh(e) {
      e.onclick = jE;
    }
    function VE(e, t, a, i, o) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === qu)
            f && Object.freeze(f), sv(t, f);
          else if (s === Od) {
            var p = f ? f[ph] : void 0;
            p != null && Kp(t, p);
          } else if (s === Xu)
            if (typeof f == "string") {
              var v = e !== "textarea" || f !== "";
              v && li(t, f);
            } else typeof f == "number" && li(t, "" + f);
          else s === dh || s === bo || s === FS || (gn.hasOwnProperty(s) ? f != null && (typeof f != "function" && hh(s, f), s === "onScroll" && ht("scroll", t)) : f != null && Yo(t, s, f, o));
        }
    }
    function BE(e, t, a, i) {
      for (var o = 0; o < t.length; o += 2) {
        var s = t[o], f = t[o + 1];
        s === qu ? sv(e, f) : s === Od ? Kp(e, f) : s === Xu ? li(e, f) : Yo(e, s, f, i);
      }
    }
    function PE(e, t, a, i) {
      var o, s = PS(a), f, p = i;
      if (p === Jr && (p = Lf(e)), p === Jr) {
        if (o = oi(e, t), !o && e !== e.toLowerCase() && S("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var v = s.createElement("div");
          v.innerHTML = "<script><\/script>";
          var m = v.firstChild;
          f = v.removeChild(m);
        } else if (typeof t.is == "string")
          f = s.createElement(e, {
            is: t.is
          });
        else if (f = s.createElement(e), e === "select") {
          var y = f;
          t.multiple ? y.multiple = !0 : t.size && (y.size = t.size);
        }
      } else
        f = s.createElementNS(p, e);
      return p === Jr && !o && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !br.call(zy, e) && (zy[e] = !0, S("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function YE(e, t) {
      return PS(t).createTextNode(e);
    }
    function QE(e, t, a, i) {
      var o = oi(t, a);
      vh(t, a);
      var s;
      switch (t) {
        case "dialog":
          ht("cancel", e), ht("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          ht("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var f = 0; f < Md.length; f++)
            ht(Md[f], e);
          s = a;
          break;
        case "source":
          ht("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          ht("error", e), ht("load", e), s = a;
          break;
        case "details":
          ht("toggle", e), s = a;
          break;
        case "input":
          ks(e, a), s = ma(e, a), ht("invalid", e);
          break;
        case "option":
          Qp(e, a), s = a;
          break;
        case "select":
          $p(e, a), s = ru(e, a), ht("invalid", e);
          break;
        case "textarea":
          Wp(e, a), s = Ls(e, a), ht("invalid", e);
          break;
        default:
          s = a;
      }
      switch (Us(t, s), VE(t, e, i, s, o), t) {
        case "input":
          Ua(e), nu(e, a, !1);
          break;
        case "textarea":
          Ua(e), qp(e);
          break;
        case "option":
          kf(e, a);
          break;
        case "select":
          Xm(e, a);
          break;
        default:
          typeof s.onClick == "function" && gh(e);
          break;
      }
    }
    function IE(e, t, a, i, o) {
      vh(t, i);
      var s = null, f, p;
      switch (t) {
        case "input":
          f = ma(e, a), p = ma(e, i), s = [];
          break;
        case "select":
          f = ru(e, a), p = ru(e, i), s = [];
          break;
        case "textarea":
          f = Ls(e, a), p = Ls(e, i), s = [];
          break;
        default:
          f = a, p = i, typeof f.onClick != "function" && typeof p.onClick == "function" && gh(e);
          break;
      }
      Us(t, p);
      var v, m, y = null;
      for (v in f)
        if (!(p.hasOwnProperty(v) || !f.hasOwnProperty(v) || f[v] == null))
          if (v === qu) {
            var x = f[v];
            for (m in x)
              x.hasOwnProperty(m) && (y || (y = {}), y[m] = "");
          } else v === Od || v === Xu || v === dh || v === bo || v === FS || (gn.hasOwnProperty(v) ? s || (s = []) : (s = s || []).push(v, null));
      for (v in p) {
        var C = p[v], _ = f != null ? f[v] : void 0;
        if (!(!p.hasOwnProperty(v) || C === _ || C == null && _ == null))
          if (v === qu)
            if (C && Object.freeze(C), _) {
              for (m in _)
                _.hasOwnProperty(m) && (!C || !C.hasOwnProperty(m)) && (y || (y = {}), y[m] = "");
              for (m in C)
                C.hasOwnProperty(m) && _[m] !== C[m] && (y || (y = {}), y[m] = C[m]);
            } else
              y || (s || (s = []), s.push(v, y)), y = C;
          else if (v === Od) {
            var L = C ? C[ph] : void 0, z = _ ? _[ph] : void 0;
            L != null && z !== L && (s = s || []).push(v, L);
          } else v === Xu ? (typeof C == "string" || typeof C == "number") && (s = s || []).push(v, "" + C) : v === dh || v === bo || (gn.hasOwnProperty(v) ? (C != null && (typeof C != "function" && hh(v, C), v === "onScroll" && ht("scroll", e)), !s && _ !== C && (s = [])) : (s = s || []).push(v, C));
      }
      return y && (ea(y, p[qu]), (s = s || []).push(qu, y)), s;
    }
    function $E(e, t, a, i, o) {
      a === "input" && o.type === "radio" && o.name != null && tu(e, o);
      var s = oi(a, i), f = oi(a, o);
      switch (BE(e, t, s, f), a) {
        case "input":
          Ds(e, o);
          break;
        case "textarea":
          Xp(e, o);
          break;
        case "select":
          qm(e, o);
          break;
      }
    }
    function GE(e) {
      {
        var t = e.toLowerCase();
        return Wl.hasOwnProperty(t) && Wl[t] || null;
      }
    }
    function WE(e, t, a, i, o, s, f) {
      var p, v;
      switch (p = oi(t, a), vh(t, a), t) {
        case "dialog":
          ht("cancel", e), ht("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          ht("load", e);
          break;
        case "video":
        case "audio":
          for (var m = 0; m < Md.length; m++)
            ht(Md[m], e);
          break;
        case "source":
          ht("error", e);
          break;
        case "img":
        case "image":
        case "link":
          ht("error", e), ht("load", e);
          break;
        case "details":
          ht("toggle", e);
          break;
        case "input":
          ks(e, a), ht("invalid", e);
          break;
        case "option":
          Qp(e, a);
          break;
        case "select":
          $p(e, a), ht("invalid", e);
          break;
        case "textarea":
          Wp(e, a), ht("invalid", e);
          break;
      }
      Us(t, a);
      {
        v = /* @__PURE__ */ new Set();
        for (var y = e.attributes, x = 0; x < y.length; x++) {
          var C = y[x].name.toLowerCase();
          switch (C) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              v.add(y[x].name);
          }
        }
      }
      var _ = null;
      for (var L in a)
        if (a.hasOwnProperty(L)) {
          var z = a[L];
          if (L === Xu)
            typeof z == "string" ? e.textContent !== z && (a[bo] !== !0 && yh(e.textContent, z, s, f), _ = [Xu, z]) : typeof z == "number" && e.textContent !== "" + z && (a[bo] !== !0 && yh(e.textContent, z, s, f), _ = [Xu, "" + z]);
          else if (gn.hasOwnProperty(L))
            z != null && (typeof z != "function" && hh(L, z), L === "onScroll" && ht("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof p == "boolean") {
            var I = void 0, ce = Ut(L);
            if (a[bo] !== !0) {
              if (!(L === dh || L === bo || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              L === "value" || L === "checked" || L === "selected")) {
                if (L === Od) {
                  var ie = e.innerHTML, je = z ? z[ph] : void 0;
                  if (je != null) {
                    var Ne = BS(e, je);
                    Ne !== ie && Nd(L, ie, Ne);
                  }
                } else if (L === qu) {
                  if (v.delete(L), VS) {
                    var T = iy(z);
                    I = e.getAttribute("style"), T !== I && Nd(L, I, T);
                  }
                } else if (p && !Xe)
                  v.delete(L.toLowerCase()), I = Ol(e, L, z), z !== I && Nd(L, I, z);
                else if (!Sn(L, ce, p) && !Qn(L, z, ce, p)) {
                  var O = !1;
                  if (ce !== null)
                    v.delete(ce.attributeName), I = Lp(e, L, z, ce);
                  else {
                    var R = i;
                    if (R === Jr && (R = Lf(t)), R === Jr)
                      v.delete(L.toLowerCase());
                    else {
                      var j = GE(L);
                      j !== null && j !== L && (O = !0, v.delete(j)), v.delete(L);
                    }
                    I = Ol(e, L, z);
                  }
                  var K = Xe;
                  !K && z !== I && !O && Nd(L, I, z);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      v.size > 0 && a[bo] !== !0 && jS(v), t) {
        case "input":
          Ua(e), nu(e, a, !0);
          break;
        case "textarea":
          Ua(e), qp(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && gh(e);
          break;
      }
      return _;
    }
    function XE(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function Oy(e, t) {
      {
        if (jr)
          return;
        jr = !0, S("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function Ny(e, t) {
      {
        if (jr)
          return;
        jr = !0, S('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function Uy(e, t, a) {
      {
        if (jr)
          return;
        jr = !0, S("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function Ay(e, t) {
      {
        if (t === "" || jr)
          return;
        jr = !0, S('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function qE(e, t, a) {
      switch (t) {
        case "input":
          _s(e, a);
          return;
        case "textarea":
          Zm(e, a);
          return;
        case "select":
          Km(e, a);
          return;
      }
    }
    var Ud = function() {
    }, Ad = function() {
    };
    {
      var KE = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], YS = [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",
        // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title"
      ], ZE = YS.concat(["button"]), JE = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], QS = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      Ad = function(e, t) {
        var a = Le({}, e || QS), i = {
          tag: t
        };
        return YS.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), ZE.indexOf(t) !== -1 && (a.pTagInButtonScope = null), KE.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var ex = function(e, t) {
        switch (t) {
          case "select":
            return e === "option" || e === "optgroup" || e === "#text";
          case "optgroup":
            return e === "option" || e === "#text";
          case "option":
            return e === "#text";
          case "tr":
            return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
          case "tbody":
          case "thead":
          case "tfoot":
            return e === "tr" || e === "style" || e === "script" || e === "template";
          case "colgroup":
            return e === "col" || e === "template";
          case "table":
            return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
          case "head":
            return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
          case "html":
            return e === "head" || e === "body" || e === "frameset";
          case "frameset":
            return e === "frame";
          case "#document":
            return e === "html";
        }
        switch (e) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
          case "rp":
          case "rt":
            return JE.indexOf(t) === -1;
          case "body":
          case "caption":
          case "col":
          case "colgroup":
          case "frameset":
          case "frame":
          case "head":
          case "html":
          case "tbody":
          case "td":
          case "tfoot":
          case "th":
          case "thead":
          case "tr":
            return t == null;
        }
        return !0;
      }, tx = function(e, t) {
        switch (e) {
          case "address":
          case "article":
          case "aside":
          case "blockquote":
          case "center":
          case "details":
          case "dialog":
          case "dir":
          case "div":
          case "dl":
          case "fieldset":
          case "figcaption":
          case "figure":
          case "footer":
          case "header":
          case "hgroup":
          case "main":
          case "menu":
          case "nav":
          case "ol":
          case "p":
          case "section":
          case "summary":
          case "ul":
          case "pre":
          case "listing":
          case "table":
          case "hr":
          case "xmp":
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t.pTagInButtonScope;
          case "form":
            return t.formTag || t.pTagInButtonScope;
          case "li":
            return t.listItemTagAutoclosing;
          case "dd":
          case "dt":
            return t.dlItemTagAutoclosing;
          case "button":
            return t.buttonTagInScope;
          case "a":
            return t.aTagInScope;
          case "nobr":
            return t.nobrTagInScope;
        }
        return null;
      }, IS = {};
      Ud = function(e, t, a) {
        a = a || QS;
        var i = a.current, o = i && i.tag;
        t != null && (e != null && S("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = ex(e, o) ? null : i, f = s ? null : tx(e, a), p = s || f;
        if (p) {
          var v = p.tag, m = !!s + "|" + e + "|" + v;
          if (!IS[m]) {
            IS[m] = !0;
            var y = e, x = "";
            if (e === "#text" ? /\S/.test(t) ? y = "Text nodes" : (y = "Whitespace text nodes", x = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : y = "<" + e + ">", s) {
              var C = "";
              v === "table" && e === "tr" && (C += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), S("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", y, v, x, C);
            } else
              S("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", y, v);
          }
        }
      };
    }
    var Sh = "suppressHydrationWarning", wh = "$", Ch = "/$", Hd = "$?", Fd = "$!", nx = "style", Hy = null, Fy = null;
    function rx(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case Ha:
        case au: {
          t = i === Ha ? "#document" : "#fragment";
          var o = e.documentElement;
          a = o ? o.namespaceURI : zs(null, "");
          break;
        }
        default: {
          var s = i === At ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = zs(f, t);
          break;
        }
      }
      {
        var p = t.toLowerCase(), v = Ad(null, p);
        return {
          namespace: a,
          ancestorInfo: v
        };
      }
    }
    function ax(e, t, a) {
      {
        var i = e, o = zs(i.namespace, t), s = Ad(i.ancestorInfo, t);
        return {
          namespace: o,
          ancestorInfo: s
        };
      }
    }
    function pD(e) {
      return e;
    }
    function ix(e) {
      Hy = un(), Fy = SE();
      var t = null;
      return _t(!1), t;
    }
    function lx(e) {
      wE(Fy), _t(Hy), Hy = null, Fy = null;
    }
    function ox(e, t, a, i, o) {
      var s;
      {
        var f = i;
        if (Ud(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var p = "" + t.children, v = Ad(f.ancestorInfo, e);
          Ud(null, p, v);
        }
        s = f.namespace;
      }
      var m = PE(e, t, a, s);
      return Bd(o, m), $y(m, t), m;
    }
    function ux(e, t) {
      e.appendChild(t);
    }
    function sx(e, t, a, i, o) {
      switch (QE(e, t, a, i), t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          return !!a.autoFocus;
        case "img":
          return !0;
        default:
          return !1;
      }
    }
    function cx(e, t, a, i, o, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var p = "" + i.children, v = Ad(f.ancestorInfo, t);
          Ud(null, p, v);
        }
      }
      return IE(e, t, a, i);
    }
    function jy(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function fx(e, t, a, i) {
      {
        var o = a;
        Ud(null, e, o.ancestorInfo);
      }
      var s = YE(e, t);
      return Bd(i, s), s;
    }
    function dx() {
      var e = window.event;
      return e === void 0 ? ln : yo(e.type);
    }
    var Vy = typeof setTimeout == "function" ? setTimeout : void 0, px = typeof clearTimeout == "function" ? clearTimeout : void 0, By = -1, $S = typeof Promise == "function" ? Promise : void 0, vx = typeof queueMicrotask == "function" ? queueMicrotask : typeof $S < "u" ? function(e) {
      return $S.resolve(null).then(e).catch(hx);
    } : Vy;
    function hx(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function mx(e, t, a, i) {
      switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && e.focus();
          return;
        case "img": {
          a.src && (e.src = a.src);
          return;
        }
      }
    }
    function yx(e, t, a, i, o, s) {
      $E(e, t, a, i, o), $y(e, o);
    }
    function GS(e) {
      li(e, "");
    }
    function gx(e, t, a) {
      e.nodeValue = a;
    }
    function Sx(e, t) {
      e.appendChild(t);
    }
    function wx(e, t) {
      var a;
      e.nodeType === At ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && gh(a);
    }
    function Cx(e, t, a) {
      e.insertBefore(t, a);
    }
    function Ex(e, t, a) {
      e.nodeType === At ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function xx(e, t) {
      e.removeChild(t);
    }
    function bx(e, t) {
      e.nodeType === At ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Py(e, t) {
      var a = t, i = 0;
      do {
        var o = a.nextSibling;
        if (e.removeChild(a), o && o.nodeType === At) {
          var s = o.data;
          if (s === Ch)
            if (i === 0) {
              e.removeChild(o), Rn(t);
              return;
            } else
              i--;
          else (s === wh || s === Hd || s === Fd) && i++;
        }
        a = o;
      } while (a);
      Rn(t);
    }
    function Tx(e, t) {
      e.nodeType === At ? Py(e.parentNode, t) : e.nodeType === In && Py(e, t), Rn(e);
    }
    function Rx(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function kx(e) {
      e.nodeValue = "";
    }
    function Dx(e, t) {
      e = e;
      var a = t[nx], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = Ns("display", i);
    }
    function _x(e, t) {
      e.nodeValue = t;
    }
    function Mx(e) {
      e.nodeType === In ? e.textContent = "" : e.nodeType === Ha && e.documentElement && e.removeChild(e.documentElement);
    }
    function Lx(e, t, a) {
      return e.nodeType !== In || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function zx(e, t) {
      return t === "" || e.nodeType !== Aa ? null : e;
    }
    function Ox(e) {
      return e.nodeType !== At ? null : e;
    }
    function WS(e) {
      return e.data === Hd;
    }
    function Yy(e) {
      return e.data === Fd;
    }
    function Nx(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, o;
      return t && (a = t.dgst, i = t.msg, o = t.stck), {
        message: i,
        digest: a,
        stack: o
      };
    }
    function Ux(e, t) {
      e._reactRetry = t;
    }
    function Eh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === In || t === Aa)
          break;
        if (t === At) {
          var a = e.data;
          if (a === wh || a === Fd || a === Hd)
            break;
          if (a === Ch)
            return null;
        }
      }
      return e;
    }
    function jd(e) {
      return Eh(e.nextSibling);
    }
    function Ax(e) {
      return Eh(e.firstChild);
    }
    function Hx(e) {
      return Eh(e.firstChild);
    }
    function Fx(e) {
      return Eh(e.nextSibling);
    }
    function jx(e, t, a, i, o, s, f) {
      Bd(s, e), $y(e, a);
      var p;
      {
        var v = o;
        p = v.namespace;
      }
      var m = (s.mode & De) !== oe;
      return WE(e, t, a, p, i, m, f);
    }
    function Vx(e, t, a, i) {
      return Bd(a, e), a.mode & De, XE(e, t);
    }
    function Bx(e, t) {
      Bd(t, e);
    }
    function Px(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === At) {
          var i = t.data;
          if (i === Ch) {
            if (a === 0)
              return jd(t);
            a--;
          } else (i === wh || i === Fd || i === Hd) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function XS(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === At) {
          var i = t.data;
          if (i === wh || i === Fd || i === Hd) {
            if (a === 0)
              return t;
            a--;
          } else i === Ch && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function Yx(e) {
      Rn(e);
    }
    function Qx(e) {
      Rn(e);
    }
    function Ix(e) {
      return e !== "head" && e !== "body";
    }
    function $x(e, t, a, i) {
      var o = !0;
      yh(t.nodeValue, a, i, o);
    }
    function Gx(e, t, a, i, o, s) {
      if (t[Sh] !== !0) {
        var f = !0;
        yh(i.nodeValue, o, s, f);
      }
    }
    function Wx(e, t) {
      t.nodeType === In ? Oy(e, t) : t.nodeType === At || Ny(e, t);
    }
    function Xx(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === In ? Oy(a, t) : t.nodeType === At || Ny(a, t));
      }
    }
    function qx(e, t, a, i, o) {
      (o || t[Sh] !== !0) && (i.nodeType === In ? Oy(a, i) : i.nodeType === At || Ny(a, i));
    }
    function Kx(e, t, a) {
      Uy(e, t);
    }
    function Zx(e, t) {
      Ay(e, t);
    }
    function Jx(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && Uy(i, t);
      }
    }
    function eb(e, t) {
      {
        var a = e.parentNode;
        a !== null && Ay(a, t);
      }
    }
    function tb(e, t, a, i, o, s) {
      (s || t[Sh] !== !0) && Uy(a, i);
    }
    function nb(e, t, a, i, o) {
      (o || t[Sh] !== !0) && Ay(a, i);
    }
    function rb(e) {
      S("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function ab(e) {
      Ld(e);
    }
    var Pc = Math.random().toString(36).slice(2), Yc = "__reactFiber$" + Pc, Qy = "__reactProps$" + Pc, Vd = "__reactContainer$" + Pc, Iy = "__reactEvents$" + Pc, ib = "__reactListeners$" + Pc, lb = "__reactHandles$" + Pc;
    function ob(e) {
      delete e[Yc], delete e[Qy], delete e[Iy], delete e[ib], delete e[lb];
    }
    function Bd(e, t) {
      t[Yc] = e;
    }
    function xh(e, t) {
      t[Vd] = e;
    }
    function qS(e) {
      e[Vd] = null;
    }
    function Pd(e) {
      return !!e[Vd];
    }
    function Ku(e) {
      var t = e[Yc];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[Vd] || a[Yc], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var o = XS(e); o !== null; ) {
              var s = o[Yc];
              if (s)
                return s;
              o = XS(o);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function To(e) {
      var t = e[Yc] || e[Vd];
      return t && (t.tag === ae || t.tag === ge || t.tag === _e || t.tag === ee) ? t : null;
    }
    function Qc(e) {
      if (e.tag === ae || e.tag === ge)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function bh(e) {
      return e[Qy] || null;
    }
    function $y(e, t) {
      e[Qy] = t;
    }
    function ub(e) {
      var t = e[Iy];
      return t === void 0 && (t = e[Iy] = /* @__PURE__ */ new Set()), t;
    }
    var KS = {}, ZS = ke.ReactDebugCurrentFrame;
    function Th(e) {
      if (e) {
        var t = e._owner, a = Cf(e.type, e._source, t ? t.type : null);
        ZS.setExtraStackFrame(a);
      } else
        ZS.setExtraStackFrame(null);
    }
    function Qa(e, t, a, i, o) {
      {
        var s = Function.call.bind(br);
        for (var f in e)
          if (s(e, f)) {
            var p = void 0;
            try {
              if (typeof e[f] != "function") {
                var v = Error((i || "React class") + ": " + a + " type `" + f + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[f] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw v.name = "Invariant Violation", v;
              }
              p = e[f](t, f, i, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (m) {
              p = m;
            }
            p && !(p instanceof Error) && (Th(o), S("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof p), Th(null)), p instanceof Error && !(p.message in KS) && (KS[p.message] = !0, Th(o), S("Failed %s type: %s", a, p.message), Th(null));
          }
      }
    }
    var Gy = [], Rh;
    Rh = [];
    var vl = -1;
    function Ro(e) {
      return {
        current: e
      };
    }
    function tr(e, t) {
      if (vl < 0) {
        S("Unexpected pop.");
        return;
      }
      t !== Rh[vl] && S("Unexpected Fiber popped."), e.current = Gy[vl], Gy[vl] = null, Rh[vl] = null, vl--;
    }
    function nr(e, t, a) {
      vl++, Gy[vl] = e.current, Rh[vl] = a, e.current = t;
    }
    var Wy;
    Wy = {};
    var oa = {};
    Object.freeze(oa);
    var hl = Ro(oa), Di = Ro(!1), Xy = oa;
    function Ic(e, t, a) {
      return a && _i(t) ? Xy : hl.current;
    }
    function JS(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function $c(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return oa;
        var o = e.stateNode;
        if (o && o.__reactInternalMemoizedUnmaskedChildContext === t)
          return o.__reactInternalMemoizedMaskedChildContext;
        var s = {};
        for (var f in i)
          s[f] = t[f];
        {
          var p = Ee(e) || "Unknown";
          Qa(i, s, "context", p);
        }
        return o && JS(e, t, s), s;
      }
    }
    function kh() {
      return Di.current;
    }
    function _i(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function Dh(e) {
      tr(Di, e), tr(hl, e);
    }
    function qy(e) {
      tr(Di, e), tr(hl, e);
    }
    function ew(e, t, a) {
      {
        if (hl.current !== oa)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        nr(hl, t, e), nr(Di, a, e);
      }
    }
    function tw(e, t, a) {
      {
        var i = e.stateNode, o = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = Ee(e) || "Unknown";
            Wy[s] || (Wy[s] = !0, S("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var p in f)
          if (!(p in o))
            throw new Error((Ee(e) || "Unknown") + '.getChildContext(): key "' + p + '" is not defined in childContextTypes.');
        {
          var v = Ee(e) || "Unknown";
          Qa(o, f, "child context", v);
        }
        return Le({}, a, f);
      }
    }
    function _h(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || oa;
        return Xy = hl.current, nr(hl, a, e), nr(Di, Di.current, e), !0;
      }
    }
    function nw(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var o = tw(e, t, Xy);
          i.__reactInternalMemoizedMergedChildContext = o, tr(Di, e), tr(hl, e), nr(hl, o, e), nr(Di, a, e);
        } else
          tr(Di, e), nr(Di, a, e);
      }
    }
    function sb(e) {
      {
        if (!bv(e) || e.tag !== me)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case ee:
              return t.stateNode.context;
            case me: {
              var a = t.type;
              if (_i(a))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var ko = 0, Mh = 1, ml = null, Ky = !1, Zy = !1;
    function rw(e) {
      ml === null ? ml = [e] : ml.push(e);
    }
    function cb(e) {
      Ky = !0, rw(e);
    }
    function aw() {
      Ky && Do();
    }
    function Do() {
      if (!Zy && ml !== null) {
        Zy = !0;
        var e = 0, t = dr();
        try {
          var a = !0, i = ml;
          for (It(Jn); e < i.length; e++) {
            var o = i[e];
            do
              o = o(a);
            while (o !== null);
          }
          ml = null, Ky = !1;
        } catch (s) {
          throw ml !== null && (ml = ml.slice(e + 1)), $f(Va, Do), s;
        } finally {
          It(t), Zy = !1;
        }
      }
      return null;
    }
    var Gc = [], Wc = 0, Lh = null, zh = 0, Ta = [], Ra = 0, Zu = null, yl = 1, gl = "";
    function fb(e) {
      return es(), (e.flags & gu) !== le;
    }
    function db(e) {
      return es(), zh;
    }
    function pb() {
      var e = gl, t = yl, a = t & ~vb(t);
      return a.toString(32) + e;
    }
    function Ju(e, t) {
      es(), Gc[Wc++] = zh, Gc[Wc++] = Lh, Lh = e, zh = t;
    }
    function iw(e, t, a) {
      es(), Ta[Ra++] = yl, Ta[Ra++] = gl, Ta[Ra++] = Zu, Zu = e;
      var i = yl, o = gl, s = Oh(i) - 1, f = i & ~(1 << s), p = a + 1, v = Oh(t) + s;
      if (v > 30) {
        var m = s - s % 5, y = (1 << m) - 1, x = (f & y).toString(32), C = f >> m, _ = s - m, L = Oh(t) + _, z = p << _, I = z | C, ce = x + o;
        yl = 1 << L | I, gl = ce;
      } else {
        var ie = p << s, je = ie | f, Ne = o;
        yl = 1 << v | je, gl = Ne;
      }
    }
    function Jy(e) {
      es();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        Ju(e, a), iw(e, a, i);
      }
    }
    function Oh(e) {
      return 32 - Qt(e);
    }
    function vb(e) {
      return 1 << Oh(e) - 1;
    }
    function eg(e) {
      for (; e === Lh; )
        Lh = Gc[--Wc], Gc[Wc] = null, zh = Gc[--Wc], Gc[Wc] = null;
      for (; e === Zu; )
        Zu = Ta[--Ra], Ta[Ra] = null, gl = Ta[--Ra], Ta[Ra] = null, yl = Ta[--Ra], Ta[Ra] = null;
    }
    function hb() {
      return es(), Zu !== null ? {
        id: yl,
        overflow: gl
      } : null;
    }
    function mb(e, t) {
      es(), Ta[Ra++] = yl, Ta[Ra++] = gl, Ta[Ra++] = Zu, yl = t.id, gl = t.overflow, Zu = e;
    }
    function es() {
      On() || S("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var zn = null, ka = null, Ia = !1, ts = !1, _o = null;
    function yb() {
      Ia && S("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function lw() {
      ts = !0;
    }
    function gb() {
      return ts;
    }
    function Sb(e) {
      var t = e.stateNode.containerInfo;
      return ka = Hx(t), zn = e, Ia = !0, _o = null, ts = !1, !0;
    }
    function wb(e, t, a) {
      return ka = Fx(t), zn = e, Ia = !0, _o = null, ts = !1, a !== null && mb(e, a), !0;
    }
    function ow(e, t) {
      switch (e.tag) {
        case ee: {
          Wx(e.stateNode.containerInfo, t);
          break;
        }
        case ae: {
          var a = (e.mode & De) !== oe;
          qx(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case _e: {
          var i = e.memoizedState;
          i.dehydrated !== null && Xx(i.dehydrated, t);
          break;
        }
      }
    }
    function uw(e, t) {
      ow(e, t);
      var a = bk();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= $n) : i.push(a);
    }
    function tg(e, t) {
      {
        if (ts)
          return;
        switch (e.tag) {
          case ee: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case ae:
                var i = t.type;
                t.pendingProps, Kx(a, i);
                break;
              case ge:
                var o = t.pendingProps;
                Zx(a, o);
                break;
            }
            break;
          }
          case ae: {
            var s = e.type, f = e.memoizedProps, p = e.stateNode;
            switch (t.tag) {
              case ae: {
                var v = t.type, m = t.pendingProps, y = (e.mode & De) !== oe;
                tb(
                  s,
                  f,
                  p,
                  v,
                  m,
                  // TODO: Delete this argument when we remove the legacy root API.
                  y
                );
                break;
              }
              case ge: {
                var x = t.pendingProps, C = (e.mode & De) !== oe;
                nb(
                  s,
                  f,
                  p,
                  x,
                  // TODO: Delete this argument when we remove the legacy root API.
                  C
                );
                break;
              }
            }
            break;
          }
          case _e: {
            var _ = e.memoizedState, L = _.dehydrated;
            if (L !== null) switch (t.tag) {
              case ae:
                var z = t.type;
                t.pendingProps, Jx(L, z);
                break;
              case ge:
                var I = t.pendingProps;
                eb(L, I);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function sw(e, t) {
      t.flags = t.flags & ~wt | St, tg(e, t);
    }
    function cw(e, t) {
      switch (e.tag) {
        case ae: {
          var a = e.type;
          e.pendingProps;
          var i = Lx(t, a);
          return i !== null ? (e.stateNode = i, zn = e, ka = Ax(i), !0) : !1;
        }
        case ge: {
          var o = e.pendingProps, s = zx(t, o);
          return s !== null ? (e.stateNode = s, zn = e, ka = null, !0) : !1;
        }
        case _e: {
          var f = Ox(t);
          if (f !== null) {
            var p = {
              dehydrated: f,
              treeContext: hb(),
              retryLane: qn
            };
            e.memoizedState = p;
            var v = Tk(f);
            return v.return = e, e.child = v, zn = e, ka = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function ng(e) {
      return (e.mode & De) !== oe && (e.flags & Re) === le;
    }
    function rg(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function ag(e) {
      if (Ia) {
        var t = ka;
        if (!t) {
          ng(e) && (tg(zn, e), rg()), sw(zn, e), Ia = !1, zn = e;
          return;
        }
        var a = t;
        if (!cw(e, t)) {
          ng(e) && (tg(zn, e), rg()), t = jd(a);
          var i = zn;
          if (!t || !cw(e, t)) {
            sw(zn, e), Ia = !1, zn = e;
            return;
          }
          uw(i, a);
        }
      }
    }
    function Cb(e, t, a) {
      var i = e.stateNode, o = !ts, s = jx(i, e.type, e.memoizedProps, t, a, e, o);
      return e.updateQueue = s, s !== null;
    }
    function Eb(e) {
      var t = e.stateNode, a = e.memoizedProps, i = Vx(t, a, e);
      if (i) {
        var o = zn;
        if (o !== null)
          switch (o.tag) {
            case ee: {
              var s = o.stateNode.containerInfo, f = (o.mode & De) !== oe;
              $x(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case ae: {
              var p = o.type, v = o.memoizedProps, m = o.stateNode, y = (o.mode & De) !== oe;
              Gx(
                p,
                v,
                m,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                y
              );
              break;
            }
          }
      }
      return i;
    }
    function xb(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      Bx(a, e);
    }
    function bb(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return Px(a);
    }
    function fw(e) {
      for (var t = e.return; t !== null && t.tag !== ae && t.tag !== ee && t.tag !== _e; )
        t = t.return;
      zn = t;
    }
    function Nh(e) {
      if (e !== zn)
        return !1;
      if (!Ia)
        return fw(e), Ia = !0, !1;
      if (e.tag !== ee && (e.tag !== ae || Ix(e.type) && !jy(e.type, e.memoizedProps))) {
        var t = ka;
        if (t)
          if (ng(e))
            dw(e), rg();
          else
            for (; t; )
              uw(e, t), t = jd(t);
      }
      return fw(e), e.tag === _e ? ka = bb(e) : ka = zn ? jd(e.stateNode) : null, !0;
    }
    function Tb() {
      return Ia && ka !== null;
    }
    function dw(e) {
      for (var t = ka; t; )
        ow(e, t), t = jd(t);
    }
    function Xc() {
      zn = null, ka = null, Ia = !1, ts = !1;
    }
    function pw() {
      _o !== null && (lC(_o), _o = null);
    }
    function On() {
      return Ia;
    }
    function ig(e) {
      _o === null ? _o = [e] : _o.push(e);
    }
    var Rb = ke.ReactCurrentBatchConfig, kb = null;
    function Db() {
      return Rb.transition;
    }
    var $a = {
      recordUnsafeLifecycleWarnings: function(e, t) {
      },
      flushPendingUnsafeLifecycleWarnings: function() {
      },
      recordLegacyContextWarning: function(e, t) {
      },
      flushLegacyContextWarning: function() {
      },
      discardPendingWarnings: function() {
      }
    };
    {
      var _b = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & Ce && (t = a), a = a.return;
        return t;
      }, ns = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, Yd = [], Qd = [], Id = [], $d = [], Gd = [], Wd = [], rs = /* @__PURE__ */ new Set();
      $a.recordUnsafeLifecycleWarnings = function(e, t) {
        rs.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && Yd.push(e), e.mode & Ce && typeof t.UNSAFE_componentWillMount == "function" && Qd.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && Id.push(e), e.mode & Ce && typeof t.UNSAFE_componentWillReceiveProps == "function" && $d.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && Gd.push(e), e.mode & Ce && typeof t.UNSAFE_componentWillUpdate == "function" && Wd.push(e));
      }, $a.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        Yd.length > 0 && (Yd.forEach(function(C) {
          e.add(Ee(C) || "Component"), rs.add(C.type);
        }), Yd = []);
        var t = /* @__PURE__ */ new Set();
        Qd.length > 0 && (Qd.forEach(function(C) {
          t.add(Ee(C) || "Component"), rs.add(C.type);
        }), Qd = []);
        var a = /* @__PURE__ */ new Set();
        Id.length > 0 && (Id.forEach(function(C) {
          a.add(Ee(C) || "Component"), rs.add(C.type);
        }), Id = []);
        var i = /* @__PURE__ */ new Set();
        $d.length > 0 && ($d.forEach(function(C) {
          i.add(Ee(C) || "Component"), rs.add(C.type);
        }), $d = []);
        var o = /* @__PURE__ */ new Set();
        Gd.length > 0 && (Gd.forEach(function(C) {
          o.add(Ee(C) || "Component"), rs.add(C.type);
        }), Gd = []);
        var s = /* @__PURE__ */ new Set();
        if (Wd.length > 0 && (Wd.forEach(function(C) {
          s.add(Ee(C) || "Component"), rs.add(C.type);
        }), Wd = []), t.size > 0) {
          var f = ns(t);
          S(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, f);
        }
        if (i.size > 0) {
          var p = ns(i);
          S(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, p);
        }
        if (s.size > 0) {
          var v = ns(s);
          S(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, v);
        }
        if (e.size > 0) {
          var m = ns(e);
          zt(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, m);
        }
        if (a.size > 0) {
          var y = ns(a);
          zt(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, y);
        }
        if (o.size > 0) {
          var x = ns(o);
          zt(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, x);
        }
      };
      var Uh = /* @__PURE__ */ new Map(), vw = /* @__PURE__ */ new Set();
      $a.recordLegacyContextWarning = function(e, t) {
        var a = _b(e);
        if (a === null) {
          S("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!vw.has(e.type)) {
          var i = Uh.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], Uh.set(a, i)), i.push(e));
        }
      }, $a.flushLegacyContextWarning = function() {
        Uh.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(Ee(s) || "Component"), vw.add(s.type);
            });
            var o = ns(i);
            try {
              ut(a), S(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, o);
            } finally {
              Pt();
            }
          }
        });
      }, $a.discardPendingWarnings = function() {
        Yd = [], Qd = [], Id = [], $d = [], Gd = [], Wd = [], Uh = /* @__PURE__ */ new Map();
      };
    }
    var lg, og, ug, sg, cg, hw = function(e, t) {
    };
    lg = !1, og = !1, ug = {}, sg = {}, cg = {}, hw = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = Ee(t) || "Component";
        sg[a] || (sg[a] = !0, S('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function Mb(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function Xd(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & Ce || xr) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== me) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !Mb(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var o = Ee(e) || "Component";
          ug[o] || (S('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', o, i), ug[o] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var p = s;
            if (p.tag !== me)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            f = p.stateNode;
          }
          if (!f)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var v = f;
          Ml(i, "ref");
          var m = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === m)
            return t.ref;
          var y = function(x) {
            var C = v.refs;
            x === null ? delete C[m] : C[m] = x;
          };
          return y._stringRef = m, y;
        } else {
          if (typeof i != "string")
            throw new Error("Expected ref to be a function, a string, an object returned by React.createRef(), or null.");
          if (!a._owner)
            throw new Error("Element ref was specified as a string (" + i + `) but no owner was set. This could happen for one of the following reasons:
1. You may be adding a ref to a function component
2. You may be adding a ref to a component that was not created inside a component's render method
3. You have multiple copies of React loaded
See https://reactjs.org/link/refs-must-have-owner for more information.`);
        }
      }
      return i;
    }
    function Ah(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Hh(e) {
      {
        var t = Ee(e) || "Component";
        if (cg[t])
          return;
        cg[t] = !0, S("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function mw(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function yw(e) {
      function t(T, O) {
        if (e) {
          var R = T.deletions;
          R === null ? (T.deletions = [O], T.flags |= $n) : R.push(O);
        }
      }
      function a(T, O) {
        if (!e)
          return null;
        for (var R = O; R !== null; )
          t(T, R), R = R.sibling;
        return null;
      }
      function i(T, O) {
        for (var R = /* @__PURE__ */ new Map(), j = O; j !== null; )
          j.key !== null ? R.set(j.key, j) : R.set(j.index, j), j = j.sibling;
        return R;
      }
      function o(T, O) {
        var R = ds(T, O);
        return R.index = 0, R.sibling = null, R;
      }
      function s(T, O, R) {
        if (T.index = R, !e)
          return T.flags |= gu, O;
        var j = T.alternate;
        if (j !== null) {
          var K = j.index;
          return K < O ? (T.flags |= St, O) : K;
        } else
          return T.flags |= St, O;
      }
      function f(T) {
        return e && T.alternate === null && (T.flags |= St), T;
      }
      function p(T, O, R, j) {
        if (O === null || O.tag !== ge) {
          var K = iS(R, T.mode, j);
          return K.return = T, K;
        } else {
          var G = o(O, R);
          return G.return = T, G;
        }
      }
      function v(T, O, R, j) {
        var K = R.type;
        if (K === pa)
          return y(T, O, R.props.children, j, R.key);
        if (O !== null && (O.elementType === K || // Keep this check inline so it only runs on the false path:
        EC(O, R) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof K == "object" && K !== null && K.$$typeof === wn && mw(K) === O.type)) {
          var G = o(O, R.props);
          return G.ref = Xd(T, O, R), G.return = T, G._debugSource = R._source, G._debugOwner = R._owner, G;
        }
        var ve = aS(R, T.mode, j);
        return ve.ref = Xd(T, O, R), ve.return = T, ve;
      }
      function m(T, O, R, j) {
        if (O === null || O.tag !== Ve || O.stateNode.containerInfo !== R.containerInfo || O.stateNode.implementation !== R.implementation) {
          var K = lS(R, T.mode, j);
          return K.return = T, K;
        } else {
          var G = o(O, R.children || []);
          return G.return = T, G;
        }
      }
      function y(T, O, R, j, K) {
        if (O === null || O.tag !== rt) {
          var G = Vo(R, T.mode, j, K);
          return G.return = T, G;
        } else {
          var ve = o(O, R);
          return ve.return = T, ve;
        }
      }
      function x(T, O, R) {
        if (typeof O == "string" && O !== "" || typeof O == "number") {
          var j = iS("" + O, T.mode, R);
          return j.return = T, j;
        }
        if (typeof O == "object" && O !== null) {
          switch (O.$$typeof) {
            case da: {
              var K = aS(O, T.mode, R);
              return K.ref = Xd(T, null, O), K.return = T, K;
            }
            case Vi: {
              var G = lS(O, T.mode, R);
              return G.return = T, G;
            }
            case wn: {
              var ve = O._payload, we = O._init;
              return x(T, we(ve), R);
            }
          }
          if (Yt(O) || Bi(O)) {
            var nt = Vo(O, T.mode, R, null);
            return nt.return = T, nt;
          }
          Ah(T, O);
        }
        return typeof O == "function" && Hh(T), null;
      }
      function C(T, O, R, j) {
        var K = O !== null ? O.key : null;
        if (typeof R == "string" && R !== "" || typeof R == "number")
          return K !== null ? null : p(T, O, "" + R, j);
        if (typeof R == "object" && R !== null) {
          switch (R.$$typeof) {
            case da:
              return R.key === K ? v(T, O, R, j) : null;
            case Vi:
              return R.key === K ? m(T, O, R, j) : null;
            case wn: {
              var G = R._payload, ve = R._init;
              return C(T, O, ve(G), j);
            }
          }
          if (Yt(R) || Bi(R))
            return K !== null ? null : y(T, O, R, j, null);
          Ah(T, R);
        }
        return typeof R == "function" && Hh(T), null;
      }
      function _(T, O, R, j, K) {
        if (typeof j == "string" && j !== "" || typeof j == "number") {
          var G = T.get(R) || null;
          return p(O, G, "" + j, K);
        }
        if (typeof j == "object" && j !== null) {
          switch (j.$$typeof) {
            case da: {
              var ve = T.get(j.key === null ? R : j.key) || null;
              return v(O, ve, j, K);
            }
            case Vi: {
              var we = T.get(j.key === null ? R : j.key) || null;
              return m(O, we, j, K);
            }
            case wn:
              var nt = j._payload, Pe = j._init;
              return _(T, O, R, Pe(nt), K);
          }
          if (Yt(j) || Bi(j)) {
            var Wt = T.get(R) || null;
            return y(O, Wt, j, K, null);
          }
          Ah(O, j);
        }
        return typeof j == "function" && Hh(O), null;
      }
      function L(T, O, R) {
        {
          if (typeof T != "object" || T === null)
            return O;
          switch (T.$$typeof) {
            case da:
            case Vi:
              hw(T, R);
              var j = T.key;
              if (typeof j != "string")
                break;
              if (O === null) {
                O = /* @__PURE__ */ new Set(), O.add(j);
                break;
              }
              if (!O.has(j)) {
                O.add(j);
                break;
              }
              S("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", j);
              break;
            case wn:
              var K = T._payload, G = T._init;
              L(G(K), O, R);
              break;
          }
        }
        return O;
      }
      function z(T, O, R, j) {
        for (var K = null, G = 0; G < R.length; G++) {
          var ve = R[G];
          K = L(ve, K, T);
        }
        for (var we = null, nt = null, Pe = O, Wt = 0, Ye = 0, Bt = null; Pe !== null && Ye < R.length; Ye++) {
          Pe.index > Ye ? (Bt = Pe, Pe = null) : Bt = Pe.sibling;
          var ar = C(T, Pe, R[Ye], j);
          if (ar === null) {
            Pe === null && (Pe = Bt);
            break;
          }
          e && Pe && ar.alternate === null && t(T, Pe), Wt = s(ar, Wt, Ye), nt === null ? we = ar : nt.sibling = ar, nt = ar, Pe = Bt;
        }
        if (Ye === R.length) {
          if (a(T, Pe), On()) {
            var Vn = Ye;
            Ju(T, Vn);
          }
          return we;
        }
        if (Pe === null) {
          for (; Ye < R.length; Ye++) {
            var sa = x(T, R[Ye], j);
            sa !== null && (Wt = s(sa, Wt, Ye), nt === null ? we = sa : nt.sibling = sa, nt = sa);
          }
          if (On()) {
            var Sr = Ye;
            Ju(T, Sr);
          }
          return we;
        }
        for (var wr = i(T, Pe); Ye < R.length; Ye++) {
          var ir = _(wr, T, Ye, R[Ye], j);
          ir !== null && (e && ir.alternate !== null && wr.delete(ir.key === null ? Ye : ir.key), Wt = s(ir, Wt, Ye), nt === null ? we = ir : nt.sibling = ir, nt = ir);
        }
        if (e && wr.forEach(function(hf) {
          return t(T, hf);
        }), On()) {
          var Tl = Ye;
          Ju(T, Tl);
        }
        return we;
      }
      function I(T, O, R, j) {
        var K = Bi(R);
        if (typeof K != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          R[Symbol.toStringTag] === "Generator" && (og || S("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), og = !0), R.entries === K && (lg || S("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), lg = !0);
          var G = K.call(R);
          if (G)
            for (var ve = null, we = G.next(); !we.done; we = G.next()) {
              var nt = we.value;
              ve = L(nt, ve, T);
            }
        }
        var Pe = K.call(R);
        if (Pe == null)
          throw new Error("An iterable object provided no iterator.");
        for (var Wt = null, Ye = null, Bt = O, ar = 0, Vn = 0, sa = null, Sr = Pe.next(); Bt !== null && !Sr.done; Vn++, Sr = Pe.next()) {
          Bt.index > Vn ? (sa = Bt, Bt = null) : sa = Bt.sibling;
          var wr = C(T, Bt, Sr.value, j);
          if (wr === null) {
            Bt === null && (Bt = sa);
            break;
          }
          e && Bt && wr.alternate === null && t(T, Bt), ar = s(wr, ar, Vn), Ye === null ? Wt = wr : Ye.sibling = wr, Ye = wr, Bt = sa;
        }
        if (Sr.done) {
          if (a(T, Bt), On()) {
            var ir = Vn;
            Ju(T, ir);
          }
          return Wt;
        }
        if (Bt === null) {
          for (; !Sr.done; Vn++, Sr = Pe.next()) {
            var Tl = x(T, Sr.value, j);
            Tl !== null && (ar = s(Tl, ar, Vn), Ye === null ? Wt = Tl : Ye.sibling = Tl, Ye = Tl);
          }
          if (On()) {
            var hf = Vn;
            Ju(T, hf);
          }
          return Wt;
        }
        for (var kp = i(T, Bt); !Sr.done; Vn++, Sr = Pe.next()) {
          var Hi = _(kp, T, Vn, Sr.value, j);
          Hi !== null && (e && Hi.alternate !== null && kp.delete(Hi.key === null ? Vn : Hi.key), ar = s(Hi, ar, Vn), Ye === null ? Wt = Hi : Ye.sibling = Hi, Ye = Hi);
        }
        if (e && kp.forEach(function(nD) {
          return t(T, nD);
        }), On()) {
          var tD = Vn;
          Ju(T, tD);
        }
        return Wt;
      }
      function ce(T, O, R, j) {
        if (O !== null && O.tag === ge) {
          a(T, O.sibling);
          var K = o(O, R);
          return K.return = T, K;
        }
        a(T, O);
        var G = iS(R, T.mode, j);
        return G.return = T, G;
      }
      function ie(T, O, R, j) {
        for (var K = R.key, G = O; G !== null; ) {
          if (G.key === K) {
            var ve = R.type;
            if (ve === pa) {
              if (G.tag === rt) {
                a(T, G.sibling);
                var we = o(G, R.props.children);
                return we.return = T, we._debugSource = R._source, we._debugOwner = R._owner, we;
              }
            } else if (G.elementType === ve || // Keep this check inline so it only runs on the false path:
            EC(G, R) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof ve == "object" && ve !== null && ve.$$typeof === wn && mw(ve) === G.type) {
              a(T, G.sibling);
              var nt = o(G, R.props);
              return nt.ref = Xd(T, G, R), nt.return = T, nt._debugSource = R._source, nt._debugOwner = R._owner, nt;
            }
            a(T, G);
            break;
          } else
            t(T, G);
          G = G.sibling;
        }
        if (R.type === pa) {
          var Pe = Vo(R.props.children, T.mode, j, R.key);
          return Pe.return = T, Pe;
        } else {
          var Wt = aS(R, T.mode, j);
          return Wt.ref = Xd(T, O, R), Wt.return = T, Wt;
        }
      }
      function je(T, O, R, j) {
        for (var K = R.key, G = O; G !== null; ) {
          if (G.key === K)
            if (G.tag === Ve && G.stateNode.containerInfo === R.containerInfo && G.stateNode.implementation === R.implementation) {
              a(T, G.sibling);
              var ve = o(G, R.children || []);
              return ve.return = T, ve;
            } else {
              a(T, G);
              break;
            }
          else
            t(T, G);
          G = G.sibling;
        }
        var we = lS(R, T.mode, j);
        return we.return = T, we;
      }
      function Ne(T, O, R, j) {
        var K = typeof R == "object" && R !== null && R.type === pa && R.key === null;
        if (K && (R = R.props.children), typeof R == "object" && R !== null) {
          switch (R.$$typeof) {
            case da:
              return f(ie(T, O, R, j));
            case Vi:
              return f(je(T, O, R, j));
            case wn:
              var G = R._payload, ve = R._init;
              return Ne(T, O, ve(G), j);
          }
          if (Yt(R))
            return z(T, O, R, j);
          if (Bi(R))
            return I(T, O, R, j);
          Ah(T, R);
        }
        return typeof R == "string" && R !== "" || typeof R == "number" ? f(ce(T, O, "" + R, j)) : (typeof R == "function" && Hh(T), a(T, O));
      }
      return Ne;
    }
    var qc = yw(!0), gw = yw(!1);
    function Lb(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = ds(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = ds(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function zb(e, t) {
      for (var a = e.child; a !== null; )
        Sk(a, t), a = a.sibling;
    }
    var fg = Ro(null), dg;
    dg = {};
    var Fh = null, Kc = null, pg = null, jh = !1;
    function Vh() {
      Fh = null, Kc = null, pg = null, jh = !1;
    }
    function Sw() {
      jh = !0;
    }
    function ww() {
      jh = !1;
    }
    function Cw(e, t, a) {
      nr(fg, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== dg && S("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = dg;
    }
    function vg(e, t) {
      var a = fg.current;
      tr(fg, t), e._currentValue = a;
    }
    function hg(e, t, a) {
      for (var i = e; i !== null; ) {
        var o = i.alternate;
        if (rl(i.childLanes, t) ? o !== null && !rl(o.childLanes, t) && (o.childLanes = xe(o.childLanes, t)) : (i.childLanes = xe(i.childLanes, t), o !== null && (o.childLanes = xe(o.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && S("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Ob(e, t, a) {
      Nb(e, t, a);
    }
    function Nb(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var o = void 0, s = i.dependencies;
        if (s !== null) {
          o = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === me) {
                var p = Jt(a), v = Sl(Ze, p);
                v.tag = Ph;
                var m = i.updateQueue;
                if (m !== null) {
                  var y = m.shared, x = y.pending;
                  x === null ? v.next = v : (v.next = x.next, x.next = v), y.pending = v;
                }
              }
              i.lanes = xe(i.lanes, a);
              var C = i.alternate;
              C !== null && (C.lanes = xe(C.lanes, a)), hg(i.return, a, e), s.lanes = xe(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === yn)
          o = i.type === e.type ? null : i.child;
        else if (i.tag === qt) {
          var _ = i.return;
          if (_ === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          _.lanes = xe(_.lanes, a);
          var L = _.alternate;
          L !== null && (L.lanes = xe(L.lanes, a)), hg(_, a, e), o = i.sibling;
        } else
          o = i.child;
        if (o !== null)
          o.return = i;
        else
          for (o = i; o !== null; ) {
            if (o === e) {
              o = null;
              break;
            }
            var z = o.sibling;
            if (z !== null) {
              z.return = o.return, o = z;
              break;
            }
            o = o.return;
          }
        i = o;
      }
    }
    function Zc(e, t) {
      Fh = e, Kc = null, pg = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (Zn(a.lanes, t) && cp(), a.firstContext = null);
      }
    }
    function tn(e) {
      jh && S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (pg !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (Kc === null) {
          if (Fh === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          Kc = a, Fh.dependencies = {
            lanes: N,
            firstContext: a
          };
        } else
          Kc = Kc.next = a;
      }
      return t;
    }
    var as = null;
    function mg(e) {
      as === null ? as = [e] : as.push(e);
    }
    function Ub() {
      if (as !== null) {
        for (var e = 0; e < as.length; e++) {
          var t = as[e], a = t.interleaved;
          if (a !== null) {
            t.interleaved = null;
            var i = a.next, o = t.pending;
            if (o !== null) {
              var s = o.next;
              o.next = i, a.next = s;
            }
            t.pending = a;
          }
        }
        as = null;
      }
    }
    function Ew(e, t, a, i) {
      var o = t.interleaved;
      return o === null ? (a.next = a, mg(t)) : (a.next = o.next, o.next = a), t.interleaved = a, Bh(e, i);
    }
    function Ab(e, t, a, i) {
      var o = t.interleaved;
      o === null ? (a.next = a, mg(t)) : (a.next = o.next, o.next = a), t.interleaved = a;
    }
    function Hb(e, t, a, i) {
      var o = t.interleaved;
      return o === null ? (a.next = a, mg(t)) : (a.next = o.next, o.next = a), t.interleaved = a, Bh(e, i);
    }
    function Vr(e, t) {
      return Bh(e, t);
    }
    var Fb = Bh;
    function Bh(e, t) {
      e.lanes = xe(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = xe(a.lanes, t)), a === null && (e.flags & (St | wt)) !== le && gC(e);
      for (var i = e, o = e.return; o !== null; )
        o.childLanes = xe(o.childLanes, t), a = o.alternate, a !== null ? a.childLanes = xe(a.childLanes, t) : (o.flags & (St | wt)) !== le && gC(e), i = o, o = o.return;
      if (i.tag === ee) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var xw = 0, bw = 1, Ph = 2, yg = 3, Yh = !1, gg, Qh;
    gg = !1, Qh = null;
    function Sg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: N
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function Tw(e, t) {
      var a = t.updateQueue, i = e.updateQueue;
      if (a === i) {
        var o = {
          baseState: i.baseState,
          firstBaseUpdate: i.firstBaseUpdate,
          lastBaseUpdate: i.lastBaseUpdate,
          shared: i.shared,
          effects: i.effects
        };
        t.updateQueue = o;
      }
    }
    function Sl(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: xw,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function Mo(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var o = i.shared;
      if (Qh === o && !gg && (S("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), gg = !0), AR()) {
        var s = o.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), o.pending = t, Fb(e, a);
      } else
        return Hb(e, o, t, a);
    }
    function Ih(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var o = i.shared;
        if (sd(a)) {
          var s = o.lanes;
          s = yc(s, e.pendingLanes);
          var f = xe(s, a);
          o.lanes = f, Nu(e, f);
        }
      }
    }
    function wg(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null) {
        var o = i.updateQueue;
        if (a === o) {
          var s = null, f = null, p = a.firstBaseUpdate;
          if (p !== null) {
            var v = p;
            do {
              var m = {
                eventTime: v.eventTime,
                lane: v.lane,
                tag: v.tag,
                payload: v.payload,
                callback: v.callback,
                next: null
              };
              f === null ? s = f = m : (f.next = m, f = m), v = v.next;
            } while (v !== null);
            f === null ? s = f = t : (f.next = t, f = t);
          } else
            s = f = t;
          a = {
            baseState: o.baseState,
            firstBaseUpdate: s,
            lastBaseUpdate: f,
            shared: o.shared,
            effects: o.effects
          }, e.updateQueue = a;
          return;
        }
      }
      var y = a.lastBaseUpdate;
      y === null ? a.firstBaseUpdate = t : y.next = t, a.lastBaseUpdate = t;
    }
    function jb(e, t, a, i, o, s) {
      switch (a.tag) {
        case bw: {
          var f = a.payload;
          if (typeof f == "function") {
            Sw();
            var p = f.call(s, i, o);
            {
              if (e.mode & Ce) {
                Ke(!0);
                try {
                  f.call(s, i, o);
                } finally {
                  Ke(!1);
                }
              }
              ww();
            }
            return p;
          }
          return f;
        }
        case yg:
          e.flags = e.flags & ~xn | Re;
        case xw: {
          var v = a.payload, m;
          if (typeof v == "function") {
            Sw(), m = v.call(s, i, o);
            {
              if (e.mode & Ce) {
                Ke(!0);
                try {
                  v.call(s, i, o);
                } finally {
                  Ke(!1);
                }
              }
              ww();
            }
          } else
            m = v;
          return m == null ? i : Le({}, i, m);
        }
        case Ph:
          return Yh = !0, i;
      }
      return i;
    }
    function $h(e, t, a, i) {
      var o = e.updateQueue;
      Yh = !1, Qh = o.shared;
      var s = o.firstBaseUpdate, f = o.lastBaseUpdate, p = o.shared.pending;
      if (p !== null) {
        o.shared.pending = null;
        var v = p, m = v.next;
        v.next = null, f === null ? s = m : f.next = m, f = v;
        var y = e.alternate;
        if (y !== null) {
          var x = y.updateQueue, C = x.lastBaseUpdate;
          C !== f && (C === null ? x.firstBaseUpdate = m : C.next = m, x.lastBaseUpdate = v);
        }
      }
      if (s !== null) {
        var _ = o.baseState, L = N, z = null, I = null, ce = null, ie = s;
        do {
          var je = ie.lane, Ne = ie.eventTime;
          if (rl(i, je)) {
            if (ce !== null) {
              var O = {
                eventTime: Ne,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: jt,
                tag: ie.tag,
                payload: ie.payload,
                callback: ie.callback,
                next: null
              };
              ce = ce.next = O;
            }
            _ = jb(e, o, ie, _, t, a);
            var R = ie.callback;
            if (R !== null && // If the update was already committed, we should not queue its
            // callback again.
            ie.lane !== jt) {
              e.flags |= lt;
              var j = o.effects;
              j === null ? o.effects = [ie] : j.push(ie);
            }
          } else {
            var T = {
              eventTime: Ne,
              lane: je,
              tag: ie.tag,
              payload: ie.payload,
              callback: ie.callback,
              next: null
            };
            ce === null ? (I = ce = T, z = _) : ce = ce.next = T, L = xe(L, je);
          }
          if (ie = ie.next, ie === null) {
            if (p = o.shared.pending, p === null)
              break;
            var K = p, G = K.next;
            K.next = null, ie = G, o.lastBaseUpdate = K, o.shared.pending = null;
          }
        } while (!0);
        ce === null && (z = _), o.baseState = z, o.firstBaseUpdate = I, o.lastBaseUpdate = ce;
        var ve = o.shared.interleaved;
        if (ve !== null) {
          var we = ve;
          do
            L = xe(L, we.lane), we = we.next;
          while (we !== ve);
        } else s === null && (o.shared.lanes = N);
        Ep(L), e.lanes = L, e.memoizedState = _;
      }
      Qh = null;
    }
    function Vb(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function Rw() {
      Yh = !1;
    }
    function Gh() {
      return Yh;
    }
    function kw(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var o = 0; o < i.length; o++) {
          var s = i[o], f = s.callback;
          f !== null && (s.callback = null, Vb(f, a));
        }
    }
    var qd = {}, Lo = Ro(qd), Kd = Ro(qd), Wh = Ro(qd);
    function Xh(e) {
      if (e === qd)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function Dw() {
      var e = Xh(Wh.current);
      return e;
    }
    function Cg(e, t) {
      nr(Wh, t, e), nr(Kd, e, e), nr(Lo, qd, e);
      var a = rx(t);
      tr(Lo, e), nr(Lo, a, e);
    }
    function Jc(e) {
      tr(Lo, e), tr(Kd, e), tr(Wh, e);
    }
    function Eg() {
      var e = Xh(Lo.current);
      return e;
    }
    function _w(e) {
      Xh(Wh.current);
      var t = Xh(Lo.current), a = ax(t, e.type);
      t !== a && (nr(Kd, e, e), nr(Lo, a, e));
    }
    function xg(e) {
      Kd.current === e && (tr(Lo, e), tr(Kd, e));
    }
    var Bb = 0, Mw = 1, Lw = 1, Zd = 2, Ga = Ro(Bb);
    function bg(e, t) {
      return (e & t) !== 0;
    }
    function ef(e) {
      return e & Mw;
    }
    function Tg(e, t) {
      return e & Mw | t;
    }
    function Pb(e, t) {
      return e | t;
    }
    function zo(e, t) {
      nr(Ga, t, e);
    }
    function tf(e) {
      tr(Ga, e);
    }
    function Yb(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function qh(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === _e) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || WS(i) || Yy(i))
              return t;
          }
        } else if (t.tag === bt && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var o = (t.flags & Re) !== le;
          if (o)
            return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e)
          return null;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    var Br = (
      /*   */
      0
    ), sn = (
      /* */
      1
    ), Mi = (
      /*  */
      2
    ), cn = (
      /*    */
      4
    ), Nn = (
      /*   */
      8
    ), Rg = [];
    function kg() {
      for (var e = 0; e < Rg.length; e++) {
        var t = Rg[e];
        t._workInProgressVersionPrimary = null;
      }
      Rg.length = 0;
    }
    function Qb(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var q = ke.ReactCurrentDispatcher, Jd = ke.ReactCurrentBatchConfig, Dg, nf;
    Dg = /* @__PURE__ */ new Set();
    var is = N, tt = null, fn = null, dn = null, Kh = !1, ep = !1, tp = 0, Ib = 0, $b = 25, U = null, Da = null, Oo = -1, _g = !1;
    function We() {
      {
        var e = U;
        Da === null ? Da = [e] : Da.push(e);
      }
    }
    function P() {
      {
        var e = U;
        Da !== null && (Oo++, Da[Oo] !== e && Gb(e));
      }
    }
    function rf(e) {
      e != null && !Yt(e) && S("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", U, typeof e);
    }
    function Gb(e) {
      {
        var t = Ee(tt);
        if (!Dg.has(t) && (Dg.add(t), Da !== null)) {
          for (var a = "", i = 30, o = 0; o <= Oo; o++) {
            for (var s = Da[o], f = o === Oo ? e : s, p = o + 1 + ". " + s; p.length < i; )
              p += " ";
            p += f + `
`, a += p;
          }
          S(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, a);
        }
      }
    }
    function rr() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function Mg(e, t) {
      if (_g)
        return !1;
      if (t === null)
        return S("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", U), !1;
      e.length !== t.length && S(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, U, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!$(e[a], t[a]))
          return !1;
      return !0;
    }
    function af(e, t, a, i, o, s) {
      is = s, tt = t, Da = e !== null ? e._debugHookTypes : null, Oo = -1, _g = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = N, e !== null && e.memoizedState !== null ? q.current = Jw : Da !== null ? q.current = Zw : q.current = Kw;
      var f = a(i, o);
      if (ep) {
        var p = 0;
        do {
          if (ep = !1, tp = 0, p >= $b)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          p += 1, _g = !1, fn = null, dn = null, t.updateQueue = null, Oo = -1, q.current = e1, f = a(i, o);
        } while (ep);
      }
      q.current = cm, t._debugHookTypes = Da;
      var v = fn !== null && fn.next !== null;
      if (is = N, tt = null, fn = null, dn = null, U = null, Da = null, Oo = -1, e !== null && (e.flags & Ft) !== (t.flags & Ft) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & De) !== oe && S("Internal React error: Expected static flag was missing. Please notify the React team."), Kh = !1, v)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function lf() {
      var e = tp !== 0;
      return tp = 0, e;
    }
    function zw(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & et) !== oe ? t.flags &= -50333701 : t.flags &= -2053, e.lanes = Ou(e.lanes, a);
    }
    function Ow() {
      if (q.current = cm, Kh) {
        for (var e = tt.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        Kh = !1;
      }
      is = N, tt = null, fn = null, dn = null, Da = null, Oo = -1, U = null, $w = !1, ep = !1, tp = 0;
    }
    function Li() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return dn === null ? tt.memoizedState = dn = e : dn = dn.next = e, dn;
    }
    function _a() {
      var e;
      if (fn === null) {
        var t = tt.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = fn.next;
      var a;
      if (dn === null ? a = tt.memoizedState : a = dn.next, a !== null)
        dn = a, a = dn.next, fn = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        fn = e;
        var i = {
          memoizedState: fn.memoizedState,
          baseState: fn.baseState,
          baseQueue: fn.baseQueue,
          queue: fn.queue,
          next: null
        };
        dn === null ? tt.memoizedState = dn = i : dn = dn.next = i;
      }
      return dn;
    }
    function Nw() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function Lg(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function zg(e, t, a) {
      var i = Li(), o;
      a !== void 0 ? o = a(t) : o = t, i.memoizedState = i.baseState = o;
      var s = {
        pending: null,
        interleaved: null,
        lanes: N,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: o
      };
      i.queue = s;
      var f = s.dispatch = Kb.bind(null, tt, s);
      return [i.memoizedState, f];
    }
    function Og(e, t, a) {
      var i = _a(), o = i.queue;
      if (o === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      o.lastRenderedReducer = e;
      var s = fn, f = s.baseQueue, p = o.pending;
      if (p !== null) {
        if (f !== null) {
          var v = f.next, m = p.next;
          f.next = m, p.next = v;
        }
        s.baseQueue !== f && S("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = f = p, o.pending = null;
      }
      if (f !== null) {
        var y = f.next, x = s.baseState, C = null, _ = null, L = null, z = y;
        do {
          var I = z.lane;
          if (rl(is, I)) {
            if (L !== null) {
              var ie = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: jt,
                action: z.action,
                hasEagerState: z.hasEagerState,
                eagerState: z.eagerState,
                next: null
              };
              L = L.next = ie;
            }
            if (z.hasEagerState)
              x = z.eagerState;
            else {
              var je = z.action;
              x = e(x, je);
            }
          } else {
            var ce = {
              lane: I,
              action: z.action,
              hasEagerState: z.hasEagerState,
              eagerState: z.eagerState,
              next: null
            };
            L === null ? (_ = L = ce, C = x) : L = L.next = ce, tt.lanes = xe(tt.lanes, I), Ep(I);
          }
          z = z.next;
        } while (z !== null && z !== y);
        L === null ? C = x : L.next = _, $(x, i.memoizedState) || cp(), i.memoizedState = x, i.baseState = C, i.baseQueue = L, o.lastRenderedState = x;
      }
      var Ne = o.interleaved;
      if (Ne !== null) {
        var T = Ne;
        do {
          var O = T.lane;
          tt.lanes = xe(tt.lanes, O), Ep(O), T = T.next;
        } while (T !== Ne);
      } else f === null && (o.lanes = N);
      var R = o.dispatch;
      return [i.memoizedState, R];
    }
    function Ng(e, t, a) {
      var i = _a(), o = i.queue;
      if (o === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      o.lastRenderedReducer = e;
      var s = o.dispatch, f = o.pending, p = i.memoizedState;
      if (f !== null) {
        o.pending = null;
        var v = f.next, m = v;
        do {
          var y = m.action;
          p = e(p, y), m = m.next;
        } while (m !== v);
        $(p, i.memoizedState) || cp(), i.memoizedState = p, i.baseQueue === null && (i.baseState = p), o.lastRenderedState = p;
      }
      return [p, s];
    }
    function vD(e, t, a) {
    }
    function hD(e, t, a) {
    }
    function Ug(e, t, a) {
      var i = tt, o = Li(), s, f = On();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), nf || s !== a() && (S("The result of getServerSnapshot should be cached to avoid an infinite loop"), nf = !0);
      } else {
        if (s = t(), !nf) {
          var p = t();
          $(s, p) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), nf = !0);
        }
        var v = _m();
        if (v === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        zu(v, is) || Uw(i, t, s);
      }
      o.memoizedState = s;
      var m = {
        value: s,
        getSnapshot: t
      };
      return o.queue = m, nm(Hw.bind(null, i, m, e), [e]), i.flags |= cr, np(sn | Nn, Aw.bind(null, i, m, s, t), void 0, null), s;
    }
    function Zh(e, t, a) {
      var i = tt, o = _a(), s = t();
      if (!nf) {
        var f = t();
        $(s, f) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), nf = !0);
      }
      var p = o.memoizedState, v = !$(p, s);
      v && (o.memoizedState = s, cp());
      var m = o.queue;
      if (ap(Hw.bind(null, i, m, e), [e]), m.getSnapshot !== t || v || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      dn !== null && dn.memoizedState.tag & sn) {
        i.flags |= cr, np(sn | Nn, Aw.bind(null, i, m, s, t), void 0, null);
        var y = _m();
        if (y === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        zu(y, is) || Uw(i, t, s);
      }
      return s;
    }
    function Uw(e, t, a) {
      e.flags |= Is;
      var i = {
        getSnapshot: t,
        value: a
      }, o = tt.updateQueue;
      if (o === null)
        o = Nw(), tt.updateQueue = o, o.stores = [i];
      else {
        var s = o.stores;
        s === null ? o.stores = [i] : s.push(i);
      }
    }
    function Aw(e, t, a, i) {
      t.value = a, t.getSnapshot = i, Fw(t) && jw(e);
    }
    function Hw(e, t, a) {
      var i = function() {
        Fw(t) && jw(e);
      };
      return a(i);
    }
    function Fw(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !$(a, i);
      } catch {
        return !0;
      }
    }
    function jw(e) {
      var t = Vr(e, de);
      t !== null && mn(t, e, de, Ze);
    }
    function Jh(e) {
      var t = Li();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: N,
        dispatch: null,
        lastRenderedReducer: Lg,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = Zb.bind(null, tt, a);
      return [t.memoizedState, i];
    }
    function Ag(e) {
      return Og(Lg);
    }
    function Hg(e) {
      return Ng(Lg);
    }
    function np(e, t, a, i) {
      var o = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = tt.updateQueue;
      if (s === null)
        s = Nw(), tt.updateQueue = s, s.lastEffect = o.next = o;
      else {
        var f = s.lastEffect;
        if (f === null)
          s.lastEffect = o.next = o;
        else {
          var p = f.next;
          f.next = o, o.next = p, s.lastEffect = o;
        }
      }
      return o;
    }
    function Fg(e) {
      var t = Li();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function em(e) {
      var t = _a();
      return t.memoizedState;
    }
    function rp(e, t, a, i) {
      var o = Li(), s = i === void 0 ? null : i;
      tt.flags |= e, o.memoizedState = np(sn | t, a, void 0, s);
    }
    function tm(e, t, a, i) {
      var o = _a(), s = i === void 0 ? null : i, f = void 0;
      if (fn !== null) {
        var p = fn.memoizedState;
        if (f = p.destroy, s !== null) {
          var v = p.deps;
          if (Mg(s, v)) {
            o.memoizedState = np(t, a, f, s);
            return;
          }
        }
      }
      tt.flags |= e, o.memoizedState = np(sn | t, a, f, s);
    }
    function nm(e, t) {
      return (tt.mode & et) !== oe ? rp(ci | cr | Yf, Nn, e, t) : rp(cr | Yf, Nn, e, t);
    }
    function ap(e, t) {
      return tm(cr, Nn, e, t);
    }
    function jg(e, t) {
      return rp(ze, Mi, e, t);
    }
    function rm(e, t) {
      return tm(ze, Mi, e, t);
    }
    function Vg(e, t) {
      var a = ze;
      return a |= si, (tt.mode & et) !== oe && (a |= _n), rp(a, cn, e, t);
    }
    function am(e, t) {
      return tm(ze, cn, e, t);
    }
    function Vw(e, t) {
      if (typeof t == "function") {
        var a = t, i = e();
        return a(i), function() {
          a(null);
        };
      } else if (t != null) {
        var o = t;
        o.hasOwnProperty("current") || S("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(o).join(", ") + "}");
        var s = e();
        return o.current = s, function() {
          o.current = null;
        };
      }
    }
    function Bg(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, o = ze;
      return o |= si, (tt.mode & et) !== oe && (o |= _n), rp(o, cn, Vw.bind(null, t, e), i);
    }
    function im(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return tm(ze, cn, Vw.bind(null, t, e), i);
    }
    function Wb(e, t) {
    }
    var lm = Wb;
    function Pg(e, t) {
      var a = Li(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function om(e, t) {
      var a = _a(), i = t === void 0 ? null : t, o = a.memoizedState;
      if (o !== null && i !== null) {
        var s = o[1];
        if (Mg(i, s))
          return o[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function Yg(e, t) {
      var a = Li(), i = t === void 0 ? null : t, o = e();
      return a.memoizedState = [o, i], o;
    }
    function um(e, t) {
      var a = _a(), i = t === void 0 ? null : t, o = a.memoizedState;
      if (o !== null && i !== null) {
        var s = o[1];
        if (Mg(i, s))
          return o[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function Qg(e) {
      var t = Li();
      return t.memoizedState = e, e;
    }
    function Bw(e) {
      var t = _a(), a = fn, i = a.memoizedState;
      return Yw(t, i, e);
    }
    function Pw(e) {
      var t = _a();
      if (fn === null)
        return t.memoizedState = e, e;
      var a = fn.memoizedState;
      return Yw(t, a, e);
    }
    function Yw(e, t, a) {
      var i = !ud(is);
      if (i) {
        if (!$(a, t)) {
          var o = cd();
          tt.lanes = xe(tt.lanes, o), Ep(o), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, cp()), e.memoizedState = a, a;
    }
    function Xb(e, t, a) {
      var i = dr();
      It(Uu(i, Ur)), e(!0);
      var o = Jd.transition;
      Jd.transition = {};
      var s = Jd.transition;
      Jd.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (It(i), Jd.transition = o, o === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && zt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function Ig() {
      var e = Jh(!1), t = e[0], a = e[1], i = Xb.bind(null, a), o = Li();
      return o.memoizedState = i, [t, i];
    }
    function Qw() {
      var e = Ag(), t = e[0], a = _a(), i = a.memoizedState;
      return [t, i];
    }
    function Iw() {
      var e = Hg(), t = e[0], a = _a(), i = a.memoizedState;
      return [t, i];
    }
    var $w = !1;
    function qb() {
      return $w;
    }
    function $g() {
      var e = Li(), t = _m(), a = t.identifierPrefix, i;
      if (On()) {
        var o = pb();
        i = ":" + a + "R" + o;
        var s = tp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = Ib++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function sm() {
      var e = _a(), t = e.memoizedState;
      return t;
    }
    function Kb(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Fo(e), o = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (Gw(e))
        Ww(t, o);
      else {
        var s = Ew(e, t, o, i);
        if (s !== null) {
          var f = gr();
          mn(s, e, i, f), Xw(s, t, i);
        }
      }
      qw(e, i);
    }
    function Zb(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = Fo(e), o = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (Gw(e))
        Ww(t, o);
      else {
        var s = e.alternate;
        if (e.lanes === N && (s === null || s.lanes === N)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var p;
            p = q.current, q.current = Wa;
            try {
              var v = t.lastRenderedState, m = f(v, a);
              if (o.hasEagerState = !0, o.eagerState = m, $(m, v)) {
                Ab(e, t, o, i);
                return;
              }
            } catch {
            } finally {
              q.current = p;
            }
          }
        }
        var y = Ew(e, t, o, i);
        if (y !== null) {
          var x = gr();
          mn(y, e, i, x), Xw(y, t, i);
        }
      }
      qw(e, i);
    }
    function Gw(e) {
      var t = e.alternate;
      return e === tt || t !== null && t === tt;
    }
    function Ww(e, t) {
      ep = Kh = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function Xw(e, t, a) {
      if (sd(a)) {
        var i = t.lanes;
        i = yc(i, e.pendingLanes);
        var o = xe(i, a);
        t.lanes = o, Nu(e, o);
      }
    }
    function qw(e, t, a) {
      bu(e, t);
    }
    var cm = {
      readContext: tn,
      useCallback: rr,
      useContext: rr,
      useEffect: rr,
      useImperativeHandle: rr,
      useInsertionEffect: rr,
      useLayoutEffect: rr,
      useMemo: rr,
      useReducer: rr,
      useRef: rr,
      useState: rr,
      useDebugValue: rr,
      useDeferredValue: rr,
      useTransition: rr,
      useMutableSource: rr,
      useSyncExternalStore: rr,
      useId: rr,
      unstable_isNewReconciler: ue
    }, Kw = null, Zw = null, Jw = null, e1 = null, zi = null, Wa = null, fm = null;
    {
      var Gg = function() {
        S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, Se = function() {
        S("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      Kw = {
        readContext: function(e) {
          return tn(e);
        },
        useCallback: function(e, t) {
          return U = "useCallback", We(), rf(t), Pg(e, t);
        },
        useContext: function(e) {
          return U = "useContext", We(), tn(e);
        },
        useEffect: function(e, t) {
          return U = "useEffect", We(), rf(t), nm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return U = "useImperativeHandle", We(), rf(a), Bg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return U = "useInsertionEffect", We(), rf(t), jg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return U = "useLayoutEffect", We(), rf(t), Vg(e, t);
        },
        useMemo: function(e, t) {
          U = "useMemo", We(), rf(t);
          var a = q.current;
          q.current = zi;
          try {
            return Yg(e, t);
          } finally {
            q.current = a;
          }
        },
        useReducer: function(e, t, a) {
          U = "useReducer", We();
          var i = q.current;
          q.current = zi;
          try {
            return zg(e, t, a);
          } finally {
            q.current = i;
          }
        },
        useRef: function(e) {
          return U = "useRef", We(), Fg(e);
        },
        useState: function(e) {
          U = "useState", We();
          var t = q.current;
          q.current = zi;
          try {
            return Jh(e);
          } finally {
            q.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return U = "useDebugValue", We(), void 0;
        },
        useDeferredValue: function(e) {
          return U = "useDeferredValue", We(), Qg(e);
        },
        useTransition: function() {
          return U = "useTransition", We(), Ig();
        },
        useMutableSource: function(e, t, a) {
          return U = "useMutableSource", We(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return U = "useSyncExternalStore", We(), Ug(e, t, a);
        },
        useId: function() {
          return U = "useId", We(), $g();
        },
        unstable_isNewReconciler: ue
      }, Zw = {
        readContext: function(e) {
          return tn(e);
        },
        useCallback: function(e, t) {
          return U = "useCallback", P(), Pg(e, t);
        },
        useContext: function(e) {
          return U = "useContext", P(), tn(e);
        },
        useEffect: function(e, t) {
          return U = "useEffect", P(), nm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return U = "useImperativeHandle", P(), Bg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return U = "useInsertionEffect", P(), jg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return U = "useLayoutEffect", P(), Vg(e, t);
        },
        useMemo: function(e, t) {
          U = "useMemo", P();
          var a = q.current;
          q.current = zi;
          try {
            return Yg(e, t);
          } finally {
            q.current = a;
          }
        },
        useReducer: function(e, t, a) {
          U = "useReducer", P();
          var i = q.current;
          q.current = zi;
          try {
            return zg(e, t, a);
          } finally {
            q.current = i;
          }
        },
        useRef: function(e) {
          return U = "useRef", P(), Fg(e);
        },
        useState: function(e) {
          U = "useState", P();
          var t = q.current;
          q.current = zi;
          try {
            return Jh(e);
          } finally {
            q.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return U = "useDebugValue", P(), void 0;
        },
        useDeferredValue: function(e) {
          return U = "useDeferredValue", P(), Qg(e);
        },
        useTransition: function() {
          return U = "useTransition", P(), Ig();
        },
        useMutableSource: function(e, t, a) {
          return U = "useMutableSource", P(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return U = "useSyncExternalStore", P(), Ug(e, t, a);
        },
        useId: function() {
          return U = "useId", P(), $g();
        },
        unstable_isNewReconciler: ue
      }, Jw = {
        readContext: function(e) {
          return tn(e);
        },
        useCallback: function(e, t) {
          return U = "useCallback", P(), om(e, t);
        },
        useContext: function(e) {
          return U = "useContext", P(), tn(e);
        },
        useEffect: function(e, t) {
          return U = "useEffect", P(), ap(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return U = "useImperativeHandle", P(), im(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return U = "useInsertionEffect", P(), rm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return U = "useLayoutEffect", P(), am(e, t);
        },
        useMemo: function(e, t) {
          U = "useMemo", P();
          var a = q.current;
          q.current = Wa;
          try {
            return um(e, t);
          } finally {
            q.current = a;
          }
        },
        useReducer: function(e, t, a) {
          U = "useReducer", P();
          var i = q.current;
          q.current = Wa;
          try {
            return Og(e, t, a);
          } finally {
            q.current = i;
          }
        },
        useRef: function(e) {
          return U = "useRef", P(), em();
        },
        useState: function(e) {
          U = "useState", P();
          var t = q.current;
          q.current = Wa;
          try {
            return Ag(e);
          } finally {
            q.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return U = "useDebugValue", P(), lm();
        },
        useDeferredValue: function(e) {
          return U = "useDeferredValue", P(), Bw(e);
        },
        useTransition: function() {
          return U = "useTransition", P(), Qw();
        },
        useMutableSource: function(e, t, a) {
          return U = "useMutableSource", P(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return U = "useSyncExternalStore", P(), Zh(e, t);
        },
        useId: function() {
          return U = "useId", P(), sm();
        },
        unstable_isNewReconciler: ue
      }, e1 = {
        readContext: function(e) {
          return tn(e);
        },
        useCallback: function(e, t) {
          return U = "useCallback", P(), om(e, t);
        },
        useContext: function(e) {
          return U = "useContext", P(), tn(e);
        },
        useEffect: function(e, t) {
          return U = "useEffect", P(), ap(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return U = "useImperativeHandle", P(), im(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return U = "useInsertionEffect", P(), rm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return U = "useLayoutEffect", P(), am(e, t);
        },
        useMemo: function(e, t) {
          U = "useMemo", P();
          var a = q.current;
          q.current = fm;
          try {
            return um(e, t);
          } finally {
            q.current = a;
          }
        },
        useReducer: function(e, t, a) {
          U = "useReducer", P();
          var i = q.current;
          q.current = fm;
          try {
            return Ng(e, t, a);
          } finally {
            q.current = i;
          }
        },
        useRef: function(e) {
          return U = "useRef", P(), em();
        },
        useState: function(e) {
          U = "useState", P();
          var t = q.current;
          q.current = fm;
          try {
            return Hg(e);
          } finally {
            q.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return U = "useDebugValue", P(), lm();
        },
        useDeferredValue: function(e) {
          return U = "useDeferredValue", P(), Pw(e);
        },
        useTransition: function() {
          return U = "useTransition", P(), Iw();
        },
        useMutableSource: function(e, t, a) {
          return U = "useMutableSource", P(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return U = "useSyncExternalStore", P(), Zh(e, t);
        },
        useId: function() {
          return U = "useId", P(), sm();
        },
        unstable_isNewReconciler: ue
      }, zi = {
        readContext: function(e) {
          return Gg(), tn(e);
        },
        useCallback: function(e, t) {
          return U = "useCallback", Se(), We(), Pg(e, t);
        },
        useContext: function(e) {
          return U = "useContext", Se(), We(), tn(e);
        },
        useEffect: function(e, t) {
          return U = "useEffect", Se(), We(), nm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return U = "useImperativeHandle", Se(), We(), Bg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return U = "useInsertionEffect", Se(), We(), jg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return U = "useLayoutEffect", Se(), We(), Vg(e, t);
        },
        useMemo: function(e, t) {
          U = "useMemo", Se(), We();
          var a = q.current;
          q.current = zi;
          try {
            return Yg(e, t);
          } finally {
            q.current = a;
          }
        },
        useReducer: function(e, t, a) {
          U = "useReducer", Se(), We();
          var i = q.current;
          q.current = zi;
          try {
            return zg(e, t, a);
          } finally {
            q.current = i;
          }
        },
        useRef: function(e) {
          return U = "useRef", Se(), We(), Fg(e);
        },
        useState: function(e) {
          U = "useState", Se(), We();
          var t = q.current;
          q.current = zi;
          try {
            return Jh(e);
          } finally {
            q.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return U = "useDebugValue", Se(), We(), void 0;
        },
        useDeferredValue: function(e) {
          return U = "useDeferredValue", Se(), We(), Qg(e);
        },
        useTransition: function() {
          return U = "useTransition", Se(), We(), Ig();
        },
        useMutableSource: function(e, t, a) {
          return U = "useMutableSource", Se(), We(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return U = "useSyncExternalStore", Se(), We(), Ug(e, t, a);
        },
        useId: function() {
          return U = "useId", Se(), We(), $g();
        },
        unstable_isNewReconciler: ue
      }, Wa = {
        readContext: function(e) {
          return Gg(), tn(e);
        },
        useCallback: function(e, t) {
          return U = "useCallback", Se(), P(), om(e, t);
        },
        useContext: function(e) {
          return U = "useContext", Se(), P(), tn(e);
        },
        useEffect: function(e, t) {
          return U = "useEffect", Se(), P(), ap(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return U = "useImperativeHandle", Se(), P(), im(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return U = "useInsertionEffect", Se(), P(), rm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return U = "useLayoutEffect", Se(), P(), am(e, t);
        },
        useMemo: function(e, t) {
          U = "useMemo", Se(), P();
          var a = q.current;
          q.current = Wa;
          try {
            return um(e, t);
          } finally {
            q.current = a;
          }
        },
        useReducer: function(e, t, a) {
          U = "useReducer", Se(), P();
          var i = q.current;
          q.current = Wa;
          try {
            return Og(e, t, a);
          } finally {
            q.current = i;
          }
        },
        useRef: function(e) {
          return U = "useRef", Se(), P(), em();
        },
        useState: function(e) {
          U = "useState", Se(), P();
          var t = q.current;
          q.current = Wa;
          try {
            return Ag(e);
          } finally {
            q.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return U = "useDebugValue", Se(), P(), lm();
        },
        useDeferredValue: function(e) {
          return U = "useDeferredValue", Se(), P(), Bw(e);
        },
        useTransition: function() {
          return U = "useTransition", Se(), P(), Qw();
        },
        useMutableSource: function(e, t, a) {
          return U = "useMutableSource", Se(), P(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return U = "useSyncExternalStore", Se(), P(), Zh(e, t);
        },
        useId: function() {
          return U = "useId", Se(), P(), sm();
        },
        unstable_isNewReconciler: ue
      }, fm = {
        readContext: function(e) {
          return Gg(), tn(e);
        },
        useCallback: function(e, t) {
          return U = "useCallback", Se(), P(), om(e, t);
        },
        useContext: function(e) {
          return U = "useContext", Se(), P(), tn(e);
        },
        useEffect: function(e, t) {
          return U = "useEffect", Se(), P(), ap(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return U = "useImperativeHandle", Se(), P(), im(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return U = "useInsertionEffect", Se(), P(), rm(e, t);
        },
        useLayoutEffect: function(e, t) {
          return U = "useLayoutEffect", Se(), P(), am(e, t);
        },
        useMemo: function(e, t) {
          U = "useMemo", Se(), P();
          var a = q.current;
          q.current = Wa;
          try {
            return um(e, t);
          } finally {
            q.current = a;
          }
        },
        useReducer: function(e, t, a) {
          U = "useReducer", Se(), P();
          var i = q.current;
          q.current = Wa;
          try {
            return Ng(e, t, a);
          } finally {
            q.current = i;
          }
        },
        useRef: function(e) {
          return U = "useRef", Se(), P(), em();
        },
        useState: function(e) {
          U = "useState", Se(), P();
          var t = q.current;
          q.current = Wa;
          try {
            return Hg(e);
          } finally {
            q.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return U = "useDebugValue", Se(), P(), lm();
        },
        useDeferredValue: function(e) {
          return U = "useDeferredValue", Se(), P(), Pw(e);
        },
        useTransition: function() {
          return U = "useTransition", Se(), P(), Iw();
        },
        useMutableSource: function(e, t, a) {
          return U = "useMutableSource", Se(), P(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return U = "useSyncExternalStore", Se(), P(), Zh(e, t);
        },
        useId: function() {
          return U = "useId", Se(), P(), sm();
        },
        unstable_isNewReconciler: ue
      };
    }
    var No = k.unstable_now, t1 = 0, dm = -1, ip = -1, pm = -1, Wg = !1, vm = !1;
    function n1() {
      return Wg;
    }
    function Jb() {
      vm = !0;
    }
    function eT() {
      Wg = !1, vm = !1;
    }
    function tT() {
      Wg = vm, vm = !1;
    }
    function r1() {
      return t1;
    }
    function a1() {
      t1 = No();
    }
    function Xg(e) {
      ip = No(), e.actualStartTime < 0 && (e.actualStartTime = No());
    }
    function i1(e) {
      ip = -1;
    }
    function hm(e, t) {
      if (ip >= 0) {
        var a = No() - ip;
        e.actualDuration += a, t && (e.selfBaseDuration = a), ip = -1;
      }
    }
    function Oi(e) {
      if (dm >= 0) {
        var t = No() - dm;
        dm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case ee:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case Ot:
              var o = a.stateNode;
              o.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function qg(e) {
      if (pm >= 0) {
        var t = No() - pm;
        pm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case ee:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case Ot:
              var o = a.stateNode;
              o !== null && (o.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function Ni() {
      dm = No();
    }
    function Kg() {
      pm = No();
    }
    function Zg(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function Xa(e, t) {
      if (e && e.defaultProps) {
        var a = Le({}, t), i = e.defaultProps;
        for (var o in i)
          a[o] === void 0 && (a[o] = i[o]);
        return a;
      }
      return t;
    }
    var Jg = {}, e0, t0, n0, r0, a0, l1, mm, i0, l0, o0, lp;
    {
      e0 = /* @__PURE__ */ new Set(), t0 = /* @__PURE__ */ new Set(), n0 = /* @__PURE__ */ new Set(), r0 = /* @__PURE__ */ new Set(), i0 = /* @__PURE__ */ new Set(), a0 = /* @__PURE__ */ new Set(), l0 = /* @__PURE__ */ new Set(), o0 = /* @__PURE__ */ new Set(), lp = /* @__PURE__ */ new Set();
      var o1 = /* @__PURE__ */ new Set();
      mm = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          o1.has(a) || (o1.add(a), S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, l1 = function(e, t) {
        if (t === void 0) {
          var a = $e(e) || "Component";
          a0.has(a) || (a0.add(a), S("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(Jg, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(Jg);
    }
    function u0(e, t, a, i) {
      var o = e.memoizedState, s = a(i, o);
      {
        if (e.mode & Ce) {
          Ke(!0);
          try {
            s = a(i, o);
          } finally {
            Ke(!1);
          }
        }
        l1(t, s);
      }
      var f = s == null ? o : Le({}, o, s);
      if (e.memoizedState = f, e.lanes === N) {
        var p = e.updateQueue;
        p.baseState = f;
      }
    }
    var s0 = {
      isMounted: Qf,
      enqueueSetState: function(e, t, a) {
        var i = no(e), o = gr(), s = Fo(i), f = Sl(o, s);
        f.payload = t, a != null && (mm(a, "setState"), f.callback = a);
        var p = Mo(i, f, s);
        p !== null && (mn(p, i, s, o), Ih(p, i, s)), bu(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = no(e), o = gr(), s = Fo(i), f = Sl(o, s);
        f.tag = bw, f.payload = t, a != null && (mm(a, "replaceState"), f.callback = a);
        var p = Mo(i, f, s);
        p !== null && (mn(p, i, s, o), Ih(p, i, s)), bu(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = no(e), i = gr(), o = Fo(a), s = Sl(i, o);
        s.tag = Ph, t != null && (mm(t, "forceUpdate"), s.callback = t);
        var f = Mo(a, s, o);
        f !== null && (mn(f, a, o, i), Ih(f, a, o)), ad(a, o);
      }
    };
    function u1(e, t, a, i, o, s, f) {
      var p = e.stateNode;
      if (typeof p.shouldComponentUpdate == "function") {
        var v = p.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & Ce) {
            Ke(!0);
            try {
              v = p.shouldComponentUpdate(i, s, f);
            } finally {
              Ke(!1);
            }
          }
          v === void 0 && S("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", $e(t) || "Component");
        }
        return v;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !se(a, i) || !se(o, s) : !0;
    }
    function nT(e, t, a) {
      var i = e.stateNode;
      {
        var o = $e(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? S("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", o) : S("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", o)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && S("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", o), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && S("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", o), i.propTypes && S("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", o), i.contextType && S("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", o), t.childContextTypes && !lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Ce) === oe && (lp.add(t), S(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, o)), t.contextTypes && !lp.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Ce) === oe && (lp.add(t), S(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, o)), i.contextTypes && S("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", o), t.contextType && t.contextTypes && !l0.has(t) && (l0.add(t), S("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", o)), typeof i.componentShouldUpdate == "function" && S("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", o), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && S("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", $e(t) || "A pure component"), typeof i.componentDidUnmount == "function" && S("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", o), typeof i.componentDidReceiveProps == "function" && S("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", o), typeof i.componentWillRecieveProps == "function" && S("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", o), typeof i.UNSAFE_componentWillRecieveProps == "function" && S("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", o);
        var f = i.props !== a;
        i.props !== void 0 && f && S("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", o, o), i.defaultProps && S("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", o, o), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !n0.has(t) && (n0.add(t), S("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", $e(t))), typeof i.getDerivedStateFromProps == "function" && S("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof i.getDerivedStateFromError == "function" && S("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", o), typeof t.getSnapshotBeforeUpdate == "function" && S("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", o);
        var p = i.state;
        p && (typeof p != "object" || Yt(p)) && S("%s.state: must be set to an object or null", o), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && S("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", o);
      }
    }
    function s1(e, t) {
      t.updater = s0, e.stateNode = t, yu(t, e), t._reactInternalInstance = Jg;
    }
    function c1(e, t, a) {
      var i = !1, o = oa, s = oa, f = t.contextType;
      if ("contextType" in t) {
        var p = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === gf && f._context === void 0
        );
        if (!p && !o0.has(t)) {
          o0.add(t);
          var v = "";
          f === void 0 ? v = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? v = " However, it is set to a " + typeof f + "." : f.$$typeof === Qo ? v = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? v = " Did you accidentally pass the Context.Consumer instead?" : v = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", S("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", $e(t) || "Component", v);
        }
      }
      if (typeof f == "object" && f !== null)
        s = tn(f);
      else {
        o = Ic(e, t, !0);
        var m = t.contextTypes;
        i = m != null, s = i ? $c(e, o) : oa;
      }
      var y = new t(a, s);
      if (e.mode & Ce) {
        Ke(!0);
        try {
          y = new t(a, s);
        } finally {
          Ke(!1);
        }
      }
      var x = e.memoizedState = y.state !== null && y.state !== void 0 ? y.state : null;
      s1(e, y);
      {
        if (typeof t.getDerivedStateFromProps == "function" && x === null) {
          var C = $e(t) || "Component";
          t0.has(C) || (t0.add(C), S("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", C, y.state === null ? "null" : "undefined", C));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof y.getSnapshotBeforeUpdate == "function") {
          var _ = null, L = null, z = null;
          if (typeof y.componentWillMount == "function" && y.componentWillMount.__suppressDeprecationWarning !== !0 ? _ = "componentWillMount" : typeof y.UNSAFE_componentWillMount == "function" && (_ = "UNSAFE_componentWillMount"), typeof y.componentWillReceiveProps == "function" && y.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? L = "componentWillReceiveProps" : typeof y.UNSAFE_componentWillReceiveProps == "function" && (L = "UNSAFE_componentWillReceiveProps"), typeof y.componentWillUpdate == "function" && y.componentWillUpdate.__suppressDeprecationWarning !== !0 ? z = "componentWillUpdate" : typeof y.UNSAFE_componentWillUpdate == "function" && (z = "UNSAFE_componentWillUpdate"), _ !== null || L !== null || z !== null) {
            var I = $e(t) || "Component", ce = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            r0.has(I) || (r0.add(I), S(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, I, ce, _ !== null ? `
  ` + _ : "", L !== null ? `
  ` + L : "", z !== null ? `
  ` + z : ""));
          }
        }
      }
      return i && JS(e, o, s), y;
    }
    function rT(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (S("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", Ee(e) || "Component"), s0.enqueueReplaceState(t, t.state, null));
    }
    function f1(e, t, a, i) {
      var o = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== o) {
        {
          var s = Ee(e) || "Component";
          e0.has(s) || (e0.add(s), S("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        s0.enqueueReplaceState(t, t.state, null);
      }
    }
    function c0(e, t, a, i) {
      nT(e, t, a);
      var o = e.stateNode;
      o.props = a, o.state = e.memoizedState, o.refs = {}, Sg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        o.context = tn(s);
      else {
        var f = Ic(e, t, !0);
        o.context = $c(e, f);
      }
      {
        if (o.state === a) {
          var p = $e(t) || "Component";
          i0.has(p) || (i0.add(p), S("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", p));
        }
        e.mode & Ce && $a.recordLegacyContextWarning(e, o), $a.recordUnsafeLifecycleWarnings(e, o);
      }
      o.state = e.memoizedState;
      var v = t.getDerivedStateFromProps;
      if (typeof v == "function" && (u0(e, t, v, a), o.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof o.getSnapshotBeforeUpdate != "function" && (typeof o.UNSAFE_componentWillMount == "function" || typeof o.componentWillMount == "function") && (rT(e, o), $h(e, a, o, i), o.state = e.memoizedState), typeof o.componentDidMount == "function") {
        var m = ze;
        m |= si, (e.mode & et) !== oe && (m |= _n), e.flags |= m;
      }
    }
    function aT(e, t, a, i) {
      var o = e.stateNode, s = e.memoizedProps;
      o.props = s;
      var f = o.context, p = t.contextType, v = oa;
      if (typeof p == "object" && p !== null)
        v = tn(p);
      else {
        var m = Ic(e, t, !0);
        v = $c(e, m);
      }
      var y = t.getDerivedStateFromProps, x = typeof y == "function" || typeof o.getSnapshotBeforeUpdate == "function";
      !x && (typeof o.UNSAFE_componentWillReceiveProps == "function" || typeof o.componentWillReceiveProps == "function") && (s !== a || f !== v) && f1(e, o, a, v), Rw();
      var C = e.memoizedState, _ = o.state = C;
      if ($h(e, a, o, i), _ = e.memoizedState, s === a && C === _ && !kh() && !Gh()) {
        if (typeof o.componentDidMount == "function") {
          var L = ze;
          L |= si, (e.mode & et) !== oe && (L |= _n), e.flags |= L;
        }
        return !1;
      }
      typeof y == "function" && (u0(e, t, y, a), _ = e.memoizedState);
      var z = Gh() || u1(e, t, s, a, C, _, v);
      if (z) {
        if (!x && (typeof o.UNSAFE_componentWillMount == "function" || typeof o.componentWillMount == "function") && (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function") {
          var I = ze;
          I |= si, (e.mode & et) !== oe && (I |= _n), e.flags |= I;
        }
      } else {
        if (typeof o.componentDidMount == "function") {
          var ce = ze;
          ce |= si, (e.mode & et) !== oe && (ce |= _n), e.flags |= ce;
        }
        e.memoizedProps = a, e.memoizedState = _;
      }
      return o.props = a, o.state = _, o.context = v, z;
    }
    function iT(e, t, a, i, o) {
      var s = t.stateNode;
      Tw(e, t);
      var f = t.memoizedProps, p = t.type === t.elementType ? f : Xa(t.type, f);
      s.props = p;
      var v = t.pendingProps, m = s.context, y = a.contextType, x = oa;
      if (typeof y == "object" && y !== null)
        x = tn(y);
      else {
        var C = Ic(t, a, !0);
        x = $c(t, C);
      }
      var _ = a.getDerivedStateFromProps, L = typeof _ == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !L && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== v || m !== x) && f1(t, s, i, x), Rw();
      var z = t.memoizedState, I = s.state = z;
      if ($h(t, i, s, o), I = t.memoizedState, f === v && z === I && !kh() && !Gh() && !Z)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || z !== e.memoizedState) && (t.flags |= ze), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || z !== e.memoizedState) && (t.flags |= Or), !1;
      typeof _ == "function" && (u0(t, a, _, i), I = t.memoizedState);
      var ce = Gh() || u1(t, a, p, i, z, I, x) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      Z;
      return ce ? (!L && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, I, x), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, I, x)), typeof s.componentDidUpdate == "function" && (t.flags |= ze), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= Or)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || z !== e.memoizedState) && (t.flags |= ze), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || z !== e.memoizedState) && (t.flags |= Or), t.memoizedProps = i, t.memoizedState = I), s.props = i, s.state = I, s.context = x, ce;
    }
    function ls(e, t) {
      return {
        value: e,
        source: t,
        stack: Ie(t),
        digest: null
      };
    }
    function f0(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function lT(e, t) {
      return !0;
    }
    function d0(e, t) {
      try {
        var a = lT(e, t);
        if (a === !1)
          return;
        var i = t.value, o = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === me)
            return;
          console.error(i);
        }
        var p = o ? Ee(o) : null, v = p ? "The above error occurred in the <" + p + "> component:" : "The above error occurred in one of your React components:", m;
        if (e.tag === ee)
          m = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var y = Ee(e) || "Anonymous";
          m = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + y + ".");
        }
        var x = v + `
` + f + `

` + ("" + m);
        console.error(x);
      } catch (C) {
        setTimeout(function() {
          throw C;
        });
      }
    }
    var oT = typeof WeakMap == "function" ? WeakMap : Map;
    function d1(e, t, a) {
      var i = Sl(Ze, a);
      i.tag = yg, i.payload = {
        element: null
      };
      var o = t.value;
      return i.callback = function() {
        JR(o), d0(e, t);
      }, i;
    }
    function p0(e, t, a) {
      var i = Sl(Ze, a);
      i.tag = yg;
      var o = e.type.getDerivedStateFromError;
      if (typeof o == "function") {
        var s = t.value;
        i.payload = function() {
          return o(s);
        }, i.callback = function() {
          xC(e), d0(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        xC(e), d0(e, t), typeof o != "function" && KR(this);
        var v = t.value, m = t.stack;
        this.componentDidCatch(v, {
          componentStack: m !== null ? m : ""
        }), typeof o != "function" && (Zn(e.lanes, de) || S("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", Ee(e) || "Unknown"));
      }), i;
    }
    function p1(e, t, a) {
      var i = e.pingCache, o;
      if (i === null ? (i = e.pingCache = new oT(), o = /* @__PURE__ */ new Set(), i.set(t, o)) : (o = i.get(t), o === void 0 && (o = /* @__PURE__ */ new Set(), i.set(t, o))), !o.has(a)) {
        o.add(a);
        var s = ek.bind(null, e, t, a);
        bn && xp(e, a), t.then(s, s);
      }
    }
    function uT(e, t, a, i) {
      var o = e.updateQueue;
      if (o === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        o.add(a);
    }
    function sT(e, t) {
      var a = e.tag;
      if ((e.mode & De) === oe && (a === be || a === Te || a === Ue)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function v1(e) {
      var t = e;
      do {
        if (t.tag === _e && Yb(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function h1(e, t, a, i, o) {
      if ((e.mode & De) === oe) {
        if (e === t)
          e.flags |= xn;
        else {
          if (e.flags |= Re, a.flags |= na, a.flags &= -52805, a.tag === me) {
            var s = a.alternate;
            if (s === null)
              a.tag = xt;
            else {
              var f = Sl(Ze, de);
              f.tag = Ph, Mo(a, f, de);
            }
          }
          a.lanes = xe(a.lanes, de);
        }
        return e;
      }
      return e.flags |= xn, e.lanes = o, e;
    }
    function cT(e, t, a, i, o) {
      if (a.flags |= Wi, bn && xp(e, o), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        sT(a), On() && a.mode & De && lw();
        var f = v1(t);
        if (f !== null) {
          f.flags &= ~ft, h1(f, t, a, e, o), f.mode & De && p1(e, s, o), uT(f, e, s);
          return;
        } else {
          if (!od(o)) {
            p1(e, s, o), $0();
            return;
          }
          var p = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = p;
        }
      } else if (On() && a.mode & De) {
        lw();
        var v = v1(t);
        if (v !== null) {
          (v.flags & xn) === le && (v.flags |= ft), h1(v, t, a, e, o), ig(ls(i, a));
          return;
        }
      }
      i = ls(i, a), YR(i);
      var m = t;
      do {
        switch (m.tag) {
          case ee: {
            var y = i;
            m.flags |= xn;
            var x = Jt(o);
            m.lanes = xe(m.lanes, x);
            var C = d1(m, y, x);
            wg(m, C);
            return;
          }
          case me:
            var _ = i, L = m.type, z = m.stateNode;
            if ((m.flags & Re) === le && (typeof L.getDerivedStateFromError == "function" || z !== null && typeof z.componentDidCatch == "function" && !vC(z))) {
              m.flags |= xn;
              var I = Jt(o);
              m.lanes = xe(m.lanes, I);
              var ce = p0(m, _, I);
              wg(m, ce);
              return;
            }
            break;
        }
        m = m.return;
      } while (m !== null);
    }
    function fT() {
      return null;
    }
    var op = ke.ReactCurrentOwner, qa = !1, v0, up, h0, m0, y0, os, g0, ym, sp;
    v0 = {}, up = {}, h0 = {}, m0 = {}, y0 = {}, os = !1, g0 = {}, ym = {}, sp = {};
    function mr(e, t, a, i) {
      e === null ? t.child = gw(t, null, a, i) : t.child = qc(t, e.child, a, i);
    }
    function dT(e, t, a, i) {
      t.child = qc(t, e.child, null, i), t.child = qc(t, null, a, i);
    }
    function m1(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && Qa(
          s,
          i,
          // Resolved props
          "prop",
          $e(a)
        );
      }
      var f = a.render, p = t.ref, v, m;
      Zc(t, o), Nr(t);
      {
        if (op.current = t, ha(!0), v = af(e, t, f, i, p, o), m = lf(), t.mode & Ce) {
          Ke(!0);
          try {
            v = af(e, t, f, i, p, o), m = lf();
          } finally {
            Ke(!1);
          }
        }
        ha(!1);
      }
      return vi(), e !== null && !qa ? (zw(e, t, o), wl(e, t, o)) : (On() && m && Jy(t), t.flags |= ja, mr(e, t, v, o), t.child);
    }
    function y1(e, t, a, i, o) {
      if (e === null) {
        var s = a.type;
        if (yk(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = vf(s), t.tag = Ue, t.type = f, C0(t, s), g1(e, t, f, i, o);
        }
        {
          var p = s.propTypes;
          if (p && Qa(
            p,
            i,
            // Resolved props
            "prop",
            $e(s)
          ), a.defaultProps !== void 0) {
            var v = $e(s) || "Unknown";
            sp[v] || (S("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", v), sp[v] = !0);
          }
        }
        var m = rS(a.type, null, i, t, t.mode, o);
        return m.ref = t.ref, m.return = t, t.child = m, m;
      }
      {
        var y = a.type, x = y.propTypes;
        x && Qa(
          x,
          i,
          // Resolved props
          "prop",
          $e(y)
        );
      }
      var C = e.child, _ = k0(e, o);
      if (!_) {
        var L = C.memoizedProps, z = a.compare;
        if (z = z !== null ? z : se, z(L, i) && e.ref === t.ref)
          return wl(e, t, o);
      }
      t.flags |= ja;
      var I = ds(C, i);
      return I.ref = t.ref, I.return = t, t.child = I, I;
    }
    function g1(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === wn) {
          var f = s, p = f._payload, v = f._init;
          try {
            s = v(p);
          } catch {
            s = null;
          }
          var m = s && s.propTypes;
          m && Qa(
            m,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            $e(s)
          );
        }
      }
      if (e !== null) {
        var y = e.memoizedProps;
        if (se(y, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (qa = !1, t.pendingProps = i = y, k0(e, o))
            (e.flags & na) !== le && (qa = !0);
          else return t.lanes = e.lanes, wl(e, t, o);
      }
      return S0(e, t, a, i, o);
    }
    function S1(e, t, a) {
      var i = t.pendingProps, o = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || Qe)
        if ((t.mode & De) === oe) {
          var f = {
            baseLanes: N,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Mm(t, a);
        } else if (Zn(a, qn)) {
          var x = {
            baseLanes: N,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = x;
          var C = s !== null ? s.baseLanes : a;
          Mm(t, C);
        } else {
          var p = null, v;
          if (s !== null) {
            var m = s.baseLanes;
            v = xe(m, a);
          } else
            v = a;
          t.lanes = t.childLanes = qn;
          var y = {
            baseLanes: v,
            cachePool: p,
            transitions: null
          };
          return t.memoizedState = y, t.updateQueue = null, Mm(t, v), null;
        }
      else {
        var _;
        s !== null ? (_ = xe(s.baseLanes, a), t.memoizedState = null) : _ = a, Mm(t, _);
      }
      return mr(e, t, o, a), t.child;
    }
    function pT(e, t, a) {
      var i = t.pendingProps;
      return mr(e, t, i, a), t.child;
    }
    function vT(e, t, a) {
      var i = t.pendingProps.children;
      return mr(e, t, i, a), t.child;
    }
    function hT(e, t, a) {
      {
        t.flags |= ze;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var o = t.pendingProps, s = o.children;
      return mr(e, t, s, a), t.child;
    }
    function w1(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= Ht, t.flags |= Su);
    }
    function S0(e, t, a, i, o) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && Qa(
          s,
          i,
          // Resolved props
          "prop",
          $e(a)
        );
      }
      var f;
      {
        var p = Ic(t, a, !0);
        f = $c(t, p);
      }
      var v, m;
      Zc(t, o), Nr(t);
      {
        if (op.current = t, ha(!0), v = af(e, t, a, i, f, o), m = lf(), t.mode & Ce) {
          Ke(!0);
          try {
            v = af(e, t, a, i, f, o), m = lf();
          } finally {
            Ke(!1);
          }
        }
        ha(!1);
      }
      return vi(), e !== null && !qa ? (zw(e, t, o), wl(e, t, o)) : (On() && m && Jy(t), t.flags |= ja, mr(e, t, v, o), t.child);
    }
    function C1(e, t, a, i, o) {
      {
        switch (zk(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, p = new f(t.memoizedProps, s.context), v = p.state;
            s.updater.enqueueSetState(s, v, null);
            break;
          }
          case !0: {
            t.flags |= Re, t.flags |= xn;
            var m = new Error("Simulated error coming from DevTools"), y = Jt(o);
            t.lanes = xe(t.lanes, y);
            var x = p0(t, ls(m, t), y);
            wg(t, x);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var C = a.propTypes;
          C && Qa(
            C,
            i,
            // Resolved props
            "prop",
            $e(a)
          );
        }
      }
      var _;
      _i(a) ? (_ = !0, _h(t)) : _ = !1, Zc(t, o);
      var L = t.stateNode, z;
      L === null ? (Sm(e, t), c1(t, a, i), c0(t, a, i, o), z = !0) : e === null ? z = aT(t, a, i, o) : z = iT(e, t, a, i, o);
      var I = w0(e, t, a, z, _, o);
      {
        var ce = t.stateNode;
        z && ce.props !== i && (os || S("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", Ee(t) || "a component"), os = !0);
      }
      return I;
    }
    function w0(e, t, a, i, o, s) {
      w1(e, t);
      var f = (t.flags & Re) !== le;
      if (!i && !f)
        return o && nw(t, a, !1), wl(e, t, s);
      var p = t.stateNode;
      op.current = t;
      var v;
      if (f && typeof a.getDerivedStateFromError != "function")
        v = null, i1();
      else {
        Nr(t);
        {
          if (ha(!0), v = p.render(), t.mode & Ce) {
            Ke(!0);
            try {
              p.render();
            } finally {
              Ke(!1);
            }
          }
          ha(!1);
        }
        vi();
      }
      return t.flags |= ja, e !== null && f ? dT(e, t, v, s) : mr(e, t, v, s), t.memoizedState = p.state, o && nw(t, a, !0), t.child;
    }
    function E1(e) {
      var t = e.stateNode;
      t.pendingContext ? ew(e, t.pendingContext, t.pendingContext !== t.context) : t.context && ew(e, t.context, !1), Cg(e, t.containerInfo);
    }
    function mT(e, t, a) {
      if (E1(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, o = t.memoizedState, s = o.element;
      Tw(e, t), $h(t, i, null, a);
      var f = t.memoizedState;
      t.stateNode;
      var p = f.element;
      if (o.isDehydrated) {
        var v = {
          element: p,
          isDehydrated: !1,
          cache: f.cache,
          pendingSuspenseBoundaries: f.pendingSuspenseBoundaries,
          transitions: f.transitions
        }, m = t.updateQueue;
        if (m.baseState = v, t.memoizedState = v, t.flags & ft) {
          var y = ls(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return x1(e, t, p, a, y);
        } else if (p !== s) {
          var x = ls(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return x1(e, t, p, a, x);
        } else {
          Sb(t);
          var C = gw(t, null, p, a);
          t.child = C;
          for (var _ = C; _; )
            _.flags = _.flags & ~St | wt, _ = _.sibling;
        }
      } else {
        if (Xc(), p === s)
          return wl(e, t, a);
        mr(e, t, p, a);
      }
      return t.child;
    }
    function x1(e, t, a, i, o) {
      return Xc(), ig(o), t.flags |= ft, mr(e, t, a, i), t.child;
    }
    function yT(e, t, a) {
      _w(t), e === null && ag(t);
      var i = t.type, o = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = o.children, p = jy(i, o);
      return p ? f = null : s !== null && jy(i, s) && (t.flags |= qe), w1(e, t), mr(e, t, f, a), t.child;
    }
    function gT(e, t) {
      return e === null && ag(t), null;
    }
    function ST(e, t, a, i) {
      Sm(e, t);
      var o = t.pendingProps, s = a, f = s._payload, p = s._init, v = p(f);
      t.type = v;
      var m = t.tag = gk(v), y = Xa(v, o), x;
      switch (m) {
        case be:
          return C0(t, v), t.type = v = vf(v), x = S0(null, t, v, y, i), x;
        case me:
          return t.type = v = K0(v), x = C1(null, t, v, y, i), x;
        case Te:
          return t.type = v = Z0(v), x = m1(null, t, v, y, i), x;
        case vt: {
          if (t.type !== t.elementType) {
            var C = v.propTypes;
            C && Qa(
              C,
              y,
              // Resolved for outer only
              "prop",
              $e(v)
            );
          }
          return x = y1(
            null,
            t,
            v,
            Xa(v.type, y),
            // The inner type can have defaults too
            i
          ), x;
        }
      }
      var _ = "";
      throw v !== null && typeof v == "object" && v.$$typeof === wn && (_ = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + v + ". " + ("Lazy element type must resolve to a class or function." + _));
    }
    function wT(e, t, a, i, o) {
      Sm(e, t), t.tag = me;
      var s;
      return _i(a) ? (s = !0, _h(t)) : s = !1, Zc(t, o), c1(t, a, i), c0(t, a, i, o), w0(null, t, a, !0, s, o);
    }
    function CT(e, t, a, i) {
      Sm(e, t);
      var o = t.pendingProps, s;
      {
        var f = Ic(t, a, !1);
        s = $c(t, f);
      }
      Zc(t, i);
      var p, v;
      Nr(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var m = $e(a) || "Unknown";
          v0[m] || (S("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", m, m), v0[m] = !0);
        }
        t.mode & Ce && $a.recordLegacyContextWarning(t, null), ha(!0), op.current = t, p = af(null, t, a, o, s, i), v = lf(), ha(!1);
      }
      if (vi(), t.flags |= ja, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0) {
        var y = $e(a) || "Unknown";
        up[y] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", y, y, y), up[y] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
      ) {
        {
          var x = $e(a) || "Unknown";
          up[x] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", x, x, x), up[x] = !0);
        }
        t.tag = me, t.memoizedState = null, t.updateQueue = null;
        var C = !1;
        return _i(a) ? (C = !0, _h(t)) : C = !1, t.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, Sg(t), s1(t, p), c0(t, a, o, i), w0(null, t, a, !0, C, i);
      } else {
        if (t.tag = be, t.mode & Ce) {
          Ke(!0);
          try {
            p = af(null, t, a, o, s, i), v = lf();
          } finally {
            Ke(!1);
          }
        }
        return On() && v && Jy(t), mr(null, t, p, i), C0(t, a), t.child;
      }
    }
    function C0(e, t) {
      {
        if (t && t.childContextTypes && S("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Mr();
          i && (a += `

Check the render method of \`` + i + "`.");
          var o = i || "", s = e._debugSource;
          s && (o = s.fileName + ":" + s.lineNumber), y0[o] || (y0[o] = !0, S("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var f = $e(t) || "Unknown";
          sp[f] || (S("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", f), sp[f] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var p = $e(t) || "Unknown";
          m0[p] || (S("%s: Function components do not support getDerivedStateFromProps.", p), m0[p] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var v = $e(t) || "Unknown";
          h0[v] || (S("%s: Function components do not support contextType.", v), h0[v] = !0);
        }
      }
    }
    var E0 = {
      dehydrated: null,
      treeContext: null,
      retryLane: jt
    };
    function x0(e) {
      return {
        baseLanes: e,
        cachePool: fT(),
        transitions: null
      };
    }
    function ET(e, t) {
      var a = null;
      return {
        baseLanes: xe(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function xT(e, t, a, i) {
      if (t !== null) {
        var o = t.memoizedState;
        if (o === null)
          return !1;
      }
      return bg(e, Zd);
    }
    function bT(e, t) {
      return Ou(e.childLanes, t);
    }
    function b1(e, t, a) {
      var i = t.pendingProps;
      Ok(t) && (t.flags |= Re);
      var o = Ga.current, s = !1, f = (t.flags & Re) !== le;
      if (f || xT(o, e) ? (s = !0, t.flags &= ~Re) : (e === null || e.memoizedState !== null) && (o = Pb(o, Lw)), o = ef(o), zo(t, o), e === null) {
        ag(t);
        var p = t.memoizedState;
        if (p !== null) {
          var v = p.dehydrated;
          if (v !== null)
            return _T(t, v);
        }
        var m = i.children, y = i.fallback;
        if (s) {
          var x = TT(t, m, y, a), C = t.child;
          return C.memoizedState = x0(a), t.memoizedState = E0, x;
        } else
          return b0(t, m);
      } else {
        var _ = e.memoizedState;
        if (_ !== null) {
          var L = _.dehydrated;
          if (L !== null)
            return MT(e, t, f, i, L, _, a);
        }
        if (s) {
          var z = i.fallback, I = i.children, ce = kT(e, t, I, z, a), ie = t.child, je = e.child.memoizedState;
          return ie.memoizedState = je === null ? x0(a) : ET(je, a), ie.childLanes = bT(e, a), t.memoizedState = E0, ce;
        } else {
          var Ne = i.children, T = RT(e, t, Ne, a);
          return t.memoizedState = null, T;
        }
      }
    }
    function b0(e, t, a) {
      var i = e.mode, o = {
        mode: "visible",
        children: t
      }, s = T0(o, i);
      return s.return = e, e.child = s, s;
    }
    function TT(e, t, a, i) {
      var o = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, p, v;
      return (o & De) === oe && s !== null ? (p = s, p.childLanes = N, p.pendingProps = f, e.mode & He && (p.actualDuration = 0, p.actualStartTime = -1, p.selfBaseDuration = 0, p.treeBaseDuration = 0), v = Vo(a, o, i, null)) : (p = T0(f, o), v = Vo(a, o, i, null)), p.return = e, v.return = e, p.sibling = v, e.child = p, v;
    }
    function T0(e, t, a) {
      return TC(e, t, N, null);
    }
    function T1(e, t) {
      return ds(e, t);
    }
    function RT(e, t, a, i) {
      var o = e.child, s = o.sibling, f = T1(o, {
        mode: "visible",
        children: a
      });
      if ((t.mode & De) === oe && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var p = t.deletions;
        p === null ? (t.deletions = [s], t.flags |= $n) : p.push(s);
      }
      return t.child = f, f;
    }
    function kT(e, t, a, i, o) {
      var s = t.mode, f = e.child, p = f.sibling, v = {
        mode: "hidden",
        children: a
      }, m;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & De) === oe && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var y = t.child;
        m = y, m.childLanes = N, m.pendingProps = v, t.mode & He && (m.actualDuration = 0, m.actualStartTime = -1, m.selfBaseDuration = f.selfBaseDuration, m.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        m = T1(f, v), m.subtreeFlags = f.subtreeFlags & Ft;
      var x;
      return p !== null ? x = ds(p, i) : (x = Vo(i, s, o, null), x.flags |= St), x.return = t, m.return = t, m.sibling = x, t.child = m, x;
    }
    function gm(e, t, a, i) {
      i !== null && ig(i), qc(t, e.child, null, a);
      var o = t.pendingProps, s = o.children, f = b0(t, s);
      return f.flags |= St, t.memoizedState = null, f;
    }
    function DT(e, t, a, i, o) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, p = T0(f, s), v = Vo(i, s, o, null);
      return v.flags |= St, p.return = t, v.return = t, p.sibling = v, t.child = p, (t.mode & De) !== oe && qc(t, e.child, null, o), v;
    }
    function _T(e, t, a) {
      return (e.mode & De) === oe ? (S("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = de) : Yy(t) ? e.lanes = Zt : e.lanes = qn, null;
    }
    function MT(e, t, a, i, o, s, f) {
      if (a)
        if (t.flags & ft) {
          t.flags &= ~ft;
          var T = f0(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return gm(e, t, f, T);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= Re, null;
          var O = i.children, R = i.fallback, j = DT(e, t, O, R, f), K = t.child;
          return K.memoizedState = x0(f), t.memoizedState = E0, j;
        }
      else {
        if (yb(), (t.mode & De) === oe)
          return gm(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (Yy(o)) {
          var p, v, m;
          {
            var y = Nx(o);
            p = y.digest, v = y.message, m = y.stack;
          }
          var x;
          v ? x = new Error(v) : x = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var C = f0(x, p, m);
          return gm(e, t, f, C);
        }
        var _ = Zn(f, e.childLanes);
        if (qa || _) {
          var L = _m();
          if (L !== null) {
            var z = wc(L, f);
            if (z !== jt && z !== s.retryLane) {
              s.retryLane = z;
              var I = Ze;
              Vr(e, z), mn(L, e, z, I);
            }
          }
          $0();
          var ce = f0(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return gm(e, t, f, ce);
        } else if (WS(o)) {
          t.flags |= Re, t.child = e.child;
          var ie = tk.bind(null, e);
          return Ux(o, ie), null;
        } else {
          wb(t, o, s.treeContext);
          var je = i.children, Ne = b0(t, je);
          return Ne.flags |= wt, Ne;
        }
      }
    }
    function R1(e, t, a) {
      e.lanes = xe(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = xe(i.lanes, t)), hg(e.return, t, a);
    }
    function LT(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === _e) {
          var o = i.memoizedState;
          o !== null && R1(i, a, e);
        } else if (i.tag === bt)
          R1(i, a, e);
        else if (i.child !== null) {
          i.child.return = i, i = i.child;
          continue;
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
    }
    function zT(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && qh(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function OT(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !g0[e])
        if (g0[e] = !0, typeof e == "string")
          switch (e.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards": {
              S('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', e, e.toLowerCase());
              break;
            }
            case "forward":
            case "backward": {
              S('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', e, e.toLowerCase());
              break;
            }
            default:
              S('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
              break;
          }
        else
          S('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
    }
    function NT(e, t) {
      e !== void 0 && !ym[e] && (e !== "collapsed" && e !== "hidden" ? (ym[e] = !0, S('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (ym[e] = !0, S('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function k1(e, t) {
      {
        var a = Yt(e), i = !a && typeof Bi(e) == "function";
        if (a || i) {
          var o = a ? "array" : "iterable";
          return S("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", o, t, o), !1;
        }
      }
      return !0;
    }
    function UT(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (Yt(e)) {
          for (var a = 0; a < e.length; a++)
            if (!k1(e[a], a))
              return;
        } else {
          var i = Bi(e);
          if (typeof i == "function") {
            var o = i.call(e);
            if (o)
              for (var s = o.next(), f = 0; !s.done; s = o.next()) {
                if (!k1(s.value, f))
                  return;
                f++;
              }
          } else
            S('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function R0(e, t, a, i, o) {
      var s = e.memoizedState;
      s === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: o
      } : (s.isBackwards = t, s.rendering = null, s.renderingStartTime = 0, s.last = i, s.tail = a, s.tailMode = o);
    }
    function D1(e, t, a) {
      var i = t.pendingProps, o = i.revealOrder, s = i.tail, f = i.children;
      OT(o), NT(s, o), UT(f, o), mr(e, t, f, a);
      var p = Ga.current, v = bg(p, Zd);
      if (v)
        p = Tg(p, Zd), t.flags |= Re;
      else {
        var m = e !== null && (e.flags & Re) !== le;
        m && LT(t, t.child, a), p = ef(p);
      }
      if (zo(t, p), (t.mode & De) === oe)
        t.memoizedState = null;
      else
        switch (o) {
          case "forwards": {
            var y = zT(t.child), x;
            y === null ? (x = t.child, t.child = null) : (x = y.sibling, y.sibling = null), R0(
              t,
              !1,
              // isBackwards
              x,
              y,
              s
            );
            break;
          }
          case "backwards": {
            var C = null, _ = t.child;
            for (t.child = null; _ !== null; ) {
              var L = _.alternate;
              if (L !== null && qh(L) === null) {
                t.child = _;
                break;
              }
              var z = _.sibling;
              _.sibling = C, C = _, _ = z;
            }
            R0(
              t,
              !0,
              // isBackwards
              C,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            R0(
              t,
              !1,
              // isBackwards
              null,
              // tail
              null,
              // last
              void 0
            );
            break;
          }
          default:
            t.memoizedState = null;
        }
      return t.child;
    }
    function AT(e, t, a) {
      Cg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = qc(t, null, i, a) : mr(e, t, i, a), t.child;
    }
    var _1 = !1;
    function HT(e, t, a) {
      var i = t.type, o = i._context, s = t.pendingProps, f = t.memoizedProps, p = s.value;
      {
        "value" in s || _1 || (_1 = !0, S("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var v = t.type.propTypes;
        v && Qa(v, s, "prop", "Context.Provider");
      }
      if (Cw(t, o, p), f !== null) {
        var m = f.value;
        if ($(m, p)) {
          if (f.children === s.children && !kh())
            return wl(e, t, a);
        } else
          Ob(t, o, a);
      }
      var y = s.children;
      return mr(e, t, y, a), t.child;
    }
    var M1 = !1;
    function FT(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (M1 || (M1 = !0, S("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var o = t.pendingProps, s = o.children;
      typeof s != "function" && S("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Zc(t, a);
      var f = tn(i);
      Nr(t);
      var p;
      return op.current = t, ha(!0), p = s(f), ha(!1), vi(), t.flags |= ja, mr(e, t, p, a), t.child;
    }
    function cp() {
      qa = !0;
    }
    function Sm(e, t) {
      (t.mode & De) === oe && e !== null && (e.alternate = null, t.alternate = null, t.flags |= St);
    }
    function wl(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), i1(), Ep(t.lanes), Zn(a, t.childLanes) ? (Lb(e, t), t.child) : null;
    }
    function jT(e, t, a) {
      {
        var i = t.return;
        if (i === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, a.index = t.index, a.sibling = t.sibling, a.return = t.return, a.ref = t.ref, t === i.child)
          i.child = a;
        else {
          var o = i.child;
          if (o === null)
            throw new Error("Expected parent to have a child.");
          for (; o.sibling !== t; )
            if (o = o.sibling, o === null)
              throw new Error("Expected to find the previous sibling.");
          o.sibling = a;
        }
        var s = i.deletions;
        return s === null ? (i.deletions = [e], i.flags |= $n) : s.push(e), a.flags |= St, a;
      }
    }
    function k0(e, t) {
      var a = e.lanes;
      return !!Zn(a, t);
    }
    function VT(e, t, a) {
      switch (t.tag) {
        case ee:
          E1(t), t.stateNode, Xc();
          break;
        case ae:
          _w(t);
          break;
        case me: {
          var i = t.type;
          _i(i) && _h(t);
          break;
        }
        case Ve:
          Cg(t, t.stateNode.containerInfo);
          break;
        case yn: {
          var o = t.memoizedProps.value, s = t.type._context;
          Cw(t, s, o);
          break;
        }
        case Ot:
          {
            var f = Zn(a, t.childLanes);
            f && (t.flags |= ze);
            {
              var p = t.stateNode;
              p.effectDuration = 0, p.passiveEffectDuration = 0;
            }
          }
          break;
        case _e: {
          var v = t.memoizedState;
          if (v !== null) {
            if (v.dehydrated !== null)
              return zo(t, ef(Ga.current)), t.flags |= Re, null;
            var m = t.child, y = m.childLanes;
            if (Zn(a, y))
              return b1(e, t, a);
            zo(t, ef(Ga.current));
            var x = wl(e, t, a);
            return x !== null ? x.sibling : null;
          } else
            zo(t, ef(Ga.current));
          break;
        }
        case bt: {
          var C = (e.flags & Re) !== le, _ = Zn(a, t.childLanes);
          if (C) {
            if (_)
              return D1(e, t, a);
            t.flags |= Re;
          }
          var L = t.memoizedState;
          if (L !== null && (L.rendering = null, L.tail = null, L.lastEffect = null), zo(t, Ga.current), _)
            break;
          return null;
        }
        case Ae:
        case kn:
          return t.lanes = N, S1(e, t, a);
      }
      return wl(e, t, a);
    }
    function L1(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return jT(e, t, rS(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, o = t.pendingProps;
        if (i !== o || kh() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          qa = !0;
        else {
          var s = k0(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & Re) === le)
            return qa = !1, VT(e, t, a);
          (e.flags & na) !== le ? qa = !0 : qa = !1;
        }
      } else if (qa = !1, On() && fb(t)) {
        var f = t.index, p = db();
        iw(t, p, f);
      }
      switch (t.lanes = N, t.tag) {
        case Je:
          return CT(e, t, t.type, a);
        case Er: {
          var v = t.elementType;
          return ST(e, t, v, a);
        }
        case be: {
          var m = t.type, y = t.pendingProps, x = t.elementType === m ? y : Xa(m, y);
          return S0(e, t, m, x, a);
        }
        case me: {
          var C = t.type, _ = t.pendingProps, L = t.elementType === C ? _ : Xa(C, _);
          return C1(e, t, C, L, a);
        }
        case ee:
          return mT(e, t, a);
        case ae:
          return yT(e, t, a);
        case ge:
          return gT(e, t);
        case _e:
          return b1(e, t, a);
        case Ve:
          return AT(e, t, a);
        case Te: {
          var z = t.type, I = t.pendingProps, ce = t.elementType === z ? I : Xa(z, I);
          return m1(e, t, z, ce, a);
        }
        case rt:
          return pT(e, t, a);
        case $r:
          return vT(e, t, a);
        case Ot:
          return hT(e, t, a);
        case yn:
          return HT(e, t, a);
        case Cr:
          return FT(e, t, a);
        case vt: {
          var ie = t.type, je = t.pendingProps, Ne = Xa(ie, je);
          if (t.type !== t.elementType) {
            var T = ie.propTypes;
            T && Qa(
              T,
              Ne,
              // Resolved for outer only
              "prop",
              $e(ie)
            );
          }
          return Ne = Xa(ie.type, Ne), y1(e, t, ie, Ne, a);
        }
        case Ue:
          return g1(e, t, t.type, t.pendingProps, a);
        case xt: {
          var O = t.type, R = t.pendingProps, j = t.elementType === O ? R : Xa(O, R);
          return wT(e, t, O, j, a);
        }
        case bt:
          return D1(e, t, a);
        case at:
          break;
        case Ae:
          return S1(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function of(e) {
      e.flags |= ze;
    }
    function z1(e) {
      e.flags |= Ht, e.flags |= Su;
    }
    var O1, D0, N1, U1;
    O1 = function(e, t, a, i) {
      for (var o = t.child; o !== null; ) {
        if (o.tag === ae || o.tag === ge)
          ux(e, o.stateNode);
        else if (o.tag !== Ve) {
          if (o.child !== null) {
            o.child.return = o, o = o.child;
            continue;
          }
        }
        if (o === t)
          return;
        for (; o.sibling === null; ) {
          if (o.return === null || o.return === t)
            return;
          o = o.return;
        }
        o.sibling.return = o.return, o = o.sibling;
      }
    }, D0 = function(e, t) {
    }, N1 = function(e, t, a, i, o) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, p = Eg(), v = cx(f, a, s, i, o, p);
        t.updateQueue = v, v && of(t);
      }
    }, U1 = function(e, t, a, i) {
      a !== i && of(t);
    };
    function fp(e, t) {
      if (!On())
        switch (e.tailMode) {
          case "hidden": {
            for (var a = e.tail, i = null; a !== null; )
              a.alternate !== null && (i = a), a = a.sibling;
            i === null ? e.tail = null : i.sibling = null;
            break;
          }
          case "collapsed": {
            for (var o = e.tail, s = null; o !== null; )
              o.alternate !== null && (s = o), o = o.sibling;
            s === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : s.sibling = null;
            break;
          }
        }
    }
    function Un(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = N, i = le;
      if (t) {
        if ((e.mode & He) !== oe) {
          for (var v = e.selfBaseDuration, m = e.child; m !== null; )
            a = xe(a, xe(m.lanes, m.childLanes)), i |= m.subtreeFlags & Ft, i |= m.flags & Ft, v += m.treeBaseDuration, m = m.sibling;
          e.treeBaseDuration = v;
        } else
          for (var y = e.child; y !== null; )
            a = xe(a, xe(y.lanes, y.childLanes)), i |= y.subtreeFlags & Ft, i |= y.flags & Ft, y.return = e, y = y.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & He) !== oe) {
          for (var o = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = xe(a, xe(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, o += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = o, e.treeBaseDuration = s;
        } else
          for (var p = e.child; p !== null; )
            a = xe(a, xe(p.lanes, p.childLanes)), i |= p.subtreeFlags, i |= p.flags, p.return = e, p = p.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function BT(e, t, a) {
      if (Tb() && (t.mode & De) !== oe && (t.flags & Re) === le)
        return dw(t), Xc(), t.flags |= ft | Wi | xn, !1;
      var i = Nh(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (xb(t), Un(t), (t.mode & He) !== oe) {
            var o = a !== null;
            if (o) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (Xc(), (t.flags & Re) === le && (t.memoizedState = null), t.flags |= ze, Un(t), (t.mode & He) !== oe) {
            var f = a !== null;
            if (f) {
              var p = t.child;
              p !== null && (t.treeBaseDuration -= p.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return pw(), !0;
    }
    function A1(e, t, a) {
      var i = t.pendingProps;
      switch (eg(t), t.tag) {
        case Je:
        case Er:
        case Ue:
        case be:
        case Te:
        case rt:
        case $r:
        case Ot:
        case Cr:
        case vt:
          return Un(t), null;
        case me: {
          var o = t.type;
          return _i(o) && Dh(t), Un(t), null;
        }
        case ee: {
          var s = t.stateNode;
          if (Jc(t), qy(t), kg(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = Nh(t);
            if (f)
              of(t);
            else if (e !== null) {
              var p = e.memoizedState;
              // Check if this is a client root
              (!p.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & ft) !== le) && (t.flags |= Or, pw());
            }
          }
          return D0(e, t), Un(t), null;
        }
        case ae: {
          xg(t);
          var v = Dw(), m = t.type;
          if (e !== null && t.stateNode != null)
            N1(e, t, m, i, v), e.ref !== t.ref && z1(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Un(t), null;
            }
            var y = Eg(), x = Nh(t);
            if (x)
              Cb(t, v, y) && of(t);
            else {
              var C = ox(m, i, v, y, t);
              O1(C, t, !1, !1), t.stateNode = C, sx(C, m, i, v) && of(t);
            }
            t.ref !== null && z1(t);
          }
          return Un(t), null;
        }
        case ge: {
          var _ = i;
          if (e && t.stateNode != null) {
            var L = e.memoizedProps;
            U1(e, t, L, _);
          } else {
            if (typeof _ != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var z = Dw(), I = Eg(), ce = Nh(t);
            ce ? Eb(t) && of(t) : t.stateNode = fx(_, z, I, t);
          }
          return Un(t), null;
        }
        case _e: {
          tf(t);
          var ie = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var je = BT(e, t, ie);
            if (!je)
              return t.flags & xn ? t : null;
          }
          if ((t.flags & Re) !== le)
            return t.lanes = a, (t.mode & He) !== oe && Zg(t), t;
          var Ne = ie !== null, T = e !== null && e.memoizedState !== null;
          if (Ne !== T && Ne) {
            var O = t.child;
            if (O.flags |= Sa, (t.mode & De) !== oe) {
              var R = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !0);
              R || bg(Ga.current, Lw) ? PR() : $0();
            }
          }
          var j = t.updateQueue;
          if (j !== null && (t.flags |= ze), Un(t), (t.mode & He) !== oe && Ne) {
            var K = t.child;
            K !== null && (t.treeBaseDuration -= K.treeBaseDuration);
          }
          return null;
        }
        case Ve:
          return Jc(t), D0(e, t), e === null && ab(t.stateNode.containerInfo), Un(t), null;
        case yn:
          var G = t.type._context;
          return vg(G, t), Un(t), null;
        case xt: {
          var ve = t.type;
          return _i(ve) && Dh(t), Un(t), null;
        }
        case bt: {
          tf(t);
          var we = t.memoizedState;
          if (we === null)
            return Un(t), null;
          var nt = (t.flags & Re) !== le, Pe = we.rendering;
          if (Pe === null)
            if (nt)
              fp(we, !1);
            else {
              var Wt = QR() && (e === null || (e.flags & Re) === le);
              if (!Wt)
                for (var Ye = t.child; Ye !== null; ) {
                  var Bt = qh(Ye);
                  if (Bt !== null) {
                    nt = !0, t.flags |= Re, fp(we, !1);
                    var ar = Bt.updateQueue;
                    return ar !== null && (t.updateQueue = ar, t.flags |= ze), t.subtreeFlags = le, zb(t, a), zo(t, Tg(Ga.current, Zd)), t.child;
                  }
                  Ye = Ye.sibling;
                }
              we.tail !== null && kt() > rC() && (t.flags |= Re, nt = !0, fp(we, !1), t.lanes = zv);
            }
          else {
            if (!nt) {
              var Vn = qh(Pe);
              if (Vn !== null) {
                t.flags |= Re, nt = !0;
                var sa = Vn.updateQueue;
                if (sa !== null && (t.updateQueue = sa, t.flags |= ze), fp(we, !0), we.tail === null && we.tailMode === "hidden" && !Pe.alternate && !On())
                  return Un(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              kt() * 2 - we.renderingStartTime > rC() && a !== qn && (t.flags |= Re, nt = !0, fp(we, !1), t.lanes = zv);
            }
            if (we.isBackwards)
              Pe.sibling = t.child, t.child = Pe;
            else {
              var Sr = we.last;
              Sr !== null ? Sr.sibling = Pe : t.child = Pe, we.last = Pe;
            }
          }
          if (we.tail !== null) {
            var wr = we.tail;
            we.rendering = wr, we.tail = wr.sibling, we.renderingStartTime = kt(), wr.sibling = null;
            var ir = Ga.current;
            return nt ? ir = Tg(ir, Zd) : ir = ef(ir), zo(t, ir), wr;
          }
          return Un(t), null;
        }
        case at:
          break;
        case Ae:
        case kn: {
          I0(t);
          var Tl = t.memoizedState, hf = Tl !== null;
          if (e !== null) {
            var kp = e.memoizedState, Hi = kp !== null;
            Hi !== hf && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !Qe && (t.flags |= Sa);
          }
          return !hf || (t.mode & De) === oe ? Un(t) : Zn(Ai, qn) && (Un(t), t.subtreeFlags & (St | ze) && (t.flags |= Sa)), null;
        }
        case mt:
          return null;
        case Bn:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function PT(e, t, a) {
      switch (eg(t), t.tag) {
        case me: {
          var i = t.type;
          _i(i) && Dh(t);
          var o = t.flags;
          return o & xn ? (t.flags = o & ~xn | Re, (t.mode & He) !== oe && Zg(t), t) : null;
        }
        case ee: {
          t.stateNode, Jc(t), qy(t), kg();
          var s = t.flags;
          return (s & xn) !== le && (s & Re) === le ? (t.flags = s & ~xn | Re, t) : null;
        }
        case ae:
          return xg(t), null;
        case _e: {
          tf(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            Xc();
          }
          var p = t.flags;
          return p & xn ? (t.flags = p & ~xn | Re, (t.mode & He) !== oe && Zg(t), t) : null;
        }
        case bt:
          return tf(t), null;
        case Ve:
          return Jc(t), null;
        case yn:
          var v = t.type._context;
          return vg(v, t), null;
        case Ae:
        case kn:
          return I0(t), null;
        case mt:
          return null;
        default:
          return null;
      }
    }
    function H1(e, t, a) {
      switch (eg(t), t.tag) {
        case me: {
          var i = t.type.childContextTypes;
          i != null && Dh(t);
          break;
        }
        case ee: {
          t.stateNode, Jc(t), qy(t), kg();
          break;
        }
        case ae: {
          xg(t);
          break;
        }
        case Ve:
          Jc(t);
          break;
        case _e:
          tf(t);
          break;
        case bt:
          tf(t);
          break;
        case yn:
          var o = t.type._context;
          vg(o, t);
          break;
        case Ae:
        case kn:
          I0(t);
          break;
      }
    }
    var F1 = null;
    F1 = /* @__PURE__ */ new Set();
    var wm = !1, An = !1, YT = typeof WeakSet == "function" ? WeakSet : Set, ne = null, uf = null, sf = null;
    function QT(e) {
      zr(null, function() {
        throw e;
      }), Pf();
    }
    var IT = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & He)
        try {
          Ni(), t.componentWillUnmount();
        } finally {
          Oi(e);
        }
      else
        t.componentWillUnmount();
    };
    function j1(e, t) {
      try {
        Uo(cn, e);
      } catch (a) {
        ct(e, t, a);
      }
    }
    function _0(e, t, a) {
      try {
        IT(e, a);
      } catch (i) {
        ct(e, t, i);
      }
    }
    function $T(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        ct(e, t, i);
      }
    }
    function V1(e, t) {
      try {
        P1(e);
      } catch (a) {
        ct(e, t, a);
      }
    }
    function cf(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (za && lr && e.mode & He)
              try {
                Ni(), i = a(null);
              } finally {
                Oi(e);
              }
            else
              i = a(null);
          } catch (o) {
            ct(e, t, o);
          }
          typeof i == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Ee(e));
        } else
          a.current = null;
    }
    function Cm(e, t, a) {
      try {
        a();
      } catch (i) {
        ct(e, t, i);
      }
    }
    var B1 = !1;
    function GT(e, t) {
      ix(e.containerInfo), ne = t, WT();
      var a = B1;
      return B1 = !1, a;
    }
    function WT() {
      for (; ne !== null; ) {
        var e = ne, t = e.child;
        (e.subtreeFlags & fi) !== le && t !== null ? (t.return = e, ne = t) : XT();
      }
    }
    function XT() {
      for (; ne !== null; ) {
        var e = ne;
        ut(e);
        try {
          qT(e);
        } catch (a) {
          ct(e, e.return, a);
        }
        Pt();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, ne = t;
          return;
        }
        ne = e.return;
      }
    }
    function qT(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Or) !== le) {
        switch (ut(e), e.tag) {
          case be:
          case Te:
          case Ue:
            break;
          case me: {
            if (t !== null) {
              var i = t.memoizedProps, o = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !os && (s.props !== e.memoizedProps && S("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ee(e) || "instance"), s.state !== e.memoizedState && S("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ee(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : Xa(e.type, i), o);
              {
                var p = F1;
                f === void 0 && !p.has(e.type) && (p.add(e.type), S("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", Ee(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case ee: {
            {
              var v = e.stateNode;
              Mx(v.containerInfo);
            }
            break;
          }
          case ae:
          case ge:
          case Ve:
          case xt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        Pt();
      }
    }
    function Ka(e, t, a) {
      var i = t.updateQueue, o = i !== null ? i.lastEffect : null;
      if (o !== null) {
        var s = o.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var p = f.destroy;
            f.destroy = void 0, p !== void 0 && ((e & Nn) !== Br ? hi(t) : (e & cn) !== Br && ed(t), (e & Mi) !== Br && bp(!0), Cm(t, a, p), (e & Mi) !== Br && bp(!1), (e & Nn) !== Br ? Gs() : (e & cn) !== Br && lo());
          }
          f = f.next;
        } while (f !== s);
      }
    }
    function Uo(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var o = i.next, s = o;
        do {
          if ((s.tag & e) === e) {
            (e & Nn) !== Br ? Mv(t) : (e & cn) !== Br && Lv(t);
            var f = s.create;
            (e & Mi) !== Br && bp(!0), s.destroy = f(), (e & Mi) !== Br && bp(!1), (e & Nn) !== Br ? Ba() : (e & cn) !== Br && Ws();
            {
              var p = s.destroy;
              if (p !== void 0 && typeof p != "function") {
                var v = void 0;
                (s.tag & cn) !== le ? v = "useLayoutEffect" : (s.tag & Mi) !== le ? v = "useInsertionEffect" : v = "useEffect";
                var m = void 0;
                p === null ? m = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof p.then == "function" ? m = `

It looks like you wrote ` + v + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + v + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : m = " You returned: " + p, S("%s must not return anything besides a function, which is used for clean-up.%s", v, m);
              }
            }
          }
          s = s.next;
        } while (s !== o);
      }
    }
    function KT(e, t) {
      if ((t.flags & ze) !== le)
        switch (t.tag) {
          case Ot: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, o = i.id, s = i.onPostCommit, f = r1(), p = t.alternate === null ? "mount" : "update";
            n1() && (p = "nested-update"), typeof s == "function" && s(o, p, a, f);
            var v = t.return;
            e: for (; v !== null; ) {
              switch (v.tag) {
                case ee:
                  var m = v.stateNode;
                  m.passiveEffectDuration += a;
                  break e;
                case Ot:
                  var y = v.stateNode;
                  y.passiveEffectDuration += a;
                  break e;
              }
              v = v.return;
            }
            break;
          }
        }
    }
    function ZT(e, t, a, i) {
      if ((a.flags & di) !== le)
        switch (a.tag) {
          case be:
          case Te:
          case Ue: {
            if (!An)
              if (a.mode & He)
                try {
                  Ni(), Uo(cn | sn, a);
                } finally {
                  Oi(a);
                }
              else
                Uo(cn | sn, a);
            break;
          }
          case me: {
            var o = a.stateNode;
            if (a.flags & ze && !An)
              if (t === null)
                if (a.type === a.elementType && !os && (o.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ee(a) || "instance"), o.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ee(a) || "instance")), a.mode & He)
                  try {
                    Ni(), o.componentDidMount();
                  } finally {
                    Oi(a);
                  }
                else
                  o.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : Xa(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !os && (o.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ee(a) || "instance"), o.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ee(a) || "instance")), a.mode & He)
                  try {
                    Ni(), o.componentDidUpdate(s, f, o.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Oi(a);
                  }
                else
                  o.componentDidUpdate(s, f, o.__reactInternalSnapshotBeforeUpdate);
              }
            var p = a.updateQueue;
            p !== null && (a.type === a.elementType && !os && (o.props !== a.memoizedProps && S("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ee(a) || "instance"), o.state !== a.memoizedState && S("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ee(a) || "instance")), kw(a, p, o));
            break;
          }
          case ee: {
            var v = a.updateQueue;
            if (v !== null) {
              var m = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case ae:
                    m = a.child.stateNode;
                    break;
                  case me:
                    m = a.child.stateNode;
                    break;
                }
              kw(a, v, m);
            }
            break;
          }
          case ae: {
            var y = a.stateNode;
            if (t === null && a.flags & ze) {
              var x = a.type, C = a.memoizedProps;
              mx(y, x, C);
            }
            break;
          }
          case ge:
            break;
          case Ve:
            break;
          case Ot: {
            {
              var _ = a.memoizedProps, L = _.onCommit, z = _.onRender, I = a.stateNode.effectDuration, ce = r1(), ie = t === null ? "mount" : "update";
              n1() && (ie = "nested-update"), typeof z == "function" && z(a.memoizedProps.id, ie, a.actualDuration, a.treeBaseDuration, a.actualStartTime, ce);
              {
                typeof L == "function" && L(a.memoizedProps.id, ie, I, ce), XR(a);
                var je = a.return;
                e: for (; je !== null; ) {
                  switch (je.tag) {
                    case ee:
                      var Ne = je.stateNode;
                      Ne.effectDuration += I;
                      break e;
                    case Ot:
                      var T = je.stateNode;
                      T.effectDuration += I;
                      break e;
                  }
                  je = je.return;
                }
              }
            }
            break;
          }
          case _e: {
            lR(e, a);
            break;
          }
          case bt:
          case xt:
          case at:
          case Ae:
          case kn:
          case Bn:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      An || a.flags & Ht && P1(a);
    }
    function JT(e) {
      switch (e.tag) {
        case be:
        case Te:
        case Ue: {
          if (e.mode & He)
            try {
              Ni(), j1(e, e.return);
            } finally {
              Oi(e);
            }
          else
            j1(e, e.return);
          break;
        }
        case me: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && $T(e, e.return, t), V1(e, e.return);
          break;
        }
        case ae: {
          V1(e, e.return);
          break;
        }
      }
    }
    function eR(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === ae) {
          if (a === null) {
            a = i;
            try {
              var o = i.stateNode;
              t ? Rx(o) : Dx(i.stateNode, i.memoizedProps);
            } catch (f) {
              ct(e, e.return, f);
            }
          }
        } else if (i.tag === ge) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? kx(s) : _x(s, i.memoizedProps);
            } catch (f) {
              ct(e, e.return, f);
            }
        } else if (!((i.tag === Ae || i.tag === kn) && i.memoizedState !== null && i !== e)) {
          if (i.child !== null) {
            i.child.return = i, i = i.child;
            continue;
          }
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          a === i && (a = null), i = i.return;
        }
        a === i && (a = null), i.sibling.return = i.return, i = i.sibling;
      }
    }
    function P1(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case ae:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var o;
          if (e.mode & He)
            try {
              Ni(), o = t(i);
            } finally {
              Oi(e);
            }
          else
            o = t(i);
          typeof o == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Ee(e));
        } else
          t.hasOwnProperty("current") || S("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", Ee(e)), t.current = i;
      }
    }
    function tR(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function Y1(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, Y1(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === ae) {
          var a = e.stateNode;
          a !== null && ob(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function nR(e) {
      for (var t = e.return; t !== null; ) {
        if (Q1(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Q1(e) {
      return e.tag === ae || e.tag === ee || e.tag === Ve;
    }
    function I1(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || Q1(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== ae && t.tag !== ge && t.tag !== qt; ) {
          if (t.flags & St || t.child === null || t.tag === Ve)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & St))
          return t.stateNode;
      }
    }
    function rR(e) {
      var t = nR(e);
      switch (t.tag) {
        case ae: {
          var a = t.stateNode;
          t.flags & qe && (GS(a), t.flags &= ~qe);
          var i = I1(e);
          L0(e, i, a);
          break;
        }
        case ee:
        case Ve: {
          var o = t.stateNode.containerInfo, s = I1(e);
          M0(e, s, o);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function M0(e, t, a) {
      var i = e.tag, o = i === ae || i === ge;
      if (o) {
        var s = e.stateNode;
        t ? Ex(a, s, t) : wx(a, s);
      } else if (i !== Ve) {
        var f = e.child;
        if (f !== null) {
          M0(f, t, a);
          for (var p = f.sibling; p !== null; )
            M0(p, t, a), p = p.sibling;
        }
      }
    }
    function L0(e, t, a) {
      var i = e.tag, o = i === ae || i === ge;
      if (o) {
        var s = e.stateNode;
        t ? Cx(a, s, t) : Sx(a, s);
      } else if (i !== Ve) {
        var f = e.child;
        if (f !== null) {
          L0(f, t, a);
          for (var p = f.sibling; p !== null; )
            L0(p, t, a), p = p.sibling;
        }
      }
    }
    var Hn = null, Za = !1;
    function aR(e, t, a) {
      {
        var i = t;
        e: for (; i !== null; ) {
          switch (i.tag) {
            case ae: {
              Hn = i.stateNode, Za = !1;
              break e;
            }
            case ee: {
              Hn = i.stateNode.containerInfo, Za = !0;
              break e;
            }
            case Ve: {
              Hn = i.stateNode.containerInfo, Za = !0;
              break e;
            }
          }
          i = i.return;
        }
        if (Hn === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        $1(e, t, a), Hn = null, Za = !1;
      }
      tR(a);
    }
    function Ao(e, t, a) {
      for (var i = a.child; i !== null; )
        $1(e, t, i), i = i.sibling;
    }
    function $1(e, t, a) {
      switch (io(a), a.tag) {
        case ae:
          An || cf(a, t);
        case ge: {
          {
            var i = Hn, o = Za;
            Hn = null, Ao(e, t, a), Hn = i, Za = o, Hn !== null && (Za ? bx(Hn, a.stateNode) : xx(Hn, a.stateNode));
          }
          return;
        }
        case qt: {
          Hn !== null && (Za ? Tx(Hn, a.stateNode) : Py(Hn, a.stateNode));
          return;
        }
        case Ve: {
          {
            var s = Hn, f = Za;
            Hn = a.stateNode.containerInfo, Za = !0, Ao(e, t, a), Hn = s, Za = f;
          }
          return;
        }
        case be:
        case Te:
        case vt:
        case Ue: {
          if (!An) {
            var p = a.updateQueue;
            if (p !== null) {
              var v = p.lastEffect;
              if (v !== null) {
                var m = v.next, y = m;
                do {
                  var x = y, C = x.destroy, _ = x.tag;
                  C !== void 0 && ((_ & Mi) !== Br ? Cm(a, t, C) : (_ & cn) !== Br && (ed(a), a.mode & He ? (Ni(), Cm(a, t, C), Oi(a)) : Cm(a, t, C), lo())), y = y.next;
                } while (y !== m);
              }
            }
          }
          Ao(e, t, a);
          return;
        }
        case me: {
          if (!An) {
            cf(a, t);
            var L = a.stateNode;
            typeof L.componentWillUnmount == "function" && _0(a, t, L);
          }
          Ao(e, t, a);
          return;
        }
        case at: {
          Ao(e, t, a);
          return;
        }
        case Ae: {
          if (
            // TODO: Remove this dead flag
            a.mode & De
          ) {
            var z = An;
            An = z || a.memoizedState !== null, Ao(e, t, a), An = z;
          } else
            Ao(e, t, a);
          break;
        }
        default: {
          Ao(e, t, a);
          return;
        }
      }
    }
    function iR(e) {
      e.memoizedState;
    }
    function lR(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var o = i.memoizedState;
          if (o !== null) {
            var s = o.dehydrated;
            s !== null && Qx(s);
          }
        }
      }
    }
    function G1(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new YT()), t.forEach(function(i) {
          var o = nk.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), bn)
              if (uf !== null && sf !== null)
                xp(sf, uf);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(o, o);
          }
        });
      }
    }
    function oR(e, t, a) {
      uf = a, sf = e, ut(t), W1(t, e), ut(t), uf = null, sf = null;
    }
    function Ja(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var o = 0; o < i.length; o++) {
          var s = i[o];
          try {
            aR(e, t, s);
          } catch (v) {
            ct(s, t, v);
          }
        }
      var f = ii();
      if (t.subtreeFlags & ro)
        for (var p = t.child; p !== null; )
          ut(p), W1(p, e), p = p.sibling;
      ut(f);
    }
    function W1(e, t, a) {
      var i = e.alternate, o = e.flags;
      switch (e.tag) {
        case be:
        case Te:
        case vt:
        case Ue: {
          if (Ja(t, e), Ui(e), o & ze) {
            try {
              Ka(Mi | sn, e, e.return), Uo(Mi | sn, e);
            } catch (ve) {
              ct(e, e.return, ve);
            }
            if (e.mode & He) {
              try {
                Ni(), Ka(cn | sn, e, e.return);
              } catch (ve) {
                ct(e, e.return, ve);
              }
              Oi(e);
            } else
              try {
                Ka(cn | sn, e, e.return);
              } catch (ve) {
                ct(e, e.return, ve);
              }
          }
          return;
        }
        case me: {
          Ja(t, e), Ui(e), o & Ht && i !== null && cf(i, i.return);
          return;
        }
        case ae: {
          Ja(t, e), Ui(e), o & Ht && i !== null && cf(i, i.return);
          {
            if (e.flags & qe) {
              var s = e.stateNode;
              try {
                GS(s);
              } catch (ve) {
                ct(e, e.return, ve);
              }
            }
            if (o & ze) {
              var f = e.stateNode;
              if (f != null) {
                var p = e.memoizedProps, v = i !== null ? i.memoizedProps : p, m = e.type, y = e.updateQueue;
                if (e.updateQueue = null, y !== null)
                  try {
                    yx(f, y, m, v, p, e);
                  } catch (ve) {
                    ct(e, e.return, ve);
                  }
              }
            }
          }
          return;
        }
        case ge: {
          if (Ja(t, e), Ui(e), o & ze) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var x = e.stateNode, C = e.memoizedProps, _ = i !== null ? i.memoizedProps : C;
            try {
              gx(x, _, C);
            } catch (ve) {
              ct(e, e.return, ve);
            }
          }
          return;
        }
        case ee: {
          if (Ja(t, e), Ui(e), o & ze && i !== null) {
            var L = i.memoizedState;
            if (L.isDehydrated)
              try {
                Yx(t.containerInfo);
              } catch (ve) {
                ct(e, e.return, ve);
              }
          }
          return;
        }
        case Ve: {
          Ja(t, e), Ui(e);
          return;
        }
        case _e: {
          Ja(t, e), Ui(e);
          var z = e.child;
          if (z.flags & Sa) {
            var I = z.stateNode, ce = z.memoizedState, ie = ce !== null;
            if (I.isHidden = ie, ie) {
              var je = z.alternate !== null && z.alternate.memoizedState !== null;
              je || BR();
            }
          }
          if (o & ze) {
            try {
              iR(e);
            } catch (ve) {
              ct(e, e.return, ve);
            }
            G1(e);
          }
          return;
        }
        case Ae: {
          var Ne = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & De
          ) {
            var T = An;
            An = T || Ne, Ja(t, e), An = T;
          } else
            Ja(t, e);
          if (Ui(e), o & Sa) {
            var O = e.stateNode, R = e.memoizedState, j = R !== null, K = e;
            if (O.isHidden = j, j && !Ne && (K.mode & De) !== oe) {
              ne = K;
              for (var G = K.child; G !== null; )
                ne = G, sR(G), G = G.sibling;
            }
            eR(K, j);
          }
          return;
        }
        case bt: {
          Ja(t, e), Ui(e), o & ze && G1(e);
          return;
        }
        case at:
          return;
        default: {
          Ja(t, e), Ui(e);
          return;
        }
      }
    }
    function Ui(e) {
      var t = e.flags;
      if (t & St) {
        try {
          rR(e);
        } catch (a) {
          ct(e, e.return, a);
        }
        e.flags &= ~St;
      }
      t & wt && (e.flags &= ~wt);
    }
    function uR(e, t, a) {
      uf = a, sf = t, ne = e, X1(e, t, a), uf = null, sf = null;
    }
    function X1(e, t, a) {
      for (var i = (e.mode & De) !== oe; ne !== null; ) {
        var o = ne, s = o.child;
        if (o.tag === Ae && i) {
          var f = o.memoizedState !== null, p = f || wm;
          if (p) {
            z0(e, t, a);
            continue;
          } else {
            var v = o.alternate, m = v !== null && v.memoizedState !== null, y = m || An, x = wm, C = An;
            wm = p, An = y, An && !C && (ne = o, cR(o));
            for (var _ = s; _ !== null; )
              ne = _, X1(
                _,
                // New root; bubble back up to here and stop.
                t,
                a
              ), _ = _.sibling;
            ne = o, wm = x, An = C, z0(e, t, a);
            continue;
          }
        }
        (o.subtreeFlags & di) !== le && s !== null ? (s.return = o, ne = s) : z0(e, t, a);
      }
    }
    function z0(e, t, a) {
      for (; ne !== null; ) {
        var i = ne;
        if ((i.flags & di) !== le) {
          var o = i.alternate;
          ut(i);
          try {
            ZT(t, o, i, a);
          } catch (f) {
            ct(i, i.return, f);
          }
          Pt();
        }
        if (i === e) {
          ne = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, ne = s;
          return;
        }
        ne = i.return;
      }
    }
    function sR(e) {
      for (; ne !== null; ) {
        var t = ne, a = t.child;
        switch (t.tag) {
          case be:
          case Te:
          case vt:
          case Ue: {
            if (t.mode & He)
              try {
                Ni(), Ka(cn, t, t.return);
              } finally {
                Oi(t);
              }
            else
              Ka(cn, t, t.return);
            break;
          }
          case me: {
            cf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && _0(t, t.return, i);
            break;
          }
          case ae: {
            cf(t, t.return);
            break;
          }
          case Ae: {
            var o = t.memoizedState !== null;
            if (o) {
              q1(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, ne = a) : q1(e);
      }
    }
    function q1(e) {
      for (; ne !== null; ) {
        var t = ne;
        if (t === e) {
          ne = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, ne = a;
          return;
        }
        ne = t.return;
      }
    }
    function cR(e) {
      for (; ne !== null; ) {
        var t = ne, a = t.child;
        if (t.tag === Ae) {
          var i = t.memoizedState !== null;
          if (i) {
            K1(e);
            continue;
          }
        }
        a !== null ? (a.return = t, ne = a) : K1(e);
      }
    }
    function K1(e) {
      for (; ne !== null; ) {
        var t = ne;
        ut(t);
        try {
          JT(t);
        } catch (i) {
          ct(t, t.return, i);
        }
        if (Pt(), t === e) {
          ne = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, ne = a;
          return;
        }
        ne = t.return;
      }
    }
    function fR(e, t, a, i) {
      ne = t, dR(t, e, a, i);
    }
    function dR(e, t, a, i) {
      for (; ne !== null; ) {
        var o = ne, s = o.child;
        (o.subtreeFlags & rn) !== le && s !== null ? (s.return = o, ne = s) : pR(e, t, a, i);
      }
    }
    function pR(e, t, a, i) {
      for (; ne !== null; ) {
        var o = ne;
        if ((o.flags & cr) !== le) {
          ut(o);
          try {
            vR(t, o, a, i);
          } catch (f) {
            ct(o, o.return, f);
          }
          Pt();
        }
        if (o === e) {
          ne = null;
          return;
        }
        var s = o.sibling;
        if (s !== null) {
          s.return = o.return, ne = s;
          return;
        }
        ne = o.return;
      }
    }
    function vR(e, t, a, i) {
      switch (t.tag) {
        case be:
        case Te:
        case Ue: {
          if (t.mode & He) {
            Kg();
            try {
              Uo(Nn | sn, t);
            } finally {
              qg(t);
            }
          } else
            Uo(Nn | sn, t);
          break;
        }
      }
    }
    function hR(e) {
      ne = e, mR();
    }
    function mR() {
      for (; ne !== null; ) {
        var e = ne, t = e.child;
        if ((ne.flags & $n) !== le) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var o = a[i];
              ne = o, SR(o, e);
            }
            {
              var s = e.alternate;
              if (s !== null) {
                var f = s.child;
                if (f !== null) {
                  s.child = null;
                  do {
                    var p = f.sibling;
                    f.sibling = null, f = p;
                  } while (f !== null);
                }
              }
            }
            ne = e;
          }
        }
        (e.subtreeFlags & rn) !== le && t !== null ? (t.return = e, ne = t) : yR();
      }
    }
    function yR() {
      for (; ne !== null; ) {
        var e = ne;
        (e.flags & cr) !== le && (ut(e), gR(e), Pt());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, ne = t;
          return;
        }
        ne = e.return;
      }
    }
    function gR(e) {
      switch (e.tag) {
        case be:
        case Te:
        case Ue: {
          e.mode & He ? (Kg(), Ka(Nn | sn, e, e.return), qg(e)) : Ka(Nn | sn, e, e.return);
          break;
        }
      }
    }
    function SR(e, t) {
      for (; ne !== null; ) {
        var a = ne;
        ut(a), CR(a, t), Pt();
        var i = a.child;
        i !== null ? (i.return = a, ne = i) : wR(e);
      }
    }
    function wR(e) {
      for (; ne !== null; ) {
        var t = ne, a = t.sibling, i = t.return;
        if (Y1(t), t === e) {
          ne = null;
          return;
        }
        if (a !== null) {
          a.return = i, ne = a;
          return;
        }
        ne = i;
      }
    }
    function CR(e, t) {
      switch (e.tag) {
        case be:
        case Te:
        case Ue: {
          e.mode & He ? (Kg(), Ka(Nn, e, t), qg(e)) : Ka(Nn, e, t);
          break;
        }
      }
    }
    function ER(e) {
      switch (e.tag) {
        case be:
        case Te:
        case Ue: {
          try {
            Uo(cn | sn, e);
          } catch (a) {
            ct(e, e.return, a);
          }
          break;
        }
        case me: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            ct(e, e.return, a);
          }
          break;
        }
      }
    }
    function xR(e) {
      switch (e.tag) {
        case be:
        case Te:
        case Ue: {
          try {
            Uo(Nn | sn, e);
          } catch (t) {
            ct(e, e.return, t);
          }
          break;
        }
      }
    }
    function bR(e) {
      switch (e.tag) {
        case be:
        case Te:
        case Ue: {
          try {
            Ka(cn | sn, e, e.return);
          } catch (a) {
            ct(e, e.return, a);
          }
          break;
        }
        case me: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && _0(e, e.return, t);
          break;
        }
      }
    }
    function TR(e) {
      switch (e.tag) {
        case be:
        case Te:
        case Ue:
          try {
            Ka(Nn | sn, e, e.return);
          } catch (t) {
            ct(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var dp = Symbol.for;
      dp("selector.component"), dp("selector.has_pseudo_class"), dp("selector.role"), dp("selector.test_id"), dp("selector.text");
    }
    var RR = [];
    function kR() {
      RR.forEach(function(e) {
        return e();
      });
    }
    var DR = ke.ReactCurrentActQueue;
    function _R(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function Z1() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && DR.current !== null && S("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var MR = Math.ceil, O0 = ke.ReactCurrentDispatcher, N0 = ke.ReactCurrentOwner, Fn = ke.ReactCurrentBatchConfig, ei = ke.ReactCurrentActQueue, pn = (
      /*             */
      0
    ), J1 = (
      /*               */
      1
    ), jn = (
      /*                */
      2
    ), Ma = (
      /*                */
      4
    ), Cl = 0, pp = 1, us = 2, Em = 3, vp = 4, eC = 5, U0 = 6, Fe = pn, yr = null, Lt = null, vn = N, Ai = N, A0 = Ro(N), hn = Cl, hp = null, xm = N, mp = N, bm = N, yp = null, Pr = null, H0 = 0, tC = 500, nC = 1 / 0, LR = 500, El = null;
    function gp() {
      nC = kt() + LR;
    }
    function rC() {
      return nC;
    }
    var Tm = !1, F0 = null, ff = null, ss = !1, Ho = null, Sp = N, j0 = [], V0 = null, zR = 50, wp = 0, B0 = null, P0 = !1, Rm = !1, OR = 50, df = 0, km = null, Cp = Ze, Dm = N, aC = !1;
    function _m() {
      return yr;
    }
    function gr() {
      return (Fe & (jn | Ma)) !== pn ? kt() : (Cp !== Ze || (Cp = kt()), Cp);
    }
    function Fo(e) {
      var t = e.mode;
      if ((t & De) === oe)
        return de;
      if ((Fe & jn) !== pn && vn !== N)
        return Jt(vn);
      var a = Db() !== kb;
      if (a) {
        if (Fn.transition !== null) {
          var i = Fn.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return Dm === jt && (Dm = cd()), Dm;
      }
      var o = dr();
      if (o !== jt)
        return o;
      var s = dx();
      return s;
    }
    function NR(e) {
      var t = e.mode;
      return (t & De) === oe ? de : Fv();
    }
    function mn(e, t, a, i) {
      ak(), aC && S("useInsertionEffect must not schedule updates."), P0 && (Rm = !0), po(e, a, i), (Fe & jn) !== N && e === yr ? ok(t) : (bn && Vv(e, t, a), uk(t), e === yr && ((Fe & jn) === pn && (mp = xe(mp, a)), hn === vp && jo(e, vn)), Yr(e, i), a === de && Fe === pn && (t.mode & De) === oe && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !ei.isBatchingLegacy && (gp(), aw()));
    }
    function UR(e, t, a) {
      var i = e.current;
      i.lanes = t, po(e, t, a), Yr(e, a);
    }
    function AR(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (Fe & jn) !== pn
      );
    }
    function Yr(e, t) {
      var a = e.callbackNode;
      Uv(e, t);
      var i = Kn(e, e === yr ? vn : N);
      if (i === N) {
        a !== null && wC(a), e.callbackNode = null, e.callbackPriority = jt;
        return;
      }
      var o = nl(i), s = e.callbackPriority;
      if (s === o && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(ei.current !== null && a !== X0)) {
        a == null && s !== de && S("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && wC(a);
      var f;
      if (o === de)
        e.tag === ko ? (ei.isBatchingLegacy !== null && (ei.didScheduleLegacyUpdate = !0), cb(oC.bind(null, e))) : rw(oC.bind(null, e)), ei.current !== null ? ei.current.push(Do) : vx(function() {
          (Fe & (jn | Ma)) === pn && Do();
        }), f = null;
      else {
        var p;
        switch (Pv(i)) {
          case Jn:
            p = Va;
            break;
          case Ur:
            p = wu;
            break;
          case ln:
            p = qi;
            break;
          case Ec:
            p = ao;
            break;
          default:
            p = qi;
            break;
        }
        f = q0(p, iC.bind(null, e));
      }
      e.callbackPriority = o, e.callbackNode = f;
    }
    function iC(e, t) {
      if (eT(), Cp = Ze, Dm = N, (Fe & (jn | Ma)) !== pn)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = bl();
      if (i && e.callbackNode !== a)
        return null;
      var o = Kn(e, e === yr ? vn : N);
      if (o === N)
        return null;
      var s = !zu(e, o) && !Hv(e, o) && !t, f = s ? $R(e, o) : Lm(e, o);
      if (f !== Cl) {
        if (f === us) {
          var p = vc(e);
          p !== N && (o = p, f = Y0(e, p));
        }
        if (f === pp) {
          var v = hp;
          throw cs(e, N), jo(e, o), Yr(e, kt()), v;
        }
        if (f === U0)
          jo(e, o);
        else {
          var m = !zu(e, o), y = e.current.alternate;
          if (m && !FR(y)) {
            if (f = Lm(e, o), f === us) {
              var x = vc(e);
              x !== N && (o = x, f = Y0(e, x));
            }
            if (f === pp) {
              var C = hp;
              throw cs(e, N), jo(e, o), Yr(e, kt()), C;
            }
          }
          e.finishedWork = y, e.finishedLanes = o, HR(e, f, o);
        }
      }
      return Yr(e, kt()), e.callbackNode === a ? iC.bind(null, e) : null;
    }
    function Y0(e, t) {
      var a = yp;
      if (al(e)) {
        var i = cs(e, t);
        i.flags |= ft, rb(e.containerInfo);
      }
      var o = Lm(e, t);
      if (o !== us) {
        var s = Pr;
        Pr = a, s !== null && lC(s);
      }
      return o;
    }
    function lC(e) {
      Pr === null ? Pr = e : Pr.push.apply(Pr, e);
    }
    function HR(e, t, a) {
      switch (t) {
        case Cl:
        case pp:
          throw new Error("Root did not complete. This is a bug in React.");
        case us: {
          fs(e, Pr, El);
          break;
        }
        case Em: {
          if (jo(e, a), hc(a) && // do not delay if we're inside an act() scope
          !CC()) {
            var i = H0 + tC - kt();
            if (i > 10) {
              var o = Kn(e, N);
              if (o !== N)
                break;
              var s = e.suspendedLanes;
              if (!rl(s, a)) {
                gr(), Sc(e, s);
                break;
              }
              e.timeoutHandle = Vy(fs.bind(null, e, Pr, El), i);
              break;
            }
          }
          fs(e, Pr, El);
          break;
        }
        case vp: {
          if (jo(e, a), fy(a))
            break;
          if (!CC()) {
            var f = ld(e, a), p = f, v = kt() - p, m = rk(v) - v;
            if (m > 10) {
              e.timeoutHandle = Vy(fs.bind(null, e, Pr, El), m);
              break;
            }
          }
          fs(e, Pr, El);
          break;
        }
        case eC: {
          fs(e, Pr, El);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function FR(e) {
      for (var t = e; ; ) {
        if (t.flags & Is) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var o = 0; o < i.length; o++) {
                var s = i[o], f = s.getSnapshot, p = s.value;
                try {
                  if (!$(f(), p))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var v = t.child;
        if (t.subtreeFlags & Is && v !== null) {
          v.return = t, t = v;
          continue;
        }
        if (t === e)
          return !0;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return !0;
    }
    function jo(e, t) {
      t = Ou(t, bm), t = Ou(t, mp), dd(e, t);
    }
    function oC(e) {
      if (tT(), (Fe & (jn | Ma)) !== pn)
        throw new Error("Should not already be working.");
      bl();
      var t = Kn(e, N);
      if (!Zn(t, de))
        return Yr(e, kt()), null;
      var a = Lm(e, t);
      if (e.tag !== ko && a === us) {
        var i = vc(e);
        i !== N && (t = i, a = Y0(e, i));
      }
      if (a === pp) {
        var o = hp;
        throw cs(e, N), jo(e, t), Yr(e, kt()), o;
      }
      if (a === U0)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, fs(e, Pr, El), Yr(e, kt()), null;
    }
    function jR(e, t) {
      t !== N && (Nu(e, xe(t, de)), Yr(e, kt()), (Fe & (jn | Ma)) === pn && (gp(), Do()));
    }
    function Q0(e, t) {
      var a = Fe;
      Fe |= J1;
      try {
        return e(t);
      } finally {
        Fe = a, Fe === pn && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !ei.isBatchingLegacy && (gp(), aw());
      }
    }
    function VR(e, t, a, i, o) {
      var s = dr(), f = Fn.transition;
      try {
        return Fn.transition = null, It(Jn), e(t, a, i, o);
      } finally {
        It(s), Fn.transition = f, Fe === pn && gp();
      }
    }
    function xl(e) {
      Ho !== null && Ho.tag === ko && (Fe & (jn | Ma)) === pn && bl();
      var t = Fe;
      Fe |= J1;
      var a = Fn.transition, i = dr();
      try {
        return Fn.transition = null, It(Jn), e ? e() : void 0;
      } finally {
        It(i), Fn.transition = a, Fe = t, (Fe & (jn | Ma)) === pn && Do();
      }
    }
    function uC() {
      return (Fe & (jn | Ma)) !== pn;
    }
    function Mm(e, t) {
      nr(A0, Ai, e), Ai = xe(Ai, t);
    }
    function I0(e) {
      Ai = A0.current, tr(A0, e);
    }
    function cs(e, t) {
      e.finishedWork = null, e.finishedLanes = N;
      var a = e.timeoutHandle;
      if (a !== By && (e.timeoutHandle = By, px(a)), Lt !== null)
        for (var i = Lt.return; i !== null; ) {
          var o = i.alternate;
          H1(o, i), i = i.return;
        }
      yr = e;
      var s = ds(e.current, null);
      return Lt = s, vn = Ai = t, hn = Cl, hp = null, xm = N, mp = N, bm = N, yp = null, Pr = null, Ub(), $a.discardPendingWarnings(), s;
    }
    function sC(e, t) {
      do {
        var a = Lt;
        try {
          if (Vh(), Ow(), Pt(), N0.current = null, a === null || a.return === null) {
            hn = pp, hp = t, Lt = null;
            return;
          }
          if (za && a.mode & He && hm(a, !0), Pn)
            if (vi(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              Eu(a, i, vn);
            } else
              Ea(a, t, vn);
          cT(e, a.return, a, t, vn), pC(a);
        } catch (o) {
          t = o, Lt === a && a !== null ? (a = a.return, Lt = a) : a = Lt;
          continue;
        }
        return;
      } while (!0);
    }
    function cC() {
      var e = O0.current;
      return O0.current = cm, e === null ? cm : e;
    }
    function fC(e) {
      O0.current = e;
    }
    function BR() {
      H0 = kt();
    }
    function Ep(e) {
      xm = xe(e, xm);
    }
    function PR() {
      hn === Cl && (hn = Em);
    }
    function $0() {
      (hn === Cl || hn === Em || hn === us) && (hn = vp), yr !== null && (Si(xm) || Si(mp)) && jo(yr, vn);
    }
    function YR(e) {
      hn !== vp && (hn = us), yp === null ? yp = [e] : yp.push(e);
    }
    function QR() {
      return hn === Cl;
    }
    function Lm(e, t) {
      var a = Fe;
      Fe |= jn;
      var i = cC();
      if (yr !== e || vn !== t) {
        if (bn) {
          var o = e.memoizedUpdaters;
          o.size > 0 && (xp(e, vn), o.clear()), pd(e, t);
        }
        El = Cc(), cs(e, t);
      }
      nd(t);
      do
        try {
          IR();
          break;
        } catch (s) {
          sC(e, s);
        }
      while (!0);
      if (Vh(), Fe = a, fC(i), Lt !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return dt(), yr = null, vn = N, hn;
    }
    function IR() {
      for (; Lt !== null; )
        dC(Lt);
    }
    function $R(e, t) {
      var a = Fe;
      Fe |= jn;
      var i = cC();
      if (yr !== e || vn !== t) {
        if (bn) {
          var o = e.memoizedUpdaters;
          o.size > 0 && (xp(e, vn), o.clear()), pd(e, t);
        }
        El = Cc(), gp(), cs(e, t);
      }
      nd(t);
      do
        try {
          GR();
          break;
        } catch (s) {
          sC(e, s);
        }
      while (!0);
      return Vh(), fC(i), Fe = a, Lt !== null ? (rd(), Cl) : (dt(), yr = null, vn = N, hn);
    }
    function GR() {
      for (; Lt !== null && !Wf(); )
        dC(Lt);
    }
    function dC(e) {
      var t = e.alternate;
      ut(e);
      var a;
      (e.mode & He) !== oe ? (Xg(e), a = G0(t, e, Ai), hm(e, !0)) : a = G0(t, e, Ai), Pt(), e.memoizedProps = e.pendingProps, a === null ? pC(e) : Lt = a, N0.current = null;
    }
    function pC(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & Wi) === le) {
          ut(t);
          var o = void 0;
          if ((t.mode & He) === oe ? o = A1(a, t, Ai) : (Xg(t), o = A1(a, t, Ai), hm(t, !1)), Pt(), o !== null) {
            Lt = o;
            return;
          }
        } else {
          var s = PT(a, t);
          if (s !== null) {
            s.flags &= xv, Lt = s;
            return;
          }
          if ((t.mode & He) !== oe) {
            hm(t, !1);
            for (var f = t.actualDuration, p = t.child; p !== null; )
              f += p.actualDuration, p = p.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= Wi, i.subtreeFlags = le, i.deletions = null;
          else {
            hn = U0, Lt = null;
            return;
          }
        }
        var v = t.sibling;
        if (v !== null) {
          Lt = v;
          return;
        }
        t = i, Lt = t;
      } while (t !== null);
      hn === Cl && (hn = eC);
    }
    function fs(e, t, a) {
      var i = dr(), o = Fn.transition;
      try {
        Fn.transition = null, It(Jn), WR(e, t, a, i);
      } finally {
        Fn.transition = o, It(i);
      }
      return null;
    }
    function WR(e, t, a, i) {
      do
        bl();
      while (Ho !== null);
      if (ik(), (Fe & (jn | Ma)) !== pn)
        throw new Error("Should not already be working.");
      var o = e.finishedWork, s = e.finishedLanes;
      if (_v(s), o === null)
        return Ca(), null;
      if (s === N && S("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = N, o === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = jt;
      var f = xe(o.lanes, o.childLanes);
      jv(e, f), e === yr && (yr = null, Lt = null, vn = N), ((o.subtreeFlags & rn) !== le || (o.flags & rn) !== le) && (ss || (ss = !0, V0 = a, q0(qi, function() {
        return bl(), null;
      })));
      var p = (o.subtreeFlags & (fi | ro | di | rn)) !== le, v = (o.flags & (fi | ro | di | rn)) !== le;
      if (p || v) {
        var m = Fn.transition;
        Fn.transition = null;
        var y = dr();
        It(Jn);
        var x = Fe;
        Fe |= Ma, N0.current = null, GT(e, o), a1(), oR(e, o, s), lx(e.containerInfo), e.current = o, xu(s), uR(o, e, s), Zi(), Tv(), Fe = x, It(y), Fn.transition = m;
      } else
        e.current = o, a1();
      var C = ss;
      if (ss ? (ss = !1, Ho = e, Sp = s) : (df = 0, km = null), f = e.pendingLanes, f === N && (ff = null), C || yC(e.current, !1), Kf(o.stateNode, i), bn && e.memoizedUpdaters.clear(), kR(), Yr(e, kt()), t !== null)
        for (var _ = e.onRecoverableError, L = 0; L < t.length; L++) {
          var z = t[L], I = z.stack, ce = z.digest;
          _(z.value, {
            componentStack: I,
            digest: ce
          });
        }
      if (Tm) {
        Tm = !1;
        var ie = F0;
        throw F0 = null, ie;
      }
      return Zn(Sp, de) && e.tag !== ko && bl(), f = e.pendingLanes, Zn(f, de) ? (Jb(), e === B0 ? wp++ : (wp = 0, B0 = e)) : wp = 0, Do(), Ca(), null;
    }
    function bl() {
      if (Ho !== null) {
        var e = Pv(Sp), t = Tn(ln, e), a = Fn.transition, i = dr();
        try {
          return Fn.transition = null, It(t), qR();
        } finally {
          It(i), Fn.transition = a;
        }
      }
      return !1;
    }
    function XR(e) {
      j0.push(e), ss || (ss = !0, q0(qi, function() {
        return bl(), null;
      }));
    }
    function qR() {
      if (Ho === null)
        return !1;
      var e = V0;
      V0 = null;
      var t = Ho, a = Sp;
      if (Ho = null, Sp = N, (Fe & (jn | Ma)) !== pn)
        throw new Error("Cannot flush passive effects while already rendering.");
      P0 = !0, Rm = !1, td(a);
      var i = Fe;
      Fe |= Ma, hR(t.current), fR(t, t.current, a, e);
      {
        var o = j0;
        j0 = [];
        for (var s = 0; s < o.length; s++) {
          var f = o[s];
          KT(t, f);
        }
      }
      oo(), yC(t.current, !0), Fe = i, Do(), Rm ? t === km ? df++ : (df = 0, km = t) : df = 0, P0 = !1, Rm = !1, Zf(t);
      {
        var p = t.current.stateNode;
        p.effectDuration = 0, p.passiveEffectDuration = 0;
      }
      return !0;
    }
    function vC(e) {
      return ff !== null && ff.has(e);
    }
    function KR(e) {
      ff === null ? ff = /* @__PURE__ */ new Set([e]) : ff.add(e);
    }
    function ZR(e) {
      Tm || (Tm = !0, F0 = e);
    }
    var JR = ZR;
    function hC(e, t, a) {
      var i = ls(a, t), o = d1(e, i, de), s = Mo(e, o, de), f = gr();
      s !== null && (po(s, de, f), Yr(s, f));
    }
    function ct(e, t, a) {
      if (QT(a), bp(!1), e.tag === ee) {
        hC(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === ee) {
          hC(i, e, a);
          return;
        } else if (i.tag === me) {
          var o = i.type, s = i.stateNode;
          if (typeof o.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !vC(s)) {
            var f = ls(a, e), p = p0(i, f, de), v = Mo(i, p, de), m = gr();
            v !== null && (po(v, de, m), Yr(v, m));
            return;
          }
        }
        i = i.return;
      }
      S(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function ek(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var o = gr();
      Sc(e, a), sk(e), yr === e && rl(vn, a) && (hn === vp || hn === Em && hc(vn) && kt() - H0 < tC ? cs(e, N) : bm = xe(bm, a)), Yr(e, o);
    }
    function mC(e, t) {
      t === jt && (t = NR(e));
      var a = gr(), i = Vr(e, t);
      i !== null && (po(i, t, a), Yr(i, a));
    }
    function tk(e) {
      var t = e.memoizedState, a = jt;
      t !== null && (a = t.retryLane), mC(e, a);
    }
    function nk(e, t) {
      var a = jt, i;
      switch (e.tag) {
        case _e:
          i = e.stateNode;
          var o = e.memoizedState;
          o !== null && (a = o.retryLane);
          break;
        case bt:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), mC(e, a);
    }
    function rk(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : MR(e / 1960) * 1960;
    }
    function ak() {
      if (wp > zR)
        throw wp = 0, B0 = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      df > OR && (df = 0, km = null, S("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function ik() {
      $a.flushLegacyContextWarning(), $a.flushPendingUnsafeLifecycleWarnings();
    }
    function yC(e, t) {
      ut(e), zm(e, _n, bR), t && zm(e, ci, TR), zm(e, _n, ER), t && zm(e, ci, xR), Pt();
    }
    function zm(e, t, a) {
      for (var i = e, o = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== o && i.child !== null && s !== le ? i = i.child : ((i.flags & t) !== le && a(i), i.sibling !== null ? i = i.sibling : i = o = i.return);
      }
    }
    var Om = null;
    function gC(e) {
      {
        if ((Fe & jn) !== pn || !(e.mode & De))
          return;
        var t = e.tag;
        if (t !== Je && t !== ee && t !== me && t !== be && t !== Te && t !== vt && t !== Ue)
          return;
        var a = Ee(e) || "ReactComponent";
        if (Om !== null) {
          if (Om.has(a))
            return;
          Om.add(a);
        } else
          Om = /* @__PURE__ */ new Set([a]);
        var i = Cn;
        try {
          ut(e), S("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? ut(e) : Pt();
        }
      }
    }
    var G0;
    {
      var lk = null;
      G0 = function(e, t, a) {
        var i = RC(lk, t);
        try {
          return L1(e, t, a);
        } catch (s) {
          if (gb() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (Vh(), Ow(), H1(e, t), RC(t, i), t.mode & He && Xg(t), zr(null, L1, null, e, t, a), Bf()) {
            var o = Pf();
            typeof o == "object" && o !== null && o._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var SC = !1, W0;
    W0 = /* @__PURE__ */ new Set();
    function ok(e) {
      if (_r && !qb())
        switch (e.tag) {
          case be:
          case Te:
          case Ue: {
            var t = Lt && Ee(Lt) || "Unknown", a = t;
            if (!W0.has(a)) {
              W0.add(a);
              var i = Ee(e) || "Unknown";
              S("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case me: {
            SC || (S("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), SC = !0);
            break;
          }
        }
    }
    function xp(e, t) {
      if (bn) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          Vv(e, i, t);
        });
      }
    }
    var X0 = {};
    function q0(e, t) {
      {
        var a = ei.current;
        return a !== null ? (a.push(t), X0) : $f(e, t);
      }
    }
    function wC(e) {
      if (e !== X0)
        return Gf(e);
    }
    function CC() {
      return ei.current !== null;
    }
    function uk(e) {
      {
        if (e.mode & De) {
          if (!Z1())
            return;
        } else if (!_R() || Fe !== pn || e.tag !== be && e.tag !== Te && e.tag !== Ue)
          return;
        if (ei.current === null) {
          var t = Cn;
          try {
            ut(e), S(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, Ee(e));
          } finally {
            t ? ut(e) : Pt();
          }
        }
      }
    }
    function sk(e) {
      e.tag !== ko && Z1() && ei.current === null && S(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function bp(e) {
      aC = e;
    }
    var La = null, pf = null, ck = function(e) {
      La = e;
    };
    function vf(e) {
      {
        if (La === null)
          return e;
        var t = La(e);
        return t === void 0 ? e : t.current;
      }
    }
    function K0(e) {
      return vf(e);
    }
    function Z0(e) {
      {
        if (La === null)
          return e;
        var t = La(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = vf(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: Al,
                render: a
              };
              return e.displayName !== void 0 && (i.displayName = e.displayName), i;
            }
          }
          return e;
        }
        return t.current;
      }
    }
    function EC(e, t) {
      {
        if (La === null)
          return !1;
        var a = e.elementType, i = t.type, o = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case me: {
            typeof i == "function" && (o = !0);
            break;
          }
          case be: {
            (typeof i == "function" || s === wn) && (o = !0);
            break;
          }
          case Te: {
            (s === Al || s === wn) && (o = !0);
            break;
          }
          case vt:
          case Ue: {
            (s === Hl || s === wn) && (o = !0);
            break;
          }
          default:
            return !1;
        }
        if (o) {
          var f = La(a);
          if (f !== void 0 && f === La(i))
            return !0;
        }
        return !1;
      }
    }
    function xC(e) {
      {
        if (La === null || typeof WeakSet != "function")
          return;
        pf === null && (pf = /* @__PURE__ */ new WeakSet()), pf.add(e);
      }
    }
    var fk = function(e, t) {
      {
        if (La === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        bl(), xl(function() {
          J0(e.current, i, a);
        });
      }
    }, dk = function(e, t) {
      {
        if (e.context !== oa)
          return;
        bl(), xl(function() {
          Tp(t, e, null, null);
        });
      }
    };
    function J0(e, t, a) {
      {
        var i = e.alternate, o = e.child, s = e.sibling, f = e.tag, p = e.type, v = null;
        switch (f) {
          case be:
          case Ue:
          case me:
            v = p;
            break;
          case Te:
            v = p.render;
            break;
        }
        if (La === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var m = !1, y = !1;
        if (v !== null) {
          var x = La(v);
          x !== void 0 && (a.has(x) ? y = !0 : t.has(x) && (f === me ? y = !0 : m = !0));
        }
        if (pf !== null && (pf.has(e) || i !== null && pf.has(i)) && (y = !0), y && (e._debugNeedsRemount = !0), y || m) {
          var C = Vr(e, de);
          C !== null && mn(C, e, de, Ze);
        }
        o !== null && !y && J0(o, t, a), s !== null && J0(s, t, a);
      }
    }
    var pk = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(o) {
          return o.current;
        }));
        return eS(e.current, i, a), a;
      }
    };
    function eS(e, t, a) {
      {
        var i = e.child, o = e.sibling, s = e.tag, f = e.type, p = null;
        switch (s) {
          case be:
          case Ue:
          case me:
            p = f;
            break;
          case Te:
            p = f.render;
            break;
        }
        var v = !1;
        p !== null && t.has(p) && (v = !0), v ? vk(e, a) : i !== null && eS(i, t, a), o !== null && eS(o, t, a);
      }
    }
    function vk(e, t) {
      {
        var a = hk(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case ae:
              t.add(i.stateNode);
              return;
            case Ve:
              t.add(i.stateNode.containerInfo);
              return;
            case ee:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function hk(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === ae)
          i = !0, t.add(a.stateNode);
        else if (a.child !== null) {
          a.child.return = a, a = a.child;
          continue;
        }
        if (a === e)
          return i;
        for (; a.sibling === null; ) {
          if (a.return === null || a.return === e)
            return i;
          a = a.return;
        }
        a.sibling.return = a.return, a = a.sibling;
      }
      return !1;
    }
    var tS;
    {
      tS = !1;
      try {
        var bC = Object.preventExtensions({});
      } catch {
        tS = !0;
      }
    }
    function mk(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = le, this.subtreeFlags = le, this.deletions = null, this.lanes = N, this.childLanes = N, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !tS && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var ua = function(e, t, a, i) {
      return new mk(e, t, a, i);
    };
    function nS(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function yk(e) {
      return typeof e == "function" && !nS(e) && e.defaultProps === void 0;
    }
    function gk(e) {
      if (typeof e == "function")
        return nS(e) ? me : be;
      if (e != null) {
        var t = e.$$typeof;
        if (t === Al)
          return Te;
        if (t === Hl)
          return vt;
      }
      return Je;
    }
    function ds(e, t) {
      var a = e.alternate;
      a === null ? (a = ua(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = le, a.subtreeFlags = le, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & Ft, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case Je:
        case be:
        case Ue:
          a.type = vf(e.type);
          break;
        case me:
          a.type = K0(e.type);
          break;
        case Te:
          a.type = Z0(e.type);
          break;
      }
      return a;
    }
    function Sk(e, t) {
      e.flags &= Ft | St;
      var a = e.alternate;
      if (a === null)
        e.childLanes = N, e.lanes = t, e.child = null, e.subtreeFlags = le, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = le, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function wk(e, t, a) {
      var i;
      return e === Mh ? (i = De, t === !0 && (i |= Ce, i |= et)) : i = oe, bn && (i |= He), ua(ee, null, null, i);
    }
    function rS(e, t, a, i, o, s) {
      var f = Je, p = e;
      if (typeof e == "function")
        nS(e) ? (f = me, p = K0(p)) : p = vf(p);
      else if (typeof e == "string")
        f = ae;
      else
        e: switch (e) {
          case pa:
            return Vo(a.children, o, s, t);
          case Nl:
            f = $r, o |= Ce, (o & De) !== oe && (o |= et);
            break;
          case Ul:
            return Ck(a, o, s, t);
          case ws:
            return Ek(a, o, s, t);
          case va:
            return xk(a, o, s, t);
          case Sf:
            return TC(a, o, s, t);
          case Op:
          case Bm:
          case Np:
          case Pm:
          case zp:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case Qo:
                  f = yn;
                  break e;
                case gf:
                  f = Cr;
                  break e;
                case Al:
                  f = Te, p = Z0(p);
                  break e;
                case Hl:
                  f = vt;
                  break e;
                case wn:
                  f = Er, p = null;
                  break e;
              }
            var v = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var m = i ? Ee(i) : null;
              m && (v += `

Check the render method of \`` + m + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + v));
          }
        }
      var y = ua(f, a, t, o);
      return y.elementType = e, y.type = p, y.lanes = s, y._debugOwner = i, y;
    }
    function aS(e, t, a) {
      var i = null;
      i = e._owner;
      var o = e.type, s = e.key, f = e.props, p = rS(o, s, f, i, t, a);
      return p._debugSource = e._source, p._debugOwner = e._owner, p;
    }
    function Vo(e, t, a, i) {
      var o = ua(rt, e, i, t);
      return o.lanes = a, o;
    }
    function Ck(e, t, a, i) {
      typeof e.id != "string" && S('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var o = ua(Ot, e, i, t | He);
      return o.elementType = Ul, o.lanes = a, o.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, o;
    }
    function Ek(e, t, a, i) {
      var o = ua(_e, e, i, t);
      return o.elementType = ws, o.lanes = a, o;
    }
    function xk(e, t, a, i) {
      var o = ua(bt, e, i, t);
      return o.elementType = va, o.lanes = a, o;
    }
    function TC(e, t, a, i) {
      var o = ua(Ae, e, i, t);
      o.elementType = Sf, o.lanes = a;
      var s = {
        isHidden: !1
      };
      return o.stateNode = s, o;
    }
    function iS(e, t, a) {
      var i = ua(ge, e, null, t);
      return i.lanes = a, i;
    }
    function bk() {
      var e = ua(ae, null, null, oe);
      return e.elementType = "DELETED", e;
    }
    function Tk(e) {
      var t = ua(qt, null, null, oe);
      return t.stateNode = e, t;
    }
    function lS(e, t, a) {
      var i = e.children !== null ? e.children : [], o = ua(Ve, i, e.key, t);
      return o.lanes = a, o.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, o;
    }
    function RC(e, t) {
      return e === null && (e = ua(Je, null, null, oe)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function Rk(e, t, a, i, o) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = By, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = jt, this.eventTimes = gc(N), this.expirationTimes = gc(Ze), this.pendingLanes = N, this.suspendedLanes = N, this.pingedLanes = N, this.expiredLanes = N, this.mutableReadLanes = N, this.finishedLanes = N, this.entangledLanes = N, this.entanglements = gc(N), this.identifierPrefix = i, this.onRecoverableError = o, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < id; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Mh:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case ko:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function kC(e, t, a, i, o, s, f, p, v, m) {
      var y = new Rk(e, t, a, p, v), x = wk(t, s);
      y.current = x, x.stateNode = y;
      {
        var C = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        x.memoizedState = C;
      }
      return Sg(x), y;
    }
    var oS = "18.3.1";
    function kk(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return Bo(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: Vi,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var uS, sS;
    uS = !1, sS = {};
    function DC(e) {
      if (!e)
        return oa;
      var t = no(e), a = sb(t);
      if (t.tag === me) {
        var i = t.type;
        if (_i(i))
          return tw(t, i, a);
      }
      return a;
    }
    function Dk(e, t) {
      {
        var a = no(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var o = Wn(a);
        if (o === null)
          return null;
        if (o.mode & Ce) {
          var s = Ee(a) || "Component";
          if (!sS[s]) {
            sS[s] = !0;
            var f = Cn;
            try {
              ut(o), a.mode & Ce ? S("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : S("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? ut(f) : Pt();
            }
          }
        }
        return o.stateNode;
      }
    }
    function _C(e, t, a, i, o, s, f, p) {
      var v = !1, m = null;
      return kC(e, t, v, m, a, i, o, s, f);
    }
    function MC(e, t, a, i, o, s, f, p, v, m) {
      var y = !0, x = kC(a, i, y, e, o, s, f, p, v);
      x.context = DC(null);
      var C = x.current, _ = gr(), L = Fo(C), z = Sl(_, L);
      return z.callback = t ?? null, Mo(C, z, L), UR(x, L, _), x;
    }
    function Tp(e, t, a, i) {
      qf(t, e);
      var o = t.current, s = gr(), f = Fo(o);
      Xs(f);
      var p = DC(a);
      t.context === null ? t.context = p : t.pendingContext = p, _r && Cn !== null && !uS && (uS = !0, S(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, Ee(Cn) || "Unknown"));
      var v = Sl(s, f);
      v.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && S("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), v.callback = i);
      var m = Mo(o, v, f);
      return m !== null && (mn(m, o, f, s), Ih(m, o, f)), f;
    }
    function Nm(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case ae:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function _k(e) {
      switch (e.tag) {
        case ee: {
          var t = e.stateNode;
          if (al(t)) {
            var a = Av(t);
            jR(t, a);
          }
          break;
        }
        case _e: {
          xl(function() {
            var o = Vr(e, de);
            if (o !== null) {
              var s = gr();
              mn(o, e, de, s);
            }
          });
          var i = de;
          cS(e, i);
          break;
        }
      }
    }
    function LC(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = fd(a.retryLane, t));
    }
    function cS(e, t) {
      LC(e, t);
      var a = e.alternate;
      a && LC(a, t);
    }
    function Mk(e) {
      if (e.tag === _e) {
        var t = fo, a = Vr(e, t);
        if (a !== null) {
          var i = gr();
          mn(a, e, t, i);
        }
        cS(e, t);
      }
    }
    function Lk(e) {
      if (e.tag === _e) {
        var t = Fo(e), a = Vr(e, t);
        if (a !== null) {
          var i = gr();
          mn(a, e, t, i);
        }
        cS(e, t);
      }
    }
    function zC(e) {
      var t = ra(e);
      return t === null ? null : t.stateNode;
    }
    var OC = function(e) {
      return null;
    };
    function zk(e) {
      return OC(e);
    }
    var NC = function(e) {
      return !1;
    };
    function Ok(e) {
      return NC(e);
    }
    var UC = null, AC = null, HC = null, FC = null, jC = null, VC = null, BC = null, PC = null, YC = null;
    {
      var QC = function(e, t, a) {
        var i = t[a], o = Yt(e) ? e.slice() : Le({}, e);
        return a + 1 === t.length ? (Yt(o) ? o.splice(i, 1) : delete o[i], o) : (o[i] = QC(e[i], t, a + 1), o);
      }, IC = function(e, t) {
        return QC(e, t, 0);
      }, $C = function(e, t, a, i) {
        var o = t[i], s = Yt(e) ? e.slice() : Le({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[o], Yt(s) ? s.splice(o, 1) : delete s[o];
        } else
          s[o] = $C(
            // $FlowFixMe number or string is fine here
            e[o],
            t,
            a,
            i + 1
          );
        return s;
      }, GC = function(e, t, a) {
        if (t.length !== a.length) {
          zt("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              zt("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return $C(e, t, a, 0);
      }, WC = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var o = t[a], s = Yt(e) ? e.slice() : Le({}, e);
        return s[o] = WC(e[o], t, a + 1, i), s;
      }, XC = function(e, t, a) {
        return WC(e, t, 0, a);
      }, fS = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      UC = function(e, t, a, i) {
        var o = fS(e, t);
        if (o !== null) {
          var s = XC(o.memoizedState, a, i);
          o.memoizedState = s, o.baseState = s, e.memoizedProps = Le({}, e.memoizedProps);
          var f = Vr(e, de);
          f !== null && mn(f, e, de, Ze);
        }
      }, AC = function(e, t, a) {
        var i = fS(e, t);
        if (i !== null) {
          var o = IC(i.memoizedState, a);
          i.memoizedState = o, i.baseState = o, e.memoizedProps = Le({}, e.memoizedProps);
          var s = Vr(e, de);
          s !== null && mn(s, e, de, Ze);
        }
      }, HC = function(e, t, a, i) {
        var o = fS(e, t);
        if (o !== null) {
          var s = GC(o.memoizedState, a, i);
          o.memoizedState = s, o.baseState = s, e.memoizedProps = Le({}, e.memoizedProps);
          var f = Vr(e, de);
          f !== null && mn(f, e, de, Ze);
        }
      }, FC = function(e, t, a) {
        e.pendingProps = XC(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Vr(e, de);
        i !== null && mn(i, e, de, Ze);
      }, jC = function(e, t) {
        e.pendingProps = IC(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Vr(e, de);
        a !== null && mn(a, e, de, Ze);
      }, VC = function(e, t, a) {
        e.pendingProps = GC(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Vr(e, de);
        i !== null && mn(i, e, de, Ze);
      }, BC = function(e) {
        var t = Vr(e, de);
        t !== null && mn(t, e, de, Ze);
      }, PC = function(e) {
        OC = e;
      }, YC = function(e) {
        NC = e;
      };
    }
    function Nk(e) {
      var t = Wn(e);
      return t === null ? null : t.stateNode;
    }
    function Uk(e) {
      return null;
    }
    function Ak() {
      return Cn;
    }
    function Hk(e) {
      var t = e.findFiberByHostInstance, a = ke.ReactCurrentDispatcher;
      return Xf({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: UC,
        overrideHookStateDeletePath: AC,
        overrideHookStateRenamePath: HC,
        overrideProps: FC,
        overridePropsDeletePath: jC,
        overridePropsRenamePath: VC,
        setErrorHandler: PC,
        setSuspenseHandler: YC,
        scheduleUpdate: BC,
        currentDispatcherRef: a,
        findHostInstanceByFiber: Nk,
        findFiberByHostInstance: t || Uk,
        // React Refresh
        findHostInstancesForRefresh: pk,
        scheduleRefresh: fk,
        scheduleRoot: dk,
        setRefreshHandler: ck,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: Ak,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: oS
      });
    }
    var qC = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function dS(e) {
      this._internalRoot = e;
    }
    Um.prototype.render = dS.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? S("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : Am(arguments[1]) ? S("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && S("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== At) {
          var i = zC(t.current);
          i && i.parentNode !== a && S("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      Tp(e, t, null, null);
    }, Um.prototype.unmount = dS.prototype.unmount = function() {
      typeof arguments[0] == "function" && S("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        uC() && S("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), xl(function() {
          Tp(null, e, null, null);
        }), qS(t);
      }
    };
    function Fk(e, t) {
      if (!Am(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      KC(e);
      var a = !1, i = !1, o = "", s = qC;
      t != null && (t.hydrate ? zt("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === da && S(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (o = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = _C(e, Mh, null, a, i, o, s);
      xh(f.current, e);
      var p = e.nodeType === At ? e.parentNode : e;
      return Ld(p), new dS(f);
    }
    function Um(e) {
      this._internalRoot = e;
    }
    function jk(e) {
      e && Gv(e);
    }
    Um.prototype.unstable_scheduleHydration = jk;
    function Vk(e, t, a) {
      if (!Am(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      KC(e), t === void 0 && S("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, o = a != null && a.hydratedSources || null, s = !1, f = !1, p = "", v = qC;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (p = a.identifierPrefix), a.onRecoverableError !== void 0 && (v = a.onRecoverableError));
      var m = MC(t, null, e, Mh, i, s, f, p, v);
      if (xh(m.current, e), Ld(e), o)
        for (var y = 0; y < o.length; y++) {
          var x = o[y];
          Qb(m, x);
        }
      return new Um(m);
    }
    function Am(e) {
      return !!(e && (e.nodeType === In || e.nodeType === Ha || e.nodeType === au));
    }
    function Rp(e) {
      return !!(e && (e.nodeType === In || e.nodeType === Ha || e.nodeType === au || e.nodeType === At && e.nodeValue === " react-mount-point-unstable "));
    }
    function KC(e) {
      e.nodeType === In && e.tagName && e.tagName.toUpperCase() === "BODY" && S("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), Pd(e) && (e._reactRootContainer ? S("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : S("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var Bk = ke.ReactCurrentOwner, ZC;
    ZC = function(e) {
      if (e._reactRootContainer && e.nodeType !== At) {
        var t = zC(e._reactRootContainer.current);
        t && t.parentNode !== e && S("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = pS(e), o = !!(i && To(i));
      o && !a && S("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === In && e.tagName && e.tagName.toUpperCase() === "BODY" && S("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function pS(e) {
      return e ? e.nodeType === Ha ? e.documentElement : e.firstChild : null;
    }
    function JC() {
    }
    function Pk(e, t, a, i, o) {
      if (o) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var C = Nm(f);
            s.call(C);
          };
        }
        var f = MC(
          t,
          i,
          e,
          ko,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          JC
        );
        e._reactRootContainer = f, xh(f.current, e);
        var p = e.nodeType === At ? e.parentNode : e;
        return Ld(p), xl(), f;
      } else {
        for (var v; v = e.lastChild; )
          e.removeChild(v);
        if (typeof i == "function") {
          var m = i;
          i = function() {
            var C = Nm(y);
            m.call(C);
          };
        }
        var y = _C(
          e,
          ko,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          JC
        );
        e._reactRootContainer = y, xh(y.current, e);
        var x = e.nodeType === At ? e.parentNode : e;
        return Ld(x), xl(function() {
          Tp(t, y, a, i);
        }), y;
      }
    }
    function Yk(e, t) {
      e !== null && typeof e != "function" && S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Hm(e, t, a, i, o) {
      ZC(a), Yk(o === void 0 ? null : o, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = Pk(a, t, e, o, i);
      else {
        if (f = s, typeof o == "function") {
          var p = o;
          o = function() {
            var v = Nm(f);
            p.call(v);
          };
        }
        Tp(t, f, e, o);
      }
      return Nm(f);
    }
    var eE = !1;
    function Qk(e) {
      {
        eE || (eE = !0, S("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = Bk.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || S("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", $e(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === In ? e : Dk(e, "findDOMNode");
    }
    function Ik(e, t, a) {
      if (S("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Rp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = Pd(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Hm(null, e, t, !0, a);
    }
    function $k(e, t, a) {
      if (S("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Rp(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = Pd(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Hm(null, e, t, !1, a);
    }
    function Gk(e, t, a, i) {
      if (S("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Rp(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !Gi(e))
        throw new Error("parentComponent must be a valid React Component");
      return Hm(e, t, a, !1, i);
    }
    var tE = !1;
    function Wk(e) {
      if (tE || (tE = !0, S("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !Rp(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = Pd(e) && e._reactRootContainer === void 0;
        t && S("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = pS(e), i = a && !To(a);
          i && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return xl(function() {
          Hm(null, null, e, !1, function() {
            e._reactRootContainer = null, qS(e);
          });
        }), !0;
      } else {
        {
          var o = pS(e), s = !!(o && To(o)), f = e.nodeType === In && Rp(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    py(_k), hd(Mk), vy(Lk), xc(dr), Yv(Bv), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && S("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), pu(qE), Cv(Q0, VR, xl);
    function Xk(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Am(t))
        throw new Error("Target container is not a DOM element.");
      return kk(e, t, null, a);
    }
    function qk(e, t, a, i) {
      return Gk(e, t, a, i);
    }
    var vS = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [To, Qc, bh, jf, Zl, Q0]
    };
    function Kk(e, t) {
      return vS.usingClientEntryPoint || S('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), Fk(e, t);
    }
    function Zk(e, t, a) {
      return vS.usingClientEntryPoint || S('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), Vk(e, t, a);
    }
    function Jk(e) {
      return uC() && S("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), xl(e);
    }
    var eD = Hk({
      findFiberByHostInstance: Ku,
      bundleType: 1,
      version: oS,
      rendererPackageName: "react-dom"
    });
    if (!eD && Yn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var nE = window.location.protocol;
      /^(https?|file):$/.test(nE) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (nE === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Ir.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = vS, Ir.createPortal = Xk, Ir.createRoot = Kk, Ir.findDOMNode = Qk, Ir.flushSync = Jk, Ir.hydrate = Ik, Ir.hydrateRoot = Zk, Ir.render = $k, Ir.unmountComponentAtNode = Wk, Ir.unstable_batchedUpdates = Q0, Ir.unstable_renderSubtreeIntoContainer = qk, Ir.version = oS, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }(), Ir;
}
var dE = {};
function pE() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (dE.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(pE);
    } catch (B) {
      console.error(B);
    }
  }
}
dE.NODE_ENV === "production" ? (pE(), gS.exports = oD()) : gS.exports = uD();
var sD = gS.exports, Vm, cD = {}, jm = sD;
if (cD.NODE_ENV === "production")
  Vm = jm.createRoot, jm.hydrateRoot;
else {
  var sE = jm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  Vm = function(B, he) {
    sE.usingClientEntryPoint = !0;
    try {
      return jm.createRoot(B, he);
    } finally {
      sE.usingClientEntryPoint = !1;
    }
  };
}
const vE = '*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.pointer-events-none{pointer-events:none}.pointer-events-auto{pointer-events:auto}.static{position:static}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.sticky{position:sticky}.inset-0{top:0;right:0;bottom:0;left:0}.bottom-10{bottom:2.5rem}.left-1\\/2{left:50%}.left-4{left:1rem}.right-4{right:1rem}.top-0{top:0}.top-1\\/2{top:50%}.top-4{top:1rem}.top-6{top:1.5rem}.z-10{z-index:10}.z-20{z-index:20}.z-50{z-index:50}.mx-auto{margin-left:auto;margin-right:auto}.mb-1{margin-bottom:.25rem}.mb-2{margin-bottom:.5rem}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}.mt-1{margin-top:.25rem}.mt-2{margin-top:.5rem}.block{display:block}.inline{display:inline}.flex{display:flex}.grid{display:grid}.hidden{display:none}.aspect-square{aspect-ratio:1 / 1}.h-10{height:2.5rem}.h-14{height:3.5rem}.h-24{height:6rem}.h-3{height:.75rem}.h-3\\/4{height:75%}.h-36{height:9rem}.h-4{height:1rem}.h-5{height:1.25rem}.h-\\[320px\\]{height:320px}.h-full{height:100%}.h-screen{height:100vh}.max-h-60{max-height:15rem}.max-h-\\[70vh\\]{max-height:70vh}.max-h-\\[80\\%\\]{max-height:80%}.w-10{width:2.5rem}.w-14{width:3.5rem}.w-24{width:6rem}.w-28{width:7rem}.w-3{width:.75rem}.w-4{width:1rem}.w-5{width:1.25rem}.w-\\[92vw\\]{width:92vw}.w-fit{width:-moz-fit-content;width:fit-content}.w-full{width:100%}.min-w-0{min-width:0px}.max-w-2xl{max-width:42rem}.max-w-\\[520px\\]{max-width:520px}.max-w-\\[720px\\]{max-width:720px}.max-w-\\[80\\%\\]{max-width:80%}.max-w-md{max-width:28rem}.flex-1{flex:1 1 0%}.shrink-0{flex-shrink:0}.-translate-x-1\\/2{--tw-translate-x: -50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-y-1\\/2{--tw-translate-y: -50%;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.scale-110{--tw-scale-x: 1.1;--tw-scale-y: 1.1;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-grab{cursor:grab}.cursor-pointer{cursor:pointer}.resize-none{resize:none}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-start{justify-content:flex-start}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.gap-1\\.5{gap:.375rem}.gap-2{gap:.5rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.space-y-2>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.5rem * var(--tw-space-y-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.75rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.75rem * var(--tw-space-y-reverse))}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(1rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem * var(--tw-space-y-reverse))}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.rounded-md{border-radius:.375rem}.rounded-xl{border-radius:.75rem}.rounded-t-md{border-top-left-radius:.375rem;border-top-right-radius:.375rem}.rounded-tl-sm{border-top-left-radius:.125rem}.rounded-tr-sm{border-top-right-radius:.125rem}.border{border-width:1px}.border-b{border-bottom-width:1px}.border-t{border-top-width:1px}.border-\\[\\#007AFF\\]{--tw-border-opacity: 1;border-color:rgb(0 122 255 / var(--tw-border-opacity, 1))}.border-\\[\\#007AFF\\]\\/30{border-color:#007aff4d}.border-\\[\\#007AFF\\]\\/80{border-color:#007affcc}.border-indigo-500\\/30{border-color:#6366f14d}.border-pink-500\\/30{border-color:#ec48994d}.border-red-500\\/30{border-color:#ef44444d}.border-slate-700{--tw-border-opacity: 1;border-color:rgb(51 65 85 / var(--tw-border-opacity, 1))}.border-slate-800{--tw-border-opacity: 1;border-color:rgb(30 41 59 / var(--tw-border-opacity, 1))}.border-transparent{border-color:transparent}.border-white\\/10{border-color:#ffffff1a}.border-white\\/20{border-color:#fff3}.border-white\\/5{border-color:#ffffff0d}.bg-\\[\\#007AFF\\]{--tw-bg-opacity: 1;background-color:rgb(0 122 255 / var(--tw-bg-opacity, 1))}.bg-\\[\\#007AFF\\]\\/10{background-color:#007aff1a}.bg-black\\/20{background-color:#0003}.bg-black\\/40{background-color:#0006}.bg-black\\/60{background-color:#0009}.bg-indigo-500\\/20{background-color:#6366f133}.bg-indigo-600{--tw-bg-opacity: 1;background-color:rgb(79 70 229 / var(--tw-bg-opacity, 1))}.bg-pink-500\\/20{background-color:#ec489933}.bg-red-500\\/10{background-color:#ef44441a}.bg-slate-800{--tw-bg-opacity: 1;background-color:rgb(30 41 59 / var(--tw-bg-opacity, 1))}.bg-slate-900{--tw-bg-opacity: 1;background-color:rgb(15 23 42 / var(--tw-bg-opacity, 1))}.bg-slate-950{--tw-bg-opacity: 1;background-color:rgb(2 6 23 / var(--tw-bg-opacity, 1))}.bg-transparent{background-color:transparent}.bg-white\\/10{background-color:#ffffff1a}.bg-white\\/5{background-color:#ffffff0d}.bg-gradient-to-b{background-image:linear-gradient(to bottom,var(--tw-gradient-stops))}.bg-gradient-to-r{background-image:linear-gradient(to right,var(--tw-gradient-stops))}.from-blue-600{--tw-gradient-from: #2563eb var(--tw-gradient-from-position);--tw-gradient-to: rgb(37 99 235 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-blue-900\\/50{--tw-gradient-from: rgb(30 58 138 / .5) var(--tw-gradient-from-position);--tw-gradient-to: rgb(30 58 138 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-indigo-500{--tw-gradient-from: #6366f1 var(--tw-gradient-from-position);--tw-gradient-to: rgb(99 102 241 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-pink-500{--tw-gradient-from: #ec4899 var(--tw-gradient-from-position);--tw-gradient-to: rgb(236 72 153 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-pink-900\\/40{--tw-gradient-from: rgb(131 24 67 / .4) var(--tw-gradient-from-position);--tw-gradient-to: rgb(131 24 67 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-purple-900\\/50{--tw-gradient-from: rgb(88 28 135 / .5) var(--tw-gradient-from-position);--tw-gradient-to: rgb(88 28 135 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-red-600{--tw-gradient-from: #dc2626 var(--tw-gradient-from-position);--tw-gradient-to: rgb(220 38 38 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-red-900\\/60{--tw-gradient-from: rgb(127 29 29 / .6) var(--tw-gradient-from-position);--tw-gradient-to: rgb(127 29 29 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-slate-600{--tw-gradient-from: #475569 var(--tw-gradient-from-position);--tw-gradient-to: rgb(71 85 105 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.from-slate-900{--tw-gradient-from: #0f172a var(--tw-gradient-from-position);--tw-gradient-to: rgb(15 23 42 / 0) var(--tw-gradient-to-position);--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)}.to-blue-500{--tw-gradient-to: #3b82f6 var(--tw-gradient-to-position)}.to-indigo-600{--tw-gradient-to: #4f46e5 var(--tw-gradient-to-position)}.to-orange-500{--tw-gradient-to: #f97316 var(--tw-gradient-to-position)}.to-rose-400{--tw-gradient-to: #fb7185 var(--tw-gradient-to-position)}.to-slate-500{--tw-gradient-to: #64748b var(--tw-gradient-to-position)}.to-slate-950{--tw-gradient-to: #020617 var(--tw-gradient-to-position)}.object-contain{-o-object-fit:contain;object-fit:contain}.object-cover{-o-object-fit:cover;object-fit:cover}.p-1\\.5{padding:.375rem}.p-2{padding:.5rem}.p-3{padding:.75rem}.p-4{padding:1rem}.p-6{padding:1.5rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-1\\.5{padding-top:.375rem;padding-bottom:.375rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-2\\.5{padding-top:.625rem;padding-bottom:.625rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.pb-2{padding-bottom:.5rem}.pl-4{padding-left:1rem}.pr-2{padding-right:.5rem}.text-center{text-align:center}.text-\\[11px\\]{font-size:11px}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-semibold{font-weight:600}.text-\\[\\#4DA6FF\\]{--tw-text-opacity: 1;color:rgb(77 166 255 / var(--tw-text-opacity, 1))}.text-blue-400{--tw-text-opacity: 1;color:rgb(96 165 250 / var(--tw-text-opacity, 1))}.text-indigo-400{--tw-text-opacity: 1;color:rgb(129 140 248 / var(--tw-text-opacity, 1))}.text-pink-400{--tw-text-opacity: 1;color:rgb(244 114 182 / var(--tw-text-opacity, 1))}.text-purple-400{--tw-text-opacity: 1;color:rgb(192 132 252 / var(--tw-text-opacity, 1))}.text-red-200{--tw-text-opacity: 1;color:rgb(254 202 202 / var(--tw-text-opacity, 1))}.text-red-500{--tw-text-opacity: 1;color:rgb(239 68 68 / var(--tw-text-opacity, 1))}.text-slate-100{--tw-text-opacity: 1;color:rgb(241 245 249 / var(--tw-text-opacity, 1))}.text-slate-200{--tw-text-opacity: 1;color:rgb(226 232 240 / var(--tw-text-opacity, 1))}.text-slate-300{--tw-text-opacity: 1;color:rgb(203 213 225 / var(--tw-text-opacity, 1))}.text-slate-400{--tw-text-opacity: 1;color:rgb(148 163 184 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.text-white\\/50{color:#ffffff80}.text-white\\/60{color:#fff9}.text-white\\/90{color:#ffffffe6}.placeholder-white\\/30::-moz-placeholder{color:#ffffff4d}.placeholder-white\\/30::placeholder{color:#ffffff4d}.opacity-0{opacity:0}.opacity-30{opacity:.3}.mix-blend-screen{mix-blend-mode:screen}.shadow{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-2xl{--tw-shadow: 0 25px 50px -12px rgb(0 0 0 / .25);--tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-\\[0_0_15px_rgba\\(236\\,72\\,153\\,0\\.2\\)\\]{--tw-shadow: 0 0 15px rgba(236,72,153,.2);--tw-shadow-colored: 0 0 15px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-\\[0_0_15px_rgba\\(255\\,255\\,255\\,0\\.1\\)\\]{--tw-shadow: 0 0 15px rgba(255,255,255,.1);--tw-shadow-colored: 0 0 15px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-\\[0_0_15px_rgba\\(99\\,102\\,241\\,0\\.2\\)\\]{--tw-shadow: 0 0 15px rgba(99,102,241,.2);--tw-shadow-colored: 0 0 15px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-\\[0_0_8px_rgba\\(0\\,122\\,255\\,0\\.4\\)\\]{--tw-shadow: 0 0 8px rgba(0,122,255,.4);--tw-shadow-colored: 0 0 8px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-inner{--tw-shadow: inset 0 2px 4px 0 rgb(0 0 0 / .05);--tw-shadow-colored: inset 0 2px 4px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-lg{--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-md{--tw-shadow: 0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1);--tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-xl{--tw-shadow: 0 20px 25px -5px rgb(0 0 0 / .1), 0 8px 10px -6px rgb(0 0 0 / .1);--tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.outline-none{outline:2px solid transparent;outline-offset:2px}.ring-1{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.ring-white\\/10{--tw-ring-color: rgb(255 255 255 / .1)}.drop-shadow{--tw-drop-shadow: drop-shadow(0 1px 2px rgb(0 0 0 / .1)) drop-shadow(0 1px 1px rgb(0 0 0 / .06));filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.drop-shadow-2xl{--tw-drop-shadow: drop-shadow(0 25px 25px rgb(0 0 0 / .15));filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.backdrop-blur{--tw-backdrop-blur: blur(8px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.backdrop-blur-md{--tw-backdrop-blur: blur(12px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.backdrop-blur-sm{--tw-backdrop-blur: blur(4px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.backdrop-blur-xl{--tw-backdrop-blur: blur(24px);-webkit-backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-1000{transition-duration:1s}:root{color-scheme:dark}.ai-plugin-root{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji"}.focus-within\\:ring-white\\/30:focus-within{--tw-ring-color: rgb(255 255 255 / .3)}.hover\\:scale-105:hover{--tw-scale-x: 1.05;--tw-scale-y: 1.05;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.hover\\:border-indigo-500:hover{--tw-border-opacity: 1;border-color:rgb(99 102 241 / var(--tw-border-opacity, 1))}.hover\\:bg-\\[\\#005BB5\\]:hover{--tw-bg-opacity: 1;background-color:rgb(0 91 181 / var(--tw-bg-opacity, 1))}.hover\\:bg-black\\/80:hover{background-color:#000c}.hover\\:bg-slate-700:hover{--tw-bg-opacity: 1;background-color:rgb(51 65 85 / var(--tw-bg-opacity, 1))}.hover\\:bg-slate-800:hover{--tw-bg-opacity: 1;background-color:rgb(30 41 59 / var(--tw-bg-opacity, 1))}.hover\\:bg-slate-800\\/50:hover{background-color:#1e293b80}.hover\\:bg-white\\/20:hover{background-color:#fff3}.hover\\:bg-white\\/5:hover{background-color:#ffffff0d}.hover\\:text-\\[\\#007AFF\\]:hover{--tw-text-opacity: 1;color:rgb(0 122 255 / var(--tw-text-opacity, 1))}.hover\\:text-white:hover{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.hover\\:text-white\\/80:hover{color:#fffc}.hover\\:shadow-\\[0_0_10px_rgba\\(99\\,102\\,241\\,0\\.5\\)\\]:hover{--tw-shadow: 0 0 10px rgba(99,102,241,.5);--tw-shadow-colored: 0 0 10px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.focus\\:border-\\[\\#007AFF\\]:focus{--tw-border-opacity: 1;border-color:rgb(0 122 255 / var(--tw-border-opacity, 1))}.focus\\:border-indigo-500:focus{--tw-border-opacity: 1;border-color:rgb(99 102 241 / var(--tw-border-opacity, 1))}.focus\\:ring-1:focus{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.focus\\:ring-\\[\\#007AFF\\]:focus{--tw-ring-opacity: 1;--tw-ring-color: rgb(0 122 255 / var(--tw-ring-opacity, 1))}.active\\:scale-95:active{--tw-scale-x: .95;--tw-scale-y: .95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.active\\:cursor-grabbing:active{cursor:grabbing}.disabled\\:opacity-50:disabled{opacity:.5}.group:hover .group-hover\\:opacity-100{opacity:1}@media (min-width: 768px){.md\\:text-base{font-size:1rem;line-height:1.5rem}}';
class hE extends CS.Component {
  constructor(he) {
    super(he), this.state = { hasError: !1, error: null };
  }
  static getDerivedStateFromError(he) {
    return { hasError: !0, error: he };
  }
  componentDidCatch(he, k) {
    console.error("Plugin Render Error:", he, k);
  }
  render() {
    var he, k;
    return this.state.hasError ? /* @__PURE__ */ Fi.jsxs("div", { style: { padding: "20px", color: "red", backgroundColor: "black", width: "100%", height: "100%" }, children: [
      /* @__PURE__ */ Fi.jsx("h3", { children: "Plugin Crashed" }),
      /* @__PURE__ */ Fi.jsx("pre", { children: (he = this.state.error) == null ? void 0 : he.message }),
      /* @__PURE__ */ Fi.jsx("pre", { children: (k = this.state.error) == null ? void 0 : k.stack })
    ] }) : this.props.children;
  }
}
var kl, vs, ms, mE, SS;
class fD extends HTMLElement {
  constructor() {
    super(...arguments);
    ps(this, ms);
    ps(this, kl);
    ps(this, vs);
  }
  static get observedAttributes() {
    return ["api-base-url", "theme", "token", "initial-prompt", "initial-image-url"];
  }
  connectedCallback() {
    if (ca(this, kl)) return;
    Rl(this, vs, this.attachShadow({ mode: "open" }));
    const k = document.createElement("style");
    k.textContent = vE, ca(this, vs).appendChild(k);
    const ke = document.createElement("div");
    ke.className = "ai-plugin-root", ca(this, vs).appendChild(ke), Rl(this, kl, Vm(ke)), mf(this, ms, SS).call(this);
  }
  disconnectedCallback() {
    var k;
    (k = ca(this, kl)) == null || k.unmount(), Rl(this, kl, void 0), Rl(this, vs, void 0);
  }
  attributeChangedCallback() {
    mf(this, ms, SS).call(this);
  }
}
kl = new WeakMap(), vs = new WeakMap(), ms = new WeakSet(), mE = function() {
  return {
    apiBaseUrl: this.getAttribute("api-base-url") || void 0,
    theme: this.getAttribute("theme") || void 0,
    token: this.getAttribute("token") || void 0,
    initialPrompt: this.getAttribute("initial-prompt") || void 0,
    initialImageUrl: this.getAttribute("initial-image-url") || void 0,
    onImageGenerated: (k) => {
      this.dispatchEvent(new CustomEvent("imageGenerated", { detail: { images: k } }));
    },
    onModelGenerated: (k) => {
      this.dispatchEvent(new CustomEvent("modelGenerated", { detail: k }));
    },
    onError: (k) => {
      this.dispatchEvent(new CustomEvent("pluginError", { detail: k }));
    }
  };
}, SS = function() {
  ca(this, kl) && ca(this, kl).render(
    /* @__PURE__ */ Fi.jsx(CS.StrictMode, { children: /* @__PURE__ */ Fi.jsx(hE, { children: /* @__PURE__ */ Fi.jsx(rD, { ...mf(this, ms, mE).call(this) }) }) })
  );
};
var Dl, hs, Dp, wS;
class dD extends HTMLElement {
  constructor() {
    super(...arguments);
    ps(this, Dp);
    ps(this, Dl);
    ps(this, hs);
  }
  static get observedAttributes() {
    return ["api-base-url", "chat-history"];
  }
  connectedCallback() {
    if (ca(this, Dl)) return;
    Rl(this, hs, this.attachShadow({ mode: "open" }));
    const k = document.createElement("style");
    k.textContent = vE, ca(this, hs).appendChild(k);
    const ke = document.createElement("div");
    ke.className = "ai-plugin-root", ca(this, hs).appendChild(ke), Rl(this, Dl, Vm(ke)), mf(this, Dp, wS).call(this);
  }
  disconnectedCallback() {
    var k;
    (k = ca(this, Dl)) == null || k.unmount(), Rl(this, Dl, void 0), Rl(this, hs, void 0);
  }
  attributeChangedCallback() {
    mf(this, Dp, wS).call(this);
  }
}
Dl = new WeakMap(), hs = new WeakMap(), Dp = new WeakSet(), wS = function() {
  if (!ca(this, Dl)) return;
  const k = this.getAttribute("api-base-url") || void 0, ke = this.getAttribute("chat-history") || void 0;
  ca(this, Dl).render(
    /* @__PURE__ */ Fi.jsx(CS.StrictMode, { children: /* @__PURE__ */ Fi.jsx(hE, { children: /* @__PURE__ */ Fi.jsx(
      aD,
      {
        apiBaseUrl: k,
        chatHistory: ke,
        onSend: (Xt) => {
          this.dispatchEvent(new CustomEvent("on-chat-send", { detail: Xt, bubbles: !0 }));
        }
      }
    ) }) })
  );
};
customElements.get("ai-plugin-panel") || customElements.define("ai-plugin-panel", fD);
customElements.get("ai-resonance-demo") || customElements.define("ai-resonance-demo", dD);
