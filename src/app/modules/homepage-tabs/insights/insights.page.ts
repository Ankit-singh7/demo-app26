import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";
import { IonContent, PopoverController } from "@ionic/angular";
import { BasicPopoverComponent } from "src/app/global-components/basic-popover/basic-popover.component";
import { DataService } from "src/app/services/data.service";
import { Pet } from "src/app/classes/pet";
import { MatAccordion } from '@angular/material/expansion';
import { TrackingService } from 'src/app/services/tracking.service';

@Component({
  selector: "app-insights",
  templateUrl: "insights.page.html",
  styleUrls: ["insights.page.scss"],
})
export class InsightsPage {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('insightsContent') content: IonContent;

  public pinInfoPopover;
  public allTodos = []
  public allTodosCount = 0
  public latestTodos = []
  private refreshing = false
  public showOthers = false
  public averageResult;
  public commonResult;
  public commonNote;
  public poopData;
  constructor(
    private popoverController: PopoverController, 
    private dataService: DataService, 
    private cdr: ChangeDetectorRef,
    private trackingService: TrackingService
  ) {
    this.dataService.currentPet$.subscribe((pet: Pet) => {
      // subscribe for when current pet changes
      this.refreshTodos(); // refresh data if the pet has changed
      this.getPoopData();
    });
  }
  getPoopData() {
    this.dataService.getPoopData().then((data) => {
      this.poopData = data;
      this.getAveragePoopsPerDay();
      this.getCommonResults();
      this.getCommonNote();
    });
  }

  ionViewDidEnter() {
    this.content.scrollToTop();
    this.trackingService.trackMe("Screen Viewed");
  }

  ionViewWillEnter() {
    this.refreshTodos();
  }

  getAveragePoopsPerDay() {

    //get length of records for each day
    const resultsPerDay = this.poopData.map((data) => {
      return data.entries.length;
    });
    const median = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    this.averageResult = resultsPerDay.length === 0 ? null : Math.round(median(resultsPerDay) * 10) / 10;
  }

  refreshTodos(deleteOverride = false) {
    if (this.refreshing && !deleteOverride) return
    this.refreshing = true
    this.dataService.getTodos()
    .then(todos => {
      const _todos = todos
      this.allTodos = []
      this.latestTodos = _todos.length > 0 ? [_todos.shift()] : [] // shift to modify _todos, remove it
      _todos.forEach(todo => {
        this.allTodos.push(todo)
      });
      this.countTodos()
      this.refreshing = false
      this.cdr.detectChanges()
    });
  }

  deleteTodo(todoId) {
    this.refreshing = true // stop pet update triggering refresh
    this.dataService.deleteTodo(todoId)
    .then(() => this.refreshTodos(true)).catch(() => this.refreshing = false)
  }

  private getModes(array) { // Mode (most common)
    var frequency = {}; // array of frequency.
    var maxFreq = 0; // holds the max frequency.
    var modes = [];

    for (var i in array) {
      frequency[array[i]] = (frequency[array[i]] || 0) + 1; // increment frequency.

      if (frequency[array[i]] > maxFreq) {
        // is this frequency > max so far ?
        maxFreq = frequency[array[i]]; // update max.
      }
    }

    for (var k in frequency) {
      if (frequency[k] == maxFreq) {
        modes.push(k);
      }
    }

    return modes;
  }

  async getCommonNote() {
    const _notes = []
    await this.poopData.forEach(async poopDate => {
      await poopDate.entries.forEach(async entry => {
        await entry.presetNotes?.forEach(async note => {
          _notes.push(note)
        });
      });
    });
    const modeNote = this.getModes(_notes)
    this.commonNote = modeNote.length > 1 ? null : modeNote[0];
  }

  getCommonResults() {
    //get array of string results
    const commonResults = this.poopData.flatMap((data) => {
      return data.entries.map((entry) => {
        return entry.analysisMessage;
      });
    });

    //only show the most accurate result if theres only 1 mode
    const modeResult = this.getModes(commonResults)
    this.commonResult = modeResult.length > 1 ? null : modeResult[0];
  }

  async openPinInfoPopup() {
    this.pinInfoPopover = await this.popoverController.create({
      component: BasicPopoverComponent,
      componentProps: {
        title: "Pinned to-dos",
        text:
          "This section houses any suggested actions you decide to pin when looking at a poop capture result.",
        imageUrl: "../../assets/insights/pinned-info-screen.png",
        ctaText: "Got it",
        overflow: true,
      },
      cssClass: "basic-popover overflow",
      mode: "md",
    });

    this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: "what's this?" });
    await this.pinInfoPopover.present();
    this.pinInfoPopover.onDidDismiss().then(() => {
      this.trackingService.trackMe("Screen Viewed", {}, { SCREEN_NAME: "insights" });
    })
  }

  formatDay(date) {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    return `${this.addDaySuffix(day)}`;
  }

  addDaySuffix(i) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }

  countTodos() {
    this.allTodosCount = 0
    for (let i = 0; i < this.allTodos.length; i++) {
      this.allTodosCount += this.allTodos[i].todos.length
    }
  }

  toggleOthers() {
    this.showOthers = !this.showOthers
  }

  detect() {
    this.cdr.detectChanges();
  }
}
