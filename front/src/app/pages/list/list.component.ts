import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  @Input() addLink: string;
  @Input() viewLink: string;
  @Input() editLink: string;
  @Input() what: string;
  @Input() isDataLoaded: boolean;
  @Input() items: Array<{
    image: string,
    title: string,
    subtitle: string,
    id: string
  }>;
  constructor() {}

  ngOnInit() {

  }

}
