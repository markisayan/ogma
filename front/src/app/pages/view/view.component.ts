import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  @Input() title;
  @Input() editLink;
  @Input() id;
  @Input() image;
  @Input() isDataLoaded;
  @Input() what;
  @Input() displayFields: Array<{
    name: string,
    value: string,
    link?: string,
    route?: string,
    id?: string
  }>;
  constructor() { }

  ngOnInit() {
  }

}
