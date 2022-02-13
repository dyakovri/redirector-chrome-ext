async function save_options() {
    await chrome.storage.local.set({
        url: document.getElementById('url').value,
        token: document.getElementById('token').value
    })
}

async function load_options() {
    options = await chrome.storage.local.get(['url', 'token'])
    document.getElementById('url').value = options['url'] || 'https://to.dyakov.space'
    document.getElementById('token').value = options['token'] || ''
}

document.getElementById('save-button').onclick = save_options
window.onload = load_options
