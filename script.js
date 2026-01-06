const modelURL = "model/model.json";
const metadataURL = "model/metadata.json";

let model;
let webcam;
let webcamRunning = false;

/* =====================
   LOAD MODEL
===================== */
async function loadModel() {
    model = await tmImage.load(modelURL, metadataURL);
    document.getElementById("result").innerHTML = "Model loaded successfully.";
}
loadModel();

/* =====================
   IMAGE UPLOAD
===================== */
document.getElementById("imageUpload").addEventListener("change", async (e) => {
    const img = document.getElementById("preview");
    img.src = URL.createObjectURL(e.target.files[0]);

    img.onload = async () => {
        const prediction = await model.predict(img);
        showResult(prediction);
    };
});

/* =====================
   WEBCAM
===================== */
async function startWebcam() {
    if (webcamRunning) return;

    webcam = new tmImage.Webcam(300, 300, true);
    await webcam.setup();
    await webcam.play();

    document.getElementById("webcam-container").appendChild(webcam.canvas);
    webcamRunning = true;
    webcamLoop();
}

async function webcamLoop() {
    if (!webcamRunning) return;

    webcam.update();
    const prediction = await model.predict(webcam.canvas);
    showResult(prediction);

    requestAnimationFrame(webcamLoop);
}

function stopWebcam() {
    if (!webcamRunning) return;

    webcam.stop();
    webcamRunning = false;
    document.getElementById("webcam-container").innerHTML = "";
}

/* =====================
   DISPLAY RESULT + BAR
===================== */
function showResult(predictions) {
    let textOutput = "<strong>Prediction Result</strong><br>";
    let chartHTML = "<div class='bar-container'>";

    predictions.forEach(p => {
        const percent = (p.probability * 100).toFixed(1);

        textOutput += `${p.className}: ${percent}%<br>`;

        chartHTML += `
            <div class="bar">
                <div class="bar-label">${p.className}</div>
                <div class="bar-fill" style="width:${percent}%">
                    ${percent}%
                </div>
            </div>
        `;
    });

    chartHTML += "</div>";

    document.getElementById("result").innerHTML = textOutput;
    document.getElementById("chart").innerHTML = chartHTML;
}
