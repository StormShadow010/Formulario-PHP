// =====================================================
// ARCHIVO: javascript/script.js
// DESCRIPCIÓN: Validación del formulario en el cliente.
//   - Valida cada campo al perder el foco (blur)
//   - Valida todo al hacer submit
//   - Actualiza el contador de caracteres del textarea
//   - Pone la fecha de hoy como valor inicial
//
// FLUJO:
//   1. DOMContentLoaded → inicializar fecha y eventos
//   2. blur en cada campo → validar ese campo solo
//   3. input en peticion  → actualizar contador
//   4. submit             → validar todo; si hay error
//                           preventDefault() cancela el envío
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
  // ── Referencias a los campos del formulario ──
  const campos = {
    nombre: document.getElementById("nombre"),
    correo: document.getElementById("correo"),
    telefono: document.getElementById("telefono"),
    fecha: document.getElementById("fecha"),
    peticion: document.getElementById("peticion"),
  };

  // ── Referencias a los spans de error de cada campo ──
  const errores = {
    nombre: document.getElementById("error-nombre"),
    correo: document.getElementById("error-correo"),
    telefono: document.getElementById("error-telefono"),
    fecha: document.getElementById("error-fecha"),
    peticion: document.getElementById("error-peticion"),
  };

  // ── Referencia al contador de caracteres ──
  const cuentaSpan = document.getElementById("cuenta");
  const contadorEl = campos.peticion.parentElement.querySelector(".contador");

  // ── Formulario ──
  const formulario = document.getElementById("formulario-contacto");

  // ── Poner la fecha de hoy por defecto ──
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  campos.fecha.value = `${yyyy}-${mm}-${dd}`;

  // =====================================================
  // CONTADOR DE CARACTERES DEL TEXTAREA
  // Se actualiza con cada tecla presionada (evento input)
  // =====================================================
  campos.peticion.addEventListener("input", function () {
    const largo = this.value.length;
    cuentaSpan.textContent = largo;

    // Advertencia visual cuando supera el 80% (800/1000 chars)
    if (largo >= 800) {
      contadorEl.classList.add("advertencia");
    } else {
      contadorEl.classList.remove("advertencia");
    }
  });

  // =====================================================
  // FUNCIÓN: mostrarError
  // Agrega la clase .error al input y escribe el mensaje.
  // =====================================================
  function mostrarError(campo, mensaje) {
    campos[campo].classList.add("error");
    errores[campo].textContent = mensaje;
  }

  // =====================================================
  // FUNCIÓN: limpiarError
  // Quita la clase .error y borra el mensaje.
  // =====================================================
  function limpiarError(campo) {
    campos[campo].classList.remove("error");
    errores[campo].textContent = "";
  }

  // =====================================================
  // FUNCIÓN: validarCampo
  // Valida un campo individual según su id.
  // Retorna true si es válido, false si tiene error.
  // =====================================================
  function validarCampo(id) {
    const valor = campos[id].value.trim();

    switch (id) {
      case "nombre":
        if (valor === "") {
          mostrarError("nombre", "El nombre es obligatorio.");
          return false;
        }
        if (valor.length < 3) {
          mostrarError("nombre", "El nombre debe tener al menos 3 caracteres.");
          return false;
        }
        break;

      case "correo":
        // Regex básico para formato de correo
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (valor === "") {
          mostrarError("correo", "El correo es obligatorio.");
          return false;
        }
        if (!regexEmail.test(valor)) {
          mostrarError(
            "correo",
            "Ingresa un correo válido (ej: nombre@dominio.com).",
          );
          return false;
        }
        break;

      case "telefono":
        // Permite dígitos, espacios, +, -, (, )  entre 7 y 15 caracteres
        const regexTel = /^[\d\s\+\-\(\)]{7,15}$/;
        if (valor === "") {
          mostrarError("telefono", "El teléfono es obligatorio.");
          return false;
        }
        if (!regexTel.test(valor)) {
          mostrarError("telefono", "Ingresa un número de teléfono válido.");
          return false;
        }
        break;

      case "fecha":
        if (campos.fecha.value === "") {
          mostrarError("fecha", "La fecha de solicitud es obligatoria.");
          return false;
        }
        break;

      case "peticion":
        if (valor === "") {
          mostrarError("peticion", "La petición es obligatoria.");
          return false;
        }
        if (valor.length < 10) {
          mostrarError(
            "peticion",
            "La petición debe tener al menos 10 caracteres.",
          );
          return false;
        }
        break;
    }

    // Si llega aquí, el campo es válido → limpiar cualquier error previo
    limpiarError(id);
    return true;
  }

  // =====================================================
  // EVENTO: blur (al salir de cada campo)
  // Valida en tiempo real sin esperar al submit.
  // =====================================================
  for (let id in campos) {
    campos[id].addEventListener("blur", function () {
      validarCampo(id);
    });

    // Si ya tiene error y el usuario empieza a escribir,
    // limpiar el error para no molestar mientras edita
    campos[id].addEventListener("input", function () {
      if (this.classList.contains("error")) {
        limpiarError(id);
      }
    });
  }

  // =====================================================
  // EVENTO: submit del formulario
  // Valida todos los campos. Si alguno falla,
  // preventDefault() cancela el envío al servidor.
  // =====================================================
  formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    let esValido = true;

    for (let id in campos) {
      if (!validarCampo(id)) esValido = false;
    }

    if (!esValido) return;

    const formData = new FormData(formulario);

    try {
      const res = await fetch("procesar.php", {
        method: "POST",
        body: formData,
      });

      const data = await res.text();
      console.log(data);

      // 🔥 limpiar después de enviar
      formulario.reset();
      cuentaSpan.textContent = "0";
      contadorEl.classList.remove("advertencia");
    } catch (error) {
      console.error("Error:", error);
    }
  });

  // =====================================================
  // EVENTO: reset (botón Limpiar)
  // Limpia también las clases de error y los mensajes.
  // =====================================================
  formulario.addEventListener("reset", function () {
    // Pequeño delay para que el reset nativo termine primero
    setTimeout(function () {
      for (let id in campos) {
        limpiarError(id);
      }
      // Resetear contador de caracteres
      cuentaSpan.textContent = "0";
      contadorEl.classList.remove("advertencia");
      // Restaurar la fecha de hoy
      campos.fecha.value = `${yyyy}-${mm}-${dd}`;
    }, 10);
  });
}); // fin DOMContentLoaded
