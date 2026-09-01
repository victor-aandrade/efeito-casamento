const camera = document.getElementById("camera");

const moldura = document.getElementById("moldura");

const abrirCamera =
    document.getElementById("abrirCamera");

const tirarFoto =
    document.getElementById("tirarFoto");

const trocarCamera =
    document.getElementById("trocarCamera");

const canvas =
    document.getElementById("canvas");


let stream = null;


// ====================================
// CÂMERA ATUAL
// ====================================

let cameraAtual = "user";


// ====================================
// INICIAR CÂMERA
// ====================================

async function iniciarCamera() {

    try {

        // Se já existe uma câmera aberta,
        // vamos desligá-la.

        if (stream) {

            stream.getTracks().forEach(
                track => track.stop()
            );

        }


        stream =
            await navigator.mediaDevices
            .getUserMedia({

                video: {

                    facingMode:
                        cameraAtual

                },

                audio: false

            });


        camera.srcObject = stream;


        await camera.play();


    } catch (erro) {

        console.error(erro);

        alert(
            "Não foi possível acessar a câmera."
        );

    }

}


// ====================================
// BOTÃO ABRIR CÂMERA
// ====================================

abrirCamera.addEventListener(
    "click",
    async () => {

        await iniciarCamera();


        abrirCamera.classList.add(
            "oculto"
        );


        tirarFoto.classList.remove(
            "oculto"
        );

    }
);


// ====================================
// TROCAR CÂMERA
// ====================================

trocarCamera.addEventListener(
    "click",
    async () => {

        if (!stream) {

            await iniciarCamera();

            return;

        }


        if (cameraAtual === "user") {

            cameraAtual = "environment";

        } else {

            cameraAtual = "user";

        }


        await iniciarCamera();

    }
);


// ====================================
// TIRAR FOTO
// ====================================

tirarFoto.addEventListener(
    "click",
    () => {

        if (!camera.videoWidth) {

            alert(
                "A câmera ainda não está pronta."
            );

            return;

        }


        canvas.width = 1080;

        canvas.height = 1920;


        const ctx =
            canvas.getContext("2d");


        const larguraCamera =
            camera.videoWidth;

        const alturaCamera =
            camera.videoHeight;


        // ==============================
        // ENQUADRAMENTO
        // ==============================

        const escala =
            Math.max(

                canvas.width /
                    larguraCamera,

                canvas.height /
                    alturaCamera

            );


        const larguraFinal =
            larguraCamera * escala;


        const alturaFinal =
            alturaCamera * escala;


        const x =
            (canvas.width -
             larguraFinal) / 2;


        const y =
            (canvas.height -
             alturaFinal) / 2;


        // ==============================
        // ESPELHAR CÂMERA FRONTAL
        // ==============================

        if (
            cameraAtual === "user"
        ) {

            ctx.save();

            ctx.translate(
                canvas.width,
                0
            );

            ctx.scale(-1, 1);

        }


        // ==============================
        // FOTO
        // ==============================

        ctx.drawImage(

            camera,

            x,
            y,

            larguraFinal,
            alturaFinal

        );


        if (
            cameraAtual === "user"
        ) {

            ctx.restore();

        }


        // ==============================
        // MOLDURA
        // ==============================

        ctx.drawImage(

            moldura,

            0,
            0,

            canvas.width,
            canvas.height

        );


        // ==============================
        // GERAR FOTO
        // ==============================

        const foto =
            canvas.toDataURL(
                "image/png"
            );


        mostrarResultado(foto);

    }
);
function mostrarResultado(foto) {

    const tela =
        document.createElement("div");


    tela.style.position = "fixed";

    tela.style.inset = "0";

    tela.style.background = "#000";

    tela.style.zIndex = "100";

    tela.style.overflowY = "auto";


    tela.innerHTML = `

        <div style="
            min-height:100%;
            box-sizing:border-box;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:flex-start;
            gap:12px;
            padding:20px 20px
            calc(
                30px +
                env(safe-area-inset-bottom)
            );
        ">

            <img
                src="${foto}"
                style="
                    width:auto;
                    max-width:100%;
                    max-height:65vh;
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


    // ===============================
    // SALVAR
    // ===============================

    document
        .getElementById("salvarFoto")
        .addEventListener(
            "click",
            () => {

                const link =
                    document.createElement("a");

                link.href = foto;

                link.download =
                    "foto-sinaria-edmario.png";

                link.click();

            }
        );


    // ===============================
    // COMPARTILHAR
    // ===============================

    document
        .getElementById("compartilharFoto")
        .addEventListener(
            "click",
            async () => {

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
                                type:
                                    "image/png"
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

                            files:
                                [arquivo]

                        });

                    } else {

                        alert(
                            "O compartilhamento de arquivos não está disponível neste navegador."
                        );

                    }

                } catch (erro) {

                    console.error(erro);

                }

            }
        );


    // ===============================
    // TIRAR OUTRA FOTO
    // ===============================

    document
        .getElementById("voltarCamera")
        .addEventListener(
            "click",
            () => {

                tela.remove();

            }
        );

}