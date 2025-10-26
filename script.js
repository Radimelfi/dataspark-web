// ===== ANIMACIONES AL HACER SCROLL =====
const fadeElements = document.querySelectorAll('.fade-in');

function handleScroll() {
  fadeElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Mostrar si está en viewport o arriba de la página
    if (rect.top < windowHeight - 100) {
      el.classList.add('visible');
    }
  });
}

// EJECUTAR INMEDIATAMENTE al cargar la página
window.addEventListener('load', function() {
  handleScroll(); // Ejecuta inmediatamente
  
  // También ejecutar después de un pequeño delay por si acaso
  setTimeout(handleScroll, 100);
});

// Ejecutar al hacer scroll
window.addEventListener('scroll', handleScroll);

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', handleScroll);

// ===== MODAL PARA GALERÍA =====
function openModal(src) {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  
  if (modal && modalImg) {
    modalImg.src = src;
    modal.style.display = "flex";
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = 'auto';
  }
}

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// ===== FAQ INTERACTIVO =====
document.querySelectorAll('.faq-question').forEach(item => {
  item.addEventListener('click', () => {
    const parent = item.parentElement;

    if (parent.classList.contains('active')) {
      parent.classList.remove('active');
    } else {
      // Cierra todas las otras
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      // Abre esta
      parent.classList.add('active');
    }
  });
});


// ===== TESTIMONIOS INTERACTIVOS =====
let testimonios = [];
let currentSlide = 0;
let autoPlayInterval;

// Testimonios predeterminados
const testimoniosPredeterminados = [
  {
    nombre: "María Almonte",
    empresa: "Retail Corp",
    cargo: "Gerente de Operaciones",
    rating: 5,
    comentario: "DataSpark transformó completamente nuestra forma de analizar datos. Los dashboards son intuitivos y nos han ayudado a tomar decisiones más rápidas y acertadas.",
    fecha: new Date().toISOString()
  },
  {
    nombre: "Juan Rodríguez",
    empresa: "Finanzas Plus",
    cargo: "Director de TI",
    rating: 5,
    comentario: "El equipo de DataSpark es extremadamente profesional. Implementaron un sistema ETL que redujo nuestro tiempo de procesamiento en un 60%.",
    fecha: new Date().toISOString()
  },
  {
    nombre: "Carmen Pérez",
    empresa: "TechVision",
    cargo: "CEO",
    rating: 5,
    comentario: "Excelente servicio. Los reportes automatizados nos ahorraron más de 20 horas semanales. Totalmente recomendado.",
    fecha: new Date().toISOString()
  }
];

// Cargar testimonios
async function cargarTestimonios() {
  try {
    const result = await window.storage.list('testimonio:');
    
    if (result && result.keys && result.keys.length > 0) {
      const promises = result.keys.map(key => window.storage.get(key));
      const results = await Promise.all(promises);
      testimonios = results
        .filter(r => r && r.value)
        .map(r => JSON.parse(r.value))
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }
    
    if (testimonios.length === 0) {
      testimonios = [...testimoniosPredeterminados];
    }
    
    renderizarCarrusel();
    actualizarContador();
  } catch (error) {
    console.log('Usando testimonios predeterminados');
    testimonios = [...testimoniosPredeterminados];
    renderizarCarrusel();
    actualizarContador();
  }
}

// Renderizar carrusel
function renderizarCarrusel() {
  const wrapper = document.getElementById('carousel-wrapper');
  const dotsContainer = document.getElementById('carousel-dots');
  
  if (!wrapper || !dotsContainer) return;
  
  wrapper.innerHTML = testimonios.map((t, index) => `
    <div class="testimonio-slide ${index === 0 ? 'active' : ''}">
      <div class="stars">${'⭐'.repeat(t.rating)}</div>
      <p class="testimonio-texto">"${t.comentario}"</p>
      <div class="autor-info">
        <div class="autor-avatar">${obtenerIniciales(t.nombre)}</div>
        <div class="autor-detalles">
          <h4>${t.nombre} <span class="verified-badge">✓ Verificado</span></h4>
          <p>${t.cargo} - ${t.empresa}</p>
        </div>
      </div>
    </div>
  `).join('');

  dotsContainer.innerHTML = testimonios.map((_, index) => 
    `<div class="dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>`
  ).join('');

  iniciarAutoPlay();
}

// Obtener iniciales
function obtenerIniciales(nombre) {
  return nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// Navegación del carrusel
function nextSlide() {
  currentSlide = (currentSlide + 1) % testimonios.length;
  mostrarSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + testimonios.length) % testimonios.length;
  mostrarSlide(currentSlide);
}

function goToSlide(index) {
  currentSlide = index;
  mostrarSlide(currentSlide);
}

function mostrarSlide(index) {
  document.querySelectorAll('.testimonio-slide').forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  reiniciarAutoPlay();
}

// Auto-play
function iniciarAutoPlay() {
  clearInterval(autoPlayInterval);
  autoPlayInterval = setInterval(nextSlide, 5000);
}

function reiniciarAutoPlay() {
  clearInterval(autoPlayInterval);
  iniciarAutoPlay();
}

// Actualizar contador
function actualizarContador() {
  const countElement = document.getElementById('testimonios-count');
  if (countElement) {
    countElement.textContent = 
      `${testimonios.length} ${testimonios.length === 1 ? 'testimonio' : 'testimonios'} verificados`;
  }
}

// Enviar formulario de reseña
const resenaForm = document.getElementById('resena-form');
if (resenaForm) {
  resenaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre-resena').value;
    const empresa = document.getElementById('empresa-resena').value;
    const cargo = document.getElementById('cargo-resena').value;
    const rating = parseInt(document.querySelector('input[name="rating"]:checked').value);
    const comentario = document.getElementById('comentario-resena').value;

    const nuevoTestimonio = {
      nombre,
      empresa,
      cargo,
      rating,
      comentario,
      fecha: new Date().toISOString()
    };

    try {
      const timestamp = Date.now();
      await window.storage.set(`testimonio:${timestamp}`, JSON.stringify(nuevoTestimonio));
      
      testimonios.unshift(nuevoTestimonio);
      currentSlide = 0;
      renderizarCarrusel();
      actualizarContador();

      document.getElementById('success-message-testimonio').classList.add('show');
      resenaForm.reset();

      setTimeout(() => {
        document.getElementById('success-message-testimonio').classList.remove('show');
      }, 5000);

    } catch (error) {
      alert('Error al guardar la reseña. Por favor intenta de nuevo.');
      console.error(error);
    }
  });
}

// Inicializar testimonios cuando cargue la página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cargarTestimonios);
} else {
  cargarTestimonios();
}