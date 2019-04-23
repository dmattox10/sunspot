const axios = require('axios')

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
        const config = {
            method: 'get',
            url: image,
            responseType: 'blob',
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)' }
        }
        try {
            let response = await axios(config)
            let contents = Buffer.from(response.data).toString('base64')
            return `data:${response.headers['content-type'].toLowerCase()};base64,${contents}`
            
        }
        catch (error) {
            console.log(error)
        }
    }
    