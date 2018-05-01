const _ = require('underscore')


class Module {
    
    constructor( config , done ) {


        this.$name = config.name || 'root'
        this.$methods = config.methods
        this.$options = config
        this.$modules = []
        this.$parent = config.$parent

        this.prepare.call( this )
    }


    async init(  ) {

        await this.beforeMount()

        if( this.$options.modules ) {
            for( const _module of this.$options.modules ) {
                if( !(_module instanceof Module ) ) {
                    _module.$parent = this
                    const $module = new Module( _module )
                    this.$modules.push( await $module.init() )
                }
            }
        }

        await this.mounted()

        return this

    }

    async beforeAction( ...args ) {

        if( this.$options.beforeAction && this.$options.beforeAction.call ) {
            return await this.$options.beforeAction.call( this, ...args )
        }

        return;
    }

    getParents() {

        const $modules = []

        for( let parent = this.$parent ; typeof parent !== 'undefined' ; parent = parent.$parent ) {
            $modules.push(parent)
        }

        return $modules
    }

    execute( action ) {
        const actionName = action.action 

        const method = this.$methods[ actionName ]
        
        return method.call( this, action )
    }

    async dispatch( action ) {

        if( !('module' in action) ) {
            console.warn(' - [Warning]: action dispatched without module name, will be applicated to all modules')
        }

        if( !('action' in action) ){
            throw Error(' - [Error]: Tried to dispatch action without parameter action')
        }


        const child = _.clone(action)
        let ctx = _.clone(action)
        ctx.$module = this
        ctx.$name = this.$name

        child.$parent = ctx

        const response = []

        if( ctx.module === this.$name ) {

            const $parents = this.getParents() 

            for( let $parent of $parents) {
                const result = await $parent.beforeAction( ctx )
            
                if( typeof result !== 'undefined' ) {
                    ctx = result
                }
            }

            const result = await this.execute(ctx)

            response.push( result )
            
        } else {
        
            for( const $module of this.$modules ) {
                const results = await $module.dispatch( child )
                response.push( ...results )   
            }
        
        }

        return response
    }

    getModule( name, ctx, searchInParents ) {

        if( ctx === undefined || ctx === null ) {
            ctx = this
        }
    
        if( ctx && ctx.$name === name ) {
            return ctx
        } 
    
        if( ctx && ctx.$modules ) {
            for( const $module of ctx.$modules ) {
                if( $module.$name === name ) {
                    return $module
                }
                if( $module.$modules ) {
                    const result = this.getModule( name, $module, false )
                    if( result ) {
                        return result
                    }
                }
            }
        }
    
        if( searchInParents === false ) {
            return
        }

        return this.getModule( name, ctx.$parent, searchInParents )
    }

    async eachPlugin(fn) {
        for( let $plugin of Module.$plugins ) {
            await fn( $plugin )
        }
    }

    prepare( ...args ) {
        return this.eachPlugin( ($plugin) => {
            if( !$plugin.prepare || !$plugin.prepare.call ) {
                return;
            }
            return $plugin.prepare.call( this, ...args )
        } )
    }

    beforeMount( ...args ) {
        return this.eachPlugin( ($plugin) => {
            $plugin.beforeMount = $plugin.mount || $plugin.beforeMount
            if( !$plugin.beforeMount || !$plugin.beforeMount.call ) {
                return;
            }
            return $plugin.beforeMount.call( this, ...args )
        } )
    }

    mounted( ...args ) {
        return this.eachPlugin( ($plugin) => {
            if( !$plugin.mounted || !$plugin.mounted.call ) {
                return;
            }
            return $plugin.mounted.call( this, ...args )
        } )
    }

    // Return an promise to each module

}

Module.$plugins = []

Module.use = function( fn, config ) {

    const $plugin = fn( Module, config )
    
    Module.$plugins.push( $plugin )

    if( !$plugin.install || !$plugin.install.call ) {
        return
    }

    $plugin.install( Module )

}

module.exports = Module
