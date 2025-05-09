const inputTarea = document.getElementById("nueva-tarea");
const listaTareas = document.getElementById("lista-tareas");
const botonAgregar = document.querySelector(".btn-agregar");
const buscador = document.getElementById("buscador-tareas");

document.addEventListener("DOMContentLoaded", cargarTareas);
botonAgregar.addEventListener("click", agregarTarea);

inputTarea.addEventListener("keypress", (e) => {
  if (e.key === "Enter") agregarTarea();
});

buscador.addEventListener("input", () => {
  const filtro = buscador.value.toLowerCase();
  const tareas = listaTareas.getElementsByTagName("li");
  for (let tarea of tareas) {
    const texto = tarea.querySelector("span").textContent.toLowerCase();
    tarea.style.display = texto.includes(filtro) ? "" : "none";
  }
});

function agregarTarea() {
  const texto = inputTarea.value.trim();
  if (texto !== "") {
    const li = crearElementoTarea(texto);
    listaTareas.appendChild(li);
    guardarTareas();
    inputTarea.value = "";
  }
}

function crearElementoTarea(texto) {
  const li = document.createElement("li");

  const spanTexto = document.createElement("span");
  spanTexto.textContent = texto;

  const eliminarBtn = document.createElement("button");
  eliminarBtn.textContent = "🗑️";
  eliminarBtn.className = "btn-eliminar";
  eliminarBtn.onclick = () => {
    li.remove();
    guardarTareas();
  };

  const editarBtn = document.createElement("button");
  editarBtn.textContent = "✏️";
  editarBtn.className = "btn-editar";
  editarBtn.onclick = () => editarTarea(spanTexto);

  const botonesDiv = document.createElement("div");
  botonesDiv.className = "acciones-tarea";
  botonesDiv.appendChild(editarBtn);
  botonesDiv.appendChild(eliminarBtn);

  li.appendChild(spanTexto);
  li.appendChild(botonesDiv);

  li.onclick = (e) => {
    if (e.target === li || e.target === spanTexto) {
      li.classList.toggle("completada");
      guardarTareas();
    }
  };

  return li;
}

function editarTarea(span) {
  const textoOriginal = span.textContent;
  const inputEdit = document.createElement("input");
  inputEdit.type = "text";
  inputEdit.value = textoOriginal;
  span.replaceWith(inputEdit);
  inputEdit.focus();

  inputEdit.addEventListener("blur", () => guardarEdicion(inputEdit, span));
  inputEdit.addEventListener("keypress", (e) => {
    if (e.key === "Enter") guardarEdicion(inputEdit, span);
  });
}

function guardarEdicion(inputEdit, span) {
  const nuevoTexto = inputEdit.value.trim();
  span.textContent = nuevoTexto !== "" ? nuevoTexto : span.textContent;
  inputEdit.replaceWith(span);
  guardarTareas();
}

function guardarTareas() {
  const tareas = [];
  const elementos = listaTareas.querySelectorAll("li");
  for (let li of elementos) {
    const texto = li.querySelector("span").textContent;
    const completada = li.classList.contains("completada");
    tareas.push({ texto, completada });
  }
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function cargarTareas() {
  const datos = localStorage.getItem("tareas");
  if (datos) {
    const tareas = JSON.parse(datos);
    tareas.forEach((tarea) => {
      const li = crearElementoTarea(tarea.texto);
      if (tarea.completada) li.classList.add("completada");
      listaTareas.appendChild(li);
    });
  }
}

function eliminarTodasLasTareas() {
  if (confirm("¿Estás seguro de eliminar todas las tareas?")) {
    listaTareas.innerHTML = "";
    guardarTareas();
  }
}
