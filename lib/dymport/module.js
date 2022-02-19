import dymport from '../dymport.js'

export const moduleSymbol = Symbol('Object dymport.module() async. Dynamically imports a module')
export const module = Object.defineProperty( dymport, moduleSymbol, {
    enumerable: true,
    writable: false,
    configurable: false,
    
    /**
     * The module_ function dynamic importer.
     *
     * @param {{imports: string[], functions: [{export: string, function: (function(*): *)}]}} source - .
     * @param {{name: string, version: string, license: string, author: string, remote: false, local: true, script: ['application/json','text/javascript'], loaders: [ 'json', 'javascript' ],}} signature
     *        - .
     * @param {boolean} queue - It tells to the function that it will be a multiple files to be loaded as module.
     *                          This will activate the event emitter and dispatch the modules when ready.
     * @returns {Promise | PromiseFulfilledResult<Module> | PromiseRejectedResult<TypeError, ReferenceError>}
     */
    value: async function module( source, signature, queue = false ) {
        
        //__methods.source = source
        //__methods.signature = signature
        
        let types = await __methods.types( source, signature )
        if ( types !== true )
            return __methods.typeError( types ).catch( error => error )
        
        let reference = await __methods.references( source, signature )
        if ( reference !== true )
            return __methods.typeError( reference ).catch( error => error )
        
        return new Promise( ( resolve ) => {
            
            let data = `data:${ signature.script }, `
            
            for ( const line in source[ 0 ][ 0 ].imports )
                data += `${ source[ 0 ][ 0 ].imports[ line ] }`
            
            
            for ( const index in source[ 1 ] ) {
                
                for ( const func in source[ 1 ][ index ] )
                    
                    data += `\n${ source[ 1 ][ index ][ func ].toLocaleString() }`
            }
            resolve( import( data ) )
        } )
    },
} )
