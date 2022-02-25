window.addEventListener('load', () => {
  setup()
  const scanELe = document.getElementById('scan')
  scanELe.addEventListener('click', showCameraContainer)

  const backToContentEle = document.getElementById('backToContent')
  backToContentEle.addEventListener('click',hideCameraContainer)
})

function setup () {
  const video = document.getElementById('v')
  // 判断了浏览器是否支持挂载在MediaDevices.getUserMedia()的方法
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const facingMode = { exact: 'environment' }
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
    };
    // 捕获视频流
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode } })
      .then(handleSuccess)
      .catch(() => {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(handleSuccess)
          .catch(error => {
            console.log("error-captured", error);
          });
      });
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