console.time( 'assertions finished ' )
import { EventEmitter } from 'events'
import { function_ } from 'oftypes'
import { deepEqual, ok } from 'assert/strict'
import dymport, { module_, package_ } from '../index.js'

const AssertionEvent = new EventEmitter()

AssertionEvent.on( 'end', () => {
    console.timeEnd( 'assertions finished ' )
} )

const Assertions = {

    assertion0 : async () => {

        console.log( '__________________________________________________________________________' )

        console.log( ' \x1b[31m Assertion number', 0, '\x1b[0m' )
        console.log( '\x1b[31m import module from dnpm.io', '\x1b[0m' )

        //Await package_( { path:'../sources/callMe.js', remote: false } )
        const { source, signature } = await dymport.remote_( undefined, 'call-me' )
        
        const moduleImported = await module_( source, signature )

        ok( moduleImported[ Symbol.toStringTag ] === 'Module' )

        ok( await function_( moduleImported.default ) === true )

        ok( await function_( moduleImported.callMeThen ) === true )

        console.log( '---------------------------------------------------------------------------' )

        console.log( 'a module has been successfully imported dynamically!' )
        console.log( moduleImported )

        console.log( '__________________________________________________________________________' )

        console.log( 'the default export of the module is oftype `Function`!' )
        console.log( moduleImported.default )
        console.log( `the name of the default function is ${moduleImported.default.name}` )
        console.log( `typeof Function is -> ${moduleImported.default[ Symbol.toStringTag ]}` )
        console.log( `it has ${moduleImported.default.length} arguments` )
        console.log( `source code -> ${moduleImported.default.toLocaleString()}`
            .replaceAll( '                    ', '' )
            .replaceAll( '  ', '' )
        )


        console.log( '__________________________________________________________________________' )

        console.log( 'the default export of the module is oftype `Function`!' )
        console.log( moduleImported.callMeThen )
        console.log( `the name of the exported function is ${moduleImported.callMeThen.name}` )
        console.log( 'typeof Function is -> Function' )
        console.log( `it has ${moduleImported.callMeThen.length} arguments` )
        console.log( `source code -> ${moduleImported.callMeThen.toLocaleString()}`
            .replaceAll( '                    ', '' )
            .replaceAll( '  ', '' )
        )


        console.log( '__________________________________________________________________________' )

    },
}

process.argv.splice( 0, 2 )

if(  process.argv.length > 0 ){

    await Assertions[ process.argv ]()
    AssertionEvent.emit( 'end' )

}else {

    for( const assertion in Assertions )
        await Assertions[ assertion ]()

    AssertionEvent.emit( 'end' )
}

/*
import { module_ } from '../index.js'

test( 'checks argument source to be array', () => {
    
    return expect( module_( {}, {} ) )
        .rejects
        .toThrow( TypeError( 'only array is an accepted argument for source. Given type: object' ) )
} )

test( 'checks argument options to be object', () => {
    
    return expect( module_( [], [] ) )
        .rejects
        .toThrow( TypeError( 'only object is an accepted argument for signature. Given type: array' ) )
} )

test( 'checks the reference of signature argument', () => {
    
    return expect( module_( [], {} ) )
        .rejects
        .toThrow( ReferenceError( 'The signature provided failed the reference check' ) )
} )
*/