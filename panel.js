
chrome.devtools.network.onRequestFinished.addListener((request) => {
  console.log(request);
});