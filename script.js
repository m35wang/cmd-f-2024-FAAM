// import * as poseDetection from '@tensorflow-models/pose-detection';
// import * as tf from '@tensorflow/tfjs-core';

import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@latest';
import * as poseDetection from 'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection';

// Register one of the TF.js backends.
import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-wasm';

// function isFullBodyInView() {
//     // Placeholder for full body detection logic
//     // Returns true if a full body is detected, false otherwise
//     return true; // Replace with actual detection logic
// }

// function startCountdown(seconds) {
//     const countdownElement = document.getElementById('countdown');
//     let counter = seconds;

//     const intervalId = setInterval(() => {
//         countdownElement.innerText = `Game starts in: ${counter}`;
//         counter--;

//         if (counter < 0) {
//             clearInterval(intervalId);
//             countdownElement.innerText = '';
//             startGame();
//         }
//     }, 1000);
// }

function startGame() {
    // Game starts
    // Implement game logic here
    console.log("Game started!");
}

// Periodically check if the player is in the correct position
setInterval(() => {
    if (isFullBodyInView()) {
        startCountdown(5); // Start a 5-second countdown
    }
}, 1000); // Check every second as an example

async function setupWebcam() {
    const webcamElement = document.getElementById('camera');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 'video': true });
        webcamElement.srcObject = stream;
        return new Promise((resolve) => {
            webcamElement.onloadedmetadata = () => {
                resolve(webcamElement);
            };
        });
    } catch (error) {
        console.error('Error accessing the webcam:', error);
    }
}


async function createDetector() {
    const videoElement = await setupWebcam();
    videoElement.play();

    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        // Other configuration options
    };

    const detector = await poseDetection.createDetector(model, detectorConfig);

    const runPoseDetection = async () => {
        const poses = await detector.estimatePoses(videoElement);
        console.log(poses);

        // You might want to draw the results on the video or process them further
        // ...

        requestAnimationFrame(runPoseDetection); // Continuously run pose detection
    };

    runPoseDetection();
}

createDetector();