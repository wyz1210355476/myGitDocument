let style =
  `
#LoadingBar,.loading-content {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    box-sizing: border-box
}

#LoadingBar {
    position: fixed;
    display: none;
    overflow: hidden;
    background: rgba(0,0,0,.1);
    user-select: none
}
.error .loading-content{
  color:red;
}
.loading-content {
    position: absolute;
    width: 10rem;
    height: 2rem;
    line-height:2rem;
    color:#fff;
    border-radius: 2px;
    text-align: center;
    margin:0 auto;
}

.loading-content:after{
  content:'loading...'
}

.error .loading-content:after{
  content:'api error!'
}

#LoadingBar.show {
    display: block
}

`
let ce = __ce._
let doc = document
let eBox = doc.createElement('div')
let eContent = doc.createElement('div')
let eStyle = doc.createElement('style')

eStyle.setAttribute("type", "text/css")
eStyle.innerHTML = style
doc.head.appendChild(eStyle)

eContent.className = 'loading-content'
eBox.id = 'LoadingBar'
eBox.appendChild(eContent)
doc.body.appendChild(eBox)

ce.loadingBar = {
  count: 0,
  push() {
    this.count++
      eBox.classList.add('show')
  },
  pop() {
    this.count--
      !this.count && this.terminate()
  },
  terminate() {
    eBox.classList.remove('show')
  },
  error(){
    eBox.classList.add('error')
  }
}


export default {
  transformRequest: [function(data) {
    __ce._.loadingBar.push()
    return data;
  }],
  transformResponse: [function(data) {
    __ce._.loadingBar.pop()
    return data;
  }],
}
