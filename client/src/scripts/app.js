const app = angular.module('MusicApp', [
  'ngMaterial',
  'ui.router',
  'satellizer',
  'md.data.table',
  'ngMessages',
  'ngSanitize',
  'youtube-embed'
]);

// Run
import appRun from './app.run';

// Configs
import routes from './routes';
import authConfig from '../../components/Auth/auth.config';
import themeConfig from './theme';

// Services
import AuthService from '../../components/Auth/auth.service';
import PlayerService from '../../components/player/player.service';

// Main Controllers
import IndexController from '../../views/main/home/index.controller';
import HomePageController from '../../views/main/home/home.controller';
import MainController from '../../views/main/main/main.controller';
import NewListsController from '../../views/main/new-lists/newlists.controller';
import PopularListsController from '../../views/main/popular-lists/popularlists.controller';

// Playlist Controllers
import CreateListController from '../../views/playlists/create/create.controller';
import PlaylistController from '../../views/playlists/playlist/playlist.controller';
import PlaylistsController from '../../views/playlists/playlists/playlists.controller';
import YourListsController from '../../views/playlists/your-lists/yourlists.controller';

// Auth Controllers
import LoginController from '../../views/auth/login/login.controller';

// Components
import navbar from '../../components/navbar/navbar.component';
import player from '../../components/player/player.component';
import playlistSongs from '../../components/playlists/playlist-songs/playlist.songs.component';
import playlistCard from '../../components/playlists/playlist-card/playlist.card.component';
import currentSong from '../../components/playlists/current-song/current.song.component';
import songsAutocomplete from '../../components/songs/songs-autocomplete/songs.autocomplete.component';

// Filters
import TrustFilter from '../../components/filters/trust.filter';
import TimeFilter from '../../components/filters/time.filter';

app
.run(appRun)

.config(routes)
.config(authConfig)
.config(themeConfig)

// Services
.service('Auth', AuthService)
.service('PlayerService', PlayerService)

// Main Controllers
.controller('IndexController', IndexController)
.controller('HomePageController', HomePageController)
.controller('MainController', MainController)
.controller('NewListsController', NewListsController)
.controller('PopularListsController', PopularListsController)

// Playlist Controllers
.controller('CreateListController', CreateListController)
.controller('PlaylistController', PlaylistController)
.controller('PlaylistsController', PlaylistsController)
.controller('YourListsController', YourListsController)

.controller('LoginController', LoginController)

.component('navbar', navbar)
.component('playlistCard', playlistCard)
.component('playlistSongs', playlistSongs)
.component('currentSong', currentSong)
.component('player', player)
.component('songsAutocomplete', songsAutocomplete)

.filter('trust', TrustFilter)
.filter('timeFilter', TimeFilter)