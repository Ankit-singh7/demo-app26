import { Component, AfterContentInit } from '@angular/core'
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera'
import { ModalController, NavController } from '@ionic/angular'
import { PoopAnalysisApiService } from 'src/app/services/poopAnalysisApi.service'
import { ResultsModal } from './modal/results.modal'
import { PoopSample } from 'src/app/interfaces/poopSample'
import { DataService } from 'src/app/services/data.service'
import { TrackingService } from '../../services/tracking.service';
import { InfoErrorModalService } from 'src/app/services/infoErrorModal.service'
import { randomTwelveDigit } from 'src/app/helpers/randomInt'
// const { Camera } = Plugins

@Component({
  selector: 'app-camera',
  templateUrl: 'camera.page.html',
  styleUrls: ['camera.page.scss'],
})
export class CameraPage implements AfterContentInit {

  IMAGE_PATH = ""
  modal
  isLoading = false // for API spinner
  blurImage = false // for image blur trigger
  constructor(
    private modalController: ModalController,
    private poopAnalysisApiService: PoopAnalysisApiService,
    private dataService: DataService,
    private navController: NavController,
    private trackingService: TrackingService,
    private infoErrorModal: InfoErrorModalService
  ) {}
  closeCamera() {
    this.navController.back()
  }

  ionViewDidEnter() {
    this.trackingService.trackMe("Capture Started")
  }

  async triggerResultsModal(imageBlob) {
    this.modal = await this.modalController.create({
      component: ResultsModal,
      componentProps: {
        imageBlob
      },
      swipeToClose: true,
      animated: true,
      showBackdrop: false
    })
    await this.modal.present()
    this.modal.onWillDismiss().then(modalResult => {
      if (modalResult.data.error) return this.cameraFail(modalResult.data.message, modalResult.data.type)
      if (modalResult.data.message === "retake") {
        this.takePicture()
      }
      else if (modalResult.data.message === "done") {
        const currentTime = new Date();
        const currentMinutes = String(currentTime.getMinutes())
        const newPoopSample: PoopSample = {
          date: currentTime.toDateString(),
          entries: [{
            analysisScore: modalResult.data.result.analysisScore,
            time: String(currentTime.toLocaleTimeString()).slice(0,5), // e.g. "14:39"
            analysisMessage: modalResult.data.result.analysisMessage,
            // bloodHasBlood: modalResult.data.result.bloodHasBlood,
            id: randomTwelveDigit(),
            customNote: modalResult.data.result.customNote, // string or undefined
            presetNotes: modalResult.data.result.presetNotes,
            date: currentTime.toISOString()
          }]
        }
        this.dataService.addPoopSample(newPoopSample)
        .then(() => {
          const poopID = newPoopSample.entries[0].id;
          const poopScore = newPoopSample.entries[0].analysisScore
          const trackingProps = {
            "Poop ID": poopID,
            "Method": "camera",
            "Level": poopScore,
          }
          if (modalResult.data.result.customNote && modalResult.data.result.customNote !== "") {
            trackingProps["Custom Note"] = modalResult.data.result.customNote
          }
          if (modalResult.data.result.presetNotes.length > 0) {
            trackingProps["Preset Notes"] = modalResult.data.result.presetNotes
          }
          this.trackingService.trackMe("Capture Completed", trackingProps, { SCREEN_NAME: "results" })
          if (modalResult.data.todos.length === 0) {
            // if no todos
            return this.closeCamera()
          }
          this.dataService.addTodos(modalResult.data.todos, modalResult.data.result.analysisMessage)
          .then(() => {
            let todosTrackingCopy = [];
            modalResult.data.todos.forEach( todo => {
              todosTrackingCopy.push(todo.copy);
            });
            this.trackingService.trackMe('Capture Pinned', {
              "Poop ID": poopID,
              "Level": poopScore,
              "Insights": todosTrackingCopy,
            }, { SCREEN_NAME: "results" });

            this.closeCamera()
          })
          .catch(err => this.cameraFail(err))
        })
        .catch(err => this.cameraFail(err))
      }
      else {
        this.cameraFail()
      }
    })
  }

  async cameraFail(message = "Something went wrong, but like a lost tennis ball we can’t seem to spot it! Please try again.", type = "error") {
    this.trackingService.trackMe("Error Capture", {"Error": message })
    this.isLoading = false
    this.infoErrorModal.displayModal(type, message)
    this.closeCamera()
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        direction: CameraDirection.Rear
      })
      this.IMAGE_PATH = image.dataUrl
      this.blurImage = true
      this.isLoading = true
      fetch(image.dataUrl)
      .then(response => {
        if (response.ok) return response.blob()
        throw new Error()
      })
      .then(imageBlob => this.triggerResultsModal(imageBlob))
      .catch(() => this.cameraFail("Hmm, there might be something amiss with your camera app or with converting your photo into data. Please try again."))
    }
    catch (err) {
      if (!err) return this.cameraFail() // unknown native error
      if (err.message !== "User cancelled photos app") return this.cameraFail(`${err.message}.`);
      else this.closeCamera()
    }
  }

  ngAfterContentInit() {
    this.takePicture()
  }
}
