import { Component } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
    imports: [
        RouterLink,
        NgOptimizedImage
    ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
