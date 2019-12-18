console.log("background loaded")
//This background script can be streamlined, made so that it only runs on facebook 
//realted pages, or when the url changes to a relevant page ??


//Add a listener which triggers when tab is updated.
//If the url has changed, send a message to active content scripts.
//This will trigger a reset of the mutation observer on messenger sites.
chrome.tabs.onUpdated.addListener(
	function(tabId, changeInfo, tab) {
		

	    if (changeInfo.url != null) {
	    	chrome.tabs.sendMessage(tabId, {
	   			url: changeInfo.url
			});
	    }
  }
);



function send(tab, newUrl){
	console.log("The tab function did something lol")
	chrome.tabs.sendMessage(tab, {
	   	url: newUrl
	});
}
