/**
 * G711U(u-law) - PCM converter
 */
 
 const SIGN_BIT = 0x80;
 const QUANT_MASK = 0x0f;
 const SEG_SHIFT = 0x04;
 const SEG_MASK = 0x70;
 
 // const seg_end = new Uint16Array([0x1F, 0x3F, 0x7F, 0xFF, 0x1FF, 0x3FF, 0x7FF, 0xFFF]);
 const seg_end = new Uint16Array([0xFF, 0x1FF, 0x3FF, 0x7FF, 0xFFF, 0x1FFF, 0x3FFF, 0x7FFF]);
 // const seg_uend = new Uint16Array([0x3F, 0x7F, 0xFF, 0x1FF, 0x3FF, 0x7FF, 0xFFF, 0x1FFF]);
 

 
 function search(val, table, size) {
     for (let i = 0; i < size; i++) {
         if (val <= table[i]) return i;
     }
     return size;
 }
 
 
 /**
  * 
  * @param {Int16Array} data 
  * @returns 
  */
  function linear2alaw(pcm_val)    /* 2's complement (16-bit range) */ {
    let mask;
    let seg;
    let aval;

    if (pcm_val >= 0) {
        mask = 0xD5;        /* sign (7th) bit = 1 */
    } else {
        mask = 0x55;        /* sign bit = 0 */
        pcm_val = -pcm_val - 8;
    }

    /* Convert the scaled magnitude to segment number. */
    seg = search(pcm_val, seg_end, 8);

    /* Combine the sign, segment, and quantization bits. */

    if (seg >= 8)       /* out of range, return maximum value. */
        return (0x7F ^ mask);
    else {
        aval = seg << SEG_SHIFT;
        if (seg < 2)
            aval |= (pcm_val >> 4) & QUANT_MASK;
        else
            aval |= (pcm_val >> (seg + 3)) & QUANT_MASK;
        return (aval ^ mask);
    }
}


/**
 * 
 * @param data 
 * @returns 
 */
export function alawFromPCM(data:Int16Array | Int8Array): Uint8Array {
    let dest = new Uint8Array(data.length);
    for (let i = 0, k = 0; i < data.length; i++) {
        dest[k++] = linear2alaw(data[i])
    }
    return dest;
}

function alaw2linear(a_val:number) {
    let t;
    let seg;

    a_val ^= 0x55;

    t = (a_val & QUANT_MASK) << 4;
    seg = (a_val & SEG_MASK) >> SEG_SHIFT;
    switch (seg) {
        case 0:
            t += 8;
            break;
        case 1:
            t += 0x108;
            break;
        default:
            t += 0x108;
            t <<= seg - 1;
    }
    return ((a_val & SIGN_BIT) ? t : -t);
}

/**
 * Convert an A-law value to linear PCM
 * @param data 
 * @param bit 
 * @returns 
 */
export function alawToPCM(data:Uint8Array, bit = 16): Int8Array | Int16Array {
    let typedArray = bit === 16 ? Int16Array : Int8Array
    let dest = new typedArray(data.length);
    for (let i = 0, k = 0, len = data.length; i < len; i++) {
        dest[k++] = alaw2linear(data[i] & 0xff)
    }
    return dest;
}