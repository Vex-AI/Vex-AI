const inputData = (result_array) => {
  let p = -1;
  for (let index in result_array) {
    p++;
    let result_index = vex.getAnswer(result_array[index]);

    if (result_index != null) {
      return result_index;
    }

    if (p == result_array.length - 1) {
      return null;
    }
  }
};

