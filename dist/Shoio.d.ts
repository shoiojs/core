import { ShoioOptions } from "./ShoioOptions";
export declare class Shoio {
    [x: string]: any;
    __isShoio: boolean;
    $scope: {};
    $options: ShoioOptions;
    $plugins: any[];
    $state: string;
    $hooks: {
        beforeCreate: any[];
        created: any[];
        beforeMount: any[];
        mounted: any[];
    };
    $localHooks: {
        beforeCreate: any[];
        created: any[];
        beforeMount: any[];
        mounted: any[];
    };
    $components: any[];
    $parent: any;
    constructor(config?: {});
    readonly name: string;
    readonly scope: {
        $options: ShoioOptions;
        $plugins: any[];
        $localHooks: {
            beforeCreate: any[];
            created: any[];
            beforeMount: any[];
            mounted: any[];
        };
        $hooks: {
            beforeCreate: any[];
            created: any[];
            beforeMount: any[];
            mounted: any[];
        };
        $components: any[];
        $parent: any;
    };
    registerHook(type: any, fn: any): void;
    callHook(type: any): Promise<void>;
    on(type: any, fn: any): void;
    findComponent(name: any, list?: any[]): any;
    getComponent(componentSignature: string, parent?: boolean): any;
    getComponent(componentSignature: Function, parent?: boolean): any;
    getComponent(componentSignature: {
        name: string;
        [key: string]: any;
    }, parent?: boolean): any;
    installPlugin(plugin: any): Promise<void>;
    __installPlugins(): Promise<void>;
    __prepareChilds(): Promise<void>;
    __mountChilds(): Promise<void>;
    __mountChild(component: any): Promise<void>;
    __prepareMethods(): void;
    mount(): Promise<this>;
}
