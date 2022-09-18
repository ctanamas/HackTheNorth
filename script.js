// Using AssemblyAI API to transcribe a video into text
// Andrew Gocehco and Crystal Tanamas
// 2022 September 17

// Variables
const ASSEMBLYAI_API_KEY = ""; // PUT YOUR KEY HERE
const TRANSCRIPT_URL = 'https://api.assemblyai.com/v2/transcript';

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
        //alert("Please enter a valid mp3 or mp4 file URL.");
        // TODO say error with more detail, maybe add that it can't be too long
        return;
    }
    if(!validLink(audioUrl)) {
        //alert("Please enter a valid mp3 or mp4 file URL.");
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
        hideLoading();
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
    alert("An unexpected error occured. Please refresh and try again.");
    hideLoading();
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
            document.getElementById("transcript").innerText = data.text;
            updateChapters(data.chapters);
            hideLoading();
            // expand both and say success! and feel free to try again
            //alert("Success! Please view results by expanding the transcript and summary.");
            document.getElementById("collapseOne").classList.add('show');
            document.getElementById("collapseTwo").classList.add("show");
            document.getElementById("transcript").ariaExpanded = 'true';
            document.getElementById("summary").ariaExpanded = 'true';
            refreshTranscript = false;
          break;
        default:
          console.log(`Something went wrong :-( : ${data.status}`);
          alert("An unexpected error occured. Please refresh and try again."); // TODO explain
          hideLoading();
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

// copy transcript
function copyTranscript() {
    navigator.clipboard.writeText(document.getElementById("transcript").innerText);
    alert("Transcript copied to clipboard!");
}

// copy summary
function copySummary() {
    navigator.clipboard.writeText(document.getElementById("summary").innerText);
    alert("Summary copied to clipboard!");
}

// Triggers the loading page and starts the incremental refresh
function transciptUploadSuccess(id) {
    transcriptID = id;
    console.log("File upload success. transcriptID set to: " + id);
    // "triggers" the periodic refresh for transcript
    refreshTranscript = true;
    
    document.getElementById("loading").style.display = "block";

    // TODO check if empty
}

function hideLoading(){
    document.getElementById("loading").style.display = "none";
}

function validLink(link){
    
   //let ending = link.substring(link.length - 4); // 3 chars
   // alert(ending);
    if (link = "") {
        alert("Please enter a link.");
        return false;
    } 
    return true;
    
    /*
    else {
        let validTypes = [".webm",".MTS",".M2TS",".TS",".mov",".mp2",".mp4",".m4p",".m4v",".mxf",".3ga",".8svx",".aac",".ac3"
,".aif",".aiff",".alac",".amr",".ape",".au",".dss",".flac",".flv",".m4a",".m4b",".m4p"
,".m4r",".mp3",".mpga",".ogg",".oga",".mogg",".opus",".qcp",".tta",".voc",".wav",".wma",".wv"]
        let len = validTypes.length;
        for (let i = 0; i < len; i++) {
            if (ending === validTypes[i]) return true;
        }
        alert("Please ensure the link is to a audio or video file type.");
        return false;
    }*/
}



