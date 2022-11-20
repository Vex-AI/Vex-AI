const inputData = result_array => {
  let p = -1
  for (let index in result_array) {
    p++
    let result_index = vex.getAnswer(result_array[index])

    if (result_index != null) {
      return result_index
    }

    if (p == result_array.length - 1) {
      return null
    }
  }
}

/*******/
const sendBtn = document.getElementById('send')

const inputText = document.getElementById('text')

const addDialog = document.querySelector("dialog")

const addAnswer = document.querySelector("#save")

const cancelDialog = document.querySelector("#dialog_cancel")

const saveDialog = document.querySelector("#dialog_save")

const inputDialogAnswer = document.querySelector("#dialog_answer")

const inputDialogMessage = document.querySelector("#dialog_message")
/******/


//Listeners

sendBtn.addEventListener("click", () => {

  let txt = clear(inputText.value)

  send("user", inputText.value)
  inputText.value = ""

  let res = inputData(txt)

  if (res != null) return send("vex", res)

  res = inputData([txt.join(" ")])

  if (res != null) return send("vex", res)

  for (let word in txt) {
    let list_anons = Synon.getSynons(txt[word])

    for (let anon in list_anons) {

      txt = txt.map((item) => {

        if (item == txt[word]) return list_anons[anon]
        return item

      })

      let data = inputData(txt)
      if (data != null) return send("vex", data)
    }

  }
  send("vex", noAnswer.notFound())
})



addAnswer.addEventListener("click", () => {
  addDialog.showModal()
})

cancelDialog.addEventListener("click", () => {
  addDialog.close()
})

saveDialog.addEventListener("click", () => {

  const ans_value = inputDialogAnswer.value.trim().toLowerCase()

  const msg_value = inputDialogMessage.value.trim().toLowerCase()

  if (!ans_value) return
  if (!msg_value) return

  vex.putData(msg_value, ans_value, true)
  saveData()
  addDialog.close()
})
