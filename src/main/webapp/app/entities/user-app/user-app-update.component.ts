import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IUserApp } from 'app/shared/model/user-app.model';
import { UserAppService } from './user-app.service';
import { IUserThirdpartyMembership } from 'app/shared/model/user-thirdparty-membership.model';
import { UserThirdpartyMembershipService } from 'app/entities/user-thirdparty-membership';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-user-app-update',
    templateUrl: './user-app-update.component.html'
})
export class UserAppUpdateComponent implements OnInit {
    userApp: IUserApp;
    isSaving: boolean;

    userthirdpartymemberships: IUserThirdpartyMembership[];

    users: IUser[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected userAppService: UserAppService,
        protected userThirdpartyMembershipService: UserThirdpartyMembershipService,
        protected userService: UserService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ userApp }) => {
            this.userApp = userApp;
        });
        this.userThirdpartyMembershipService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUserThirdpartyMembership[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUserThirdpartyMembership[]>) => response.body)
            )
            .subscribe(
                (res: IUserThirdpartyMembership[]) => (this.userthirdpartymemberships = res),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        this.userService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUser[]>) => response.body)
            )
            .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.userApp.id !== undefined) {
            this.subscribeToSaveResponse(this.userAppService.update(this.userApp));
        } else {
            this.subscribeToSaveResponse(this.userAppService.create(this.userApp));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserApp>>) {
        result.subscribe((res: HttpResponse<IUserApp>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserThirdpartyMembershipById(index: number, item: IUserThirdpartyMembership) {
        return item.id;
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
}
