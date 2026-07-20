// Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
const cartBtn = document.querySelector('#cart-btn');
const cartCount = document.querySelector('#cart-count');
const totalPriceEl = document.querySelector('#total-price');
const contenido = document.querySelector('#contenido');

let articulosCarrito = [];

// Event Listeners
cargarEventListeners();

function cargarEventListeners() {
    // Cargar carrito desde localStorage cuando se carga la página
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
        if (articulosCarrito.length > 0) {
            mostrarMensaje('El carrito se cargó desde localStorage.', 'info');
        }
    });

    // Toggle carrito display
    cartBtn.addEventListener('click', () => {
        carrito.classList.toggle('active');
    });

    // Close carrito when clicking outside
    document.addEventListener('click', (e) => {
        if (!carrito.contains(e.target) && !cartBtn.contains(e.target)) {
            carrito.classList.remove('active');
        }
    });

    // Cuando agregas un curso presionando "Agregar al Carrito"
    listaCursos.addEventListener('click', agregarCurso);

    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        articulosCarrito = []; // reseteamos el arreglo
        limpiarHTML(); // Eliminamos todo el HTML
        actualizarTotales();
        sincronizarStorage();
        mostrarMensaje('Carrito vacío y guardado en localStorage.', 'info');
    });
}

// Funciones
function agregarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

// Elimina un curso del carrito
function eliminarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');

        // Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

        carritoHTML(); // Iterar sobre el carrito y mostrar su HTML
        mostrarMensaje('Curso eliminado del carrito.', 'info');
    }
}

// Lee el contenido del HTML al que le dimos click y extrae la información del curso
function leerDatosCurso(curso) {
    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precioText: curso.querySelector('.precio-oferta').textContent,
        precio: parseFloat(curso.querySelector('.precio-oferta').textContent.replace('$', '')),
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };

    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if (existe) {
        // Actualizamos la cantidad
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; // retorna el objeto actualizado
            } else {
                return curso; // retorna los objetos que no son los duplicados
            }
        });
        articulosCarrito = [...cursos];
    } else {
        // Agregamos el curso al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    carritoHTML();
    mostrarMensaje('Curso agregado al carrito.', 'info');
}

// Muestra el Carrito de compras en el HTML
function carritoHTML() {
    // Limpiar el HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach(curso => {
        const { imagen, titulo, precioText, cantidad, id } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precioText} x ${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
        `;

        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    actualizarTotales();
    sincronizarStorage();
}

// Actualiza contador y precio total
function actualizarTotales() {
    // Actualizar cantidad de items
    const totalItems = articulosCarrito.reduce((total, curso) => total + curso.cantidad, 0);
    cartCount.textContent = totalItems;

    // Actualizar precio total
    const totalPrecio = articulosCarrito.reduce((total, curso) => total + (curso.precio * curso.cantidad), 0);
    totalPriceEl.textContent = totalPrecio.toFixed(2);
}

// Elimina los cursos del tbody
function limpiarHTML() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

function mostrarMensaje(mensaje, tipo = 'info') {
    limpiarMensaje();
    const mensajeP = document.createElement('p');
    mensajeP.textContent = mensaje;
    mensajeP.classList.add(tipo === 'error' ? 'error' : 'mensaje');
    contenido.appendChild(mensajeP);

    setTimeout(() => {
        mensajeP.remove();
    }, 3000);
}

function limpiarMensaje() {
    const mensajes = contenido.querySelectorAll('.mensaje, .error');
    mensajes.forEach(mensaje => mensaje.remove());
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}
