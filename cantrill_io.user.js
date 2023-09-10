// ==UserScript==
// @name        New script - cantrill.io
// @namespace   Violentmonkey Scripts
// @match       https://learn.cantrill.io/courses/enrolled/*
// @match       https://learn.cantrill.io/courses/*/lectures/*
// @grant       none
// @version     1.0
// @author      -
// @description 7/15/2023, 4:06:53 PM
// ==/UserScript==

const addInfoToTiles = (courseSection) => {
    const sectionTitleElement =
      courseSection.querySelectorAll("div.section-title")[0];
    const sectionTitle = sectionTitleElement.innerText;
  
    const lectures = [...courseSection.querySelectorAll("span.lecture-name")].map(
      (lecture) => ({
        lectureName: lecture.innerText,
        completed:
          lecture.parentElement.parentElement.parentElement.classList.contains(
            "completed"
          ),
        isQuiz: lecture.innerText.includes("Section Quiz"),
      })
    );
  
    const lectureCount = lectures.filter((lecture) => !lecture.isQuiz).length;
    const lectureHasQuiz =
      lectures.filter((lecture) => lecture.isQuiz).length != 0;
    const totalTimeInSeconds = lectures.reduce(reduceToSeconds, 0);
    const remainingTimeInSeconds = lectures
      .filter((lecture) => !lecture.isQuiz)
      .filter((lecture) => !lecture.completed)
      .reduce(reduceToSeconds, 0);
  
    sectionTitleElement.innerText = [
      sectionTitle,
      `Total Section Time: ${formatTime(totalTimeInSeconds)}`,
      `Remaining Section Time: ${formatTime(remainingTimeInSeconds)}`,
      `Lectures: ${lectureCount}`,
      `Quiz: ${lectureHasQuiz ? "Yes" : "No"}`,
    ].join("\n");
  };
  
  const reduceToSeconds = (totalSeconds, { lectureName }) => {
    const timeRegex = /\(\s*\d+:\d+\s*\)$/gm;
    const match = lectureName.match(timeRegex);
    if (match) {
      const time = match[0].replace(/[\(\)\s]/g, "");
      const [minutes, seconds] = time.split(":").map(Number);
      return totalSeconds + minutes * 60 + seconds;
    } else return totalSeconds;
  };
  
  const formatTime = (timeInSeconds) =>
    [
      String(Math.floor(timeInSeconds / 3600)).padStart(2, "0"), // Hours
      String(Math.floor((timeInSeconds % 3600) / 60)).padStart(2, "0"), // Min
      String(timeInSeconds % 60).padStart(2, "0"), // Sec
    ].join(":");
  
  const courseSections = [...document.getElementsByClassName("course-section")];
  if (courseSections.length > 0) {
    courseSections.forEach((courseSection) => {
      addInfoToTiles(courseSection);
    });
  }
  
  const hasEventListener = (element, eventType, eventListener) => {
    const events = getEventListeners(element);
    const listeners = events[eventType];
  
    return (
      listeners &&
      listeners.some((listener) => listener.listener === eventListener)
    );
  };
  
  const courseSectionWatcher = (event) => {
    event.target.parentElement
  };
  
  const leftHeader = document.getElementsByClassName("lecture-left")[0];
  if (leftHeader) {
    const btnLectureListToggle = document.createElement("button");
    btnLectureListToggle.textContent = "Hide Course List";
  
    leftHeader.insertBefore(
      btnLectureListToggle,
      leftHeader.children[0].nextSibling
    );
  
    btnLectureListToggle.addEventListener("click", () => {
      const courseSidebar = document.getElementsByClassName("course-sidebar")[0];
      if (courseSidebar.style.display === "none") {
        courseSidebar.style.display = "block";
        btnLectureListToggle.textContent = "Hide Course List";
      } else {
        courseSidebar.style.display = "none";
        btnLectureListToggle.textContent = "Show Course List";
      }
    });
  }
  