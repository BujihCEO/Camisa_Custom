  // Função para abrir e fechar o modal
  const modal = document.getElementById("myModal");
  const btn = document.getElementById("openModal");
  const span = document.getElementsByClassName("close")[0];

  btn.onclick = function() {
    modal.style.display = "block";
    createThreeJsScene();
  }

  span.onclick = function() {
    modal.style.display = "none";
    // Limpar a cena quando fechar o modal
    document.getElementById('threejsContainer').innerHTML = '';
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      document.getElementById('threejsContainer').innerHTML = '';
    }
  }

  // Função para criar a cena do Three.js
  function createThreeJsScene() {
    const container = document.getElementById('threejsContainer');

    // Configurar a cena, câmera e renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Luzes
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);

    // Controles para interagir com o modelo
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;

    // Carregar o modelo GLTF
    const loader = new THREE.GLTFLoader();
    loader.load('caminho/para/seu/modelo/camiseta.gltf', function(gltf) {
      const camiseta = gltf.scene;
      scene.add(camiseta);
      camiseta.position.set(0, 0, 0);
      camiseta.scale.set(1, 1, 1);

      // Animação
      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        controls.update(); // Atualizar controles
      }
      animate();
    }, undefined, function(error) {
      console.error(error);
    });

    // Configuração da câmera
    camera.position.z = 5;
  }