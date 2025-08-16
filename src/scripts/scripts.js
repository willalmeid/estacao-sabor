const mobileMenu = document.getElementById('mobile-menu');
const mobileBtn = document.getElementById('mobile-btn');
const icon = mobileBtn ? mobileBtn.querySelector('i') : null;
const mobileMenuItem = document.querySelectorAll('.mobile-menu-item');

function openCloseMenu() {
	mobileMenu.classList.toggle('active');
	if (icon) {
		icon.classList.toggle('fa-bars');
		icon.classList.toggle('fa-x');
	}
}

// Função para gerar estrelas de avaliação
function generateStars(rating) {
	let starsHtml = '';
	for (let i = 0; i < 5; i++) {
		if (i < rating) {
			starsHtml += '<i class="fa-solid fa-star"></i>';
		}
	}
	return starsHtml;
}

// Função para carregar e renderizar os itens do cardápio
async function loadMenuItems() {
	const dishesContainer = document.getElementById('dishes');
	if (!dishesContainer) return;

	try {
		const response = await fetch('../data/menu.json');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const menuItems = await response.json();

		dishesContainer.innerHTML = ''; // Limpa o conteúdo existente

		menuItems.forEach(item => {
			const dishDiv = document.createElement('div');
			dishDiv.classList.add('dish'); // Adiciona a classe 'dish' para o ScrollReveal

			dishDiv.innerHTML = `
                <div class="dish-heart">
                    <i class="fa-solid fa-heart"></i>
                </div>

                <img src="${item.image}" class="dish-image" alt="${item.title}" />

                <h3 class="dish-title">${item.title}</h3>

                <span class="dish-description">${item.description}</span>

                <div class="dish-rate">
                    ${generateStars(item.rating)}
                    <span>(${item.reviewsCount}+)</span>
                </div>

                <div class="dish-price">
                    <h4>R$ ${item.price}</h4>

                    <button class="btn-default">
                        <i class="fa-solid fa-basket-shopping"></i>
                    </button>
                </div>
            `;
			dishesContainer.appendChild(dishDiv);
		});

		// --- Importante: Chamar ScrollReveal para os novos elementos ---
		// Se a classe '.dish' já foi revelada antes, você pode chamar sync
		// Ou você pode chamar reveal novamente para os novos elementos
		if (typeof ScrollReveal !== 'undefined') {
			// Para garantir que novos .dish sejam animados:
			ScrollReveal().reveal('.dish', {
				origin: 'left',
				duration: 2000,
				distance: '20%',
			});
		}
	} catch (error) {
		console.error('Erro ao carregar os itens do cardápio:', error);
		dishesContainer.innerHTML = '<p>Não foi possível carregar os itens do cardápio.</p>';
	}
}

// Função para carregar e renderizar as avaliações
async function loadTestimonials() {
	const feedbacksContainer = document.getElementById('feedbacks');
	if (!feedbacksContainer) return;

	try {
		const response = await fetch('../data/testimonials.json');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const testimonials = await response.json();

		feedbacksContainer.innerHTML = ''; // Limpa o conteúdo existente

		testimonials.forEach(testimonial => {
			const feedbackDiv = document.createElement('div');
			feedbackDiv.classList.add('feedback'); // Adiciona a classe 'feedback' para o ScrollReveal

			feedbackDiv.innerHTML = `
                <img src="${testimonial.avatar}" class="feedback-avatar" alt="${testimonial.name}" />
                <div class="feedback-content">
                    <h4>
                        ${testimonial.name}
                        <span>
                            ${generateStars(testimonial.rating)}
                        </span>
                    </h4>
                    <p>${testimonial.text}</p>
                </div>
            `;
			feedbacksContainer.appendChild(feedbackDiv);
		});

		// --- Importante: Chamar ScrollReveal para os novos elementos ---
		if (typeof ScrollReveal !== 'undefined') {
			// ScrollReveal().sync(); // Sincroniza todas as revelações existentes
			// Ou, para ser mais específico e garantir que novos .feedback sejam animados:
			ScrollReveal().reveal('.feedback', {
				origin: 'right',
				duration: 1000, // Duracao original para feedback
				distance: '20%',
			});
		}
	} catch (error) {
		console.error('Erro ao carregar as avaliações:', error);
		feedbacksContainer.innerHTML = '<p>Não foi possível carregar as avaliações.</p>';
	}
}

document.addEventListener('DOMContentLoaded', function () {
	// 1. Funcionalidade do botão mobile (abrir/fechar menu)
	if (mobileBtn && mobileMenu) {
		mobileBtn.addEventListener('click', openCloseMenu);
		mobileMenuItem.forEach(i => i.addEventListener('click', openCloseMenu));
	}

	// 2. Funcionalidade de scroll para ativação de nav-items e sombra do cabeçalho
	const sections = document.querySelectorAll('section');
	const navItems = document.querySelectorAll('.nav-item');
	const header = document.querySelector('header');

	window.addEventListener('scroll', function () {
		const scrollPosition = window.scrollY - (header ? header.offsetHeight : 0);

		if (header) {
			if (scrollPosition <= 0) {
				header.style.boxShadow = 'none';
			} else {
				header.style.boxShadow = '5px 1px 5px rgba(0, 0, 0, 0.1)';
			}
		}

		let activeSectionIndex = 0;

		for (let i = 0; i < sections.length; i++) {
			const section = sections[i];
			const sectionTop = section.offsetTop - 200;
			const sectionBottom = sectionTop + section.offsetHeight;

			if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
				activeSectionIndex = i;
				break;
			}
		}

		navItems.forEach(item => {
			item.classList.remove('active');
		});

		if (navItems[activeSectionIndex]) {
			navItems[activeSectionIndex].classList.add('active');
		}
	});

	// 3. Animações ScrollReveal iniciais (para elementos estáticos ou elementos que serão sempre revelados)
	if (typeof ScrollReveal !== 'undefined') {
		ScrollReveal().reveal('#cta', {
			origin: 'left',
			duration: 2000,
			distance: '20%',
		});

		ScrollReveal().reveal('#banner', {
			origin: 'right',
			duration: 2000,
			distance: '20%',
		});

		ScrollReveal().reveal('#testimonials_chef', {
			origin: 'left',
			duration: 1000,
			distance: '20%',
		});
	} else {
		console.warn('A biblioteca ScrollReveal não foi encontrada. As animações não funcionarão.');
	}

	loadMenuItems();
	loadTestimonials();
});
