let model;
const MODEL_URL = "model/";

async function loadModel() {
    model = await tmImage.load(
        MODEL_URL + "model.json",
        MODEL_URL + "metadata.json"
    );
}

loadModel();

async function predictImage(event) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(event.target.files[0]);

    img.onload = async () => {
        const prediction = await model.predict(img);
        prediction.sort((a, b) => b.probability - a.probability);
        document.getElementById("prediction").innerText =
            prediction[0].className + " (" +
            (prediction[0].probability * 100).toFixed(2) + "%)";
    };
}
