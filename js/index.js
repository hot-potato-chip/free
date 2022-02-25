window.addEventListener('load', () => {
  const scanELe = document.getElementById('scan')
  scanELe.addEventListener('click', showCameraContainer)

  const backToContentEle = document.getElementById('backToContent')
  backToContentEle.addEventListener('click',hideCameraContainer)
})

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