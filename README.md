# VexIA-web
Vex is an AI to talk to anyone, including lonely people.
<br>
<br>
This project is an improved version of other existing versions that are not available for countries outside of Brazil.   This system is simple **for now**, does not have neural networks and is just a logical system. <br>
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
Check if a word in a sentence exists | Yes
Machine learning | Not for no
## Documentation

### Create database

##### const vex = new Database(Object)

-This code instances a new database where you pass an object with keys and values as your database 

```js
//Sample data
const obj = {
"hi":"hello
}

//Create database
const vex = new Database(obj)
```
### Put value
##### vex.putData(key, value)
-Add a value to your database 
```js
vex.putData("john","is cool")
```
### Remove value
- Remove a value from your database if that value exists (keys only) 
- ```js
- vex.removeData(value)
- ```
