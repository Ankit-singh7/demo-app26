import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';

import { Network } from '@ionic-enterprise/network-information/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { Pet } from 'src/app/classes/pet';
import { PoopSample } from 'src/app/interfaces/poopSample';
import { Todo } from 'src/app/interfaces/todo';
import { PoopAnalysisApiService } from 'src/app/services/poopAnalysisApi.service';
import { DataService } from 'src/app/services/data.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { environment } from 'src/environments/environment';
import PRESET_NOTES from "../../../../assets/data/results-preset-notes.json";
import { StatusBar } from '@capacitor/status-bar';



@Component({
  selector: 'results-modal',
  templateUrl: 'results.modal.html',
  styleUrls: ['results.modal.scss']
})
export class ResultsModal implements AfterViewInit {
  @Input() imageBlob: any
  results = { entries: [] }
  resultsTodos = []
  loading = true
  todaysDate = new Date().toDateString()
  public pinText = "Pin to my Summary area";
  public showPin = false;
  public hasCustomNote = false;
  public customNote: string;
  public presetNotes = JSON.parse(JSON.stringify(PRESET_NOTES))
  public prevIsActive = false
  public nextIsActive = true
  public charsLimit = 190

  @ViewChild('slider') slidesRef: any;
  @ViewChild('customNoteRef', { static: false }) customNoteRef: any;

  constructor(
    private modalController: ModalController, 
    private platform: Platform, 
    private poopAnalysisApiService: PoopAnalysisApiService, 
    private dataService: DataService,
    private trackingService: TrackingService,
    private network: Network,
  ) {
    // if (this.platform.is('ios')) {
    //   StatusBar.setStyle({
    //     style: StatusBarStyle.Light
    //   });
    // }
  }
  ngOnInit() {
    
  }
  ngAfterViewInit() {
    this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: "results" });
    this.checkTodaysEntries()
    .then(todaysEntries => this.analyse(todaysEntries));
  }
  done() {
    if (this.loading) return
    setTimeout(() => {
      const presetNotesToSave = []
      this.presetNotes.forEach(category => {
        category.tiles.forEach(tile => {
          if (tile.use) presetNotesToSave.push(tile.title)
        })
      })
      this.modalController.dismiss({
        "message": "done",
        result: Object.assign({
          customNote: this.hasCustomNote ? this.customNote : undefined,
          presetNotes: presetNotesToSave
        }, this.results.entries[0]), // there's only ever one entry, send back to camera to save
        todos: this.showPin ? this.resultsTodos : []
      }); 
    }, environment.ctaAnimationDelay);
  }
  retake() {
    if (this.loading || this.showPin) return
    setTimeout(() => {
      this.modalController.dismiss({ "message": "retake" });
    }, environment.ctaAnimationDelay);
  }

  checkTodaysEntries(e = null) {
    return new Promise(async resolve => {
      this.dataService.getPoopData()
      .then((poopData: PoopSample[]) => {
        if (e) e.target.complete()
        if (poopData.length > 0) {
          if (poopData[0].date === this.todaysDate) resolve(poopData[0].entries.length);
          resolve(0)
        }
        resolve(0);
      })
    })
  }

  analyse(todaysEntries) {
    if (this.network.type === "none") {
      setTimeout(() => {
        this.modalController.dismiss({
          error: true,
          type: "connection-error",
          message: "No internet connection. Make sure that Wi-Fi or mobile data is turned on, then try again."
        })
      }, 5000); // gives time for the modal to open up
    }
    else {
      this.poopAnalysisApiService.analysePoop(this.imageBlob)
      .then((results: { blood, analysis }) => {
        this.dataService.getCurrentPet().then((pet: Pet) => {
          results.analysis.suggestions.forEach((todo: Todo) => {
            this.resultsTodos.push(
              {
                icon: todo.categoryIcon,
                category: todo.categoryTitle,
                copy: this.dataService.sexCheckTodoCopy(todo.copy, pet)
              }
            )
          });
        })
        this.loading = false
        // const currentTime = new Date()
        // const time = String(currentTime.getMinutes())
        this.results.entries.push({
          // currentTime: currentTime,
          analysisScore: results.analysis.score,
          analysisMessage: results.analysis.message,
          // bloodHasBlood: results.blood,
          // time: `${currentTime.getHours()}:${ time.length === 1 ? "0" + time : time}`, // leading 0 if needed
          currentEntry: todaysEntries + 1,
          // id: String(+currentTime)
        })
      })
      .catch((err: { message, type? }) => {
        const error = err.message || "Something went wrong, but like a lost tennis ball we can’t seem to spot it! Please try again."
        this.modalController.dismiss({ error: true, message: error, type: err.type })
      })
    }
  }

  togglePin() {
    if(!this.showPin) {
      this.pinText = "Pinned to Summary";
      this.showPin = true;
    } else {
      this.pinText = "Pin to my Summary area";
      this.showPin = false;
    }
  }

  toggleCustomNote() {
    this.hasCustomNote = !this.hasCustomNote
  }

  clearNote() {
    this.customNote = ""
  }

  activateTile(categoryIndex, tileIndex, event) {
    this.presetNotes[categoryIndex]["tiles"][tileIndex].use = !this.presetNotes[categoryIndex]["tiles"][tileIndex].use
    event.currentTarget.classList.toggle('active')
  }

  async slideChanged() {
    const isEnd = await this.slidesRef.isEnd()
    const isBeginning = await this.slidesRef.isBeginning()
    if (isEnd) { this.nextIsActive = false }
    else if (isBeginning) { this.prevIsActive = false }
    else {
      this.nextIsActive = true
      this.prevIsActive = true
    }
  }

  nextSlide() {
    if (!this.nextIsActive) return
    this.slidesRef.slideNext();
  }
  previousSlide() {
    if (!this.prevIsActive) return
    this.slidesRef.slidePrev()
  }

  customNoteChange(e: string) {
    this.customNote = e.length > this.charsLimit ? e.substr(0, this.charsLimit) : e
    this.customNoteRef.value = this.customNote
  }
}