console.time( 'assertions finished ' )
import { EventEmitter } from 'events'
import { function_ } from 'oftypes'
import { deepEqual, ok } from 'assert/strict'
import { module_, package_ } from '../index.js'

const AssertionEvent = new EventEmitter()

AssertionEvent.on( 'end', () => {
    console.timeEnd( 'assertions finished ' )
} )

const Assertions = {

    assertion0 : async () => {

        console.log( '__________________________________________________________________________' )

        console.log( ' \x1b[31m Assertion number', 0, '\x1b[0m' )
        console.log( '\x1b[31m import module from dnpm.io', '\x1b[0m' )
    
        const { source, signature } = await package_( { path:'../sources/callme.package.js', remote: false } )
        // - const { source, signature } = await dymport.remote_( undefined, 'call-me' )
        
        console.log(await module_(source, signature))
        
        //console.trace(source, signature)
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
