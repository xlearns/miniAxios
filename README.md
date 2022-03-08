```js
var chains = ['ok',''];
function create(){this.dep = []};
create.prototype.use = function(a){
    this.dep.push(a)
}
var request = new create()
var response = new create()

request.use({
    fulfilled:1,
    rejected:2
})

response.use({
    fulfilled:11,
    rejected:22
})


request.dep.forEach(item=>{
    chains.unshift(item.fulfilled,item.rejected)
})

response.dep.forEach(item=>{
    chains.push(item.fulfilled,item.rejected)
})

// console.log(chains)

// while(chains.length){
//     console.log(chains.shift(),chains.shift())
// }



// 链式操作
var config = 'hello'
var promise = Promise.resolve(config) //定义链式操作的开头

promise = promise.then(v=>{
    console.log(v)
    return 123    //次后每个链式操作的promise都是上一个rereturn的结果
})

promise.then(v=>{
    console.log(v)
})



//promise ajax



```