var editor;
var code;

document.addEventListener('DOMContentLoaded', function() {
    editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        lineNumbers: true,
        mode: "javascript",
        theme: "default"
    });
});

applybtn.addEventListener('click', function() {
  if(editor) {
    code = editor.getValue();
  }
  alert('Filter code applied!');
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

