var API = (function() {
    const BASE_URL = 'https://study.duyiedu.com';
    const TOKEN_KEY = 'token';

    // 单独封装get请求方法函数和post请求方法函数
    /**
     * @param {string} path 传入一个请求路径
     */
    function get(path) {
        // 统一的给所有请求头加上令牌
        const headers = {};
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE_URL + path, {
            headers,
        });
    }

    /**
     * @param {*} path 请求路径
     * @param {*} bodyObj 请求体的内容
     * 这里不需要用async标记，因为这里只是配置fetch方法，而fetch方法本身就返回的是一个Promise，所以不用标记async。为什么其它地方需要标记，因为其它地方是需要fetch方法返回结果，这里需要等待要使用await，等待就要标记async
     */
    function post(path, bodyObj) {
        // 统一的给所有请求头加上令牌
        const headers = {
            'Content-Type': 'application/json',
        };
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            headers.authorization = `Bearer ${token}`;
        }
        return fetch(BASE_URL + path, {
            headers,
            method: 'POST',
            body: JSON.stringify(bodyObj),
        });
    }

    // 用户注册函数
    async function reg(userInfo) {
        const header = await post("/api/user/reg", userInfo);
        return await header.json();
    }

    // 用户登录函数
    async function login(loginInfo) {
        const header = await post("/api/user/login", loginInfo);
        const body = await header.json();

        if (body.code === 0) {
            // 登录成功
            // 将令牌存进localStorage中
            const token = header.headers.get('authorization');
            localStorage.setItem(TOKEN_KEY, token);
        }
        return body;
    }

    // 验证账号
    async function exists(loginId) {
        const header = await get('/api/user/exists?loginId=' + loginId);
        return header.json();
    }

    // 当前登录账号的信息
    async function profile() {
        const header = await get('/api/user/profile');
        return header.json();
    }

    // 发送聊天消息
    async function sendChat(content) {
        const header = await post('/api/chat', { content });
        return header.json();
    }

    // 获取聊天记录
    async function getHistory() {
        const header = await get('/api/chat/history');
        return header.json();
    }

    function loginOut() {
        localStorage.removeItem(TOKEN_KEY);
    }

    return {
        login,
        reg,
        profile,
        exists,
        sendChat,
        getHistory,
        loginOut,
    }


})()