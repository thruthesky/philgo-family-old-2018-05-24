# Register Page

1. User MUST register in PhilGo.COM and xbase.
2. If user logs in through Social, then the user must register or log in PhilGo.COM and xbase.
3. Primary photo must saved in firebase storage.




# Example Codes


## A Temporary User Registration and A Temporary Post Create

````
        let d = new Date();
        let id = "random" + ( d.getTime() / 1000 );
        let password = id;
        let userData: MEMBER_DATA = {
            id: id,
            password: password,
            name: id,
            nickname: id,
            email: id + '@gmail.com',
            mobile: '12345678901'
        };
        this.member.register( userData, login => {
            console.log("user registration success: ", login);
            this.form.id = id;
            this.form.session_id = login.session_id;
            this.post.create( this.form, data => {
                console.log("post create success: ", data);
                },
                error => alert( error ),
                () => {}
            )
        }, e => alert( 'User registration failed: ' + e ) );
````