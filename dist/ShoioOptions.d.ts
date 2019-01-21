import { Shoio } from "./Shoio";
export interface ShoioOptions {
    name?: string;
    routes?: any[];
    plugins?: any[];
    components?: Shoio[];
    actions?: {};
    [config: string]: any;
}
