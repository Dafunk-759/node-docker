const socket = io()
const form = document.getElementById("form")
const input = document.getElementById("input")
const messages = document.getElementById("messages")

form.addEventListener("submit", e => {
  e.preventDefault()

  if (input.value) {
    socket.emit("chat message", input.value)
    input.value = ""
  }
})

socket.on("someone connected", msg => {
  console.log("someone connected")
  displayMsg(msg)
})

socket.on("chat message", msg => {
  console.log("chat message")
  displayMsg(msg)
})

const e = document.createElement.bind(document)

document.body.outerHTML
function displayMsg({ from, msg }) {
  const item = e("li")
  item.innerHTML = `
    <div class="msg">
      <div>${msg}</div>
      <div class="from">${from}</div>
    </div>
  `

  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight)
}
