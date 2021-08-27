import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-enterprise/nativestorage/ngx';
import { PoopSample } from '../interfaces/poopSample';
import { BehaviorSubject } from 'rxjs';
import { Pet } from '../classes/pet';
import { Todo } from '../interfaces/todo';
import { UserService } from './user.service';
import { AwsDataStoreService } from './aws-data-store.service';
import { randomTwelveDigit } from '../helpers/randomInt';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private nativeStorageErrorCodes = {
    "1": "NATIVE_WRITE_FAILED",
    "2": "ITEM_NOT_FOUND",
    "3": "NULL_REFERENCE",
    "4": "UNDEFINED_TYPE",
    "5": "JSON_ERROR",
    "6": "WRONG_PARAMETER",
  }
  private _errorMessage = "Something went wrong, but like a lost tennis ball we can’t seem to spot it! Please try again."
  private _currentPet = new BehaviorSubject<Pet>(null);
  private _isOnboardingComplete = new BehaviorSubject<boolean>(false);
  private _onboardingInProgress = new BehaviorSubject<string>("");
  private _hasTakenRecord = new BehaviorSubject<boolean>(false);
  private _hasRegistered = new BehaviorSubject<boolean>(false);
  private _orientationPos = new BehaviorSubject<Number>(0);
  public currentPet$ = this._currentPet.asObservable();
  public isOnboardingComplete$ = this._isOnboardingComplete.asObservable();
  public pets: Pet[]
  public onboardingInProgress$ = this._onboardingInProgress.asObservable();
  public hasTakenRecord$ = this._hasTakenRecord.asObservable();
  public hasRegistered$ = this._hasRegistered.asObservable();
  public orientationPos$ = this._orientationPos.asObservable();

  private isUserSignedIn = false
  private currentUser:any = false

  constructor(
    private nativeStorage: NativeStorage,
    private userService: UserService,
    private awsDataStoreService: AwsDataStoreService
  ) {
    this.isOnboardingComplete().then((val: any) => this._isOnboardingComplete.next(val)).catch(() => null);
    this.getCurrentPet().then((pet: Pet) => this._currentPet.next(pet)).catch(() => null);
    this.isOnboardingInProgress().then((val: string) => this._onboardingInProgress.next(val)).catch(() => null);
    this.hasTakenRecord().then((val: boolean) => this._hasTakenRecord.next(val)).catch(() => null);
    this.getPets().then((petData: Pet[]) => this.pets = typeof petData === "string" ? JSON.parse(petData) : petData).catch(() => null);
    this.hasRegistered().then((val: boolean) => this._hasRegistered.next(val)).catch(() => null);
    this.getOrientationPos().then((val: Number) => this._orientationPos.next(val)).catch(() => null);
    this.userService.signedIn$.subscribe(_isSignedIn => this.updateCurrentUserStatus(_isSignedIn))
  }
  
  private async updateCurrentUserStatus(_isSignedIn) {
    this.isUserSignedIn = _isSignedIn
    if (_isSignedIn) {
      this.currentUser = await this.nativeStorage.getItem("activeUser")
    }
  }

  public get currentPetAsSingleValue(): Pet {
    console.log('__ DATA SERVICE __ currentPetAsSingleValue()')
    // for tracking
    return this._currentPet.value;
  }

  public addPoopSample(newPoopSample: PoopSample): Promise<void> {
    // TODO
    console.log('__ DATA SERVICE __ addPoopSample()')
    return new Promise((resolve, reject) => {
      this.hasTakenRecord$.subscribe(takenRecord => {
        if (!takenRecord) {
          this.takenRecord();
        }
      });

      this.nativeStorage.getItem("currentPet")
      .then(
        async (currentPetData: Pet) => {
          const poopData = currentPetData.poopData
          poopData.push(newPoopSample)
          const sortedPoopSamples = await this.groupAndSortPoopData(poopData)
          this.updatePetData("poopData", sortedPoopSamples)
          .then(() => resolve())
          .catch(err => reject(`${this.nativeStorageErrorCodes[err.code]}`))
        },
        (err) => reject(`${this._errorMessage}`)
      )
      .catch((err) => reject(err))
    })
  }

  public getPoopData(): Promise<PoopSample[]> {
    // TODO
    console.log('__ DATA SERVICE __ getPoopData()')
    return new Promise(async (resolve, reject) => {
      this.nativeStorage.getItem("currentPet")
      .then(
        async (currentPetData: Pet) => {
          const groupedAndSorted = await this.groupAndSortPoopData(currentPetData.poopData)
          resolve(groupedAndSorted)
        },
        () => { resolve([]) } // the data doesn't exist
      )
      .catch(() => reject(`${this._errorMessage}`))
    })
  }

  private groupAndSortPoopData(poopData: PoopSample[] = []): Promise<PoopSample[]> {
    return new Promise(async resolve => {
      // group data by date
      let grouped = []
      for (let i = 0; i < poopData.length; await i++) {
        const groupedIndex = await grouped.findIndex(item => item.date === poopData[i].date)
        if (groupedIndex !== -1) {
          const oldEs = grouped[groupedIndex].entries
          const newEs = poopData[i]["entries"]
          const combine = await oldEs.concat(newEs)
          grouped[groupedIndex].entries = combine
        }
        else {
          grouped.push(poopData[i])
        }
      }
      // sort latest first, descending
      const sortedData = await grouped.sort((a,b) => { return Number(new Date(b.date)) - Number(new Date(a.date)) })
      //sort each entry based on time, ascending
      await sortedData.forEach(async day => {
        await day.entries.sort((a,b) => {
          const nowA  = new Date()
          const nowB  = new Date()
          nowA.setHours(a.time.split(":")[0]); nowA.setMinutes(a.time.split(":")[1]); nowA.setSeconds(0);
          nowB.setHours(b.time.split(":")[0]); nowB.setMinutes(b.time.split(":")[1]); nowB.setSeconds(0);
          return Number(nowA) - Number(nowB)
        })
      })
      resolve(sortedData)
    })
  }

  public setCurrentOnboardingQuestion(q: number): Promise<void> {
    console.log('__ DATA SERVICE __ setCurrentOnboardingQuestion()')
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.createOrUpdateUserById(this.currentUser._id, { currentOnboardingQuestion: q })
        .then(() => resolve())
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        this.nativeStorage.setItem('onboardingQuestion', q)
        .then(() => resolve(), () => reject(`${this._errorMessage}`))
        .catch(() => reject(`${this._errorMessage}`))
      }
    })
  }

  public getCurrentOnboardingQuestion(): Promise<number> {
    console.log('__ DATA SERVICE __ getCurrentOnboardingQuestion()')
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.getUserById(this.currentUser._id, "currentOnboardingQuestion")
        .then(q => resolve(q))
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        this.nativeStorage.getItem('onboardingQuestion')
        .then(q => resolve(q), () => reject(`${this._errorMessage}`))
        .catch(() => reject(`${this._errorMessage}`))
      }
    })
  }

  public clearALLData(): Promise<void> {
    console.log('__ DATA SERVICE __ clearALLData()')
    // WARNING: THIS CLEARS **ALL** DATA FROM THE DEVICE
    return new Promise((resolve) => {
      this.nativeStorage.clear()
      .then(() => resolve())
    })
  }

  private isOnboardingComplete() {
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.getUserById(this.currentUser._id, "isOnBoardingComplete")
        .then(val => resolve(val))
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        this.nativeStorage.getItem('onboardingComplete')
        .then(val => resolve(val), () => reject(this._errorMessage))
        .catch(() => reject(this._errorMessage))
      }
    })
  }

  public onboardingInProgress(val: string): Promise<void> {
    // TODO rename to setCurrentOnboardingRouteName
    console.log('__ DATA SERVICE __ onboardingInProgress()')
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.createOrUpdateUserById(this.currentUser._id, { currentOnboardingRouteName: val })
        .then(() => {
          this._onboardingInProgress.next(val);
          resolve()
        })
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        this.nativeStorage.setItem("currentOnboardingRouteName", val).then(
          () => {
            this._onboardingInProgress.next(val);
            resolve()
          },
          (err) => reject(this._errorMessage)
        )
      }
    })
  } 

  public setOrientationPos(val: number): Promise<void> {
    console.log('__ DATA SERVICE __ setOrientationPos()')
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.createOrUpdateUserById(this.currentUser._id, { orientationCarouselSlidePosition: val })
        .then(() => {
          this._orientationPos.next(val);
          resolve()
        })
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        this.nativeStorage.setItem("orientationCarouselSlidePosition", val).then(
          () => {
            this._orientationPos.next(val);
            resolve()
          },
          (err) => reject(this._errorMessage)
        )
      }
    })
  }

  public getOrientationPos() {
    console.log('__ DATA SERVICE __ getOrientationPos()')
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.getUserById(this.currentUser._id, "orientationCarouselSlidePosition")
        .then(val => resolve(val))
        .catch(() => reject(`${this._errorMessage}`))
      }
      this.nativeStorage.getItem('orientationCarouselSlidePosition')
      .then(val => resolve(val), () => reject(this._errorMessage))
      .catch(() => reject(this._errorMessage))
    })
  }

  public isOnboardingInProgress() {
    // TODO rename to getCurrentOnboardingRouteName
    console.log('__ DATA SERVICE __ isOnboardingInProgress()')
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.getUserById(this.currentUser._id, "currentOnboardingRouteName")
        .then(val => resolve(val))
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        this.nativeStorage.getItem('currentOnboardingRouteName')
        .then(val => resolve(val), () => reject(this._errorMessage))
        .catch(() => reject(this._errorMessage))
      }
    })
  }
  public completedInitialSetup(): Promise<void> {
    console.log('__ DATA SERVICE __ completedInitialSetup()')
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.createOrUpdateUserById(this.currentUser._id, { isOnboardingComplete: true })
        .then(() => {
          this._isOnboardingComplete.next(true);
          resolve()
        })
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        this.nativeStorage.setItem("onboardingComplete", true).then(
          () => {
            this._isOnboardingComplete.next(true);
            resolve()
          },
          (err) => reject(this._errorMessage)
        )
      }
    });
  }

  public setToggleVar(toggle): Promise<void> {
    console.log('__ DATA SERVICE __ setToggleVar()')
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.createOrUpdateUserById(this.currentUser._id, { togglePoopDetails: toggle })
        .then(() => resolve())
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        this.nativeStorage.setItem('toggle-poop-details', toggle).then(
          () => resolve(),
          (err) => reject(this._errorMessage)
        )
      }
    })
  }
  public getToggleVar() {
    console.log('__ DATA SERVICE __ getToggleVar()')
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.getUserById(this.currentUser._id, "togglePoopDetails")
        .then(toggle => resolve(toggle))
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        this.nativeStorage.getItem('toggle-poop-details')
        .then((toggle) => { resolve(toggle) }, () => reject(this._errorMessage))
        .catch(() => reject(this._errorMessage))
      }
    })
  }

  public hasTakenRecord() {
    console.log('__ DATA SERVICE __ hasTakenRecord()')
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.getUserById(this.currentUser._id, "hasTakenFirstRecord")
        .then(val => resolve(val))
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        this.nativeStorage.getItem('takenRecord')
        .then(val => resolve(val), () => reject(this._errorMessage))
        .catch(() => reject(this._errorMessage))
      }
    });
  }

  public hasRegistered() {
    console.log('__ DATA SERVICE __ hasRegistered()')
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.getUserById(this.currentUser._id, "hasRegisteredInterest")
        .then(val => resolve(val))
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        this.nativeStorage.getItem('registered')
        .then(val => resolve(val), () => reject(this._errorMessage))
        .catch(() => reject(this._errorMessage))
      }
    });
  }
  
  public registered(): Promise<void> {
    console.log('__ DATA SERVICE __ registered()')
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.createOrUpdateUserById(this.currentUser._id, { hasRegisteredInterest: true })
        .then(() => {
          this._hasRegistered.next(true);
          resolve()
        })
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        this.nativeStorage.setItem("registered", true).then(
          () => {
            this._hasRegistered.next(true);
            resolve()
          },
          (err) => reject(this._errorMessage)
        )
      }
    });
  }

  public getPets() {
    console.log('__ DATA SERVICE __ getPets()')
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.getPetsByUserId(this.currentUser._id)
        .then(val => resolve(val))
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        // localstorage is full pets objects
        this.nativeStorage.getItem('pets')
        .then(val => resolve(val), () => reject(this._errorMessage))
        .catch(() => reject(this._errorMessage))
      }
    });
  }

  public takenRecord(): Promise<void> {
    console.log('__ DATA SERVICE __ takenRecord()')
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.createOrUpdateUserById(this.currentUser._id, { hasTakenFirstRecord: true })
        .then(() => {
          this._hasTakenRecord.next(true);
          resolve()
        })
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        this.nativeStorage.setItem("takenRecord", true).then(
          () => {
            this._hasTakenRecord.next(true);
            resolve()
          },
          (err) => reject(this._errorMessage)
        );
      }
    });
  }

  public getCurrentPet() {
    console.log('__ DATA SERVICE __ getCurrentPet()')
    // only called within this service on construct, avoid fetching all the time
    // _currentPet variable should always be in sync with this
    return new Promise((resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.getCurrentPetByUserId(this.currentUser._id)
        .then(petData => resolve(petData))
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        this.nativeStorage.getItem('currentPet')
        .then(petData => resolve(petData), () => reject(`${this._errorMessage}`))
        .catch(() => reject(`${this._errorMessage}`))
      }
    })
  }

  public setCurrentPet(petName): Promise<void> {
    console.log('__ DATA SERVICE __ setCurrentPet()')
    return new Promise((resolve, reject) => {
      this.getPetByName(petName).then((pet: Pet) => {
        if (this.isUserSignedIn) {
          this.awsDataStoreService.createOrUpdateUserById(this.currentUser._id, { currentPet: pet.id })
          .then(() => {
            this._currentPet.next(pet);
            resolve()
          })
          .catch(() => reject(`${this._errorMessage}`))
        }
        else {
          this.nativeStorage.setItem('currentPet', pet)
          .then(() => {
            this._currentPet.next(pet);
            resolve()
          }, () => reject(`${this._errorMessage}`))
          .catch(() => reject(`${this._errorMessage}`))
        }
      })
    })
  }

  private getPetByName(petName): Promise<Pet> {
    return new Promise((resolve) => {
      this.pets.forEach(pet => {
        if(pet.name === petName) resolve(pet)
      })
    });
  }

  private _addNewPet(pet: Pet, petsData, isSignedIn, resolve, reject): void {
    this.pets = petsData
    if (this.pets.some( ({name}) => name == pet.name)) return resolve() // we've got this pet already
    this.pets.push(pet); // push new pet into pets
    if (isSignedIn) {
      // push up new pet
      this.awsDataStoreService.createOrUpdatePetById(pet.id, pet)
      .then(() => resolve())
      .catch(() => reject(`${this._errorMessage}`))
    }
    else {
      // sync all pets
      this.nativeStorage.setItem('pets', this.pets).then(
        () => resolve(),
        (err) => reject(err)
      )
    }
  }

  public addPet(pet: Pet): Promise<void> {
    console.log('__ DATA SERVICE __ addPet()')
    return new Promise(async (resolve, reject) => {
      const errMsg = `${this._errorMessage}`;
      if (this.isUserSignedIn) {
        this.awsDataStoreService.createOrUpdateUserById(this.currentUser._id, { currentPet: pet.id })
        .then(() => {
          this._currentPet.next(pet);
          this.awsDataStoreService.getPetsByUserId(this.currentUser._id)
          .then((petsData) => this._addNewPet(pet, petsData, true, resolve, reject))
          .catch(() => this.pets = [])
          resolve()
        })
        .catch(() => reject(errMsg))
      }
      else {
        this.nativeStorage.setItem('currentPet', pet)
        .then(() => {
          this._currentPet.next(pet);
          this.nativeStorage.getItem('pets')
          .then(
            (petsData) => this._addNewPet(pet, petsData, false, resolve, reject),
            () => this.pets = []
          )
        },
        () => reject(errMsg))
        .catch(() => reject(errMsg))
      }
    })
  }

  public savePet(pet): Promise<void> {
    console.log('__ DATA SERVICE __ savePet()')
    return new Promise(async (resolve, reject) => {
      const errMsg = `${this._errorMessage}`;
      // use try/catch await so offline/online can set this.pets, ready for isOldPet check
      try {
        if (this.isUserSignedIn) {
          this.pets = await this.awsDataStoreService.getPetsByUserId(this.currentUser._id)
        }
        else {
          this.pets = await this.nativeStorage.getItem('pets')
        }
      }
      catch(e) {
        this.pets = []
      }
      // awaited either online of offline

      const isOldPet = this.pets.some(_pet => _pet.name === pet.name)
      if (isOldPet) {
        const oldDogIndex = this.pets.findIndex(_pet => _pet.name === pet.name)
        this.pets[oldDogIndex] = pet;
      }
      else {
        this.pets.push(pet);
      }

      if (this.isUserSignedIn) {
        this.awsDataStoreService.createOrUpdatePetById(pet.id, pet)
        .then(() => resolve())
        .catch(() => reject(`${this._errorMessage}`))
      }
      else {
        this.nativeStorage.setItem('pets', this.pets).then(
          () => resolve(),
          (err) => reject(err)
        )
      }
    })
  }

  private async _updatePetData(key, val, resolve, reject) {
    let pet:Pet
    try {
      if (this.isUserSignedIn) {
        pet = await this.awsDataStoreService.getCurrentPetByUserId(this.currentUser._id)
      }
      else {
        pet = await this.nativeStorage.getItem('currentPet')
      }
    }
    catch(e) {
      return reject(`${this._errorMessage}`)
    }

    pet[key] = val 
    this._currentPet.next(pet)
    try {
      if (this.isUserSignedIn) {
        await this.awsDataStoreService.createOrUpdateUserById(this.currentUser._id, { currentPet: pet.id })
      }
      else {
        await this.nativeStorage.setItem('currentPet', pet)
      }
    }
    catch(e) {
      return reject(`${this._errorMessage}`)
    }

    await this.savePet(pet)
    resolve()
  }

  public updatePetData(key, val): Promise<void> {
    console.log('__ DATA SERVICE __ updatePetData()')
    // this uses the current pet
    // if you pass a name in, it adds that name to your pets and sets the current pet to be that name
    return new Promise(async (resolve, reject) => {

      if (key === "name") {
        let pet = new Pet;
        pet.name = val;
        pet.weightType = 'kg';
        try {
          if (this.isUserSignedIn) {
            await this.awsDataStoreService.createOrUpdateUserById(this.currentUser._id, { currentPet: pet.id })
          }
          else {
            await this.nativeStorage.setItem('currentPet', pet)
          }
        }
        catch(e) {
          return reject(`${this._errorMessage}`)
        }

        // awaited offline/online
        this._currentPet.next(pet);
      }

      this._updatePetData(key, val, resolve, reject)
    })
  }

  private groupAndSortTodos(todos: Todo[]): Promise<Todo[]> {
    return new Promise(async resolve => {
      // group data by date
      let grouped = []
      for (let i = 0; i < todos.length; await i++) {
        const groupedIndex = await grouped.findIndex(group => group.date === todos[i].date)
        if (groupedIndex !== -1) {
          // we have this date already
          // add current todo into the group with same date
          grouped[groupedIndex].todos.push(todos[i])
        }
        else {
          grouped.push({
            date: todos[i].date,
            todos: [todos[i]]
          })
        }
      }
      // sort latest first, descending
      const sortedData = await grouped.sort((a,b) => { return Number(new Date(b.date)) - Number(new Date(a.date)) })
      resolve(sortedData)
    })
  }

  private async _addTodos(todos: any[], pet: Pet, resultMessage: string, signedIn: boolean, resolve, reject) {
    const newTodos: Todo[] = []
    todos.forEach(async todo => {
      newTodos.push({
        date: new Date().toISOString(),
        id: randomTwelveDigit(), // random id to identify for removing later
        categoryTitle: todo.category,
        categoryIcon: todo.icon,
        copy: `${this.sexCheckTodoCopy(todo.copy, pet)}`,
        title: resultMessage,
        petId: pet.id,
      })
    })
    if (signedIn) {
      const waitForFetch = []
      const todoIds = [].concat(pet.todos)
      newTodos.forEach((_newTodo: Todo) => {
        todoIds.push(_newTodo.id) // add todo id to push for pet update
        // add each new todo API call to the array
        waitForFetch.push(
          this.awsDataStoreService.createOrUpdateTodoById(_newTodo.id, pet.id)
        )
      })
      // update pet with new todo ids
      waitForFetch.push(this.awsDataStoreService.createOrUpdatePetById(pet.id, { todos: todoIds }))
      // wait for all the new todo APIs to complete then resolve
      Promise.all(waitForFetch)
      .then(() => resolve())
      .catch(() => reject(this._errorMessage))
    }
    else {
      let _todos = pet.todos // working array
      _todos = _todos.concat(newTodos)
      this.updatePetData("todos", _todos)
      .then(() => resolve())
      .catch(err => reject(`${this.nativeStorageErrorCodes[err.code]}`))
    }
  }
  
  public addTodos(todos: any[], resultMessage: string): Promise<any> {
    console.log('__ DATA SERVICE __ addTodos()')
    return new Promise(async (resolve, reject) => {
    // resultMessage: "Too wet" etc
    /* input todos 
      [ {icon, category, copy}, ... ]
    */
      if (this.isUserSignedIn) {
        let pet: Pet;
        let todos: [];
        try {
          pet = await this.awsDataStoreService.getCurrentPetByUserId(this.currentUser._id)
          this._addTodos(todos, pet, resultMessage, true, resolve, reject)
        }
        catch(e) { reject(this._errorMessage) }
      }
      else {
        this.nativeStorage.getItem('currentPet')
      .then(
        (pet: Pet) => this._addTodos(todos, pet, resultMessage, false, resolve, reject),
        () => reject(`${this._errorMessage}`)
      )
      .catch(() => reject(`${this._errorMessage}`))
      }
    })
  }

  public getTodos(): Promise<Todo[]> {
    // TODO
    console.log('__ DATA SERVICE __ getTodos()')
    return new Promise(async (resolve, reject) => {
      if (this.isUserSignedIn) {
        this.awsDataStoreService.getCurrentPetByUserId(this.currentUser._id)
        .then((pet: Pet) => {
          this.awsDataStoreService.getTodosByPetId(pet.id)
          .then(async (todos: Todo[]) => {
            const sortedAndGroupedTodos = await this.groupAndSortTodos(todos)
            resolve(sortedAndGroupedTodos)
          }).catch(() => reject(this._errorMessage))
        }).catch(() => reject(this._errorMessage))
      }
      else {
        this.nativeStorage.getItem("currentPet")
        .then(
          async (currentPetData: Pet) => {
            const sortedAndGroupedTodos = await this.groupAndSortTodos(currentPetData.todos)
            resolve(sortedAndGroupedTodos)
          },
          () => { resolve([]) } // the data doesn't exist
        )
        .catch(() => reject(`${this._errorMessage}`))
      }
    })
  }

  public sexCheckTodoCopy(copy: string, pet: Pet) {
    console.log('__ DATA SERVICE __ sexCheckTodoCopy()')
    const nameRegex = /<dog-name>/gi;
    const hisHerRegex = /<his-her-check>/gi;
    const heSheRegex = /<he-she-check>/gi;
    const himHerRegex = /<him-her-check>/gi;
    return copy
      .replace(nameRegex, pet.name)
      .replace(hisHerRegex, pet.gender === "male" ? "his" : ( pet.gender === "female" ? "her" : `${pet.name}'s` ))
      .replace(heSheRegex, pet.gender === "male" ? "he" : ( pet.gender === "female" ? "she" : pet.name ))
      .replace(himHerRegex, pet.gender === "male" ? "him" : ( pet.gender === "female" ? "her" : pet.name ))
  }

  public deleteTodo(todoId): Promise<void> {
    console.log('__ DATA SERVICE __ deleteTodo()')
    return new Promise((resolve, reject) => {
      this.nativeStorage.getItem("currentPet")
      .then(
        async (currentPetData: Pet) => {
          const todosAfterDelete = currentPetData.todos.filter((todo) => todo.id !== todoId)
          this.updatePetData("todos", todosAfterDelete)
          .then(() => resolve())
          .catch(err => reject(`${this.nativeStorageErrorCodes[err.code]}`))
        },
        () =>  reject(`${this._errorMessage}`)
      )
      .catch(() => reject(`${this._errorMessage}`))
    })
  }

  public setCookie(cookieName, val) {
    console.log('__ DATA SERVICE __ setCookie()')
    this.nativeStorage.setItem(`${cookieName}`, val)
  }
  public getCookie(cookieName) {
    console.log('__ DATA SERVICE __ getCookie()')
    return new Promise((resolve, reject) => {
      this.nativeStorage.getItem(`${cookieName}`).then(
        cookieVal => resolve(cookieVal),
        () => reject()
      )
    })
  }
}
