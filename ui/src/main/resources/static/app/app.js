angular.module('indexApp', ['ui.bootstrap', 'ngAnimate']);
angular.module('naviApp', ['searchApp', 'userApp', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'authService', 'googleLocationServices']);
angular.module('loginApp', ['authService', 'pascalprecht.translate']);
angular.module('signupApp', ['app.services', 'pascalprecht.translate']);
angular.module('resetPassword', ['app.services', 'authService', 'pascalprecht.translate']);
angular.module('updatePassword', ['app.services', 'authService', 'pascalprecht.translate', 'app.directives']);
angular.module('profileApp', ['accountApp', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'app.directives']);
angular.module('accountApp', ['app.services', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'authService', 'ngMessages', 'pascalprecht.translate', 'app.directives']);
angular.module('photoApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
angular.module('modalPhotoViewApp', ['app.services']);
angular.module('searchApp', ['pascalprecht.translate', 'googleLocationServices', 'app.services']);
angular.module('userApp', ['app.controllers']);
angular.module('eventApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'googleLocationServices', 'app.services', 'app.directives', 'fileHandler', 'infinite-scroll']);
angular.module('app.services', ['ui.bootstrap', 'ngAnimate']);
angular.module('googleLocationServices', []);
angular.module('authService', ['ngCookies']);
angular.module('app.controllers', []);
angular.module('app.directives', []);
angular.module('fileHandler', []);


angular.module('sharingMomentsApp',
    [
        'ui.router',
        'ngSanitize',
        'pascalprecht.translate',
        'indexApp',
        'naviApp',
        'loginApp',
        'signupApp',
        'resetPassword',
        'updatePassword',
        'profileApp',
        'accountApp',
        'photoApp',
        'modalPhotoViewApp',
        'searchApp',
        'userApp',
        'eventApp',
        'app.services',
        'googleLocationServices',
        'app.controllers',
        'app.directives',
        'ngCookies',
        'authService'
    ]
);

angular.module("sharingMomentsApp").config(function($httpProvider, $locationProvider, $stateProvider, $urlRouterProvider, $translateProvider) {
    //AuthProvider
    $httpProvider.interceptors.push('authInterceptor');

    //Translations
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'app/{part}/{lang}.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('sanitize');

    //Routes
    $locationProvider.html5Mode(true);
    $stateProvider
        .state('/', {
            url: '/?firstLogin',
            templateUrl: 'app/index/index-content.html',
            controller: 'IndexContentCtrl',
            data: {
                i18n: ['index']
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'app/login/login.html',
            controller: 'LoginCtrl',
            data: {
                i18n: ['index', 'login']
            }
        })
        .state('resetPassword', {
            url: '/reset-password',
            templateUrl: 'app/resetPassword/resetPassword.html',
            controller: 'ResetPasswordCtrl',
            data: {
                i18n: ['index', 'resetPassword']
            }
        })
        .state('updatePassword', {
            url: '/update-password?id&token',
            templateUrl: 'app/updatePassword/updatePassword.html',
            controller: 'UpdatePasswordCtrl',
            data: {
                i18n: ['index', 'updatePassword']
            }
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'app/signup/signup.html',
            controller: 'SignupCtrl',
            data: {
                i18n: ['index', 'signup']
            }
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'app/profile/profile.html',
            controller: 'ProfileCtrl',
            data: {
                i18n: ['index', 'profile']
            }
        })
        .state('search', {
            url: '/search?q&tab',
            templateUrl: 'app/search/search-resultlist.html',
            controller: 'SearchListCtrl',
            data: {
                i18n: ['index', 'search']
            }
        })
        .state('user', {
            url: '/user/:id',
            templateUrl: 'app/user/user.html',
            controller: 'UserProfileCtrl',
            data: {
                i18n: ['index', 'user']
            }
        })
        .state('event', {
            url: '/event/:id',
            templateUrl: 'app/event/event.html',
            controller: 'EventCtrl',
            data: {
                i18n: ['index', 'event']
            }
        })
        .state('editEvent', {
            url: '/event/:id/edit',
            templateUrl: 'app/event/edit-event.html',
            controller: 'EditEventCtrl',
            data: {
                i18n: ['index', 'event']
            }
        })
        .state('account', {
            url: '/account',
            templateUrl: 'app/account/account.html',
            controller: 'AccountCtrl',
            data: {
                i18n: ['index', 'account']
            }
        })
        .state('account.privacy', {
            url: '/privacy',
            templateUrl: 'app/account/account-privacy.html',
            controller: 'PrivacyCtrl',
            data: {
                i18n: ['index', 'account']
            }
        })
        .state('account.password', {
            url: '/password',
            templateUrl: 'app/account/account-password.html',
            controller: 'PasswordCtrl',
            data: {
                i18n: ['index', 'account']
            }
        });
    $urlRouterProvider.otherwise("/");
});

angular.module("sharingMomentsApp").run(function ($rootScope, $translate, $translatePartialLoader, $auth, $state, $location) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        var anonymousStates = ['login', 'signup', 'resetPassword', 'updatePassword'];
        var loggedInStates = ['profile', 'account', 'account.privacy', 'account.password', 'search', 'user', 'event', 'event.edit'];
        var redirect = false;

        //Redirecting
        if ($auth.isLoggedIn()) {
            if (anonymousStates.indexOf(toState.name) > -1) {
                event.preventDefault();
                redirect = true;
                $state.transitionTo('/');
            }
        } else {
            if (loggedInStates.indexOf(toState.name) > -1) {
                event.preventDefault();
                redirect = true;
                $state.transitionTo('login');
            } else if (toState.name == '/' && $location.search().redirectUrl && $location.search().status == "succeeded") {
                //Redirecting for Password Reset Page
                if ($location.search().redirectUrl == "updatePassword" && $location.search().id && $location.search().token) {
                    event.preventDefault();
                    redirect = true;
                    $state.transitionTo($location.search().redirectUrl, { 'id': $location.search().id, 'token': $location.search().token });
                } else {
                    event.preventDefault();
                    redirect = true;
                    $state.transitionTo($location.search().redirectUrl);
                }
            }
        }
        
        //Pre-Loading of translation files
        if (toState.data.i18n && !redirect) {
            angular.forEach(toState.data.i18n, function (value) {
                $translatePartialLoader.addPart(value);
            });
        }
    });

    $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
        $translate.refresh();
    });
});

angular.module("sharingMomentsApp").factory('authInterceptor', function ($rootScope, $q, $cookies, $injector) {
    return {
        request: function (config) {
            config.headers = config.headers || {};

            if ($cookies.get('X-AUTH-TOKEN')) {
                config.headers['X-AUTH-TOKEN'] = $cookies.get('X-AUTH-TOKEN');
                $rootScope.authenticated = true;
            } else {
                $rootScope.authenticated = false;
            }

            return config;
        },
        response: function (response) {
            return response || $q.when(response);
        },
        responseError: function (response) {
            var $state = $injector.get('$state');

            if (response && response.status === 401 && !$state.is('login')) {
                $rootScope.authenticated = false;
                $cookies.remove('X-AUTH-TOKEN');
                $state.go('login');
            }

            return $q.reject(response);
        }
    };
});