document.getElementById('inputImage').addEventListener('change', handleImage);

// Carregar os modelos necessários
Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('assents/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('assents/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('assents/models'),
]).then(start);

function start() {
  console.log('Modelos carregados com sucesso!');
}

async function handleImage(event) {
  const inputImage = event.target;
  const file = inputImage.files[0];

  if (file) {
    const img = await faceapi.bufferToImage(file);
    const canvas = document.getElementById('outputCanvas');
    faceDetection(img, canvas);
  }
}

async function faceDetection(img, canvas) {
  const faceCanvas = faceapi.createCanvasFromMedia(img);
  document.body.append(faceCanvas);
  const displaySize = { width: img.width, height: img.height };
  faceapi.matchDimensions(faceCanvas, displaySize);

  // Use o contexto 2D para desenhar a imagem original no canvas
  const ctx = faceCanvas.getContext('2d');
  ctx.drawImage(img, 0, 0, img.width, img.height);

  const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

  detections.forEach((detection) => {
    const leftEye = detection.landmarks.getLeftEye();
    const rightEye = detection.landmarks.getRightEye();

    const leftEyeCenter = getCenter(leftEye);
    const rightEyeCenter = getCenter(rightEye);

    // Desenhar círculos vermelhos sobre o centro de cada olho
    ctx.beginPath();
    ctx.arc(leftEyeCenter.x, leftEyeCenter.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(rightEyeCenter.x, rightEyeCenter.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
  });
}

// Função auxiliar para calcular o centro de um conjunto de pontos
function getCenter(points) {
  const centerX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const centerY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  return { x: centerX, y: centerY };
}
