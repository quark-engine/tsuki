var editor;
var code;
function encodeBase64(str) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(str);

    return btoa(String.fromCharCode.apply(null, encodedData));
}

function decodeBase64(base64str) {
  const binaryStr = atob(base64str);

  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
  }

  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}


document.addEventListener('DOMContentLoaded', function() {
    editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        lineNumbers: true,
        mode: "javascript",
        theme: "default"
    });

    chrome.storage.local.get(null, function(items) {
        for (const key in items) {
          console.log(key, items[key])
            if (items.hasOwnProperty(key)) {
                let option = new Option(key, key);
                templateSelect.appendChild(option);
            }
        }
    });

  templateSelect.addEventListener("click", ()=>{
      const template = templateSelect.value;
      chrome.storage.local.get(template, items => {
          editor.setValue(items[template]);
      });
  });

  applybtn.addEventListener('click', function() {
    if(editor) {
      code = editor.getValue();
    }
    alert('Filter code applied!');
  });

  savebtn.addEventListener('click', function() {
    const templateName = prompt('Please enter the template name:');
    const templateCode = editor.getValue();
    chrome.storage.local.set({[templateName]: templateCode}, function() {
        let option = new Option(templateName, templateName);
        templateSelect.appendChild(option);
        alert('Template saved successfully!');
    });
  });

  deletebtn.addEventListener('click', function() {
    const templateName = templateSelect.value;
    chrome.storage.local.remove(templateName, function() {
        templateSelect.remove(templateSelect.selectedIndex);
        alert('Template deleted successfully!');
        editor.setValue('');
    });
  });

  sharebtn.addEventListener('click', async () => {
    const text = encodeBase64(editor.getValue());
    console.log(text);
    navigator.clipboard.writeText(text).then(function() {
        alert('saved to your clipboard! Paste it anywhere to share!');
    }, function(err) {
        alert('save to your clipboard failed: ', err);
    });
  });

  importbtn.addEventListener('click', function() {
    const shareCode = prompt('Please enter the code to import:');
    editor.setValue(decodeBase64(shareCode));
  });
});


chrome.devtools.network.onRequestFinished.addListener(request => {
  request.getContent((body) => {
      const dataToSend = {
          url: request.request.url,
          method: request.request.method,
          statusCode: request.response.status,
          content: body 
      };

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = chrome.runtime.getURL('sandbox.html');
      document.body.appendChild(iframe);
      iframe.onload = () => {
          iframe.contentWindow.postMessage({
              code: code,
              context: dataToSend
          }, '*');
      };
  });
});

