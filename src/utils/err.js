export default class Err {
    constructor(text, code = null) {
        this.error = text;
        if (code) {
            this.code = code;
        }
        return this;
    }

    static errRet(resp, errmsg) {
        console.log('>>>>>>>> ERR');
        console.log(errmsg);
        if (errmsg instanceof Err && errmsg.code) {
            console.log('#1');
            resp.status(errmsg.code).json(new Err(errmsg.error));
        } else {
            console.log('#2');
            resp.status(400).json(new Err(errmsg.message));
        }
    }
}
