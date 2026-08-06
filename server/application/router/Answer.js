class Answer {
    CODES = {
        //main errors
        242: 'Не переданы все необходимые параметры',
        404: 'NOT FOUND',
        //user error
        1001: 'Такого пользователя не существует',
        1002: 'Пользователь с таким логином уже существует',
        1003: 'Такой пользователь уже есть',
        //other
        9000: 'Неизвестная ошибка',
    };

    bad(code) {
        return {
            result: "error",
            error: {
                code,
                message: this.CODES[code],
            }
        };
    }

    good(data) {
        if (!data) {
            return this.bad(9000);
        }
        return {
            result: "ok",
            data,
        };
    }
}

module.exports = Answer;