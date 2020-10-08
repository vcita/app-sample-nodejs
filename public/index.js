function not_installed() {
    $('#status')[0].innerText = 'App is not installed'
    $('#business_uid')[0].innerText = ''
    $('#token')[0].innerText = ''
    $('#data')[0].innerText = ''
}

function installed(business_uid, token) {
    $('#status')[0].innerText = 'App is installed'
    $('#business_uid')[0].innerText = business_uid
    $('#token')[0].innerText = token
}

// eslint-disable-next-line no-unused-vars
function init() {
    $.ajax({
        url: '/status',
        type: "GET",
        success: function (result) {
            if (result.token)
                installed(result.business_uid, result.token)
            else
                not_installed()
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(`${textStatus}, ${errorThrown}`)
        }
    });
}

// eslint-disable-next-line no-unused-vars
function uninstall() {
    $.ajax({
        url: '/uninstall',
        type: "POST",
        success: function () {
            not_installed()
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(`${textStatus}, ${errorThrown}`)
        }
    });
}

// eslint-disable-next-line no-unused-vars
function user_info() {
    const token = $('#token')[0].innerText
    if (!token) {
        alert('App is not installed')
        return
    }

    $.ajax({
        url: `/user_info?token=${token}`,
        type: "GET",
        success: function (result) {
            $('#data')[0].innerText = JSON.stringify(result, undefined, 2)
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(`${textStatus}, ${errorThrown}`)
        }
    });
}

// eslint-disable-next-line no-unused-vars
function clients() {
    const token = $('#token')[0].innerText
    if (!token) {
        alert('App is not installed')
        return
    }

    $.ajax({
        url: `/clients?token=${token}`,
        type: "GET",
        success: function (result) {
            $('#data')[0].innerText = JSON.stringify(result, undefined, 2)
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(`${textStatus}, ${errorThrown}`)
        }
    });
}
