class Answer {
  constructor(no_answer){
    this.no_answer = no_answer
  }
  
  addPhrase(phrase){
    this.no_answer.push(phrase)
  }
  
  notFound(){
   let ps = this.no_answer[Math.floor(Math.random()*this.no_answer.length)]

  return ps
  }
  
  removePhrase(index){
   delete this.no_answer[index] 
  }
}

const noAnswer = new Answer(no_answer)