const camera = document.getElementById("camera");
const moldura = document.getElementById("moldura");

const abrirCamera = document.getElementById("abrirCamera");
const tirarFoto = document.getElementById("tirarFoto");

const canvas = document.getElementById("canvas");

let stream;


// ===============================
// ABRIR CÂMERA
// ===============================

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


// ===============================
// TIRAR FOTO
// ===============================

tirarFoto.addEventListener("click", () => {

    if (!camera.videoWidth) {
        alert("A câmera ainda não está pronta.");
        return;
    }

    const larguraTela = window.innerWidth;
    const alturaTela = window.innerHeight;

    const larguraCamera = camera.videoWidth;
    const alturaCamera = camera.videoHeight;


    // =====================================
    // CALCULAR ENQUADRAMENTO OBJECT-COVER
    // =====================================

    const escala = Math.max(
        larguraTela / larguraCamera,
        alturaTela / alturaCamera
    );

    const larguraExibida = larguraCamera * escala;
    const alturaExibida = alturaCamera * escala;

    const corteX =
        (larguraExibida - larguraTela) / 2;

    const corteY =
        (alturaExibida - alturaTela) / 2;


    // =====================================
    // TAMANHO DA FOTO FINAL
    // =====================================

    canvas.width = 1080;
    canvas.height = 1920;

    const ctx = canvas.getContext("2d");


    // =====================================
    // DESENHAR CÂMERA
    // =====================================

    const escalaFinal = Math.max(
        canvas.width / larguraCamera,
        canvas.height / alturaCamera
    );

    const larguraFinal =
        larguraCamera * escalaFinal;

    const alturaFinal =
        alturaCamera * escalaFinal;

    const corteFinalX =
        (larguraFinal - canvas.width) / 2;

    const corteFinalY =
        (alturaFinal - canvas.height) / 2;


    ctx.drawImage(
        camera,

        -corteFinalX,
        -corteFinalY,

        larguraFinal,
        alturaFinal
    );


    // =====================================
    // DESENHAR MOLDURA
    // =====================================

    ctx.drawImage(
        moldura,
        0,
        0,
        canvas.width,
        canvas.height
    );


    // =====================================
    // GERAR FOTO
    // =====================================

    const foto = canvas.toDataURL(
        "image/png"
    );


    mostrarResultado(foto);

});


// =====================================
// MOSTRAR RESULTADO
// =====================================

function mostrarResultado(foto) {

    const tela = document.createElement("div");

    tela.style.position = "fixed";
    tela.style.inset = "0";
    tela.style.background = "#000";
    tela.style.zIndex = "100";

    tela.innerHTML = `

        <div style="
            width:100%;
            height:100%;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            gap:15px;
            padding:20px;
        ">

            <img
                src="${foto}"
                style="
                    max-width:100%;
                    max-height:75vh;
                    object-fit:contain;
                "
            >

            <button
                id="salvarFoto"
                style="
                    position:static;
                    transform:none;
                "
            >
                💾 Salvar foto
            </button>

            <button
                id="compartilharFoto"
                style="
                    position:static;
                    transform:none;
                "
            >
                📤 Compartilhar
            </button>

            <button
                id="voltarCamera"
                style="
                    position:static;
                    transform:none;
                "
            >
                🔄 Tirar outra foto
            </button>

        </div>

    `;

    document.body.appendChild(tela);


    // =====================================
    // SALVAR
    // =====================================

    document
        .getElementById("salvarFoto")
        .addEventListener("click", () => {

            const link =
                document.createElement("a");

            link.href = foto;

            link.download =
                "foto-sinaria-edmario.png";

            link.click();

        });


    // =====================================
    // COMPARTILHAR
    // =====================================

    document
        .getElementById("compartilharFoto")
        .addEventListener("click", async () => {

            try {

                const resposta =
                    await fetch(foto);

                const blob =
                    await resposta.blob();

                const arquivo =
                    new File(
                        [blob],
                        "foto-sinaria-edmario.png",
                        {
                            type: "image/png"
                        }
                    );

                if (
                    navigator.share &&
                    navigator.canShare &&
                    navigator.canShare({
                        files: [arquivo]
                    })
                ) {

                    await navigator.share({
                        title:
                            "Foto do casamento",

                        text:
                            "Sinária & Edmário",

                        files: [arquivo]
                    });

                } else {

                    alert(
                        "O compartilhamento de arquivos não está disponível neste navegador."
                    );

                }

            } catch (erro) {

                console.error(erro);

            }

        });


    // =====================================
    // TIRAR OUTRA FOTO
    // =====================================

    document
        .getElementById("voltarCamera")
        .addEventListener("click", () => {

            tela.remove();

        });

}