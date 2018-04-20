class Module {
    
    constructor( config , done ) {


        this.$name = config.name || 'root'
        this.$methods = config.methods
        this.$options = config
        this.$modules = []
        
        this.prepare.call( this )
    }


    async init() {

        await this.beforeMount()

        if( this.$options.modules ) {
            for( const _module of this.$options.modules ) {
                if( !(_module instanceof Module ) ) {
                    const $module = new Module( _module )
                    this.$modules.push( await $module.init() )
                }
            }
        }

        await this.mounted()

        return this

    }


    async dispatch( action ) {

        const response = []

        action.context = {
            ...action,
            name: this.$name,
            $module: this
        }

        if( action.module === this.$name || !action.module ) {
            response.push( await this.$methods[ action.action ].call( this, action.data , action.context) )
        }
        
        for( const _module of this.$modules ) {
            response.push( ...(await _module.dispatch( action ) ) )   
        }

        return response
    }

    getModule( name, ctx ) {

        if( ctx === undefined || ctx === null ) {
            return
        }
    
        if( ctx.name === name ) {
            return ctx.$module
        } 
    
        if( ctx.$module.$modules ) {
            for( const $module of ctx.$module.$modules ) {
                if( $module.$name === name ) {
                    return $module
                }
            }
        }
    
        return this.getModule( name, ctx.context )
        
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

    beforeMount() {
        return this.eachPlugin( ($plugin) => {
            $plugin.beforeMount = $plugin.mount || $plugin.beforeMount
            if( !$plugin.beforeMount || !$plugin.beforeMount.call ) {
                return;
            }
            return $plugin.beforeMount.call( this )
        } )
    }

    mounted() {
        return this.eachPlugin( ($plugin) => {
            if( !$plugin.mounted || !$plugin.mounted.call ) {
                return;
            }
            return $plugin.mounted.call( this )
        } )
    }

    // Return an promise to each module

}

Module.$plugins = []

Module.use = function( fn ) {

    const $plugin = fn()
    
    Module.$plugins.push( $plugin )

    $plugin.install( Module )

}

module.exports = Module
