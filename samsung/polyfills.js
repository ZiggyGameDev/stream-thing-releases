// For the TV builds only (scripts/tvweb.mjs loads this ahead of the app).
//
// A TV keeps the Chromium its model year shipped with: a 2020 Samsung or LG is on 68/69.
// The build writes the app's syntax down to that, but it can't add what the browser itself
// is missing. These are the newer built-ins the app uses, each added only where absent.
// Plain old JavaScript on purpose: nothing compiles this file.
(function () {
  'use strict';
  var g = typeof self !== 'undefined' ? self : window;
  if (typeof globalThis === 'undefined') g.globalThis = g;

  if (!Object.fromEntries) {
    Object.fromEntries = function (entries) {
      var out = {};
      Array.from(entries).forEach(function (pair) {
        out[pair[0]] = pair[1];
      });
      return out;
    };
  }

  if (!Promise.allSettled) {
    Promise.allSettled = function (promises) {
      return Promise.all(
        Array.from(promises).map(function (p) {
          return Promise.resolve(p).then(
            function (value) {
              return { status: 'fulfilled', value: value };
            },
            function (reason) {
              return { status: 'rejected', reason: reason };
            }
          );
        })
      );
    };
  }

  function at(n) {
    n = Math.trunc(n) || 0;
    if (n < 0) n += this.length;
    return n < 0 || n >= this.length ? undefined : this[n];
  }
  if (!Array.prototype.at) Object.defineProperty(Array.prototype, 'at', { value: at, writable: true, configurable: true });
  if (!String.prototype.at) Object.defineProperty(String.prototype, 'at', { value: at, writable: true, configurable: true });

  if (!String.prototype.matchAll) {
    Object.defineProperty(String.prototype, 'matchAll', {
      writable: true,
      configurable: true,
      value: function (pattern) {
        var flags = pattern.flags.indexOf('g') < 0 ? pattern.flags + 'g' : pattern.flags;
        var re = new RegExp(pattern.source, flags);
        var out = [];
        var m;
        while ((m = re.exec(this)) !== null) {
          out.push(m);
          if (m[0] === '') re.lastIndex += 1;
        }
        return out[Symbol.iterator]();
      },
    });
  }

  if (!String.prototype.replaceAll) {
    Object.defineProperty(String.prototype, 'replaceAll', {
      writable: true,
      configurable: true,
      value: function (find, replacement) {
        if (find instanceof RegExp) return this.replace(find, replacement);
        return this.split(String(find)).join(typeof replacement === 'function' ? replacement(String(find)) : String(replacement));
      },
    });
  }

  // The app only ever copies plain data with it (settings, lists).
  if (typeof g.structuredClone !== 'function') {
    g.structuredClone = function (value) {
      return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
    };
  }

  if (g.crypto && !g.crypto.randomUUID) {
    g.crypto.randomUUID = function () {
      var b = g.crypto.getRandomValues(new Uint8Array(16));
      b[6] = (b[6] & 0x0f) | 0x40;
      b[8] = (b[8] & 0x3f) | 0x80;
      var hex = Array.prototype.map
        .call(b, function (x) {
          return (x + 0x100).toString(16).slice(1);
        })
        .join('');
      return hex.slice(0, 8) + '-' + hex.slice(8, 12) + '-' + hex.slice(12, 16) + '-' + hex.slice(16, 20) + '-' + hex.slice(20);
    };
  }

  if (typeof g.queueMicrotask !== 'function') {
    g.queueMicrotask = function (f) {
      Promise.resolve().then(f);
    };
  }
})();
