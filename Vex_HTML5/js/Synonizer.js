class Synonizer {
  constructor(synons){
    this.synons = synons
  }
  
  putData(word, index) {
    this.synons[index].push(word)
  }
  
  removeData(word, index) {
    let size = this.synons[index].length 
    
 this.synons[index] = this.synons[index].filter(value=>{
    
    if(value == word){
      return false
    }
    return true
  })
  if(size == this.synons[index].length) return false
  return true
  }
  
  
  getSynons(word) {
 for(let wd in this.synons){
 	if(this.synons[wd].includes(word)){
	return this.synons[wd];
		}
	}
	return null;
}


}

const Synon = new Synonizer(synons)
