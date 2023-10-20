async function questionsGenerator() {
  let response = await fetch(
    "https://opentdb.com/api.php?amount=10&category=12&difficulty=easy&type=multiple"
  );
  let data = await response.json();
  let results = data.results;
  console.log(results)
  return results;
  
 
}

async function startQuiz(){
  let preguntas = await questionsGenerator();
  console.log(preguntas);
  return preguntas;
}

async function pintarQuiz() {
    let start = await questionsGenerator();
    console.log(start);
    start.forEach((element) => {
    let title = element.question;
    let correct = element.correct_answer;
    let incorrect = element.incorrect_answers;


    //template string para generar formulario, dentro de la función porque cuando haga el fetch es cuando se pintan

    let form = document.getElementById("formulario");
    form.innerHTML = `<section id="container">
                    <h1>${title}</h1>
                    <label for="asn1" id="opt1" clas="answers">${correct}</label>
                    <input type="radio" name="answer" id="ans1">

                    <label for="ans2" id="opt2" clas="answers">${incorrect[0]}</label>
                    <input type="radio" name="answer" id="ans2">


                    <label for="ans3" id="opt3" clas="answers">${incorrect[1]}</label>
                    <input type="radio" name="answer" id="ans3">

                    <label for="ans4" id="opt4" clas="answers">${incorrect[2]}</label>
                    <input type="radio" name="answer" id="ans4">

                    </section>

                    <input type="button" value="Atrás" class="quizbutton" id="anterior">
                     
                    <input type="submit" value="Siguiente" class="quizbutton" id="siguiente">`; 
  });
}


// funcionalidad botones 

// botón log in
if(document.title === 'Jukebox Quiz - Home'){
  document
    .getElementById("userGame")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      let recoveredData = JSON.parse(localStorage.getItem("players"));
      let nombre = event.target.nombre.value;
      let player = [{ name: nombre }];
      
      if (recoveredData === null) {
        localStorage.setItem("players", JSON.stringify(player));
      } else {
          let newPlayer = { name: nombre };
        
        recoveredData.push(newPlayer);
        localStorage.setItem("players", JSON.stringify(recoveredData));
      }

      window.location.href = './question.html';
      

      
    });

} 
if(document.title === 'Quiz'){
  startQuiz();
 
}
pintarQuiz();


// //botón next

// async function moveFoward(){
//     let nextQuestion = await pintarQuiz(); 
//     return nextQuestion;

// }

// document
//     .getElementById("formulario")
//     .addEventListener("submit", function (event) {
//         moveFoward(); 
        
      
//     });


// /* <input type="button" value="Checked results!" class="quizbutton" id="resultado"></input> */



//<button class="boton" type="submit"><a href="./question.html">Start Quiz!</a></button>
//validacionesks
//let form = document.getElementById("formulario");
//let score = 0; //se irá sumando si la pregunta es correcta. luego este score se pinta en la tabla

//cómo validar? if input checked === ans1 {score++} else if input checked === ans 2,3,4 {score + 0}


