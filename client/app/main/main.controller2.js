"use strict";
angular.module("bookjumpApp", ["ngCookies", "ngResource", "ngSanitize", "ngRoute", "ui.bootstrap"]).config(["$routeProvider", "$locationProvider", "$httpProvider", function(a, b, c) {
    a.otherwise({
        redirectTo: "/"
    }), b.html5Mode(!0), c.interceptors.push("authInterceptor")
}]).factory("authInterceptor", ["$rootScope", "$q", "$cookieStore", "$location", function(a, b, c, d) {
    return {
        request: function(a) {
            return a.headers = a.headers || {}, c.get("token") && (a.headers.Authorization = "Bearer " + c.get("token")), a
        },
        responseError: function(a) {
            return 401 === a.status ? (d.path("/login"), c.remove("token"), b.reject(a)) : b.reject(a)
        }
    }
}]).run(["$rootScope", "$location", "Auth", function(a, b, c) {
    a.$on("$routeChangeStart", function(a, d) {
        c.isLoggedInAsync(function(a) {
            d.authenticate && !a && b.path("/login")
        })
    })
}]), angular.module("bookjumpApp").config(["$routeProvider", function(a) {
    a.when("/login", {
        templateUrl: "app/account/login/login.html",
        controller: "LoginCtrl"
    }).when("/signup", {
        templateUrl: "app/account/signup/signup.html",
        controller: "SignupCtrl"
    }).when("/settings", {
        templateUrl: "app/account/settings/settings.html",
        controller: "SettingsCtrl",
        authenticate: !0
    })
}]), angular.module("bookjumpApp").controller("LoginCtrl", ["$scope", "Auth", "$location", "$window", function(a, b, c, d) {
    a.user = {}, a.errors = {}, a.login = function(d) {
        a.submitted = !0, d.$valid && b.login({
            email: a.user.email,
            password: a.user.password
        }).then(function() {
            c.path("/")
        })["catch"](function(b) {
            a.errors.other = b.message
        })
    }, a.loginOauth = function(a) {
        d.location.href = "/auth/" + a
    }
}]), angular.module("bookjumpApp").controller("SettingsCtrl", ["$scope", "User", "Auth", "$http", function(a, b, c, d) {
    a.errors = {}, a.getCurrentUser = c.getCurrentUser, a.updateProfile = function() {
        d.put("/api/users/" + a.getCurrentUser()._id + "/" + a.city + "/" + a.state)
    }, a.changePassword = function(b) {
        a.submitted = !0, b.$valid && c.changePassword(a.user.oldPassword, a.user.newPassword).then(function() {
            a.message = "Password successfully changed."
        })["catch"](function() {
            b.password.$setValidity("mongoose", !1), a.errors.other = "Incorrect password", a.message = ""
        })
    }
}]), angular.module("bookjumpApp").controller("SignupCtrl", ["$scope", "Auth", "$location", "$window", function(a, b, c, d) {
    a.user = {}, a.errors = {}, a.register = function(d) {
        a.submitted = !0, d.$valid && b.createUser({
            name: a.user.name,
            email: a.user.email,
            password: a.user.password
        }).then(function() {
            c.path("/")
        })["catch"](function(b) {
            b = b.data, a.errors = {}, angular.forEach(b.errors, function(b, c) {
                d[c].$setValidity("mongoose", !1), a.errors[c] = b.message
            })
        })
    }, a.loginOauth = function(a) {
        d.location.href = "/auth/" + a
    }
}]), angular.module("bookjumpApp").controller("AdminCtrl", ["$scope", "$http", "Auth", "User", function(a, b, c, d) {
    a.users = d.query(), a["delete"] = function(b) {
        d.remove({
            id: b._id
        }), angular.forEach(a.users, function(c, d) {
            c === b && a.users.splice(d, 1)
        })
    }
}]), angular.module("bookjumpApp").config(["$routeProvider", function(a) {
    a.when("/admin", {
        templateUrl: "app/admin/admin.html",
        controller: "AdminCtrl"
    })
}]), angular.module("bookjumpApp").controller("AllbooksCtrl", ["$scope", "$http", "Auth", function(a, b, c) {
    a.getCurrentUser = c.getCurrentUser, b.get("/api/books/").success(function(b) {
        a.books = b
    }), a.deleteBook = function(c) {
        b["delete"]("/api/books/" + c._id).success(function() {
            b.get("/api/books/").success(function(b) {
                a.books = b
            })
        })
    }, a.requestBook = function(c) {
        var d = {
            book: c.title,
            bookid: c._id,
            ownerid: c.owner,
            requesterid: a.getCurrentUser()._id,
            approved: !1
        };
        c.requested = !0, b.put("/api/books/" + c._id).success(function(c) {
            b.get("/api/books/").success(function(b) {
                a.books = b
            })
        }), b.post("/api/requests/", d)
    }
}]), angular.module("bookjumpApp").config(["$routeProvider", function(a) {
    a.when("/allbooks", {
        templateUrl: "app/allbooks/allbooks.html",
        controller: "AllbooksCtrl",
        authenticate: !0
    })
}]), angular.module("bookjumpApp").controller("MainCtrl", ["$scope", "$http", function(a, b) {
    a.awesomeThings = [], b.get("/api/things").success(function(b) {
        a.awesomeThings = b
    }), a.addThing = function() {
        "" !== a.newThing && (b.post("/api/things", {
            name: a.newThing
        }), a.newThing = "")
    }, a.deleteThing = function(a) {
        b["delete"]("/api/things/" + a._id)
    }
}]), angular.module("bookjumpApp").config(["$routeProvider", function(a) {
    a.when("/", {
        templateUrl: "app/main/main.html",
        controller: "MainCtrl"
    })
}]), angular.module("bookjumpApp").controller("MybooksCtrl", ["$scope", "$http", "Auth", function(a, b, c) {
    a.getCurrentUser = c.getCurrentUser, b.get("/api/books/user/" + a.getCurrentUser()._id).success(function(b) {
        a.books = b
    }), a.addBook = function() {
        $(".btn").prop("disabled", !0), $(".form-control").prop("disabled", !0), b.post("/api/books/add/" + a.newBook + "/" + a.getCurrentUser()._id).success(function(c) {
            b.get("/api/books/user/" + a.getCurrentUser()._id).success(function(b) {
                a.books = b, $(".btn").prop("disabled", !1), $(".form-control").prop("disabled", !1), a.newBook = ""
            })
        }).error(function() {
            alert("Something went wrong, try again or refresh the page"), $(".btn").prop("disabled", !1), $(".form-control").prop("disabled", !1)
        })
    }, a.deleteBook = function(c) {
        b["delete"]("/api/books/" + c._id).success(function() {
            b.get("/api/books/user/" + a.getCurrentUser()._id).success(function(b) {
                a.books = b
            })
        })
    }
}]), angular.module("bookjumpApp").config(["$routeProvider", function(a) {
    a.when("/mybooks", {
        templateUrl: "app/mybooks/mybooks.html",
        controller: "MybooksCtrl",
        authenticate: !0
    })
}]), angular.module("bookjumpApp").directive("profile", function() {
    return {
        templateUrl: "app/profile/profile.html",
        restrict: "EA",
        link: function(a, b, c) {}
    }
}), angular.module("bookjumpApp").directive("request", function() {
    return {
        templateUrl: "app/request/request.html",
        restrict: "EA",
        link: function(a, b, c) {},
        controller: ["$scope", "$http", "Auth", function(a, b, c) {
            a.approved = [], a.otherApproved = [], a.showing = 0, a.show = function(b) {
                a.showing = a.showing == b ? 0 : b
            }, a.approve = function(c) {
                b.put("/api/requests/" + c._id, c).success(function() {
                    b.get("/api/requests/user/" + a.getCurrentUser()._id).success(function(b) {
                        a.otherReqs = b, a.approved = [], a.otherReqs.forEach(function(b) {
                            b.approved && a.approved.push(b)
                        }), a.otherReqs = a.otherReqs.filter(function(a) {
                            return !a.approved
                        })
                    })
                })
            }, a.cancelReq = function(c) {
                var d;
                b.get("/api/books/" + c.bookid).success(function(e) {
                    d = e, b.put("/api/books/" + c.bookid, d).success(function() {}), b["delete"]("/api/requests/" + c._id).success(function() {
                        a.refreshReqs()
                    })
                })
            }, a.refreshReqs = function() {
                b.get("/api/requests/my/" + a.getCurrentUser()._id).success(function(b) {
                    a.myReqs = b, a.otherApproved = [], a.myReqs.forEach(function(b) {
                        b.approved && a.otherApproved.push(b)
                    }), a.myReqs = a.myReqs.filter(function(a) {
                        return !a.approved
                    })
                }), b.get("/api/requests/user/" + a.getCurrentUser()._id).success(function(b) {
                    a.otherReqs = b, a.approved = [], a.otherReqs.forEach(function(b) {
                        b.approved && a.approved.push(b)
                    }), a.otherReqs = a.otherReqs.filter(function(a) {
                        return !a.approved
                    })
                })
            }, a.refreshReqs()
        }]
    }
}), angular.module("bookjumpApp").factory("Auth", ["$location", "$rootScope", "$http", "User", "$cookieStore", "$q", function(a, b, c, d, e, f) {
    var g = {};
    return e.get("token") && (g = d.get()), {
        login: function(a, b) {
            var h = b || angular.noop,
                i = f.defer();
            return c.post("/auth/local", {
                email: a.email,
                password: a.password
            }).success(function(a) {
                return e.put("token", a.token), g = d.get(), i.resolve(a), h()
            }).error(function(a) {
                return this.logout(), i.reject(a), h(a)
            }.bind(this)), i.promise
        },
        logout: function() {
            e.remove("token"), g = {}
        },
        createUser: function(a, b) {
            var c = b || angular.noop;
            return d.save(a, function(b) {
                return e.put("token", b.token), g = d.get(), c(a)
            }, function(a) {
                return this.logout(), c(a)
            }.bind(this)).$promise
        },
        changePassword: function(a, b, c) {
            var e = c || angular.noop;
            return d.changePassword({
                id: g._id
            }, {
                oldPassword: a,
                newPassword: b
            }, function(a) {
                return e(a)
            }, function(a) {
                return e(a)
            }).$promise
        },
        getCurrentUser: function() {
            return g
        },
        isLoggedIn: function() {
            return g.hasOwnProperty("role")
        },
        isLoggedInAsync: function(a) {
            g.hasOwnProperty("$promise") ? g.$promise.then(function() {
                a(!0)
            })["catch"](function() {
                a(!1)
            }) : a(g.hasOwnProperty("role") ? !0 : !1)
        },
        isAdmin: function() {
            return "admin" === g.role
        },
        getToken: function() {
            return e.get("token")
        }
    }
}]), angular.module("bookjumpApp").factory("User", ["$resource", function(a) {
    return a("/api/users/:id/:controller", {
        id: "@_id"
    }, {
        changePassword: {
            method: "PUT",
            params: {
                controller: "password"
            }
        },
        get: {
            method: "GET",
            params: {
                id: "me"
            }
        }
    })
}]), angular.module("bookjumpApp").factory("Modal", ["$rootScope", "$modal", function(a, b) {
    function c(c, d) {
        var e = a.$new();
        return c = c || {}, d = d || "modal-default", angular.extend(e, c), b.open({
            templateUrl: "components/modal/modal.html",
            windowClass: d,
            scope: e
        })
    }
    return {
        confirm: {
            "delete": function(a) {
                return a = a || angular.noop,
                    function() {
                        var b, d = Array.prototype.slice.call(arguments),
                            e = d.shift();
                        b = c({
                            modal: {
                                dismissable: !0,
                                title: "Confirm Delete",
                                html: "<p>Are you sure you want to delete <strong>" + e + "</strong> ?</p>",
                                buttons: [{
                                    classes: "btn-danger",
                                    text: "Delete",
                                    click: function(a) {
                                        b.close(a)
                                    }
                                }, {
                                    classes: "btn-default",
                                    text: "Cancel",
                                    click: function(a) {
                                        b.dismiss(a)
                                    }
                                }]
                            }
                        }, "modal-danger"), b.result.then(function(b) {
                            a.apply(b, d)
                        })
                    }
            }
        }
    }
}]), angular.module("bookjumpApp").directive("mongooseError", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(a, b, c, d) {
            b.on("keydown", function() {
                return d.$setValidity("mongoose", !0)
            })
        }
    }
}), angular.module("bookjumpApp").controller("NavbarCtrl", ["$scope", "$location", "Auth", function(a, b, c) {
    a.menu = [{
        title: "Home",
        link: "/"
    }], a.isCollapsed = !0, a.isLoggedIn = c.isLoggedIn, a.isAdmin = c.isAdmin, a.getCurrentUser = c.getCurrentUser, a.logout = function() {
        c.logout(), b.path("/login")
    }, a.isActive = function(a) {
        return a === b.path()
    }
}]), angular.module("bookjumpApp").run(["$templateCache", function(a) {
    a.put("app/account/login/login.html", '<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Login</h1><p>Accounts are reset on server restart from <code>server/config/seed.js</code>. Default account is <code>test@test.com</code> / <code>test</code></p><p>Admin account is <code>admin@admin.com</code> / <code>admin</code></p></div><div class=col-sm-12><form class=form name=form ng-submit=login(form) novalidate><div class=form-group><label>Email</label><input type=email name=email class=form-control ng-model=user.email required></div><div class=form-group><label>Password</label><input type=password name=password class=form-control ng-model=user.password required></div><div class="form-group has-error"><p class=help-block ng-show="form.email.$error.required && form.password.$error.required && submitted">Please enter your email and password.</p><p class=help-block ng-show="form.email.$error.email && submitted">Please enter a valid email.</p><p class=help-block>{{ errors.other }}</p></div><div><button class="btn btn-inverse btn-lg btn-login" type=submit>Login</button> <a class="btn btn-default btn-lg btn-register" href=/signup>Register</a></div><hr><div></div></form></div></div><hr></div>'), a.put("app/account/settings/settings.html", '<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Update Profile</h1><form class=form name=form ng-submit=updateProfile(form) novalidate><div class=form-group><label>City</label><input name=city class=form-control placeholder={{getCurrentUser().city}} ng-model="city"></div><div class=form-group><label>State</label><input name=state class=form-control placeholder={{getCurrentUser().state}} ng-model="state"></div><button class="btn btn-lg btn-primary" type=submit>Save changes</button></form><h1>Change Password</h1></div><div class=col-sm-12><form class=form name=form ng-submit=changePassword(form) novalidate><div class=form-group><label>Current Password</label><input type=password name=password class=form-control ng-model=user.oldPassword mongoose-error><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.other }}</p></div><div class=form-group><label>New Password</label><input type=password name=newPassword class=form-control ng-model=user.newPassword ng-minlength=3 required><p class=help-block ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || submitted)">Password must be at least 3 characters.</p></div><p class=help-block>{{ message }}</p><button class="btn btn-lg btn-primary" type=submit>Save changes</button></form></div></div></div>'), a.put("app/account/signup/signup.html", '<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Sign up</h1></div><div class=col-sm-12><form class=form name=form ng-submit=register(form) novalidate><div class=form-group ng-class="{ \'has-success\': form.name.$valid && submitted,\n                                            \'has-error\': form.name.$invalid && submitted }"><label>Name</label><input name=name class=form-control ng-model=user.name required><p class=help-block ng-show="form.name.$error.required && submitted">A name is required</p></div><div class=form-group ng-class="{ \'has-success\': form.email.$valid && submitted,\n                                            \'has-error\': form.email.$invalid && submitted }"><label>Email</label><input type=email name=email class=form-control ng-model=user.email required mongoose-error><p class=help-block ng-show="form.email.$error.email && submitted">Doesn\'t look like a valid email.</p><p class=help-block ng-show="form.email.$error.required && submitted">What\'s your email address?</p><p class=help-block ng-show=form.email.$error.mongoose>{{ errors.email }}</p></div><div class=form-group ng-class="{ \'has-success\': form.password.$valid && submitted,\n                                            \'has-error\': form.password.$invalid && submitted }"><label>Password</label><input type=password name=password class=form-control ng-model=user.password ng-minlength=3 required mongoose-error><p class=help-block ng-show="(form.password.$error.minlength || form.password.$error.required) && submitted">Password must be at least 3 characters.</p><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.password }}</p></div><div><button class="btn btn-inverse btn-lg btn-login" type=submit>Sign up</button> <a class="btn btn-default btn-lg btn-register" href=/login>Login</a></div><hr><div></div></form></div></div><hr></div>'), a.put("app/admin/admin.html", '<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p><ul class=list-group><li class=list-group-item ng-repeat="user in users"><strong>{{user.name}}</strong><br><span class=text-muted>{{user.email}}</span> <a ng-click=delete(user) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></li></ul></div>'), a.put("app/allbooks/allbooks.html", '<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><request></request><div class=row><div class=col-lg-12><h1 class=page-header>All Books:</h1><p>Click the <i class="fa fa-retweet"></i> to request a trade!</p><div class=cover ng-repeat="book in books"><a><img ng-src={{book.cover}} alt="{{book.title}}"><button ng-hide="book.requested || book.owner == getCurrentUser()._id" type=button class=close ng-click=requestBook(book)><i class="fa fa-retweet"></i></button></a></div></div></div></div><footer class=footer><div class=container><p><a href=https://twitter.com/clnhll>@clnhll</a> | <a href=https://github.com/clnhll/bookjump>GitHub</a></p></div></footer>'), a.put("app/main/main.html", '<div ng-include="\'components/navbar/navbar.html\'"></div><header class=hero-unit id=banner><div class=container><h1>BookJump</h1><p class=lead>The first rule of bookjump is don\'t talk about bookjump.</p><span style="font-size: 60pt" class="glyphicon glyphicon-leaf" aria-hidden=true></span></div></header><div class=container><div class=row><div class=col-lg-12><h1 class=page-header>Features:</h1><ul class="nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6"><li><a href=# tooltip="">Catalogue your books online</a></li></ul><ul class="nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6"><li><a href=# tooltip="">See all of the books our users own</a></li></ul><ul class="nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6"><li><a href=# tooltip="">Request to borrow other users\' books</a></li></ul><ul class="nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6"><li><a href=# tooltip="">Easily manage books and requests from your dashboard</a></li></ul></div></div></div><footer class=footer><div class=container><p><a href=https://twitter.com/clnhll>@clnhll</a> | <a href=https://github.com/clnhll/bookjump>GitHub</a></p></div></footer>'), a.put("app/mybooks/mybooks.html", '<div ng-include="\'components/navbar/navbar.html\'"></div>\n\n<div class="container">\n\n<request></request>\n\n  <div class="row">\n    <div class="col-lg-12">\n      <h1 class="page-header">My Books:</h1>\n      <form ng-submit="addBook()" class="form-inline">\n        <div class="form-group">\n          <input type="text" class="form-control" placeholder="Add Book"= ng-model="newBook" />\n        </div>\n        <button type="submit" class="btn btn-micro btn-primary">Add</button>\n      </form>\n      <div class="cover" ng-repeat="book in books">\n        <a><img ng-src="{{book.cover}}" alt="{{book.title}}"/><button type="button" class="close" ng-click="deleteBook(book)">&times;</button></a>\n      </div>\n    </div>\n  </div>\n</div>\n\n<footer class="footer">\n  <div class="container">\n      <p><a href="https://twitter.com/clnhll">@clnhll</a> |\n         <a href="https://github.com/clnhll/bookjump">GitHub</a></p>\n  </div>\n</footer>\n'), a.put("app/profile/profile.html", "<div>this is the profile directive</div>"), a.put("app/request/request.html", '<button ng-click=show(1) class="btn btn-success">Your trade requests ({{myReqs.length}} outstanding)</button> <button ng-click=show(2) class="btn btn-primary">Trade requests for you ({{otherReqs.length}} unapproved)</button><div class=row ng-show="myReqs.length !== 0 && showing==1"><div class=col-lg-12><h1 class=page-header>Your outstanding requests:</h1><ul class="nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6" ng-repeat="request in myReqs"><li><a href="">{{request.book}}<button class=close><i class="fa fa-times" ng-click=cancelReq(request)></i></button></a></li></ul></div></div><div class=row ng-show="otherApproved.length !== 0 && showing==1"><div class=col-lg-12><h1 class=page-header>Your trade request was approved:</h1><ul class="nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6" ng-repeat="request in otherApproved"><li><a href="">{{request.book}}<button class=close ng-click=cancelReq(request)><i class="fa fa-times"></i></button></a></li></ul></div></div><div class=row ng-show="otherReqs.length !== 0 && showing==2"><div class=col-lg-12><h1 class=page-header>Requests from other users:</h1><ul class="nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6" ng-repeat="request in otherReqs"><li><a href="">{{request.book}}<button class=close ng-click=approve(request)><i class="fa fa-check"></i></button><button class=close ng-click=cancelReq(request)><i class="fa fa-times"></i></button></a></li></ul></div></div><div class=row ng-show="approved.length !== 0 && showing==2"><div class=col-lg-12><h1 class=page-header>Requests you\'ve approved:</h1><ul class="nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6" ng-repeat="request in approved"><li><a href="">{{request.book}}<button class=close ng-click=cancelReq(request)><i class="fa fa-times"></i></button></a></li></ul></div></div>'), a.put("components/modal/modal.html", '<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>'), a.put("components/navbar/navbar.html", '<div class="navbar navbar-default navbar-static-top" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click="isCollapsed = !isCollapsed"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href="/" class=navbar-brand>bookjump</a></div><div collapse=isCollapsed class="navbar-collapse collapse" id=navbar-main><ul class="nav navbar-nav"><li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}"><a ng-href={{item.link}}>{{item.title}}</a></li><li ng-show=isAdmin() ng-class="{active: isActive(\'/admin\')}"><a href=/admin>Admin</a></li></ul><ul class="nav navbar-nav navbar-right"><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/allbooks\')}"><a href=/allbooks>All Books</a></li><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/mybooks\')}"><a href=/mybooks>My Books</a></li><li ng-hide=isLoggedIn() ng-class="{active: isActive(\'/signup\')}"><a href=/signup>Sign up</a></li><li ng-hide=isLoggedIn() ng-class="{active: isActive(\'/login\')}"><a href=/login>Login</a></li><!--<li ng-show="isLoggedIn()"><p class="navbar-text">Hello {{ getCurrentUser().name }}</p> </li> !--><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/settings\')}"><a href=/settings><span class="glyphicon glyphicon-cog"></span></a></li><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/logout\')}"><a href="" ng-click=logout()><i class="fa fa-power-off"></i></a></li></ul></div></div></div>')
}]);