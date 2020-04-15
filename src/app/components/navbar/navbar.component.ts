import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('navCollapse') navCollapse: ElementRef;
viewmap:boolean=true;
viewabout:boolean=false;
viewfaqs:boolean=false;
viewtable:boolean=false;
  constructor() { }

  ngOnInit(): void {
    this.home()
  }
about(){
this.viewmap = false
this.viewabout = true
this.viewfaqs = false
this.viewtable = false
}
faqs(){
  this.viewmap = false
  this.viewabout = false
  this.viewfaqs = true
  this.viewtable = false

}
home(){
  this.viewmap = true
  this.viewabout = false
  this.viewfaqs = false
  this.viewtable = false
}
table(){
  this.viewmap = false
  this.viewabout = false
  this.viewfaqs = false
  this.viewtable = true
}
fun(){
  if(this.navCollapse.nativeElement.classList.contains('bg-white')) {
     this.navCollapse.nativeElement.getElementsByTagName('button')[0].classList.add("collapsed");
     this.navCollapse.nativeElement.getElementsByTagName('button')[0].setAttribute('aria-expanded','false')
     this.navCollapse.nativeElement.querySelector('#navigation').classList.remove("show");
     this.navCollapse.nativeElement.classList.remove('bg-white')
     //this.navCollapse.nativeElement.classList.add('navbar-transparent')
 }else{
  this.navCollapse.nativeElement.classList.add('bg-white')
  //this.navCollapse.nativeElement.classList.remove('navbar-transparent')
  this.navCollapse.nativeElement.getElementsByTagName('button')[0].classList.remove("collapsed");
  this.navCollapse.nativeElement.getElementsByTagName('button')[0].setAttribute('aria-expanded','true')
 this.navCollapse.nativeElement.querySelector('#navigation').classList.add("show");
 }

}
}
