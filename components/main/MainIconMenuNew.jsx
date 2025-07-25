import React from "react";
import { useRouter } from "next/router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import styles from "@/styles/icon.module.css";

export default function MainIconMenu({ setLinkModal }) {
  const router = useRouter();

  const menu = [
    {
      lable: "เกม",
      icon: (
        <svg
          className="w-12 h-12"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 376.66 236.28"
        >
          <path
            fill="currentColor"
            d="M36.11,236.28c-8.56,0-16.35-2.39-23.01-8.08-.04-.03-.07-.06-.1-.09-.67-.58-1.25-1.13-1.8-1.68-23.75-23.74-5.04-75.29,13.05-125.16,3.59-9.9,6.98-19.25,9.9-28.02,8.97-26.92,21.8-45.73,39.23-57.5C89.19,5.06,108.57.08,134.36.06c4.11,0,29.08-.02,54.04-.03,24.94-.01,49.87-.02,53.99-.03h.09c32.3,0,55.43,8.09,72.81,25.46,11.57,11.57,20.5,27.15,27.29,47.63,2.91,8.76,6.29,18.1,9.88,27.99,18.54,51.18,37.71,104.1,11.08,126.9-.06.05-.12.1-.17.15-25.8,21.77-68.45-5.46-106.09-29.48-6.61-4.22-12.86-8.21-18.56-11.62-12.66-7.55-24.14-8.39-45.52-8.39h-2.4c-2.54,0-6.14,0-7.27,0-21.37.02-32.86.86-45.56,8.46-5.73,3.43-12.01,7.45-18.67,11.7-27.95,17.86-58.67,37.49-83.18,37.49ZM29.38,209.23c4.21,3.52,13.89,2.33,27.28-3.38,15.43-6.57,33.35-18.02,49.16-28.13,6.81-4.35,13.25-8.46,19.29-12.08,18.58-11.12,35.95-11.99,58.46-12.01,1.18,0,4.7,0,7.2,0h2.32s.07,0,.11,0c22.46,0,39.8.87,58.34,11.93,6.03,3.61,12.42,7.69,19.19,12.01,15.81,10.09,33.74,21.54,49.18,28.1,13.46,5.72,23.19,6.9,27.39,3.3.02-.02.04-.03.05-.05,4.93-4.32,5.69-16.39,2.14-33.99-3.95-19.56-12.38-42.83-20.53-65.34-3.64-10.05-7.08-19.55-10.1-28.63-5.54-16.7-12.48-29.07-21.23-37.82-12.55-12.54-29.55-18.14-55.12-18.14h-.08c-4.11,0-29.05.02-54,.03-24.96.01-49.92.02-54.03.03-35.71.03-60.97,9.42-76.52,56.09-3.02,9.08-6.47,18.59-10.12,28.65-8,22.05-16.28,44.86-20.33,64.19-5.03,23.95-1.24,32.06,1.47,34.77.17.17.34.32.5.47Z"
          />
          <path
            fill="currentColor"
            d="M132.36,112.3h12.76c6.29,0,11.38-5.1,11.38-11.38s-5.09-11.37-11.37-11.37h-12.76v-12.76c0-6.29-5.09-11.37-11.37-11.37s-11.38,5.1-11.38,11.38v12.76s-12.76,0-12.76,0c-6.29,0-11.38,5.1-11.37,11.37s5.1,11.38,11.37,11.37h12.76v13.12c0,6.29,5.09,11.37,11.37,11.37s11.38-5.1,11.38-11.38v-13.12Z"
          />
          <circle fill="currentColor" cx="238.44" cy="99.96" r="12.31" />
          <circle fill="currentColor" cx="263.08" cy="75.33" r="12.31" />
          <circle fill="currentColor" cx="288.22" cy="100.47" r="12.31" />
          <circle fill="currentColor" cx="262.82" cy="123.25" r="12.31" />
        </svg>
      ),
      link: "/games",
    },
    {
      lable: "ตารางอบรม",
      icon: (
        <svg
          className="w-11 h-11"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 287.01 320.21"
        >
          <path
            fill="currentColor"
            d="M235.52,320.21H51.49c-28.39,0-51.49-23.1-51.49-51.49V84.69c0-28.39,23.1-51.49,51.49-51.49h184.03c28.39,0,51.49,23.1,51.49,51.49v184.03c0,28.39-23.1,51.49-51.49,51.49ZM51.49,58.2c-14.61,0-26.49,11.88-26.49,26.49v184.03c0,14.61,11.88,26.49,26.49,26.49h184.03c14.61,0,26.49-11.88,26.49-26.49V84.69c0-14.61-11.88-26.49-26.49-26.49H51.49Z"
          />
          <path
            fill="currentColor"
            d="M270.26,136.56H12.5c-6.9,0-12.5-5.6-12.5-12.5s5.6-12.5,12.5-12.5h257.76c6.9,0,12.5,5.6,12.5,12.5s-5.6,12.5-12.5,12.5Z"
          />
          <circle fill="currentColor" cx="80.95" cy="180.17" r="17.94" />
          <circle fill="currentColor" cx="143.51" cy="180.17" r="17.94" />
          <circle fill="currentColor" cx="206.06" cy="180.17" r="17.94" />
          <circle fill="currentColor" cx="80.95" cy="233.02" r="17.94" />
          <circle fill="currentColor" cx="143.51" cy="233.02" r="17.94" />
          <circle fill="currentColor" cx="206.06" cy="233.02" r="17.94" />
          <path
            fill="currentColor"
            d="M84.43,58.2c-6.9,0-12.5-5.6-12.5-12.5V12.5c0-6.9,5.6-12.5,12.5-12.5s12.5,5.6,12.5,12.5v33.2c0,6.9-5.6,12.5-12.5,12.5Z"
          />
          <path
            fill="currentColor"
            d="M202.58,58.2c-6.9,0-12.5-5.6-12.5-12.5V12.5c0-6.9,5.6-12.5,12.5-12.5s12.5,5.6,12.5,12.5v33.2c0,6.9-5.6,12.5-12.5,12.5Z"
          />
        </svg>
      ),
      link: "/training",
    },
    {
      lable: "แลกของรางวัล",
      icon: (
        <svg
          className="w-10 h-10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 339.74 322.34"
        >
          <path
            fill="currentColor"
            d="M283.52,182.45H56.21c-8.93,0-13.42,0-18-.91-18.9-3.76-33.54-18.4-37.3-37.3-.91-4.58-.91-9.07-.91-18s0-13.42.91-18c3.76-18.9,18.4-33.54,37.3-37.3,4.58-.91,9.07-.91,18-.91h227.31c8.94,0,13.42,0,18.01.91,18.89,3.76,33.54,18.4,37.29,37.3.91,4.59.91,9.07.91,18s0,13.42-.91,18c-3.76,18.9-18.4,33.54-37.3,37.3-4.59.91-9.07.91-18,.91ZM56.21,95.02c-7.06,0-10.96,0-13.12.43-8.95,1.78-15.88,8.71-17.66,17.66-.43,2.17-.43,6.06-.43,13.13s0,10.96.43,13.13c1.78,8.95,8.71,15.88,17.65,17.66,2.17.43,6.06.43,13.13.43h227.31c7.07,0,10.96,0,13.13-.43,8.95-1.78,15.88-8.71,17.66-17.66.43-2.17.43-6.06.43-13.13s0-10.96-.43-13.13c-1.78-8.94-8.71-15.87-17.65-17.65-2.17-.43-6.06-.43-13.13-.43H56.21Z"
          />
          <path
            fill="currentColor"
            d="M239.81,322.34H99.93c-35.23,0-54.63,0-68.54-13.9-13.9-13.9-13.9-33.31-13.9-68.54v-69.94c0-6.9,5.6-12.5,12.5-12.5s12.5,5.6,12.5,12.5v69.94c0,30.7.27,44.54,6.58,50.86,6.32,6.32,20.16,6.58,50.86,6.58h139.88c30.7,0,44.54-.27,50.86-6.58s6.58-20.16,6.58-50.86v-69.94c0-6.9,5.6-12.5,12.5-12.5s12.5,5.6,12.5,12.5v69.94c0,35.23,0,54.63-13.9,68.54-13.9,13.9-33.31,13.9-68.54,13.9Z"
          />
          <path
            fill="currentColor"
            d="M169.87,322.34c-6.9,0-12.5-5.6-12.5-12.5V82.52c0-6.9,5.6-12.5,12.5-12.5s12.5,5.6,12.5,12.5v227.31c0,6.9-5.6,12.5-12.5,12.5Z"
          />
          <path
            fill="currentColor"
            d="M152.38,95.02h-55.46c-19.54,0-36.32-11.22-43.8-29.28-7.5-18.11-3.55-37.97,10.3-51.83C72.97,4.37,86.18-.67,99.67.07c13.46.75,26.01,7.21,34.43,17.73l34.61,43.26c5.07,6.33,6.03,14.81,2.52,22.11-3.51,7.31-10.73,11.85-18.84,11.85ZM149.19,76.68h0,0ZM96.98,25c-6,0-11.59,2.32-15.88,6.6-6.67,6.67-8.49,15.86-4.88,24.58,3.59,8.67,11.33,13.85,20.7,13.85h46.93l-29.29-36.61c-4.04-5.05-9.82-8.02-16.29-8.38-.44-.02-.87-.04-1.3-.04Z"
          />
          <path
            fill="currentColor"
            d="M242.81,95.02h-55.46c-8.11,0-15.33-4.54-18.84-11.85-3.51-7.31-2.55-15.78,2.52-22.11l34.61-43.26C214.06,7.28,226.61.82,240.07.07c13.49-.74,26.69,4.3,36.24,13.85,13.86,13.86,17.8,33.71,10.3,51.83-7.48,18.06-24.26,29.28-43.8,29.28ZM195.88,70.02h46.93c9.37,0,17.11-5.18,20.7-13.85,3.61-8.72,1.79-17.91-4.88-24.58-4.59-4.59-10.7-6.92-17.18-6.56-6.47.36-12.25,3.33-16.29,8.38l-29.29,36.61ZM180.79,68.87h0,0Z"
          />
        </svg>
      ),
      link: "/redeem",
    },
    {
      lable: "Prompt Share",
      icon: (
        <svg
          className="w-12 h-12"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 69.81 51.44"
        >
          <g>
            <g>
              <path
                fill="currentColor"
                d="M3.57,48.63l2.09-2.65c1.49,1.35,3.26,2.12,4.93,2.12,1.3,0,2-.42,2-1.23,0-.98-1.35-1.28-3.16-1.65-3.16-.65-5.26-1.93-5.26-4.89s2.33-4.68,5.96-4.68c2.4,0,5.1,1.07,6.45,2.56l-2.3,2.51c-1.19-1.07-2.86-1.75-4.38-1.75-1.21,0-1.86.4-1.86,1.14,0,.67.49.93,2.75,1.42,4.24.91,5.82,2.28,5.82,5.05,0,3.05-2.28,4.86-6.12,4.86-2.84,0-5.52-1.05-6.91-2.82Z"
              />
              <path
                fill="currentColor"
                d="M30.47,44.88v6.26h-3.82v-6.12c0-1.61-.79-2.49-2.23-2.49s-2.28.88-2.28,2.49v6.12h-3.82v-15.47h3.82v4.7c.77-.67,1.79-1.02,3.05-1.02,3.26,0,5.28,2.12,5.28,5.54Z"
              />
              <path
                fill="currentColor"
                d="M43.29,44.21v6.93h-3.61v-1.05c-.7.81-1.79,1.26-3.16,1.26-2.56,0-4.3-1.49-4.3-3.7s1.79-3.65,4.49-3.65c1.14,0,2.07.23,2.79.7v-.44c0-1.21-.84-1.91-2.23-1.91-1.02,0-2,.44-2.86,1.28l-1.95-2.26c1.19-1.23,3.21-2.02,5.21-2.02,3.49,0,5.63,1.86,5.63,4.86ZM39.5,47.56c0-.84-.74-1.42-1.86-1.42s-1.84.56-1.84,1.4.74,1.42,1.84,1.42,1.86-.58,1.86-1.4Z"
              />
              <path
                fill="currentColor"
                d="M53.39,39.65v3.75h-.67c-2.33,0-3.49,1.21-3.49,3.65v4.1h-3.79v-11.5h3.63v2.44c.84-1.54,2.21-2.44,3.82-2.44h.51Z"
              />
              <path
                fill="currentColor"
                d="M66.37,46.53h-8.59c.35,1.19,1.42,1.93,2.93,1.93,1,0,2.09-.35,3.21-1.05l1.7,2.37c-1.26,1.07-3,1.65-5.03,1.65-3.93,0-6.58-2.44-6.58-6.1s2.63-6,6.31-6,6.05,2.37,6.05,5.91v1.28ZM57.78,44.14h5.07c-.16-1.14-1.05-1.77-2.42-1.77s-2.33.65-2.65,1.77Z"
              />
            </g>
            <g>
              <path
                fill="currentColor"
                d="M12.69,3.86h2.39l-1.54,7.03c-.11.52-.54.82-1.17.82s-1.05-.28-1.2-.81l-1.33-4.43-1.34,4.43c-.16.52-.59.81-1.23.81s-1.05-.3-1.16-.82l-1.54-7.03h2.4l.72,4.06.92-3.28c.14-.52.59-.81,1.23-.81s1.06.28,1.2.81l.93,3.34.72-4.12Z"
              />
              <path
                fill="currentColor"
                d="M15.4,10.3l1.32-1.48c.71.65,1.74,1.07,2.6,1.07.64,0,.95-.18.95-.55s-.18-.47-1.15-.64c-2.22-.38-3.25-1.2-3.25-2.55,0-1.5,1.27-2.47,3.23-2.47,1.4,0,2.73.52,3.48,1.39l-1.29,1.34c-.62-.52-1.56-.89-2.29-.89-.51,0-.78.17-.78.51,0,.31.28.47,1.22.68,2.33.42,3.18,1.09,3.18,2.5,0,1.57-1.29,2.55-3.35,2.55-1.48,0-2.86-.51-3.86-1.46Z"
              />
              <path
                fill="currentColor"
                d="M18.71,2.9v-1.3h-.82V0h2.63v1.19h2.66v1.71h-4.47Z"
              />
              <path
                fill="currentColor"
                d="M31.79,7.69c0,2.41-1.68,4.06-4.13,4.06-2.57,0-4.07-1.63-4.07-3.99,0-.21.01-.51.03-.67h4.46v1.6h-2.21c.24.69.85,1.1,1.7,1.1,1.1,0,1.85-.83,1.85-2.08s-.74-2.08-1.85-2.08c-.78,0-1.37.28-1.85.89l-1.84-1.2c.93-1.07,2.26-1.65,3.76-1.65,2.49,0,4.16,1.61,4.16,4.02Z"
              />
              <path
                fill="currentColor"
                d="M38.42,3.86h2.36v4.51c0,2.15-1.1,3.38-3.04,3.38-1.17,0-2.05-.5-2.49-1.39v1.2h-2.23V3.86h2.36v4.33c0,.98.59,1.57,1.58,1.57.91,0,1.46-.55,1.46-1.47V3.86Z"
              />
              <path
                fill="currentColor"
                d="M42.61,11.57V3.86h2.36v7.71h-2.36ZM46.31,11.57V3.86h2.36v7.71h-2.36Z"
              />
              <path
                fill="currentColor"
                d="M57.58,8.22v.5c0,1.94-1.33,3.04-3.69,3.04s-3.71-1.1-3.71-2.98c0-.92.27-1.68,1.05-2.93.06-.1.13-.2.17-.3h-1.17v-1.68h3.61v.21c0,.45-.07.86-.23,1.3h.34c.75,0,1.22-.54,1.22-1.39v-.13h2.31v.13c0,.99-.48,1.73-1.3,2.11.92.28,1.41,1.02,1.41,2.12ZM55.23,8.2c0-.75-.57-1.16-1.61-1.16h-.81c-.2.48-.28.93-.28,1.4,0,.85.52,1.36,1.4,1.36.82,0,1.3-.47,1.3-1.26v-.34Z"
              />
              <path
                fill="currentColor"
                d="M58.24,10.3l1.32-1.48c.71.65,1.74,1.07,2.6,1.07.64,0,.95-.18.95-.55s-.18-.47-1.15-.64c-2.22-.38-3.25-1.2-3.25-2.55,0-1.5,1.27-2.47,3.23-2.47,1.4,0,2.73.52,3.48,1.39l-1.29,1.34c-.62-.52-1.56-.89-2.29-.89-.51,0-.78.17-.78.51,0,.31.28.47,1.22.68,2.33.42,3.18,1.09,3.18,2.5,0,1.57-1.29,2.55-3.35,2.55-1.48,0-2.86-.51-3.86-1.46Z"
              />
              <path
                fill="currentColor"
                d="M61.69,2.9v-.79c0-1.13.65-1.77,1.84-1.77h2.23v1.77h-1.37c-.37,0-.57.17-.57.48v.31h-2.14Z"
              />
            </g>
            <rect fill="currentColor" y="14.95" width="69.81" height="18.64" />
            <g>
              <path
                fill="white"
                d="M9.25,16.74c3.03,0,4.8,1.54,4.8,4.21s-1.77,4.21-4.8,4.21h-2.68v3.76h-2.01v-12.17h4.69ZM9.25,23.45c1.82,0,2.75-.84,2.75-2.49s-.93-2.49-2.75-2.49h-2.68v4.99h2.68Z"
              />
              <path
                fill="white"
                d="M21.1,19.72v1.79h-.6c-1.95,0-3.09,1.23-3.09,3.48v3.93h-1.9v-9.2h1.86v1.84c.69-1.23,1.82-1.84,3.13-1.84h.6Z"
              />
              <path
                fill="white"
                d="M21.57,24.3c0-2.79,2.12-4.82,5.01-4.82s4.97,2.03,4.97,4.82-2.1,4.86-4.97,4.86-5.01-2.05-5.01-4.86ZM29.57,24.3c0-1.81-1.27-3.11-3-3.11s-3.03,1.3-3.03,3.11,1.28,3.15,3.03,3.15,3-1.32,3-3.15Z"
              />
              <path
                fill="white"
                d="M47.44,23.56v5.36h-1.97v-5.36c0-1.53-.74-2.36-2.08-2.36-1.42,0-2.1.78-2.1,2.36v5.36h-1.95v-5.36c0-1.58-.69-2.36-2.1-2.36-1.34,0-2.08.84-2.08,2.36v5.36h-1.97v-5.36c0-2.61,1.4-4.08,3.87-4.08,1.53,0,2.7.69,3.26,1.88.58-1.19,1.77-1.88,3.28-1.88,2.48,0,3.87,1.47,3.87,4.08Z"
              />
              <path
                fill="white"
                d="M59.29,24.34c0,2.77-1.94,4.82-4.82,4.82-1.17,0-2.4-.52-3.15-1.34v4.26h-1.97v-7.56c0-3.03,1.97-5.04,4.99-5.04s4.95,2.07,4.95,4.86ZM57.32,24.34c0-1.84-1.27-3.15-2.98-3.15s-3.02,1.3-3.02,3.15,1.27,3.11,3.02,3.11,2.98-1.28,2.98-3.11Z"
              />
              <path
                fill="white"
                d="M65.99,27.17v1.66c-.61.2-1.15.3-1.71.3-2.07,0-3.22-1.29-3.22-3.54v-9.05h1.97v3.18h2.72v1.64h-2.72v4.39c0,1.1.52,1.68,1.55,1.68.43,0,.93-.09,1.41-.26Z"
              />
            </g>
          </g>
        </svg>
      ),
      link: "/prompt-share",
    },
    {
      lable: "ตารางอันดับ",
      icon: (
        <svg
          className="w-10 h-10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 371.11 357.77"
        >
          <path
            fill="currentColor"
            d="M243.24,357.77h-115.37c-6.9,0-12.5-5.6-12.5-12.5v-161.52c0-13.25,10.78-24.04,24.04-24.04h92.29c13.25,0,24.04,10.78,24.04,24.04v161.52c0,6.9-5.6,12.5-12.5,12.5ZM140.37,332.77h90.37v-148.05h-90.37v148.05Z"
          />
          <path
            fill="currentColor"
            d="M347.07,357.77h-103.83c-6.9,0-12.5-5.6-12.5-12.5v-55.76c0-13.25,10.78-24.04,24.04-24.04h92.3c13.25,0,24.04,10.78,24.04,24.04v44.22c0,13.25-10.78,24.04-24.04,24.04ZM255.74,332.77h90.37v-42.3h-90.37v42.3Z"
          />
          <path
            fill="currentColor"
            d="M127.87,357.77H24.04c-13.25,0-24.04-10.78-24.04-24.04v-82.68c0-13.25,10.78-24.04,24.04-24.04h92.29c13.25,0,24.04,10.78,24.04,24.04v94.22c0,6.9-5.6,12.5-12.5,12.5ZM25,332.77h90.37v-80.75H25v80.75Z"
          />
          <path
            fill="currentColor"
            d="M189.49,272.62c-6.9,0-12.5-5.6-12.5-12.5v-33.13h-4.81c-6.9,0-12.5-5.6-12.5-12.5s5.6-12.5,12.5-12.5h17.31c6.9,0,12.5,5.6,12.5,12.5v45.63c0,6.9-5.6,12.5-12.5,12.5Z"
          />
          <path
            fill="currentColor"
            d="M108.1,49.02l14.11,88.17c.82,5.13,5.25,8.91,10.45,8.91h105.8c5.2,0,9.63-3.78,10.45-8.91l14.11-88.17c1.46-9.14-8.74-15.63-16.4-10.42l-28.03,19.06-25.55-25.55c-4.13-4.13-10.83-4.13-14.96,0l-25.55,25.55-28.03-19.06c-7.65-5.21-17.86,1.28-16.4,10.42ZM147.86,80.08c4.2,2.86,9.84,2.32,13.43-1.27l24.26-24.26,24.26,24.26c3.59,3.59,9.23,4.12,13.43,1.27l15-10.2-8.81,55.06h-87.76l-8.81-55.06,15,10.2Z"
          />
          <path
            fill="currentColor"
            d="M238.46,146.64h-105.8c-5.5,0-10.12-3.94-10.99-9.37l-14.11-88.17c-.71-4.45,1.21-8.72,5.03-11.14,3.81-2.42,8.5-2.35,12.22.18l27.65,18.8,25.23-25.23c2.1-2.1,4.9-3.26,7.87-3.26s5.77,1.16,7.87,3.26l25.23,25.23,27.65-18.8c3.72-2.54,8.41-2.6,12.22-.18,3.81,2.42,5.74,6.69,5.03,11.14l-14.11,88.17c-.87,5.43-5.49,9.37-10.99,9.37ZM118.57,37.29c-1.86,0-3.72.53-5.4,1.6-3.44,2.18-5.17,6.03-4.53,10.04l14.11,88.17c.78,4.89,4.95,8.45,9.91,8.45h105.8c4.96,0,9.12-3.55,9.91-8.45l14.11-88.17c.64-4.01-1.1-7.86-4.53-10.04-3.44-2.18-7.66-2.12-11.01.16l-28.4,19.31-.32-.32-25.55-25.55c-3.91-3.91-10.28-3.91-14.19,0l-25.87,25.87-28.4-19.31c-1.72-1.17-3.67-1.76-5.62-1.76ZM229.9,125.48h-88.69l-.07-.46-9.01-56.31,16.05,10.91c3.97,2.7,9.33,2.2,12.74-1.2l24.65-24.65,24.65,24.65c3.4,3.4,8.76,3.91,12.73,1.2l16.05-10.91-9.08,56.77ZM142.14,124.39h86.82l8.54-53.34-13.95,9.48c-4.41,3-10.35,2.44-14.13-1.33l-23.87-23.87-23.87,23.87c-3.77,3.77-9.71,4.33-14.13,1.33l-13.95-9.49,8.54,53.34Z"
          />
          <path
            fill="currentColor"
            d="M185.55,19.3c5.33,0,9.65-4.32,9.65-9.65s-4.32-9.65-9.65-9.65-9.65,4.32-9.65,9.65,4.32,9.65,9.65,9.65Z"
          />
          <path
            fill="currentColor"
            d="M253.12,28.96c5.33,0,9.65-4.32,9.65-9.65s-4.32-9.65-9.65-9.65-9.65,4.32-9.65,9.65,4.32,9.65,9.65,9.65Z"
          />
          <path
            fill="currentColor"
            d="M117.99,28.96c5.33,0,9.65-4.32,9.65-9.65s-4.32-9.65-9.65-9.65-9.65,4.32-9.65,9.65,4.32,9.65,9.65,9.65Z"
          />
        </svg>
      ),
      link: "/leaderboard",
    },
    {
      lable: "อุณหภูมิความสุข",
      icon: (
        <svg
          className="w-11 h-11"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 287 320.2"
        >
          <path
            fill="currentColor"
            d="M44.2,257.6C17.5,230.9,2.7,195.3,2.7,157.6c0-78,63.5-141.5,141.5-141.5h0c37.8,0,73.3,14.7,100,41.4,26.7,26.7,41.4,62.2,41.4,100,0,24.2-6.2,48-18,69,3.2,12.1,6.5,24.2,9.7,36.3,2.1,8-.1,16.3-6,22.1-5.8,5.7-14.3,7.9-22.1,5.8-12-3.2-24-6.4-36.1-9.7-21,11.8-44.8,18-69,18h0c-37.8,0-73.3-14.7-100-41.4ZM211.3,254.5c1.1,0,2.2.1,3.3.4,12.2,3.3,24.5,6.6,36.7,9.8-3.3-12.2-6.6-24.5-9.8-36.7-.9-3.4-.4-7,1.5-10,11.1-18.1,17-39,17-60.4,0-30.9-12-60-33.9-81.9-21.9-21.9-51-33.9-81.9-33.9-63.9,0-115.8,52-115.8,115.8,0,30.9,12,60,33.9,81.9,21.9,21.9,51,33.9,81.9,33.9,21.4,0,42.3-5.9,60.5-17,2-1.2,4.4-1.9,6.7-1.9h0Z"
          />
          <path
            fill="currentColor"
            d="M182.8,139.5h0c-7.1,0-12.8-5.7-12.8-12.8s5.7-12.8,12.8-12.8,12.8,5.7,12.8,12.8-5.7,12.8-12.8,12.8Z"
          />
          <path
            fill="currentColor"
            d="M105.6,139.5h0c-7.1,0-12.8-5.7-12.8-12.8s5.7-12.8,12.8-12.8,12.8,5.7,12.8,12.8-5.7,12.8-12.8,12.8Z"
          />
          <path
            fill="currentColor"
            d="M144.2,221.8c-20.4,0-39.5-11-49.7-28.7-3.5-6.1-1.4-14,4.7-17.5,6.1-3.5,14-1.4,17.5,4.7,5.7,9.8,16.2,15.9,27.5,15.9s21.8-6.1,27.5-15.9c3.5-6.1,11.4-8.2,17.5-4.7,6.1,3.5,8.2,11.4,4.7,17.5-10.2,17.7-29.3,28.7-49.7,28.7Z"
          />
        </svg>
      ),
      link: "/pulsesurvey",
    },

    {
      lable: "Learn & Reflect 2025",
      icon: (
        <svg
          className="w-14 h-14 mb-[-6px]"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M11.9,13.4c-.3,0-.5.2-.5.5s.2.5.5.5.5-.2.5-.5-.2-.5-.5-.5ZM10.3,13.9c0-.9.7-1.6,1.6-1.6s1.6.7,1.6,1.6-.7,1.6-1.6,1.6-1.6-.7-1.6-1.6Z"
          />
          <path
            fill="currentColor"
            d="M6.5,13.4c-.3,0-.5.2-.5.5s.2.5.5.5.5-.2.5-.5-.2-.5-.5-.5ZM4.9,13.9c0-.9.7-1.6,1.6-1.6s1.6.7,1.6,1.6-.7,1.6-1.6,1.6-1.6-.7-1.6-1.6Z"
          />
          <path
            fill="currentColor"
            d="M7.6,4.7c-.5,0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9ZM5.6,5.6c0-1.1.9-2,2-2s2,.9,2,2-.9,2-2,2-2-.9-2-2Z"
          />
          <path
            fill="currentColor"
            d="M17.3,13.4c-.3,0-.5.2-.5.5s.2.5.5.5.5-.2.5-.5-.2-.5-.5-.5ZM15.6,13.9c0-.9.7-1.6,1.6-1.6s1.6.7,1.6,1.6-.7,1.6-1.6,1.6-1.6-.7-1.6-1.6Z"
          />
          <path
            fill="currentColor"
            d="M11.9,16.9c-.6,0-1.1.5-1.1,1.1s-.3.6-.6.6-.6-.3-.6-.6c0-1.2,1-2.2,2.2-2.2s2.2,1,2.2,2.2-.3.6-.6.6-.6-.3-.6-.6c0-.6-.5-1.1-1.1-1.1Z"
          />
          <path
            fill="currentColor"
            d="M6.5,16.9c-.6,0-1.1.5-1.1,1.1s-.3.6-.6.6-.6-.3-.6-.6c0-1.2,1-2.2,2.2-2.2s2.2,1,2.2,2.2-.3.6-.6.6-.6-.3-.6-.6c0-.6-.5-1.1-1.1-1.1Z"
          />
          <path
            fill="currentColor"
            d="M7.6,9c-.9,0-1.6.7-1.6,1.6s-.3.6-.6.6-.6-.3-.6-.6c0-1.5,1.2-2.7,2.7-2.7s2.7,1.2,2.7,2.7-.3.6-.6.6-.6-.3-.6-.6c0-.9-.7-1.6-1.6-1.6Z"
          />
          <path
            fill="currentColor"
            d="M17.3,16.9c-.6,0-1.1.5-1.1,1.1s-.3.6-.6.6-.6-.3-.6-.6c0-1.2,1-2.2,2.2-2.2s2.2,1,2.2,2.2-.3.6-.6.6-.6-.3-.6-.6c0-.6-.5-1.1-1.1-1.1Z"
          />
          <path
            fill="currentColor"
            d="M10.3,4.2c0-.3.3-.6.6-.6h6.6c1.2,0,2.1.9,2.1,2.1v3.4c0,1.2-.9,2.1-2.1,2.1h-5.3c-.3,0-.6-.3-.6-.6s.3-.6.6-.6h5.3c.5,0,.9-.4.9-.9v-3.4c0-.5-.4-.9-.9-.9h-6.6c-.3,0-.6-.3-.6-.6Z"
          />
          <path
            fill="currentColor"
            d="M14.6,6.1c0-.3.3-.6.6-.6h1.5c.3,0,.6.3.6.6s-.3.6-.6.6h-1.5c-.3,0-.6-.3-.6-.6Z"
          />
          <path
            fill="currentColor"
            d="M12.9,8.1c0-.3.3-.6.6-.6h3.3c.3,0,.6.3.6.6s-.3.6-.6.6h-3.3c-.3,0-.6-.3-.6-.6Z"
          />
        </svg>
      ),
      link: "/courses",
    },
    {
      lable: "แกลอรี่",
      icon: (
        <svg
          className="w-12 h-12"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 287 320.2"
        >
          <path
            fill="white"
            d="M252.2,106.2v105.1c5.3-1.4,9.2-6.2,9.2-11.9V64.1c0-6.8-5.6-12.3-12.3-12.3H73.6c-6.8,0-12.3,5.6-12.3,12.3v3.8h152.7c21.1,0,38.3,17.2,38.3,38.3Z"
          />
          <path
            fill="currentColor"
            d="M249.1,25.8H73.6c-21.1,0-38.3,17.2-38.3,38.3v3.9c1,0,2.1-.1,3.1-.1h22.9v-3.8c0-6.8,5.6-12.3,12.3-12.3h175.6c6.8,0,12.3,5.6,12.3,12.3v135.2c0,5.7-3.9,10.5-9.2,11.9v26.3c19.7-1.6,35.2-18.1,35.2-38.2V64.1c0-21.1-17.2-38.3-38.3-38.3Z"
          />
          <g>
            <path
              fill="currentColor"
              d="M172.5,157.5c15.7,0,28.4-12.8,28.4-28.4s-12.8-28.4-28.4-28.4-28.4,12.8-28.4,28.4,12.8,28.4,28.4,28.4ZM172.5,119.9c5.1,0,9.2,4.1,9.2,9.2s-4.1,9.2-9.2,9.2-9.2-4.1-9.2-9.2,4.1-9.2,9.2-9.2Z"
            />
            <path
              fill="currentColor"
              d="M184.1,174.5c-2.1-2.9-5.3-4.6-8.8-4.8-3.5-.2-6.9,1.2-9.3,3.8l-19.4,21.5-38.9-54.9c-2.3-3.2-6-5.1-9.7-4.9-3.8,0-7.4,2-9.5,5.2l-48.5,72.7c-3.6,5.4-2.1,12.6,3.2,16.2,5.4,3.6,12.6,2.1,16.2-3.2l39.1-58.6,37.5,53c2.1,2.9,5.3,4.7,8.8,4.9,3.6.2,7-1.2,9.3-3.8l19.5-21.6,19.5,27c2.2,3,5.7,4.8,9.5,4.8s4.8-.8,6.8-2.2c5.2-3.8,6.4-11.1,2.6-16.3l-27.9-38.7Z"
            />
            <path
              fill="currentColor"
              d="M213.9,67.9H38.3c-1,0-2.1,0-3.1.1C15.5,69.6,0,86.1,0,106.2v135.2c0,21.1,17.2,38.3,38.3,38.3h175.6c21.1,0,38.3-17.2,38.3-38.3V106.2c0-21.1-17.2-38.3-38.3-38.3ZM226.2,241.5c0,6.8-5.6,12.3-12.3,12.3H38.3c-6.8,0-12.3-5.6-12.3-12.3V106.2c0-5.7,3.9-10.5,9.2-11.9,1-.3,2-.4,3.1-.4h175.6c6.8,0,12.3,5.6,12.3,12.3v135.2Z"
            />
          </g>
        </svg>
      ),
      link: "/gallery",
    },
    {
      lable: "รวมลิงค์",
      icon: (
        <svg
          className="w-12 h-12"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 287 320.2"
        >
          <path
            fill="currentColor"
            d="M256.7,60.6h-123.5c-5.9-6.6-14.3-10.3-23.1-10.3H30.3c-17.1,0-30.9,13.8-30.9,30.9v164.7c0,17.1,13.8,30.9,30.9,30.9h226.5c17.1,0,30.9-13.8,30.9-30.9V91.5c0-17.1-13.8-30.9-30.9-30.9ZM263,133.7v106.8c0,7-5.7,12.7-12.7,12.7H36.7c-7,0-12.7-5.7-12.7-12.7V86.6c0-7,5.7-12.7,12.7-12.7h74.6c3.8,0,7.3,2.1,9,5.5l8.9,17.8c5.1,10.2,15.4,16.6,26.8,16.5h94.5c7,0,12.7,5.7,12.7,12.7v7.2ZM263,95.6c-3.2-1.2-6.6-1.8-10-1.8h-97.2c-3.8,0-7.3-2.1-9-5.5l-4.1-9.7h106.2c8.8,0,14,8.5,14,15.2v1.8Z"
          />
          <g>
            <path
              fill="currentColor"
              d="M137.6,193.1c-1.9,0-3.7-.7-5-2.1-10.6-10.6-10.6-28,0-38.6l14.3-14.3c5.1-5.1,12-8,19.3-8s14.2,2.8,19.3,8c10.6,10.6,10.6,28,0,38.6l-9.5,9.5c-1.3,1.3-3.1,2.1-5,2.1-1.9,0-3.7-.7-5-2.1-1.3-1.3-2.1-3.1-2.1-5s.7-3.7,2.1-5l9.5-9.5c5.1-5.1,5.1-13.4,0-18.5-2.5-2.5-5.7-3.8-9.2-3.8s-6.8,1.4-9.2,3.8l-14.3,14.3c-5.1,5.1-5.1,13.4,0,18.5,2.8,2.8,2.8,7.3,0,10.1-1.3,1.3-3.1,2.1-5,2.1h0Z"
            />
            <path
              fill="currentColor"
              d="M120.9,230.2c-7.3,0-14.2-2.8-19.3-8-10.6-10.6-10.6-28,0-38.6l7.1-7.1c1.3-1.3,3.1-2.1,5-2.1s3.7.7,5,2.1c1.3,1.3,2.1,3.1,2.1,5s-.7,3.7-2.1,5l-7.1,7.1c-5.1,5.1-5.1,13.4,0,18.5,2.5,2.5,5.7,3.8,9.2,3.8s6.8-1.4,9.2-3.8l14.3-14.3c5.1-5.1,5.1-13.4,0-18.5-1.3-1.3-2.1-3.1-2.1-5s.7-3.7,2.1-5c1.3-1.3,3.1-2.1,5-2.1s3.7.7,5,2.1c10.6,10.6,10.6,28,0,38.6l-14.3,14.3c-5.1,5.1-12,8-19.3,8h0Z"
            />
          </g>
        </svg>
      ),
      link: "link",
    },
    {
      lable: "Performance",
      icon: (
        <svg
          className="w-12 h-12"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 142.45 112.68"
        >
          <g id="Layer_1-2" data-name="Layer 1">
            <g>
              <g>
                <path
                  fill="currentColor"
                  d="M23.92,3.4c11.15,0,17.95,6.43,17.95,16.99,0,11.52-6.72,18.46-17.95,18.46h-10.49v12.85H.88V3.4h23.04ZM21.33,28.95c5.1,0,8.35-2.95,8.35-7.61s-3.18-7.61-8.35-7.61h-7.9v15.21h7.9Z"
                />
                <path
                  fill="currentColor"
                  d="M85.07,37.07h-27.25c1.11,3.77,4.5,6.13,9.31,6.13,3.18,0,6.65-1.11,10.19-3.32l5.39,7.53c-3.99,3.4-9.53,5.24-15.95,5.24-12.48,0-20.9-7.75-20.9-19.35s8.34-19.05,20.01-19.05,19.2,7.53,19.2,18.76v4.06ZM57.82,29.47h16.1c-.52-3.62-3.32-5.61-7.68-5.61s-7.38,2.07-8.42,5.61Z"
                />
                <path
                  fill="currentColor"
                  d="M115.35,15.21v11.89h-2.14c-7.38,0-11.08,3.84-11.08,11.59v13h-12.04V15.21h11.52v7.75c2.66-4.87,7.02-7.75,12.11-7.75h1.62Z"
                />
                <path
                  fill="currentColor"
                  d="M138.54,9.6c-4.87,0-6.57,1.33-6.57,4.65v.96h9.9v9.67h-9.9v26.81h-12.11V14.55c0-9.97,5.17-14.55,16.84-14.55h5.69v9.6h-3.84Z"
                />
              </g>
              <g>
                <path
                  fill="currentColor"
                  d="M42.24,96.39c0,9.66-8.84,16.29-21.61,16.29-8.68,0-16.78-3.85-20.63-9.74l8.43-7.53c3.19,3.93,7.37,6.06,11.95,6.06,4.91,0,7.94-2.29,7.94-5.98s-3.27-5.89-9.09-5.89h-6.71v-10.23h6.71c4.42,0,6.96-2.13,6.96-5.73,0-3.27-2.62-5.32-6.88-5.32s-7.45,1.56-10.23,4.83l-8.35-6.63c4.17-6.14,11.05-9.41,19.73-9.41,11.62,0,19.65,5.98,19.65,14.65,0,4.67-2.29,8.6-6.39,11.3,5.48,2.62,8.51,7.29,8.51,13.34Z"
                />
                <path
                  fill="currentColor"
                  d="M91.44,93.11c0,11.38-9.41,19.57-22.43,19.57s-22.84-8.27-22.84-19.65c0-5.48,2.37-11.71,6.22-16.86l13.67-18.09h16.37l-12.77,16.29h1.23c11.87,0,20.55,7.86,20.55,18.75ZM78.02,93.28c0-4.75-3.85-8.19-9.25-8.19s-8.92,3.44-8.92,8.19,3.68,8.27,8.92,8.27,9.25-3.44,9.25-8.27Z"
                />
                <path
                  fill="currentColor"
                  d="M96.11,92.38v-14.98c0-12.03,9.41-20.38,23.17-20.38s23.17,8.35,23.17,20.38v14.98c0,12.03-9.41,20.3-23.17,20.3s-23.17-8.27-23.17-20.3ZM128.7,91.8v-13.92c0-5.48-3.77-9.17-9.41-9.17s-9.42,3.68-9.42,9.17v13.92c0,5.48,3.77,9.17,9.42,9.17s9.41-3.68,9.41-9.17Z"
                />
              </g>
            </g>
          </g>
        </svg>
      ),
      link: "/perf360",
    },
  ];

  const handleLinkClick = () => {
    setLinkModal(true);
  };

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    variableWidth: false,
    centerPadding: 0,
    accessibility: true,
    autoplay: true,
    autoplaySpeed: 8000,
    arrows: false,
    dots: true,
    lazyLoad: "ondemand",
  };

  // Chunk the menu into pages of 6 items (3 columns x 2 rows)
  const chunkedMenu = [];
  for (let i = 0; i < menu.length; i += 6) {
    chunkedMenu.push(menu.slice(i, i + 6));
  }

  return (
    <div className="flex flex-col w-full pb-2">
      <Slider {...settings} className={styles.slider}>
        {chunkedMenu.map((menuPage, pageIndex) => (
          <div key={pageIndex}>
            <div className="grid grid-cols-3 gap-6 px-4">
              {menuPage.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-evenly p-1 border-[4px] border-[#0056FF] rounded-xl cursor-pointer w-[100px] h-[100px]"
                  onClick={
                    item.link === "link"
                      ? () => handleLinkClick(item.link)
                      : () => router.push(item.link)
                  }
                >
                  <div className=" text-[#F68B1F]">{item.icon}</div>
                  <span className="text-xs font-bold text-center text-[#0056FF] mt-1">
                    {item.lable}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
