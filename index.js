function Module( config ) {

    this.$name = config.name || 'root'
    this.$methods = config.methods
    this.$options = config
    this.$modules = []

    if( config.modules ) {
        for( const _module of config.modules ) {
            if( !(_module instanceof Module ) ) {
                this.$modules.push( new Module( _module ) )
            }
        }
    }

    if ( Module.$plugins ) {
        for( let $plugin of Module.$plugins ) {
            $plugin.$mount.call( this )
        }
    }

}

Module.$plugins = []

Module.prototype.getModule = function( name, ctx ) {

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

Module.prototype.dispatch = async function( action ) {

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

Module.use = function( fn ) {

    const $plugin = fn()
    
    Module.$plugins.push( $plugin )

    $plugin.$extend( Module )

}

module.exports = Module
