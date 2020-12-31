export default class Err {
    constructor(text, code = null) {
        this.error = text;
        if (code) {
            this.code = code;
        }
        return this;
    }
}
