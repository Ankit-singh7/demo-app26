import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Pet } from "../classes/pet";
import { InfoErrorModalService } from "./infoErrorModal.service";
@Injectable({
  providedIn: "root",
})
export class SalesForceService {
  private _access_token;
  private endpointKeys = {
    testConsumer: "0F61F3B1-E6F4-4165-9C60-BDF15130B534",
    testMarketingPermissions: "DCF1E8DB-6742-480F-A781-C0D044B6E3A9",
    testConsentLog: "4F346E48-CC8B-4A97-9FF0-FED2DD330FA9",
    testPet: "1E8F3266-CC6B-45E1-9E05-04B74BC46FC2",
  };
  private errorMessages = {
    general: "[SalesForceService] Error: ",
  };

  constructor(private http: HttpClient, private infoErrorModal: InfoErrorModalService) {}

  async token() {
    const headers = {};
    const body = JSON.stringify({ grant_type: "client_credentials", client_id: environment.SALESFORCE_CLIENT_ID, client_secret: environment.SALESFORCE_CLIENT_SECRET, scope: "data_extensions_read data_extensions_write", account_id: "100011608" });
    try {
      const response: any = await this.http.post("https://mcng0h464ftbhz4ly6rmvyx14jf0.auth.marketingcloudapis.com/v2/token", body, { headers }).toPromise();
      this._access_token = response.access_token;
    } catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
    }
  }

  async consumer(email: string, date: any, first_name: string, last_name: string, gender: number, birth: any, mobile: string) {
    const headers = {
      Authorization: `Bearer ${this._access_token}`,
      "Accept-API-Version": "protocol=2.1",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({ items: [{ Consumer_ID: "miome_TEST_12345", Email: email, Brand_ID: 95, Status: 1, Country_Code: "GB", Language_Code: "EN", Recruitment_Date: date, Recruitment_Event: "1137_GB", First_Name: first_name, Last_Name: last_name, Gender_Code: gender, Title_Code: 0, Birthdate: birth, Mobile_Number: mobile }] });
    try {
      return await this.http.post(`https://mcng0h464ftbhz4ly6rmvyx14jf0.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:${this.endpointKeys.testConsumer}/rows`, body, { headers }).toPromise();
    } catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
    }
  }

  async marketingPermissions(optin: string, modificationDate: any) {
    const headers = {
      Authorization: `Bearer ${this._access_token}`,
      "Accept-API-Version": "protocol=2.1",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({ items: [{ MP_Program_ID: 85, MP_Consumer_ID: "miome_TEST_12345", MP_Channel_Code: 1, MP_Optin: optin, MP_Last_Modification_Date: modificationDate, MP_Campaign_ID: "1137_GB", MP_Latest_Consent_Text_ID: 322 }] });
    try {
      return await this.http.post(`https://mcng0h464ftbhz4ly6rmvyx14jf0.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:${this.endpointKeys.testMarketingPermissions}/rows`, body, { headers }).toPromise();
    } catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
    }
  }

  async consentLog(date: any) {
    const headers = {
      Authorization: `Bearer ${this._access_token}`,
      "Accept-API-Version": "protocol=2.1",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({ items: [{ Consent_Campaign_ID: "1137_GB", Consent_Consumer: "miome_TEST_12345", Consent_Text_ID: 322, Consent_Date: date }] });
    try {
      return await this.http.post(`https://mcng0h464ftbhz4ly6rmvyx14jf0.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:${this.endpointKeys.testConsentLog}/rows`, body, { headers }).toPromise();
    } catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
    }
  }

  async pet(pet: Pet, type: string, birth: any, modificationDate: any) {
    const headers = {
      Authorization: `Bearer ${this._access_token}`,
      "Accept-API-Version": "protocol=2.1",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      items: [
        {
          Pet_Name: pet.name,
          Pet_Type: type,
          Pet_Consumer_ID: "miome_TEST_12345",
          Pet_ID: "miome_TEST_9876",
          Pet_Status: 1,
          Pet_Birthdate: birth,
          Pet_Weight: pet.weight,
          Pet_Gender: pet.gender,
          Pet_Breed: pet.breed,
          Pet_Neutering_Status: pet.neutered,
          Pet_Last_Modification_Date: modificationDate,
          age_bracket: pet.age,
          allergies: pet.allergies,
          conditions: pet.conditions,
          dryFoods: pet.dryFoods,
          appGoals: pet.goals,
          humanTreats: pet.humanTreats,
          mealFrequency: pet.mealFrequency,
          mealTypePerMeal: pet.mealTypePerMeal,
          desexedUndecided: pet.desexedUndecided,
          spayed: pet.spayed,
          picture: pet.picture,
          questions: pet.questions,
          treats: pet.treats,
          weightType: pet.weightType,
          wetFoods: pet.wetFoods,
        },
      ],
    });
    try {
      return await this.http.post(`https://mcng0h464ftbhz4ly6rmvyx14jf0.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:${this.endpointKeys.testPet}/rows`, body, { headers }).toPromise();
    } catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
    }
  }
}
