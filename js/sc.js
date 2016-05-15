"use strict";
(function (){
	var ID 				= '25256425be3ba551c8b6f0f64efba07a',
		REDIRECT_URL 	= 'https://player-eugeneart.c9.io/callback.html';
	
	var playBtn  		 = document.getElementById('playBtn'),
		pauseBtn 		 = document.getElementById('pauseBtn'),
		nextBtn 	 	 = document.getElementById('nextBtn'),
		previousBtn 	 = document.getElementById('previousBtn'),
		repeatBtn 		 = document.getElementById('repeatBtn'),
		shuffleBtn		 = document.getElementById('shuffleBtn'),
		playlist 		 = document.getElementById('playlist'),
		album    		 = document.getElementById('album'),
		songs    		 = document.getElementById('songs'),
		player   		 = document.getElementById('player'),
		trackbar 	 	 = document.getElementById('trackbar'),
		slider			 = document.getElementById('slider'),
		trackImage 		 = document.getElementById('trackImage'),
		trackTitle 		 = document.getElementById('trackTitle'),
		trackAuthor 	 = document.getElementById('trackAuthor'),
		trackCurrentTime = document.getElementById('trackCurrentTime'),
		bgImage 		 = document.getElementById('bgImage'),
		userName         = document.getElementById('userName'),
		arrow			 = document.getElementById('arrow'),
		login			 = document.getElementById('login'),
		time	 		 = new Date();
		
	window.selectTrack = selectTrack;
	window.createPlaylist = createPlaylist;
	window.entrance = entrance;
	
	//Authentication
	SC.initialize({
	  client_id: ID,
	  redirect_uri: REDIRECT_URL
	});
	
	//Login
	function entrance(form) {
		var log = form.elements;
		var user = log.name.value;
		userName.innerHTML = user;
		addPlaylists(user);
		addSongs(user);
		createPlaylist(0);
		login.classList.toggle('active');
		
		SC.get('users/'+user+'/playlists').then(function(playlists) {
			var tracks = playlists[0].tracks;
			selectTrack(tracks[0].id,0,0);
		});
	}
	
	// player.volume = 0;
	//Events
	playBtn.addEventListener('click', playMusic);
	playBtn.addEventListener('touchstart', playMusic);
	
	pauseBtn.addEventListener('click', pauseMusic);
	pauseBtn.addEventListener('touchstart', pauseMusic);
	
	repeatBtn.addEventListener('click', repeatMusic);
	repeatBtn.addEventListener('touchstart', repeatMusic);
	
	nextBtn.addEventListener('click', playNext);
	nextBtn.addEventListener('touchstart', playNext);
	
	previousBtn.addEventListener('click', playPrevious);
	previousBtn.addEventListener('touchstart', playPrevious);
	
	shuffleBtn.addEventListener('click', shuffleMusic);
	shuffleBtn.addEventListener('touchstart', shuffleMusic);
	
	player.addEventListener('canplaythrough', function () {
		player.play();
		playBtn.setAttribute('hidden', "");
		pauseBtn.removeAttribute('hidden');
	});
	
	arrow.addEventListener('click', function() {
		login.classList.toggle('active');
	});
	arrow.addEventListener('touchstart', function() {
		login.classList.toggle('active');
	});
	
	//track bar duration
	player.addEventListener('timeupdate', moveTrackbar);

	function moveTrackbar() {
		var sec;
	    slider.style.width = (player.currentTime*100/player.duration).toFixed(1)+ '%';
	    
	    sec = (player.currentTime%60).toString().split('.')[0];
	    sec = (sec < 10 ? '0'+ sec: sec);
	    trackCurrentTime.innerHTML = (player.currentTime/60).toString().split('.')[0] + '.' + sec;
	}
	//rewind 
	trackbar.onclick = function(e) {
		var x = e.offsetX == undefined? e.layerX: e.offsetX;
		var widthTrackbar = +getComputedStyle(trackbar).width.slice(0,-2);
		
		var procent = Math.floor(x*100/widthTrackbar);
		var currentDuration = Math.floor(procent*player.duration/100);
		
		player.currentTime = currentDuration;
		
	}
	//Add playlists 
	function addPlaylists(user) {
		SC.get('users/'+user+'/playlists').then(function(playlists) {
		var html = '';
		var artworkUrl;
		    for (var i = 0; i <= playlists.length; i++){
		    	
				if (playlists[i].artwork_url !== null) {
					artworkUrl = playlists[i].artwork_url;
				}else {
					artworkUrl = "https://playlists.applemusic.com/assets/playlist/hero-icon-a45dc80e2ad531ed7a5f659d8a4a0ec980090d3abd00d27c2bfb7422960bea87.png";
				}
				html += '';
				html += '<div class="albums-gallery-item" id="album-item" data-user="'+user+'" data-listnum="'+i+'" onclick="createPlaylist('+i+')" ontouchend="createPlaylist('+i+')"><img src="'+artworkUrl+'" width="100px" height="100px">';
					html += '<span class="album-gallery-item-title">'+ playlists[i].title+'</span>';
				html += '</div>';
					
				album.innerHTML = html;
			}
		});
	}
	
	//Add songs
	function addSongs(user) {
		
		SC.get('users/'+user+'/tracks').then(function(tracks) {
		var html = '';
			for (var i = 0; i <= tracks.length; i++){
					
				time.setTime(tracks[i].duration);
				
				html += '';
				html += '<div class="playlist-item" id="myTrack" data-tracknum="'+i+'" onclick="selectTrack('+tracks[i].id+', '+i+')" ontouchend="selectTrack('+tracks[i].id+', '+i+')">';
					html += '<div class="playlist-item-s playlist-item-s__left">';
						html += '<p class="playlist-item-title"> '+tracks[i].user.username+'</p>';
						html += '<p class="playlist-item-author">'+tracks[i].title+'</p>';
					html += '</div>';
					html += '<div class="playlist-item-s playlist-item-s__right">';
						html += '<p class="playlist-item-time">'+time.getMinutes()+'.'+(time.getSeconds() < 10 ? '0'+time.getSeconds() : time.getSeconds())+'</p>';
						html += '<p class="playlist-item-active"><i class="icon icon__bars"></i></p>';
					html += '</div>';
				html += '</div>';
					
				songs.innerHTML = html;
			}
		});
	}

	//Add tracks to playlist
	function createPlaylist(playlistNum) {
		
		var user = userName.innerHTML
		
		SC.get('users/'+user+'/playlists').then(function(playlists) {
			var tracks = playlists[playlistNum].tracks;
			var html = '';
			for (var i = 0; i <= tracks.length; i++){
					time.setTime(tracks[i].duration);
					html += '';
					html += '<div class="playlist-item" id="track" data-tracknum="'+i+'" onclick="selectTrack('+tracks[i].id+','+i+','+playlistNum+')" ontouchend="selectTrack('+tracks[i].id+','+i+','+playlistNum+')">';
						html += '<div class="playlist-item-s playlist-item-s__left">';
							html += '<p class="playlist-item-title" > '+tracks[i].user.username+'</p>';
							html += '<p class="playlist-item-author">'+tracks[i].title+'</p>';
						html += '</div>';
						html += '<div class="playlist-item-s playlist-item-s__right">';
							html += '<p class="playlist-item-time">'+time.getMinutes()+'.'+(time.getSeconds() < 10 ? '0'+time.getSeconds() : time.getSeconds())+'</p>';
							html += '<p class="playlist-item-active"><i class="icon icon__bars"></i></p>';
						html += '</div>';
					html += '</div>';
					playlist.innerHTML = html;
			}
		});
		
		showCurrentPlaylist(playlistNum);
	}
	
	//Select track on playlist
	function selectTrack(id,i,playlistNum){
		var	artworkUrl;
		SC.get('/tracks/' + id).then(function(data){
			player.src = data.stream_url + '?client_id=' + ID;
			
			if (data.artwork_url !== null) {
				artworkUrl = data.artwork_url.replace(new RegExp("large",'g'),"t500x500");
			} else
			{
				artworkUrl = "../img/interface/no-cover.png";
			}
				
			trackImage.src = artworkUrl;
			bgImage.style.backgroundImage = "url('"+ artworkUrl +"')";
			trackTitle.innerHTML = data.title;
			trackTitle.setAttribute('data-tracknum', i);
			trackTitle.setAttribute('data-playlistnum', playlistNum);
			
			trackAuthor.innerHTML = data.user.username;
		});

		showCurrentTrack(i);
	}
	
	//show current track on playlist
	function showCurrentTrack(trackNum) {
		var elements = playlist.querySelectorAll('[data-tracknum]');
		
		for (var j = 0; j < elements.length; j++){
			var contain = elements[j].matches('[data-tracknum = "'+trackNum+'"]');
			if (contain){
				elements[j].classList.add('playlist-item-playnow');
			} else {
				elements[j].classList.remove('playlist-item-playnow');
			}
		}
	}
	
	//show current playlist on playlists
	function showCurrentPlaylist(playlistNum) {
		var elements = album.querySelectorAll('[data-listnum]');
		for (var j = 0; j < elements.length; j++){
			var contain = elements[j].matches('[data-listnum = "'+playlistNum+'"]');
			if (contain){
				elements[j].classList.add('albums-gallery-item-active');
			} else {
				elements[j].classList.remove('albums-gallery-item-active');
			}
		}
	}
	
	function playMusic() {

	  	player.play();
		
		playBtn.setAttribute('hidden', '');
		pauseBtn.removeAttribute('hidden');
	}
	
	function pauseMusic() {

	  	player.pause();

		pauseBtn.setAttribute('hidden', '');
		playBtn.removeAttribute('hidden');
	}
	
	function playNext() {
		var currentTrack = +trackTitle.getAttribute('data-tracknum');
		var playlistNum = +trackTitle.getAttribute('data-playlistnum');
		var user = userName.innerHTML;
		console.log();
		if (isNaN(playlistNum)) {
			playlist = 0;
			SC.get('users/'+user+'/tracks').then(function(tracks) {
				selectTrack(tracks[currentTrack+1].id, currentTrack+1);
			});
		} else {
			SC.get('users/'+user+'/playlists').then(function(playlists) {
				var tracks = playlists[playlistNum].tracks;
				
				selectTrack(tracks[currentTrack+1].id, currentTrack+1, playlistNum);
			});
		}
		

	}
	
	function playPrevious() {
		var currentTrack = +trackTitle.getAttribute('data-tracknum');
		var playlistNum = +trackTitle.getAttribute('data-playlistnum');
		var user = userName.innerHTML;
		
		if (isNaN(playlistNum)) {
			SC.get('users/'+user+'/tracks').then(function(tracks) {
				selectTrack(tracks[currentTrack-1].id, currentTrack-1);
			});
		} else {
			SC.get('users/'+user+'/playlists').then(function(playlists) {
				var tracks = playlists[playlistNum].tracks;
			selectTrack(tracks[currentTrack-1].id, currentTrack-1, playlistNum);
		});
		}
	}
	
	function repeatMusic() {
		player.loop = true;
		repeatBtn.firstChild.classList.toggle('icon__repeat-active');
	}
	function shuffleMusic(){
		shuffleBtn.firstChild.classList.toggle('icon__shuffle-active');

	}

	
}());
