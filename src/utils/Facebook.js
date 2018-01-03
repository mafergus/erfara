const promises = {
    init: () => {
        return new Promise((resolve, reject) => {
            if (typeof FB !== 'undefined') {
                resolve();
            } else {
                window.fbAsyncInit = () => {
                    FB.init({
                        appId      : '1686372394915080',
                        cookie     : true, 
                        xfbml      : true,  
                        version    : 'v2.11'
                    });
                    resolve();
                };
                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s); js.id = id;
                    js.src = "//connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            }
        });
    },
    checkLoginState: () => {
        return new Promise((resolve, reject) => {
            FB.getLoginStatus((response) => {
                response.status === 'connected' ? resolve(response) : reject(response);
            });
        });
    },
    login: () => {
        return new Promise((resolve, reject) => {
            FB.login((response) => {
                response.status === 'connected' ? resolve(response) : reject(response);
            });
        });
    },
    logout: () => {
        return new Promise((resolve, reject) => {
            FB.logout((response) => {
                response.authResponse ? resolve(response) : reject(response);
            });
        });
    },
    fetch: () => {
        return new Promise((resolve, reject) => {
            FB.api(
                '/me', 
                {fields: 'first_name, last_name, gender'},
                response => response.error ? reject(response) : resolve(response)
            );
        });
    }
}

export const Facebook = {
    doLogin() {
        this.setState({
            loading: true
        }, () => {
            promises.init()
                .then(
                    promises.checkLoginState,
                    error => { throw error; }
                )
                .then(
                    response => { this.setState({status: response.status}); },
                    promises.login
                )
                .then(
                    promises.fetch,
                    error => { throw error; }
                )
                .then(
                    response => { this.setState({loading: false, data: response, status: 'connected'}); },
                    error => { throw error; }
                )
                .catch((error) => { 
                    this.setState({loading: false, data: {}, status: 'unknown'});
                    console.warn(error); 
                });
        });
    },
    doLogout() {
        this.setState({
            loading: true
        }, () => {
            promises.init()
                .then(
                    promises.checkLoginState,
                    error => { throw error; }
                )
                .then(
                    promises.logout,
                    error => { this.setState({data: {}, status: 'unknown'}); }
                )
                .then(
                    response => { this.setState({loading: false, data: {}, status: 'unknown'}); },
                    error => { throw error; }
                )
                .catch(error => { 
                    this.setState({loading: false, data: {}, status: 'unknown'});
                    console.warn(error); 
                });
        });
    },
    checkStatus() {
        this.setState({
            loading: true
        }, () => {
            promises.init()
                .then(
                    promises.checkLoginState,
                    error => { throw error; }
                )
                .then(
                    response => { this.setState({status: response.status}); },
                    error => { throw error; }
                )
                .then(
                    promises.fetchUser,
                    error => { throw error; }
                )
                .then(
                    response => { this.setState({loading: false, data: response, status: 'connected'}); },
                    error => { throw error; }
                )
                .catch((error) => { 
                    this.setState({loading: false, data: {}, status: 'unknown'});
                    console.warn(error); 
                });
        });
    }
};