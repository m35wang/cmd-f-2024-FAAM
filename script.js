async function setupWebcam() {
    const webcamElement = document.getElementById('camera');
    const canvasElement = document.getElementById('output');
    const ctx = canvasElement.getContext('2d');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 'video': true });
        webcamElement.srcObject = stream;
        return new Promise((resolve) => {
            webcamElement.onloadedmetadata = () => {
                // Set canvas dimensions to match video
                canvasElement.width = webcamElement.videoWidth;
                canvasElement.height = webcamElement.videoHeight;
                resolve(webcamElement);
            };
        });
    } catch (error) {
        console.error('Error accessing the webcam:', error);
    }
}

function isFullBodyInView(array) {
    if(array.score <= 0.7){
        return false;
    }
    return true;
}

function startCountdown(seconds) {
    const countdownElement = document.getElementById('countdown');
    let counter = seconds;
    const intervalId = setInterval(() => {
        countdownElement.innerText = `Game starts in: ${counter}`;
        counter--;
        if (counter < 0) {
            clearInterval(intervalId);
            countdownElement.innerText = '';
            startGame();
        }
    }, 1000);
}

// Periodically check if the player is in the correct position
setInterval((flag) => {
    if (flag) {
        startCountdown(5); // Start a 5-second countdown
    }
}, 1000); // Check every second as an example

function startGame() {
    // Game starts
    console.log("Game started!");
}

async function setupWebcam() {
    const webcamElement = document.getElementById('camera');
    webcamElement.onloadedmetadata = () => {
        canvasElement.width = webcamElement.videoWidth;
        canvasElement.height = webcamElement.videoHeight;
    };
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

var flag = true;

async function createDetector() {
    const videoElement = await setupWebcam();
    videoElement.play();
    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        // Other configuration options
    };
    const detector = await poseDetection.createDetector(model, detectorConfig);     
    
    const canvasElement = document.getElementById('output'); // Getting the canvas element
    const ctx = canvasElement.getContext('2d'); // Getting the 2D rendering context

    const runPoseDetection = async () => {
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        const poses = await detector.estimatePoses(videoElement);
        console.log(poses[0]); 
        
         // Draw keypoints         
        if (poses && poses.length > 0) {
            poses[0].keypoints.forEach(drawKeypoint);
            //plank(poses[0].keypoints);
            //burpee(poses[0].keypoints);

            // check if flag true 
            if (flag) {
                console.log("flag is true");
                setInterval(flag);
                plank(poses[0].keypoints, poses[0].score);
                requestAnimationFrame(runPoseDetection); // Continuously run pose detection
            }
        }
    };

    runPoseDetection();

    //draw the keypoints on top camera feed
    const drawKeypoint = (keypoint) => {         
        const { x, y, score } = keypoint;         
            if (score > 0.3) {         
                const mirroredX = canvasElement.width - x;
                
                ctx.beginPath();             
                ctx.arc(x, y, 5, 0, 2 * Math.PI);             
                ctx.fillStyle = "aqua";             
                ctx.fill();

            }     
    };

    var score = 0;
    
    function plank(arrayPoints, arrayScore){
        if (isFullBodyInView(arrayScore) == true){
            for (let i = 0; score >= 10; i++) {
                // array 15 and 16 are L and R ankles
                //array 10 and 11 are L and R wrists
                if ((arrayPoints[10].y >= 400 && arrayPoints[11].y >= 400) && (arrayPoints[15].score < 0.30 && arrayPoints[16].score < 0.30)){
                    score += 1;
                    console.log("score increased by 1");
                }
    
                if (i == 15 && score < 10){
                    console.log("your plank failed");
                    flag = false;
                    return false;
                }
            }
        }
        return;
    }

    var jump = 0;
    var down = 0;

    function burpee(array) {
        while(jump != 10 || down != 10){
            console.log("Checking burpee conditions");
    
            // Make sure keypoints exist and have a 'y' property
            if (array[15].y < 400 && array[16].y < 400) {
                jump += 1;
                console.log("burpee jump score increased by 1");
            }
    
            if (array[9].y >= 400 && array[10].y >= 400) {
                down += 1;
                console.log("burpee pushup score increased by 1");
            }
    
            if (jump > 10 || down > 10) {
                console.log("you burpee failure");
                return false;
            }
        }
    
        console.log("burpee function done");
        return true;
    }

    

    // function jumpJack(array){
    //     var armDown = 0;
    //     var ankleOut = 0;
    //     var ankleIn = 0;
    //     var clap = 0;

    //     for (let i = 0; armDown <= 10 && ankleOut <= 10 && ankleIn <= 10 && clap <= 10; i++){
    //         var jackDone = console.log("burpee function done");
    //         // wrists
    //         if(array[9] <= 150 && array[10] <= 150){
    //             clap += 1;
    //             console.log("jump jack clap score increased by 1");
    //         }
    //         if(array[9] >= 300 && array[10] >= 300){
    //             armDown += 1;
    //             console.log("jump jack arm down score increased by 1");
    //         }
    //         if(array[15] <= 300 && array[16] <= 300){
    //             ankleOut += 1;
    //             console.log("jump jack ankle out score increased by 1");
    //         }
    //     }
    // }

}
createDetector();
