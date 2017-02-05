export default function($authProvider) {
  $authProvider.facebook({
      clientId: '1338493676223052',
      responseType: 'token',
      url: 'http://localhost:3000/api/users.php?endpoint=authenticate&provider=facebook'
  });

  $authProvider.google({
    clientId: '328045038175-c139tridrhk65rjdn6p0685eqn32tuje.apps.googleusercontent.com',
    url: 'http://localhost:3000/api/users.php?endpoint=authenticate&provider=google'
  });
}