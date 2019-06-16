/**
 * Simple color manipulation functions.
 * Compatible for both Node.js and browser apps.
 * @module color-prism
 */
var ColorPrism;

(function () {
    /**
     * Convert degrees to radian
     * @param  {number} degrees 
     * @return {number}
     */
    var degreesToRad = function (degrees) {
        return degrees * (Math.PI / 180);
    }

    var _60dRad = degreesToRad(60);
    var _120dRad = degreesToRad(120);
    var _180dRad = degreesToRad(180);
    var _240dRad = degreesToRad(240);
    var _300dRad = degreesToRad(300);


    /**
     * RGB class for storing color values
     * @param  {number} r red value (0..255) or {RGB} instance or {CMYK} instance
     * @param  {number} g green value (0..255)
     * @param  {number} b blue value (0..255)
     * @return {RGB}
     */
    var RGB = function (r, g, b) {
        if (r instanceof CMYK) {
            var object = cmykToRgb(r);
            r = object.r || 0;
            g = object.g || 0;
            b = object.b || 0;
        } else if (r instanceof RGB || typeof r === 'object') {
            var object = r;
            r = object.r || 0;
            g = object.g || 0;
            b = object.b || 0;
        }
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /**
     * Change the range from `0 to 255` to `0 to 1`
     * @return {RGB}
     */
    RGB.prototype.normalize = function () {
        return rgb(
            this.r / 255,
            this.g / 255,
            this.b / 255
        );
    }

    /**
     * RGB helper function
     * @param  {number} r red value (0..255) or {RGB} instance
     * @param  {number} g green value (0..255)
     * @param  {number} b blue value (0..255)
     * @return {RGB}
     */
    var rgb = function (r, g, b) {
        return new RGB(r, g, b);
    }

    /**
     * HSL class for storing color values
     * @param  {number} h hue value (0..2PI) or {HSL} instance
     * @param  {number} s saturation value (0..1)
     * @param  {number} l lighting value (0..1)
     * @return {HSL}
     */
    var HSL = function (h, s, l) {
        if (h instanceof HSL || typeof h === 'object') {
            var object = h;
            h = object.h || 0;
            s = object.s || 0;
            l = object.l || 0;
        }
        this.h = h;
        this.s = s;
        this.l = l;
    }

    /**
     * HSL helper function
     * @param  {number} h hue value (0..2PI) or {HSL} instance
     * @param  {number} s saturation value (0..1)
     * @param  {number} l lighting value (0..1)
     * @return {HSL}
     */
    var hsl = function (h, s, l) {
        return new HSL(h, s, l);
    }

    /**
     * CMYK class for storing color values
     * @param  {number} c cyan value (0..1) or {CMYK} instance or {RGB} instance
     * @param  {number} m magenta value (0..1)
     * @param  {number} y yellow value (0..1)
     * @param  {number} k black key value (0..1)
     * @return {CMYK}
     */
    var CMYK = function (c, m, y, k) {
        if (c instanceof RGB) {
            var object = rgbToCmyk(c);
            c = object.c || 0;
            m = object.m || 0;
            y = object.y || 0;
            k = object.k || 0;
        } else if (c instanceof CMYK || typeof c === 'object') {
            var object = c;
            c = object.c || 0;
            m = object.m || 0;
            y = object.y || 0;
            k = object.k || 0;
        }
        this.c = c;
        this.m = m;
        this.y = y;
        this.k = k;
    }

    /**
     * CMYK helper function
     * @param  {number} c cyan value (0..1) or {CMYK} instance or {RGB} instance
     * @param  {number} m magenta value (0..1)
     * @param  {number} y yellow value (0..1)
     * @param  {number} k black key value (0..1)
     * @return {CMYK}
     */
    var cmyk = function (c, m, y, k) {
        return new CMYK(c, m, y, k);
    }

    /**
     * Method to convert RGB to HSL
     * @param  {number} r red value (0..255) or {RGB} instance
     * @param  {number} g green value (0..255)
     * @param  {number} b blue value (0..255)
     * @return {HSL}
     */
    var rgbToHsl = function (r, g, b) {
        var h;
        var s;
        var l;

        var rgbColor = rgb(r, g, b).normalize();

        // Calculate delta
        var cMax = Math.max(rgbColor.r, rgbColor.g, rgbColor.b);
        var cMin = Math.min(rgbColor.r, rgbColor.g, rgbColor.b);
        var delta = cMax - cMin;

        l = (cMax + cMin) / 2;

        if (delta === 0) {
            h = 0;
        } else if (cMax === rgbColor.r) {
            h = _60dRad * (((rgbColor.g - rgbColor.b) / delta) % 6);
        } else if (cMax === rgbColor.g) {
            h = _60dRad * ((rgbColor.b - rgbColor.r) / delta + 2);
        } else if (cMax === rgbColor.b) {
            h = _60dRad * ((rgbColor.r - rgbColor.g) / delta + 4);
        }

        if (delta === 0) {
            s = 0;
        } else {
            s = delta / (1 - Math.abs(2 * l - 1));
        }

        return hsl(h, s, l);
    }

    /**
     * Method to convert HSL to RGB
     * @param  {number} h hue value (0..2PI) or {HSL} instance
     * @param  {number} s saturation value (0..255)
     * @param  {number} l lighting value (0..255)
     * @return {RGB}
     */
    var hslToRgb = function (h, s, l) {
        var r;
        var g;
        var b;

        var hslColor = hsl(h, s, l);

        var c = (1 - Math.abs(2 * hslColor.l - 1)) * hslColor.s;
        var x = c * (1 - Math.abs( ( (hslColor.h / _60dRad) % 2 ) - 1));
        var m = hslColor.l - c / 2;

        if (0 <= hslColor.h && hslColor.h <= _60dRad) {
            r = c; g = x; b = 0;
        } else if (_60dRad <= hslColor.h && hslColor.h <= _120dRad) {
            r = x; g = c; b = 0;
        } else if (_120dRad <= hslColor.h && hslColor.h <= _180dRad) {
            r = 0; g = c; b = x;
        } else if (_180dRad <= hslColor.h && hslColor.h <= _240dRad) {
            r = 0; g = x; b = c;
        } else if (_240dRad <= hslColor.h && hslColor.h <= _300dRad) {
            r = x; g = 0; b = c;
            // } else if (_300dRad <= hslColor.h) {
        } else {
            r = c; g = 0; b = x;
        }

        return rgb({
            r: (r + m) * 255,
            g: (g + m) * 255,
            b: (b + m) * 255
        });
    }

    /**
     * Method to convert RGB to CMYK
     * @param  {number} r red value (0..255) or {RGB} instance
     * @param  {number} g green value (0..255)
     * @param  {number} b blue value (0..255)
     * @return {CMYK}
     */
    var rgbToCmyk = function (r, g, b) {
        var rgbColor = rgb(r, g, b).normalize();

        var k = 1 - Math.max(rgbColor.r, rgbColor.b, rgbColor.g);
        var _k = 1 - k;

        var c = (1 - rgbColor.r - k) / _k;
        var m = (1 - rgbColor.g - k) / _k;
        var y = (1 - rgbColor.b - k) / _k;

        return cmyk(c, m, y, k);
    }

    /**
     * Method to convert CMYK to RGB
     * @param  {number} c cyan value (0..1) or {CMYK} instance
     * @param  {number} m magenta value (0..1)
     * @param  {number} y yellow value (0..1)
     * @param  {number} k black key value (0..1)
     * @return {RGB}
     */
    var cmykToRgb = function (c, m, y, k) {
        var cmykColor = cmyk(c, m, y, k);
        var _k = 1 - cmykColor.k;

        var r = 255 * (1 - cmykColor.c) * _k;
        var g = 255 * (1 - cmykColor.m) * _k;
        var b = 255 * (1 - cmykColor.y) * _k;

        return rgb(r, g, b);
    }

    /**
     * Change the hue value of a RGB color
     * @param  {number} h hue value (0..2PI)
     * @param  {number} r red value (0..255) or {RGB} instance
     * @param  {number} g green value (0..255)
     * @param  {number} b blue value (0..255)
     * @return {RGB}
     */
    var hue = function (h, r, g, b) {
        var hslColor = rgbToHsl(r, g, b);
        hslColor.h = h;
        return hslToRgb(hslColor);
    };

    /**
     * Change the saturation value of a RGB color
     * @param  {any} s saturation value (0..1)
     * @param  {number} r red value (0..255) or {RGB} instance
     * @param  {number} g green value (0..255)
     * @param  {number} b blue value (0..255)
     * @return {RGB}
     */
    var saturation = function (s, r, g, b) {
        var hslColor = rgbToHsl(r, g, b);
        hslColor.s = s;
        return hslToRgb(hslColor);
    };

    /**
     * Change the lighting value of a RGB color
     * @param  {any} l lighting value (0..1)
     * @param  {number} r red value (0..255) or {RGB} instance
     * @param  {number} g green value (0..255)
     * @param  {number} b blue value (0..255)
     * @return {RGB}
     */
    var lighting = function (l, r, g, b) {
        var hslColor = rgbToHsl(r, g, b);
        hslColor.l = l;
        return hslToRgb(hslColor);
    };

    /**
     * 
     * Change the cyan tone of a RGB color
     * @param  {any} c lighting value (0..1)
     * @param  {number} r red value (0..255) or {RGB} instance
     * @param  {number} g green value (0..255)
     * @param  {number} b blue value (0..255)
     * @return {RGB}
     */
    var cyan = function (c, r, g, b) {
        var cmykColor = rgbToCmyk(r, g, b);
        cmykColor.c = c;
        return cmykToRgb(cmykColor);
    }

    /**
     * 
     * Change the magenta tone of a RGB color
     * @param  {any} m lighting value (0..1)
     * @param  {number} r red value (0..255) or {RGB} instance
     * @param  {number} g green value (0..255)
     * @param  {number} b blue value (0..255)
     * @return {RGB}
     */
    var magenta = function (m, r, g, b) {
        var cmykColor = rgbToCmyk(r, g, b);
        cmykColor.m = m;
        return cmykToRgb(cmykColor);
    }

    /**
     * 
     * Change the yellow tone of a RGB color
     * @param  {any} y lighting value (0..1)
     * @param  {number} r red value (0..255) or {RGB} instance
     * @param  {number} g green value (0..255)
     * @param  {number} b blue value (0..255)
     * @return {RGB}
     */
    var yellow = function (y, r, g, b) {
        var cmykColor = rgbToCmyk(r, g, b);
        cmykColor.y = y;
        return cmykToRgb(cmykColor);
    }

    ColorPrism = {
        degreesToRad: degreesToRad,
        RGB: RGB,
        rgb: rgb,
        HSL: HSL,
        hsl: hsl,
        CMYK: CMYK,
        cmyk: cmyk,
        rgbToHsl: rgbToHsl,
        hslToRgb: hslToRgb,
        rgbToCmyk: rgbToCmyk,
        cmykToRgb: cmykToRgb,
        hue: hue,
        saturation: saturation,
        lighting: lighting,
        cyan: cyan,
        magenta: magenta,
        yellow: yellow,
        constants: {
            d60Rad: _60dRad,
            d120Rad: _120dRad,
            d180Rad: _180dRad,
            d240Rad: _240dRad,
            d300Rad: _300dRad,
            d360Rad: degreesToRad(360)
        },
    };
})();

if (module && module.exports) {
    module.exports = ColorPrism;
} else if (window && !window.ColorPrism) {
    window.ColorPrism = ColorPrism;
    
    var degreesToRad = degreesToRad;
    var RGB = RGB;
    var rgb = rgb;
    var HSL = HSL;
    var hsl = hsl;
    var CMYK = CMYK;
    var cmyk = cmyk;
    var rgbToHsl = rgbToHsl;
    var hslToRgb = hslToRgb;
    var rgbToCmyk = rgbToCmyk;
    var cmykToRgb = cmykToRgb;
    var hue = hue;
    var saturation = saturation;
    var lighting = lighting;
    var cyan = cyan;
    var magenta = magenta;
    var yellow = yellow;
}
