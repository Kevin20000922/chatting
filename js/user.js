// 用户登录和注册的通用验证

class FieldValidator {
    /**
     *
     * @param {string} txtId 文本框的dom对象
     * @param {Function} validatorFunc 对单个文本框进行验证的函数
     * @memberof FieldValidator
     */
    constructor(txtId, validatorFunc) {
        this.input = $('#' + txtId);
        this.p = this.input.nextElementSibling;
        this.validatorFunc = validatorFunc;
        this.input.onblur = () => {
            this.validate();
        }
    }

    // 如果有值说明有错误，如果没值说明没有错误
    async validate() {
        const err = await this.validatorFunc(this.input.value);
        if (err) {
            this.p.innerText = err;
            return false;
        } else {
            this.p.innerText = '';
            return true;
        }
    }

    // 该方法主要用于对所有的表单项进行验证
    // 为什么要使用这个方法进行验证，因为用户可能什么都不填，直接点提交。所以要有个对所有的表达进行验证的函数
    static async validate(...validators) {
        // 1. 要对每一个表单项进行验证，使用map方法，对每一项单独调用实例validate方法进行验证
        const proms = validators.map(async item => await item.validate()); // 这个await是我加的 袁老师没加，我认为是validate返回的是一个Promise，这里调用也需要等待
        // 2. 接下来对每一项看看它的结果都是什么
        const results = await Promise.all(proms);
        return results.every(r => r);
    }
}