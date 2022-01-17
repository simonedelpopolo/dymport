import * as Module from 'module'
import { constants } from 'fs'
import { request } from 'https'
import { resolve } from 'path'
import { access, readFile, writeFile } from 'fs/promises'
import { array_, boolean_, function_, object_, string_, undefined_ } from 'oftypes'
import { AssertionError, deepStrictEqual, ok } from 'assert'

const dymport = Object.create( Module )
export default dymport

/**
 * The source implementation, definition.
 *
 * @type {{imports: string[], functions: [{export: string, function: (function(*): *)}]}}
 */
const sourc = {

    /**
     * The first entry (`source.imports`) of the module is set to an array of entries for every import required by the module.
     */
    imports: [
        'import {readFile} from \'fs/promises\';',
    ],

    /**
     * The second entry (`source.functions`) of the module is set to an array.
     * Each entry of the array is a function.
     */
    functions:

    /**
     * Enclose every function into an array.
     */
        [
            {

                // First entry is for the type of the export (source.function[0].export)
                export: 'export default',

                // Second entry of the function is an array of a self executing function (source.function[].function)
                function: ( async function callMe( message ) {

                    console.log( message )

                    return readFile( './index.js' )
                        .then( buffer => buffer )
                        .catch( error => error )

                } ),
            },
        ],
}

/**
 * The signature implementation, definition.
 *
 * @type {{name:string, version:string, license: string, author: { name: string, email: string, gpg: string,},
 * git: string, website: string, script: string[]}}
 */
const signs = {

    // The package name. For dnpm.io this is required
    name: '',

    // The package version. For dnpm.io this is required
    version: '',

    // The license. For dnpm.io this is required
    license: '',

    // The author. For dnpm.io these are all required
    author: {
        name: '',
        email: '',
        gpg: '',
    },

    // The repository on git-hub. For dnpm.io this is required
    git: '',

    // The website, if any. For dnpm.io this is required
    website: '',

    // The type of data is a required field
    script: [
        'application/json',
        'text/javascript',
        'application/wasm',
    ],
}


// A todo refactoring for this class
const __methods = {

    /**
     * It handles the type checking from the function types. If that fails, it rejects with the relative type checking error.
     *
     * @param {string} rejection - The message regarding the rejected type.
     * @returns {Promise | PromiseRejectedResult<string>}
     */
    typeError: function argument( rejection ) {

        return new Promise( ( resolve, reject ) => {
            reject( rejection )
        } )
    },

    /**
     * It checks the types of both arguments source and signature.
     *
     * @param {any} source - The given source argument.
     * @param {any} signature - The given signature argument.
     * @returns {string|boolean}
     */
    types: async function types( source, signature ) {

        // The source argument must be an object
        const source_resolvers = {
            true: true,
            false: `only object is an accepted argument for source. Given type: ${ typeof source }`,
        }

        const sourceChecker = await object_( source, source_resolvers )
        if ( sourceChecker !== true )
            return sourceChecker

        //___________________________________________________________

        // It makes sure that signature argument is an array. Built-in 'typeof' returns object in case of array and null.
        const signatureArray = await array_( signature ) === true ? 'array' : typeof signature
        const signature_resolvers = {
            true: true,
            false: `only object is an accepted argument for signature. Given type: ${ signatureArray }`,
        }

        const signatureChecker = await object_( signature, signature_resolvers )
        if ( signatureChecker !== true )
            return signatureChecker

        //___________________________________________________________

        // If everything is good returns true
        return true
    },

    /**
     * Checks that the argument are well-formed based on the argument signature of the function module_.
     *
     * @param {any} source - .
     * @param {any} signature - .
     * @returns {string|boolean}
     */
    references: async function references( source, signature ) {

        // It checks the references for the source argument
        const sourceCheck = await this.sourceTypes( source )
        if ( sourceCheck !== true )
            return sourceCheck


        /*// It checks the references for the signature argument
        const signatureCheck = await this.signature_types( signature )
        if ( signatureCheck !== true )
            return signature


        this.signature = signature
        this.source = source

        return true*/
    },

    /**
     * It checks the given types for the source argument.
     *
     * @param {{imports: string[], functions: [{export: string, function: (function(*): *)}]}} source - The given source argument.
     * @returns {Promise<boolean|string>}
     */
    sourceTypes: async function sourceTypes( source ) {

        // It checks that source object keys length is equal 2
        // It checks that imports and functions properties are set in the source object
        try {
            ok( Object.keys( source ).length === 2, 'the module object mismatch of length.' )
            ok( await undefined_( source.imports ) === false, 'the module object imports property must be set.' )
            ok( await undefined_( source.functions ) === false, 'the module object functions property must be set.' )
        }catch( error ){
            return error.message
        }

        // Destructuring
        const { imports, functions } = source

        // Types check for the 'imports' property__________________________________________________________________________

        try {
            // The 'imports' property value must be an array
            ok( await array_( imports ) === true, 'the entry of the module imports property must be an array' )
            for ( const line in imports )
                ok( await string_( imports[ line ] ) === true, 'every entry of the imports array must be string' )
        } catch ( error ) {
            return error.message
        }

        // Types check for the 'functions' property__________________________________________________________________________
        let counter = 0

        for ( const index in functions ) {

            for ( const expo in functions[ index ] ) {
                if ( counter + parseInt( expo ) % 2 === 0 ) {
                    try {
                        ok( await string_( functions[ index ][ expo ][ 0 ] ) === true, 'first entry of the function array must be oftype string' )
                    } catch ( error ) {
                        return error
                    }
                } else {
                    try {
                        ok( await function_( functions[ index ][ expo ][ 0 ] ) === true, 'second entry of the function array must be oftype function' )
                    } catch ( error ) {
                        return error
                    }
                }
            }
        }

        return true
    },


    /**
     *
     * @param {[[{imports:string[]},[string[],function]]]} source
     * @returns {Promise<boolean|*>}
     */
    source_types: async function source_types( source ) {

        const [ imports, functions ] = source

        let check = await okPromise( source.length === 2, 'the module array mismatch of length' )
            .catch( error => error )
        if( check instanceof AssertionError )
            return check.message

        try {
            ok( await object_( imports[ 0 ] ) === true, 'the entry of the module must be an object with property name imports' )
        } catch ( error ) {
            return error
        }

        for ( const line in imports[ 0 ].imports ) {
            try {
                ok( await string_( imports[ 0 ].imports[ line ] ) === true, 'every entry of the imports array must be string' )
            } catch ( error ) {
                return error
            }
        }

        let counter = 0

        for ( const index in functions ) {

            for ( const expo in functions[ index ] ) {
                if ( counter + parseInt( expo ) % 2 === 0 ) {
                    try {
                        ok( await string_( functions[ index ][ expo ][ 0 ] ) === true, 'first entry of the function array must be oftype string' )
                    } catch ( error ) {
                        return error
                    }
                } else {
                    try {
                        ok( await function_( functions[ index ][ expo ][ 0 ] ) === true, 'second entry of the function array must be oftype function' )
                    } catch ( error ) {
                        return error
                    }
                }
            }
        }

        return true
    },

    signature_types: async function signature_types( signature ) {

        /**
         * Using destructuring.
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
         */
        const [ signatureKeys, signatureRequiredKeys ] = [
            Object.keys( signature ),
            Object.keys( this.signature ),
        ]

        // First step it checks if the Object.keys are the same in number and property name
        try {
            deepStrictEqual( signatureKeys, signatureRequiredKeys, 'The signature provided failed the reference check' )
        } catch ( error ) {
            return error
        }

        // Second step it checks every property to be set to the right type
        for ( const type in signature ) {

            switch ( type ) {

                case 'name': {

                    const resolvers = {
                        true: true,
                        false: `${ type } type must be oftype string. Given type ${ typeof signature[ type ] }`,
                    }

                    const typeCheck = await string_( signature[ type ], resolvers )
                    if ( typeCheck !== true )
                        return typeCheck


                    break
                }

                case 'version': {

                    const resolvers = {
                        true: true,
                        false: `${ type } type must be oftype string. Given type ${ typeof signature[ type ] }`,
                    }

                    const typeCheck = await string_( signature[ type ], resolvers )
                    if ( typeCheck !== true )
                        return typeCheck


                    break
                }

                case 'license': {

                    const resolvers = {
                        true: true,
                        false: `${ type } type must be oftype string. Given type ${ typeof signature[ type ] }`,
                    }

                    const typeCheck = await string_( signature[ type ], resolvers )
                    if ( typeCheck !== true )
                        return typeCheck


                    break
                }

                case 'author': {

                    const resolvers = {
                        true: true,
                        false: `${ type } type must be oftype object. Given type ${ typeof signature[ type ] }`,
                    }

                    const typeCheck = await object_( signature[ type ], resolvers )
                    if ( typeCheck !== true )
                        return typeCheck


                    break
                }

                case 'git': {

                    const resolvers = {
                        true: true,
                        false: `${ type } type must be oftype string. Given type ${ typeof signature[ type ] }`,
                    }

                    const typeCheck = await string_( signature[ type ], resolvers )
                    if ( typeCheck !== true )
                        return typeCheck


                    break
                }

                case 'website': {

                    const resolvers = {
                        true: true,
                        false: `${ type } type must be oftype string. Given type ${ typeof signature[ type ] }`,
                    }

                    const typeCheck = await string_( signature[ type ], resolvers )
                    if ( typeCheck !== true )
                        return typeCheck


                    break
                }

                case 'script': {

                    const resolvers = {
                        true: true,
                        false: `${ type } type must be oftype array. Given type ${ typeof signature[ type ] }`,
                    }

                    const typeCheck = await array_( signature[ type ], resolvers )
                    if ( typeCheck !== true )
                        return typeCheck


                    break
                }

                default: {
                    return 'UEO: error not recognized!'
                }
            }
        }

        // Third step it checks the script to be one of the three defined in this.signature.script[] field
        const script = signature.script.includes( this.signature.script[ 0 ] )
                       || signature.script.includes( this.signature.script[ 1 ] )
                       || signature.script.includes( this.signature.script[ 2 ] )

        if ( script !== true ) {
            let scriptError = ''
            for ( const index in this.signature.script )
                scriptError += `| ${ this.signature.script[ index ] } |`



            return ` 'script' not set properly:
            Given signatures for 'script': \x1b[31m${ signature.script }\x1b[0m
            Expected signatures to be one and only from these: \x1b[32m${ scriptError }\x1b[0m`
        }

        return true
    },

    remote_options: {
        host: 'dnpm.io',
        port: 443,
        method: 'post',
        path: null,
    },

    source: {

        /**
         * The first entry (`source.imports`) of the module is set to an array of entries for every import required by the module.
         */
        imports: [
            '',
        ],

        /**
         * The second entry (`source.functions`) of the module is set to an array.
         * Each entry of the array is a function.
         */
        functions:

        /**
         * Enclose every function into an array.
         */
            [
                {
                    // First entry is for the type of the export (source.function[0].export)
                    export: '',

                    // Second entry of the function is an array of a self executing function (source.function[].function)
                    function: ( () => {} ),
                },
            ],
    },

    signature: {

        // The package name. For dnpm.io this is required
        name: '',

        // The package version. For dnpm.io this is required
        version: '',

        // The license. For dnpm.io this is required
        license: '',

        // The author. For dnpm.io these are all required
        author: {
            name: '',
            email: '',
            gpg: '',
        },

        // The repository on git-hub. For dnpm.io this is required
        git: '',

        // The website, if any. For dnpm.io this is required
        website: '',

        // The type of data is a required field
        script: [
            'application/json',
            'text/javascript',
            'application/wasm',
        ],
    },

    queue: false,

    fulfilled: function fulfilled( x, y, z ) {
        return x === true ? [
            y,
            z,
        ] : y
    },

    /*Events: {
        emitter: ()=>{
            return new EventEmitter()
        },
        active: false,
        pushed: this.emitter().emit( 'pushed' ),
        loaded: this.emitter().emit( 'loaded' ),
        queued: [],
    },*/
}

Object.defineProperty( dymport, 'module_', {
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
    value: async function module_( source, signature, queue = false ) {

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

Object.defineProperty( dymport, 'package_', {
    enumerable: true,
    writable: false,
    configurable: false,
    /**
     * Loads the package.
     *
     * @param {{path:string,remote:boolean}} location - An object where to define the path and if it is a remote package.
     * @returns {Promise<[{source:[string, any,{name:string,version:number,license:string,author:string,npmjs:string}], signature:{name: string, version: string, license: string, author: string, remote: false, local: true, script: ['application/json','text/javascript'], loaders: [ 'json', 'javascript' ],}}]>|TypeError}
     */
    value: async function package_( location ) {

        const resolvers = {
            true: true,
            false: 'Only type of object is accepted for the argument \'location\'',
        }
        const locationChecker = await object_( location, resolvers )
        if ( locationChecker !== true )
            return __methods.typeError( locationChecker )


        if ( await undefined_( location.path ) === true && await undefined_( location.remote ) )
            return __methods.typeError( `the location object failed the signature. Given location -> ${ location }` )


        let data
        switch ( location.remote ) {
            case false:
                data = await dymport.local_( location.path )
                break
            case true:
                break
            default:
                break
        }
        const module = await import( data )

        return [
            module.source,
            module.signature,
        ]
    },
} )

/**
 * @private
 */
Object.defineProperty( dymport, 'remote_', {
    enumerable: true,
    writable: false,
    configurable: false,
    /**
     * Loads the package from remote.
     *
     * @param {{host: string, port:number, method:string, path:string}=} location - .
     * @param {string} pack - .
     * @returns {Promise<Buffer>|TypeError}
     */
    value: async function remote_( location, pack ) {

        const resolversLocation = {
            true: ( () => {
                __methods.remote_options.path = `/${ pack }`

                return __methods.remote_options
            } ),
            false: ( () => {
                return {
                    host: location.host,
                    port: location.port,
                    method: location.method,
                    path: location.path,
                }
            } ),
        }

        const populateOptions = await undefined_( location, resolversLocation )
        const options = populateOptions()

        return new Promise( ( resolve ) => {

            let module
            const getPackage = request( options, ( res ) => {

                res.on( 'data', async ( d ) => {
                    let data = JSON.parse( d.toString() )
                    module = Buffer.from( data.package, 'base64' )
                        .toString( 'utf-8' )

                    await writeFile( '../callme.package.js', module, { flag: 'w' } )
                    resolve( await import( './callme.package.js' ) )
                } )
            } )

            getPackage.end()
        } )
    },
} )

/**
 * @private
 */
Object.defineProperty( dymport, 'local_', {
    enumerable: true,
    writable: false,
    configurable: false,
    /**
     * Loads the package from local.
     *
     * @param {string} path - A string defining the path to the package.
     * @returns {Promise<Buffer>|TypeError}
     */
    value: async function local_( path ) {

        const resolvers = {
            true: true,
            false: 'Only type of string are accepted for the argument \'path\'',
        }

        const pathChecker = await string_( path, resolvers )
        if ( pathChecker !== true )
            return __methods.typeError( pathChecker )


        await access( path, constants.R_OK | constants.F_OK )
            .catch( error => __methods.typeError( error ) )

        return resolve( process.cwd(), path )
    },
} )

/**
 * The module_ function dynamic importer.
 *
 * @param {[string, any,{name:string,version:number,license:string,author:string,npmjs:string}]} source - .
 * @param {{name: string, version: string, license: string, author: string, remote: false, local: true, script: ['application/json','text/javascript'], loaders: [ 'json', 'javascript' ],}} signature
 *        - .
 * @param {boolean} queue - It tells to the function that it will be a multiple files to be loaded as module.
 *                          This will activate the event emitter and dispatch the modules when ready.
 * @returns {Promise | PromiseFulfilledResult<Module> | PromiseRejectedResult<TypeError, ReferenceError>}
 */
export function module_( source, signature, queue = true ) {

    return dymport.module_( source, signature, queue )
}

/**
 * Loads the package.
 *
 * @param {{path:string,remote:boolean}} location - The path (relative or absolute) or the URL that points to the package.
 * @returns {Promise<[{source:[string, any,{name:string,version:number,license:string,author:string,npmjs:string}],
 * signature:{name: string, version: string, license: string, author: string, remote: false, local: true, script: ['application/json','text/javascript'], loaders: [ 'json', 'javascript' ],}}]>|TypeError}
 */
export function package_( location ) {

    return dymport.package_( location )
}

/**
 * Freeze the Object.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
Object.freeze( dymport )


const { source, signature } = await dymport.remote_( undefined, 'call-me' )

console.log( await module_( source, signature ) )
