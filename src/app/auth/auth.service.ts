import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {throwError, Subject, BehaviorSubject} from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(
        private http: HttpClient,
        private router: Router) {}

    signUp(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCLB9OvBS-SSnqlZRb5GX4fPuXO1fwVuiY',
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            .pipe(
                catchError(this.handleError),
                tap(resData => {
                    this.handleAuthentication(
                        resData.email,
                        resData.localId,
                        resData.idToken,
                        +resData.expiresIn
                    );
                })
            );
    }

    private handleAuthentication(
                        email: string,
                        userId: string,
                        token: string,
                        expiresIn: number) {
        const expirationDate = new Date(
                                    new Date().getTime() + expiresIn * 1000
                                );
        const user = new User(
                                email,
                                userId,
                                token,
                                expirationDate
                            );
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);

        localStorage.setItem('userData', JSON.stringify(user));
    }



    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }

        const loadedUser = new User(
                                userData.email,
                                userData.id,
                                userData._token,
                                new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCLB9OvBS-SSnqlZRb5GX4fPuXO1fwVuiY',
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                }
        )
        .pipe(
            catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(
                    resData.email,
                    resData.localId,
                    resData.idToken,
                    +resData.expiresIn
                );
            })
        );
    }

    autoLogout(expirationDuration: number) {
        console.log('expirationDuration in autoLogout:' + expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');

        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        this.tokenExpirationTimer = null;
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';

        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }

        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email already exists. Please try a different one.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email was not found';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is incorrect';
                break;
        }
        return throwError(errorMessage);
    }
}
