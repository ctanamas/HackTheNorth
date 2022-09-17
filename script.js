// Using AssemblyAI API to transcribe a video into text
// Andrew Gocehco and Crystal Tanamas
// 2022 September 17

// Variables
const ASSEMBLYAI_API_KEY = "bea1078f699b4028b4cab02dc6adf101";
const TRANSCRIPT_URL = 'https://api.assemblyai.com/v2/transcript';
const CHAPTERS_URL = 'https://api.assemblyai.com/v2/transcript';

let refreshTranscript = false;
let transcriptID = '';
let summary = false;
const refreshPage =  setInterval(function() {getTranscript()}, 2000);

// HTML
{

}

// upload video to AssemblyAI
function uploadVideo(){
    let audioUrl = document.getElementById("video-link").value;
    console.log(audioUrl);
    if(!validLink(audioUrl)) {
        alert("Please enter a valid mp3 or mp4 file URL.");
        // TODO say error with more detail, maybe add that it can't be too long
        return;
    }
    data = {
        "audio_url" : audioUrl,
        "auto_chapters": true
    };

    upload_params = {
        headers:{
            "authorization": ASSEMBLYAI_API_KEY,
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
        method: "POST"
    };

    fetch(TRANSCRIPT_URL, upload_params)
    .then(response => response.json())
    .then(data => {
        transciptUploadSuccess(data['id']);
    })
    .catch((error) => {
        alert("An unexpected error occured. Please refresh the page and try again.");
        console.error('Error:', error);
    });
}


// Attempts to download the transcript from AssemblyAI
function getTranscript() {
    if (!refreshTranscript) {
        return;
    }

    console.log("loading!"); // remove
    let download_params = {
        headers: {
          "authorization": ASSEMBLYAI_API_KEY,
          "content-type": "application/json",
        },
        method: 'GET'
    };
    fetch(TRANSCRIPT_URL + "/" + transcriptID, download_params)
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
            console.log(data.chapters.length);//.text);
            console.log(data.chapters);
            document.getElementById("transcript").innerText = data.text;
            updateChapters(data.chapters);
            hideLoading();
            refreshTranscript = false;
          break;
        default:
          console.log(`Something went wrong :-( : ${data.status}`);
          alert("An unexpected error occured. Please refresh and try again."); // TODO explain
          refreshTranscript = false;
          break;
      }
}

function updateChapters(chapters){
    let HTMLContent = '';
    let chapLen = chapters.length;   
    
    // TODO if only one chap

    for (let i = 1; i <= chapLen; i++) {
        HTMLContent = HTMLContent + `
        <div class="" id='chapter${i}'>
            <div class="accordion-body-title">
            <h4>Chapter ${i}: ${chapters[i - 1].gist}</h4>
            </div>
            <div class="accordion-body-summary">
                <p>${chapters[i - 1].summary}</p>
            </div>
            <div class="accordion-body-takeaway">
                <p>${chapters[i - 1].headline}</p>
            </div>   
        </div>
        `; 
        // TODO add copy to clipboard

        
        document.getElementById('summary').innerHTML = (HTMLContent);
        
    }
}


// Triggers the loading page and starts the incremental refresh
function transciptUploadSuccess(id) {
    transcriptID = id;
    console.log("File upload success. transcriptID set to: " + id);
    // "triggers" the periodic refresh for transcript
    refreshTranscript = true;
   // document.getElementById("transcript").innerText = "loading... (some animation), do not refresh page"; // TODO make it the loading thing
  //  document.getElementById("summary").innerText = "loading... (some animation), do not refresh page"; 
    
    document.getElementById("loading").style.display = "block";

    // TODO check if empty
}

function hideLoading(){
    document.getElementById("loading").style.display = "none";
}

function validLink(link){
    // TODO
    // check if the link is a valid mp3 or mp4 link
    return true;
}