"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./utils");
var Sequence;
(function (Sequence) {
    function equal(seq1, seq2) {
        return seq1.length === seq2.length && seq1.every((item, idx) => item === seq2[idx]);
    }
    Sequence.equal = equal;
})(Sequence || (Sequence = {}));
var Utils;
(function (Utils) {
    function format(template, vars) {
        return template.replace(/%(\w+)/g, (_, name) => vars[name]);
    }
    Utils.format = format;
})(Utils || (Utils = {}));
class Passport {
    func;
    args;
    constructor(func, args) {
        this.func = func;
        this.args = args;
    }
    static init(fn) {
        return new Passport(fn, []);
    }
    static extend(fn, argArray) {
        return new Passport(fn.passport.func, fn.passport.args.concat(argArray));
    }
    static eqaul({ func: func1, args: args1 }, { func: func2, args: args2 }) {
        return func1 === func2 && Sequence.equal(args1, args2);
    }
    static repr(passport) {
        return f `%{%}(%)`(passport.func.name, hash(passport.func.toString()), passport.args.join());
    }
    static issueTo(func, args) {
        function wrapper(...args) {
            const output = func(...args);
            if (output instanceof Function)
                return Passport.issueTo(output, args);
            else
                return output;
        }
        if (args && Passport.isIssued(func))
            wrapper.passport = Passport.extend(func, args);
        else
            wrapper.passport = Passport.init(func);
        return wrapper;
    }
    static isIssued(func) {
        return func.passport instanceof Passport;
    }
}
const where = propName => expectation => item => item instanceof Object &&
    (expectation == item[propName] ||
        (expectation instanceof Function && expectation(item[propName])));
const res = Utils.format('%name{%code}(%args)', {
    name: 'heeelo',
    code: '124asa24',
    args: [14, 'asd', {}].join()
});
console.log(res);
