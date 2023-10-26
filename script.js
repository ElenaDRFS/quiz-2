//Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
//TODO: Add SDKs for Firebase products that you want to use
//https://firebase.google.com/docs/web/setup#available-libraries


//CONECTAR FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBpkER-BUrmgpsetSxLVGzIrL5TIc7kg5w",
  authDomain: "prueba-autenticacion-y-mas.firebaseapp.com",
  projectId: "prueba-autenticacion-y-mas",
  storageBucket: "prueba-autenticacion-y-mas.appspot.com",
  messagingSenderId: "666047643817",
  appId: "1:666047643817:web:8e83a258e9c2867b3329b8"
};

//Initialize Firebase
const app = initializeApp(firebaseConfig);
//Initialize Auth
const auth = getAuth();
const user = auth.currentUser;
//Initialize DDBB
const db = getFirestore(app);
//Initialize cloudstore
const storage = getStorage();


//VARIABLES
let preguntas = [];
let correctas = [];
let page = 0;
let score = 0;
let fecha = new Date;
fecha = fecha.toDateString();




//// ______________ REGISTO LOGIN Y AUTENTICATION _____________________


const signUpForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const logout = document.getElementById('logout');
let loginEmail;

console.log(signUpForm, loginForm);

if (document.title == "Jukebox Quiz - Home") {

  //SignUp function
  signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let signUpEmail = document.getElementById('signup-email').value;

    //almacenamos ese email en LOCALSTORAGE
    let guardar = JSON.parse(localStorage.getItem("mails"));
    let mail = [{ email: signUpEmail }];

    if (guardar === null) {
      localStorage.setItem("mails", JSON.stringify(mail));
    } else {
      let newEmail = { email: signUpEmail };

      guardar.push(newEmail);
      localStorage.setItem("mails", JSON.stringify(guardar));
    }


    const signUpPassword = document.getElementById('signup-pass').value;
    const signUpUser = document.getElementById('signup-user').value;
    const usersRef = collection(db, "users");


    try {
      //Create auth user
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
        .then((userCredential) => {
          console.log('User registered')
          const user = userCredential.user;
          signUpForm.reset();
          let userData = document.getElementById('user-data');
          userData.style.cssText = 'display:block; background-color: #73AB84;width: 50%;margin: 2rem auto;padding: 1rem;border-radius: 5px;display: flex;flex-direction: column;align-items: center';
          userData.innerHTML = `<h3>Welcome!</h3>
                              <p>Username: ${signUpUser}</p>
                              <p>Now you are ready to play!</p>
                              <button id="startQuiz"class="quizbutton" type="click"><a href="./question.html">Play!</a></button>`
          document.getElementById("signup-form").style.display = "none";
          document.getElementById("user-data").style.cssText = 'display: block; background-color: #ffcfd2; width: 75%; margin: auto; padding: 5px;';
        })
      //Create document in DB
      await setDoc(doc(usersRef, signUpEmail), {
        username: signUpUser,
        email: signUpEmail,
      })


    } catch (error) {
      console.log('Error: ', error)
    }

  })


  //Login function
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginEmail = document.getElementById('login-email').value;



    //almacenamos ese mail en LOCAL STORAGE
    let guardar = JSON.parse(localStorage.getItem("mails"));
    let mail = [{ email: loginEmail }];

    if (guardar === null) {
      localStorage.setItem("mails", JSON.stringify(mail));
    } else {
      let newEmail = { email: loginEmail };

      guardar.push(newEmail);
      localStorage.setItem("mails", JSON.stringify(guardar));
    }



    const loginPassword = document.getElementById('login-pass').value;
    let userData = document.getElementById('user-data');
    console.log(userData);
    //Call the collection in the DB
    const docRef = doc(db, "users", loginEmail);
    //Search a document that matches with our ref
    const docSnap = await getDoc(docRef);

    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((userCredential) => {
        console.log(userCredential);
        console.log('User authenticated')
        loginForm.reset();
      })
      .then(() => {

        if (docSnap.exists()) {
          userData.style.cssText = 'display: block; background-color: #ffcfd2; width: 75%; margin: auto; padding: 5px;';
          userData.innerHTML = `<h3>Welcome!</h3>
                              <p>Username: ${docSnap.data().username}</p>
                              <p>Email: ${docSnap.data().email}</p>
                              <p>Now you are ready to play!</p>
                              <button id="startQuiz"class="quizbutton" type="click"><a href="./question.html">Play!</a></button>
                             `
          userData.style.display = "block";
          document.getElementById("registrar").style.display = "none";
          document.getElementById("login-form").style.display = "none";
          document.getElementById("scoresBox").style.display = "block";

          //GRAFICA USUARIO LOGUEADO


          let localData = JSON.parse(localStorage.getItem('mails'));
          console.log(localData);
          let fechasGrafica = [];
          let scoreGrafica = [];
          for (let i = 0; i < localData.length; i++) {
            if (localData[i]["email"] == loginEmail) {
              fechasGrafica.push(localData[i]["fecha"]);
              scoreGrafica.push(localData[i]["score"]);
            };

          }

          for (let j = 0; j < scoreGrafica; j++) {
            scoreGrafica[j].split(",", 4);
          };



          console.log(fechasGrafica, scoreGrafica);



          const ctx = document.getElementById('myChart');
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: [`${fechasGrafica[0]}`, `${fechasGrafica[1]}`, `${fechasGrafica[2]}`, `${fechasGrafica[3]}`],
              datasets: [{
                label: 'Correct Answers',
                data: [`${scoreGrafica[0]}`, `${scoreGrafica[1]}`, `${scoreGrafica[2]}`, `${scoreGrafica[3]}`],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              aspectRatio: 1 | 1,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });

        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        document.getElementById('msgerr').innerHTML = 'Invalid user or password';
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Código del error: ' + errorCode);
        console.log('Mensaje del error: ' + errorMessage);
      });
  })

  //Logout function
  logout.addEventListener('click', () => {
    let userData = document.getElementById('user-data');
    signOut(auth).then(() => {
      console.log('Logout user')
      userData.style.cssText = '';
      userData.innerHTML = ``;
    }).catch((error) => {
      console.log('Error: ', error)
    });
  })

  //Observe the user's state
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log('Logged user');
    } else {
      console.log('No logged user');
    }
  })


}



//// ______________ FUNCIONES _____________________





//VALIDA PREGUNTAS Y MANDA A FIRESTORE
function submitForm() {
  document.getElementById("check").addEventListener('click', async function (event) {
    event.preventDefault();
    let respuesta = document.querySelector(`input[name=answer]:checked`).value;
    if (respuesta == "r3") {
      score++
      console.log(score);
    }

    let playersMails = JSON.parse(localStorage.getItem("mails"));
    let ultimo = playersMails[playersMails.length - 1];
    let fechaScore = {
      fecha: fecha,
      score: score
    }
    const character = Object.assign(ultimo, fechaScore);

    playersMails[playersMails.length - 1] = character;
    localStorage.setItem("mails", JSON.stringify(playersMails));



    //info a FIREBASE
    const id = Math.random().toString(36).substring(7);

    const docRef = doc(db, "partidas", id);

    const data = {
      email: ultimo,
      date: fecha,
      scores: score
    };

    setDoc(docRef, data)
      .then(docRef => {
        console.log("A New Document Field has been added to an existing document");
        window.location.href = './results.html';
      })
      .catch(error => {
        console.log(error);
      })


  });
};




// LLAMADA FETH A LA API
async function questionsGenerator() {
  let response = await fetch(
    "https://opentdb.com/api.php?amount=10&category=12&difficulty=easy&type=multiple"
  );
  let data = await response.json();
  preguntas = data.results;
  preguntas.forEach(element => {
    correctas.push(element.correct_answer);

  });

  console.log(preguntas)
  console.log(correctas)

}

// PINTAR PREGUNTAS
function pintarQuiz() {
  let title = preguntas[page].question;
  let correct = preguntas[page].correct_answer;
  let incorrect = preguntas[page].incorrect_answers;
  incorrect.push(correct);


  function randomizar(indicesRespuestas) {
    indicesRespuestas.sort(() => Math.random() - 0.5);
  }

  let i = [0, 1, 2, 3];
  randomizar(i);

  //template string para generar formulario, dentro de la función porque cuando haga el fetch es cuando se pintan

  let form = document.getElementById("formulario");





  form.innerHTML = `<section id="container">
                  <h1>${title}</h1>
                  <input class = "radio" type="radio" name='answer' id="ans1" value=r${i[0]}>
                  <label for="ans1" id="opt1" class="answers"><img class="iconLabel" src="./assets/images/icon09.png" alt="">${incorrect[(i[0])]}</label>
                  
                  <input class = "radio" type="radio" name='answer' id="ans2" value = r${i[1]}>
                  <label for="ans2" id="opt2" class="answers"><img class="iconLabel" src="./assets/images/icon05.png" alt="">${incorrect[(i[1])]}</label>
                  

                  <input class = "radio" type="radio" name= 'answer' id="ans3" value = r${i[2]}>
                  <label for="ans3" id="opt3" class="answers"><img class="iconLabel" src="./assets/images/icon04.png" alt="">${incorrect[(i[2])]}</label>
                  
                  <input class = "radio" type="radio" name= 'answer' " id="ans4" value = r${i[3]}>
                  <label for="ans4" id="opt4" class="answers"><input type="radio" name="answer" id="ans4"><img class="iconLabel" src="./assets/images/icon11.png" alt="">${incorrect[(i[3])]}</label>

                  <input type="submit" value="Checked results!" class="quizbutton notshow" id="check"></input> 
                  
                  </section>`


}



if (document.title === 'Quiz') {
  questionsGenerator().then(() => {
    pintarQuiz();
  })

}


if (document.title === 'Jukebox Quiz - Results') {
  let local = JSON.parse(localStorage.getItem("mails"));
  let lastround = local[local.length - 1].score;
  console.log(lastround)

for (let x =0; x<local.length ; x++){
  if (local[x].score == undefined){ 
  local.splice(x, 1)
  }
}

  let meterPuntuacion = document.getElementById("meterPuntuacion");
  meterPuntuacion.innerHTML = `You have answered ${lastround} questions correctly`

  const points = document.getElementById('hallOfFame');
  points.innerHTML = `<img class="iconLabel" src="./assets/images/icon01.png" alt="">
  <h2 class="fontResult">Hall of Fame: </h2>`


  local.sort(function (a, b) {
    if (a["score"] > b["score"]) {
      return 1;
    }
    if (a["score"] < b["score"]) {
      return -1;
    }

    return 0;
  });

  local = local.slice(0, 5);

  const table = document.getElementById('table')
  table.innerHTML = `                      
                      <table>
                        <thead>
                          <tr>
                            <th>Player</th>
                            <th>Date</th>
                            <th>Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${local.map((local) => `
                            <tr>
                              <td>${local.email}</td>
                              <td>${local.fecha}</td>
                              <td>${local.score}</td>
                            </tr>
                          `).join("")}
                        </tbody>
                      </table>
                    `;

}



//// ______________ BOTONES _____________________

// FUNCIONALIDAD BOTON MUTE
if (document.title === 'Quiz' || document.title === 'Jukebox Quiz - Results') {
  let audio = document.getElementsByClassName("audio");
  let mute = document.getElementsByClassName("muteButton");
  mute[0].addEventListener("click", function () {
    if (audio[0].muted == true) {
      audio[0].muted = false;
    } else {
      audio[0].muted = true;
    };
  });
}

// botón back 
if (document.title === 'Quiz') {
  document.getElementById('back').addEventListener('click', function () {
    if (page > 0) {
      page--;
    }

    if (score > 0) {
      score--;
    };

    pintarQuiz();
  }
  )
};


//boton next 

if (document.title === 'Quiz') {
  document.getElementById('next').addEventListener('click', function () {
    let respuesta = document.querySelector(`input[name=answer]:checked`).value
    console.log(respuesta);
    if (respuesta == "r3") {
      score++
      console.log(score);
    }

    page++
    console.log(page)

    pintarQuiz();
    if (page === 9) {
      document.getElementById('back').style.display = 'none';
      document.getElementById('next').style.display = 'none';
      document.getElementById('check').classList.remove('notshow');
      page = 0;
      console.log(page)
      submitForm();

    }

  });
}


//botón play again
if (document.title === 'Jukebox Quiz - Results') {

  document.getElementById('again').addEventListener('click', function () {

    window.location.href = './question.html'

  })



}


//BOTON REGISTRAR
if (document.title === "Jukebox Quiz - Home") {
  const cuadroLogin = document.querySelector("#login-form");
  const cuadroRegistrar = document.querySelector("#signup-form");
  const botonRegistrar = document.querySelector("#registrar");

  botonRegistrar.addEventListener("click", function () {

    cuadroLogin.style.display = "none";

    botonRegistrar.style.display = "none";


    cuadroRegistrar.style.display = "block";
  });

}





