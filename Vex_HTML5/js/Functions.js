const list = document.getElementById("msg_content")

const typeElement = document.getElementById("type")

let typeBool = true

let send = async(id, content) => {
  if(id == "vex"){
    log({id})
   await setTimeout(1500)
  }
  let base = document.createElement("li")

  base.setAttribute("class", "msg " + id)

  let msg_text = create_span()
  msg_text.setAttribute("class", "msg_text")
  msg_text.innerText = content

  let data = create_span()
  data.setAttribute("class", "data")
  data.innerText = getHours()

  base.appendChild(msg_text)
  base.appendChild(data)
  list.append(base)
  $(document).scrollTop($("#msg_content").height())
}

const create_span = () => {
  return document.createElement("span")
}

const setTyping = bool => {
  if (bool) {
    typeElement.style.display == ""
    typeElement.classList.add("show")
    typeElement.classList.remove("hide")
  } else {
    typeElement.classList.add("hide")
    typeElement.classList.remove("show")
    typeElement.style.display == "none"
  }
}

const getHours = () => {
  let date = new Date()
  return `${date.getHours()}:${date.getMinutes()}`
}

const saveData = () => {
  localStorage.setItem("db", JSON
    .stringify(db))
}

const clear = message => {
  //log({message })
  let split = message
    .replace(/<@.?[0-9]*?>/g, "")
    .replace("vex,", "")
    .replace("+v", "vex")
    .normalize('NFD')
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/[\u{0080}-\u{FFFF}]/gu, "")
    .replace(/[^A-Za-z \.,\?""!@#\$%\^&\*(\)-_=\+;:<>\/\\\|\}\{\[\]`~]/g, '')
    .replace(/[\u{0080}-\u{10FFFF}]/gu, "")
    .toLowerCase()
    .split(' ')
    .filter(e => String(e).trim())
  return split
}
