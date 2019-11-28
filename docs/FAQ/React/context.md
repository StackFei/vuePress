# 浅析上下文context

> 简而言之，执行上下文是评估和执行 `JavaScript` 代码的环境的抽象概念。每当 `Javascript` 代码在运行的时候，它都是在执行上下文中运行。说人话就是在代码执行时, 可以拿到运行之前定义的环境指向.

## 使用场景
由于本文涉及到`react`上下概念, 所以全都以`react`的环境来处理事件, 在`redux` 全局状态管理器器还未如日中天时, 要想获取到上下文的全局数据, 都得通过创建全局上下文来互通数据, 即`React.createContext` 来创建一个全局上下文定义好状态, 让变量全都是同一个执行环境, 就不存在执行环节上下文模糊的概念.

## 使用方式
`context`的使用方法在`react`中有两种实现方式, 传统的`class`使用方法, 以及现在广泛的`function`使用方法简称`hooks`, 接下来一一展示使用方式, **`context`内部会提供两个方法`Provider`生产者,也被称为商店,`Consumer`消费者, 用来包裹要使用状态的组件**, 使用方式也略有不同, 先来使用一下, 然后尝试还原一下该方法的实现.
| 名称                           | 作用               | 说明          | 
| -------                        | ---------         | ------         | 
|<Badge text="Provider"/>        |创建上下文消费的仓库 |      🚀     |
|<Badge text="Consumer"/>        |包裹上下文消费的对象 |      🚀        |

### Provider  <Badge text="仓库"/> 
统一的商店仓库, 无论哪一种使用方法, 仓库都是一致的 🚀 就是`react`自带的`context`对象,
```javascript
let MyContext = React.createContext();  🚀
class Person extends React.Component {
    state = { color: 'red' }
    constructor(props) {
        super(props)
    }
    handler = (color) => {
        this.setState({ color })
    }
    render() {
        let colorContext = { color: this.state.color, handler: this.handler }
        return (<MyContext.Provider value={colorContext}>
            <div style={{ border: `3px solid ${this.state.color}`, padding: '5px' }}>
                <Header />
                <Counter />
            </div>
        </MyContext.Provider>)
    }
}
```

### Consumer  <Badge text="消费者"/> 
就下来会展示`class`,`function`两种实现方式, 这里不会讲述怎么用, 而是根绝用法来剖析如何实现.
```javascript
class Header extends React.Component {
    static contextType = MyContext
    render() {
        return (<div style={{ border: `3px solid ${this.context.color}` }}>
            Header
        </div>)
    }
}

function Counter() {
     return (<MyContext.Consumer>
        {
            value => (
                <div style={{ border: `3px solid ${value.color}` }}>
                    Counter
                    <CounterChild />
                </div>
            )
        }
    </MyContext.Consumer>)
}
```
## 实现思路  <Badge text="bate" type"warn"/> 
清晰明了, `context`就是一个方法, 然后有两个内部函数`Provider`,`Consumer`, 并且`Consumer`是可以使用`Provider`传入的变量, 也不是很难. 先试一试bate版本的, 由于`class` 是使用`contextType`来获取静态属性方法的, 这个放在后面, 先来实现一下`function`版本的编译.
```javascript
function createContext(){
    class Provider extends React.Component{
        static value;
        constructor(props){
            super(props)
            Provider.value = props.value
        }
        render(){
            return this.props.children
        }
    }
    class Consumer extends React.Component{
        render(){
            return this.props.children(Provider.value)
        }
    }
    return {
        provider,
        Consumer
    }
}
```
还是比较容易理解的, 在`Provider`的静态属性定义一个`value`接收传入的`value`覆盖, 在留给`Consumer`来执行消费并且传入, 一气呵成, **只能编译函数类型不能编译类类型**, 基本上算是能渲染了, 但是一到修改属性就又不行了, 只能第一次修改, 后续的修改全都无效. 
 - **其主要原因还是在于我们修改了属性却没有给属性重新赋值**

在此之前, 我们需要用到新的生命周期函数`getDerivedStateFromProps`, 简单介绍一下, 他是介于更新之前的钩子函数, 接受两个参数`nextProps`,`prevState`两个参数, 分别代表下一个属性, 以及上一个状态, 且返回值可以作为下一次的状态, 刚好可以将其的状态监听赋值给下一个状态. 稍作修改, 只需加入一个静态方法
```javascript
static getDerivedStateFromProps(nextProps, prevState){
    Provider.value = nextProps.value
    return { value: nextProps.value }
}
```
至此, `context`基本上已经实现完成了, 本身其内部也没有什么复杂的结构, 就是起到一个连接的作用, 由于`contextType`关键字的原因, 无法直接模拟出静态方法, 所以在类中只能通过该下方法来取值.
```javascript
class HeaderChild extends React.Component {
    static contextType = ColorContext;
    render() {
        return (
            <div style={{ border: `3px solid ${HeaderChild.contextType.Provider.value.color}` }}>
                HeaderChild
            </div>
        )
    }
}
```
 **地址：<https://github.com/StackFei/ReactFAQ>**
