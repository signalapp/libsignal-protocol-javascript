/* vim: ts=4:sw=4 */

'use strict';
describe('util', function() {
    describe("isEqual", function(){
        it('returns false when a or b is undefined', function(){
            assert.isFalse(util.isEqual("defined value", undefined));
            assert.isFalse(util.isEqual(undefined, "defined value"));
        });
        it('returns true when a and b are equal', function(){
            var a = "same value";
            var b = "same value";
            assert.isTrue(util.isEqual(a, b));
        });
        it('returns false when a and b are not equal', function(){
            var a = "same value";
            var b = "diferent value";
            assert.isFalse(util.isEqual(a, b));
        });
        it('throws an error when a/b compare is too short', function(){
            var a = "1234";
            var b = "1234";
            assert.throw(function() { util.isEqual(a, b) },
                        Error, /a\/b compare too short/);
        });
    });
});
