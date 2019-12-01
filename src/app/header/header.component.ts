import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{

    private userSub: Subscription;
    isAuthenticated = false;

    constructor(
        private dataStorageService: DataStorageService,
        private authService: AuthService
        ) {}

    ngOnInit() {
        this.userSub = this.authService.user.subscribe( user => {
            this.isAuthenticated = !!user;
            console.log('In ngOnInit:header: !user is:' + !user);
            console.log('In ngOnInit:header: !!user is:' + !!user);
        });


    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }

    onLogout() {
        this.authService.logout();
    }

    onSaveData() {
        this.dataStorageService.storeRecipes();
    }

    onFetchData() {
        this.dataStorageService.fetchRecipes().subscribe();
    }


}
