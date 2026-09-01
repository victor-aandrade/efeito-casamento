const camera = document.getElementById("camera");
const botao = document.getElementById("abrirCamera");

async function iniciarCamera() {

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user"
            },
            audio: false
        });

        camera.srcObject = stream;

    } catch (erro) {

        console.error("Erro ao acessar a câmera:", erro);

        alert("Não foi possível acessar a câmera. Verifique as permissões.");

    }

}

botao.addEventListener("click", iniciarCamera);