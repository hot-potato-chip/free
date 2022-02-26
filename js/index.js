const CODE = "68903d3c283354a657d8039b4dcec2691a731f7e"
const video = document.getElementById('v')
const canvas = document.getElementById('c')
const canvas2d = canvas.getContext('2d')
let type = '研究生用户，出校登记成功！'
let timerID = undefined
let studentName
let cameraContainerShow = false

window.addEventListener('load', () => {
  setup()
  validate()
  initial()
  const scanELe = document.getElementById('scan')
  scanELe.addEventListener('click', () => {
    setTitle('')
    showCameraContainer()
    cameraContainerShow = true
  })

  const backToContentEle = document.getElementById('backToContent')
  backToContentEle.addEventListener('click', () => {
    setTitle('发现')
    hideCameraContainer()
    cameraContainerShow = false
  })

  const closeAppEle = document.getElementById('closeApp')
  closeAppEle.addEventListener('click', hideApp)
})

function validate() {
  if (window.localStorage && !!window.localStorage.getItem('allow-pass-key')) {
    hideValidateContainer()
    return
  }
  const btn = document.getElementById('validateBtn')
  const input = document.getElementById('validateInput')
  const p = document.querySelector('.validateContainer p')
  btn.addEventListener('click', () => {
    if (sha1(input.value) === CODE) {
      window.localStorage.setItem('allow-pass-key', 'true')
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
  btn.addEventListener('click', () => {
    if (nameInput.value.trim().length === 0) {
      nameInput.value = ''
      nameInput.setAttribute('placeholder', '问你谁呢')
    } else {
      studentName = nameInput.value.trim()
      window.localStorage.setItem('name', nameInput.value.trim())
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
  canvas.width = document.documentElement.clientWidth
  canvas.height = document.documentElement.clientHeight * 0.85
  // 视频处于准备阶段，并且已经加载足够的数据
  if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
    // 开始在画布上绘制视频
    canvas2d.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas2d.getImageData(0, 0, canvas.width, canvas.height);
    let code = false;
    try {
      code = jsQR(imageData.data, imageData.width, imageData.height);
    } catch (e) {
      console.error(e);
    }
    if (code) {
      drawBox(code.location)
      if (!timerID && cameraContainerShow) {
        timerID = setTimeout(() => {
          showApp()
          hideCameraContainer()
          cameraContainerShow = false
          timerID = undefined
          //fullStop()
        }, 1000)
      }
    }
  }
  run();
}

function hideApp() {
  hideAppContainer()
  setTitle("发现")
  var app = document.getElementById('app')
  app.style.display = "none"
}

function showApp() {
  const typeTextEle = document.getElementById('typeText')
  typeTextEle.innerText = type
  setTitle("平安成电智慧通行")
  showAppContainer()
  setTimeout(() => {
    name_in();
    getTime();
    doMove();
  }, 500)
}

function fullStop() {
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach(t => t.stop());
  }
}

// 画线
function drawLine(begin, end) {
  canvas2d.beginPath();
  canvas2d.moveTo(begin.x, begin.y);
  canvas2d.lineTo(end.x, end.y);
  canvas2d.lineWidth = 2;
  canvas2d.strokeStyle = '#03C03C';
  canvas2d.stroke();
}
// 画框
function drawBox(location) {
  drawLine(location.topLeftCorner, location.topRightCorner);
  drawLine(location.topRightCorner, location.bottomRightCorner);
  drawLine(location.bottomRightCorner, location.bottomLeftCorner);
  drawLine(location.bottomLeftCorner, location.topLeftCorner);
}

function showCameraContainer() {
  setCameraTrans('0%')
}

function hideCameraContainer() {
  setCameraTrans('100%')
}

function setCameraTrans(val) {
  setTrans('camera', val)
}

function hideValidateContainer() {
  setValidateTrans('-100%')
}

function setValidateTrans(val) {
  setTrans('validate', val)
}

function hideInitialContainer() {
  setInitialTrans('-100%')
}

function setInitialTrans(val) {
  setTrans('initial', val)
}

function showAppContainer() {
  setAppTrans('0%')
}

function hideAppContainer() {
  setAppTrans('100%')
}

function setAppTrans(val) {
  setTrans('app', val)
}

function setTrans(name, val) {
  const container = document.querySelector('.container')
  container.style.setProperty('--' + name + 'Trans', val)
}

function setTitle(val) {
  document.title = val
}

function getTime() {
  var myDate = new Date();
  var myYear = myDate.getFullYear();
  var myMonth = myDate.getMonth() + 1;
  var myDay = myDate.getDate();
  var myHours = myDate.getHours();
  var myMinutes = addZero(myDate.getMinutes());
  var mySeconds = myDate.getSeconds();
  var time1 = document.getElementById("time1");
  var time2 = document.getElementById("time2");
  time1.innerHTML = myYear + "-" + myMonth + "-" + myDay + " " + myHours + ":" + myMinutes + ":" + mySeconds;
  time2.innerHTML = myYear + "-" + myMonth + "-" + myDay + " " + myHours + ":" + myMinutes + ":" + mySeconds;
}

function doMove() {
  var time1 = document.getElementById("time1");
  var time2 = document.getElementById("time2");
  var left1 = parseInt(time1.style.left) - 1;
  if (left1 < -200) {
    left1 = 0;
  }
  var left2 = parseInt(time2.style.left) - 1;
  if (left2 < 0) {
    left2 = 200;
  }
  time1.style.left = left1 + "px";
  time2.style.left = left2 + "px";
  window.setTimeout("doMove()", 30);
}

function name_in() {
  var name = document.getElementById("realname");
  var text = window.localStorage.getItem("name")
  var app = document.getElementById('app')
  name.innerHTML = text;
  setTimeout(() => {
    app.style.display = "block"
  }, 750)
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}