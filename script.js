//función que genera un array de 10 objetos de preguntas
async function questionsGenerator (){
    let response = await fetch ('https://opentdb.com/api.php?amount=10&category=12&difficulty=easy&type=multiple');
    let data = await response.json();
    let results = data.results;
    return results;
   
}


async function pintarQuiz (){
    let questions = await questionsGenerator();

    // console.log(questions);
    
    questions.forEach((element => {
        let title = element.question;
        let correct = element.correct_answer;
        let incorrect = element.incorrect_answers;

                    console.log(title)
                    console.log(correct)
                    console.log(incorrect)

        //template string para generar formulario, dentro de la función porque cuando haga el fetch es cuando se pintan

        let form = document.getElementById('formulario');
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

                    <input type="button" value="Back" class="quizbutton" id="back">
                    <input type="button" value="Checked" class="quizbutton" id="checked">
                    <input type="button" value="Next" class="quizbutton" id="next">`;

    
    }));  
}

pintarQuiz();


//funcionalidad botones 

//<button class="quizbutton" id="startHome" type="submit">Start Quiz!</button>
document.getElementById('startHome').addEventListener('submit', function(event){
    event.preventDefault();
    let nombre = event.target.name.value; 
    localStorage.setItem('players',`${nombre}`)

})



//validacionesks
let form = document.getElementById('formulario');
let score = 0; //se irá sumando si la pregunta es correcta. luego este score se pinta en la tabla

//cómo validar? if input checked === ans1 {score++} else if input checked === ans 2,3,4 {score + 0}
                



