import { Injectable } from '@angular/core'
import { rejects } from 'assert'
import ANALYSIS_RESULTS from "../../assets/data/static-analysis-results.json"

@Injectable({
  providedIn: 'root',
})
export class PoopAnalysisApiService {
  public BLOOD_DETECTION_RESULTS = {
    "blood": { hasBlood: true, message: "We’ve also detected some blood in their stool. <name> could be constipated" },
    "no_blood": { hasBlood: false, message: "Great news, there's no blood in <name>’s stool" }
  }
  public ERROR_STATES = {
    NO_POO: "Perhaps we need to clean our glasses, but this doesn’t look like a poo to us!",
    ANALYSIS_ERROR: "We received your photo, but our analysis of it failed this time. Please try again.",
  }

  private API_URL = "https://api-dev.mars.com/predict"
  private API_KEY = "2c54f14668b84f90b5d1d751d4666357"
  private AK_HEADER = "Ocp-Apim-Subscription-Key"
  private FILE_KEY = "file"

  private sendToApi(imageBlob): Promise<{}> {
    return new Promise(resolve => {
      const requestHeaders = new Headers()
      requestHeaders.append(this.AK_HEADER, this.API_KEY)

      const formData = new FormData()
      formData.append(this.FILE_KEY, imageBlob)

      fetch(this.API_URL, {
        method: 'POST',
        headers: requestHeaders,
        body: formData
      })
      .then(response => response.json())
      .then(result => {
        /** result:
        {
          "Model": [
            { "Name": "Feaces Detection Model", "PredictedLabel": "poop" },
            { "Name": "Feaces Quality Model", "PredictedLabel": "3" },
            { "Name": "Blood Detection Model", "PredictedLabel": "blood" }
          ]
        }
        */
        if (result.Model.find === undefined) {
          if (result.Model.Name === "Feaces Detection Model") {
            var poopDetectionLabel = result.Model["PredictedLabel"]
            var poopDetectionResult = poopDetectionLabel === "poop" ? true : false
          }
          else if (result.Model.Name === "Feaces Quality Model") {
            var poopQualityResult = Number(result["PredictedLabel"])
          }
          else if (result.Model.Name === "Blood Detection Model") {
            var bloodDetectionLabel = result.Model["PredictedLabel"]
            var bloodDetectionResult = bloodDetectionLabel === "blood" ? true : false
          }
        }
        else {
          
          var poopDetectionLabelModel = result.Model.find(model => model.Name === "Feaces Detection Model")
          if (poopDetectionLabelModel) { // could be undefined
            var poopDetectionLabel = poopDetectionLabelModel["PredictedLabel"]
            var poopDetectionResult = poopDetectionLabel === "poop" ? true : false
          }
          
          var poopQualityResultModel = result.Model.find(model => model.Name === "Feaces Quality Model")
          if (poopQualityResultModel) { // could be undefined
            var poopQualityResult = Number(poopQualityResultModel["PredictedLabel"])
          }
          
          var bloodDetectionLabelModel = result.Model.find(model => model.Name === "Blood Detection Model")
          if (bloodDetectionLabelModel) { // could be undefined
            var bloodDetectionLabel = bloodDetectionLabelModel["PredictedLabel"]
            var bloodDetectionResult = bloodDetectionLabel === "blood" ? true : false
          }

        }
        if (!poopDetectionResult) { // no poop detected
          return resolve({ error: true, message: this.ERROR_STATES.NO_POO, type: "missing" })
        }
        
        if (!poopQualityResult) { // no poop and no analysis
          return resolve({ error: true, message: this.ERROR_STATES.ANALYSIS_ERROR })
        }
        const pooResult = Object.assign({}, ANALYSIS_RESULTS[poopQualityResult])
        pooResult.score = poopQualityResult
        resolve(Object.assign({}, {analysis: pooResult, blood: bloodDetectionResult}))
      })
      .catch(() => {
        resolve({ error: true, message: this.ERROR_STATES.ANALYSIS_ERROR })
      })
    })
  }
  public analysePoop(imageBlob) {
    return new Promise(async (resolve, reject) => {
      const pooAnalysis: any = await this.sendToApi(imageBlob)
      /**
       * pooAnalysis = 
       * { error: boolean, message: string } ||
       * { analysis: object, blood: object }
       */
      if (pooAnalysis.error) return reject({ message: pooAnalysis.message, type: pooAnalysis.type })
      resolve({ analysis: pooAnalysis.analysis, blood: pooAnalysis.blood, })
    })
  }
}