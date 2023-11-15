const button = document.querySelector('#btn1')

button.addEventListener('click', grabData)

async function grabData() {
    const result = await fetch('http://localhost:1337/api/skaters_tricks/1')
    const data = await result.json()

    createDiv(data)
}

function createDiv(arr) {
    arr.forEach(element => {
        const div = document.createElement('div')
        div.textContent = element.name
        document.body.appendChild(div)
    });
}