const mongoose = require('mongoose')
const Axios = require('axios')

    exports.sizeOf = ( object ) => {

        var objectList = [];
        var stack = [ object ];
        var bytes = 0;
    
        while ( stack.length ) {
            var value = stack.pop();
    
            if ( typeof value === 'boolean' ) {
                bytes += 4;
            }
            else if ( typeof value === 'string' ) {
                bytes += value.length * 2;
            }
            else if ( typeof value === 'number' ) {
                bytes += 8;
            }
            else if
            (
                typeof value === 'object'
                && objectList.indexOf( value ) === -1
            )
            {
                objectList.push( value );
    
                for( var i in value ) {
                    stack.push( value[ i ] );
                }
            }
        }
        return bytes;
    }

    exports.encode = (buffer) => {
        let buff = buffer 
        let base64data = buff.toString('base64')
        return base64data
    }

    exports.img = async (image) => {
        image = image.substr(5, image.length - 7)
        try {
            const response = await Axios({
                image,
                method: 'GET',
                responseType: 'stream'
            })
            let base64data = response.data.toString('base64')
            return base64data
        }
        catch (error) {
            console.log(error)
        }
    }