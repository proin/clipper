var selector = '';

chrome.extension.onMessage.addListener(function (request, sender) {
    if (request.action == "getSource") {
        var source = request.source;
        applySource(source);
    }
});

function applySource(source) {
    var html = '<table class="table table-bordered">';

    $(source).find(selector).each(function () {
        var finded = $(this).text();

        finded = finded.replace(/\t/gi, ' ');
        finded = finded.replace(/\n/gi, ' ');
        finded = finded.replace(/&nbsp;/gi, ' ');
        while (finded.indexOf('  ') != -1) finded = finded.replace(/  /gi, ' ');
        while (finded.startsWith(' ')) finded = finded.substring(1, finded.length);
        while (finded.endsWith(' ')) finded = finded.substring(0, finded.length - 1);

        if (finded.length > 1)
            html += '<tr><td>' + finded + '</td></tr>';
    });

    html += '</table>'
    $('#result').html(html);
}

function onWindowLoad() {
    $('#submit').click(function () {
        selector = $('#selector-input').val();
        findList();
    });
}

function findList() {
    chrome.tabs.executeScript(null, {
        file: "getSource.js"
    }, function () {
        if (chrome.extension.lastError) {
            document.body.innerText = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
        }
    });
}

window.onload = onWindowLoad;