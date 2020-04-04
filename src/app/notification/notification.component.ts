import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
    text:any=["Zoom and click on a district map to get the estimates"] 
	     
//text:any=["Going out to buy essentials? Social Distancing is KEY! Maintain at least 2 metres distance between each other in the line.","TPanic mode : OFF! ❌ ESSENTIALS ARE ON! ✔️ ","If you have any medical queries, reach out to your district administration or doctors!  "]
title:any=this.text[0];
count:any=0
  ngOnInit(): void {
    setInterval(this.change.bind(this), 3000)
  }

  change() {
    this.title = this.text[this.count]
    this.count++;
  if (this.count >= this.text.length) {
    this.count = 0;
  }
    
  }
    

  }


