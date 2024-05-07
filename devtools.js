const defaultTemplate = {
  "Normal Filter(url)": "if(url.includes('NEEDCHANGE')) {\n  console.log(url);\n}",
  "Normal Filter(content)": "if(content.includes('NEEDCHANGE')) {\n  console.log(url);\n}"
}

chrome.devtools.panels.create('demo panel', 'icon.png', 'panel.html', () => {
  console.log('user switched to this panel');
  chrome.storage.local.clear(()=>{
    console.log('Cleared storage');
  });
  chrome.storage.local.set(defaultTemplate, ()=>{
    console.log('Default template set.');
  });
});
