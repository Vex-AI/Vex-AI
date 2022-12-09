const log = l => console.log(l)

const db = JSON.parse(localStorage
  .getItem('db')) ||
{
  "hi": "hiiii",
  "good mani": "mani?",
  "alright": "no, i'm broke",
  "hello": "no hello"
}

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
