import { ShoioOptions } from "./ShoioOptions";
const functionsIn = require("lodash.functionsin");

const isClass = obj => {
  try {
    new obj();
    return true;
  } catch (e) {
    return false;
  }
};

export class Shoio {
  [x: string]: any;

  public __isShoio = true;

  $scope = {};

  $options: ShoioOptions = {
    routes: [],
    plugins: [],
    components: [],
    actions: {}
  } as ShoioOptions;

  $plugins = [];

  $state = "untouched";

  $hooks = {
    beforeCreate: [],
    created: [],
    beforeMount: [],
    mounted: []
  };

  $localHooks = {
    beforeCreate: [],
    created: [],
    beforeMount: [],
    mounted: []
  };

  $components = [];

  $parent = null;

  constructor(config = {}) {
    this.$options = {
      ...this.$options,
      ...this.options,
      ...config
    };
    this.callHook("beforeCreate");
  }

  get name() {
    return this.$options.name;
  }

  get scope() {
    return {
      $options: this.$options,
      $plugins: this.$plugins,
      $localHooks: this.$localHooks,
      $hooks: this.$hooks,
      $components: this.$components,
      $parent: this.$parent,
      ...this.$scope
    };
  }

  registerHook(type, fn) {
    this.$hooks[type].push(fn);
  }

  async callHook(type) {
    this.$state = type;
    if (this[type]) {
      await this[type].call(this, this);
    }
    for (const hook of [...this.$localHooks[type], ...this.$hooks[type]]) {
      await hook(this);
    }
  }

  on(type, fn) {
    this.$localHooks[type].push(fn);
  }

  findComponent(name, list = []) {
    return list.find(component => {
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
  }

  /**
   *
   *
   * @param {string} componentSignature
   * @param {boolean} parent
   * @memberof Shoio
   */
  getComponent(componentSignature: string, parent?: boolean);

  /**
   *
   *
   * @param {Function} componentSignature
   * @param {boolean} parent
   * @memberof Shoio
   */
  getComponent(componentSignature: Function, parent?: boolean);

  /**
   *
   *
   * @param {{ name: string, [key: string]: any }} componentSignature
   * @param {boolean} parent
   * @memberof Shoio
   */
  getComponent(
    componentSignature: { name: string; [key: string]: any },
    parent?: boolean
  );

  /**
   *
   *
   * @param {*} componentSignature
   * @param {boolean} [parent=false]
   * @returns
   * @memberof Shoio
   */
  getComponent(componentSignature, parent = false, child = true) {
    let name;

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

    let components = this.$components;
    if (parent && this.$parent && typeof this.$parent !== "undefined") {
      components.push(...this.$parent.$components);
    }

    const component = this.findComponent(name, components);

    if (component) {
      return component;
    }

    if (child) {
      for (const component of this.$components) {
        const result = component.getComponent(componentSignature, false, false);
        if (result) {
          return result;
        }
      }
    }
  }

  async installPlugin(plugin) {
    await plugin.install(this);
    this.$plugins.push(plugin);
  }

  async __installPlugins() {
    if (!this.$options.plugins) {
      return;
    }
    for (const plugin of this.$options.plugins) {
      await this.installPlugin(plugin);
    }
  }

  async __prepareChilds() {
    if (!this.$options.components) {
      return;
    }

    for (let component of this.$options.components) {
      if (isClass(component)) {
        // @ts-ignore
        component = new component();
      }

      component.$parent = this;
      this.$components.push(component);
    }
  }

  async __mountChilds() {
    for (const component of this.$components) {
      await this.__mountChild(component);
    }
  }

  async __mountChild(component) {

    if( !component.$options ) {
      component.$options = { plugins: [] } as ShoioOptions;
    }

    for (const hookType in this.$hooks) {
      for (const hook of this.$hooks[hookType]) {
        component.registerHook(hookType, hook);
      }
    }

    for (const plugin of this.$options.plugins) {
      component.$options.plugins.push(plugin);
    }

    if( isClass( component ) ) {
      component = new component()
    }

    if( typeof component === 'function' ) {
      component = new component()
    }

    await component.mount();
  }

  __prepareMethods() {
    const functions = {};
    const unableToBindFunctions = [
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
    const isAbleToBind = key => {
      return unableToBindFunctions.indexOf(key) < 0;
    };
    functionsIn(this.$options.actions)
      .filter(isAbleToBind)
      .map(key => (functions[key] = this.$options.actions[key]));
    functionsIn(this.$options)
      .filter(isAbleToBind)
      .map(key => (functions[key] = this.$options[key]));
    Object.keys(functions).map(key => {
      this[key] = functions[key].bind(this);
    });
  }

  async mount() {
    this.__prepareMethods();
    this.__prepareChilds();
    await this.__installPlugins();
    await this.callHook("created");
    await this.callHook("beforeMount");
    await this.__mountChilds();
    await this.callHook("mounted");
    return this
  }
}
