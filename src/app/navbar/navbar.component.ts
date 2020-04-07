import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
viewmap:boolean=true;
viewabout:boolean=false;
viewfaqs:boolean=false;
  constructor() { }

  ngOnInit(): void {
    this.home()
  }
about(){
this.viewmap = false
this.viewabout = true
this.viewfaqs = false
}
faqs(){
  this.viewmap = false
  this.viewabout = false
  this.viewfaqs = true

}
home(){
  this.viewmap = true
  this.viewabout = false
  this.viewfaqs = false
}
}
