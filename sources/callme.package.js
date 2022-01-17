import { readFile } from 'fs/promises'

export const signature = {
    name: '',
    version: '',
    license: '',
    author: '',
    remote: false,
    local: true,
    script: [ 'text/javascript' ],
    loaders: [ 'javascript' ],
}

export const source = {
    
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


