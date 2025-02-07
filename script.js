document.addEventListener('DOMContentLoaded', function() {
    // Sender elements
    const senderVideo = document.getElementById('sender-video');
    const senderCanvas = document.getElementById('sender-canvas');
    const senderCaptureButton = document.getElementById('sender-capture-button');
    const senderPhoto = document.getElementById('sender-photo');
    const sendButton = document.getElementById('send-button');
    const senderStatus = document.getElementById('sender-status');
    const messageSelect = document.getElementById('message-select');

    // Receiver elements
    const receiverVideo = document.getElementById('receiver-video');
    const receiverCanvas = document.getElementById('receiver-canvas');
    const receiverCaptureButton = document.getElementById('receiver-capture-button');
    const receiverPhoto = document.getElementById('receiver-photo');
    const receiverMessage = document.getElementById('receiver-message');
    const decryptButton = document.getElementById('decrypt-button');
    const responseButtons = document.getElementById('response-buttons');
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    const responseStatus = document.getElementById('response-status');

    // Match Found elements
    const matchFound = document.getElementById('match-found');
    const matchSenderPhoto = document.getElementById('match-sender-photo');
    const matchReceiverPhoto = document.getElementById('match-receiver-photo');

    let sharedKey = [];
    let encryptedMessage = '';
    let decryptedMessage = '';

    // Get media streams
    let senderStream;
    let receiverStream;

    // Request camera access for sender
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        senderStream = stream;
        senderVideo.srcObject = stream;
    })
    .catch(function(err) {
        console.error("Error accessing sender camera: " + err);
    });

    // Request camera access for receiver
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        receiverStream = stream;
        receiverVideo.srcObject = stream;
    })
    .catch(function(err) {
        console.error("Error accessing receiver camera: " + err);
    });

    // Capture sender photo
    senderCaptureButton.addEventListener('click', function() {
        capturePhoto(senderVideo, senderCanvas, senderPhoto);
        senderStream.getTracks().forEach(track => track.stop());
        senderVideo.style.display = 'none';
        senderCaptureButton.style.display = 'none';
        senderPhoto.style.display = 'block';
    });

    // Capture receiver photo
    receiverCaptureButton.addEventListener('click', function() {
        capturePhoto(receiverVideo, receiverCanvas, receiverPhoto);
        receiverStream.getTracks().forEach(track => track.stop());
        receiverVideo.style.display = 'none';
        receiverCaptureButton.style.display = 'none';
        receiverPhoto.style.display = 'block';
    });

    function capturePhoto(video, canvas, imgElement) {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataURL = canvas.toDataURL('image/png');
        imgElement.src = imageDataURL;
    }

    // Sender sends the message
    sendButton.addEventListener('click', function() {
        const selectedMessage = messageSelect.value;
        simulateEncryptionTransmission(selectedMessage);
    });

    function simulateEncryptionTransmission(message) {
        senderStatus.textContent = 'Encrypting message using polarizers...';
        setTimeout(function() {
            sharedKey = generateSharedKey();
            encryptedMessage = encryptMessage(message, sharedKey);
            senderStatus.textContent = 'Message encrypted.';
            setTimeout(function() {
                senderStatus.textContent = 'Sending message through laser...';
                // Simulate delay based on message length
                const transmissionTime = encryptedMessage.length * 50;
                setTimeout(function() {
                    senderStatus.textContent = 'Message sent.';
                    receiveMessage(encryptedMessage);
                }, transmissionTime);
            }, 1000);
        }, 2000);
    }

    // Receiver receives the message
    function receiveMessage(message) {
        setTimeout(function() {
            receiverMessage.textContent = 'Encrypted message received.';
            decryptButton.style.display = 'inline-block';
        }, 2000);
    }

    // Receiver decrypts the message
    decryptButton.addEventListener('click', function() {
        decryptButton.style.display = 'none';
        receiverMessage.textContent = 'Decrypting message using polarizers...';
        setTimeout(function() {
            decryptedMessage = decryptMessageWithKey(encryptedMessage, sharedKey);
            receiverMessage.textContent = 'Decrypted Message: ' + decryptedMessage;
            responseButtons.style.display = 'block';
        }, 2000);
    });

    // Receiver responds to the message
    yesButton.addEventListener('click', function() {
        sendResponse('Yes');
    });

    noButton.addEventListener('click', function() {
        sendResponse('No');
    });

    function sendResponse(response) {
        responseButtons.style.display = 'none';
        responseStatus.textContent = 'You selected: ' + response;
        if (response === 'Yes') {
            displayMatchFound();
        } else {
            alert('Receiver responded: ' + response);
        }
    }

    function displayMatchFound() {
        matchSenderPhoto.src = senderPhoto.src;
        matchReceiverPhoto.src = receiverPhoto.src;
        matchFound.style.display = 'block';
    }

    function generateSharedKey() {
        // Generate a simple 8-bit key
        const key = [];
        for (let i = 0; i < 8; i++) {
            key.push(Math.floor(Math.random() * 2));
        }
        return key;
    }

    function encryptMessage(message, key) {
        // Simple XOR encryption
        const messageBytes = stringToBytes(message);
        const keyByte = parseInt(key.join(''), 2) & 0xFF;
        const encryptedBytes = [];
        for (let i = 0; i < messageBytes.length; i++) {
            encryptedBytes.push(messageBytes[i] ^ keyByte);
        }
        return encryptedBytes;
    }

    function decryptMessageWithKey(encryptedBytes, key) {
        const keyByte = parseInt(key.join(''), 2) & 0xFF;
        const decryptedBytes = [];
        for (let i = 0; i < encryptedBytes.length; i++) {
            decryptedBytes.push(encryptedBytes[i] ^ keyByte);
        }
        return bytesToString(decryptedBytes);
    }

    function stringToBytes(str) {
        const bytes = [];
        for (let i = 0; i < str.length; i++) {
            bytes.push(str.charCodeAt(i));
        }
        return bytes;
    }

    function bytesToString(bytes) {
        return String.fromCharCode.apply(null, bytes);
    }
});
