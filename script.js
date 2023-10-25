// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


//CONECTAR FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBpkER-BUrmgpsetSxLVGzIrL5TIc7kg5w",
  authDomain: "prueba-autenticacion-y-mas.firebaseapp.com",
  projectId: "prueba-autenticacion-y-mas",
  storageBucket: "prueba-autenticacion-y-mas.appspot.com",
  messagingSenderId: "666047643817",
  appId: "1:666047643817:web:8e83a258e9c2867b3329b8"
};

// Initialize Firebase
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
fecha = fecha.toLocaleString();

//if (document.title == "Jukebox Quiz - Home"){
//Selectores
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
    let guardar = JSON.parse(localStorage.getItem("emails"));
    let mail = [{ email: signUpEmail }];

    if (guardar === null) {
      localStorage.setItem("emails", JSON.stringify(mail));
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
        })
      //Create document in DB
      await setDoc(doc(usersRef, signUpEmail), {
        username: signUpUser,
        email: signUpEmail,
        date:[],
        scores: []
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
    let guardar = JSON.parse(localStorage.getItem("emails"));
    let mail = [{ email: loginEmail }];

    if (guardar === null) {
      localStorage.setItem("emails", JSON.stringify(mail));
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
          userData.style.cssText = 'background-color: #73AB84;width: 50%;margin: 2rem auto;padding: 1rem;border-radius: 5px;display: flex;flex-direction: column;align-items: center';
          userData.innerHTML = `<h3>Welcome!</h3>
                              <p>Username: ${docSnap.data().username}</p>
                              <p>Email: ${docSnap.data().email}</p>
                              <p>Now you are ready to play!</p>
                              <button id="startQuiz"class="quizbutton" type="click"><a href="./question.html">Play!</a></button>
                             `
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









//VALIDA PREGUNTAS Y MANDA A FIRESTORE
function submitForm() {
  document.getElementById("check").addEventListener('click', async function (event) {
    event.preventDefault();
    let respuesta = document.querySelector(`input[name=answer]:checked`).value;
    if (respuesta == "r3") {
      score++
      console.log(score);
    }

    let playersMails = JSON.parse(localStorage.getItem("emails"));
    let ultimo = playersMails[playersMails.length - 1].email;

    const docRef = doc(db, "users", ultimo);

    const data = {
      date: fecha,
      scores: score
    };

    updateDoc(docRef, data)
      .then(docRef => {
        console.log("A New Document Field has been added to an existing document");
        window.location.href = './results.html';
      })
      .catch(error => {
        console.log(error);
      })

  console.log(docRef)
});
}


    




 





// MANDAR FECHA Y PUNTUACION A FIRESTORE


// const dbRef = ref(db, `users/${loginEmail}`)
// update(dbRef, {date:[fecha], scores:[score]}).then(() => {
//   console.log("Data updated");
// }).catch((e) => {
//   console.log(e);
// });

// function recopilarDatos(){
//   let almacenado = JSON.parse(localStorage.getItem('players'));
//   let ultimo = almacenado[almacenado.length-1];
//   let fechaScore = {
//     fecha : fecha.toLocaleDateString(),
//     score : score
//   }
//   const character = Object.assign(ultimo, fechaScore);

// almacenado[almacenado.length-1] = character;
// localStorage.setItem("players", JSON.stringify(almacenado));


// }

// function updateFirebase () {



// }




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
  // let prueba = document.getElementById('espacio');





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



// funcionalidad botones 

// botón log in
// if(document.title === 'Jukebox Quiz - Home'){
//   document
//     .getElementById("userGame")
//     .addEventListener("submit", function (event) {
//       event.preventDefault();
//       let recoveredData = JSON.parse(localStorage.getItem("players"));
//       let nombre = event.target.nombre.value;
//       let player = [{ name: nombre }];

//       if (recoveredData === null) {
//         localStorage.setItem("players", JSON.stringify(player));
//       } else {
//           let newPlayer = { name: nombre };

//         recoveredData.push(newPlayer);
//         localStorage.setItem("players", JSON.stringify(recoveredData));
//       }

//       window.location.href = './question.html';

//     });

// } 
if (document.title === 'Quiz') {
  questionsGenerator().then(() => {
    pintarQuiz();
  })

}


//botón inicio juego
//if(document.title === 'Jukebox Quiz - Home'){
// document
//   .getElementById("startQuiz")
//   .addEventListener("click", function () {
//     window.location.href = './question.html'
//   });

//    }




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

// //botón back 
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

//validaciones

//botón play again
if (document.title === 'Jukebox Quiz - Results') {
  document.getElementById('again').addEventListener('click', function () {

    window.location.href = './question.html'

  })



}






/*


// TEMPLATE TABLA
// Obtenemos las puntuaciones de los 5 mejores jugadores sea de local store o de Firenoseque
// De momento estas para llenar la tabla y maquetar.
// let puntuaciones = [
//   { name: "Juan", date: "2023-10-20", result: 100 },
//   { name: "Pedro", date: "2023-10-19", result: 90 },
//   { name: "María", date: "2023-10-18", result: 80 },
//   { name: "José", date: "2023-10-17", result: 70 },
//   { name: "Ana", sate: "2023-10-16", result: 60 },
// ];

// Creamos la plantilla template string para la tabla
// const bestPlayers = `
//   <table>
//     <thead>
//       <tr>
//         <th>Player</th>
//         <th>Date</th>
//         <th>Result</th>
//       </tr>
//     </thead>
//     <tbody>
//       ${puntuaciones.map((puntuacion) => `
//         <tr>
//           <td>${puntuacion.name}</td>
//           <td>${puntuacion.date}</td>
//           <td>${puntuacion.result}</td>
//         </tr>
//       `).join("")}
//     </tbody>
//   </table>
// `;

// Agregamos la tabla al DOM
// let sectionResults = document.getElementById("sectionResults")
// let contTable = document.getElementById("contTable")
// contTable.innerHTML = bestPlayers;
// sectionResults.appendChild(contTable);*/