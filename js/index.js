const video = document.getElementById('v')
const canvas = document.getElementById('c')

window.addEventListener('load', () => {
  setup()
  const scanELe = document.getElementById('scan')
  scanELe.addEventListener('click', showCameraContainer)

  const backToContentEle = document.getElementById('backToContent')
  backToContentEle.addEventListener('click', hideCameraContainer)
})

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
  const container = document.querySelector('.container')
  container.style.setProperty('--cameraTrans', val)
}