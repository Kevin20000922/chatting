// 验证是否有登录，如果没有登录，跳转到登录页面，如果有登录，获取用户的信息
(async function () {
  // 1. 验证用户是否已经登录
  const resp = await API.profile();
  let user = resp.data; // 先获取登录的用户信息，登录成功获取的是用户对象，登录失败获取的是null
  if (!user) {
    // 如果得到的是null，说明登录失败（或者是用户没有登录）
    alert("未登录，请先登录");
    location.href = "./login.html";
    return;
  }
  // 2. 将用户登录的信息显示到页面中
  // 2-1. 获取要显示的元素
  const doms = {
    nickname: $("#nickname"),
    loginId: $("#loginId"),
    close: $(".close"),
    container: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    form: $(".msg-container"),
    close: $(".close"),
  };
  getInfo();

  // 2-2. 将用户的信息插入到页面中
  function getInfo() {
    // 注意这里不能使用innerHTML，因为如果用户注册是使用的标签注册账号，那么这里插入的就是一个标签，出现显示混乱
    doms.nickname.innerText = user.nickname;
    doms.loginId.innerText = user.loginId;
  }

  // 3. 点击按钮退出
  doms.close.onclick = function () {
    API.loginOut();
  };

  // 4. 发送消息（功能是将消息显示到页面中）
  /**
   * @param {Object} chatInfo
   * from 是haha表明有值，有值表明是人发的
   * from 是null表示是机器人发的
   */
  function sendChat(chatInfo) {
    // 1. 创建div
    const div = $$$("div");
    div.classList.add("chat-item");

    // 2. 判断发送消息的一端是机器人还是人
    if (chatInfo.from) {
      div.classList.add("me");
    }

    // 3. 设置头像
    const img = $$$("img");
    img.classList.add("chat-avatar");
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    // 4. 搞定发送消息的内容
    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    // 5. 日期
    const date = $$$("div");
    date.classList.add("chat-date");
    date.innerText = formDate(chatInfo.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);
    doms.container.appendChild(div);
  }

  // 初始化日期
  function formDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  await getHistory();

  // 5. 获取历史消息
  async function getHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      sendChat(item);
    }
    scrollBottom();
  }

  // 6. 设置滚动条的滚动高度到最底部
  function scrollBottom() {
    doms.container.scrollTop = doms.container.scrollHeight;
  }

  // 7. 发送聊天消息
  async function sendMessage() {
    // 1. 获取输入框的文本
    const content = doms.txtMsg.value.trim(); // 去除首尾空格
    if (!content) {
      // 如果没有内容，则啥也不干
      return;
    }
    // 2. 发送的消息立即显示到页面上
    sendChat({
      from: user.loginId, // user是验证的当前账号，这里的意思也就是获取当前账号的id
      to: null,
      createdAt: Date.now(),
      content,
    });
    doms.txtMsg.value = "";
    scrollBottom(); // 用户发送过消息，滚动条要立刻滚动到最下面
    // 3. 发送消息后，调用发送聊天消息接口，拿到服务器的响应结果
    const resp = await API.sendChat(content);
    // 4. 接收到服务器的响应结果后，这边要将机器人的返回结果显示到页面中
    sendChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollBottom(); // 机器人发送过消息，滚动条要立刻滚动到最下面
  }
  window.sendMessage = sendMessage; // 这里是把发送聊天消息函数注册到window中，为了调试方便

  // 8. 给form表单注册提交事件
  doms.form.addEventListener("submit", function (e) {
    e.preventDefault();
    sendMessage();
  });

  // 9. 点击按钮退出，跳转到登录页面
  doms.close.onclick = function () {
    API.loginOut();
    location.href = "./login.html"; // 跳转到登录页
  };
})();
