let model;
let modelLoaded = false;

const MODEL_URL = "model/";

async function loadModel() {
    try {
        model = await tmImage.load(
            MODEL_URL + "model.json",
            MODEL_URL + "metadata.json"
        );
        modelLoaded = true;
        console.log("✅ Model loaded");
    } catch (error) {
        console.error("❌ Model failed to load", error);
    }
}

loadModel();

async function predictImage(event) {

    if (!modelLoaded) {
        alert("Model still loading. Please wait a few seconds.");
        return;
    }

    const img = document.getElementById("preview");
    img.src = URL.createObjectURL(event.target.files[0]);

    img.onload = async () => {
        const prediction = await model.predict(img);
        prediction.sort((a, b) => b.probability - a.probability);

        document.getElementById("prediction").innerText =
            `${prediction[0].className} (${(prediction[0].probability * 100).toFixed(2)}%)`;
    };
}

