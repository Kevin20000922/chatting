// 登录页面

// 验证账号
const loginId = new FieldValidator('txtLoginId', async function(val) {
    // 1. 只要验证账号是否为空就行，不需要验证账号是否存在
    if (!val) {
        return '请填写账号或密码';
    }
});
// 验证密码
const pwd = new FieldValidator('txtLoginPwd', async function(val) {
    // 1. 验证密码是否为空
    if (!val) {
        return '请填写密码';
    }
});
// 获取表单dom，给表单绑定注册事件
const form = $('form');
form.onsubmit = async function(e) {
    // 1. 阻止默认事件
    e.preventDefault();
    // 2. 对所有的表单进行统一验证
    const result = await FieldValidator.validate(loginId, pwd);
    // 3. 如果验证失败，则返回
    if (!result) {
        return;
    }
    // 4. 验证成功，拿到账户、密码和昵称
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // 5. 发送注册请求
    const resp = await API.login(data);
    if (resp.code === 0) {
        // 表明验证成功
        alert('登录成功，点击确定跳转首页');
        location.href = './index.html';
    } else {
        loginId.p.innerText = '请检查账号或密码是否有误';
        pwd.input.value = '';
    }

}