			var i = 0,
			player = document.querySelector('[data-state="player"]'),
			playlist = document.querySelector('[data-state="playlist"]'),
			playlistTop = document.querySelector('[data-state="playlist"] .top'),
			browse = document.querySelector('[data-state="browse"]'),
			// login = document.querySelector('[data-state="login"]'),
			

			menuToggles = document.querySelectorAll('[data-menu="toggle"]'),
			
			activeTab = 0,
			tabToggles = document.querySelectorAll('[data-tab-toggle]'),
            artistsTab = document.querySelector('[data-tab="artists"]'),
			albumsTab = document.querySelector('[data-tab="albums"]'),
			songsTab = document.querySelector('[data-tab="songs"]'),
			
			togglePlaylist = function () {
				playlist.style.webkitTransform = playlist.style.webkitTransform ? '' : 'translateY(100%)';
				playlist.style.marginTop = playlist.style.marginTop ? '' : '-60px';
			},

			togglePlayerDown = function () {
				player.style.webkitTransform = player.style.webkitTransform ? '' : 'translateY(100%)';
			},

			togglePlayerUp = function () {
				player.style.webkitTransform = player.style.webkitTransform ? '' : 'translateY(-100%)';
			},
			
			// toggleLoginUp = function () {
			// 	login.style.webkitTransform = login.style.webkitTransform ? '' : 'translateY(100%)';
			// },

			toggleMenu = function () {
				browse.style.webkitTransform = browse.style.webkitTransform ? '' : 'translateY(-100%)';
				playlist.style.marginTop = playlist.style.marginTop ? '' : '-60px';

				togglePlayerDown();
			},

			setActiveTab = function (id) {
				activeTab = id;
				var v = activeTab * 100;
				v = -v;
				artistsTab.style.webkitTransform = 'translateX('+v+'%)';
				albumsTab.style.webkitTransform = 'translateX('+v+'%)';
				songsTab.style.webkitTransform = 'translateX('+v+'%)';

				document.querySelector(".menu-nav-item__active").className = document.querySelector(".menu-nav-item__active").className.replace(/\bmenu-nav-item__active\b/,'');
				document.querySelector('[data-tab-toggle="'+activeTab+'"]').className += ' menu-nav-item__active';
			};

		document.body.addEventListener('touchstart', function (e) {
			if (e.target.tagName === 'INPUT') {
				return;
			}
			/*
			 * remove focus (and keyboard iOS)
			*/
			document.activeElement.blur();

			/*
			 * prevent overscrolling on iOS
			*/ 
			e.preventDefault();
		});

		playlistTop.addEventListener('click', function (e) {
			togglePlayerUp();
			togglePlaylist();
		});
		
		// arrow.addEventListener('click', function(e) {
		// 	toggleLoginUp();
		// 	togglePlayerDown();
		// });
		
		playlistTop.addEventListener('touchstart', function () {
			togglePlayerUp();
			togglePlaylist();
		});
		
		

		for (i = 0; i < menuToggles.length; i++ ) {
			menuToggles[i].addEventListener('touchstart', toggleMenu);
			menuToggles[i].addEventListener('click', toggleMenu);
		}

		for (i = 0; i < tabToggles.length; i++ ) {
			tabToggles[i].addEventListener('touchstart', setActiveTab.bind(null, tabToggles[i].getAttribute('data-tab-toggle')));
			tabToggles[i].addEventListener('click', setActiveTab.bind(null, tabToggles[i].getAttribute('data-tab-toggle')));
		}
		