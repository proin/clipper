var selector = '';
var remover = '';
var innerFind = '';
var attr = '';
var split = '';

chrome.extension.onMessage.addListener(function (request, sender) {
    if (request.action == "getSource") {
        var source = request.source;
        applySource(source);
    }
});

function applySource(source) {
    var html = '<table class="table table-bordered">';

    var isLastOpt = false;
    if (split.indexOf('last:') != -1) {
        isLastOpt = true;
        split = split.replace('last:', '');
    }

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

        if (finded.length > 0) {
            finded = finded.replace(/\t/gi, ' ');
            finded = finded.replace(/\n/gi, ' ');
            finded = finded.replace(/&nbsp;/gi, ' ');
            while (finded.indexOf('  ') != -1) finded = finded.replace(/  /gi, ' ');
            while (finded.indexOf(' ') == 0 && finded.indexOf(' ') != -1) finded = finded.substring(1, finded.length);
            while (finded.lastIndexOf(' ') == finded.length - 1 && finded.lastIndexOf(' ') != -1) finded = finded.substring(0, finded.length - 1);

            console.log(isLastOpt);

            if (finded.length > 0) {
                if (split.length > 0 && finded.indexOf(split) != -1) {
                    var findedSplit = finded.split(split);
                    html += '<tr>';
                    for (var i = 0; i < findedSplit.length; i++) {
                        if (isLastOpt) {
                            if (i == findedSplit.length - 1) {
                                html = html.substring(0, html.length - 1);
                                html += '</td><td>' + findedSplit[i] + '</td>';
                            } else if (i == 0) {
                                html += '<td>' + findedSplit[i] + '.';
                            } else {
                                html += findedSplit[i] + '.';
                            }
                        } else {
                            html += '<td>' + findedSplit[i] + '</td>';
                        }
                    }
                    html += '</tr>';
                } else {
                    html += '<tr><td>' + finded + '</td></tr>';
                }
            }
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
    $('#split-input').val(localStorage.split);

    $('#submit').click(function () {
        $('#result').html('');
        selector = $('#selector-input').val();
        remover = $('#remover-input').val();
        attr = $('#attr-input').val();
        innerFind = $('#inner-input').val();
        split = $('#split-input').val();

        localStorage.selector = selector;
        localStorage.remover = remover;
        localStorage.attr = attr;
        localStorage.innerFind = innerFind;
        localStorage.split = split;

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