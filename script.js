const modelURL = "model/model.json";
const metadataURL = "model/metadata.json";

let model;
let webcam;
let webcamRunning = false;
let modelLoaded = false;

/* =====================
   WAIT FOR tmImage
===================== */
window.addEventListener("load", () => {
    if (typeof tmImage === "undefined") {
        document.getElementById("result").innerHTML =
            "❌ tmImage library not loaded.";
        console.error("tmImage is undefined");
        return;
    }
    loadModel();
});

/* =====================
   LOAD MODEL
===================== */
async function loadModel() {
    try {
        console.log("Loading model...");
        model = await tmImage.load(modelURL, metadataURL);
        modelLoaded = true;
        document.getElementById("result").innerHTML =
            "✅ Model loaded. Ready.";
        console.log("Model loaded successfully");
    } catch (error) {
        document.getElementById("result").innerHTML =
            "❌ Failed to load model. Check console.";
        console.error("MODEL LOAD ERROR:", error);
    }
}

/* =====================
   IMAGE UPLOAD
===================== */
document.getElementById("imageUpload").addEventListener("change", async (e) => {
    if (!modelLoaded) {
        alert("Model not loaded yet!");
        return;
    }

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
    if (!modelLoaded) {
        alert("Model not loaded yet!");
        return;
    }

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
   RESULT + BAR GRAPH
===================== */
function showResult(predictions) {
    let text = "<strong>Prediction Result</strong><br>";
    let chart = "<div class='bar-container'>";

    predictions.forEach(p => {
        const percent = (p.probability * 100).toFixed(1);

        text += `${p.className}: ${percent}%<br>`;

        chart += `
            <div class="bar">
                <div class="bar-label">${p.className}</div>
                <div class="bar-fill" style="width:${percent}%">
                    ${percent}%
                </div>
            </div>
        `;
    });

    chart += "</div>";

    document.getElementById("result").innerHTML = text;
    document.getElementById("chart").innerHTML = chart;
}
