import { Injectable } from '@angular/core';
import { appBuild, appVersion, environment } from '../../environments/environment';
import { DataService } from './data.service';
import * as mixpanel from 'mixpanel-browser';
import { Router } from '@angular/router';
import { Pet } from '../classes/pet';
import { Device } from '@ionic-enterprise/device/ngx';
import { Network } from '@ionic-enterprise/network-information/ngx';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  private pet: Pet;
  private canUseTimer = false
  private screenOnTime = 0
  private screenTimer;
  private userID;

  private petProfileKey = {
    allergies: "Allergies",
    conditions: "Medical Conditions",
    age: "Age Bracket",
    mealFrequency: "Meals",
    treats: "Treats",
    humanTreats: "Human Food",
    neutered: "Neutered",
    weight: "Weight",
    dryFoods: "Dry Food Name",
    wetFoods: "Wet Food Name",
  }

  public superProps = {
    SCREEN_NAME: "Screen Name",
    PET_ID: "Pet ID",
    PET_COUNT: "Pet Count",
    POOP_COUNT: "Poop Count",
    APP_VERSION: "App Version",
    APP_BUILD_NUMBER: "App Build Number",
    OPERATING_SYSTEM_NAME: "Operating System Name",
    OPERATING_SYSTEM_VERSION: "Operating System Version",
    DEVICE_MANUFACTURER: "Device Manufacturer",
    DEVICE_MODEL: "Device Model",
    CONNECTION: "Connection",
  }

  private testingSuperProps: {
    SCREEN_NAME?: string,
    PET_ID?: string,
    PET_COUNT?: string,
    POOP_COUNT?: string,
    APP_VERSION?: string,
    APP_BUILD_NUMBER?: string,
    OPERATING_SYSTEM_NAME?: string,
    OPERATING_SYSTEM_VERSION?: string,
    DEVICE_MANUFACTURER?: string,
    DEVICE_MODEL?: string,
    CONNECTION?: string,
  } = {}

  constructor(
    private dataService: DataService, 
    private router: Router,
    private device: Device,
    private network: Network,
  ) {
    mixpanel.init(environment.mixpanelID);

    this.dataService.currentPet$.subscribe((pet: Pet) => { // subscribe for when current pet changes
      if (pet) this.pet = pet;
    });

    this.dataService.getCookie("user_ID")
    .then((id) => {
      // user has stored ID
      this.userID = id
      this.initService()
    })
    .catch(() => {
      const userID = Math.floor(Math.random() * ((+new Date()) - 0) ) + 0; // "true" random // integer
      this.userID = userID
      this.dataService.setCookie("user_ID", userID)
      this.initService()
    })
  }

  private initService() {
    Promise.all([
      this.registerSuperProperty(this.superProps.OPERATING_SYSTEM_NAME, this.device.platform),
      this.registerSuperProperty(this.superProps.OPERATING_SYSTEM_VERSION, this.device.version),
      this.registerSuperProperty(this.superProps.DEVICE_MANUFACTURER, this.device.manufacturer),
      this.registerSuperProperty(this.superProps.DEVICE_MODEL, this.device.model),
      this.registerSuperProperty(this.superProps.CONNECTION, this.network.type),
      this.registerSuperProperty(this.superProps.APP_VERSION, appVersion),
      this.registerSuperProperty(this.superProps.APP_BUILD_NUMBER, appBuild),

      this.registerPeopleProperty(this.superProps.OPERATING_SYSTEM_NAME, this.device.platform),
      this.registerPeopleProperty(this.superProps.OPERATING_SYSTEM_VERSION, this.device.version),
      this.registerPeopleProperty(this.superProps.DEVICE_MANUFACTURER, this.device.manufacturer),
      this.registerPeopleProperty(this.superProps.DEVICE_MODEL, this.device.model),
      this.registerPeopleProperty(this.superProps.CONNECTION, this.network.type),
      this.registerPeopleProperty(this.superProps.APP_VERSION, appVersion),
      this.registerPeopleProperty(this.superProps.APP_BUILD_NUMBER, appBuild),
    ]).then(() => {
      // ensure all super's are set
      this.dataService.getCookie("app_install")
      .then(() => {
        // app is installed
        // user first seen will already be set
        this.dataService.getCookie("user_first_seen")
        .then(d => this.registerPeopleProperty("First Seen", d))
      })
      .catch(() => {
        // app not installed
        // this only fires once per install ****
        this.dataService.setCookie("app_install", true)
        const d = new Date().toISOString()
        this.dataService.setCookie("user_first_seen", d)
        this.registerPeopleProperty("First Seen", d)
        .then(() => this.trackMe("App Installed"))
      })
    })
  }

  private startScreenTimer() {
    this.screenTimer = setInterval(() => {
      this.screenOnTime = this.screenOnTime + 0.01
    }, 10) // time track accurate to one hundreth of a second
  }

  private stopScreenTimer() {
    clearInterval(this.screenTimer)
    if (this.canUseTimer) {
      return this.screenOnTime
    }
    else {
      this.canUseTimer = true
      return undefined
    }
  }

  private registerPeopleProperty(key, value): Promise<void> {
    return new Promise(resolve => {
      mixpanel.people.set({ [key]: value });
      mixpanel.identify(this.userID);
      resolve()
    })
  }

  private registerSuperProperty(key, value): Promise<void> {
    return new Promise(resolve => {
      this.testingSuperProps = Object.assign(this.testingSuperProps, { [key]: value }) // for console logging current super props
      mixpanel.register({ [key]: value });
      resolve()
    })
  }

  public async trackMe(eventName, props = {}, _superProps?: { SCREEN_NAME?: string }) {

    if (eventName === "Screen Viewed") {
      const time = this.stopScreenTimer()
      this.screenOnTime = 0
      if (time) {
        mixpanel.track("Time on Screen", { Duration: Math.round(time) })
        this.startScreenTimer()
      }
      else if (typeof time === "undefined") {
        this.startScreenTimer()
      }
    }

    if (_superProps?.SCREEN_NAME) {
      // override screen name (for modal etc)
      // set super prop screen name
      await this.registerSuperProperty(this.superProps.SCREEN_NAME, _superProps.SCREEN_NAME)
    }
    else {
      const currentPage = this.router.url.split("/").pop().split("?")[0]
      // set super prop screen name
      // we don't want to track the camera page - we want capture start to know the previous page, e.g. tracker
      // we don't want to set the super prop page on pet update, the screen view / TLM progress does this
      if (currentPage !== "camera" && eventName !== "Pet Updated") await this.registerSuperProperty(this.superProps.SCREEN_NAME, currentPage)
    }
    // set super prop pet ID if we have a pet
    if (this.pet) await this.registerSuperProperty(this.superProps.PET_ID, this.pet.id);

    let petCount = 0
    let poopCount = 0
    if (this.dataService.pets?.length > 0) {
      // we have pets so set super prop pet count and poop count  
      await this.dataService.pets.forEach((pet: Pet) => {
        petCount++
        pet.poopData.forEach(poopDataDay => {
          poopCount += poopDataDay.entries.length
        });
      });
    }

    await this.registerSuperProperty(this.superProps.PET_COUNT, petCount)
    await this.registerSuperProperty(this.superProps.POOP_COUNT, poopCount)

    await this.registerPeopleProperty(this.superProps.PET_COUNT, petCount)
    await this.registerPeopleProperty(this.superProps.POOP_COUNT, poopCount)
    //for testing!
    console.log("Super Props:", this.testingSuperProps)
    console.log(`Name: ${eventName}, props:`, props);

    mixpanel.track(eventName, props);
    
  }

  private transformPetUpdateValue(k, v) {
    switch (k) {
      case "allergies":
        return v;
      case "conditions":
        return v;
      case "age":
        return v;
      case "mealFrequency":
        return Number(v);
      case "treats":
        return v;
      case "humanTreats":
        return v;
      case "neutered":
        return v ? "Yes" : "No";
      case "spayed":
        return v ? "Yes" : "No";
      case "desexedUndecided":
        return "I don't know";
      case "weight":
        return Number(Number(this.pet.weightType === "lb" ? (Number(v) * 0.45359237) : v).toPrecision(2)); // always kg
      case "dryFoods":
        return v;
      case "wetFoods":
        return v;
      default:
        return undefined
    }
  }

  public trackPetUpdate(e) {
    if (e.key === "mealFrequency") return // not tracking this
    let props = {};
    if (e.key === "mealTypePerMeal") {
      e.val.forEach(meal => {
        props[`Meal ${meal.mealNumber}`] = meal.foodConsistency
      })
    }
    else {
      let k;
      if (e.key === "spayed" || e.key === "desexedUndecided") { k = "neutered" }
      else { k = e.key }
      const trackingKey = this.petProfileKey[k]
      if (!trackingKey) return
      props[trackingKey] = this.transformPetUpdateValue(e.key, e.val)
    }
    this.trackMe("Pet Updated", props)
    setTimeout(() => {
      // on a timeout to let pet update in behind the scenes
      if (!this.pet.petProfileComplete) {
        const answeredAllQuestions = this.pet.questions.every(question => {
          return question.completed && this.pet.questions.some(question => {
            return question.completed && question.chosenMealType;
          });
        });
        this.dataService.updatePetData("petProfileComplete", answeredAllQuestions)
        if (answeredAllQuestions) {
          this.trackMe("Pet Completed")
        }
      }
    }, 1000);
  }
}