class User {
    constructor({ db, common, socketId }) {
        this.db = db;
        this.common = common;
        this.socketId = socketId;

        this.id = null;
        this.login = null;
        this.guid = null;
        this.token = null;
        this.roleId = null;
    }

    get() {
        return {
            guid: this.guid,
        };
    }

    getSelf() {
        return {
            guid: this.guid,
            token: this.token,
        };
    }

    _fillData(userData, token) {
        this.id = userData.id;
        this.login = userData.login;
        this.guid = userData.guid;
        this.token = token;
        this.roleId = userData.roleId;
    }

    isLogin() {
        return this.socketId && this.token;
    }

    async loginUser(login, passwordHash) {
        const userData = await this.db.getUserByLogin(login);
        if (!userData) return null;

        if (passwordHash !== userData.password) return null;

        const token = this.common.md5(`${Math.random()}`);
        await this.db.updateToken(userData.guid, token);
        this._fillData(userData, token);
        
        return this;
    }

    async registration(login, passwordHash) {
        const existingUser = await this.db.getUserByLogin(login);
        if (existingUser) return null;

        const guid = this.common.guid();
        const token = this.common.md5(`${Math.random()}`);

        await this.db.createUser(login, passwordHash, guid, token);

        const userData = await this.db.getUserByGuid(guid);
        console.log(userData, token)
        this._fillData(userData, token);
        
        console.log(2)
        return this;
    }

    async logout() {
        await this.db.clearToken(this.guid);
        this.id = null;
        this.login = null;
        this.guid = null;
        this.token = null;
        
        return true;
    }
}

module.exports = User;