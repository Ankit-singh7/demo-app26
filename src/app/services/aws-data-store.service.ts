import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AwsDataStoreService {

  private API_ENDPOINT_DELETEDATA = `${environment.AWS_DATA_STORE_URI}/deleteData`
  private API_ENDPOINT_DELETEUSER = `${environment.AWS_DATA_STORE_URI}/deleteUser`
  private API_ENDPOINT_APPCONFIG = `${environment.AWS_DATA_STORE_URI}/appConfig`
  private API_ENDPOINT_USER = `${environment.AWS_DATA_STORE_URI}/user`
  private API_ENDPOINT_PETS = `${environment.AWS_DATA_STORE_URI}/pets`
  private API_ENDPOINT_USER_CURR_PET = `${environment.AWS_DATA_STORE_URI}/userPet`
  private API_ENDPOINT_PET = `${environment.AWS_DATA_STORE_URI}/pet`
  private API_ENDPOINT_TODO = `${environment.AWS_DATA_STORE_URI}/todo`
  private API_ENDPOINT_TODOS = `${environment.AWS_DATA_STORE_URI}/todos`
  private API_ENDPOINT_POOP = `${environment.AWS_DATA_STORE_URI}/poop`
  private API_ENDPOINT_POOPS = `${environment.AWS_DATA_STORE_URI}/poops`

  private _httpOptions = { headers: new HttpHeaders() }

  constructor(
    private http: HttpClient
  ) {
    this._httpOptions.headers.set("x-api-key", environment.AWS_DATA_STORE_KEY)
  }

  // user
  public createOrUpdateUserById(userId, keys = null): Promise<any> {
    const body = Object.assign({ "userID": userId }, keys ? keys : {}) // add the keys if they exist for update
    return this.http.post(`${this.API_ENDPOINT_USER}?ID=${userId}`, body, this._httpOptions).toPromise()
  }
  public getUserById(userId, key = null): Promise<any> {
    return this.http.get(`${this.API_ENDPOINT_USER}?ID=${userId}${key ? `&key=${key}` : ""}`, this._httpOptions).toPromise()
  }
  public deleteUserDataById(userId): Promise<any> {
    return this.http.get(`${this.API_ENDPOINT_DELETEDATA}?ID=${userId}`, this._httpOptions).toPromise()
  }
  public deleteUserAccountById(userId): Promise<any> {
    return this.http.get(`${this.API_ENDPOINT_DELETEUSER}?ID=${userId}`, this._httpOptions).toPromise()
  }

  // pet
  public createOrUpdatePetById(petId, keys = null): Promise<any> {
    const body = Object.assign({ "id": petId }, keys ? keys : {}) // add the keys if they exist for update
    return this.http.post(`${this.API_ENDPOINT_PET}?ID=${petId}`, body, this._httpOptions).toPromise()
  }
  public getPetById(petId, key = null): Promise<any> {
    return this.http.get(`${this.API_ENDPOINT_PET}?ID=${petId}${key ? `&key=${key}` : ""}`, this._httpOptions).toPromise()
  }
  public getPetsByUserId(userId): Promise<any> {
    return this.http.get(`${this.API_ENDPOINT_PETS}?ID=${userId}`, this._httpOptions).toPromise()
  }
  public getCurrentPetByUserId(userId): Promise<any> {
    return this.http.get(`${this.API_ENDPOINT_USER_CURR_PET}?ID=${userId}`, this._httpOptions).toPromise()
  }

  // poop
  public createOrUpdatePoopById(poopId, petId, keys = null): Promise<any> {
    const body = Object.assign({ "id": poopId }, keys ? keys : {}) // add the keys if they exist for update
    return this.http.post(`${this.API_ENDPOINT_POOP}?ID=${poopId}&petID=${petId}`, body, this._httpOptions).toPromise()
  }
  public getPoopById(poopId, key = null): Promise<any> {
    return this.http.get(`${this.API_ENDPOINT_POOP}?ID=${poopId}${key ? `&key=${key}` : ""}`, this._httpOptions).toPromise()
  }
  public getPoopsByPetId(petId): Promise<any> {
    return this.http.get(`${this.API_ENDPOINT_POOPS}?ID=${petId}`, this._httpOptions).toPromise()
  }

  // todo
  public createOrUpdateTodoById(todoId, petId, keys = null): Promise<any> {
    const body = Object.assign({ "id": todoId }, keys ? keys : {}) // add the keys if they exist for update
    return this.http.post(`${this.API_ENDPOINT_TODO}?ID=${todoId}&petID=${petId}`, body, this._httpOptions).toPromise()
  }
  public getTodoById(todoId, key = null): Promise<any> {
    return this.http.get(`${this.API_ENDPOINT_TODO}?ID=${todoId}${key ? `&key=${key}` : ""}`, this._httpOptions).toPromise()
  }
  public getTodosByPetId(petId): Promise<any> {
    return this.http.get(`${this.API_ENDPOINT_TODOS}?ID=${petId}`, this._httpOptions).toPromise()
  }

  // app config
  public getAppConfig(): Promise<any> {
    return this.http.get(`${this.API_ENDPOINT_APPCONFIG}`, this._httpOptions).toPromise()
  }
}