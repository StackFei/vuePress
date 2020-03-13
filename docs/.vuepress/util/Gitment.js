const integrateGitment = (router) => {
  const linkGitment = document.createElement('link')
  linkGitment.href = 'https://imsun.github.io/gitment/style/default.css'
  linkGitment.rel = 'stylesheet'
  const scriptGitment = document.createElement('script')
  document.body.appendChild(linkGitment)
  scriptGitment.src = 'https://imsun.github.io/gitment/dist/gitment.browser.js'
  document.body.appendChild(scriptGitment)

  router.afterEach((to) => {
    // 已被初始化则根据页面重新渲染 评论区
    if (scriptGitment.onload) {
      renderGitment(to.fullPath)
    } else {
      scriptGitment.onload = () => {
        const commentsContainer = document.createElement('div')
        commentsContainer.id = 'comments-container'
        commentsContainer.classList.add('content')
        const $page = document.querySelector('.page')
        if ($page) {
          $page.appendChild(commentsContainer)
          renderGitment(to.fullPath)
        }
      }
    }
  })

  function renderGitment(fullPath) {
    const gitment = new Gitment({
      id: fullPath,
      owner: 'pyunfei', // 必须是你自己的github账号
      repo: 'test-blog', // 上一个准备的github仓库，作为评论，非全称（仓库名）
      oauth: {
        // 关于OAuth只需在github中的setting/Developer application新建获取
        client_id: 'd34df008a1c7ac318be6', // 第一步注册 OAuth application 后获取到的 Client ID
        client_secret: '257667ee1216d0f4ccd49d06c51da205c31acecb', // 第一步注册 OAuth application 后获取到的 Clien Secret
      },
    })
    gitment.render('comments-container')
  }
}

module.exports = integrateGitment;