const CODE = "68903d3c283354a657d8039b4dcec2691a731f7e"
const video = document.getElementById('v')
const canvas = document.getElementById('c')
let type = '/free/平安成电智慧通行出'
let studentName

window.addEventListener('load', () => {
  validate()
  initial()
  setup()
  const scanELe = document.getElementById('scan')
  scanELe.addEventListener('click', () => {
    setTitle('')
    showCameraContainer()
    setTimeout(() => {
      window.location.pathname = type
    },1000)
  })

  const backToContentEle = document.getElementById('backToContent')
  backToContentEle.addEventListener('click', () => {
    setTitle('发现')
    hideCameraContainer()
  })
})

function validate() {
  if (window.localStorage && !!window.localStorage.getItem('allow-pass-key')) {
    hideValidateContainer()
    return
  }
  const btn = document.getElementById('validateBtn')
  const input = document.getElementById('validateInput')
  const p = document.querySelector('.validateContainer p')
  btn.addEventListener('click',() => {
    if(sha1(input.value) === CODE) {
      window.localStorage.setItem('allow-pass-key','true')
      p.classList.add('welcome')
      hideValidateContainer()
    } else {
      input.value = ""
      p.classList.remove('welcome')
    }
  })
}

function initial() {
  const nameInput = document.getElementById('name')
  const btn = document.getElementById('finishInitialBtn')
  const typeSelect = document.getElementById('type')
  if (window.localStorage && window.localStorage.getItem('name')) {
    nameInput.value = window.localStorage.getItem('name')
  }
  btn.addEventListener('click',() => {
    if(nameInput.value.trim().length === 0) {
      nameInput.value = ''
      nameInput.setAttribute('placeholder','问你谁呢')
    } else {
      studentName = nameInput.value.trim()
      window.localStorage.setItem('name',nameInput.value.trim())
      type = typeSelect.value
      hideInitialContainer()
    }
  })
}

// 初始化
function setup() {
  // 判断了浏览器是否支持挂载在MediaDevices.getUserMedia()的方法
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // 获取摄像头模式，默认设置是后置摄像头
    const facingMode = {
      exact: 'environment'
    }
    // 摄像头视频处理
    const handleSuccess = stream => {
      if (video.srcObject !== undefined) {
        video.srcObject = stream;
      } else if (window.videoEl.mozSrcObject !== undefined) {
        video.mozSrcObject = stream;
      } else if (window.URL.createObjectURL) {
        video.src = window.URL.createObjectURL(stream);
      } else if (window.webkitURL) {
        video.src = window.webkitURL.createObjectURL(stream);
      } else {
        video.src = stream;
      }
      // 不希望用户来拖动进度条的话，可以直接使用playsinline属性，webkit-playsinline属性
      video.playsInline = true;
      const playPromise = video.play();
      // playPromise.catch(() => (this.showPlay = true));
      // 视频开始播放时进行周期性扫码识别
      playPromise.then(run);
    };
    // 捕获视频流
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode
        }
      })
      .then(handleSuccess)
      .catch(() => {
        navigator.mediaDevices
          .getUserMedia({
            video: true
          })
          .then(handleSuccess)
          .catch(error => {
            console.log("error-captured", error);
          });
      });
  }
}

function run() {
  requestAnimationFrame(tick);
}

// 周期性扫码识别
function tick() {
  // 视频处于准备阶段，并且已经加载足够的数据
  if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
    // 开始在画布上绘制视频
    canvas.drawImage(video, 0, 0, canvas.width, canvas.height);
    run();
  }
}


function showCameraContainer() {
  setCameraTrans('0%')
}

function hideCameraContainer() {
  setCameraTrans('100%')
}

function setCameraTrans(val) {
  setTrans('camera',val)
}

function hideValidateContainer() {
  setValidateTrans('-100%')
}

function setValidateTrans(val) {
  setTrans('validate',val)
}

function hideInitialContainer() {
  setInitialTrans('-100%')
}

function setInitialTrans(val) {
  setTrans('initial',val)
}

function setTrans(name,val) {
  const container = document.querySelector('.container')
  container.style.setProperty('--'+name+'Trans', val)
}

function setTitle(val) {
  document.title = val
}