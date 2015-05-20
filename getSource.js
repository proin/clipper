function get_source(document_body) {
    return document_body.innerHTML;
}

chrome.extension.sendMessage({
    action: "getSource",
    source: get_source(document.body)
});