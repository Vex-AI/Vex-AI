# VexIA
Vex is an AI to talk to anyone, including lonely people.
<br>
<br>
This system is simple **for now**, does not have neural networks and is just a logical system. <br>
<br>
The project is open source and licensed with [GPL-3.0 LICENSE](LICENSE) to receive future contributions and improvements from the community, the icons under [CC-BY-NC 2.0](https://creativecommons.org/licenses/by-nc/2.0/legalcode) license, check out [Vex Reactions](https://github.com/cookieukw/Vex-Reactions).
<br>
<br>
The goal of this project is to one day have an AI capable of talking normally to a person, without errors or with minimal errors and who knows... be a conscious AI
<br>
<br>
Feature  | Support
-|-
Database|Not for now 
Api | Not for now
Synonyms | Yes
React | Yes
Check if a word in a sentence exists | Yes
Machine learning | Not for now
# Documentation

## Database class
### Instantiate class
##### const vex = new Database(Object)

- This code instances a new database class where you pass an object with keys and values as your database 

```js
//Sample data
const sample_data =  [{
message: [
"hi",
"hello",
"hola",
"oi",
"hola"],
answer: [
"hiii ╰(*´︶`*)╯♡",
"alright?",
"こんばんは",
"oi",
"hola"
]}]

//Create database
const vex = new Database(sample_data)
```
### Put value
##### Database.putSynon(message, answer, isRecorded)
- Add a message with an answer to your database, if the message does not exist then it will be written and will return true 
- If the third parameter is true and the recorded value exists, it writes the passed value asswer, otherwise it returns false 
```js
const message = "john"
const answer = "is cool"

Database.putData(message, answer, false)
```
### Remove message
##### Database.removeData(message)
- Remove a message from your database if that value exists. If the message is removed, it returns true and returns false whenever the message does not exist (delete something that does not exist) 
 ```js
 const message = "hi"

 vex.removeData(message)
 ```
### Get answer to a message
##### Database.getAnswer(message)
- Checks whether each index exists in the database and returns an answer. otherwise returns null. The system also automatically checks for synonyms (that's why the messages are in an array) 
```js
const message_array = ["hello","world","!!!"]

vex.getAnswer(message_array)
//["hello", world", "!!!"]
// check hello, world and !!!

vex.getAnswer([message_array.join(" ")])
// ["hello world !!!"]
// put the sentence together and check it only 

```
### Get Synonyms 
##### Database.getSynons(message)
- Checks if the message passed has variants and returns an array with all of them, if not, returns null. works similarly to the previous method but returns all synonyms instead of an answer 

```js
const word = "hi"
const synons = Database.getSynons(word)
//["hi","hello","hola","oi","hola"]

```
## Answer class
### Instantiate  a classe answer
##### const noAnswer = new Answer(Array)
- This code instantiates a new "Answer" class so we can easily write and retrieve sentences 
```js
//Sample data
const no_answer_list = [
"Não entendi",
"i didnt  understand",
"うるさい",
"Silencio"
]
const noAnswer = new Answer(no_answer_list)
```

### Add a phrase to Answer
##### Answer.AddAnswer(String)
- Add a phrase to our catalog of phrases that Vex will say when it doesn't know an answer 
```js
const ph = "I didn't understand"

noAnswer.addAnswer(ph)
```
### Get random answer
##### Answer.getAnswer()
- Get a random phrase for our array
```js
const anything = noAnswer.getAnswer()
//random value
```
### Remove by an index
##### Answer.removeAnswer(int)
- Remove a phrase by an index
```js
const index = 0
noAnswer.removeAnswer(index)
```
### Set data
##### Answer.setData(array)
- Change all the contents of the class 
```js
const newData = ["no","..."]
noAnswer.setData(newData)
```
<br>
<br>

## Basic functions that existed in the Java version (discontinued) and that need to be added here

- Save the database, messages etc
- Load and show all database, messages etc 
- Add synonyms and answers
- Remove synonyms, answer, messages etc
- Change name and profile  
- Delete all answers, synonyms etc
- Export data(messages, database, etc)
- Customize the chat 
- Customize the background 
## Feature ideas to be added in the future(or not )
Feature|Use
-|-
Custom animations|Customize animations in chat itens, database etc
Machine learning | Make Vex learn on its own 
API | Make some resources available through an api
"Global user"| A chat where people talk to vex (no interactions or global messages) but this serves as global training and not local (in the client) 
RPG story | Able to tell stories or run an rpg 
## Libraries
Library|
-|
[Eva icons](https://akveo.github.io/eva-icons/#/?type=fill&searchKey=add) | 
[Octicons](https://primer.github.io/octicons/paper-airplane-16) |
[Load react animations](https://loader-demo.netlify.app/)|
[React-toastify](https://fkhadra.github.io/react-toastify/installation/)


