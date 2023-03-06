import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { UserListServiceService } from './user-list-service.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userList: any = [];
  searchValue = new FormControl();
  private formCtrlSub = new Subject<string>();
  isScrolled: boolean = false;
  infiniteScrollDistance = 0;
  infiniteThrottle = 300;
  searchCount: number = 0;
  loading: boolean = false;

  constructor(private userService: UserListServiceService) { }

  ngOnInit() {
    this.getUserList();
    // debounce keystroke events
    this.formCtrlSub.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe((res) => {
        this.loading = true
        this.userList = [];
        this.getSearchedUserList()
      })
  }

  getUserList() {
    this.userService.getUserList().subscribe((res) => {
      this.userList = this.userList.concat(res);
      this.loading = false;
    })
  }

  search() {
    if (this.searchValue.value && this.searchValue.value !== "") {
      this.formCtrlSub.next(this.searchValue.value);
    } else {
      this.userList = [];
      this.getUserList();
    }

  }

  getSearchedUserList() {
    this.userService.getSearchResult(this.searchValue.value).subscribe((res: any) => {
      this.userList = this.userList.concat(res.items);
      this.loading = false;
    })
  }

  trackByUserId(index: number, data: any): number {
    return data.id
      ;
  }

  onScroll(ev: any) {
    if (this.searchValue.value && this.searchValue.value !== "") {
      const scrollPosition = Math.random();
      this.formCtrlSub.next(scrollPosition.toString());
    }
    else {
      this.loading = true
      this.getUserList();
    }
  }

}
