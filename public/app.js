const button = document.querySelector('#btn1')
const container = document.querySelector('#container')
button.addEventListener('click', grabData)

async function grabData() {
    const result = await fetch('http://localhost:1337/api/skaters_tricks/1')
    const data = await result.json()
    console.log(data)
    createDiv(data)
}

function createDiv(arr) {
    arr.forEach(element => {
        const div = document.createElement('div')
        div.textContent = element.trick_name
        container.appendChild(div)
        // console.log(element)
    });
}