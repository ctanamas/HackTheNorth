// Transciption

const ASSEMBLYAI_API_KEY = "bea1078f699b4028b4cab02dc6adf101";
//let id = 'o91jt8pmpb-b317-4568-928f-cb478c7a9bac';
let transcript_download_url = 'https://api.assemblyai.com/v2/transcript/';//${id}`;


//ick?
let refreshTranscript = false;
const refreshPage =  setInterval(function() {getTranscript()}, 1000);
//setInterval(console.log("hi"), 1000);
//setInterval(console.log("hi")}, 1000);


const download_params = {
    headers: {
      "authorization": ASSEMBLYAI_API_KEY, //process.env.ASSEMBLYAI_API_KEY,
      "content-type": "application/json",
    },
    method: 'GET'
  };

// upload video to AssemblyAI
function uploadVideo(){
    let transcript_upload_url = 'https://api.assemblyai.com/v2/transcript';
    let audioUrl = document.getElementById("video-link").value;
    console.log(audioUrl);
    if(!validLink(audioUrl)) {
        alert("Please enter a valid mp3 or mp4 file URL.");
        // TODO say error with more detail
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
        alert("An unexpected error occured. Please refresh the page and try again.");
        console.error('Error:', error);
    });
}



// download once completed

function getTranscript() {
    if (!refreshTranscript) {
        return;
    }
    console.log("loading!");
    fetch(transcript_download_url, download_params)
    .then(response => response.json())
    .then(data => {
        updateTranscript(data);
    })
    .catch((error) => {
    console.error(`Error: ${error}`);
    });
}

// Updates the page with the transcript 
function updateTranscript(data) {
    switch (data.status) {
        case 'queued':
        case 'processing':
          console.log('AssemblyAI is still transcribing your audio, please try again in a few minutes!');
          break;
        case 'completed':
            console.log(data.text);
            document.getElementById("transcript").innerText = data.text;
            refreshTranscript = false;
          break;
        default:
          console.log(`Something went wrong :-( : ${data.status}`);
          break;
      }
    
}

// Triggers the loading page and starts the incremental refresh
function transciptUploadSuccess(id) {
    console.log(id);

    document.getElementById("transcript").innerText = "loading... (some animation), do not refresh page"; // make it the loading thing
    transcript_download_url = 'https://api.assemblyai.com/v2/transcript/' + id;
    console.log(transcript_download_url);
    refreshTranscript = true;
    // will trigger the periodic refresh??

}


function validLink(link){
    // TODO
    // check if the link is a valid mp3 or mp4 link
    return true;
}