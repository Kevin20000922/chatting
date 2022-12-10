// 验证账号
const loginId = new FieldValidator('txtLoginId', async function(val) {
    // 1. 验证账号是否为空
    if (!val) {
        return '请填写账号或密码';
    }
    // 2. 验证账号是否存在
    const resp = await API.exists(val);
    if (resp.data) {
        return '该账号已被注册';
    }
});
// 验证昵称
const nickname = new FieldValidator('txtNickname', async function(val) {
    // 1. 验证昵称是否为空
    if (!val) {
        return '请填写昵称';
    }
});
// 验证密码
const pwd = new FieldValidator('txtLoginPwd', async function(val) {
    // 1. 验证密码是否为空
    if (!val) {
        return '请填写密码';
    }
});
// 确认密码验证
const confirmPwd = new FieldValidator('txtLoginPwdConfirm', async function(val) {
    // 1. 验证密码是否为空
    if (!val) {
        return '请填写确认密码';
    }
    // 2. 如果第二次输入的密码和之前不一致做判断
    if (val !== pwd.input.value) {
        return '两次密码不一致';
    }
});

// 获取表单dom，给表单绑定注册事件
const form = $('form');
form.onsubmit = async function(e) {
    // 1. 阻止默认事件
    e.preventDefault();
    // 2. 对所有的表单进行统一验证
    const result = await FieldValidator.validate(loginId, nickname, pwd, confirmPwd);
    // 3. 如果验证失败，则返回
    if (!result) {
        return;
    }
    // 4. 验证成功，拿到账户、密码和昵称
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // 5. 发送注册请求
    const resp = await API.reg(data);
    if (resp.code === 0) {
        // 表明验证成功
        alert('注册成功，点击确定跳转登录页面');
        location.href = './login.html';
    }

}