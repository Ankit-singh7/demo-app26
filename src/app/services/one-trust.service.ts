import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { InfoErrorModalService } from "./infoErrorModal.service";

@Injectable({
  providedIn: "root",
})
export class OneTrustService {
  private errorMessages = {
    general: "[One Trust] Error: ",
  };

  constructor(private http: HttpClient, private infoErrorModal: InfoErrorModalService) {}

  async consentReceipts() {
    const body = JSON.stringify({
      identifier: "example@otprivacy.com", // example email
      test: true,
      requestInformation:
        "eyJhbGciOiJSUzUxMiJ9.eyJvdEp3dFZlcnNpb24iOjEsInByb2Nlc3NJZCI6ImEzOWRhZWRiLTFiNmMtNGQ1Zi1hYjI1LThkYTI0NTI5MjUyYyIsInByb2Nlc3NWZXJzaW9uIjoxLCJpYXQiOiIyMDIwLTEyLTI0VDA3OjM2OjQ0LjIxIiwibW9jIjoiQVBJIiwic3ViIjoiRW1haWwiLCJpc3MiOm51bGwsInRlbmFudElkIjoiMjA4MmU1MGYtN2E5ZS00MjJiLTliYTAtYWY1YjVlZWRhZDI5IiwiZGVzY3JpcHRpb24iOiJUZXN0IGZvciBNaW9tZSBJbXBsZW1lbnRhdGlvbiIsImNvbnNlbnRUeXBlIjoiQ09ORElUSU9OQUxUUklHR0VSIiwiZG91YmxlT3B0SW4iOmZhbHNlLCJyZWNvbmZpcm1BY3RpdmVQdXJwb3NlIjpmYWxzZSwiYXV0aGVudGljYXRpb25SZXF1aXJlZCI6ZmFsc2UsInBvbGljeV91cmkiOm51bGwsImFsbG93Tm90R2l2ZW5Db25zZW50cyI6ZmFsc2UsInB1cnBvc2VzIjpbeyJpZCI6IjhlN2M2NzZhLTI0MzgtNDZmMy04ZmQ5LTlkZTgzM2ZiYThmYSIsInZlcnNpb24iOjEsInRvcGljcyI6W10sImN1c3RvbVByZWZlcmVuY2VzIjpbXX1dLCJub3RpY2VzIjpbXSwiZHNEYXRhRWxlbWVudHMiOltdfQ.iXexozDJv0-d0f9rLQDAfBQtQUcslH0GqdUin5pZpqLYqgqQPrs53-3VzbqUJY7Q7Sex4rQkH4RBDtREBiwXtwQS121o6zyJH51NxmDbIgbbpGuXo9kytsG-QlGB_BDA6dcRRVi-AyhIAv1yYEL6gBUw0gY1-cWGEINTrX2su1ZZR7memWOvhXKJ9MhPVwYYNH2xN54_UVn-iN4OyWf0mJ2KVAZG3o-BKEmNzWXkPRCnn88Sfm0_rYW38dDf5FRj7u7QW0GsUGiLAX2ZExot2cjmnImwtF2TD6L1nS1KieLXJnUSIwQP8D_wIY3w0BhysnZcjjf9kMx9v3RIlvEOYGOPdj-Qzq6mxzplqKdvBMYmKbUY6Bp53KNyW0szaHzJ3IrWENsUSYxXUSC0VWo17dsyokcn3C1C3HnLyKtgu0ePuX5qHl7LLitDrUQhFyun_T15PkfmyQY6GGMOSTJpP2o2MffHc-lRKW6gnwwxVsX9G7_hqtkRQYp7A7O7OAKM8r2PJcqIBO7LuFKTsJXPC8uL5K0RAsf3VywW5aejVKQ-5AYpheNddgcTeNGPpw_XI9NsTApfpuJN7K9_gWW7-rvAQV17Me0bWZQvq6QOlctsbhW93poYWFsF4bQNPUGNQZTHYoCjB8rhtLdgyDYkgei2BCvI1y9wi1GfOyTzPiM",
      purposes: [
        {
          Id: "8e7c676a-2438-46f3-8fd9-9de833fba8fa",
        },
      ],
    });

    try {
      return await this.http.post("https://privacyportaluatde.onetrust.com/request/v1/consentreceipts", body).toPromise();
    } catch (error) {
      this.infoErrorModal.displayModal("error", this.errorMessages.general);
    }
  }
}
