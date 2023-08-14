import { createContext } from "react";
import { makeAutoObservable } from "mobx";

export type ImgProperties = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type ImgZoomCoords = {
  x: number;
  y: number;
  relX: number;
  relY: number;
};

export type PageMetadata = {
  pageNumber: number;
  matchingWords: string[];
};

export class MagnifierClass {
  public imgProperties: ImgProperties = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };
  public imgZoomCoords: ImgZoomCoords = {
    x: 0,
    y: 0,
    relX: 0,
    relY: 0,
  };
  public pageMetadata: PageMetadata = {
    pageNumber: -1,
    matchingWords: [],
  };
  public activeDocumentId: string = "";

  public src: string = "";
  public showMagnifier = false;

  public setImgZoomCoords(val: ImgZoomCoords) {
    this.imgZoomCoords = val;
  }

  public setSrc(src: string) {
    this.src = src;
  }

  public setShowMagnifier(val: boolean) {
    this.showMagnifier = val;
  }

  public setImgProperties(val: ImgProperties) {
    this.imgProperties = val;
  }

  public setPageMetadata(val: PageMetadata) {
    this.pageMetadata = val;
  }

  public setActiveDocumentId(val: string) {
    this.activeDocumentId = val;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export const ImageMagnifierContext = createContext<MagnifierClass>(
  new MagnifierClass()
);
