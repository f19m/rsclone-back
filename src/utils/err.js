export default class Err {
    constructor(text, code = null) {
        this.error = text;
        if (code) {
            this.code = code;
        }
        return this;
    }

    static errRet(resp, errmsg) {
        if (errmsg instanceof Err && errmsg.code) {
            resp.status(errmsg.code).json(new Err(errmsg.error));
        } else {
            console.log(`errmsg.message:    ${errmsg.message}`);
            resp.status(400).json(new Err(errmsg.message));
        }
    }
}
