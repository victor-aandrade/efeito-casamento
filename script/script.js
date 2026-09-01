const camera = document.getElementById("camera");
const moldura = document.getElementById("moldura");

const abrirCamera = document.getElementById("abrirCamera");
const tirarFoto = document.getElementById("tirarFoto");

const canvas = document.getElementById("canvas");

let stream = null;


// ============================
// ABRIR CÂMERA
// ============================

abrirCamera.addEventListener("click", async () => {

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user"
            },
            audio: false
        });

        camera.srcObject = stream;

        await camera.play();

        abrirCamera.classList.add("oculto");

        tirarFoto.classList.remove("oculto");

    } catch (erro) {

        console.error(erro);

        alert(
            "Não foi possível acessar a câmera.\n\n" +
            erro.message
        );

    }

});


// ============================
// TIRAR FOTO
// ============================

tirarFoto.addEventListener("click", () => {

    const largura = camera.videoWidth;
    const altura = camera.videoHeight;

    canvas.width = largura;
    canvas.height = altura;

    const ctx = canvas.getContext("2d");

    // Desenha a imagem da câmera
    ctx.drawImage(
        camera,
        0,
        0,
        largura,
        altura
    );

    // Desenha a moldura por cima
    ctx.drawImage(
        moldura,
        0,
        0,
        largura,
        altura
    );

    // Transforma em imagem
    const foto = canvas.toDataURL("image/png");

    // Abre a foto
    const novaJanela = window.open();

    novaJanela.document.write(`
        <html>

        <head>
            <title>Foto do evento</title>

            <meta name="viewport"
                  content="width=device-width,
                           initial-scale=1">

            <style>

                body {
                    margin: 0;
                    background: #000;
                    text-align: center;
                }

                img {
                    width: 100%;
                    max-width: 1080px;
                    height: auto;
                }

            </style>

        </head>

        <body>

            <img src="${foto}">

        </body>

        </html>
    `);

});