// Transciption
//import 'dotenv/config';
//import fetch from 'node-fetch';

let id = 'o91jt8pmpb-b317-4568-928f-cb478c7a9bac';
const url = `https://api.assemblyai.com/v2/transcript/${id}`;

const params = {
    headers: {
      "authorization": "", //process.env.ASSEMBLYAI_API_KEY,
      "content-type": "application/json",
    },
    method: 'GET'
  };

function getTranscript(id) {

    fetch(url, params)
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