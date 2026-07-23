export default {
  app: {
    name: 'FlowBoard',
    tagline: '把今天最重要的事，放在眼前。',
  },
  common: {
    soon: '即将接入',
  },
  nav: {
    label: '主导航',
    today: '今天',
    projects: '项目',
    projectsPending: '项目功能即将接入',
  },
  auth: {
    fields: {
      displayName: '你的称呼',
      email: '邮箱',
      password: '密码',
      passwordHint: '密码长度为 8 至 72 个字符。',
    },
    login: {
      title: '欢迎回来',
      description: '登录后，继续安排属于你的今天。',
      submit: '登录并进入工作区',
      noAccount: '还没有账号？',
      goRegister: '创建账号',
    },
    register: {
      title: '创建账号',
      submit: '创建账号并继续',
      hasAccount: '已经有账号？',
      goLogin: '返回登录',
    },
    logout: '退出登录',
    errors: {
      credentials: '邮箱或密码不正确，请再次确认。',
      emailExists: '该邮箱已注册，请直接登录。',
      network: '暂时无法连接服务，请检查网络后重试。',
      general: '操作未能完成，请稍后再试。',
    },
  },
  today: {
    defaultWorkspace: '我的工作区',
    title: '今天',
    focusCount: '焦点 {count} 项',
    focusTitle: '聚焦任务',
    focusSubtitle: '把最重要的事留在眼前',
    emptyTasksTitle: '今天从留出一点空间开始',
    emptyTasksDescription: '任务能力正在接入。完成后，你可以在这里安排今天的重点、计划和稍后事项。',
    projectsTitle: '项目概览',
    projectsDescription: '项目接口接入后，这里会显示你的推进进度、下一步和截止安排。',
    sideTitle: '准备就绪',
    sideDescription: '{name}，你的个人工作区已创建完成。接下来我们会把项目和任务带到这里。',
    accountLabel: '当前账户',
    nextTitle: '下一步',
    nextDescription: '项目与任务能力正在开发中，完成后即可开始规划第一件事。',
  },
} as const
