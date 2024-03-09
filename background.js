chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "loadGoogleMaps") {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            files: ['content.js'] // Script to dynamically load Google Maps API
        });
    }
});
  
  function injectGoogleMapsScript(apiKey) {
    if (!document.querySelector(`[src*="maps.googleapis.com"]`)) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      document.head.appendChild(script);
    }
  }
  