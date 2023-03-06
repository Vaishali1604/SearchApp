import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserListServiceService {
  userListUrl = "https://api.github.com/users";
  userSearchUrl = "https://api.github.com/search/users"

  constructor(private http: HttpClient) { }

  getUserList() {
    return this.http.get(`${this.userListUrl}?per_page=15`)
  }

  getSearchResult(searchText: string) {
    return this.http.get(`${this.userSearchUrl}?q=${searchText}&per_page=15`)
  }
  
}
