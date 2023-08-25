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

	function removeTransition() {
		const animateElements = document.querySelectorAll('.moon-element-animate');

		for (const animateElement of animateElements) {
			animateElement.style.transition = 'none';
			setTimeout(() => {
				animateElement.style.removeProperty('transition');
			}, 0.3);
		}
	}

	const swiper = new Swiper('.js-member-slider', {
		initialSlide: sliderItems.length,
		slidesPerView: 3,
		spaceBetween: 9,
		touchRatio: 0.5,
		loop: true,
		slidesPerGroup: 1,
		slideToClickedSlide: true,
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

				const progress = Math.round(currentSlideIndex / sliderItems.length * 100);

				const updateMoon = (phase) => {
					let phaseScale = 1;
					let phaseTrans = 50;
					let phaseRight = 0;

					if (phase <= 50) {
						phaseRight = 1 - phase / 50;
					}
					document.querySelector('.moon-right .fg').style.transform = `scaleX(${phaseRight})`;

					if (phase >= 50) {
						phaseScale = 1 - (phase - 50) / 50;
						phaseTrans = 50 * phaseScale;
					}
					document.querySelector('.moon-left .fg').style.transform = `translate(${phaseTrans}px, 0) scaleX(${1 - phaseScale})`;
				};

				updateMoon(progress);
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
	// eslint-disable-next-line func-names
	swiper.on('slideNextTransitionStart', function () {
		const curSlidendex = swiper.realIndex;
		const nextSlidendex = swiper.realIndex + 1;
		const allSlides = this.slides.length;
		// console.log(`cur: ${curSlidendex}, next: ${nextSlidendex}, all: ${allSlides}`);

		if (curSlidendex === allSlides / 2 && nextSlidendex === allSlides / 2 + 1 ||
			curSlidendex === 0 && nextSlidendex === 1) {
			removeTransition();
		} 
	});

	// eslint-disable-next-line func-names
	swiper.on('slidePrevTransitionStart', function () {
		const curSlidendex = swiper.realIndex;
		const nextSlidendex = swiper.realIndex + 1;
		const allSlides = this.slides.length;

		if (curSlidendex === allSlides / 2 - 1 && nextSlidendex === allSlides / 2 ||
			curSlidendex === allSlides - 1 && nextSlidendex === allSlides) {
			removeTransition();
		}
	});
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
			const formData = $(form).serialize();

			$.ajax({
				type: 'POST',
				url: 'mailer.php',
				data: formData,
				success: (data) => {
					let result = JSON.parse(data);

					if (result.result !== 'error') {
						const successBlock = document.querySelector('.success');
						$(form).find('.form__input').val('').removeClass('form__input_not-empty valid');
						$(form).hide();
						$('.success').show();

						successBlock.scrollIntoView({
							behavior: 'smooth',
							block: 'start',
						});
					} else if (result.code === 'email') {
						// eslint-disable-next-line no-console
						console.log('ошибка отправки');
						// eslint-disable-next-line no-alert
						alert('Произошла ошибка при отправке данных');
					}
					// eslint-disable-next-line no-undef
					dataLayer.push({
						event: 'form_submit',
						formType: 'newBrand',
						formName: 'registration',
					});
				},
				error: (error) => {
					// eslint-disable-next-line no-console
					console.error('Произошла ошибка при отправке данных: ', error);
					// eslint-disable-next-line no-alert
					alert('Произошла ошибка при отправке данных');
				},
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

function initAnimationBlock() {
	const controller = new ScrollMagic.Controller();
	const blocksAnimation = document.querySelectorAll('.section-animation');

	blocksAnimation.forEach((block, item) => {
		const triggerElement = document.querySelector('.registration');
		const stylesElement = window.getComputedStyle(triggerElement);
		const paddingTopValue = parseInt(stylesElement.paddingTop, 10);

		let offsetTrigger = item === 2 ? -paddingTopValue : 0;

		// eslint-disable-next-line no-unused-vars
		const scene = new ScrollMagic.Scene({
			reverse: true,
			triggerElement: block,
			triggerHook: 0.83,
			offset: offsetTrigger,
		})
			.setClassToggle(block, 'section-animation_active')
			.addTo(controller);
			// .addIndicators();
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
initAnimationBlock();
