var selector = '';
var remover = '';
var innerFind = '';
var attr = '';

chrome.extension.onMessage.addListener(function (request, sender) {
    if (request.action == "getSource") {
        var source = request.source;
        applySource(source);
    }
});

function applySource(source) {
    var html = '<table class="table table-bordered">';

    $(source).find(selector).each(function () {
        var finded = '';
        var tmp = $(this);
        if (remover.length > 0)
            $(this).find(remover).each(function () {
                $(this).remove();
            });

        if (attr == 'text') {
            if (innerFind == null || innerFind.length == 0) {
                finded = tmp.text();
            } else {
                tmp.find(innerFind).each(function () {
                    finded += $(this).text() + ',';
                });
                if (finded.lastIndexOf(',') == finded.length - 1) finded = finded.substring(0, finded.length - 1);
            }
        } else {
            if (innerFind == null || innerFind.length == 0) {
                finded = tmp.attr(attr) + '';
            } else {
                tmp.find(innerFind).each(function () {
                    finded += $(this).attr(attr) + ',';
                });
                if (finded.lastIndexOf(',') == finded.length - 1) finded = finded.substring(0, finded.length - 1);
            }
        }

        console.log(finded);

        if (finded.length > 0) {
            finded = finded.replace(/\t/gi, ' ');
            finded = finded.replace(/\n/gi, ' ');
            finded = finded.replace(/&nbsp;/gi, ' ');
            while (finded.indexOf('  ') != -1) finded = finded.replace(/  /gi, ' ');
            while (finded.indexOf(' ') == 0) finded = finded.substring(1, finded.length);
            while (finded.lastIndexOf(' ') == finded.length - 1) finded = finded.substring(0, finded.length - 1);

            if (finded.length > 0)
                html += '<tr><td>' + finded + '</td></tr>';
        }
    });

    html += '</table>'
    $('#result').html(html);
}

function onWindowLoad() {
    $('#selector-input').val(localStorage.selector);
    $('#remover-input').val(localStorage.remover);
    $('#attr-input').val(localStorage.attr);
    $('#inner-input').val(localStorage.innerFind);

    $('#submit').click(function () {
        $('#result').html('');
        selector = $('#selector-input').val();
        remover = $('#remover-input').val();
        attr = $('#attr-input').val();
        innerFind = $('#inner-input').val();

        localStorage.selector = selector;
        localStorage.remover = remover;
        localStorage.attr = attr;
        localStorage.innerFind = innerFind;

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