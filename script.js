const preguntas = [
    {
        pregunta: "Cual es el resultado de typeof null en JavaScript?",
        opciones: ["null", "undefined", "object", "string"],
        correcta: 2,
        feedback: "typeof null devuelve 'object'. Es un bug historico de JS que nunca se corrigio."
    },
    {
        pregunta: "Que metodo agrega un elemento al final de un array?",
        opciones: ["push()", "pop()", "shift()", "unshift()"],
        correcta: 0,
        feedback: "push() agrega al final. pop() elimina del final. unshift() agrega al inicio."
    },
    {
        pregunta: "Cual es la diferencia entre == y ===?",
        opciones: [
            "No hay diferencia",
            "=== compara valor y tipo",
            "== compara valor y tipo",
            "=== solo funciona con números"
        ],
        correcta: 1,
        feedback: "=== es comparación estricta: compara valor Y tipo. == convierte tipos antes de comparar."
    },
    {
        pregunta: "¿Qué imprime console.log(0.1 + 0.2 === 0.3)?",
        opciones: ["true", "false", "undefined", "NaN"],
        correcta: 1,
        feedback: "Imprime false. Los decimales en JS tienen errores de punto flotante: 0.1 + 0.2 = 0.30000000000000004."
    },
    {
        pregunta: "¿Cuál de estos NO es un tipo primitivo en JavaScript?",
        opciones: ["string", "boolean", "array", "undefined"],
        correcta: 2,
        feedback: "Array es un objeto, no un primitivo. Los primitivos son: string, number, boolean, null, undefined, symbol, bigint."
    },
    {
        pregunta: "¿Qué devuelve una función que no tiene return?",
        opciones: ["0", "null", "false", "undefined"],
        correcta: 3,
        feedback: "Sin return explícito, toda función en JS devuelve undefined automáticamente."
    },
    {
        pregunta: "¿Qué hace el método slice(1, 3) en un array [10, 20, 30, 40]?",
        opciones: ["[10, 20]", "[20, 30]", "[20, 30, 40]", "[30, 40]"],
        correcta: 1,
        feedback: "slice(inicio, fin) extrae desde el índice 1 hasta el 3 sin incluirlo: [20, 30]."
    },
    {
        pregunta: "¿Cuál es la forma correcta de declarar una constante?",
        opciones:  ["var x = 5", "let x = 5", "const x = 5", "constant x = 5"],
        correcta: 2,
        feedback:  "const declara una constante. var es antigua y tiene scope de función. let es para variables que cambian."
    },
    {
        pregunta: "¿Qué es NaN en JavaScript?",
        opciones: [
      "Un error que detiene el programa",
      "El número negativo más pequeño",
      "Un valor de tipo number que representa 'no es un número'",
      "Lo mismo que undefined"
    ],
        correcta: 2,
        feedback: "NaN (Not a Number) es de tipo number. typeof NaN === 'number'. Aparece en operaciones inválidas como 'hola' * 2."
    },
    {
        pregunta: "¿Qué hace el operador ternario?",
        opciones: [
      "Suma tres valores",
      "Evalúa una condición y retorna uno de dos valores",
      "Compara tres variables",
      "Declara tres variables a la vez"
    ],
        correcta: 1,
        feedback: "El ternario es condición ? valorSiTrue : valorSiFalse. Es un if/else en una sola línea."
    }
]

// ── SELECTORES ──────────────────────────────────────────────
const pantallaInicio = document.getElementById("pantalla-inicio")
const pantallaQuiz = document.getElementById("pantalla-quiz")
const pantallaResultados = document.getElementById('pantalla-resultados')
const textoPregunta = document.getElementById('texto-pregunta')
const contenedorOpciones = document.getElementById('opciones') 
const contadorEl = document.getElementById('contador')
const puntajeEl = document.getElementById('puntaje')
const feedbackEl = document.getElementById('feedback')
const feedbackTexto = document.getElementById('feedback-texto')
const timerNumero = document.getElementById('timer-numero')
const timerBarra = document.getElementById('timer-barra')
const btnIniciar = document.getElementById('btn-iniciar')
const btnReiniciar = document.getElementById('btn-reiniciar')
const puntajeFinalEl = document.getElementById('puntaje-final')
const mensajeFinalEl = document.getElementById('mensaje-final')


// ── STATE ────────────────────────────────────────────────────
const state = {
    indice: 0,
    score: 0,
    timer: 15,
    intervalo: null,
    respondio: false
}

// ── FUNCIÓN 1 ────────────────────────────────────────────────
function iniciarQuiz() {
    // Resetear state
    state.indice = 0
    state.score = 0
    state.timer = 15
    state.intervalo = null
    state.respondio = false

    // Cambiar pantalla
    pantallaInicio.classList.remove('activo')
    pantallaResultados.classList.remove('activo')
    pantallaQuiz.classList.add('activo')

    cargarPregunta(state.indice)
}

// ── FUNCIÓN 2 ────────────────────────────────────────────────
function cargarPregunta(i) {
    // Limpiar estado visual de la pregunta anterior
    state.respondio = false
    feedbackEl.classList.add('oculto')
    contenedorOpciones.innerHTML = ''

    // Leer la pregunta acual del array
    const preguntaActual = preguntas[i]

    // Actalizar textos
    contadorEl.textContent = `Pregunta ${i + 1} / ${preguntas.length}`
    puntajeEl.textContent = `Puntaje: ${state.score}`
    textoPregunta.textContent = preguntaActual.pregunta

    // Crear botones de opciones con for
    for (let j = 0; j < preguntaActual.opciones.length; j++) {
        const boton = document.createElement("button")
        boton.textContent = preguntaActual.opciones[j]
        boton.classList.add("opcion")
        boton.dataset.indice = j     // guardamos el indice en el boton
        boton.addEventListener("click", manejarRespuesta)
        contenedorOpciones.appendChild(boton)
    }

        iniciarTimer()
}

// Event listeners
btnIniciar.addEventListener("click", iniciarQuiz)
btnReiniciar.addEventListener("click", iniciarQuiz)

// ── FUNCIÓN 3 ────────────────────────────────────────────────
function iniciarTimer() {
    // Resetear vusialmente
    state.timer = 15
    timerNumero.textContent = state.timer
    timerBarra.style.width = "100%"
    timerBarra.classList.remove("urgente")

    // Limpiar intervalo anterior por si quedi uno corriendo
    clearInterval(state.intervalo)

    state.intervalo = setInterval(() => {
        state.timer--

        // Actualizar numero y barra
        timerNumero.textContent = state.timer
        timerBarra.style.width = `${(state.timer / 15) * 100}%`

        // if: Cambiar color cuando queda poco tiempo
        if(state.timer <= 5) {
            timerBarra.classList.add("urgente")
        }

        // if: tiempo agotado
        if (state.timer === 0) {
            clearInterval(state.intervalo)
            manejarTimeout()
        }
    }, 1000)
}

// ── FUNCIÓN 4 ────────────────────────────────────────────────
function manejarTimeout() {
    if (state.respondio) return          //guardia: ya respondio, ignorar

    state.respondio = true

    // Deshabilitar todos los botones
    const botones = contenedorOpciones.querySelectorAll(".opcion")
    botones.forEach(boton => boton.disabled = true)

    // Colorear la correcta en verde para que el usuario la vea
    const correcta = preguntas[state.indice].correcta
    botones[correcta].classList.add("correcta")

    // Mostrar feedback
    feedbackTexto.textContent = `Tiempo agotado. ${preguntas[state.indice].feedback}`
    feedbackEl.classList.remove("oculto")

    // Avanzar despues de dos segundos
    setTimeout(() => siguientePregunta(), 2000)
}

// ── FUNCIÓN 5 ────────────────────────────────────────────────
function manejarRespuesta(event) {
    if (state.respondio) return      //guardia: evita  doble ckick

    state.respondio = true
    clearInterval(state.intervalo)

    // Leer que opcion eligio el usuario
    const indiceElegido = Number(event.target.dataset.indice)
    const correcta = preguntas[state.indice].correcta

    // Deshabilitar todos los botones
    const botones = contenedorOpciones.querySelectorAll(".opcion")
    botones.forEach(boton => boton.disabled = true)

    // Colorear correcta siempre en verde
    botones[correcta].classList.add("correcta")

    // switch: evaluar si acerto o no
    switch (indiceElegido === correcta) {
        case true:
            state.score += 10
            puntajeEl.textContent = `Puntaje: ${state.score}`
            feedbackTexto.textContent = `Correcto. ${preguntas[state.indice].feedback}`
            break

        case false:
            botones[indiceElegido].classList.add("incorrecta")
            feedbackTexto.textContent = `Incorrecto. ${preguntas[state.indice].feedback}`
            break
    }

    feedbackEl.classList.remove("oculto")
    setTimeout(() =>siguientePregunta(), 2000)
}

// ── FUNCIÓN 6 ────────────────────────────────────────────────
function siguientePregunta() {
   state.indice++
   
//    ternario: hay mas preguntas o terminamos?
state.indice < preguntas.length
? cargarPregunta(state.indice)
: mostrarResultados()
}

// ── FUNCIÓN 7 ────────────────────────────────────────────────
function mostrarResultados() {
    pantallaQuiz.classList.remove('activo')
    pantallaResultados.classList.add('activo')
    
    const total = preguntas.length * 10  // 100 puntos posibles
    
    puntajeFinalEl.textContent = `${state.score} / ${total}`

    // ternario anidado: tres niveles de mensaje
    const mensaje = state.score >= 80
    ? `Excelente dominio de Javascript`
    : state.score >= 50
    ? `Bien, sigue practicando`
    : `Repasa los fundamentos e intentalo de nuevo`

    mensajeFinalEl.textContent = mensaje
}