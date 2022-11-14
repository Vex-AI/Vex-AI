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
React | Not for now
Check if a word in a sentence exists | Yes
Machine learning | Not for now
## Documentation

### Instantiate database

##### const vex = new Database(Object)

- This code instances a new database where you pass an object with keys and values as your database 

```js
//Sample data
const obj = {
"hi":"hello"
}

//Create database
const vex = new Database(obj)
```
### Put value
##### Database.putData(message, answer, boolean)
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
- Checks if there is an answer for the value(message) passed and if not, returns false (if there is, true ) 
```js
const message = "hi"

vex.getAnswer(message)
```
### Instantiate a synonym
##### const Synon = new Synonizer(array)
- This code instances a synonyms class 
```js
//Sample synonyms data
const synons_list = [

["hi","hello","hola","oi"],

["good","alright","right"]

]

//Create synonizer
const Synon = new Synonizer(synons_list)

```
### Get Synonyms 
##### Synonizer.getSynons(message)
- Checks if the message passed has variants and returns an array with all of them, if not, returns null 

```js
const word = "hi"
const synons = Synonizer.getSynons(word)
//["hi","hello","hola","oi"]

```
### Instantiate  a classe answer
##### const noAnswer = new Answer(Array)
- This code instantiates a new "Answer" class so we can easily write and retrieve sentences 
```js
//Sample data
const no_answer_list = [
"...",
"bruh",
"lol",
"i didnt  understand"
]
const noAnswer = new Answer(no_answer_list)
```

### Add a phrase to Answer
##### Answer.AddPhrase(String)
- Add a phrase to our catalog of phrases that Vex will say when it doesn't know an answer 
```js
const ph = "I didn't understand"

noAnswer.addPhrase(ph)
```
### Get random answer
##### Answer.notFound()
- Get a random phrase for our array
```js
const anything = noAnswer.notFound()
```
### Remove by an index
##### Answer.removePhrase(int)
- Remove a phrase by an index 0
```js
const index = 0
noAnswer.removePhrase(index)
```
