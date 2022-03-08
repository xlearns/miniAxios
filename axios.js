
function Axios(defaultConfig){
  this.defaults = defaultConfig

  this.interceptors= {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  }
}

// InterceptorManager拦截器构造函数
function InterceptorManager() {
  this.handlers = []
}

InterceptorManager.prototype.use = function (fulfilled, rejected) {
  this.handlers.push({fulfilled,rejected})
}


function dispatchRequest(config){
    // 调用设配器发送请求
    return xhrAdapter(config).then(res=>{
      // 响应结果进行转换处理
      return res
    }, error=>{
      throw error
    })
}

// 核心
Axios.prototype.request = function(config){
  // 处理config.method, 统一设置为大写或小写
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }
  // 创建一个promise对象，成功的值为合并后的请求配置 【这样后面的promise就可以拿到config、链式操作】
  let promise = Promise.resolve(config)
    // 创建拦截器中间件，第一个是用来发送请求的函数，第二个用来占位【reject】
  let chains = [dispatchRequest,undefined]

  // 处理拦截，将请求拦截往chains前面压，相应拦截往chains后面压
  this.interceptors.request.handlers.forEach(item=>{
    chains.unshift(item.fulfilled, item.rejected)
  })

  this.interceptors.response.handlers.forEach(item=>{
    chains.push(item.fulfilled, item.rejected)
  })

  // 处理chains
  while(chains.length){
    promise = promise.then(chains.shift(),chains.shift())
  }
  return promise
}
//get
Axios.prototype.get = function(config){
  this.request({methods:"get"})
}
//post
Axios.prototype.post = function(){
  this.request({methods:"post"})
}

//put
Axios.prototype.put = function(){
  this.request({methods:"put"})
}

//delete
Axios.prototype.delete = function(){
  this.request({methods:"delete"})
}

//适配器 【node、brower】
function xhrAdapter(config){
  // brower
  // 发送Ajax请求
  return new Promise((resolve,reject)=>{
      const xhr = new XMLHttpRequest();
      xhr.open(config.method,config.url)
      xhr.send()
      xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
           if(xhr.status>=200&&xhr.status<300){
            resolve({
              config:config,
              code:200,
              // 后端必须返回的是json
              data:JSON.parse(xhr.response),
              header:xhr.getAllResponseHeaders(),
              request:xhr,
              status:xhr.status,
              statusText:xhr.statusText
            })
           }else{
             console.log("请求失败")
             reject(new Error(`请求失败${xhr.status}`))
           } 
        }
      }

      // 取消请求
      if(config.cancelToken){
        config.cancelToken.promise.then(resolve=>{
          xhr.abort()
          console.log("请求取消")
          reject(new Error('请求已被取消'))
        })
      }
  })
}

//单例
function createInstance(defaultConfig){
  const context = new Axios(defaultConfig)
  let instance = Axios.prototype.request.bind(context)
  // 把Axios显示原型上的属性绑定给instance
  Object.keys(Axios.prototype).forEach(key=>{
    instance[key] = Axios.prototype[key]
  })

  // 把context的属性(defaults和interceptors)绑定给axios
  Object.keys(context).forEach(key=>{
    instance[key] = context[key]
  })

  // 给instance绑定取消请求的函数
  instance.CancelToken = function (excutor) {
    // 声明一个变量
    let resolvePromise

    // 为实例对象添加属性
    this.promise = new Promise(resolve => {
      resolvePromise = resolve
    })

    // 调用excutor函数
    excutor(function () {
      resolvePromise()
    })
  }
  return instance
}

