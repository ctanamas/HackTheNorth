// Transciption
//import 'dotenv/config';
//import fetch from 'node-fetch';

const ASSEMBLYAI_API_KEY = "bea1078f699b4028b4cab02dc6adf101";
let id = 'o91jt8pmpb-b317-4568-928f-cb478c7a9bac';
const transcript_download_url = `https://api.assemblyai.com/v2/transcript/${id}`;
const transcript_upload_url = 'https://api.assemblyai.com/v2/transcript';
const download_params = {
    headers: {
      "authorization": ASSEMBLYAI_API_KEY, //process.env.ASSEMBLYAI_API_KEY,
      "content-type": "application/json",
    },
    method: 'GET'
  };


// upload video to AssemblyAI
function uploadVideo(){
    let audioUrl = document.getElementById("video-link").value;
    console.log(audioUrl);
    if(!validLink(audioUrl)) {
        // say error
        return;
    }

    data = {
        "audio_url" : audioUrl
    };
    upload_params = {
        headers:{
            "authorization": ASSEMBLYAI_API_KEY, //process.env.ASSEMBLYAI_API_KEY,
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
        method: "POST"
    };

    fetch(transcript_upload_url, upload_params)
    .then(response => response.json())
    .then(data => {
        transciptUploadSuccess(data['id']);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function validLink(link){
    // TODO
    return true;
}


// download once completed

function getTranscript(id) {

    fetch(transcript_download_url, download_params)
    .then(response => response.json())
    .then(data => {
        updateTranscript(data.text);
        //console.log(data.text);
   // print(data);
    })
    .catch((error) => {
    console.error(`Error: ${error}`);
    });
    // return 
}

function updateTranscript(transcript) {
    console.log(transcript);
    document.getElementById("transcript").innerText = transcript;
}


function transciptUploadSuccess(id) {
    console.log(id);
    document.getElementById("transcript").innerText = "yay, please wait";
    // will trigger the periodic refresh
}