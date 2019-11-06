import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  libid: string;
  root = 'file/';
  constructor(private http: HttpClient) { }
  setid(id: string) {
    this.libid = id;
  }
  getEle(): Observable<number[][]> {
    const url = this.root + 'lib' + this.libid;
    return this.http.get<number[][]>(url);
  }
  getXrd(id: number): Observable<number[][]> {
    const url = this.root + id;
    return this.http.get<number[][]>(url);
  }
  getlib(): Observable<any[]>{
    const url = this.root + 'lib';
    return this.http.get<any>(url);
  }
}
