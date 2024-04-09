var filter = "";
// 獲取輸入欄位和顯示值的元素
const inputField = document.getElementById('inputField');
const displayValue = document.getElementById('displayValue');

inputField.addEventListener('input', function(event) {
    filter = event.target.value;
    displayValue.textContent = filter;
});


chrome.devtools.network.onRequestFinished.addListener((request) => {
  request.getContent((content) => {
    console.log(filter);
    if (content && content.includes(filter)) {
      console.log(content);
    }
  });
});