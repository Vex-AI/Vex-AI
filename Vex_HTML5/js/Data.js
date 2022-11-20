const log = l => console.log(l)

const db = JSON.parse(localStorage
  .getItem('db')) ||
{
  "hi": "hiiii",
  "good mani": "mani?",
  "alright": "no, i'm broke",
  "hello": "no hello"
}


const no_answer = [
  "I didn't understand =(",
  "I don't have an answer... ",
  "Wha..what is this?? (⊙_⊙)"
]

const synons = [
  [ "hi",
    "oi",
    "konnichiwa",
    "hola",
    "ugly"
  ],
  [
    "alright",
    "right",
    "aurait"
  ]
]
