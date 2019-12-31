import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { onErrorResumeNext, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {

    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

    private closeSub: Subscription;

    constructor(private authService: AuthService, 
                private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    ngOnDestroy() {
        if (this.closeSub) {
            this.closeSub.unsubscribe();
        }
    }

    onSubmit(form: NgForm) {

        if (!form.valid) {
            console.log('Form validation failed in onSubmit');
            return;
        }

        const email = form.value.email;
        const password = form.value.password;

        this.isLoading = true;
        this.error = null;

        let authObs: Observable<AuthResponseData>;

        if (this.isLoginMode) {
            authObs = this.authService.login(email, password);
        } else {
            authObs = this.authService.signUp(email, password);
        }

        authObs.subscribe(
            resData => {
                console.log(resData);
                this.isLoading = false;

                this.router.navigate(['/recipes']);
            },
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.showErrorAlert(errorMessage);
                this.isLoading = false;
            }
        );

        console.log('Resetting form');
        form.reset();
    }

    onHandleError() {
        this.error = null;
    }

    private showErrorAlert(message: string) {

        // const alertCmp = new AlertComponent();

        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe( () => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });

    }
}
