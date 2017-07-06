import { Component,OnInit } from '@angular/core';
import { Task } from '../model/task';
import { TaskService } from '../services/task.service'
import { UtilService } from '../services/util.service';
import * as moment from 'moment';

@Component({
    selector: 'tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
    tasks: Task[];
    tasksToShow: Task[];
    types: string[] = [
        "Grafisk Opgave",
        "Video Opgave",
        "Event Opgave",
        "Strategisk Opgave",
        "Målgruppeanalyse",
        "Dataanalyse"
    ];
    rewardTypes: string[] = [
        "Honorar",
        "Gave",
        "Anbefaling"
    ];
    workPlaces: string[] = [
        "Hos virksomheden",
        "Hjemme"
    ];
    sortingString: string;
    filterValues: { search: string, types: string[], rewards: string[], places: string[] } = { search: "", types: [], rewards: [], places: [] };

    constructor(private taskService: TaskService, private utilService: UtilService) {
        
    }

    ngOnInit() {
        this.utilService.loading.next(true);
        this.taskService.getAllTasks().subscribe((data) => {
            console.log(data);
            this.tasks = data;
            this.tasksToShow = this.tasks;
            this.sort("Dato tilføjet");
            this.utilService.loading.next(false);
        }, (err) => {
            console.log(err);
            this.utilService.loading.next(false);
        });
    }

    typeFilter(type, isChecked) {
        if (isChecked)
            this.filterValues.types.push(type);
        else {
            let index = this.filterValues.types.indexOf(type);
            this.filterValues.types.splice(index, 1);
        }
        this.filter(); 
    }

    rewardTypeFilter(rType, isChecked) {
        if (isChecked)
            this.filterValues.rewards.push(rType);
        else {
            let index = this.filterValues.rewards.indexOf(rType);
            this.filterValues.rewards.splice(index, 1);
        }
        this.filter(); 
    }

    workPlaceFilter(place, isChecked) {
        let placeId = "";
        switch (place) {
            case "Hos virksomheden":
                placeId = "2";
                break;
            case "Hjemme":
                placeId = "1";
                break;
            default:
        }
        if (isChecked)
            this.filterValues.places.push(placeId);
        else {
            let index = this.filterValues.places.indexOf(placeId);
            this.filterValues.places.splice(index, 1);
        }
        this.filter(); 
    }

    sort(sortString: string) {
        this.sortingString = sortString;
        switch (sortString) {
            case 'Deadline':
                this.tasksToShow = this.tasksToShow.sort((t1, t2) => { return t1.deadline.diff(t2.deadline); });
                break;
            case 'Dato tilføjet':
                this.tasksToShow = this.tasksToShow.sort((t1, t2) => { return t2.creationTime.diff(t1.creationTime); });
                break;
            case 'Værdi af belønning':
                this.tasksToShow = this.tasksToShow.sort((t1, t2) => { return t2.rewardValue - t1.rewardValue; });
            default:
                //this.tasksToShow = this.tasksToShow.sort((t1, t2) => { return t2.creationTime.diff(t1.creationTime); });
                break;
        }
    }

    filter() {
        let filterTasks = this.tasks;
        if (this.filterValues.search)
            filterTasks = filterTasks.filter(t => t.title.toLowerCase().search(this.filterValues.search.toLowerCase()) > -1);
        if (this.filterValues.types.length > 0)
            filterTasks = filterTasks.filter(t => this.filterValues.types.indexOf(t.type) > -1);
        if (this.filterValues.rewards.length > 0) 
            filterTasks = filterTasks.filter(t => this.filterValues.rewards.indexOf(t.rewardType) > -1);
        if (this.filterValues.places.length > 0)
            filterTasks = filterTasks.filter(t => this.filterValues.places.indexOf(t.workPlace) > -1);
        this.tasksToShow = filterTasks;
        this.sort(this.sortingString);
    }

}
