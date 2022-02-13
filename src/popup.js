function makeid(length) {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function success(uri) {
    console.log('Rewriting on success')
    document.getElementById('status').innerText = 'Ссылка успешно создана и помещена в буфер!'
    link_element = document.getElementById('link')
    link_element.text = uri
    link_element.href = uri
    navigator.clipboard.writeText(uri)
}

function fail() {
    console.log('Rewriting on fail')
    document.getElementById('status').innerText = 'Ошибка =('
    document.getElementById('link').text = ''
    document.getElementById('link').href = ''
}

async function create_link() {
    let options = await chrome.storage.local.get(['url', 'token'])
    let api_url = options['url'] || 'https://to.dyakov.space'
    let token = options['token'] || ''
    let short = makeid(6)
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    let tab_uri = undefined
    try { tab_uri = tab.url }
    catch {
        fail()
        console.error('Fail to get URL')
        return
    }
    let request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ url_to: tab_uri })
    }
    let response = undefined

    console.log(`Request to ${api_url}/${token}/url/${short}`)
    console.log(request)
    try {
        response = await fetch(`${api_url}/${token}/url/${short}`, request)
        console.log(response)
        if (response.status === 201) { success(`${api_url}/${short}`) } else { fail() }
    }
    catch { fail() }
}

window.onload = create_link
