import './vendor';
import {Swiper, Navigation, Pagination} from './vendor';
import ScrollMagic from 'scrollmagic/scrollmagic/uncompressed/ScrollMagic';
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';

function initSlider() {
	const slider = document.querySelector('.js-slider');
	const sliderItems = slider.querySelectorAll('.members__slider-item');

	sliderItems.forEach((item, index) => {
		item.dataset.slideItem = (index + 1).toString();
	});

	sliderItems.forEach((item) => {
		const clone = item.cloneNode(true);
		slider.appendChild(clone);
	});

	const swiper = new Swiper('.js-member-slider', {
		initialSlide: sliderItems.length,
		slidesPerView: 3,
		spaceBetween: 9,
		touchRatio: 0.5,
		loop: true,
		slidesPerGroup: 1,
		navigation: {
			prevEl: '.members__slider-nav-button_prev',
			nextEl: '.members__slider-nav-button_next',
		},
		keyboard: {
			enabled: true,
			onlyInViewport: true,
		},
		on: {
			init() {
				document.querySelector('.members__slide-number').textContent = '01';
			},
			slideChange() {
				let currentSlide = this.slides[this.activeIndex];
				let currentSlideIndex = currentSlide.dataset.slideItem;
				let formattedSlideNumber = 0 + String(currentSlideIndex);
				document.querySelector('.members__slide-number').textContent = formattedSlideNumber;
			},
		},
		modules: [Navigation, Pagination],
		breakpoints: {
			744: {
				spaceBetween: 20,
				slidesPerView: 4,
			},
			1440: {
				spaceBetween: 22,
				slidesPerView: 4,
			},
		},
	});

	swiper.init();
}

function initAnimationLineProgram() {
	const controller = new ScrollMagic.Controller();
	const programLine = document.querySelector('.program__line-decor');

	// eslint-disable-next-line no-unused-vars
	const scene = new ScrollMagic.Scene({
		triggerElement: '.program__line-decor',
		triggerHook: 0.7,
		duration: `${programLine.offsetHeight}px`,
	})
		.setTween('.program__line', {height: '100%'})
		.addTo(controller);
}

function initAnimationMarker() {
	const lineAnimate = document.querySelector('.program__line');
	const programMarkers = document.querySelectorAll('.program__circle');
	let ticking = false;
	let timer;
	const updateMarkerClass = () => {
		const lineBottom = lineAnimate.getBoundingClientRect().bottom;

		programMarkers.forEach((programMarker) => {
			const markerTop = programMarker.getBoundingClientRect().top;

			if (markerTop <= lineBottom) {
				programMarker.classList.add('active');
			} else {
				programMarker.classList.remove('active');
			}
		});
	};

	if (lineAnimate) {
		window.addEventListener('scroll', () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					updateMarkerClass();
					ticking = false;
				});
				ticking = true;
			}
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				// console.log('Скролл завершился');
				updateMarkerClass();
			}, 100);
		});
	}
}

function animationToBlock() {
	const scrollButtons = document.querySelectorAll('.js-go-to-registration');

	scrollButtons.forEach((button) => {
		button.addEventListener('click', () => {
			const targetId = button.getAttribute('data-target');
			const targetBlock = document.getElementById(targetId);

			targetBlock.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		});
	});
}

function addClassForInput() {
	const inputs = document.querySelectorAll('.form__input');

	function checkValue(element) {
		if (element.value !== '') {
			element.classList.add('form__input_not-empty');
		} else {
			element.classList.remove('form__input_not-empty');
		}
	}

	for (let element of inputs) {
		checkValue(element);

		element.addEventListener('change', () => {
			checkValue(element);
		});
	}
}

function addedMaskPhone() {
	$('.js-phone-input').mask('+7 (000) 000-00-00');
}

function validationForm() {
	const form = $('.js-form-registration');

	form.validate({
		rules: {
			user_phone: {
				minlength: 18,
			},
		},
		messages: {
			user_phone: {
				minlength: 'Введите корректный номер телефона',
			},
			user_mail: {
				email: 'Введите корректный email',
			},
		},
		// eslint-disable-next-line no-shadow
		submitHandler: (form) => {
			const successBlock = document.querySelector('.success');
			$(form).find('.form__input').val('').removeClass('form__input_not-empty valid');
			$(form).hide();
			$('.success').show();

			successBlock.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		},
	});

	$.extend($.validator.messages, {
		required: 'Это поле обязательно для заполнения',
	});
}

function changesVideoPlaybackSpeed() {
	document.addEventListener('DOMContentLoaded', () => {
		const video = document.querySelector('.js-video');

		video.playbackRate = 1.5;
	});
}

addClassForInput();
animationToBlock();
initAnimationLineProgram();
initAnimationMarker();
initSlider();
addedMaskPhone();
validationForm();
changesVideoPlaybackSpeed();
