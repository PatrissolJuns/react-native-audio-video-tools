export default class BaseEnum {
    static getStaticKeysList() {
        return Object.keys(this);
    }

    static getStaticValueList() {
        return Object.values(this);
    }
}
