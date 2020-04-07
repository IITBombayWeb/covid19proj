// $.fn.responsiveTabs = function() {
//   this.addClass('responsive-tabs');
//   this.append($('<span class="tim-icons icon-minimal-down"></span>'));
//   this.append($('<span class="tim-icons icon-minimal-up"></span>'));
//   this.on('click', 'li.active > a, span.tim-icons', function() {
//     this.toggleClass('open');
//   }.bind(this));
//   this.on('click', 'li:not(.active) > a', function() {
//     this.removeClass('open');
//   }.bind(this));
// };
//
// $('.nav.nav-tabs').responsiveTabs();


jQuery(document).ready(function() {
   jQuery(".main-table").clone(true).appendTo('#table-scroll').addClass('clone');
 });
