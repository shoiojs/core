"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var functionsIn = require("lodash.functionsin");
var isClass = function (obj) {
    try {
        new obj();
        return true;
    }
    catch (e) {
        return false;
    }
};
var Shoio = (function () {
    function Shoio(config) {
        if (config === void 0) { config = {}; }
        this.__isShoio = true;
        this.$scope = {};
        this.$options = {
            routes: [],
            plugins: [],
            components: [],
            actions: {}
        };
        this.$plugins = [];
        this.$state = "untouched";
        this.$hooks = {
            beforeCreate: [],
            created: [],
            beforeMount: [],
            mounted: []
        };
        this.$localHooks = {
            beforeCreate: [],
            created: [],
            beforeMount: [],
            mounted: []
        };
        this.$components = [];
        this.$parent = null;
        this.$options = __assign({}, this.$options, this.options, config);
        this.callHook("beforeCreate");
    }
    Object.defineProperty(Shoio.prototype, "name", {
        get: function () {
            return this.$options.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Shoio.prototype, "scope", {
        get: function () {
            return __assign({ $options: this.$options, $plugins: this.$plugins, $localHooks: this.$localHooks, $hooks: this.$hooks, $components: this.$components, $parent: this.$parent }, this.$scope);
        },
        enumerable: true,
        configurable: true
    });
    Shoio.prototype.registerHook = function (type, fn) {
        this.$hooks[type].push(fn);
    };
    Shoio.prototype.callHook = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, hook;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.$state = type;
                        if (!this[type]) return [3, 2];
                        return [4, this[type].call(this, this)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        _i = 0, _a = this.$localHooks[type].concat(this.$hooks[type]);
                        _b.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3, 6];
                        hook = _a[_i];
                        return [4, hook(this)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3, 3];
                    case 6: return [2];
                }
            });
        });
    };
    Shoio.prototype.on = function (type, fn) {
        this.$localHooks[type].push(fn);
    };
    Shoio.prototype.findComponent = function (name, list) {
        if (list === void 0) { list = []; }
        return list.find(function (component) {
            if (!component || typeof component === "undefined") {
                return;
            }
            if (component.name === name || component.$options.name === name) {
                return component;
            }
            if (component.constructor && component.constructor.name === name) {
                return component;
            }
        });
    };
    Shoio.prototype.getComponent = function (componentSignature, parent, child) {
        if (parent === void 0) { parent = false; }
        if (child === void 0) { child = true; }
        var name;
        if (!componentSignature) {
            console.error('The first parameter "componentSignature" is required');
            return null;
        }
        if (typeof componentSignature === "string") {
            name = componentSignature;
        }
        if (typeof componentSignature === "object") {
            name = componentSignature.name || componentSignature.$options.name;
        }
        if (typeof componentSignature === "function") {
            if (isClass(componentSignature)) {
                name = new componentSignature().name || componentSignature.name;
            }
        }
        var components = this.$components;
        if (parent && this.$parent && typeof this.$parent !== "undefined") {
            components.push.apply(components, this.$parent.$components);
        }
        var component = this.findComponent(name, components);
        if (component) {
            return component;
        }
        if (child) {
            for (var _i = 0, _a = this.$components; _i < _a.length; _i++) {
                var component_1 = _a[_i];
                var result = component_1.getComponent(componentSignature, false, false);
                if (result) {
                    return result;
                }
            }
        }
    };
    Shoio.prototype.installPlugin = function (plugin) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, plugin.install(this)];
                    case 1:
                        _a.sent();
                        this.$plugins.push(plugin);
                        return [2];
                }
            });
        });
    };
    Shoio.prototype.__installPlugins = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, plugin;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.$options.plugins) {
                            return [2];
                        }
                        _i = 0, _a = this.$options.plugins;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        plugin = _a[_i];
                        return [4, this.installPlugin(plugin)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
    };
    Shoio.prototype.__prepareChilds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, component;
            return __generator(this, function (_b) {
                if (!this.$options.components) {
                    return [2];
                }
                for (_i = 0, _a = this.$options.components; _i < _a.length; _i++) {
                    component = _a[_i];
                    if (isClass(component)) {
                        component = new component();
                    }
                    component.$parent = this;
                    this.$components.push(component);
                }
                return [2];
            });
        });
    };
    Shoio.prototype.__mountChilds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, component;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.$components;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        component = _a[_i];
                        return [4, this.__mountChild(component)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
    };
    Shoio.prototype.__mountChild = function (component) {
        return __awaiter(this, void 0, void 0, function () {
            var hookType, _i, _a, hook, _b, _c, plugin;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!component.$options) {
                            component.$options = { plugins: [] };
                        }
                        for (hookType in this.$hooks) {
                            for (_i = 0, _a = this.$hooks[hookType]; _i < _a.length; _i++) {
                                hook = _a[_i];
                                component.registerHook(hookType, hook);
                            }
                        }
                        for (_b = 0, _c = this.$options.plugins; _b < _c.length; _b++) {
                            plugin = _c[_b];
                            component.$options.plugins.push(plugin);
                        }
                        if (isClass(component)) {
                            component = new component();
                        }
                        if (typeof component === 'function') {
                            component = new component();
                        }
                        return [4, component.mount()];
                    case 1:
                        _d.sent();
                        return [2];
                }
            });
        });
    };
    Shoio.prototype.__prepareMethods = function () {
        var _this = this;
        var functions = {};
        var unableToBindFunctions = [
            "registerHook",
            "callHook",
            "on",
            "getComponent",
            "__installPlugins",
            "__mountChilds",
            "__mountChild",
            "__prepareMethods",
            "mount"
        ];
        var isAbleToBind = function (key) {
            return unableToBindFunctions.indexOf(key) < 0;
        };
        functionsIn(this.$options.actions)
            .filter(isAbleToBind)
            .map(function (key) { return (functions[key] = _this.$options.actions[key]); });
        functionsIn(this.$options)
            .filter(isAbleToBind)
            .map(function (key) { return (functions[key] = _this.$options[key]); });
        Object.keys(functions).map(function (key) {
            _this[key] = functions[key].bind(_this);
        });
    };
    Shoio.prototype.mount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.__prepareMethods();
                        this.__prepareChilds();
                        return [4, this.__installPlugins()];
                    case 1:
                        _a.sent();
                        return [4, this.callHook("created")];
                    case 2:
                        _a.sent();
                        return [4, this.callHook("beforeMount")];
                    case 3:
                        _a.sent();
                        return [4, this.__mountChilds()];
                    case 4:
                        _a.sent();
                        return [4, this.callHook("mounted")];
                    case 5:
                        _a.sent();
                        return [2, this];
                }
            });
        });
    };
    return Shoio;
}());
exports.Shoio = Shoio;
//# sourceMappingURL=Shoio.js.map