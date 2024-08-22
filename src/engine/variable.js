/**
 * @fileoverview
 * Object representing a Scratch variable.
 */

const uid = require('../util/uid');
const xmlEscape = require('../util/xml-escape');

class Variable {
    /**
     * @param {string} id Id of the variable.
     * @param {string} name Name of the variable.
     * @param {string} type Type of the variable, one of '' or 'list'
     * @param {boolean} isCloud Whether the variable is stored in the cloud.
     * @constructor
     */
    constructor(id, name, type, isCloud, target) {
        this.id = id || uid();
        this.name = name;
        this.type = type;
        this.isCloud = isCloud;
        this.target = target
        // 用于存储实际的 value
        this._value = this.initializeValue(type);
        this.value = this._value
        this.target.returnObject[this.name] = this.value
    }

    // 初始化 value 的方法
    initializeValue(type) {
        switch (type) {
            case Variable.SCALAR_TYPE:
                return 0;
            case Variable.LIST_TYPE:
                return [];
            case Variable.BROADCAST_MESSAGE_TYPE:
                return this.name;
            // case Variable.OBJECT_TYPE:
            //     return {};
            default:
                throw new Error(`Invalid variable type: ${type}`);
        }
    }

    // 定义 getter 和 setter
    get value() {
        return this._value;
    }

    set value(newValue) {
        // if (typeof newValue == "object" && this.type == Variable.SCALAR_TYPE) {
        //     this.type = Variable.OBJECT_TYPE
        // } else if (this.type == Variable.OBJECT_TYPE) {
        //     this.type = Variable.SCALAR_TYPE
        // }
        //console.log(this.target)
        this.target.returnObject[this.name] = newValue
        this._value = newValue;
    }

    toXML(isLocal) {
        isLocal = (isLocal === true);
        const blocklyType = (this.type == Variable.OBJECT_TYPE ? Variable.SCALAR_TYPE : this.type)
        return `<variable type="${blocklyType}" id="${this.id}" islocal="${isLocal
            }" iscloud="${this.isCloud}">${xmlEscape(this.name)}</variable>`;
    }

    /**
     * Type representation for scalar variables.
     * This is currently represented as ''
     * for compatibility with blockly.
     * @const {string}
     */
    static get SCALAR_TYPE() {
        return ''; // used by compiler
    }

    /**
     * Type representation for list variables.
     * @const {string}
     */
    static get LIST_TYPE() {
        return 'list'; // used by compiler
    }


    static get OBJECT_TYPE() {
        return 'object'; // used by compiler
    }

    /**
     * Type representation for broadcast message variables.
     * @const {string}
     */
    static get BROADCAST_MESSAGE_TYPE() {
        return 'broadcast_msg';
    }
}

module.exports = Variable;