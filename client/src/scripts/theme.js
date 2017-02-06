export default function($mdThemingProvider, $sceDelegateProvider, $mdAriaProvider) {
  $mdThemingProvider.definePalette('dank', {
    '50': '1d1e32', // primary
    '100': '4d5096', // primary hue-1
    '200': 'a6aaff', // primary hue-2
    '300': 'e57373',
    '400': '393b5d', // primary2
    '500': '1d1e32', // primary
    '600': 'e53935',
    '700': 'd32f2f',
    '800': 'c62828',
    '900': 'b71c1c',
    'A100': 'ed265d', // accent
    'A200': 'ff5252',
    'A400': 'ff1744',
    'A700': 'd50000',
    'contrastDefaultColor': 'light',

    'contrastDarkColors': ['50', '100'],
    'contrastLightColors': undefined
  });

  $mdThemingProvider.theme('default')
  .primaryPalette('dank', {
    'default': '50',
    'hue-1': '100',
    'hue-2': '200'
  })
  .accentPalette('pink', {
    'default': 'A100',
    'hue-1': 'A200',
    'hue-2': 'A400'
  })
  .dark();

  $mdAriaProvider.disableWarnings();
}